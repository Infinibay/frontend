import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';
import { APPLICATIONS_QUERY, APPLICATION_QUERY } from '@/graphql/queries';
import {
  CREATE_APPLICATION_MUTATION,
  UPDATE_APPLICATION_MUTATION,
  DELETE_APPLICATION_MUTATION
} from '@/graphql/mutations';
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
    const data = await executeGraphQLQuery(APPLICATIONS_QUERY);
    return data.applications;
  }
);

export const fetchApplicationById = createAsyncThunk(
  'applications/fetchApplicationById',
  async (id) => {
    const data = await executeGraphQLQuery(APPLICATION_QUERY, { id });
    return data.application;
  }
);

export const createApplication = createAsyncThunk(
  'applications/createApplication',
  async (payload) => {
    const data = await executeGraphQLMutation(CREATE_APPLICATION_MUTATION, { input: payload });
    return data.createApplication;
  }
);

export const updateApplication = createAsyncThunk(
  'applications/updateApplication',
  async (payload) => {
    const data = await executeGraphQLMutation(UPDATE_APPLICATION_MUTATION, { input: payload.input, id: payload.id });
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
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateApplication.fulfilled, (state, action) => {
        const index = state.items.findIndex((app) => app.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.items = state.items.filter((app) => app.id !== action.payload.id);
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
