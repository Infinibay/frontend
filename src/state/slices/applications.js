import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';
import {
  DELETE_APPLICATION_MUTATION
} from '@/graphql/mutations';

import {
  ApplicationsDocument,
  ApplicationDocument,
  CreateApplicationDocument,
  UpdateApplicationDocument,
  // DestroyApplicationDocument // Does not exist yet
} from '@/gql/hooks';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const executeGraphQLMutation = async (mutation, variables) => {
  try {
    const { data } = await client.mutate({ mutation, variables });
    return data;
  } catch (error) {
    console.error('GraphQL mutation error:', error);
    throw error;
  }
};

const executeGraphQLQuery = async (query, variables = {}) => {
  try {
    const { data } = await client.query({ query, variables });
    return data;
  } catch (error) {
    console.error('GraphQL query error:', error);
    throw error;
  }
};

export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async () => {
    const data = await executeGraphQLQuery(ApplicationsDocument);
    return data.applications;
  }
);

export const fetchApplicationById = createAsyncThunk(
  'applications/fetchApplicationById',
  async (id) => {
    const data = await executeGraphQLQuery(ApplicationDocument, { id });
    return data.application;
  }
);

export const createApplication = createAsyncThunk(
  'applications/createApplication',
  async (payload) => {
    const data = await executeGraphQLMutation(CreateApplicationDocument, { input: payload });
    return data.createApplication;
  }
);

export const updateApplication = createAsyncThunk(
  'applications/updateApplication',
  async (payload) => {
    const data = await executeGraphQLMutation(UpdateApplicationDocument, { input: payload.input, id: payload.id });
    return data.updateApplication;
  }
);

export const deleteApplication = createAsyncThunk(
  'applications/deleteApplication',
  async (payload) => {
    const data = await executeGraphQLMutation(DELETE_APPLICATION_MUTATION, { id: payload.id });
    return data.destroyApplication;
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    items: [],
    selectedApplication: null,
    loading: {
      fetch: false,
      create: false,
      update: false,
      delete: false
    },
    error: {
      fetch: null,
      create: null,
      update: null,
      delete: null
    }
  },
  reducers: {
    selectApplication: (state, action) => {
      state.selectedApplication = action.payload;
    },
    deselectApplication: (state) => {
      state.selectedApplication = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Applications
      .addCase(fetchApplications.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.items = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.error.message;
      })

      // Create Application
      .addCase(createApplication.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.loading.create = false;
        state.items.push(action.payload);
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.error.message;
      })

      // Update Application
      .addCase(updateApplication.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateApplication.fulfilled, (state, action) => {
        state.loading.update = false;
        const index = state.items.findIndex((app) => app.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateApplication.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.error.message;
      })

      // Delete Application
      .addCase(deleteApplication.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.items = state.items.filter((app) => app.id !== action.payload.id);
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.error.message;
      });
  },
});

const persistConfig = {
  key: 'applications',
  storage,
};

const persistedApplicaitonReducer = persistReducer(persistConfig, applicationsSlice.reducer);

export default persistedApplicaitonReducer;
export const { selectApplication, deselectApplication } = applicationsSlice.actions;
