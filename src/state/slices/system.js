import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';
import { GPUS_QUERY } from '@/graphql/queries';
import { 
  GetGraphicsDocument
} from '@/gql/hooks';

const executeGraphQLQuery = async (query, variables = {}) => {
  try {
    const response = await client.query({ 
      query, 
      variables,
      fetchPolicy: 'network-only' // Force network request
    });
    
    if (response.errors) {
      const errorMessage = response.errors.map(err => err.message).join(', ');
      throw new Error(errorMessage);
    }
    
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

export const fetchGraphics = createAsyncThunk(
  'system/fetchGraphics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await executeGraphQLQuery(GetGraphicsDocument);
      return response.getGraphics;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { system } = getState();
      return !system.loading;
    }
  }
);

const initialState = {
  graphics: [],
  loading: false,
  error: null
};

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGraphics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGraphics.fulfilled, (state, action) => {
        state.loading = false;
        state.graphics = action.payload;
      })
      .addCase(fetchGraphics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default systemSlice.reducer;
export const { clearErrors } = systemSlice.actions;

// Selectors
export const selectSystemState = (state) => state.system;
export const selectSystemLoading = (state) => state.system.loading;
export const selectSystemError = (state) => state.system.error;
export const selectGraphics = (state) => state.system.graphics;