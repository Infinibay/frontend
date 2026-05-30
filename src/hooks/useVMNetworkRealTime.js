/**
 * Hook for real-time VM network information updates
 */

import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectVmsState } from '@/state/slices/vms';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:vm:network-realtime');

/**
 * Hook that provides real-time network information for a VM
 * @param {string} vmId - The VM ID to monitor
 * @returns {Object} VM network information with real-time updates
 */
export const useVMNetworkRealTime = (vmId) => {
  const vmsState = useSelector(selectVmsState);
  const [previousIPs, setPreviousIPs] = useState({ localIP: null, publicIP: null });
  const [hasIPUpdated, setHasIPUpdated] = useState(false);

  // Find the current VM from the Redux state
  const vm = useMemo(() => {
    const listedVm = vmsState.items.find(machine => machine.id === vmId);
    if (listedVm) return listedVm;
    return vmsState.selectedMachine?.id === vmId ? vmsState.selectedMachine : null;
  }, [vmsState.items, vmsState.selectedMachine, vmId]);

  // Current IP values
  const currentIPs = useMemo(() => ({
    localIP: vm?.localIP || null,
    publicIP: vm?.publicIP || null
  }), [vm?.localIP, vm?.publicIP]);

  // Check for IP changes and trigger update indicator
  useEffect(() => {
    if (!vm) return;

    const hasLocalIPChanged = previousIPs.localIP !== currentIPs.localIP;
    const hasPublicIPChanged = previousIPs.publicIP !== currentIPs.publicIP;

    if (hasLocalIPChanged || hasPublicIPChanged) {
      debug.info('IP updated', {
        vmId,
        vmName: vm.name,
        previous: previousIPs,
        current: currentIPs,
        localChanged: hasLocalIPChanged,
        publicChanged: hasPublicIPChanged
      });

      // Update previous IPs
      setPreviousIPs(currentIPs);

      // Set update indicator
      setHasIPUpdated(true);

      // Clear update indicator after 3 seconds
      const timer = setTimeout(() => {
        setHasIPUpdated(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [currentIPs, previousIPs, vm, vmId]);

  // Initialize previous IPs on first load
  useEffect(() => {
    if (vm && !previousIPs.localIP && !previousIPs.publicIP) {
      setPreviousIPs(currentIPs);
    }
  }, [currentIPs, previousIPs.localIP, previousIPs.publicIP, vm]);

  return {
    vm,
    networkInfo: {
      localIP: currentIPs.localIP,
      publicIP: currentIPs.publicIP,
      hasConnection: !!(currentIPs.localIP || currentIPs.publicIP),
      isOnline: vm?.status === 'running',
      hasIPUpdated, // Indicates if IP was recently updated
    },
    // Helper functions
    hasNetworkInfo: !!(currentIPs.localIP || currentIPs.publicIP),
    isConnected: vm?.status === 'running' && !!(currentIPs.localIP || currentIPs.publicIP),

    // Status indicators
    connectionStatus: vm?.status === 'running'
      ? (currentIPs.localIP || currentIPs.publicIP ? 'connected' : 'connecting')
      : 'offline'
  };
};

export default useVMNetworkRealTime;
