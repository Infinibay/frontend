import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { gql } from '@apollo/client';
import client from '@/apollo-client';
import { clearISOCache } from '@/utils/cache-manager';

// GraphQL queries
const AVAILABLE_ISOS_QUERY = gql`
  query AvailableISOs {
    availableISOs {
      id
      filename
      os
      version
      size
      uploadedAt
      lastVerified
      isAvailable
      checksum
      path
    }
  }
`;

const CHECK_ISO_STATUS_QUERY = gql`
  query CheckISOStatus($os: String!) {
    checkISOStatus(os: $os) {
      os
      available
      iso {
        id
        filename
        os
        size
        isAvailable
      }
    }
  }
`;

const SYSTEM_READINESS_QUERY = gql`
  query CheckSystemReadiness {
    checkSystemReadiness {
      ready
      availableOS
      missingOS
    }
  }
`;

const CHECK_MULTIPLE_OS_QUERY = gql`
  query CheckMultipleOSAvailability($osList: [String!]!) {
    checkMultipleOSAvailability(osList: $osList) {
      os
      available
    }
  }
`;

const SUPPORTED_OS_QUERY = gql`
  query GetSupportedOSTypes {
    getSupportedOSTypes
  }
`;

// Async thunks
export const fetchAvailableISOs = createAsyncThunk(
  'iso/fetchAvailable',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: AVAILABLE_ISOS_QUERY,
        fetchPolicy: 'network-only'
      });
      return data.availableISOs;
    } catch (error) {
      // Clear ISO cache on validation errors
      if (error.message && error.message.includes('GRAPHQL_VALIDATION_FAILED')) {
        await clearISOCache(client);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const checkISOStatus = createAsyncThunk(
  'iso/checkStatus',
  async (os, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: CHECK_ISO_STATUS_QUERY,
        variables: { os },
        fetchPolicy: 'network-only'
      });
      return data.checkISOStatus;
    } catch (error) {
      // Clear ISO cache on validation errors
      if (error.message && error.message.includes('GRAPHQL_VALIDATION_FAILED')) {
        await clearISOCache(client);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const checkSystemReadiness = createAsyncThunk(
  'iso/checkSystemReadiness',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: SYSTEM_READINESS_QUERY,
        fetchPolicy: 'network-only'
      });
      return data.checkSystemReadiness;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkMultipleOSAvailability = createAsyncThunk(
  'iso/checkMultiple',
  async (osList, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: CHECK_MULTIPLE_OS_QUERY,
        variables: { osList },
        fetchPolicy: 'network-only'
      });
      
      // Convert array to map for easier access
      const availabilityMap = {};
      data.checkMultipleOSAvailability.forEach(item => {
        availabilityMap[item.os] = item.available;
      });
      return availabilityMap;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSupportedOSTypes = createAsyncThunk(
  'iso/fetchSupported',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: SUPPORTED_OS_QUERY,
        fetchPolicy: 'cache-first'
      });
      return data.getSupportedOSTypes;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  availableISOs: [],
  systemReadiness: {
    ready: false,
    availableOS: [],
    missingOS: []
  },
  osAvailabilityMap: {}, // { WINDOWS10: true, UBUNTU: false, ... }
  supportedOSTypes: [],
  currentISOStatus: null,
  uploadProgress: null,
  loading: {
    fetch: false,
    checkStatus: false,
    checkReadiness: false,
    checkMultiple: false,
    fetchSupported: false
  },
  error: {
    fetch: null,
    checkStatus: null,
    checkReadiness: null,
    checkMultiple: null,
    fetchSupported: null
  }
};

// Slice
const isoSlice = createSlice({
  name: 'iso',
  initialState,
  reducers: {
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearUploadProgress: (state) => {
      state.uploadProgress = null;
    },
    updateISOAvailability: (state, action) => {
      const { os, available } = action.payload;
      state.osAvailabilityMap[os] = available;
      
      // Update system readiness based on new availability
      if (available && !state.systemReadiness.availableOS.includes(os)) {
        state.systemReadiness.availableOS.push(os);
        state.systemReadiness.missingOS = state.systemReadiness.missingOS.filter(
          missingOs => missingOs !== os
        );
      } else if (!available && state.systemReadiness.availableOS.includes(os)) {
        state.systemReadiness.availableOS = state.systemReadiness.availableOS.filter(
          availableOs => availableOs !== os
        );
        if (!state.systemReadiness.missingOS.includes(os)) {
          state.systemReadiness.missingOS.push(os);
        }
      }
      
      state.systemReadiness.ready = state.systemReadiness.availableOS.length > 0;
    },
    clearErrors: (state) => {
      state.error = {
        fetch: null,
        checkStatus: null,
        checkReadiness: null,
        checkMultiple: null,
        fetchSupported: null
      };
    }
  },
  extraReducers: (builder) => {
    // Fetch available ISOs
    builder
      .addCase(fetchAvailableISOs.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchAvailableISOs.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.availableISOs = action.payload;
        
        // Update availability map
        const availabilityMap = {};
        action.payload.forEach(iso => {
          availabilityMap[iso.os] = iso.isAvailable;
        });
        state.osAvailabilityMap = availabilityMap;
      })
      .addCase(fetchAvailableISOs.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload;
      });

    // Check ISO status
    builder
      .addCase(checkISOStatus.pending, (state) => {
        state.loading.checkStatus = true;
        state.error.checkStatus = null;
      })
      .addCase(checkISOStatus.fulfilled, (state, action) => {
        state.loading.checkStatus = false;
        state.currentISOStatus = action.payload;
        state.osAvailabilityMap[action.payload.os] = action.payload.available;
      })
      .addCase(checkISOStatus.rejected, (state, action) => {
        state.loading.checkStatus = false;
        state.error.checkStatus = action.payload;
      });

    // Check system readiness
    builder
      .addCase(checkSystemReadiness.pending, (state) => {
        state.loading.checkReadiness = true;
        state.error.checkReadiness = null;
      })
      .addCase(checkSystemReadiness.fulfilled, (state, action) => {
        state.loading.checkReadiness = false;
        state.systemReadiness = action.payload;
        
        // Update availability map
        action.payload.availableOS.forEach(os => {
          state.osAvailabilityMap[os] = true;
        });
        action.payload.missingOS.forEach(os => {
          state.osAvailabilityMap[os] = false;
        });
      })
      .addCase(checkSystemReadiness.rejected, (state, action) => {
        state.loading.checkReadiness = false;
        state.error.checkReadiness = action.payload;
      });

    // Check multiple OS availability
    builder
      .addCase(checkMultipleOSAvailability.pending, (state) => {
        state.loading.checkMultiple = true;
        state.error.checkMultiple = null;
      })
      .addCase(checkMultipleOSAvailability.fulfilled, (state, action) => {
        state.loading.checkMultiple = false;
        state.osAvailabilityMap = { ...state.osAvailabilityMap, ...action.payload };
      })
      .addCase(checkMultipleOSAvailability.rejected, (state, action) => {
        state.loading.checkMultiple = false;
        state.error.checkMultiple = action.payload;
      });

    // Fetch supported OS types
    builder
      .addCase(fetchSupportedOSTypes.pending, (state) => {
        state.loading.fetchSupported = true;
        state.error.fetchSupported = null;
      })
      .addCase(fetchSupportedOSTypes.fulfilled, (state, action) => {
        state.loading.fetchSupported = false;
        state.supportedOSTypes = action.payload;
      })
      .addCase(fetchSupportedOSTypes.rejected, (state, action) => {
        state.loading.fetchSupported = false;
        state.error.fetchSupported = action.payload;
      });
  }
});

// Actions
export const {
  setUploadProgress,
  clearUploadProgress,
  updateISOAvailability,
  clearErrors
} = isoSlice.actions;

// Selectors
export const selectAvailableISOs = (state) => state.iso.availableISOs;
export const selectSystemReadiness = (state) => state.iso.systemReadiness;
export const selectOSAvailability = (state, os) => state.iso.osAvailabilityMap[os] || false;
export const selectOSAvailabilityMap = (state) => state.iso.osAvailabilityMap;
export const selectSupportedOSTypes = (state) => state.iso.supportedOSTypes;
export const selectISOLoading = (state) => state.iso.loading;
export const selectISOError = (state) => state.iso.error;
export const selectUploadProgress = (state) => state.iso.uploadProgress;

export default isoSlice.reducer;