import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';
import { createDebugger } from '@/utils/debug';
// TODO: ListVmPortsDocument query needs to be added to GraphQL schema
// import { ListVmPortsDocument } from '@/gql/hooks';

// Create debug instance for VM ports state
const debug = createDebugger('frontend:state:vmPorts');

const executeGraphQLQuery = async (query, variables = {}) => {
  try {
    const response = await client.query({
      query,
      variables,
      fetchPolicy: 'network-only' // Force network request
    });

    // Apollo Client 4: a failing query (errorPolicy:'all') resolves with a
    // SINGULAR `error` — the plural `errors` was removed.
    if (response.error) {
      throw response.error;
    }
    if (!response.data) {
      throw new Error('No data returned from the server.');
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
    throw error;
  }
};

export const fetchVmPorts = createAsyncThunk(
  'vmPorts/fetchVmPorts',
  async (_, { rejectWithValue }) => {
    // The backend `listVmPorts` query does not exist yet (see the TODO import
    // above). Fail loudly instead of silently resolving to an empty list — a fake
    // empty payload would render a misleading "no ports" state and hide the gap
    // from any accidental consumer.
    // TODO: once ListVmPortsDocument ships, replace this with:
    //   const data = await executeGraphQLQuery(ListVmPortsDocument);
    //   return data.listVmPorts || [];
    return rejectWithValue('VM ports are unavailable: the backend listVmPorts query is not implemented yet.');
  },
  {
    condition: (_, { getState }) => {
      const { vmPorts } = getState();
      // Don't fetch if we're already fetching
      if (vmPorts.loading) {
        return false;
      }
      return true;
    }
  }
);

const initialState = {
  items: [],
  lastUpdated: null,
  loading: false,
  error: null
};

const vmPortsSlice = createSlice({
  name: 'vmPorts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVmPorts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVmPorts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchVmPorts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default vmPortsSlice.reducer;
export const { clearError } = vmPortsSlice.actions;

// Selectors
export const selectVmPortsState = (state) => state.vmPorts;
export const selectVmPortsLoading = (state) => state.vmPorts.loading;
export const selectVmPortsError = (state) => state.vmPorts.error;
