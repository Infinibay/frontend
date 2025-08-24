import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLatestSystemMetricsQuery } from '@/gql/hooks/useMetricsQueries';

const useVMMetrics = (vmId) => {
  const [metrics, setMetrics] = useState({
    cpuUsage: 0,
    cpuTrend: 0,
    memoryUsage: 0,
    memoryUsed: 0,
    memoryTotal: 0,
    memoryTrend: 0,
    diskUsage: 0,
    diskUsed: 0,
    diskTotal: 0,
    diskTrend: 0,
    networkRate: '0 Mbps',
    networkIn: 0,
    networkOut: 0,
    os: 'Unknown',
    uptime: 'N/A',
    lastBoot: 'N/A',
    ipAddress: 'N/A',
    macAddress: 'N/A',
    hostname: 'N/A'
  });
  
  const [isMockData, setIsMockData] = useState(true); // Track if data is mock
  
  // Use GraphQL query to fetch real metrics
  const { data, loading, error } = useLatestSystemMetricsQuery({
    variables: { machineId: vmId },
    skip: !vmId,
    pollInterval: 5000, // Poll every 5 seconds
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (!vmId) {
      // If no vmId, reset metrics to zero
      setMetrics({
        cpuUsage: 0,
        cpuTrend: 0,
        memoryUsage: 0,
        memoryUsed: 0,
        memoryTotal: 0,
        memoryTrend: 0,
        diskUsage: 0,
        diskUsed: 0,
        diskTotal: 0,
        diskTrend: 0,
        networkRate: '0 Mbps',
        networkIn: 0,
        networkOut: 0,
        os: 'Unknown',
        uptime: 'N/A',
        lastBoot: 'N/A',
        ipAddress: 'N/A',
        macAddress: 'N/A',
        hostname: 'N/A'
      });
      setIsMockData(true);
      return;
    }

    // Process real data from GraphQL query
    if (data?.latestSystemMetrics) {
      const systemMetrics = data.latestSystemMetrics;
      
      // Convert KB to GB for memory
      const memoryTotalGB = (systemMetrics.totalMemoryKB / 1024 / 1024).toFixed(1);
      const memoryUsedGB = (systemMetrics.usedMemoryKB / 1024 / 1024).toFixed(1);
      const memoryUsagePercent = ((systemMetrics.usedMemoryKB / systemMetrics.totalMemoryKB) * 100).toFixed(0);
      
      // Parse disk usage from JSON
      let diskUsagePercent = 0;
      let diskUsedGB = 0;
      let diskTotalGB = 0;
      if (systemMetrics.diskUsageStats && typeof systemMetrics.diskUsageStats === 'object' && Object.keys(systemMetrics.diskUsageStats).length > 0) {
        // Assuming diskUsageStats has structure like { "/": { used: X, total: Y, percent: Z } }
        const rootDisk = systemMetrics.diskUsageStats['/'] || systemMetrics.diskUsageStats;
        if (rootDisk && rootDisk.percent !== undefined) {
          diskUsagePercent = rootDisk.percent || 0;
          diskUsedGB = rootDisk.used ? (rootDisk.used / 1024 / 1024 / 1024).toFixed(0) : 0;
          diskTotalGB = rootDisk.total ? (rootDisk.total / 1024 / 1024 / 1024).toFixed(0) : 0;
        }
      }
      
      // Parse network stats
      let networkIn = 0;
      let networkOut = 0;
      let networkRate = '0 Mbps';
      if (systemMetrics.networkStats && typeof systemMetrics.networkStats === 'object' && Object.keys(systemMetrics.networkStats).length > 0) {
        // Sum up all network interfaces
        try {
          for (const [iface, stats] of Object.entries(systemMetrics.networkStats)) {
            if (stats && stats.rx_bytes) networkIn += stats.rx_bytes;
            if (stats && stats.tx_bytes) networkOut += stats.tx_bytes;
          }
          // Convert to MB
          networkIn = (networkIn / 1024 / 1024).toFixed(0);
          networkOut = (networkOut / 1024 / 1024).toFixed(0);
        } catch (e) {
          console.error('Error parsing network stats:', e);
        }
      }
      
      // Format uptime
      const uptimeHours = Math.floor(systemMetrics.uptime / 3600);
      const uptimeDays = Math.floor(uptimeHours / 24);
      const uptimeString = uptimeDays > 0 ? `${uptimeDays}d ${uptimeHours % 24}h` : `${uptimeHours}h`;
      
      setMetrics({
        cpuUsage: Math.round(systemMetrics.cpuUsagePercent || 0),
        cpuTrend: 0, // TODO: Calculate trend from historical data
        memoryUsage: parseInt(memoryUsagePercent),
        memoryUsed: parseFloat(memoryUsedGB),
        memoryTotal: parseFloat(memoryTotalGB),
        memoryTrend: 0, // TODO: Calculate trend
        diskUsage: Math.round(diskUsagePercent),
        diskUsed: parseInt(diskUsedGB),
        diskTotal: parseInt(diskTotalGB),
        diskTrend: 0, // TODO: Calculate trend
        networkRate: networkRate,
        networkIn: parseInt(networkIn),
        networkOut: parseInt(networkOut),
        os: 'Linux', // TODO: Get from VM info
        uptime: uptimeString,
        lastBoot: new Date(Date.now() - systemMetrics.uptime * 1000).toLocaleString(),
        ipAddress: 'N/A', // TODO: Get from VM info
        macAddress: 'N/A', // TODO: Get from VM info
        hostname: 'N/A' // TODO: Get from VM info
      });
      
      setIsMockData(false);
    } else if (!loading && !data) {
      // No data available, show default values
      setIsMockData(true);
    }
  }, [vmId, data, loading]);

  return {
    metrics,
    loading,
    error,
    isMockData
  };
};

export default useVMMetrics;