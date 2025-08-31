import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';

// Initial state
const initialState = {
  vmHealthData: {},
  autoChecks: {},
  remediations: {},
  activeRemediations: {},
  healthTrends: {},
  firewallStatus: {},
  isLoading: false,
  error: null,
  lastUpdated: {},
};

// Async thunks
export const fetchVMHealthData = createAsyncThunk(
  'health/fetchVMHealthData',
  async ({ vmId, client }) => {
    const query = `
      query GetVMHealthData($vmId: String!) {
        vm(id: $vmId) {
          id
          healthScore
          lastHealthCheck
          autoChecks {
            id
            checkName
            category
            status
            message
            details
            confidence
            timestamp
          }
        }
      }
    `;
    
    const response = await client.query({
      query,
      variables: { vmId },
    });
    
    return { vmId, data: response.data.vm };
  }
);

export const runAutoCheck = createAsyncThunk(
  'health/runAutoCheck',
  async ({ vmId, checkName, client }) => {
    const mutation = `
      mutation RunAutoCheck($vmId: String!, $checkName: String) {
        runAutoCheck(vmId: $vmId, checkName: $checkName) {
          id
          status
          checkName
          category
          message
          details
          confidence
        }
      }
    `;
    
    const response = await client.mutate({
      mutation,
      variables: { vmId, checkName },
    });
    
    return { vmId, check: response.data.runAutoCheck };
  }
);

export const applyRemediation = createAsyncThunk(
  'health/applyRemediation',
  async ({ remediationId, approve, client }) => {
    const mutation = `
      mutation ApplyRemediation($remediationId: String!, $approve: Boolean!) {
        applyRemediation(remediationId: $remediationId, approve: $approve) {
          success
          message
          updatedHealthScore
        }
      }
    `;
    
    const response = await client.mutate({
      mutation,
      variables: { remediationId, approve },
    });
    
    return response.data.applyRemediation;
  }
);

// Create slice
const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    // Set VM health data
    setVMHealthData: (state, action) => {
      const { vmId, data } = action.payload;
      state.vmHealthData[vmId] = data;
      state.lastUpdated[vmId] = Date.now();
    },
    
    // Update health score
    updateHealthScore: (state, action) => {
      const { vmId, score } = action.payload;
      if (state.vmHealthData[vmId]) {
        state.vmHealthData[vmId].healthScore = score;
      }
    },
    
    // Add or update auto check
    updateAutoCheck: (state, action) => {
      const { vmId, check } = action.payload;
      if (!state.autoChecks[vmId]) {
        state.autoChecks[vmId] = {};
      }
      state.autoChecks[vmId][check.id] = check;
    },
    
    // Add health issue
    addHealthIssue: (state, action) => {
      const { vmId, issue } = action.payload;
      if (!state.autoChecks[vmId]) {
        state.autoChecks[vmId] = {};
      }
      state.autoChecks[vmId][issue.id] = issue;
    },
    
    // Set remediation status
    setRemediationStatus: (state, action) => {
      const { remediationId, status } = action.payload;
      state.activeRemediations[remediationId] = status;
    },
    
    // Update remediation result
    updateRemediationResult: (state, action) => {
      const { remediationId, result } = action.payload;
      if (state.remediations[remediationId]) {
        state.remediations[remediationId].result = result;
        state.remediations[remediationId].status = result.success ? 'completed' : 'failed';
      }
    },
    
    // Set firewall status
    setFirewallStatus: (state, action) => {
      const { vmId, status } = action.payload;
      state.firewallStatus[vmId] = status;
    },
    
    // Update firewall service
    updateFirewallService: (state, action) => {
      const { vmId, serviceId, enabled } = action.payload;
      if (state.firewallStatus[vmId]?.services) {
        const service = state.firewallStatus[vmId].services.find(s => s.id === serviceId);
        if (service) {
          service.enabled = enabled;
        }
      }
    },
    
    // Set health trends
    setHealthTrends: (state, action) => {
      const { vmId, trends } = action.payload;
      state.healthTrends[vmId] = trends;
    },
    
    // Clear VM health data
    clearVMHealthData: (state, action) => {
      const { vmId } = action.payload;
      delete state.vmHealthData[vmId];
      delete state.autoChecks[vmId];
      delete state.healthTrends[vmId];
      delete state.firewallStatus[vmId];
      delete state.lastUpdated[vmId];
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    // Fetch VM health data
    builder
      .addCase(fetchVMHealthData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVMHealthData.fulfilled, (state, action) => {
        const { vmId, data } = action.payload;
        state.vmHealthData[vmId] = data;
        state.lastUpdated[vmId] = Date.now();
        state.isLoading = false;
      })
      .addCase(fetchVMHealthData.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      });
    
    // Run auto check
    builder
      .addCase(runAutoCheck.pending, (state, action) => {
        const { vmId } = action.meta.arg;
        if (!state.autoChecks[vmId]) {
          state.autoChecks[vmId] = {};
        }
      })
      .addCase(runAutoCheck.fulfilled, (state, action) => {
        const { vmId, check } = action.payload;
        if (!state.autoChecks[vmId]) {
          state.autoChecks[vmId] = {};
        }
        state.autoChecks[vmId][check.id] = check;
        toast.success('Health check completed');
      })
      .addCase(runAutoCheck.rejected, (state, action) => {
        toast.error('Failed to run health check');
      });
    
    // Apply remediation
    builder
      .addCase(applyRemediation.pending, (state, action) => {
        const { remediationId } = action.meta.arg;
        state.activeRemediations[remediationId] = 'applying';
      })
      .addCase(applyRemediation.fulfilled, (state, action) => {
        const { remediationId } = action.meta.arg;
        const result = action.payload;
        
        state.activeRemediations[remediationId] = result.success ? 'completed' : 'failed';
        
        if (result.success) {
          toast.success(result.message || 'Remediation applied successfully');
        } else {
          toast.error(result.message || 'Remediation failed');
        }
      })
      .addCase(applyRemediation.rejected, (state, action) => {
        const { remediationId } = action.meta.arg;
        state.activeRemediations[remediationId] = 'failed';
        toast.error('Failed to apply remediation');
      });
  },
});

// Export actions
export const {
  setVMHealthData,
  updateHealthScore,
  updateAutoCheck,
  addHealthIssue,
  setRemediationStatus,
  updateRemediationResult,
  setFirewallStatus,
  updateFirewallService,
  setHealthTrends,
  clearVMHealthData,
  setLoading,
  setError,
  clearError,
} = healthSlice.actions;

// Selectors
export const selectVMHealthData = (state, vmId) => state.health.vmHealthData[vmId];
export const selectVMAutoChecks = (state, vmId) => state.health.autoChecks[vmId] || {};
export const selectVMHealthTrends = (state, vmId) => state.health.healthTrends[vmId];
export const selectVMFirewallStatus = (state, vmId) => state.health.firewallStatus[vmId];
export const selectRemediationStatus = (state, remediationId) => state.health.activeRemediations[remediationId];
export const selectHealthLoading = (state) => state.health.isLoading;
export const selectHealthError = (state) => state.health.error;

// Export reducer
export default healthSlice.reducer;