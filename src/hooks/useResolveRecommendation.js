import { useCallback, useEffect, useRef, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { toast } from '@/hooks/use-toast';

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

const TERMINAL_STATUSES = new Set(['SUCCEEDED', 'FAILED', 'CANCELLED', 'REQUIRES_REBOOT']);

export const isTerminalStatus = (status) => TERMINAL_STATUSES.has(status);

/**
 * Hook to trigger an auto-resolve on a recommendation and track its progress.
 *
 * Polls the resolution row every 2s while it's non-terminal. Emits a toast on
 * terminal transition.
 */
const useResolveRecommendation = (recommendationId) => {
  const [resolutionId, setResolutionId] = useState(null);

  const [resolveMutation, { loading: isStarting }] = useMutation(RESOLVE_RECOMMENDATION);

  const pollQuery = useQuery(RECOMMENDATION_RESOLUTION, {
    variables: { id: resolutionId },
    skip: !resolutionId,
    pollInterval: resolutionId ? 2000 : 0,
    fetchPolicy: 'network-only',
  });

  const resolution = pollQuery.data?.recommendationResolution || null;

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

  const reset = useCallback(() => {
    lastToastedRef.current = null;
    setResolutionId(null);
  }, []);

  return {
    resolve,
    reset,
    resolution,
    isStarting,
    isRunning: resolution ? !isTerminalStatus(resolution.status) : false,
    status: resolution?.status || null,
    progress: resolution?.progress || 0,
    progressMessage: resolution?.progressMessage || null,
    error: resolution?.error || null,
  };
};

export default useResolveRecommendation;
