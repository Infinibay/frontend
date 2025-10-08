import { createSlice } from '@reduxjs/toolkit';

/**
 * Firewall slice - tracks real-time firewall events from WebSocket
 * This slice only stores the last event to trigger refetches, not the actual rules
 */
const firewallSlice = createSlice({
  name: 'firewall',
  initialState: {
    lastEvent: null, // Last firewall event received via WebSocket
  },
  reducers: {
    // Handle real-time generic filter assignment/unassignment
    realTimeGenericFilterChanged: (state, action) => {
      state.lastEvent = {
        ...action.payload,
        timestamp: Date.now()
      };
    },

    // Handle real-time department firewall rule changes
    realTimeDepartmentRuleChanged: (state, action) => {
      state.lastEvent = {
        ...action.payload,
        timestamp: Date.now()
      };
    },

    // Handle real-time VM firewall rule changes
    realTimeVMRuleChanged: (state, action) => {
      state.lastEvent = {
        ...action.payload,
        timestamp: Date.now()
      };
    },

    // Clear last event (optional, for cleanup)
    clearLastEvent: (state) => {
      state.lastEvent = null;
    }
  }
});

export const {
  realTimeGenericFilterChanged,
  realTimeDepartmentRuleChanged,
  realTimeVMRuleChanged,
  clearLastEvent
} = firewallSlice.actions;

export default firewallSlice.reducer;
