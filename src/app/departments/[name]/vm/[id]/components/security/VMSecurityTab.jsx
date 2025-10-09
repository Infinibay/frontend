'use client';

import React, { useState } from 'react';
import { AlertCircle, Info, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { createDebugger } from '@/utils/debug';
import { toast } from 'sonner';
import { ENTITY_TYPES } from '@/config/firewallEntityConfig';
import { useFirewallData } from '@/hooks/useFirewallData';
import { expandTemplateToRules, getFirewallTemplate } from '@/config/firewallTemplates';

import FirewallRulesList from '@/components/security/firewall/FirewallRulesList';
import FirewallStatusHeader from '@/components/security/firewall/FirewallStatusHeader';
import FirewallTemplateSelector from '@/components/security/firewall/FirewallTemplateSelector';
import CreateFirewallRuleDialog from './CreateFirewallRuleDialog';
import NoFirewallRulesWarning from '@/components/security/NoFirewallRulesWarning';

const debug = createDebugger('frontend:components:vm-security-tab');

/**
 * VMSecurityTab - VM-level firewall management
 * Redesigned to match department tab look and feel EXACTLY
 * Shows all rules (inherited + custom) in a simple list like department
 */
const VMSecurityTab = ({ vmId, vmStatus, vmOs, departmentId }) => {
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    rules: vmRules,
    effectiveRules,
    departmentRules,
    loading,
    error,
    createRule,
    refetch
  } = useFirewallData({
    entityType: ENTITY_TYPES.VM,
    entityId: vmId,
    departmentId
  });

  const handleRefresh = async () => {
    debug.log('Refreshing VM firewall data');
    await refetch();
  };

  const handleCreateRule = () => {
    debug.log('Opening create rule dialog for VM');
    setIsCreateDialogOpen(true);
  };

  const handleRuleCreated = () => {
    debug.success('VM rule created, closing dialog');
    setIsCreateDialogOpen(false);
    handleRefresh();
  };

  const handleApplyDesktopSecure = async () => {
    debug.log('Applying Desktop Secure template to VM from warning');
    setIsApplyingTemplate(true);

    try {
      const template = getFirewallTemplate('desktop-secure');
      if (!template) {
        throw new Error('Desktop Secure template not found');
      }

      const rules = expandTemplateToRules(template);
      debug.log(`Applying ${rules.length} rules from Desktop Secure template to VM`);

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

      toast.success(`Desktop Secure template applied to VM (${rules.length} rules created)`);
      debug.success('Desktop Secure template applied to VM');
      await handleRefresh();
    } catch (error) {
      debug.error('Failed to apply Desktop Secure template to VM:', error);
      toast.error(`Failed to apply template: ${error.message}`);
    } finally {
      setIsApplyingTemplate(false);
    }
  };

  // Loading state
  if (loading) {
    return <VMSecurityTabSkeleton />;
  };

  // Error state
  if (error) {
    return (
      <div className="glass-minimal p-6 rounded-lg text-center">
        <p className="text-red-600 mb-4">Failed to load VM firewall configuration</p>
        <button
          onClick={handleRefresh}
          className="size-button bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  // Check if there are NO rules at all (neither department nor VM rules)
  const hasNoRules = effectiveRules.length === 0;

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

      {/* Info Banner - IGUAL que department */}
      {departmentRules.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
          <Info className="size-icon text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">VM Firewall Rules</p>
            <p>
              This VM inherits {departmentRules.length} rule{departmentRules.length !== 1 ? 's' : ''} from its department.
              You can add VM-specific rules or override department rules if needed.
            </p>
          </div>
        </div>
      )}

      {/* Status Header - IGUAL formato que department */}
      <FirewallStatusHeader
        entityType={ENTITY_TYPES.VM}
        rules={effectiveRules}
        conflicts={[]}
        onRefresh={handleRefresh}
        onCreateRule={handleCreateRule}
      />

      {/* Templates Section - IGUAL que department */}
      <section className="glass-medium p-6 rounded-lg" data-templates-section>
        <h3 className="size-heading mb-4">🚀 Quick Security Profiles</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Apply pre-configured security templates to set baseline protection for this VM.
        </p>
        <FirewallTemplateSelector
          entityType={ENTITY_TYPES.VM}
          entityId={vmId}
          existingRules={vmRules}
          onRefetch={handleRefresh}
        />
      </section>

      {/* Rules List - IGUAL header que department */}
      <section className="glass-medium p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="size-heading flex items-center gap-2">
              <Shield className="size-icon" />
              Firewall Rules
            </h3>
            <p className="text-sm text-muted-foreground">
              {departmentRules.length} inherited • {vmRules.length} custom • {effectiveRules.length} total effective
            </p>
          </div>
          <button
            onClick={handleCreateRule}
            className="size-button bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
          >
            + Add Rule
          </button>
        </div>

        <FirewallRulesList
          entityType={ENTITY_TYPES.VM}
          entityId={vmId}
          rules={vmRules}
          departmentRules={departmentRules}
          onRefetch={handleRefresh}
        />
      </section>

      {/* Warning about custom rules - IGUAL formato que department */}
      {vmRules.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
          <AlertCircle className="size-icon text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-orange-700 dark:text-orange-300">
            <p className="font-medium mb-1">Custom VM Rules</p>
            <p>
              This VM has {vmRules.length} custom rule{vmRules.length !== 1 ? 's' : ''} configured.
              These rules are applied on top of the department rules and can override them if needed.
            </p>
          </div>
        </div>
      )}

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
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
};

export default VMSecurityTab;
