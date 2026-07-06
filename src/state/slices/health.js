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
    const { data, error } = await client.query({
      query: GetVmHealthStatusDocument,
      variables: { vmId },
      fetchPolicy: 'network-only',
    });

    // errorPolicy is 'all' app-wide (see apollo-client.js), so a GraphQL error
    // resolves with data === undefined instead of throwing. Reading
    // `data.getVMHealthStatus` blindly then threw an opaque "Cannot read
    // properties of undefined (reading 'getVMHealthStatus')" — surface a clean,
    // actionable message via the thunk's rejected path instead.
    const status = data?.getVMHealthStatus;
    if (!status) {
      throw new Error(error?.message || 'Health status is not available yet.');
    }

    return { vmId, status };
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

    // Set live resource metrics for a VM (from the realtime 'metrics:update'
    // socket event; see realTimeReduxService.handleMetricsEvent). MERGE into the
    // existing vmHealthData record so health-snapshot fields (overallScore,
    // checks) seeded elsewhere survive — and, symmetrically, the snapshot
    // reducer preserves `metrics` via its `...(prev||{})` spread. VMOverviewTab
    // reads state.health.vmHealthData[vmId].metrics.{cpu,memory,storage,network}.
    setVMMetrics: (state, action) => {
      const { vmId, metrics } = action.payload;
      const prev = state.vmHealthData[vmId] || { id: vmId };
      state.vmHealthData[vmId] = { ...prev, metrics };
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
        // Per-VM ONLY. A global isLoading/error here made one VM's snapshot fetch
        // re-render (and, via `loading` guards, blank) every OTHER VM's problems
        // panel. The per-VM maps scope loading/error to the VM being shown.
        state.loadingByVm[vmId] = true;
        state.errorByVm[vmId] = null;
      })
      .addCase(fetchVMHealthSnapshot.fulfilled, (state, action) => {
        const { vmId, status } = action.payload;
        state.loadingByVm[vmId] = false;
        state.errorByVm[vmId] = null;
        if (status) {
          // Merge over the prior record (preserves fields seeded elsewhere, e.g.
          // `name`/`metrics`) and SKIP the write when the snapshot is unchanged, so
          // the object reference stays stable across no-op refreshes. A fresh
          // reference every refetch needlessly re-rendered/re-animated every
          // consumer (ResourceMeter, health badges) — part of the flicker.
          const prev = state.vmHealthData[vmId];
          const next = {
            ...(prev || {}),
            id: vmId,
            lastUpdated: status.timestamp,
            overallScore: status.overallScore,
            success: status.success,
          };
          if (
            !prev ||
            prev.lastUpdated !== next.lastUpdated ||
            prev.overallScore !== next.overallScore ||
            prev.success !== next.success
          ) {
            state.vmHealthData[vmId] = next;
          }

          // MERGE, never clobber: realTimeReduxService seeds issue-detected
          // entries (id `${vmId}:${issueType}`) into the same autoChecks[vmId] map;
          // snapshot ids are `${checkName}-${i}`, so they coexist. REUSE the prior
          // per-check object reference when its fields are unchanged so identical
          // snapshots don't churn identity and re-trigger useVMProblems' memos.
          const mappedChecks = mapChecksToAutoChecks(status.checks);
          const prevChecks = state.autoChecks[vmId] || {};
          const mergedChecks = { ...prevChecks };
          let checksChanged = false;
          for (const [id, check] of Object.entries(mappedChecks)) {
            const prevCheck = prevChecks[id];
            if (
              prevCheck &&
              prevCheck.status === check.status &&
              prevCheck.message === check.message &&
              prevCheck.category === check.category &&
              prevCheck.checkName === check.checkName
            ) {
              mergedChecks[id] = prevCheck; // unchanged — keep old reference
            } else {
              mergedChecks[id] = check;
              checksChanged = true;
            }
          }
          if (checksChanged) {
            state.autoChecks[vmId] = mergedChecks;
          }

          state.lastUpdated[vmId] = Date.now();
        }
      })
      .addCase(fetchVMHealthSnapshot.rejected, (state, action) => {
        const { vmId } = action.meta.arg;
        // Per-VM ONLY (see pending) — no global error write.
        state.loadingByVm[vmId] = false;
        state.errorByVm[vmId] = action.error.message;
      });
  },
});

// Export actions
export const {
  setVMHealthData,
  setVMMetrics,
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
// Stable empty reference so a VM with no checks doesn't hand consumers a fresh
// `{}` every call (which would defeat downstream memoization).
const EMPTY_CHECKS = Object.freeze({});
export const selectVMHealthData = (state, vmId) => state.health.vmHealthData[vmId];
export const selectVMAutoChecks = (state, vmId) => state.health.autoChecks[vmId] || EMPTY_CHECKS;
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