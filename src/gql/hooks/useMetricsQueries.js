import { gql, useQuery } from '@apollo/client';

// Query for latest system metrics
const LATEST_SYSTEM_METRICS_QUERY = gql`
  query latestSystemMetrics($machineId: String!) {
    latestSystemMetrics(machineId: $machineId) {
      id
      machineId
      timestamp
      cpuUsagePercent
      cpuCoresUsage
      cpuTemperature
      totalMemoryKB
      usedMemoryKB
      availableMemoryKB
      swapTotalKB
      swapUsedKB
      diskUsageStats
      diskIOStats
      networkStats
      uptime
      loadAverage
    }
  }
`;

// Query for machine metrics summary
const MACHINE_METRICS_SUMMARY_QUERY = gql`
  query machineMetricsSummary($machineId: String!) {
    machineMetricsSummary(machineId: $machineId) {
      machineId
      latestSystemMetrics {
        id
        machineId
        timestamp
        cpuUsagePercent
        cpuCoresUsage
        cpuTemperature
        totalMemoryKB
        usedMemoryKB
        availableMemoryKB
        swapTotalKB
        swapUsedKB
        diskUsageStats
        diskIOStats
        networkStats
        uptime
        loadAverage
      }
      totalDataPoints
      firstDataPoint
      lastDataPoint
      activeProcessCount
      openPortsCount
      installedApplicationsCount
    }
  }
`;

// Query for top processes
const TOP_PROCESSES_BY_MACHINE_QUERY = gql`
  query topProcessesByMachine($machineId: String!, $limit: Float) {
    topProcessesByMachine(machineId: $machineId, limit: $limit) {
      id
      machineId
      timestamp
      parentPid
      name
      executablePath
      commandLine
      cpuUsagePercent
      memoryUsageKB
      diskReadBytes
      diskWriteBytes
      startTime
    }
  }
`;

// Export hooks
export const useLatestSystemMetricsQuery = (options) => {
  return useQuery(LATEST_SYSTEM_METRICS_QUERY, options);
};

export const useMachineMetricsSummaryQuery = (options) => {
  return useQuery(MACHINE_METRICS_SUMMARY_QUERY, options);
};

export const useTopProcessesByMachineQuery = (options) => {
  return useQuery(TOP_PROCESSES_BY_MACHINE_QUERY, options);
};