import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { gql, CombinedGraphQLErrors, ServerError } from '@apollo/client';
import client from '@/apollo-client';
import { createDebugger } from '@/utils/debug';

import {
  MachinesDocument,
  CreateMachineDocument,
  PowerOnDocument,
  PowerOffDocument,
  SuspendDocument,
  MoveMachineDocument,
  DestroyMachineDocument,
} from '@/gql/hooks';

const debug = createDebugger('vms-slice');

// Keys whose values must never be written to the console / debug panel.
const SENSITIVE_KEYS = new Set([
  'password', 'confirmPassword', 'newPassword', 'currentPassword', 'oldPassword',
  'bindPassword', 'productKey', 'token', 'accessToken', 'refreshToken', 'secret'
]);

// Deep-clone GraphQL variables with sensitive fields redacted so we can log the
// SHAPE of a mutation/query without leaking VM admin or account credentials.
const sanitizeVariables = (value) => {
  if (Array.isArray(value)) return value.map(sanitizeVariables);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, SENSITIVE_KEYS.has(k) ? '[REDACTED]' : sanitizeVariables(v)])
    );
  }
  return value;
};

// Categorize an Apollo Client 4 error into a friendly Error. v4 removed
// ApolloError: GraphQL errors arrive as CombinedGraphQLErrors (errors live on
// `err.errors`) and transport/HTTP failures as ServerError (carrying a numeric
// `statusCode`). The old `.networkError` / `.graphQLErrors` / name==='ApolloError'
// shapes no longer exist. Mirrors the idiom in src/apollo-client.js.
const categorizeGraphQLError = (error) => {
  // Transport / HTTP failure (non-2xx with a numeric statusCode).
  if (ServerError.is(error)) {
    return new Error(`Network error: Unable to connect to the backend server. Please check your connection.`);
  }

  // A raw fetch rejection (connection refused / DNS / abort) carries no
  // statusCode; fall back to matching the message.
  if (typeof error?.message === 'string' && error.message.includes('fetch')) {
    return new Error(`Connection error: Failed to reach the backend server. Please verify the server is running.`);
  }

  // GraphQL errors are wrapped in CombinedGraphQLErrors; individual errors are
  // on `error.errors`.
  if (CombinedGraphQLErrors.is(error) && error.errors?.length > 0) {
    const graphqlErrorMessages = error.errors.map(err => err.message).join(', ');
    return new Error(`GraphQL error: ${graphqlErrorMessages}`);
  }

  // Already a plain Error (e.g. our own thrown payload error) — pass through.
  return error instanceof Error ? error : new Error(String(error?.message || error || 'Unknown error'));
};

const executeGraphQLMutation = async (mutation, variables) => {
  try {
    debug.log('mutation', 'Executing GraphQL mutation', { mutation: mutation.loc?.source?.body, variables: sanitizeVariables(variables) });
    const response = await client.mutate({ mutation, variables });
    debug.log('mutation', 'GraphQL mutation response', response);

    // Apollo Client 4: client.mutate resolves with a SINGULAR `error` (there is
    // no plural `errors`). With the default errorPolicy a failing mutation throws
    // a CombinedGraphQLErrors instead (handled in catch), but honour a surfaced
    // `error` too when errorPolicy:'all' is in play.
    if (response.error) {
      throw response.error;
    }

    // Check for domain-level errors embedded in the mutation payload itself.
    const firstKey = Object.keys(response.data || {})[0];
    if (response.data?.[firstKey]?.errors) {
      const errorMessage = response.data[firstKey].errors.map(err => err.message).join(', ');
      throw new Error(errorMessage);
    }

    return response.data;
  } catch (error) {
    debug.error('mutation', 'GraphQL mutation error', error);
    throw categorizeGraphQLError(error);
  }
};


const withBackoff = async (fn, { retries=3, base=500 }={}) => {
  let attempt=0; let lastErr;
  while (attempt<=retries){
    try { return await fn(); } catch(e){ lastErr=e; if(attempt===retries) throw e; await new Promise(r=>setTimeout(r, base*Math.pow(2,attempt))); attempt++; }
  }
};

const executeGraphQLQuery = async (query, variables = {}) => {
  debug.log('graphql', 'Executing GraphQL query:', query.definitions[0]?.name?.value, sanitizeVariables(variables));
  try {
    const response = await client.query({
      query,
      variables,
      fetchPolicy: 'network-only' // Force network request
    });

    // Apollo Client 4: client.query resolves with a SINGULAR `error` (no plural
    // `errors`). With errorPolicy:'all' (the client default) a failing query does
    // NOT throw — the error is surfaced here while `data` may be null or partial.
    // Surface it as a real error instead of crashing on Object.keys(null) below
    // or silently returning empty data (e.g. fetchVms's `data.machines || []`).
    if (response.error) {
      throw response.error;
    }

    if (!response.data) {
      throw new Error('No data returned from the server.');
    }

    // Check for domain-level errors embedded in the payload itself.
    const firstKey = Object.keys(response.data)[0];
    if (response.data[firstKey]?.errors) {
      const errorMessage = response.data[firstKey].errors.map(err => err.message).join(', ');
      throw new Error(errorMessage);
    }

    return response.data;
  } catch (error) {
    debug.error('graphql', 'GraphQL query error:', error);
    throw categorizeGraphQLError(error);
  }
};

export const fetchVms = createAsyncThunk(
  'vms/fetchVms',
  async (_, { rejectWithValue, getState }) => {
    try {
      debug.log('fetch', 'Starting VMs fetch operation');
      const data = await withBackoff(() => executeGraphQLQuery(MachinesDocument));
      debug.success('fetch', `Successfully fetched ${data.machines?.length || 0} VMs`);
      return data.machines || [];
    } catch (error) {
      debug.error('fetch', 'VMs fetch failed:', error.message);

      // Add connection status tracking
      const connectionStatus = {
        isNetworkError: error.message.includes('Network error') || error.message.includes('Connection error'),
        timestamp: Date.now(),
        errorType: error.name || 'Unknown'
      };

      return rejectWithValue({
        message: error.message,
        connectionStatus
      });
    }
  },
  {
    condition: (_, { getState }) => {
      const { vms } = getState();
      // Don't fetch if we're already fetching
      if (vms.loading.fetch) {
        debug.warn('fetch', 'Skipping fetch - already in progress');
        return false;
      }
      return true;
    }
  }
);

export const deleteVm = createAsyncThunk(
  'vms/deleteVm',
  async (payload, { rejectWithValue }) => {
    try {
      await executeGraphQLMutation(DestroyMachineDocument, { id: payload.id });
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createVm = createAsyncThunk(
  'vms/createVm',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await executeGraphQLMutation(CreateMachineDocument, { input: payload });
      return data.createMachine;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const playVm = createAsyncThunk(
  'vms/playVm',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await executeGraphQLMutation(PowerOnDocument, { id: payload.id });
      // powerOn resolves { success, message } (SuccessType) with HTTP 200 even on
      // failure — treat success:false as an error so the optimistic 'running'
      // status is never forced into the store.
      if (data?.powerOn && data.powerOn.success === false) {
        return rejectWithValue(data.powerOn.message || 'Failed to start VM');
      }
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const pauseVm = createAsyncThunk(
  'vms/pauseVm',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await executeGraphQLMutation(SuspendDocument, { id: payload.id });
      if (data?.suspend && data.suspend.success === false) {
        return rejectWithValue(data.suspend.message || 'Failed to pause VM');
      }
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const stopVm = createAsyncThunk(
  'vms/stopVm',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await executeGraphQLMutation(PowerOffDocument, { id: payload.id });
      if (data?.powerOff && data.powerOff.success === false) {
        return rejectWithValue(data.powerOff.message || 'Failed to stop VM');
      }
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const moveMachine = createAsyncThunk(
  'vms/moveMachine',
  async ({ id, departmentId }, { dispatch, rejectWithValue }) => {
    try {
      await executeGraphQLMutation(MoveMachineDocument, {
        id,
        departmentId,
      });
      await dispatch(fetchVms());
      return { id, departmentId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  lastUpdated: null,
  selectedMachine: null,
  connectionStatus: {
    isConnected: true,
    lastError: null,
    lastSuccessfulFetch: null,
    retryCount: 0
  },
  // Track pending actions per VM: { [vmId]: 'play' | 'pause' | 'stop' | 'delete' }
  pendingActions: {},
  loading: {
    fetch: false,
    create: false,
    delete: false,
    play: false,
    pause: false,
    stop: false,
    move: false
  },
  error: {
    fetch: null,
    create: null,
    delete: null,
    play: null,
    pause: null,
    stop: null,
    move: null
  }
};

const vmsSlice = createSlice({
  name: 'vms',
  initialState,
  reducers: {
    selectMachine: (state, action) => {
      state.selectedMachine = action.payload;
    },
    deselectMachine: (state) => {
      state.selectedMachine = null;
    },
    clearErrors: (state) => {
      Object.keys(state.error).forEach(key => {
        state.error[key] = null;
      });
    },
    // Real-time event handlers
    realTimeVmCreated: (state, action) => {
      const newVm = action.payload;
      // Check if VM already exists to avoid duplicates
      const existingIndex = state.items.findIndex(vm => vm.id === newVm.id);
      if (existingIndex === -1) {
        state.items.push(newVm);
        debug.success('realtime', 'VM created', newVm.name);
      }
    },
    realTimeVmUpdated: (state, action) => {
      const updatedVm = action.payload;
      const index = state.items.findIndex(vm => vm.id === updatedVm.id);
      if (index !== -1) {
        // MERGE, never full-replace: the backend health paths dispatch
        // 'vms','update' with PARTIAL objects (e.g. { id, healthCheckStarted }),
        // so overwriting the whole row would blank out name/status/etc. Merging
        // preserves the existing fields and applies only what changed.
        state.items[index] = { ...state.items[index], ...updatedVm };
        debug.success('realtime', 'VM updated', state.items[index].name);

        // Clear pending action when real-time update arrives
        delete state.pendingActions[updatedVm.id];

        // Update selected machine if it's the one being updated
        if (state.selectedMachine?.id === updatedVm.id) {
          state.selectedMachine = { ...state.selectedMachine, ...updatedVm };
        }
      }
    },
    realTimeVmDeleted: (state, action) => {
      const deletedVm = action.payload;
      const vmId = deletedVm.id || deletedVm;
      state.items = state.items.filter(vm => vm.id !== vmId);
      debug.success('realtime', 'VM deleted', vmId);

      // Clear pending action when VM is deleted
      delete state.pendingActions[vmId];

      // Clear selected machine if it was deleted
      if (state.selectedMachine?.id === vmId) {
        state.selectedMachine = null;
      }
    },
    realTimeVmStatusChanged: (state, action) => {
      const { id, action: statusAction, ...vmData } = action.payload;
      const index = state.items.findIndex(vm => vm.id === id);
      if (index !== -1) {
        // Update the VM with new data, especially status
        state.items[index] = { ...state.items[index], ...vmData };
        debug.success('realtime', `VM ${statusAction}`, state.items[index].name);

        // Clear pending action when real-time status change arrives
        delete state.pendingActions[id];

        // Update selected machine if it's the one being updated
        if (state.selectedMachine?.id === id) {
          state.selectedMachine = { ...state.selectedMachine, ...vmData };
        }
      }
    },
    realTimeDepartmentNameUpdated: (state, action) => {
      const { departmentId, newName } = action.payload;
      // Update all VMs that belong to this department
      state.items.forEach((vm, index) => {
        if (vm.department?.id === departmentId) {
          state.items[index] = {
            ...vm,
            department: {
              ...vm.department,
              name: newName
            }
          };
        }
      });
      debug.success('realtime', `Updated department name in VMs to: ${newName}`);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch VMs
      .addCase(fetchVms.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchVms.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.items = action.payload;
        state.lastUpdated = Date.now();
        state.connectionStatus.isConnected = true;
        state.connectionStatus.lastSuccessfulFetch = Date.now();
        state.connectionStatus.retryCount = 0;
        state.error.fetch = null;
      })
      .addCase(fetchVms.rejected, (state, action) => {
        state.loading.fetch = false;

        // Handle both old string format and new object format
        const errorData = action.payload;
        const errorMessage = typeof errorData === 'string' ? errorData : errorData?.message || 'Failed to fetch VMs';
        const connectionStatus = typeof errorData === 'object' ? errorData?.connectionStatus : null;

        state.error.fetch = errorMessage;
        // Do NOT clear items on a failed (re)fetch: a transient background
        // revalidation error would otherwise wipe the already-rendered list and
        // flip consuming pages to the first-run "No desktops yet" empty state.
        // Keep the last successful payload and surface the error alongside it via
        // connectionStatus below.

        // Update connection status if available
        if (connectionStatus) {
          state.connectionStatus.isConnected = !connectionStatus.isNetworkError;
          state.connectionStatus.lastError = connectionStatus.timestamp;
          state.connectionStatus.retryCount += 1;
        } else {
          // Fallback for old error format
          const isNetworkError = errorMessage.includes('Network error') || errorMessage.includes('Connection error');
          state.connectionStatus.isConnected = !isNetworkError;
          state.connectionStatus.lastError = Date.now();
          state.connectionStatus.retryCount += 1;
        }
      })

      // Create VM
      .addCase(createVm.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createVm.fulfilled, (state, action) => {
        state.loading.create = false;
        // Optimistically add the new VM by id so the list updates even if the
        // real-time socket is down. Idempotent with realTimeVmCreated: if the
        // event later arrives it will find the VM already present and skip it.
        const newVm = action.payload;
        if (newVm && newVm.id) {
          const existingIndex = state.items.findIndex((vm) => vm.id === newVm.id);
          if (existingIndex === -1) {
            state.items.push(newVm);
          } else {
            state.items[existingIndex] = newVm;
          }
        }
      })
      .addCase(createVm.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload || 'Failed to create VM';
      })

      // Delete VM
      .addCase(deleteVm.pending, (state, action) => {
        state.loading.delete = true;
        state.error.delete = null;
        state.pendingActions[action.meta.arg.id] = 'delete';
      })
      .addCase(deleteVm.fulfilled, (state, action) => {
        state.loading.delete = false;
        delete state.pendingActions[action.payload.id];
        state.items = state.items.filter((vm) => vm.id !== action.payload.id);
      })
      .addCase(deleteVm.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload || 'Failed to delete VM';
        delete state.pendingActions[action.meta.arg.id];
      })

      // Play VM
      .addCase(playVm.pending, (state, action) => {
        state.loading.play = true;
        state.error.play = null;
        state.pendingActions[action.meta.arg.id] = 'play';
      })
      .addCase(playVm.fulfilled, (state, action) => {
        state.loading.play = false;
        delete state.pendingActions[action.payload.id];
        const index = state.items.findIndex((vm) => vm.id === action.payload.id);
        if (index !== -1) {
          state.items[index].status = "running";
        }
      })
      .addCase(playVm.rejected, (state, action) => {
        state.loading.play = false;
        state.error.play = action.payload || 'Failed to start VM';
        delete state.pendingActions[action.meta.arg.id];
      })

      // Pause VM
      .addCase(pauseVm.pending, (state, action) => {
        state.loading.pause = true;
        state.error.pause = null;
        state.pendingActions[action.meta.arg.id] = 'pause';
      })
      .addCase(pauseVm.fulfilled, (state, action) => {
        state.loading.pause = false;
        delete state.pendingActions[action.payload.id];
        const index = state.items.findIndex((vm) => vm.id === action.payload.id);
        if (index !== -1) {
          state.items[index].status = "suspended";
        }
      })
      .addCase(pauseVm.rejected, (state, action) => {
        state.loading.pause = false;
        state.error.pause = action.payload || 'Failed to pause VM';
        delete state.pendingActions[action.meta.arg.id];
      })

      // Stop VM
      .addCase(stopVm.pending, (state, action) => {
        state.loading.stop = true;
        state.error.stop = null;
        state.pendingActions[action.meta.arg.id] = 'stop';
      })
      .addCase(stopVm.fulfilled, (state, action) => {
        state.loading.stop = false;
        delete state.pendingActions[action.payload.id];
        const index = state.items.findIndex((vm) => vm.id === action.payload.id);
        if (index !== -1) {
          state.items[index].status = "off";
        }
      })
      .addCase(stopVm.rejected, (state, action) => {
        state.loading.stop = false;
        state.error.stop = action.payload || 'Failed to stop VM';
        delete state.pendingActions[action.meta.arg.id];
      })

      // Move Machine
      .addCase(moveMachine.pending, (state, action) => {
        state.loading.move = true;
        state.error.move = null;
      })
      .addCase(moveMachine.fulfilled, (state, action) => {
        state.loading.move = false;
      })
      .addCase(moveMachine.rejected, (state, action) => {
        state.loading.move = false;
        state.error.move = action.payload;
      });
  },
});

export default vmsSlice.reducer;
export const {
  selectMachine,
  deselectMachine,
  clearErrors,
  realTimeVmCreated,
  realTimeVmUpdated,
  realTimeVmDeleted,
  realTimeVmStatusChanged,
  realTimeDepartmentNameUpdated
} = vmsSlice.actions;

// Selectors
export const selectVmsState = (state) => state.vms;
export const selectVmsLoading = (state) => state.vms.loading;
export const selectVmsError = (state) => state.vms.error;