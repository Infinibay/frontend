import { useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:hooks:useRefetchOnFirewallEvent');

/**
 * Hook to automatically refetch queries when firewall rules change via WebSocket events
 * Optimized to prevent unnecessary re-renders by using selective state subscription
 *
 * @param {Function} refetch - Apollo query refetch function
 * @param {Object} options - Configuration options
 * @param {string} options.departmentId - Department ID to watch for changes (optional)
 * @param {string} options.vmId - VM ID to watch for changes (optional)
 */
export const useRefetchOnFirewallEvent = (refetch, { departmentId, vmId } = {}) => {
  // Store refetch in a ref to avoid including it in dependency array
  const refetchRef = useRef(refetch);
  refetchRef.current = refetch;

  // Stable reference for IDs
  const departmentIdRef = useRef(departmentId);
  const vmIdRef = useRef(vmId);

  // Update refs when IDs change
  useEffect(() => {
    departmentIdRef.current = departmentId;
    vmIdRef.current = vmId;
  }, [departmentId, vmId]);

  // Only subscribe to timestamp to trigger effect when events occur
  // This prevents unnecessary re-renders when other event properties change
  const lastEventTimestamp = useSelector(
    state => state.firewall?.lastEvent?.timestamp,
    (prev, next) => prev === next // Only re-render if timestamp changes
  );

  // Get the full event data only when timestamp changes
  const lastEvent = useSelector(state => state.firewall?.lastEvent);

  useEffect(() => {
    if (!lastEvent || !lastEventTimestamp) return;

    const shouldRefetch =
      (departmentIdRef.current && lastEvent.departmentId === departmentIdRef.current) ||
      (vmIdRef.current && lastEvent.vmId === vmIdRef.current);

    if (shouldRefetch) {
      debug.log('Firewall event detected, refetching:', {
        action: lastEvent.action,
        departmentId: lastEvent.departmentId,
        vmId: lastEvent.vmId,
        ruleId: lastEvent.ruleId
      });

      // Use ref to avoid including refetch in dependency array
      refetchRef.current();
    }
  }, [lastEventTimestamp, lastEvent]);
};

export default useRefetchOnFirewallEvent;
