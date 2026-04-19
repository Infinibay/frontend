'use client';

import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Shield,
  ShieldOff,
  Zap,
  Plus,
  RefreshCw,
  Pencil,
  AlertTriangle,
  Globe,
  Lock,
  Unlock,
  Check,
} from 'lucide-react';
import {
  Card,
  Button,
  ButtonGroup,
  Badge,
  Alert,
  Skeleton,
  Stat,
  DataTable,
  SegmentedControl,
  Drawer,
  Dialog,
  EmptyState,
} from '@infinibay/harbor';

import { createDebugger } from '@/utils/debug';
import { ENTITY_TYPES } from '@/config/firewallEntityConfig';
import { useFirewallData } from '@/hooks/useFirewallData';
import {
  FIREWALL_TEMPLATES,
  expandTemplateToRules,
  getFirewallTemplate,
} from '@/config/firewallTemplates';
import { useUpdateDepartmentFirewallPolicyMutation } from '@/gql/hooks';
import CreateDepartmentFirewallRuleDialog from './security/CreateDepartmentFirewallRuleDialog';

const debug = createDebugger('frontend:components:department-security-tab');

/**
 * Policy model. Each policy has a `defaultBehavior` copy and a set of
 * optional configs. Matches the backend's POLICY + DEFAULT_CONFIG
 * mutation surface.
 */
const POLICY_CONFIG = {
  BLOCK_ALL: {
    label: 'Block all',
    tone: 'danger',
    icon: Shield,
    tagline: 'Blocks every inbound and outbound connection unless a rule explicitly allows it.',
    recommended: true,
    configs: [
      {
        id: 'allow_outbound',
        label: 'Allow all outbound',
        description: 'VMs reach the internet freely; inbound still gated by rules.',
        icon: Globe,
      },
      {
        id: 'allow_internet',
        label: 'Allow only Internet (80/443 + DNS)',
        description: 'Minimum web + DNS. Needed for OS install / updates.',
        icon: Globe,
      },
      {
        id: 'block_all',
        label: 'Block absolutely everything',
        description: 'No traffic at all. May break automatic OS installation.',
        icon: Lock,
        risky: true,
      },
    ],
  },
  ALLOW_ALL: {
    label: 'Allow all',
    tone: 'success',
    icon: ShieldOff,
    tagline: 'Allows every connection unless a rule explicitly blocks it.',
    configs: [
      {
        id: 'none',
        label: 'No extra blocks',
        description: 'Very permissive. Use only for trusted dev / lab networks.',
        icon: Unlock,
        risky: true,
      },
      {
        id: 'block_ssh',
        label: 'Block SSH / SFTP (22, 21)',
        description: 'Starter block for remote-login protocols.',
        icon: Lock,
      },
      {
        id: 'block_smb',
        label: 'Block SMB (445)',
        description: 'Starter block for Windows file sharing.',
        icon: Lock,
      },
      {
        id: 'block_databases',
        label: 'Block databases',
        description: 'MySQL / PostgreSQL / MongoDB starter block.',
        icon: Lock,
      },
    ],
  },
};

const getDefaultConfigFor = (policy) =>
  policy === 'BLOCK_ALL' ? 'allow_outbound' : 'none';

/** Shape firewall rules for the DataTable. */
const shapeRules = (rules = []) =>
  rules.map((r, i) => ({
    id: r.id || `row-${i}`,
    raw: r,
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
  }));

// ----- Policy drawer ---------------------------------------------

function PolicyEditor({ open, onClose, department, onSaved }) {
  const current = department?.firewallPolicy || 'BLOCK_ALL';
  const currentConfig = department?.firewallDefaultConfig || getDefaultConfigFor(current);

  const [policy, setPolicy] = useState(current);
  const [config, setConfig] = useState(currentConfig);
  const [confirmOpen, setConfirmOpen] = useState(false);

  React.useEffect(() => {
    if (open) {
      setPolicy(current);
      setConfig(currentConfig);
    }
  }, [open, current, currentConfig]);

  const [updatePolicy, { loading }] = useUpdateDepartmentFirewallPolicyMutation();
  const policyInfo = POLICY_CONFIG[policy];
  const configInfo = policyInfo.configs.find((c) => c.id === config);
  const risky = !!configInfo?.risky;
  const hasChanges = policy !== current || config !== currentConfig;

  const handlePolicyChange = (next) => {
    setPolicy(next);
    setConfig(getDefaultConfigFor(next));
  };

  const handleSave = async () => {
    if (!hasChanges) {
      onClose?.();
      return;
    }
    setConfirmOpen(false);
    try {
      await updatePolicy({
        variables: {
          departmentId: department.id,
          input: { firewallPolicy: policy, firewallDefaultConfig: config },
        },
      });
      toast.success('Firewall policy updated · subnet is restarting');
      onSaved?.();
      onClose?.();
    } catch (err) {
      toast.error(`Could not update policy: ${err.message}`);
    }
  };

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        side="right"
        size={520}
        title={
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-accent-2" />
            Firewall policy
          </span>
        }
        footer={
          <ButtonGroup className="justify-end">
            <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button
              onClick={() => (risky ? setConfirmOpen(true) : handleSave())}
              loading={loading}
              disabled={loading || !hasChanges}
            >
              {hasChanges ? 'Apply policy' : 'No changes'}
            </Button>
          </ButtonGroup>
        }
      >
        <div className="space-y-5">
          <p className="text-sm text-fg-muted">
            The policy defines what the firewall does with traffic that <em>no rule</em>{' '}
            matches — the fallback. Rules you add below override this default for matching
            packets.
          </p>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider text-fg-muted">Policy</label>
            <SegmentedControl
              items={[
                {
                  value: 'BLOCK_ALL',
                  label: (
                    <span className="inline-flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5" /> Block all
                    </span>
                  ),
                },
                {
                  value: 'ALLOW_ALL',
                  label: (
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldOff className="h-3.5 w-3.5" /> Allow all
                    </span>
                  ),
                },
              ]}
              value={policy}
              onChange={handlePolicyChange}
            />
            <p className="text-xs text-fg-muted pt-1">{policyInfo.tagline}</p>
            {policyInfo.recommended && (
              <Badge tone="info" className="mt-1">Recommended</Badge>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider text-fg-muted">
              Default behavior
            </label>
            <div className="space-y-1.5">
              {policyInfo.configs.map((c) => {
                const Icon = c.icon;
                const active = c.id === config;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setConfig(c.id)}
                    className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                      active
                        ? 'bg-accent/10 border-accent/40'
                        : 'bg-surface-1 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-md grid place-items-center shrink-0 ${
                        c.risky ? 'bg-warning/15 text-warning' : 'bg-accent-2/15 text-accent-2'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-fg">{c.label}</span>
                        {c.risky ? <Badge tone="warning">Risky</Badge> : null}
                        {active ? <Check className="h-3.5 w-3.5 text-accent-2" /> : null}
                      </div>
                      <p className="text-xs text-fg-muted mt-0.5">{c.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {risky && (
            <Alert tone="warning" title="Risky default selected">
              This config leaves traffic mostly unguarded. Make sure it matches this
              department&apos;s threat model.
            </Alert>
          )}
        </div>
      </Drawer>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        size="sm"
        title={
          <span className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-4 w-4" /> Apply risky policy?
          </span>
        }
        description="The selected default behavior leaves the network broadly open. Confirm to continue."
        footer={
          <ButtonGroup className="justify-end">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleSave}>Apply anyway</Button>
          </ButtonGroup>
        }
      >
        <p className="text-sm text-fg-muted">
          The subnet will restart immediately. In-flight connections may drop.
        </p>
      </Dialog>
    </>
  );
}

// ----- Main tab --------------------------------------------------

const DepartmentSecurityTab = ({ department }) => {
  const departmentId = department?.id;
  const [applyingId, setApplyingId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  const { rules = [], loading, error, createRule, refetch } = useFirewallData({
    entityType: ENTITY_TYPES.DEPARTMENT,
    entityId: departmentId,
  });

  const policyKey = department?.firewallPolicy || 'BLOCK_ALL';
  const policyCfgId = department?.firewallDefaultConfig || getDefaultConfigFor(policyKey);
  const policyInfo = POLICY_CONFIG[policyKey];
  const PolicyIcon = policyInfo?.icon || Shield;
  const configInfo = policyInfo?.configs.find((c) => c.id === policyCfgId);

  const applyTemplate = async (templateId) => {
    setApplyingId(templateId);
    try {
      const template = getFirewallTemplate(templateId);
      if (!template) throw new Error(`Template ${templateId} not found`);
      const templateRules = expandTemplateToRules(template);
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
              srcPortStart: rule.srcPortStart || null,
            },
          },
        });
      }
      toast.success(`${template.displayName} applied · ${templateRules.length} rules added`);
    } catch (err) {
      debug.error('Template apply failed:', err);
      toast.error(`Template failed: ${err.message}`);
    } finally {
      setApplyingId(null);
    }
  };

  const rows = useMemo(() => shapeRules(rules), [rules]);

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
            <span className="text-fg truncate">{row.name || '—'}</span>
          </div>
        ),
      },
      {
        key: 'direction',
        label: 'Dir',
        width: 64,
        sortable: true,
        render: (r) => (
          <span className="font-mono text-xs text-fg-muted uppercase">{r.direction}</span>
        ),
      },
      {
        key: 'protocol',
        label: 'Proto',
        width: 64,
        sortable: true,
        render: (r) => (
          <span className="font-mono text-xs text-fg-muted uppercase">{r.protocol}</span>
        ),
      },
      {
        key: 'port',
        label: 'Port',
        width: 96,
        sortable: true,
        render: (r) => <span className="font-mono text-xs text-fg">{r.port}</span>,
      },
      {
        key: 'action',
        label: 'Action',
        width: 110,
        sortable: true,
        render: (r) =>
          r.action === 'ACCEPT' ? (
            <Badge tone="success">Allow</Badge>
          ) : (
            <Badge tone="danger">Block</Badge>
          ),
      },
      {
        key: 'priority',
        label: 'Priority',
        width: 80,
        sortable: true,
        align: 'right',
        render: (r) => (
          <span className="font-mono text-xs tabular-nums text-fg-muted">{r.priority}</span>
        ),
      },
    ],
    []
  );

  if (loading && rules.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        tone="danger"
        title="Firewall unavailable"
        actions={
          <Button size="sm" onClick={refetch} icon={<RefreshCw className="h-4 w-4" />}>
            Retry
          </Button>
        }
      >
        We couldn&apos;t load the firewall rules for this department.
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Policy hero ─ big glass card showing the current policy, its
          config and a button that slides open the editor Drawer. */}
      <Card variant="glass" className="relative">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div
              className={`h-14 w-14 rounded-2xl grid place-items-center shrink-0 ${
                policyInfo.tone === 'danger'
                  ? 'bg-danger/15 text-danger'
                  : 'bg-success/15 text-success'
              }`}
            >
              <PolicyIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] uppercase tracking-widest text-fg-muted">Policy</span>
                <Badge tone={policyInfo.tone === 'danger' ? 'danger' : 'success'}>
                  {policyInfo.label}
                </Badge>
              </div>
              <h2 className="text-xl font-semibold text-fg mt-1">
                {configInfo?.label || policyCfgId}
              </h2>
              <p className="text-sm text-fg-muted mt-1">
                {configInfo?.description || policyInfo.tagline}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={<Pencil className="h-4 w-4" />}
            onClick={() => setPolicyOpen(true)}
          >
            Edit policy
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Rules" value={rules.length} icon={<Shield className="h-3.5 w-3.5" />} />
        <Stat
          label="Allow"
          value={rules.filter((r) => r.action === 'ACCEPT').length}
        />
        <Stat
          label="Block"
          value={rules.filter((r) => r.action !== 'ACCEPT').length}
        />
      </div>

      {/* Template chips */}
      <Card variant="glass">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="h-4 w-4 text-warning" />
          <h3 className="text-sm font-semibold text-fg">Quick security profiles</h3>
        </div>
        <p className="text-xs text-fg-muted mb-4">
          Apply a starter set of rules. Existing rules are kept — nothing is removed.
        </p>
        <div className="flex flex-wrap gap-2">
          {FIREWALL_TEMPLATES.map((tpl) => (
            <Button
              key={tpl.id}
              size="sm"
              variant="secondary"
              loading={applyingId === tpl.id}
              disabled={!!applyingId}
              onClick={() => applyTemplate(tpl.id)}
            >
              {tpl.displayName}
            </Button>
          ))}
        </div>
      </Card>

      {/* Rules */}
      <Card variant="default" className="p-0 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/8">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent-2" />
              <h3 className="text-sm font-semibold text-fg">Department rules</h3>
            </div>
            <p className="text-xs text-fg-muted mt-0.5">
              {rules.length} rule{rules.length !== 1 ? 's' : ''} · inherited by every VM in{' '}
              {department?.name || 'this department'}
            </p>
          </div>
          <Button
            size="sm"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setCreateOpen(true)}
          >
            Add rule
          </Button>
        </div>
        <div className="p-2">
          {rows.length === 0 ? (
            <EmptyState
              icon={<Shield className="h-10 w-10 text-fg-subtle" />}
              title="No rules yet"
              description="Pick a Quick Security Profile above, or add your first rule manually."
              actions={
                <Button
                  size="sm"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => setCreateOpen(true)}
                >
                  Add rule
                </Button>
              }
            />
          ) : (
            <DataTable
              rows={rows}
              columns={columns}
              rowKey={(r) => r.id}
              emptyState={null}
            />
          )}
        </div>
      </Card>

      {/* Inheritance callouts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Alert tone="info" title="Inherited by all VMs">
          Every VM in <strong>{department?.name || 'this department'}</strong> starts with
          these rules applied on top of its own stack.
        </Alert>
        {rules.length > 0 && (
          <Alert tone="warning" title="VMs can override">
            Individual VMs can mark their own rules with “overrides department” and take
            precedence for matching traffic.
          </Alert>
        )}
      </div>

      <PolicyEditor
        open={policyOpen}
        onClose={() => setPolicyOpen(false)}
        department={department}
        onSaved={refetch}
      />

      <CreateDepartmentFirewallRuleDialog
        departmentId={departmentId}
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => setCreateOpen(false)}
        existingRules={rules}
      />
    </div>
  );
};

export default DepartmentSecurityTab;
