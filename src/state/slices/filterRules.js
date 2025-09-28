import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import client from '@/apollo-client';
import { createDebugger } from '@/utils/debug';
import { gql } from '@apollo/client';
import {
  ListFilterRulesDocument,
  CreateFilterRuleDocument,
  UpdateFilterRuleDocument,
} from '@/gql/hooks';

import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Create debug instance for filter rules state
const debug = createDebugger('filterRules-slice');

const executeGraphQLMutation = async (mutation, variables) => {
  try {
    debug('Executing GraphQL mutation', { mutation: mutation.loc?.source?.body, variables });
    const { data } = await client.mutate({ mutation, variables });
    debug('GraphQL mutation success', data);
    return data;
  } catch (error) {
    debug('GraphQL mutation error', error);
    console.error('GraphQL mutation error:', error);
    throw error;
  }
};

const executeGraphQLQuery = async (query, variables = {}) => {
  try {
    debug('Executing GraphQL query', { query: query.loc?.source?.body, variables });
    const { data } = await client.query({ query, variables });
    debug('GraphQL query success', data);
    return data;
  } catch (error) {
    debug('GraphQL query error', error);
    console.error('GraphQL query error:', error);
    throw error;
  }
};

export const fetchFilterRules = createAsyncThunk(
  'filterRules/fetchFilterRules',
  async (filterId) => {
    const data = await executeGraphQLQuery(ListFilterRulesDocument, { filterId });
    return data.listFilterRules;
  }
);

export const createFilterRule = createAsyncThunk(
  'filterRules/createFilterRule',
  async ({ filterId, input }) => {
    const data = await executeGraphQLMutation(CreateFilterRuleDocument, { filterId, input });
    return data.createFilterRule;
  }
);

export const updateFilterRule = createAsyncThunk(
  'filterRules/updateFilterRule',
  async ({ id, input }) => {
    const data = await executeGraphQLMutation(UpdateFilterRuleDocument, { id, input });
    return data.updateFilterRule;
  }
);

export const deleteFilterRule = createAsyncThunk(
  'filterRules/deleteFilterRule',
  async (id) => {
    const data = await executeGraphQLMutation(DELETE_FILTER_RULE_MUTATION, { id });
    return data.deleteFilterRule;
  }
);

export const DELETE_FILTER_RULE_MUTATION = gql`
  mutation DeleteFilterRule($id: ID!) {
    deleteFilterRule(id: $id)
  }
`;

const filterRulesSlice = createSlice({
  name: 'filterRules',
  initialState: {
    items: [],
    selectedRule: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectRule(state, action) {
      state.selectedRule = action.payload;
    },
    deselectRule(state) {
      state.selectedRule = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Filter Rules
      .addCase(fetchFilterRules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilterRules.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFilterRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create Filter Rule
      .addCase(createFilterRule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFilterRule.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createFilterRule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Filter Rule
      .addCase(updateFilterRule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFilterRule.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((rule) => rule.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedRule?.id === action.payload.id) {
          state.selectedRule = action.payload;
        }
      })
      .addCase(updateFilterRule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Filter Rule
      .addCase(deleteFilterRule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFilterRule.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((rule) => rule.id !== action.payload);
        if (state.selectedRule?.id === action.payload) {
          state.selectedRule = null;
        }
      })
      .addCase(deleteFilterRule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});



export const { selectRule, deselectRule } = filterRulesSlice.actions;

export const selectFilterRulesState = (state) => state.filterRules;
export const selectFilterRulesLoading = (state) => state.filterRules.loading;
export const selectFilterRulesError = (state) => state.filterRules.error;
export default filterRulesSlice.reducer;