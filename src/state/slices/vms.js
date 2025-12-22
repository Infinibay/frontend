import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { gql } from '@apollo/client';
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

const executeGraphQLMutation = async (mutation, variables) => {
  try {
    debug.log('mutation', 'Executing GraphQL mutation', { mutation: mutation.loc?.source?.body, variables });
    const response = await client.mutate({ mutation, variables });
    debug.log('mutation', 'GraphQL mutation response', response);

    // Check for GraphQL errors in the response
    if (response.errors) {
      const errorMessage = response.errors.map(err => err.message).join(', ');
      throw new Error(errorMessage);
    }

    // Check for errors in the data response
    const firstKey = Object.keys(response.data)[0];
    if (response.data[firstKey]?.errors) {
      const errorMessage = response.data[firstKey].errors.map(err => err.message).join(', ');
      throw new Error(errorMessage);
    }

    return response.data;
  } catch (error) {
    debug.error('mutation', 'GraphQL mutation error', error);
    console.error('GraphQL mutation error:', error);

    // Enhanced error categorization for mutations
    if (error.networkError) {
      throw new Error(`Network error: Unable to connect to the backend server. Please check your connection.`);
    }

    if (error.message.includes('fetch')) {
      throw new Error(`Connection error: Failed to reach the backend server. Please verify the server is running.`);
    }

    if (error.name === 'ApolloError' && error.graphQLErrors?.length > 0) {
      const graphqlErrorMessages = error.graphQLErrors.map(err => err.message).join(', ');
      throw new Error(`GraphQL error: ${graphqlErrorMessages}`);
    }

    throw error;
  }
};


const withBackoff = async (fn, { retries=3, base=500 }={}) => {
  let attempt=0; let lastErr;
  while (attempt<=retries){
    try { return await fn(); } catch(e){ lastErr=e; if(attempt===retries) throw e; await new Promise(r=>setTimeout(r, base*Math.pow(2,attempt))); attempt++; }
  }
};

const executeGraphQLQuery = async (query, variables = {}) => {
  debug.log('graphql', 'Executing GraphQL query:', query.definitions[0]?.name?.value, variables);
  try {
    const response = await client.query({
      query,
      variables,
      fetchPolicy: 'network-only' // Force network request
    });

    // Check for GraphQL errors in the response
    if (response.errors) {
      const errorMessage = response.errors.map(err => err.message).join(', ');
      throw new Error(errorMessage);
    }

    // Check for errors in the data response
    const firstKey = Object.keys(response.data)[0];
    if (response.data[firstKey]?.errors) {
      const errorMessage = response.data[firstKey].errors.map(err => err.message).join(', ');
      throw new Error(errorMessage);
    }

    return response.data;
  } catch (error) {
    debug.error('graphql', 'GraphQL query error:', error);

    // Enhanced error categorization
    if (error.networkError) {
      throw new Error(`Network error: Unable to connect to the backend server. Please check your connection.`);
    }

    if (error.message.includes('fetch')) {
      throw new Error(`Connection error: Failed to reach the backend server. Please verify the server is running.`);
    }

    if (error.name === 'ApolloError' && error.graphQLErrors?.length > 0) {
      const graphqlErrorMessages = error.graphQLErrors.map(err => err.message).join(', ');
      throw new Error(`GraphQL error: ${graphqlErrorMessages}`);
    }

    throw error;
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
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await executeGraphQLMutation(DestroyMachineDocument, { id: payload.id });
      await dispatch(fetchVms());
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
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await executeGraphQLMutation(PowerOnDocument, { id: payload.id });
      await dispatch(fetchVms());
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const pauseVm = createAsyncThunk(
  'vms/pauseVm',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await executeGraphQLMutation(SuspendDocument, { id: payload.id });
      await dispatch(fetchVms());
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const stopVm = createAsyncThunk(
  'vms/stopVm',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await executeGraphQLMutation(PowerOffDocument, { id: payload.id });
      await dispatch(fetchVms());
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
  selectedMachine: null,
  connectionStatus: {
    isConnected: true,
    lastError: null,
    lastSuccessfulFetch: null,
    retryCount: 0
  },
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
        state.items[index] = updatedVm;
        debug.success('realtime', 'VM updated', updatedVm.name);

        // Update selected machine if it's the one being updated
        if (state.selectedMachine?.id === updatedVm.id) {
          state.selectedMachine = updatedVm;
        }
      }
    },
    realTimeVmDeleted: (state, action) => {
      const deletedVm = action.payload;
      const vmId = deletedVm.id || deletedVm;
      state.items = state.items.filter(vm => vm.id !== vmId);
      debug.success('realtime', 'VM deleted', vmId);

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
        state.items = []; // Set empty array on error to prevent undefined

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
        // Don't add the VM here - it will be added via real-time event
        // This prevents duplicates when the real-time event arrives
      })
      .addCase(createVm.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload || 'Failed to create VM';
      })

      // Delete VM
      .addCase(deleteVm.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteVm.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.items = state.items.filter((vm) => vm.id !== action.payload.id);
      })
      .addCase(deleteVm.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload || 'Failed to delete VM';
      })

      // Play VM
      .addCase(playVm.pending, (state) => {
        state.loading.play = true;
        state.error.play = null;
      })
      .addCase(playVm.fulfilled, (state, action) => {
        state.loading.play = false;
        const index = state.items.findIndex((vm) => vm.id === action.payload.id);
        if (index !== -1) {
          state.items[index].status = "running";
        }
      })
      .addCase(playVm.rejected, (state, action) => {
        state.loading.play = false;
        state.error.play = action.payload || 'Failed to start VM';
      })

      // Pause VM
      .addCase(pauseVm.pending, (state) => {
        state.loading.pause = true;
        state.error.pause = null;
      })
      .addCase(pauseVm.fulfilled, (state, action) => {
        state.loading.pause = false;
        const index = state.items.findIndex((vm) => vm.id === action.payload.id);
        if (index !== -1) {
          state.items[index].status = "suspended";
        }
      })
      .addCase(pauseVm.rejected, (state, action) => {
        state.loading.pause = false;
        state.error.pause = action.payload || 'Failed to pause VM';
      })

      // Stop VM
      .addCase(stopVm.pending, (state) => {
        state.loading.stop = true;
        state.error.stop = null;
      })
      .addCase(stopVm.fulfilled, (state, action) => {
        state.loading.stop = false;
        const index = state.items.findIndex((vm) => vm.id === action.payload.id);
        if (index !== -1) {
          state.items[index].status = "off";
        }
      })
      .addCase(stopVm.rejected, (state, action) => {
        state.loading.stop = false;
        state.error.stop = action.payload || 'Failed to stop VM';
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