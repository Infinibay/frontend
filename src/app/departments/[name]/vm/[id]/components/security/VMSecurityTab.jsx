'use client';

import React, { useMemo, useState } from 'react';
import {
  Shield,
  Zap,
  RefreshCw,
  Plus,
} from 'lucide-react';
import {
  Card,
  Button,
  Badge,
  Alert,
  Skeleton,
  Stat,
  DataTable,
} from '@infinibay/harbor';
import { createDebugger } from '@/utils/debug';
import { toast } from 'sonner';

import { ENTITY_TYPES } from '@/config/firewallEntityConfig';
import { useFirewallData } from '@/hooks/useFirewallData';
import {
  FIREWALL_TEMPLATES,
  expandTemplateToRules,
  getFirewallTemplate,
} from '@/config/firewallTemplates';

import CreateFirewallRuleDialog from './CreateFirewallRuleDialog';
import NoFirewallRulesWarning from '@/components/security/NoFirewallRulesWarning';

const debug = createDebugger('frontend:components:vm-security-tab');

/** Shape each rule into the uniform row structure the table consumes. */
const shapeRules = (vmRules, departmentRules) => {
  const rows = [];
  (departmentRules || []).forEach((r, i) => {
    rows.push({
      id: `dept-${r.id || i}`,
      source: 'department',
      name: r.name,
      direction: r.direction,
      protocol: r.protocol,
      port: r.dstPortStart
        ? r.dstPortEnd && r.dstPortEnd !== r.dstPortStart
          ? `${r.dstPortStart}–${r.dstPortEnd}`
          : String(r.dstPortStart)
        : '—',
      action: r.action,
      priority: r.priority ?? 500,
    });
  });
  (vmRules || []).forEach((r, i) => {
    rows.push({
      id: `vm-${r.id || i}`,
      source: 'custom',
      name: r.name,
      direction: r.direction,
      protocol: r.protocol,
      port: r.dstPortStart
        ? r.dstPortEnd && r.dstPortEnd !== r.dstPortStart
          ? `${r.dstPortStart}–${r.dstPortEnd}`
          : String(r.dstPortStart)
        : '—',
      action: r.action,
      priority: r.priority ?? 500,
    });
  });
  return rows;
};

const VMSecurityTab = ({ vmId, vmOs, departmentId }) => {
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [applyingId, setApplyingId] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    rules: vmRules,
    effectiveRules,
    departmentRules,
    loading,
    error,
    createRule,
    refetch,
  } = useFirewallData({
    entityType: ENTITY_TYPES.VM,
    entityId: vmId,
    departmentId,
  });

  const handleRefresh = async () => {
    debug.log('Refreshing VM firewall data');
    await refetch();
  };

  const handleCreateRule = () => setIsCreateDialogOpen(true);
  const handleRuleCreated = () => setIsCreateDialogOpen(false);

  const applyTemplate = async (templateId) => {
    setApplyingId(templateId);
    setIsApplyingTemplate(true);
    try {
      const template = getFirewallTemplate(templateId);
      if (!template) throw new Error(`Template ${templateId} not found`);

      const rules = expandTemplateToRules(template);
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
              srcPortStart: rule.srcPortStart || null,
            },
          },
        });
      }
      toast.success(`${template.displayName} applied (${rules.length} rules)`);
    } catch (err) {
      debug.error('Failed to apply template:', err);
      toast.error(`Failed to apply template: ${err.message}`);
    } finally {
      setIsApplyingTemplate(false);
      setApplyingId(null);
    }
  };

  const rows = useMemo(() => shapeRules(vmRules, departmentRules), [vmRules, departmentRules]);

  const columns = useMemo(
    () => [
      {
        key: 'name',
        label: 'Rule',
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                row.action === 'ACCEPT' ? 'bg-success' : 'bg-danger'
              }`}
            />
            <span className="truncate text-fg">{row.name || '—'}</span>
          </div>
        ),
      },
      {
        key: 'direction',
        label: 'Dir',
        width: 72,
        sortable: true,
        render: (row) => (
          <span className="font-mono text-xs text-fg-muted uppercase">{row.direction}</span>
        ),
      },
      {
        key: 'protocol',
        label: 'Proto',
        width: 72,
        sortable: true,
        render: (row) => (
          <span className="font-mono text-xs text-fg-muted uppercase">{row.protocol}</span>
        ),
      },
      {
        key: 'port',
        label: 'Port',
        width: 100,
        sortable: true,
        render: (row) => (
          <span className="font-mono text-xs text-fg">{row.port}</span>
        ),
      },
      {
        key: 'action',
        label: 'Action',
        width: 110,
        sortable: true,
        render: (row) =>
          row.action === 'ACCEPT' ? (
            <Badge tone="success">Allow</Badge>
          ) : (
            <Badge tone="danger">Block</Badge>
          ),
      },
      {
        key: 'source',
        label: 'Scope',
        width: 110,
        sortable: true,
        render: (row) =>
          row.source === 'department' ? (
            <Badge tone="info">Inherited</Badge>
          ) : (
            <Badge tone="purple">Custom</Badge>
          ),
      },
      {
        key: 'priority',
        label: 'Priority',
        width: 80,
        sortable: true,
        align: 'right',
        render: (row) => (
          <span className="font-mono text-xs tabular-nums text-fg-muted">{row.priority}</span>
        ),
      },
    ],
    []
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        tone="danger"
        title="Failed to load firewall configuration"
        actions={
          <Button
            size="sm"
            onClick={handleRefresh}
            icon={<RefreshCw className="h-4 w-4" />}
          >
            Retry
          </Button>
        }
      >
        We couldn&apos;t load the firewall rules for this VM. The network may be
        unstable or the backend service is unreachable.
      </Alert>
    );
  }

  const hasNoRules = effectiveRules.length === 0;

  return (
    <div className="space-y-6">
      {hasNoRules && (
        <NoFirewallRulesWarning
          isApplying={isApplyingTemplate}
          isForDepartment={false}
          onApplyTemplate={() => applyTemplate('desktop-secure')}
        />
      )}

      {departmentRules.length > 0 && (
        <Alert tone="info" title="Department rules apply to this VM">
          This VM inherits {departmentRules.length} rule{departmentRules.length !== 1 ? 's' : ''} from its department.
          You can add VM-specific rules or override department rules if needed.
        </Alert>
      )}

      {/* Posture summary — 3 stats. */}
      <div className="grid grid-cols-3 gap-4">
        <Stat
          label="Inherited"
          value={departmentRules.length}
          icon={<Shield className="h-3.5 w-3.5" />}
        />
        <Stat
          label="Custom"
          value={vmRules.length}
          icon={<Shield className="h-3.5 w-3.5" />}
        />
        <Stat
          label="Effective"
          value={effectiveRules.length}
          icon={<Shield className="h-3.5 w-3.5" />}
        />
      </div>

      {/* Quick profiles — harbor chip row instead of FirewallTemplateSelector. */}
      <Card variant="glass" className="p-6">
        <h3 className="flex items-center gap-2 mb-3 text-sm font-semibold text-fg">
          <Zap className="h-4 w-4 text-warning" />
          Quick security profiles
        </h3>
        <p className="text-xs text-fg-muted mb-4">
          Apply a pre-configured rule set. Rules from the profile are added on
          top of anything already in place — nothing is removed automatically.
        </p>
        <div className="flex flex-wrap gap-2">
          {FIREWALL_TEMPLATES.map((tpl) => (
            <Button
              key={tpl.id}
              size="sm"
              variant="secondary"
              loading={applyingId === tpl.id}
              disabled={isApplyingTemplate}
              onClick={() => applyTemplate(tpl.id)}
            >
              {tpl.displayName}
            </Button>
          ))}
        </div>
      </Card>

      {/* Rules table */}
      <Card variant="default" className="p-0 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/8">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-fg">
              <Shield className="h-4 w-4 text-accent-2" />
              Firewall rules
            </h3>
            <p className="text-xs text-fg-muted">
              {departmentRules.length} inherited · {vmRules.length} custom · {effectiveRules.length} effective
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleCreateRule}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Rule
          </Button>
        </div>
        <div className="p-2">
          <DataTable
            rows={rows}
            columns={columns}
            rowKey={(r) => r.id}
            emptyState={
              <div className="py-10 text-center text-sm text-fg-muted">
                No firewall rules configured for this VM yet.
              </div>
            }
          />
        </div>
      </Card>

      {vmRules.length > 0 && (
        <Alert tone="warning" title="Custom VM rules are active">
          This VM has {vmRules.length} custom rule{vmRules.length !== 1 ? 's' : ''} configured.
          They are applied alongside department rules and can override them when needed.
        </Alert>
      )}

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

export default VMSecurityTab;
