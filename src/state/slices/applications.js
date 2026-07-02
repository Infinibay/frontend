import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';
import { createDebugger } from '@/utils/debug';
import {
  ApplicationsDocument,
  ApplicationDocument,
  CreateApplicationDocument,
  UpdateApplicationDocument,
  DeleteApplicationDocument,
} from '@/gql/hooks';

import { persistReducer, createMigrate } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const debug = createDebugger('applications-slice');

// Keys whose values must never be written to the console / debug panel.
const SENSITIVE_KEYS = new Set([
  'password', 'confirmPassword', 'newPassword', 'currentPassword', 'oldPassword',
  'bindPassword', 'productKey', 'token', 'accessToken', 'refreshToken', 'secret'
]);

// Deep-clone GraphQL variables with sensitive fields redacted before logging.
const sanitizeVariables = (value) => {
  if (Array.isArray(value)) return value.map(sanitizeVariables);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, SENSITIVE_KEYS.has(k) ? '[REDACTED]' : sanitizeVariables(v)])
    );
  }
  return value;
};

const executeGraphQLMutation = async (mutation, variables) => {
  try {
    debug.log('mutation', 'Executing GraphQL mutation', { mutation: mutation.loc?.source?.body, variables: sanitizeVariables(variables) });
    const { data } = await client.mutate({ mutation, variables });
    debug.log('mutation', 'GraphQL mutation success', data);
    return data;
  } catch (error) {
    debug.error('mutation', 'GraphQL mutation error', error);
    throw error;
  }
};

const executeGraphQLQuery = async (query, variables = {}) => {
  try {
    debug.log('query', 'Executing GraphQL query', { query: query.loc?.source?.body, variables: sanitizeVariables(variables) });
    const response = await client.query({
      query,
      variables,
      fetchPolicy: 'network-only' // Force network request so mutations aren't masked by a stale cache-first read
    });

    // Apollo Client 4: a failing query (errorPolicy:'all') resolves with a
    // SINGULAR `error` — the plural `errors` was removed. Surface it as a real
    // error, and guard against a null `data` payload.
    if (response.error) {
      throw response.error;
    }
    if (!response.data) {
      throw new Error('No data returned from the server.');
    }

    debug.log('query', 'GraphQL query success', response.data);
    return response.data;
  } catch (error) {
    debug.error('query', 'GraphQL query error', error);
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
  async (payload, { rejectWithValue }) => {
    try {
      const data = await executeGraphQLMutation(DeleteApplicationDocument, { id: payload.id });
      // deleteApplication resolves to Boolean! — false means the backend refused
      // the delete without throwing, so treat it as an error.
      if (!data?.deleteApplication) {
        throw new Error('Failed to delete application');
      }
      return payload.id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    items: [],
    lastUpdated: null,
    selectedApplication: null,
    loading: {
      fetch: false,
      fetchOne: false,
      create: false,
      update: false,
      delete: false
    },
    error: {
      fetch: null,
      fetchOne: null,
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
    // Real-time event handlers
    realTimeApplicationCreated: (state, action) => {
      const app = action.payload;
      if (!app || !app.id) return;
      const exists = state.items.findIndex(a => a.id === app.id) !== -1;
      if (!exists) {
        state.items.push(app);
      }
    },
    realTimeApplicationUpdated: (state, action) => {
      const app = action.payload;
      if (!app || !app.id) return;
      const idx = state.items.findIndex(a => a.id === app.id);
      if (idx !== -1) {
        state.items[idx] = app;
        if (state.selectedApplication?.id === app.id) {
          state.selectedApplication = app;
        }
      }
    },
    realTimeApplicationDeleted: (state, action) => {
      const payload = action.payload;
      const id = payload?.id || payload;
      if (!id) return;
      state.items = state.items.filter(a => a.id !== id);
      if (state.selectedApplication?.id === id) {
        state.selectedApplication = null;
      }
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
        state.lastUpdated = Date.now();
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.error.message;
      })

      // Fetch single Application (deep links / detail page)
      .addCase(fetchApplicationById.pending, (state) => {
        state.loading.fetchOne = true;
        state.error.fetchOne = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.loading.fetchOne = false;
        const app = action.payload;
        if (app && app.id) {
          const index = state.items.findIndex((a) => a.id === app.id);
          if (index !== -1) {
            state.items[index] = app;
          } else {
            state.items.push(app);
          }
        }
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.loading.fetchOne = false;
        state.error.fetchOne = action.error.message;
      })

      // Create Application
      .addCase(createApplication.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.loading.create = false;
        // Idempotent upsert by id: the realtime `created` socket event may arrive
        // before this mutation resolves, so guard against pushing a duplicate row.
        const app = action.payload;
        if (app && app.id) {
          const index = state.items.findIndex((a) => a.id === app.id);
          if (index !== -1) {
            state.items[index] = app;
          } else {
            state.items.push(app);
          }
        }
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
        // Thunk returns the deleted application's id (a scalar).
        state.items = state.items.filter((app) => app.id !== action.payload);
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload || action.error.message;
      });
  },
});

const persistConfig = {
  key: 'applications',
  storage,
  version: 1,
  // No transform needed to reach v1 (baseline). When the persisted shape of
  // `items` changes incompatibly, bump `version` and add a numbered migration
  // (e.g. `2: (state) => ...`) so old payloads are migrated/purged instead of
  // hydrating a corrupt shape.
  migrate: createMigrate({ 1: (state) => state }, { debug: false }),
  // Only persist the data; never persist transient loading/error flags (a
  // mid-fetch reload would otherwise rehydrate loading.fetch=true and wedge
  // the page in a permanent loading state).
  whitelist: ['items'],
};

const persistedApplicationReducer = persistReducer(persistConfig, applicationsSlice.reducer);

export default persistedApplicationReducer;
export const { selectApplication, deselectApplication } = applicationsSlice.actions;
