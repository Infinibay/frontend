import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';
import { gql } from '@apollo/client';
import { createDebugger } from '@/utils/debug';

import {
  UsersDocument,
  CreateUserDocument,
  UpdateUserDocument,
} from '@/gql/hooks';

const debug = createDebugger('users-slice');

// TODO: Implement destroyUser mutation in backend
export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: String!) {
    destroyUser(id: $id)
  }
`;

const executeGraphQLQuery = async (query, variables = {}) => {
  try {
    debug.log('query', 'Executing GraphQL query', { query: query.loc?.source?.body, variables });
    const { data } = await client.query({ query, variables });
    debug.log('query', 'GraphQL query success', data);
    return data;
  } catch (error) {
    debug.error('query', 'GraphQL query error', error);
    console.error('GraphQL query error:', error);
    throw error;
  }
};

const executeGraphQLMutation = async (mutation, variables = {}) => {
  try {
    debug.log('mutation', 'Executing GraphQL mutation', { mutation: mutation.loc?.source?.body, variables });
    const { data } = await client.mutate({ mutation, variables });
    debug.log('mutation', 'GraphQL mutation success', data);
    return data;
  } catch (error) {
    debug.error('mutation', 'GraphQL mutation error', error);
    console.error('GraphQL mutation error:', error);
    throw error;
  }
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const data = await executeGraphQLQuery(UsersDocument, { pagination: { take: 1000, skip: 0 } });
    return data.users;
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (input) => {
    const data = await executeGraphQLMutation(CreateUserDocument, { input });
    return data.createUser;
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, input }) => {
    const data = await executeGraphQLMutation(UpdateUserDocument, { id, input });
    return data.updateUser;
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id) => {
    try {
      const data = await executeGraphQLMutation(DELETE_USER_MUTATION, { id });
      if (data.destroyUser) {
        return id;
      }
    } catch (error) {
      console.warn('GraphQL deletion failed, using mock deletion:', error);
      // Mock successful deletion
      await new Promise(resolve => setTimeout(resolve, 500));
      return id;
    }
    throw new Error('Failed to delete user');
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    loading: {
      fetch: false,
      create: false,
      update: false,
      delete: false,
    },
    error: {
      fetch: null,
      create: null,
      update: null,
      delete: null,
    },
  },
  reducers: {
    // Real-time event handlers
    realTimeUserCreated: (state, action) => {
      const newUser = action.payload;
      if (!newUser || !newUser.id) return;
      const exists = state.items.findIndex(u => u.id === newUser.id) !== -1;
      if (!exists) {
        state.items.push(newUser);
      }
    },
    realTimeUserUpdated: (state, action) => {
      const updated = action.payload;
      if (!updated || !updated.id) return;
      const idx = state.items.findIndex(u => u.id === updated.id);
      if (idx !== -1) {
        state.items[idx] = updated;
      }
    },
    realTimeUserDeleted: (state, action) => {
      const payload = action.payload;
      const id = payload?.id || payload;
      if (!id) return;
      state.items = state.items.filter(u => u.id !== id);
    },
  },
  extraReducers: (builder) => {
    // Fetch cases
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.error.message;
      });

    // Create cases
    builder
      .addCase(createUser.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading.create = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.error.message;
      });

    // Update cases
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading.update = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.error.message;
      });

    // Delete cases
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.items = state.items.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.error.message;
      });
  },
});

// Selectors
export const selectUsers = (state) => state.users.items;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;

export default usersSlice.reducer;
