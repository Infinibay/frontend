import { useState, useEffect } from 'react';
import { useTopProcessesByMachineQuery } from '@/gql/hooks/useMetricsQueries';

const useVMProcesses = (vmId, limit = 10) => {
  const [processes, setProcesses] = useState([]);
  
  // Use GraphQL query to fetch processes
  // Only fetch if VM is running
  const { data, loading, error, refetch } = useTopProcessesByMachineQuery({
    variables: { 
      machineId: vmId,
      limit: limit 
    },
    skip: !vmId,
    fetchPolicy: 'network-only',
    pollInterval: 10000, // Poll every 10 seconds
  });

  useEffect(() => {
    if (!vmId) {
      // If no vmId (VM is off), clear processes
      setProcesses([]);
      return;
    }
    
    if (data?.topProcessesByMachine) {
      // Processes are already sorted by CPU usage from the backend
      const formattedProcesses = data.topProcessesByMachine.map(process => ({
        id: process.id,
        pid: process.id, // Use id as pid for compatibility
        name: process.name,
        cpuUsage: process.cpuUsagePercent,
        memoryUsage: (process.memoryUsageKB / 1024).toFixed(1), // Convert to MB
        memoryUsageKB: process.memoryUsageKB,
        status: 'running', // All processes from this query are running
        user: 'system', // TODO: Get actual user from process data
        command: process.commandLine || process.executablePath || process.name
      }));
      setProcesses(formattedProcesses);
    } else if (!loading && !error) {
      // If no data, set empty array
      setProcesses([]);
    }
  }, [data, loading, error, vmId]);

  return {
    processes,
    loading,
    error,
    refetch
  };
};

export default useVMProcesses;