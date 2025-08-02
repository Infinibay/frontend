import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';
// TODO: ListVmPortsDocument query needs to be added to GraphQL schema
// import { ListVmPortsDocument } from '@/gql/hooks';

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

export const fetchVmPorts = createAsyncThunk(
  'vmPorts/fetchVmPorts',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Implement ListVmPortsDocument query in GraphQL schema
      // const data = await executeGraphQLQuery(ListVmPortsDocument);
      // return data.listVmPorts || [];
      return []; // Return empty array for now
    } catch (error) {
      return rejectWithValue(error.message);
    }
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
