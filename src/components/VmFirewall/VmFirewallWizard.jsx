'use client';

import React, { useState } from 'react';
import { FirewallRuleWizard } from '@/components/FirewallRuleWizard';
import { useCreateSimplifiedFirewallRuleMutation } from '@/gql/hooks';
import { createDebugger } from '@/utils/debug';
import { denormalizeAction, denormalizeDirection } from '@/utils/firewallHelpers';

const debug = createDebugger('frontend:components:VmFirewallWizard');

export const VmFirewallWizard = ({
  vmId,
  vmName,
  onRuleChange,
  onComplete
}) => {
  const [isCreatingRule, setIsCreatingRule] = useState(false);

  const [createSimplifiedFirewallRule] = useCreateSimplifiedFirewallRuleMutation({
    onCompleted: (data) => {
      debug.success('VM firewall rule created successfully:', data);
      onRuleChange?.();
    },
    onError: (error) => {
      debug.error('Failed to create VM firewall rule:', error);
    }
  });

  const createVmRule = async ({ values, portRanges, priority, contextId }) => {
    debug.info('Creating VM firewall rule:', { vmId, values, portRanges });
    setIsCreatingRule(true);

    try {
      const results = [];

      // Create separate rules for each port range
      for (const portRange of portRanges) {
        const ruleInput = {
          machineId: vmId,
          action: denormalizeAction(values.direction.action),
          direction: denormalizeDirection(values.direction.direction),
          protocol: values.service.protocol || 'TCP',
          port: portRange || '',
          description: values.customization.comment || '',
          sources: values.customization.srcIpAddr ? [values.customization.srcIpAddr] : []
        };

        debug.info('Creating individual rule with input:', ruleInput);

        const result = await createSimplifiedFirewallRule({
          variables: {
            input: ruleInput
          }
        });

        results.push(result);
      }

      debug.success(`Created ${results.length} firewall rules successfully`);
      return results;

    } catch (error) {
      debug.error('Error creating VM firewall rule:', error);
      throw error;
    } finally {
      setIsCreatingRule(false);
    }
  };

  const handleRuleCreated = () => {
    debug.info('VM firewall rule created, triggering callbacks');
    onRuleChange?.();
  };

  const handleComplete = () => {
    debug.info('VM firewall wizard completed');
    onComplete?.();
  };

  return (
    <FirewallRuleWizard
      context="vm"
      contextId={vmId}
      contextName={vmName}
      createRuleFunction={createVmRule}
      onRuleCreated={handleRuleCreated}
      onComplete={handleComplete}
    />
  );
};