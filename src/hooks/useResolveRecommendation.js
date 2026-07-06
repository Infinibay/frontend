import { useCallback, useEffect, useRef, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery, useApolloClient } from '@apollo/client/react';
import { toast } from '@/hooks/use-toast';
import useRemediationEvents from '@/hooks/useRemediationEvents';

const RESOLUTION_FIELDS = gql`
  fragment RecommendationResolutionFields on RecommendationResolutionType {
    id
    recommendationId
    machineId
    actionKey
    status
    progress
    progressMessage
    result
    error
    startedAt
    completedAt
    createdAt
    updatedAt
  }
`;

const RESOLVE_RECOMMENDATION = gql`
  mutation resolveRecommendation(
    $id: ID!
    $actionKey: String!
    $params: ResolveRecommendationParamsInput
  ) {
    resolveRecommendation(id: $id, actionKey: $actionKey, params: $params) {
      ...RecommendationResolutionFields
    }
  }
  ${RESOLUTION_FIELDS}
`;

const RECOMMENDATION_RESOLUTION = gql`
  query recommendationResolution($id: ID!) {
    recommendationResolution(id: $id) {
      ...RecommendationResolutionFields
    }
  }
  ${RESOLUTION_FIELDS}
`;

const CANCEL_RESOLUTION = gql`
  mutation cancelResolution($id: ID!) {
    cancelResolution(id: $id) {
      ...RecommendationResolutionFields
    }
  }
  ${RESOLUTION_FIELDS}
`;

const TERMINAL_STATUSES = new Set(['SUCCEEDED', 'FAILED', 'CANCELLED', 'REQUIRES_REBOOT']);

export const isTerminalStatus = (status) => TERMINAL_STATUSES.has(status);

/**
 * Hook to trigger an auto-resolve on a recommendation and track it. Refetches the
 * resolution when a remediation lifecycle event for it arrives over Socket.IO
 * (no polling). Emits a toast on terminal transition and exposes a cancel().
 */
const useResolveRecommendation = (recommendationId) => {
  const [resolutionId, setResolutionId] = useState(null);
  const client = useApolloClient();

  const [resolveMutation, { loading: isStarting }] = useMutation(RESOLVE_RECOMMENDATION);
  const [cancelMutation, { loading: isCancelling }] = useMutation(CANCEL_RESOLUTION);

  const pollQuery = useQuery(RECOMMENDATION_RESOLUTION, {
    variables: { id: resolutionId },
    skip: !resolutionId,
    fetchPolicy: 'cache-and-network',
  });

  const resolution = pollQuery.data?.recommendationResolution || null;

  // Refetch on remediation lifecycle events for THIS recommendation instead of
  // polling. The backend emits started/succeeded/failed/requires-reboot/cancelled
  // over Socket.IO; progress % isn't streamed, so the badge moves start → terminal.
  useRemediationEvents(null, (action, data) => {
    const result = data?.data?.result;
    if (!result || result.recommendationId !== recommendationId) return;
    // Adopt a resolution started for this recommendation even if we didn't fire it
    // (e.g. triggered from another surface). Only on 'started' so we don't re-adopt
    // and re-toast a run that already finished elsewhere.
    if (!resolutionId) {
      if (action === 'started' && result.resolutionId) setResolutionId(result.resolutionId);
      return;
    }
    pollQuery.refetch?.();
  });

  // Keep a stable handle to stopPolling so the terminal effect doesn't need the
  // whole (per-render) pollQuery object in its dependency array.
  const stopPollingRef = useRef(pollQuery.stopPolling);
  stopPollingRef.current = pollQuery.stopPolling;

  // Guard against re-firing the terminal toast. fetchPolicy: 'network-only'
  // yields a new `resolution` identity on every poll response (and any consumer
  // re-render re-runs this effect), so without a fired-once guard the same
  // 'Action completed/failed' toast would fire repeatedly. We key on the
  // resolution id + status and only toast on an unseen terminal transition.
  const lastToastedRef = useRef(null);

  const currentResolutionId = resolution?.id;
  const resolutionStatus = resolution?.status;

  useEffect(() => {
    if (!currentResolutionId || !resolutionStatus) return;
    if (!isTerminalStatus(resolutionStatus)) return;

    stopPollingRef.current?.();

    const toastKey = `${currentResolutionId}:${resolutionStatus}`;
    if (lastToastedRef.current === toastKey) return;
    lastToastedRef.current = toastKey;

    if (resolutionStatus === 'SUCCEEDED') {
      toast({
        title: 'Action completed',
        description: resolution?.progressMessage || 'The recommendation was resolved.',
        variant: 'success',
      });
      // Optimistically drop the resolved recommendation so its card disappears
      // immediately, instead of lingering until the next 60s poll. The backend
      // also sets dismissedAt + a suppression window on SUCCEEDED, so the filtered
      // getVMRecommendations query won't re-surface it until it genuinely recurs.
      // (Deliberately NOT done for REQUIRES_REBOOT — that stays visible by design.)
      const cacheId = client.cache.identify({
        __typename: 'VMRecommendationType',
        id: recommendationId,
      });
      if (cacheId) {
        client.cache.evict({ id: cacheId });
        client.cache.gc();
      }
    } else if (resolutionStatus === 'REQUIRES_REBOOT') {
      toast({
        title: 'Reboot required',
        description: resolution?.progressMessage || 'Updates installed. Reboot the VM to finish.',
        variant: 'warning',
      });
    } else if (resolutionStatus === 'FAILED') {
      toast({
        title: 'Action failed',
        description: resolution?.error || 'The action could not be completed.',
        variant: 'error',
      });
    }
    // resolution is intentionally not a dep: we react to id/status transitions
    // only, and read the latest resolution fields at fire time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentResolutionId, resolutionStatus]);

  const resolve = useCallback(
    async (actionKey, params) => {
      try {
        const { data } = await resolveMutation({
          variables: { id: recommendationId, actionKey, params: params || null },
        });
        const newResolution = data?.resolveRecommendation;
        if (newResolution?.id) {
          setResolutionId(newResolution.id);
          toast({
            title: 'Action started',
            description: 'Your request was sent to the VM. Tracking progress…',
            variant: 'info',
          });
        }
        return newResolution;
      } catch (err) {
        toast({
          title: 'Could not start action',
          description: err?.message || 'Unknown error',
          variant: 'destructive',
        });
        throw err;
      }
    },
    [resolveMutation, recommendationId],
  );

  const cancel = useCallback(
    async (id) => {
      // Prefer an explicit id (e.g. a resolution rehydrated from the server after a
      // refresh, which this hook never tracked) and fall back to the tracked one.
      const targetId = id || resolutionId;
      if (!targetId) return;
      try {
        await cancelMutation({ variables: { id: targetId } });
        setResolutionId(targetId); // track it so the CANCELLED transition shows here
        toast({
          title: 'Cancelling…',
          description: 'Requested cancellation of the running action.',
          variant: 'info',
        });
      } catch (err) {
        toast({
          title: 'Could not cancel',
          description: err?.message || 'Unknown error',
          variant: 'destructive',
        });
      }
    },
    [cancelMutation, resolutionId],
  );

  const reset = useCallback(() => {
    lastToastedRef.current = null;
    setResolutionId(null);
  }, []);

  return {
    resolve,
    cancel,
    reset,
    resolution,
    isStarting,
    isCancelling,
    isRunning: resolution ? !isTerminalStatus(resolution.status) : false,
    status: resolution?.status || null,
    progress: resolution?.progress || 0,
    progressMessage: resolution?.progressMessage || null,
    error: resolution?.error || null,
  };
};

export default useResolveRecommendation;
