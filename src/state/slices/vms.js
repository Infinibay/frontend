import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';
import { MACHINES_QUERY } from '@/graphql/queries';
import { 
  CREATE_MACHINE_MUTATION,
  DELETE_MACHINE_MUTATION,
  POWER_OFF_MUTATION,
  POWER_ON_MUTATION,
  SUSPEND_MUTATION,
  MOVE_MACHINE_MUTATION
} from '@/graphql/mutations';

const executeGraphQLMutation = async (mutation, variables) => {
  try {
    const response = await client.mutate({ mutation, variables });
    
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
    console.error('GraphQL mutation error:', error);
    throw error;
  }
};

const executeGraphQLQuery = async (query, variables = {}) => {
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
    console.error('GraphQL query error:', error);
    throw error;
  }
};

export const fetchVms = createAsyncThunk(
  'vms/fetchVms',
  async (_, { rejectWithValue }) => {
    try {
      const data = await executeGraphQLQuery(MACHINES_QUERY);
      return data.machines || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { vms } = getState();
      // Don't fetch if we're already fetching
      if (vms.loading.fetch) {
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
      await executeGraphQLMutation(DELETE_MACHINE_MUTATION, { id: payload.id });
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
      const data = await executeGraphQLMutation(CREATE_MACHINE_MUTATION, { input: payload });
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
      await executeGraphQLMutation(POWER_ON_MUTATION, { id: payload.id });
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
      await executeGraphQLMutation(SUSPEND_MUTATION, { id: payload.id });
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
      await executeGraphQLMutation(POWER_OFF_MUTATION, { id: payload.id });
      await dispatch(fetchVms());
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const moveMachine = createAsyncThunk(
  'vms/moveMachine',
  async ({ id, departmentId }, { rejectWithValue }) => {
    try {
      const response = await executeGraphQLMutation(MOVE_MACHINE_MUTATION, {
        id,
        departmentId,
      });
      return response.moveMachine;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  selectedMachine: null,
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
      })
      .addCase(fetchVms.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload || 'Failed to fetch VMs';
        state.items = []; // Set empty array on error to prevent undefined
      })

      // Create VM
      .addCase(createVm.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createVm.fulfilled, (state, action) => {
        state.loading.create = false;
        state.items.push(action.payload);
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
          state.items[index].status = "paused";
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
          state.items[index].status = "stopped";
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
        const index = state.items.findIndex((vm) => vm.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(moveMachine.rejected, (state, action) => {
        state.loading.move = false;
        state.error.move = action.payload;
      });
  },
});

export default vmsSlice.reducer;
export const { selectMachine, deselectMachine, clearErrors } = vmsSlice.actions;

// Selectors
export const selectVmsState = (state) => state.vms;
export const selectVmsLoading = (state) => state.vms.loading;
export const selectVmsError = (state) => state.vms.error;