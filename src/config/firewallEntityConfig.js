/**
 * Firewall Entity Configuration
 * Defines configuration for different entity types (Department, VM) to enable
 * unified firewall components that work across both contexts
 */

export const ENTITY_TYPES = {
  DEPARTMENT: 'department',
  VM: 'vm'
};

/**
 * Get entity-specific configuration for firewall components
 * @param {string} entityType - Either ENTITY_TYPES.DEPARTMENT or ENTITY_TYPES.VM
 * @returns {Object} Configuration object with labels, features, and GraphQL settings
 */
export const getEntityConfig = (entityType) => {
  const configs = {
    [ENTITY_TYPES.DEPARTMENT]: {
      // GraphQL
      queryName: 'getDepartmentFirewallRules',
      createMutationName: 'createDepartmentFirewallRule',
      deleteMutationName: 'deleteFirewallRule',

      // Entity identification
      idField: 'departmentId',
      displayName: 'Department',
      displayNameLower: 'department',

      // UI labels
      headerTitle: 'Department Security Status',
      rulesTitle: 'Department Rules',
      rulesBadgeText: 'Department-wide',
      createButtonText: '+ Add Rule',
      emptyStateTitle: 'No Department Rules',
      emptyStateDescription: 'Start by applying a security template or create custom department-wide rules',

      // Warnings
      infoBannerTitle: 'Department-Level Firewall Rules',
      infoBannerDescription: 'Rules configured here will be inherited by all VMs in this department. Individual VMs can add their own rules or override department rules if needed.',

      // Features
      showInheritedRules: false,
      showEffectiveRules: false,
      showAdvancedView: false,
      showOverrideBadges: false,

      // WebSocket refetch
      refetchEventFilter: { departmentId: true }
    },

    [ENTITY_TYPES.VM]: {
      // GraphQL
      queryName: 'getVMFirewallRules',
      effectiveRulesQueryName: 'getEffectiveFirewallRules',
      createMutationName: 'createVmFirewallRule',
      deleteMutationName: 'deleteFirewallRule',

      // Entity identification
      idField: 'vmId',
      displayName: 'VM',
      displayNameLower: 'VM',

      // UI labels
      headerTitle: 'Security Status',
      rulesTitle: 'Custom Rules',
      rulesBadgeText: 'VM-specific',
      createButtonText: '+ Add Rule',
      emptyStateTitle: 'No Firewall Rules',
      emptyStateDescription: 'Start by applying a security template or create custom rules',

      // Warnings
      infoBannerTitle: null, // No info banner for VM
      infoBannerDescription: null,

      // Features
      showInheritedRules: true,
      showEffectiveRules: true,
      showAdvancedView: true,
      showOverrideBadges: true,

      // WebSocket refetch
      refetchEventFilter: { vmId: true }
    }
  };

  return configs[entityType] || configs[ENTITY_TYPES.DEPARTMENT];
};
