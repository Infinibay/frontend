import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';

import {
  MachineTemplatesDocument,
  CreateMachineTemplateDocument,
  UpdateMachineTemplateDocument,
  DestroyMachineTemplateDocument
} from '@/gql/hooks';

const executeGraphQLQuery = async (query, variables = {}) => {
  try {
    const { data } = await client.query({ query, variables });
    return data;
  } catch (error) {
    console.error('GraphQL query error:', error);
    throw error;
  }
};

const executeGraphQLMutation = async (mutation, variables = {}) => {
  try {
    const { data } = await client.mutate({ mutation, variables });
    return data;
  } catch (error) {
    console.error('GraphQL mutation error:', error);
    throw error;
  }
};

export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async () => {
    const data = await executeGraphQLQuery(MachineTemplatesDocument);
    return data.machineTemplates;
  }
);

export const createTemplate = createAsyncThunk(
  'templates/createTemplate',
  async (input) => {
    const data = await executeGraphQLMutation(CreateMachineTemplateDocument, { input });
    return data.createMachineTemplate;
  }
);

export const updateTemplate = createAsyncThunk(
  'templates/updateTemplate',
  async ({ input, id }) => {
    const data = await executeGraphQLMutation(UpdateMachineTemplateDocument, { input, id });
    return data.updateMachineTemplate;
  }
);

export const destroyTemplate = createAsyncThunk(
  'templates/destroyTemplate',
  async (id) => {
    const data = await executeGraphQLMutation(DestroyMachineTemplateDocument, { id });
    if (data.destroyMachineTemplate) {
      return id;
    }
    throw new Error('Failed to delete template');
  }
);

const templatesSlice = createSlice({
  name: 'templates',
  initialState: {
    items: [],
    loading: {
      fetch: false,
      create: false,
      update: false,
      destroy: false,
    },
    error: {
      fetch: null,
      create: null,
      update: null,
      destroy: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch cases
    builder
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

    // Create cases
    builder
      .addCase(createTemplate.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.loading.create = false;
        state.items.push(action.payload);
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.error.message;
      });

    // Update cases
    builder
      .addCase(updateTemplate.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading.update = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.error.message;
      });

    // Destroy cases
    builder
      .addCase(destroyTemplate.pending, (state) => {
        state.loading.destroy = true;
        state.error.destroy = null;
      })
      .addCase(destroyTemplate.fulfilled, (state, action) => {
        state.loading.destroy = false;
        state.items = state.items.filter(template => template.id !== action.payload);
      })
      .addCase(destroyTemplate.rejected, (state, action) => {
        state.loading.destroy = false;
        state.error.destroy = action.error.message;
      });
  },
});

// Selectors
export const selectTemplatesState = (state) => state.templates;
export const selectTemplatesLoading = (state) => state.templates.loading;
export const selectTemplatesError = (state) => state.templates.error;

export default templatesSlice.reducer;
