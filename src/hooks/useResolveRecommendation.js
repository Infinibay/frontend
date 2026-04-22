import { useCallback, useEffect, useState } from 'react';
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

  useEffect(() => {
    if (!resolution) return;
    if (isTerminalStatus(resolution.status)) {
      pollQuery.stopPolling?.();
      if (resolution.status === 'SUCCEEDED') {
        toast({
          title: 'Action completed',
          description: resolution.progressMessage || 'The recommendation was resolved.',
          variant: 'default',
        });
      } else if (resolution.status === 'REQUIRES_REBOOT') {
        toast({
          title: 'Reboot required',
          description: resolution.progressMessage || 'Updates installed. Reboot the VM to finish.',
          variant: 'default',
        });
      } else if (resolution.status === 'FAILED') {
        toast({
          title: 'Action failed',
          description: resolution.error || 'The action could not be completed.',
          variant: 'destructive',
        });
      }
    }
  }, [resolution, pollQuery]);

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
            variant: 'default',
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
