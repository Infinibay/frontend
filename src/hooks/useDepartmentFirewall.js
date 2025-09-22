/**
 * Custom hook for managing department firewall data and operations
 */

import { useMemo, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:hooks:useDepartmentFirewall');
import {
  filterRules,
  normalizeAction,
  normalizeDirection,
  formatRuleForDisplay
} from '../utils/firewallHelpers';

// GraphQL Documents
const GET_DEPARTMENT_FILTERS = gql`
  query listFilters($departmentId: ID!) {
    listFilters(departmentId: $departmentId) {
      id
      name
      description
      type
      rules {
        id
        protocol
        direction
        action
        priority
        ipVersion
        srcMacAddr
        srcIpAddr
        srcIpMask
        dstIpAddr
        dstIpMask
        srcPortStart
        srcPortEnd
        dstPortStart
        dstPortEnd
        state
        comment
        createdAt
        updatedAt
      }
      references
      createdAt
      updatedAt
    }
  }
`;

const GET_AVAILABLE_FIREWALL_TEMPLATES = gql`
  query getAvailableFirewallTemplates {
    getAvailableFirewallTemplates {
      template
      name
      description
      rules {
        port
        protocol
        direction
        action
        description
      }
    }
  }
`;

const useDepartmentFirewall = (departmentId) => {
  // Query department filters with optimized configuration
  const {
    data: filtersData,
    loading: filtersLoading,
    error: filtersError,
    refetch: refetchFilters,
    stopPolling: stopFiltersPolling
  } = useQuery(GET_DEPARTMENT_FILTERS, {
    variables: { departmentId },
    skip: !departmentId,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    pollInterval: 60000, // Poll every 60 seconds instead of manual polling
  });

  // Query available templates with optimized configuration
  const {
    data: templatesData,
    loading: templatesLoading,
    error: templatesError,
    refetch: refetchTemplates,
    stopPolling: stopTemplatesPolling
  } = useQuery(GET_AVAILABLE_FIREWALL_TEMPLATES, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first', // Templates don't change frequently
    notifyOnNetworkStatusChange: true,
    pollInterval: 300000, // Poll templates every 5 minutes
  });

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopFiltersPolling();
      stopTemplatesPolling();
    };
  }, [stopFiltersPolling, stopTemplatesPolling]);

  // Combined loading state
  const isLoading = filtersLoading || templatesLoading;

  // Combined error state
  const error = filtersError || templatesError;

  // Extract data with stable references
  const departmentFilters = useMemo(() =>
    filtersData?.listFilters || [],
    [filtersData?.listFilters]
  );

  const availableTemplates = useMemo(() =>
    templatesData?.getAvailableFirewallTemplates || [],
    [templatesData?.getAvailableFirewallTemplates]
  );

  // Extract all rules from department filters
  const allRules = useMemo(() => {
    return departmentFilters.reduce((acc, filter) => {
      return acc.concat(filter.rules || []);
    }, []);
  }, [departmentFilters]);

  // Applied templates - filters that match template names
  const appliedTemplates = useMemo(() => {
    const templateNames = availableTemplates.map(t => t.template);
    return departmentFilters
      .filter(filter => templateNames.includes(filter.name))
      .map(filter => filter.name);
  }, [departmentFilters, availableTemplates]);

  // Custom rules - rules from non-template filters
  const customRules = useMemo(() => {
    const templateNames = availableTemplates.map(t => t.template);
    return departmentFilters
      .filter(filter => !templateNames.includes(filter.name))
      .reduce((acc, filter) => acc.concat(filter.rules || []), []);
  }, [departmentFilters, availableTemplates]);

  // Effective rules (all rules currently active)
  const effectiveRules = useMemo(() => {
    return allRules;
  }, [allRules]);

  // Group rules by type using normalized values
  const rulesByType = useMemo(() => {
    const grouped = {
      inbound: [],
      outbound: [],
      custom: [],
      template: []
    };

    effectiveRules.forEach(rule => {
      const dir = normalizeDirection(rule.direction);
      if (dir === 'inbound') {
        grouped.inbound.push(rule);
      } else if (dir === 'outbound') {
        grouped.outbound.push(rule);
      }

      // Determine if rule comes from template or custom filter
      const filter = departmentFilters.find(f =>
        f.rules && f.rules.some(r => r.id === rule.id)
      );

      if (filter) {
        const templateNames = availableTemplates.map(t => t.template);
        if (templateNames.includes(filter.name)) {
          grouped.template.push(rule);
        } else {
          grouped.custom.push(rule);
        }
      }
    });

    return grouped;
  }, [effectiveRules, departmentFilters, availableTemplates]);

  // Group rules by priority/action using normalized values
  const rulesByAction = useMemo(() => {
    const grouped = {
      allow: [],
      deny: [],
      reject: []
    };

    effectiveRules.forEach(rule => {
      const action = normalizeAction(rule.action);
      if (grouped[action]) {
        grouped[action].push(rule);
      }
    });

    return grouped;
  }, [effectiveRules]);

  // Check if a template is currently applied
  const isTemplateApplied = (templateName) => {
    return appliedTemplates.includes(templateName);
  };

  // Get template details by name (memoized for stability)
  const getTemplateDetails = useCallback((templateName) => {
    return availableTemplates.find(template => template.template === templateName);
  }, [availableTemplates]);

  // Get rules summary for display using formatted rules for enabled/disabled counts
  const rulesSummary = useMemo(() => {
    const enabledDisabledCounts = effectiveRules.reduce((acc, rule) => {
      const { enabled } = formatRuleForDisplay(rule);
      if (enabled) {
        acc.enabled++;
      } else {
        acc.disabled++;
      }
      return acc;
    }, { enabled: 0, disabled: 0 });

    return {
      total: effectiveRules.length,
      inbound: rulesByType.inbound.length,
      outbound: rulesByType.outbound.length,
      custom: rulesByType.custom.length,
      template: rulesByType.template.length,
      allow: rulesByAction.allow.length,
      deny: rulesByAction.deny.length,
      reject: rulesByAction.reject.length,
      enabled: enabledDisabledCounts.enabled,
      disabled: enabledDisabledCounts.disabled,
      appliedTemplatesCount: appliedTemplates.length,
      filtersCount: departmentFilters.length
    };
  }, [effectiveRules, rulesByType, rulesByAction, appliedTemplates, departmentFilters]);

  // Get applied templates with details
  const appliedTemplateDetails = useMemo(() => {
    return appliedTemplates.map(templateName => {
      const template = getTemplateDetails(templateName);
      return {
        name: templateName,
        details: template || null
      };
    }).filter(item => item.details);
  }, [appliedTemplates, getTemplateDetails]);

  // Check for potential rule conflicts
  const checkRuleConflicts = useMemo(() => {
    const conflicts = [];

    // Simple conflict detection: same port/protocol with different actions
    const ruleGroups = {};

    effectiveRules.forEach(rule => {
      const portRange = rule.dstPortStart && rule.dstPortEnd
        ? `${rule.dstPortStart}-${rule.dstPortEnd}`
        : rule.dstPortStart || 'any';
      const key = `${rule.protocol}:${portRange}:${rule.direction}`;
      if (!ruleGroups[key]) {
        ruleGroups[key] = [];
      }
      ruleGroups[key].push(rule);
    });

    Object.entries(ruleGroups).forEach(([key, rules]) => {
      if (rules.length > 1) {
        const actions = [...new Set(rules.map(r => r.action))];
        if (actions.length > 1) {
          conflicts.push({
            key,
            rules,
            issue: 'Conflicting actions for same port/protocol'
          });
        }
      }
    });

    return conflicts;
  }, [effectiveRules]);

  // Optimized refresh function with better error handling
  const refreshData = useCallback(async () => {
    const promises = [];

    // Only refetch filters if we have a department ID
    if (departmentId) {
      promises.push(refetchFilters());
    }

    // Always refetch templates as they're global
    promises.push(refetchTemplates());

    try {
      const results = await Promise.allSettled(promises);

      // Log any failures but don't throw if at least one succeeded
      const failures = results.filter(result => result.status === 'rejected');
      if (failures.length > 0) {
        failures.forEach((failure, index) => {
          debug.error('refresh', `Failed to refresh ${index === 0 ? 'filters' : 'templates'}:`, failure.reason);
        });
      }

      return results.some(result => result.status === 'fulfilled');
    } catch (error) {
      debug.error('refresh', 'Error refreshing department firewall data:', error);
      throw error;
    }
  }, [departmentId, refetchFilters, refetchTemplates]);

  // Last sync time - use the most recent filter update
  const lastSync = useMemo(() => {
    if (departmentFilters.length === 0) return null;
    const timestamps = departmentFilters.map(f => new Date(f.updatedAt));
    return new Date(Math.max(...timestamps));
  }, [departmentFilters]);

  return {
    // Core data
    departmentFilters,
    availableTemplates,
    allRules,

    // Organized data
    appliedTemplates,
    appliedTemplateDetails,
    customRules,
    effectiveRules,
    rulesByType,
    rulesByAction,

    // Summary information
    rulesSummary,
    checkRuleConflicts,
    lastSync,

    // State management
    isLoading,
    error,

    // Utility functions
    isTemplateApplied,
    getTemplateDetails,
    filterRules,
    refreshData,

    // Individual refetch functions
    refetchFilters,
    refetchTemplates,

    // Connection status
    networkStatus: {
      filtersConnected: !filtersError,
      templatesConnected: !templatesError,
      isRetrying: filtersLoading && filtersError,
    }
  };
};

export default useDepartmentFirewall;