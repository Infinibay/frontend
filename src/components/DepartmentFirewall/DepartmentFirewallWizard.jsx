'use client';

import React from 'react';
import {
  useCreateFilterRuleMutation,
  useCreateFilterMutation
} from '@/gql/hooks';
import {
  denormalizeAction,
  denormalizeDirection
} from '@/utils/firewallHelpers';
import { FirewallRuleWizard } from '@/components/FirewallRuleWizard';

/**
 * DepartmentFirewallWizard - Department-specific firewall rule creation wizard
 *
 * This is a wrapper around the shared FirewallRuleWizard component that provides
 * department-specific configuration and rule creation logic.
 *
 * @param {string} departmentId - ID of the department to create rules for
 * @param {string} departmentName - Name of the department for display
 * @param {Array} departmentFilters - Existing filters for the department
 * @param {Function} onRuleChange - Callback when a rule is created/updated
 * @param {Function} onComplete - Optional callback when wizard completes
 */
export default function DepartmentFirewallWizard({
  departmentId,
  departmentName,
  departmentFilters = [],
  onRuleChange,
  onComplete
}) {
  const [createFilterRule] = useCreateFilterRuleMutation();
  const [createFilter] = useCreateFilterMutation();

  /**
   * Department-specific rule creation function
   */
  const createDepartmentRule = async ({ values, portRanges, priority, contextName, contextFilters }) => {
    // Find or create a filter for this department
    let filterId = null;

    // Try to find an existing filter for this department (prioritize department-specific filters)
    const existingFilter = contextFilters.find(filter =>
      // First priority: exact match for expected name
      filter.name === `${contextName}-default`
    ) || contextFilters.find(filter =>
      // Second priority: filters that include the department name and are DEPARTMENT type
      filter.name.toLowerCase().includes(contextName.toLowerCase()) && filter.type === 'DEPARTMENT'
    ) || contextFilters.find(filter =>
      // Third priority: filters that include 'default' in the name and are DEPARTMENT type
      filter.name.toLowerCase().includes('default') && filter.type === 'DEPARTMENT'
    ) || contextFilters.find(filter =>
      // Last fallback: any DEPARTMENT type filter
      filter.type === 'DEPARTMENT'
    );

    if (existingFilter) {
      filterId = existingFilter.id;
    } else {
      // Create a new default filter for the department
      const filterResult = await createFilter({
        variables: {
          input: {
            name: `${contextName}-default`,
            description: `Default firewall filter for ${contextName} department`,
            type: 'DEPARTMENT', // Department-level filter
            chain: 'root' // Required chain field with default value
          }
        }
      });
      filterId = filterResult.data.createFilter.id;
    }

    // Ensure we have at least one rule to create, even for ICMP or wildcard rules
    const rulesToCreate = portRanges.length > 0 ? portRanges : [{ start: null, end: null }];

    // Create rules for each port range
    const ruleResults = [];
    for (let i = 0; i < rulesToCreate.length; i++) {
      const portRange = rulesToCreate[i];

      // Create comment that identifies the port
      let ruleComment = values.customization.comment?.trim();
      if (rulesToCreate.length > 1 && portRange.start !== null) {
        // For multiple ports, add port information to comment
        const portDesc = portRange.start === portRange.end ?
          `port ${portRange.start}` :
          `ports ${portRange.start}-${portRange.end}`;
        ruleComment = ruleComment ?
          `${ruleComment} (${portDesc})` :
          `${values.service.serviceType?.title || 'Service'} - ${portDesc}`;
      }

      // Create the firewall rule with proper GraphQL structure
      const ruleResult = await createFilterRule({
        variables: {
          filterId: filterId,
          input: {
            action: denormalizeAction(values.direction.action),
            direction: denormalizeDirection(values.direction.direction),
            protocol: values.service.protocol,
            srcPortStart: portRange.start,
            srcPortEnd: portRange.end,
            dstPortStart: portRange.start,
            dstPortEnd: portRange.end,
            priority: priority,
            ...(ruleComment ? { comment: ruleComment } : {})
            // TODO: IP scoping requires backend support before re-adding srcIpAddr/dstIpAddr fields
            // srcIpAddr: values.customization.srcIpAddr || undefined,
            // dstIpAddr: values.customization.dstIpAddr || undefined,
          }
        }
      });

      ruleResults.push(ruleResult);
    }

    return ruleResults;
  };

  /**
   * Handle rule creation success
   */
  const handleRuleCreated = (ruleResult) => {
    if (onRuleChange) {
      onRuleChange(ruleResult);
    }
  };

  /**
   * Handle wizard completion
   */
  const handleComplete = (ruleResult) => {
    if (onComplete) {
      onComplete(ruleResult);
    }
  };

  return (
    <FirewallRuleWizard
      context="department"
      contextId={departmentId}
      contextName={departmentName}
      contextFilters={departmentFilters}
      createRuleFunction={createDepartmentRule}
      onRuleCreated={handleRuleCreated}
      onComplete={handleComplete}
    />
  );
}