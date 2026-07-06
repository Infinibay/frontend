import { useMemo } from 'react';
import {
  useCreateDepartmentFirewallRuleMutation,
  useCreateVmFirewallRuleMutation,
  useDeleteFirewallRuleMutation,
  useGetDepartmentFirewallRulesQuery,
  useGetEffectiveFirewallRulesQuery,
  useGetVmFirewallRulesQuery
} from '@/gql/hooks';
import { ENTITY_TYPES, getEntityConfig } from '@/config/firewallEntityConfig';
import { useRefetchOnFirewallEvent } from '@/hooks/useRefetchOnFirewallEvent';

/**
 * Hook unificado para manejo de datos de firewall
 * Maneja tanto department como VM basado en entityType
 *
 * @param {Object} params
 * @param {string} params.entityType - ENTITY_TYPES.DEPARTMENT or ENTITY_TYPES.VM
 * @param {string} params.entityId - ID of the department or VM
 * @param {string} params.departmentId - Department ID (optional, for VM context)
 * @returns {Object} Firewall data, mutations, and configuration
 */
export const useFirewallData = ({ entityType, entityId, departmentId }) => {
  const config = getEntityConfig(entityType);

  // Department queries
  const departmentQuery = useGetDepartmentFirewallRulesQuery({
    variables: { departmentId: entityId },
    skip: entityType !== ENTITY_TYPES.DEPARTMENT || !entityId,
  });

  // VM queries
  const vmQuery = useGetVmFirewallRulesQuery({
    variables: { vmId: entityId },
    skip: entityType !== ENTITY_TYPES.VM || !entityId,
  });

  const effectiveQuery = useGetEffectiveFirewallRulesQuery({
    variables: { vmId: entityType === ENTITY_TYPES.VM ? entityId : '' },
    skip: entityType !== ENTITY_TYPES.VM || !entityId || !config.showEffectiveRules,
  });

  // Select appropriate query based on entity type
  const primaryQuery = entityType === ENTITY_TYPES.DEPARTMENT ? departmentQuery : vmQuery;

  // Mutations - NO refetchQueries here, real-time events handle updates
  const [createDeptRule] = useCreateDepartmentFirewallRuleMutation();
  const [createVmRule] = useCreateVmFirewallRuleMutation();
  const [deleteRule] = useDeleteFirewallRuleMutation();

  const createRule = entityType === ENTITY_TYPES.DEPARTMENT ? createDeptRule : createVmRule;

  // Auto-refetch on WebSocket events - queries refetch automatically
  const refetchFilter = entityType === ENTITY_TYPES.DEPARTMENT
    ? { departmentId: entityId }
    : { vmId: entityId };

  // Refetch both queries when firewall events occur
  useRefetchOnFirewallEvent(() => {
    if (primaryQuery.refetch) {
      primaryQuery.refetch();
    }
    if (effectiveQuery.refetch) {
      effectiveQuery.refetch();
    }
  }, refetchFilter);

  // Extract data
  const rules = useMemo(() => {
    if (entityType === ENTITY_TYPES.DEPARTMENT) {
      return primaryQuery.data?.getDepartmentFirewallRules?.rules || [];
    }
    return primaryQuery.data?.getVMFirewallRules?.rules || [];
  }, [entityType, primaryQuery.data]);

  const effectiveRules = useMemo(() => {
    if (entityType !== ENTITY_TYPES.VM || !effectiveQuery.data) return [];
    return effectiveQuery.data?.getEffectiveFirewallRules?.effectiveRules || [];
  }, [entityType, effectiveQuery.data]);

  const departmentRules = useMemo(() => {
    if (entityType !== ENTITY_TYPES.VM || !effectiveQuery.data) return [];
    return effectiveQuery.data?.getEffectiveFirewallRules?.departmentRules || [];
  }, [entityType, effectiveQuery.data]);

  const conflicts = useMemo(() => {
    if (entityType !== ENTITY_TYPES.VM || !effectiveQuery.data) return [];
    return effectiveQuery.data?.getEffectiveFirewallRules?.conflicts || [];
  }, [entityType, effectiveQuery.data]);

  return {
    // Data
    conflicts,
    departmentRules,
    effectiveRules,
    rules,

    // Loading states
    error: primaryQuery.error || effectiveQuery.error,
    loading: primaryQuery.loading || effectiveQuery.loading,
    // First-load-only flag: true ONLY while there is genuinely nothing to show yet
    // (data === undefined). Socket-driven background refetches keep this false, so
    // the rules table updates in place instead of blanking to skeletons on every
    // firewall event. (A VM with zero rules is a valid loaded state — gate on
    // `data === undefined`, never on rules.length.)
    initialLoading:
      (primaryQuery.loading && primaryQuery.data === undefined) ||
      (effectiveQuery.loading && effectiveQuery.data === undefined),
    // True once any underlying query has returned (even an empty result), so a
    // transient background error can be shown inline instead of tearing down the
    // already-rendered table.
    hasLoaded: primaryQuery.data !== undefined || effectiveQuery.data !== undefined,

    // Actions
    createRule,
    deleteRule,
    refetch: async () => {
      await primaryQuery.refetch();
      if (effectiveQuery.refetch) await effectiveQuery.refetch();
    },

    // Config
    config
  };
};

export default useFirewallData;
