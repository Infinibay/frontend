/**
 * Custom hook for managing VM firewall data and operations
 */

import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { createDebugger } from '@/utils/debug';
import {
  filterRules,
  normalizeAction,
  normalizeDirection,
  getOriginFromSources,
  formatRuleForDisplay
} from '../utils/firewallHelpers';

// GraphQL Documents
const GET_VM_FIREWALL_STATE = gql`
  query getVMFirewallState($machineId: ID!) {
    getVMFirewallState(machineId: $machineId) {
      appliedTemplates
      customRules {
        id
        action
        direction
        port
        protocol
        description
        sources
      }
      effectiveRules {
        id
        action
        direction
        port
        protocol
        description
        sources
      }
      lastSync
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

const GET_SIMPLIFIED_FIREWALL_RULES = gql`
  query getSimplifiedFirewallRules($machineId: ID!) {
    getSimplifiedFirewallRules(machineId: $machineId) {
      id
      action
      direction
      port
      protocol
      description
      sources
    }
  }
`;

const debug = createDebugger('frontend:hooks:vm-firewall');

const useVMFirewall = (vmId) => {
  // Query firewall state
  const {
    data: firewallStateData,
    loading: firewallStateLoading,
    error: firewallStateError,
    refetch: refetchFirewallState
  } = useQuery(GET_VM_FIREWALL_STATE, {
    variables: { machineId: vmId },
    skip: !vmId,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  });

  // Query available templates
  const {
    data: templatesData,
    loading: templatesLoading,
    error: templatesError,
    refetch: refetchTemplates
  } = useQuery(GET_AVAILABLE_FIREWALL_TEMPLATES, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  });

  // Query simplified rules
  const {
    data: rulesData,
    loading: rulesLoading,
    error: rulesError,
    refetch: refetchRules
  } = useQuery(GET_SIMPLIFIED_FIREWALL_RULES, {
    variables: { machineId: vmId },
    skip: !vmId,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  });

  // Combined loading state
  const isLoading = firewallStateLoading || templatesLoading || rulesLoading;

  // Combined error state
  const error = firewallStateError || templatesError || rulesError;

  // Extract firewall state data
  const firewallState = firewallStateData?.getVMFirewallState || null;
  const availableTemplates = templatesData?.getAvailableFirewallTemplates || [];
  const simplifiedRules = rulesData?.getSimplifiedFirewallRules || [];

  // Applied templates
  const appliedTemplates = useMemo(() => {
    return firewallState?.appliedTemplates || [];
  }, [firewallState]);

  // Custom rules
  const customRules = useMemo(() => {
    return firewallState?.customRules || [];
  }, [firewallState]);

  // Effective rules (all rules currently active)
  const effectiveRules = useMemo(() => {
    return firewallState?.effectiveRules || [];
  }, [firewallState]);

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

      const origin = getOriginFromSources(rule.sources);
      if (origin === 'custom') {
        grouped.custom.push(rule);
      } else if (origin === 'template') {
        grouped.template.push(rule);
      }
    });

    return grouped;
  }, [effectiveRules]);

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

  // Get template details by name
  const getTemplateDetails = (templateName) => {
    return availableTemplates.find(template => template.template === templateName);
  };


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
      disabled: enabledDisabledCounts.disabled
    };
  }, [effectiveRules, rulesByType, rulesByAction]);

  // Get applied templates with details
  const appliedTemplateDetails = useMemo(() => {
    return appliedTemplates.map(templateName => {
      const template = getTemplateDetails(templateName);
      return {
        name: templateName,
        details: template || null
      };
    }).filter(item => item.details);
  }, [appliedTemplates, availableTemplates]);

  // Check for potential rule conflicts
  const checkRuleConflicts = useMemo(() => {
    const conflicts = [];

    // Simple conflict detection: same port/protocol with different actions
    const ruleGroups = {};

    effectiveRules.forEach(rule => {
      const key = `${rule.protocol}:${rule.port}:${rule.direction}`;
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

  // Refresh all firewall data
  const refreshData = async () => {
    const promises = [
      refetchFirewallState(),
      refetchTemplates(),
      refetchRules()
    ];

    try {
      await Promise.all(promises);
    } catch (error) {
      debug.error('refresh', 'Error refreshing firewall data:', error);
      throw error;
    }
  };

  // Last sync time
  const lastSync = firewallState?.lastSync ? new Date(firewallState.lastSync) : null;

  return {
    // Core data
    firewallState,
    availableTemplates,
    simplifiedRules,

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
    refetchFirewallState,
    refetchTemplates,
    refetchRules
  };
};

export default useVMFirewall;