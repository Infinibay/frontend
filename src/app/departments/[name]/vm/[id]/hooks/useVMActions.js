import { useState } from 'react';
import { 
  usePowerOnMutation,
  usePowerOffMutation,
  useSuspendMutation
} from '@/gql/hooks';

const useVMActions = (vmId) => {
  const [isLoading, setIsLoading] = useState(false);

  // GraphQL Mutations
  const [powerOn] = usePowerOnMutation();
  const [powerOff] = usePowerOffMutation();
  const [suspend] = useSuspendMutation();

  // Start VM
  const startVM = async () => {
    if (!vmId) throw new Error('VM ID is required');
    setIsLoading(true);
    try {
      const result = await powerOn({
        variables: { id: vmId }
      });
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      return result.data;
    } finally {
      setIsLoading(false);
    }
  };

  // Stop VM
  const stopVM = async () => {
    if (!vmId) throw new Error('VM ID is required');
    setIsLoading(true);
    try {
      const result = await powerOff({
        variables: { id: vmId }
      });
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      return result.data;
    } finally {
      setIsLoading(false);
    }
  };

  // Restart VM (using stop and start)
  const restartVM = async () => {
    if (!vmId) throw new Error('VM ID is required');
    setIsLoading(true);
    try {
      // Stop the VM first
      await stopVM();
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Start it again
      const result = await startVM();
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Force Stop VM (same as stop for now)
  const forceStopVM = async () => {
    return stopVM();
  };

  // Pause/Suspend VM
  const pauseVM = async () => {
    if (!vmId) throw new Error('VM ID is required');
    setIsLoading(true);
    try {
      const result = await suspend({
        variables: { id: vmId }
      });
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      return result.data;
    } finally {
      setIsLoading(false);
    }
  };

  // Create Snapshot (placeholder for now)
  const createSnapshot = async (name, description = '') => {
    if (!vmId) throw new Error('VM ID is required');
    if (!name) throw new Error('Snapshot name is required');
    
    // Placeholder - snapshot functionality will be added when mutation is available
    console.log('Creating snapshot:', name, description);
    return { success: true, message: 'Snapshot functionality coming soon' };
  };

  // Kill Process (placeholder for now)
  const killProcess = async (pid, force = false) => {
    if (!vmId) throw new Error('VM ID is required');
    if (!pid) throw new Error('Process ID is required');
    
    // Placeholder - kill process functionality will be added when mutation is available
    console.log('Killing process:', pid, force);
    return { success: true, message: 'Process management coming soon' };
  };

  return {
    startVM,
    stopVM,
    restartVM,
    forceStopVM,
    pauseVM,
    createSnapshot,
    killProcess,
    isLoading
  };
};

export default useVMActions;