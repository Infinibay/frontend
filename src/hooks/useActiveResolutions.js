import { useMemo } from 'react';
import { useActiveResolutionsForMachineQuery } from '@/gql/hooks';
import useRemediationEvents from '@/hooks/useRemediationEvents';

/**
 * Fetches the machine's in-flight (PENDING/RUNNING) recommendation resolutions and
 * exposes them keyed by recommendationId. Used to keep per-recommendation action
 * buttons disabled while their resolution is running — including after a page
 * refresh, when the click-time hook state is gone but the server still has a
 * running row. Fetches once on mount, then refetches on remediation socket
 * events (no polling).
 *
 * @param {string} vmId
 * @returns {{ byRecommendationId: Map<string, object>, resolutions: object[] }}
 */
const useActiveResolutions = (vmId) => {
  const { data, refetch } = useActiveResolutionsForMachineQuery({
    variables: { machineId: vmId },
    skip: !vmId,
    fetchPolicy: 'cache-and-network',
  });

  // A lifecycle event means an active resolution just started or reached a
  // terminal state — refetch so the active set (and disabled buttons) update.
  useRemediationEvents(vmId, () => {
    if (vmId) refetch();
  });

  const resolutions = data?.activeResolutionsForMachine || [];

  const byRecommendationId = useMemo(() => {
    const map = new Map();
    resolutions.forEach((r) => {
      if (r?.recommendationId) map.set(r.recommendationId, r);
    });
    return map;
  }, [resolutions]);

  return { byRecommendationId, resolutions };
};

export default useActiveResolutions;
