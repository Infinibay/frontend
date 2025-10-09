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
import CreateDepartmentFirewallRuleDialog from './security/CreateDepartmentFirewallRuleDialog';
import NoFirewallRulesWarning from '@/components/security/NoFirewallRulesWarning';

const debug = createDebugger('frontend:components:department-security-tab');

/**
 * DepartmentSecurityTab - Department-level firewall management
 * These rules are inherited by all VMs in the department
 * Updated to use shared components
 */
const DepartmentSecurityTab = ({ departmentId }) => {
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    rules,
    loading,
    error,
    createRule,
    refetch
  } = useFirewallData({
    entityType: ENTITY_TYPES.DEPARTMENT,
    entityId: departmentId
  });

  const handleRefresh = async () => {
    debug.log('Refreshing department firewall data');
    await refetch();
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

  const handleApplyDesktopSecure = async () => {
    debug.log('Applying Desktop Secure template to department from warning');
    setIsApplyingTemplate(true);

    try {
      const template = getFirewallTemplate('desktop-secure');
      if (!template) {
        throw new Error('Desktop Secure template not found');
      }

      const templateRules = expandTemplateToRules(template);
      debug.log(`Applying ${templateRules.length} rules from Desktop Secure template to department`);

      // Create each rule from the template
      for (const rule of templateRules) {
        await createRule({
          variables: {
            departmentId,
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

      toast.success(`Desktop Secure template applied to department (${templateRules.length} rules created)`);
      debug.success('Desktop Secure template applied to department');
      await handleRefresh();
    } catch (error) {
      debug.error('Failed to apply Desktop Secure template to department:', error);
      toast.error(`Failed to apply template: ${error.message}`);
    } finally {
      setIsApplyingTemplate(false);
    }
  };

  // Loading state
  if (loading) {
    return <DepartmentSecurityTabSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="glass-minimal p-6 rounded-lg text-center">
        <p className="text-red-600 mb-4">Failed to load department firewall configuration</p>
        <button
          onClick={handleRefresh}
          className="size-button bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  // Check if there are no rules configured
  const hasNoRules = rules.length === 0;

  return (
    <div className="space-y-6">
      {/* Warning when no rules are configured */}
      {hasNoRules && (
        <NoFirewallRulesWarning
          isApplying={isApplyingTemplate}
          isForDepartment={true}
          onApplyTemplate={handleApplyDesktopSecure}
        />
      )}

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
        <Info className="size-icon text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-medium mb-1">Department-Level Firewall Rules</p>
          <p>
            Rules configured here will be inherited by <strong>all VMs</strong> in this department.
            Individual VMs can add their own rules or override department rules if needed.
          </p>
        </div>
      </div>

      {/* Status Header - Now using shared component */}
      <FirewallStatusHeader
        entityType={ENTITY_TYPES.DEPARTMENT}
        rules={rules}
        conflicts={[]}
        onRefresh={handleRefresh}
        onCreateRule={handleCreateRule}
      />

      {/* Templates Section - Now using shared component */}
      <section className="glass-medium p-6 rounded-lg" data-templates-section>
        <h3 className="size-heading mb-4">🚀 Quick Security Profiles</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Apply pre-configured security templates to set baseline protection for all VMs in this department.
        </p>
        <FirewallTemplateSelector
          entityType={ENTITY_TYPES.DEPARTMENT}
          entityId={departmentId}
          existingRules={rules}
          onRefetch={handleRefresh}
        />
      </section>

      {/* Rules List */}
      <section className="glass-medium p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="size-heading flex items-center gap-2">
              <Shield className="size-icon" />
              Department Rules
            </h3>
            <p className="text-sm text-muted-foreground">
              {rules.length} rule{rules.length !== 1 ? 's' : ''} configured • Applied to all VMs
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
          entityType={ENTITY_TYPES.DEPARTMENT}
          entityId={departmentId}
          rules={rules}
          onRefetch={handleRefresh}
        />
      </section>

      {/* Warning about VM overrides */}
      {rules.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
          <AlertCircle className="size-icon text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-orange-700 dark:text-orange-300">
            <p className="font-medium mb-1">VM Override Notice</p>
            <p>
              Individual VMs can override these department rules by creating VM-specific rules with the "Override Department" flag.
              This is useful for VMs that require special security configurations.
            </p>
          </div>
        </div>
      )}

      {/* Create Rule Dialog */}
      <CreateDepartmentFirewallRuleDialog
        departmentId={departmentId}
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleRuleCreated}
        existingRules={rules}
      />
    </div>
  );
};

// Loading skeleton
const DepartmentSecurityTabSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
};

export default DepartmentSecurityTab;
