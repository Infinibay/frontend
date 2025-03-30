import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';
import { gql } from '@apollo/client';
import {
  ListFiltersDocument,
  GetFilterDocument,
  CreateFilterDocument,
  UpdateFilterDocument,
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

export const fetchFilters = createAsyncThunk(
  'filters/fetchFilters',
  async () => {
    const data = await executeGraphQLQuery(ListFiltersDocument);
    return data.listFilters;
  }
);

export const fetchFilterById = createAsyncThunk(
  'filters/fetchFilterById',
  async (id) => {
    const data = await executeGraphQLQuery(GetFilterDocument, { id });
    return data.filter;
  }
);

export const createFilter = createAsyncThunk(
  'filters/createFilter',
  async (input) => {
    const data = await executeGraphQLMutation(CreateFilterDocument, { input });
    return data.createFilter;
  }
);

export const updateFilter = createAsyncThunk(
  'filters/updateFilter',
  async ({ id, input }) => {
    const data = await executeGraphQLMutation(UpdateFilterDocument, { id, input });
    return data.updateFilter;
  }
);

export const deleteFilter = createAsyncThunk(
  'filters/deleteFilter',
  async (id) => {
    const data = await executeGraphQLMutation(DELETE_FILTER_MUTATION, { id });
    return data.deleteFilter;
  }
);

export const DELETE_FILTER_MUTATION = gql`
  mutation DeleteFilter($id: ID!) {
    deleteFilter(id: $id)
  }
`;

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    items: [],
    selectedFilter: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectFilter(state, action) {
      state.selectedFilter = action.payload;
    },
    deselectFilter(state) {
      state.selectedFilter = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Filters
      .addCase(fetchFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Filter by ID
      .addCase(fetchFilterById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilterById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedFilter = action.payload;
      })
      .addCase(fetchFilterById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create Filter
      .addCase(createFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Filter
      .addCase(updateFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFilter.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((filter) => filter.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedFilter?.id === action.payload.id) {
          state.selectedFilter = action.payload;
        }
      })
      .addCase(updateFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Filter
      .addCase(deleteFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((filter) => filter.id !== action.payload);
        if (state.selectedFilter?.id === action.payload) {
          state.selectedFilter = null;
        }
      })
      .addCase(deleteFilter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

const persistConfig = {
  key: 'filters',
  storage,
  whitelist: ['items', 'selectedFilter'],
};

export const { selectFilter, deselectFilter } = filtersSlice.actions;

// export default persistReducer(persistConfig, filtersSlice.reducer);
export default filtersSlice.reducer;
