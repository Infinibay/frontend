import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';

import {
  MachineTemplateCategoriesDocument,
  CreateMachineTemplateCategoryDocument,
  UpdateMachineTemplateCategoryDocument,
  DestroyMachineTemplateCategoryDocument
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

export const fetchTemplateCategories = createAsyncThunk(
  'templateCategories/fetchTemplateCategories',
  async () => {
    const data = await executeGraphQLQuery(MachineTemplateCategoriesDocument);
    return data.machineTemplateCategories;
  }
);

export const createTemplateCategory = createAsyncThunk(
  'templateCategories/createTemplateCategory',
  async (input) => {
    const data = await executeGraphQLMutation(CreateMachineTemplateCategoryDocument, { input });
    return data.createMachineTemplateCategory;
  }
);

export const updateTemplateCategory = createAsyncThunk(
  'templateCategories/updateTemplateCategory',
  async ({ input, id }) => {
    const data = await executeGraphQLMutation(UpdateMachineTemplateCategoryDocument, { input, id });
    return data.updateMachineTemplateCategory;
  }
);

export const destroyTemplateCategory = createAsyncThunk(
  'templateCategories/destroyTemplateCategory',
  async (id) => {
    const data = await executeGraphQLMutation(DestroyMachineTemplateCategoryDocument, { id });
    if (data.destroyMachineTemplateCategory) {
      return id;
    }
    throw new Error('Failed to delete template category');
  }
);

const templateCategoriesSlice = createSlice({
  name: 'templateCategories',
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
      .addCase(fetchTemplateCategories.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchTemplateCategories.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.items = action.payload;
      })
      .addCase(fetchTemplateCategories.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.error.message;
      });

    // Create cases
    builder
      .addCase(createTemplateCategory.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createTemplateCategory.fulfilled, (state, action) => {
        state.loading.create = false;
        state.items.push(action.payload);
      })
      .addCase(createTemplateCategory.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.error.message;
      });

    // Update cases
    builder
      .addCase(updateTemplateCategory.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateTemplateCategory.fulfilled, (state, action) => {
        state.loading.update = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTemplateCategory.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.error.message;
      });

    // Destroy cases
    builder
      .addCase(destroyTemplateCategory.pending, (state) => {
        state.loading.destroy = true;
        state.error.destroy = null;
      })
      .addCase(destroyTemplateCategory.fulfilled, (state, action) => {
        state.loading.destroy = false;
        state.items = state.items.filter(category => category.id !== action.payload);
      })
      .addCase(destroyTemplateCategory.rejected, (state, action) => {
        state.loading.destroy = false;
        state.error.destroy = action.error.message;
      });
  },
});

// Selectors
export const selectTemplateCategoriesState = (state) => state.templateCategories;
export const selectTemplateCategoriesLoading = (state) => state.templateCategories.loading;
export const selectTemplateCategoriesError = (state) => state.templateCategories.error;

export default templateCategoriesSlice.reducer;
