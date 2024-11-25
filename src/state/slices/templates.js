import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';
import { MACHINE_TEMPLATES_QUERY } from '@/graphql/queries';

const executeGraphQLQuery = async (query, variables = {}) => {
  try {
    const { data } = await client.query({ query, variables });
    return data;
  } catch (error) {
    console.error('GraphQL query error:', error);
    throw error;
  }
};

export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async () => {
    const data = await executeGraphQLQuery(MACHINE_TEMPLATES_QUERY);
    return data.machineTemplates;
  }
);

const templatesSlice = createSlice({
  name: 'templates',
  initialState: {
    items: [],
    loading: {
      fetch: false,
    },
    error: {
      fetch: null,
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Templates
      .addCase(fetchTemplates.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.items = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.error.message;
      });
  }
});

// Selectors
export const selectTemplatesState = (state) => state.templates;
export const selectTemplatesLoading = (state) => state.templates.loading;
export const selectTemplatesError = (state) => state.templates.error;

export default templatesSlice.reducer;
