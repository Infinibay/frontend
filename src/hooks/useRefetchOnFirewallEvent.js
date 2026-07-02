import { useEffect, useRef } from 'react';
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

  // Baseline captured at mount. The firewall slice keeps `lastEvent` until the
  // next event arrives, so without this a component mounting AFTER an event was
  // dispatched would replay that stale event and fire a spurious refetch of data
  // it just fetched. We only react to events newer than mount.
  const mountTimeRef = useRef(Date.now());

  // Subscribe to the full event; its reference only changes when a new event is
  // dispatched (the slice replaces the object), so this alone drives the effect.
  const lastEvent = useSelector(state => state.firewall?.lastEvent);

  useEffect(() => {
    if (!lastEvent?.timestamp) return;

    // Ignore stale events that predate this hook instance mounting.
    if (lastEvent.timestamp <= mountTimeRef.current) return;

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

      // Use ref to avoid including refetch in dependency array. Apollo's refetch
      // rejects on network/GraphQL errors — swallow it (with a debug log) so it
      // doesn't surface as an unhandled promise rejection.
      Promise.resolve(refetchRef.current?.()).catch((err) => {
        debug.warn('Refetch after firewall event failed:', err?.message || err);
      });
    }
  }, [lastEvent]);
};

export default useRefetchOnFirewallEvent;
