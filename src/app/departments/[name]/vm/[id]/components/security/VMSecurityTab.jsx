'use client';

import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { createDebugger } from '@/utils/debug';
import { toast } from 'sonner';
import {
  useCreateVmFirewallRuleMutation,
  useGetEffectiveFirewallRulesQuery,
  useGetVmFirewallRulesQuery
} from '@/gql/hooks';
import { expandTemplateToRules, getFirewallTemplate } from '@/config/firewallTemplates';

import FirewallStatusHeader from './FirewallStatusHeader';
import FirewallTemplateSelector from './FirewallTemplateSelector';
import FirewallCustomRules from './FirewallCustomRules';
import FirewallAdvancedView from './FirewallAdvancedView';
import CreateFirewallRuleDialog from './CreateFirewallRuleDialog';
import NoFirewallRulesWarning from '@/components/security/NoFirewallRulesWarning';

const debug = createDebugger('frontend:components:vm-security-tab');

/**
 * VMSecurityTab - Main security/firewall management component
 * Implements "Smart Templates with Guided Customization" philosophy
 */
const VMSecurityTab = ({ vmId, vmStatus, vmOs, departmentId }) => {
  // UI state
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showAdvancedView, setShowAdvancedView] = useState(false);

  // Mutations
  const [createRule] = useCreateVmFirewallRuleMutation();

  // Fetch VM firewall rules
  const {
    data: vmRulesData,
    loading: loadingVmRules,
    error: vmRulesError,
    refetch: refetchVmRules
  } = useGetVmFirewallRulesQuery({
    variables: { vmId },
    skip: !vmId,
    pollInterval: 30000, // Poll every 30s for external changes
    onCompleted: (data) => {
      debug.log('VM firewall rules loaded:', data);
    },
    onError: (error) => {
      debug.error('Failed to load VM firewall rules:', error);
    }
  });

  // Fetch effective rules (department + VM merged)
  const {
    data: effectiveData,
    loading: loadingEffective,
    error: effectiveError,
    refetch: refetchEffective
  } = useGetEffectiveFirewallRulesQuery({
    variables: { vmId },
    skip: !vmId,
    onCompleted: (data) => {
      debug.log('Effective firewall rules loaded:', data);
    },
    onError: (error) => {
      debug.error('Failed to load effective rules:', error);
    }
  });

  // Handlers
  const handleRefresh = async () => {
    debug.log('Refreshing firewall data');
    await Promise.all([refetchVmRules(), refetchEffective()]);
  };

  const handleCreateRule = () => {
    debug.log('Opening create rule dialog');
    setIsCreateDialogOpen(true);
  };

  const handleRuleCreated = () => {
    debug.success('Rule created, closing dialog');
    setIsCreateDialogOpen(false);
    handleRefresh();
  };

  // Loading state
  if (loadingVmRules || loadingEffective) {
    return <VMSecurityTabSkeleton />;
  }

  // Error state
  if (vmRulesError || effectiveError) {
    return (
      <div className="glass-minimal p-6 rounded-lg text-center">
        <p className="text-red-600 mb-4">Failed to load firewall configuration</p>
        <button
          onClick={handleRefresh}
          className="size-button bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  const vmRules = vmRulesData?.getVMFirewallRules?.rules || [];
  const effectiveRules = effectiveData?.getEffectiveFirewallRules?.effectiveRules || [];
  const departmentRules = effectiveData?.getEffectiveFirewallRules?.departmentRules || [];
  const conflicts = effectiveData?.getEffectiveFirewallRules?.conflicts || [];

  // Check if there are NO rules at all (neither department nor VM rules)
  const hasNoRules = effectiveRules.length === 0;

  const handleApplyDesktopSecure = async () => {
    debug.log('Applying Desktop Secure template from warning');
    setIsApplyingTemplate(true);

    try {
      const template = getFirewallTemplate('desktop-secure');
      if (!template) {
        throw new Error('Desktop Secure template not found');
      }

      const rules = expandTemplateToRules(template);
      debug.log(`Applying ${rules.length} rules from Desktop Secure template`);

      // Create each rule from the template
      for (const rule of rules) {
        await createRule({
          variables: {
            vmId,
            input: {
              action: rule.action,
              description: rule.description || `From template: ${template.displayName}`,
              direction: rule.direction,
              dstIpAddr: rule.dstIpAddr || null,
              dstIpMask: rule.dstIpMask || null,
              dstPortEnd: rule.dstPortEnd || null,
              dstPortStart: rule.dstPortStart || null,
              name: rule.name,
              overridesDept: false,
              priority: rule.priority,
              protocol: rule.protocol,
              srcIpAddr: rule.srcIpAddr || null,
              srcIpMask: rule.srcIpMask || null,
              srcPortEnd: rule.srcPortEnd || null,
              srcPortStart: rule.srcPortStart || null
            }
          }
        });
      }

      toast.success(`Desktop Secure template applied successfully (${rules.length} rules created)`);
      debug.success('Desktop Secure template applied');
      await handleRefresh();
    } catch (error) {
      debug.error('Failed to apply Desktop Secure template:', error);
      toast.error(`Failed to apply template: ${error.message}`);
    } finally {
      setIsApplyingTemplate(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Warning when no rules are configured */}
      {hasNoRules && (
        <NoFirewallRulesWarning
          isApplying={isApplyingTemplate}
          isForDepartment={false}
          onApplyTemplate={handleApplyDesktopSecure}
        />
      )}

      {/* Status Header with Quick Actions */}
      <FirewallStatusHeader
        effectiveRules={effectiveRules}
        conflicts={conflicts}
        onRefresh={handleRefresh}
        onCreateRule={handleCreateRule}
      />

      {/* Templates Section */}
      <section className="glass-medium p-6 rounded-lg" data-templates-section>
        <h3 className="size-heading mb-4">🚀 Quick Security Profiles</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select pre-configured security templates that match your VM's purpose.
          Click a template to apply its rules automatically.
        </p>
        <FirewallTemplateSelector
          vmId={vmId}
          existingRules={vmRules}
          onRefetch={handleRefresh}
        />
      </section>

      {/* Custom Rules Section */}
      <section className="glass-medium p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="size-heading">🔧 Custom Rules</h3>
            <p className="text-sm text-muted-foreground">
              {vmRules.length} custom rule{vmRules.length !== 1 ? 's' : ''} configured
            </p>
          </div>
          <button
            onClick={handleCreateRule}
            className="size-button bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
          >
            + Add Rule
          </button>
        </div>

        <FirewallCustomRules
          vmId={vmId}
          customRules={vmRules}
          departmentRules={departmentRules}
          onRefetch={handleRefresh}
        />
      </section>

      {/* Advanced View (Collapsible) */}
      <FirewallAdvancedView
        effectiveRules={effectiveRules}
        departmentRules={departmentRules}
        vmRules={vmRules}
        conflicts={conflicts}
        isExpanded={showAdvancedView}
        onToggle={() => setShowAdvancedView(!showAdvancedView)}
      />

      {/* Create Rule Dialog */}
      <CreateFirewallRuleDialog
        vmId={vmId}
        vmOs={vmOs}
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleRuleCreated}
        existingRules={effectiveRules}
      />
    </div>
  );
};

// Loading skeleton
const VMSecurityTabSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
};

export default VMSecurityTab;
