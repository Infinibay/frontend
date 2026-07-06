import { useEffect, useRef } from 'react';
import { getSocketService } from '@/services/socketService';

// Wire actions emitted by the backend for a recommendation resolution's lifecycle
// (RecommendationResolverService.emitRemediation → VmEventManager → 'remediation'
// resource). Progress is NOT streamed — only these transitions — so consumers
// refetch the resolution from GraphQL when one fires instead of polling.
const REMEDIATION_ACTIONS = [
  'started',
  'succeeded',
  'failed',
  'requires-reboot',
  'cancelled',
];

/**
 * Subscribe to remediation lifecycle socket events for a given VM. Calls
 * `onEvent(action, data)` for each event whose payload vmId matches (or when no
 * vmId is provided). Returns nothing; cleans up the subscription on unmount.
 *
 * @param {string} vmId - only deliver events for this machine (null = all)
 * @param {(action: string, data: any) => void} onEvent
 */
const useRemediationEvents = (vmId, onEvent) => {
  const cbRef = useRef(onEvent);
  cbRef.current = onEvent;

  useEffect(() => {
    const socket = getSocketService();
    if (!socket) return undefined;
    const unsubscribe = socket.subscribeToAllResourceEvents(
      'remediation',
      (action, data) => {
        // Envelope: { status, data: { vmId, vmName, actionType, result }, timestamp }
        const eventVmId = data?.data?.vmId;
        if (vmId && eventVmId && eventVmId !== vmId) return;
        cbRef.current?.(action, data);
      },
      REMEDIATION_ACTIONS,
    );
    return unsubscribe;
  }, [vmId]);
};

export default useRemediationEvents;
