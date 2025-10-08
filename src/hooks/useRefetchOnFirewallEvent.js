import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:hooks:useRefetchOnFirewallEvent');

/**
 * Hook to automatically refetch queries when firewall rules change via WebSocket events
 *
 * @param {Function} refetch - Apollo query refetch function
 * @param {Object} options - Configuration options
 * @param {string} options.departmentId - Department ID to watch for changes (optional)
 * @param {string} options.vmId - VM ID to watch for changes (optional)
 */
export const useRefetchOnFirewallEvent = (refetch, { departmentId, vmId } = {}) => {
  // Listen to firewall events from Redux
  const firewallEvent = useSelector(state => state.firewall?.lastEvent);

  useEffect(() => {
    if (!firewallEvent) return;

    const shouldRefetch =
      (departmentId && firewallEvent.departmentId === departmentId) ||
      (vmId && firewallEvent.vmId === vmId);

    if (shouldRefetch) {
      debug.log('Firewall event detected, refetching:', {
        action: firewallEvent.action,
        departmentId: firewallEvent.departmentId,
        vmId: firewallEvent.vmId,
        filterId: firewallEvent.filterId
      });

      // Refetch the query
      refetch();
    }
  }, [firewallEvent, refetch, departmentId, vmId]);
};

export default useRefetchOnFirewallEvent;
