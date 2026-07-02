import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import client from '@/apollo-client';
import { GetVmHealthStatusDocument } from '@/gql/hooks';

// Maps a backend autocheck checkName to the category buckets that
// ProblemTransformationService understands ('updates' | 'security' | 'storage' |
// 'performance' | 'applications' | 'firewall'). Anything unrecognised falls back
// to 'system' (ProblemTransformationService -> ProblemCategory.SYSTEM, which the
// priority service treats as INFORMATIONAL).
//
// Keys are the snake_case string VALUES of the backend HealthCheckName enum
// (backend/app/graphql/types/HealthCheckTypes.ts). getVMHealthStatus emits
// checkName straight from the InfiniService "RunAllHealthChecks" response keys,
// so these are the strings that actually arrive.
const CHECK_NAME_CATEGORY_MAP = {
  // Disk and storage
  disk_space: 'storage',
  disk_health: 'storage',
  disk_fragmentation: 'storage',
  // Updates
  windows_updates: 'updates',
  update_services: 'updates',
  // Security
  security_updates: 'security',
  windows_defender: 'security',
  event_log_errors: 'security',
  // Firewall
  firewall_status: 'firewall',
  // Performance and resources
  resource_optimization: 'performance',
  memory_usage: 'performance',
  cpu_usage: 'performance',
  performance_counters: 'performance',
  system_temperature: 'performance',
  boot_time: 'performance',
  // Applications and services
  application_health: 'applications',
  critical_services: 'applications',
  startup_programs: 'applications',
  // System (explicit; would fall through to 'system' anyway)
  system_files: 'system',
  registry_health: 'system',
  network_connectivity: 'system',
};

const deriveCategory = (checkName) => {
  if (!checkName) return 'system';
  const key = String(checkName).toLowerCase();
  if (CHECK_NAME_CATEGORY_MAP[key]) return CHECK_NAME_CATEGORY_MAP[key];
  // Heuristic fallback for any check name not in the canonical enum, so a new
  // backend check still lands in a sensible bucket instead of silently breaking.
  if (key.includes('firewall')) return 'firewall';
  if (key.includes('defender') || key.includes('security') || key.includes('antivirus') || key.includes('event_log')) return 'security';
  if (key.includes('disk') || key.includes('storage')) return 'storage';
  if (key.includes('update')) return 'updates';
  if (key.includes('cpu') || key.includes('memory') || key.includes('performance') || key.includes('resource') || key.includes('temperature') || key.includes('boot')) return 'performance';
  if (key.includes('service') || key.includes('application') || key.includes('startup') || key.includes('app')) return 'applications';
  return 'system';
};

// HealthCheckSeverity -> autoChecks status. PASSED is intentionally absent: a
// passing check is not a problem and must be skipped.
const SEVERITY_STATUS_MAP = {
  FAILED: 'failed',
  WARNING: 'warning',
  INFO: 'info',
};

/**
 * Convert HealthCheckStatus.checks[] into the autoChecks OBJECT (keyed by id)
 * that useVMProblems / ProblemTransformationService expect.
 * - Skips PASSED checks.
 * - id is `${checkName}-${i}` to guarantee uniqueness across duplicate names.
 */
const mapChecksToAutoChecks = (checks = []) => {
  const result = {};
  checks.forEach((check, i) => {
    if (!check) return;
    const status = SEVERITY_STATUS_MAP[check.severity];
    if (!status) return; // skips PASSED and any unknown severity
    const id = `${check.checkName}-${i}`;
    result[id] = {
      id,
      checkName: check.checkName,
      category: deriveCategory(check.checkName),
      status,
      message: check.message,
      timestamp: check.timestamp,
    };
  });
  return result;
};

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
  // Per-VM snapshot loading/error, so concurrent snapshots for different VMs
  // don't race a single shared flag. Keyed by vmId like lastUpdated.
  loadingByVm: {},
  errorByVm: {},
  lastUpdated: {},
};

// Async thunks
// Fetch a one-shot health snapshot for a VM via getVMHealthStatus and normalise
// it into the slice's vmHealthData + autoChecks shape (see fulfilled reducer).
export const fetchVMHealthSnapshot = createAsyncThunk(
  'health/fetchVMHealthSnapshot',
  async ({ vmId }) => {
    const { data } = await client.query({
      query: GetVmHealthStatusDocument,
      variables: { vmId },
      fetchPolicy: 'network-only',
    });

    return { vmId, status: data.getVMHealthStatus };
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
    // Fetch VM health snapshot
    builder
      .addCase(fetchVMHealthSnapshot.pending, (state, action) => {
        const { vmId } = action.meta.arg;
        state.isLoading = true;
        state.error = null;
        state.loadingByVm[vmId] = true;
        state.errorByVm[vmId] = null;
      })
      .addCase(fetchVMHealthSnapshot.fulfilled, (state, action) => {
        const { vmId, status } = action.payload;
        state.loadingByVm[vmId] = false;
        state.errorByVm[vmId] = null;
        if (status) {
          state.vmHealthData[vmId] = {
            id: vmId,
            lastUpdated: status.timestamp,
            overallScore: status.overallScore,
            success: status.success,
          };

          // MERGE, never clobber: realTimeReduxService seeds issue-detected
          // entries into the same autoChecks[vmId] map. Snapshot ids are
          // `${checkName}-${i}` and realtime ids are `${issueType}-${Date.now()}`,
          // so they coexist without collisions.
          const mappedChecks = mapChecksToAutoChecks(status.checks);
          state.autoChecks[vmId] = {
            ...(state.autoChecks[vmId] || {}),
            ...mappedChecks,
          };

          state.lastUpdated[vmId] = Date.now();
        }
        state.isLoading = false;
      })
      .addCase(fetchVMHealthSnapshot.rejected, (state, action) => {
        const { vmId } = action.meta.arg;
        const message = action.error.message;
        state.error = message;
        state.isLoading = false;
        state.loadingByVm[vmId] = false;
        state.errorByVm[vmId] = message;
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
// Per-VM snapshot loading/error, so a component can render a skeleton / inline
// error + retry scoped to the VM it is showing.
export const selectVMHealthLoading = (state, vmId) => !!state.health.loadingByVm[vmId];
export const selectVMHealthError = (state, vmId) => state.health.errorByVm[vmId] || null;

// Export reducer
export default healthSlice.reducer;