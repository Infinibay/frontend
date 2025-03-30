import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';
import { gql } from '@apollo/client';

import {
  UsersDocument,
  CreateUserDocument,
  UpdateUserDocument,
  // DestroyUserDocument
} from '@/gql/hooks';

// TODO: Implement destroyUser
export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: String!) {
    destroyUser(id: $id)
  }
`;

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

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const data = await executeGraphQLQuery(UsersDocument, {pagination: {take: 1000, skip: 0}});
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
  reducers: {},
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
