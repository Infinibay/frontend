import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  breadcrumbs: [],
  title: '',
  subtitle: null,
  actions: [],
  helpTooltip: null,
  backButton: null
};

const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setHeader: (state, action) => {
      const { breadcrumbs, title, subtitle, actions, helpTooltip, backButton } = action.payload;
      state.breadcrumbs = breadcrumbs || [];
      state.title = title || '';
      state.subtitle = subtitle || null;
      state.actions = actions || [];
      state.helpTooltip = helpTooltip || null;
      state.backButton = backButton || null;
    },
    updateHeaderActions: (state, action) => {
      state.actions = action.payload.actions || [];
    },
    resetHeader: (state) => {
      state.breadcrumbs = [];
      state.title = '';
      state.subtitle = null;
      state.actions = [];
      state.helpTooltip = null;
      state.backButton = null;
    },
    setHelpTooltip: (state, action) => {
      state.helpTooltip = action.payload.tooltip;
    }
  }
});

// Selectors
export const selectHeaderBreadcrumbs = (state) => state.header.breadcrumbs;
export const selectHeaderTitle = (state) => state.header.title;
export const selectHeaderSubtitle = (state) => state.header.subtitle;
export const selectHeaderActions = (state) => state.header.actions;
export const selectHeaderHelpTooltip = (state) => state.header.helpTooltip;
export const selectHeaderBackButton = (state) => state.header.backButton;
export const selectHeaderConfig = (state) => state.header;

// Export actions
export const { setHeader, updateHeaderActions, resetHeader, setHelpTooltip } = headerSlice.actions;

// Export reducer
export default headerSlice.reducer;
