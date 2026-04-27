'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  AlertTriangle,
  Check,
  Globe,
  Lock,
  Pencil,
  Plus,
  RefreshCw,
  Shield,
  ShieldOff,
  Trash2,
  Unlock,
  Zap } from
'lucide-react';
import {
  Alert,
  Badge,
  Button,
  Card,
  DataTable,
  Dialog,
  Drawer,
  EmptyState,
  LoadingOverlay,
  ResponsiveGrid,
  ResponsiveStack,
  SegmentedControl,
  Skeleton,
  Stat,
  StatusDot } from
'@infinibay/harbor';

import { createDebugger } from '@/utils/debug';
import { ENTITY_TYPES } from '@/config/firewallEntityConfig';
import { useFirewallData } from '@/hooks/useFirewallData';
import {
  FIREWALL_TEMPLATES,
  expandTemplateToRules,
  getFirewallTemplate } from
'@/config/firewallTemplates';
import { useUpdateDepartmentFirewallPolicyMutation } from '@/gql/hooks';
import CreateDepartmentFirewallRuleDialog from './security/CreateDepartmentFirewallRuleDialog';

const debug = createDebugger('frontend:components:department-security-tab');

const POLICY_CONFIG = {
  BLOCK_ALL: {
    label: 'Block all',
    tone: 'danger',
    icon: Shield,
    tagline:
    'Blocks every inbound and outbound connection unless a rule explicitly allows it.',
    recommended: true,
    configs: [
    {
      id: 'allow_outbound',
      header: 'Allow all outbound',
      description:
      'VMs reach the internet freely; inbound still gated by rules.',
      icon: Globe
    },
    {
      id: 'allow_internet',
      header: 'Allow only Internet (80/443 + DNS)',
      description: 'Minimum web + DNS. Needed for OS install / updates.',
      icon: Globe
    },
    {
      id: 'block_all',
      header: 'Block absolutely everything',
      description: 'No traffic at all. May break automatic OS installation.',
      icon: Lock,
      risky: true
    }]

  },
  ALLOW_ALL: {
    label: 'Allow all',
    tone: 'success',
    icon: ShieldOff,
    tagline: 'Allows every connection unless a rule explicitly blocks it.',
    configs: [
    {
      id: 'none',
      header: 'No extra blocks',
      description:
      'Very permissive. Use only for trusted dev / lab networks.',
      icon: Unlock,
      risky: true
    },
    {
      id: 'block_ssh',
      header: 'Block SSH / SFTP (22, 21)',
      description: 'Starter block for remote-login protocols.',
      icon: Lock
    },
    {
      id: 'block_smb',
      header: 'Block SMB (445)',
      description: 'Starter block for Windows file sharing.',
      icon: Lock
    },
    {
      id: 'block_databases',
      header: 'Block databases',
      description: 'MySQL / PostgreSQL / MongoDB starter block.',
      icon: Lock
    }]

  }
};

const getDefaultConfigFor = (policy) =>
policy === 'BLOCK_ALL' ? 'allow_outbound' : 'none';

const shapeRules = (rules = []) =>
rules.map((r, i) => ({
  id: r.id || `row-${i}`,
  raw: r,
  name: r.name,
  direction: r.direction,
  protocol: r.protocol,
  port: r.dstPortStart ?
  r.dstPortEnd && r.dstPortEnd !== r.dstPortStart ?
  `${r.dstPortStart}–${r.dstPortEnd}` :
  String(r.dstPortStart) :
  '—',
  action: r.action,
  priority: r.priority ?? 500
}));

const directionArrow = (d) => {
  const v = (d || '').toUpperCase();
  if (v === 'IN') return '↓';
  if (v === 'OUT') return '↑';
  if (v === 'INOUT') return '↔';
  return v;
};

function PolicyEditor({ open, onClose, department, onSaved }) {
  const current = department?.firewallPolicy || 'BLOCK_ALL';
  const currentConfig =
  department?.firewallDefaultConfig || getDefaultConfigFor(current);

  const [policy, setPolicy] = useState(current);
  const [config, setConfig] = useState(currentConfig);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (open) {
      // Intentional: re-prime modal state to current policy when reopened.
      /* eslint-disable react-hooks/set-state-in-effect */
      setPolicy(current);
      setConfig(currentConfig);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [open, current, currentConfig]);

  const [updatePolicy, { loading }] =
  useUpdateDepartmentFirewallPolicyMutation();
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
          input: { firewallPolicy: policy, firewallDefaultConfig: config }
        }
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
        <ResponsiveStack direction="row" gap={2} align="center">
            <Shield size={14} />
            <span>Firewall policy</span>
          </ResponsiveStack>
        }
        footer={
        <ResponsiveStack direction="row" gap={2} justify="end">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
            variant="primary"
            onClick={() => risky ? setConfirmOpen(true) : handleSave()}
            loading={loading}
            disabled={loading || !hasChanges}>
            
              {hasChanges ? 'Apply policy' : 'No changes'}
            </Button>
          </ResponsiveStack>
        }>
        
        <ResponsiveStack direction="col" gap={5}>
          <span>
            The policy defines what the firewall does with traffic that{' '}
            <em>no rule</em> matches — the fallback. Rules you add below
            override this default for matching packets.
          </span>

          <ResponsiveStack direction="col" gap={2}>
            <span>Policy</span>
            <SegmentedControl
              items={[
              {
                value: 'BLOCK_ALL',
                label:
                <ResponsiveStack direction="row" gap={1} align="center">
                      <Shield size={12} />
                      <span>Block all</span>
                    </ResponsiveStack>

              },
              {
                value: 'ALLOW_ALL',
                label:
                <ResponsiveStack direction="row" gap={1} align="center">
                      <ShieldOff size={12} />
                      <span>Allow all</span>
                    </ResponsiveStack>

              }]
              }
              value={policy}
              onChange={handlePolicyChange} />
            
            <span>{policyInfo.tagline}</span>
            {policyInfo.recommended ?
            <Badge tone="info">Recommended</Badge> :
            null}
          </ResponsiveStack>

          <ResponsiveStack direction="col" gap={2}>
            <span>Default behaviour</span>
            <ResponsiveStack direction="col" gap={2}>
              {policyInfo.configs.map((c) => {
                const Icon = c.icon;
                const active = c.id === config;
                return (
                  <Card
                    key={c.id}
                    variant="default"
                    spotlight={false}
                    glow={false}
                    interactive
                    selected={active}
                    leadingIcon={<Icon size={16} />}
                    leadingIconTone={c.risky ? 'amber' : 'sky'}
                    title={
                    <ResponsiveStack direction="row" gap={2} align="center">
                        <span>{c.label}</span>
                        {c.risky ? <Badge tone="warning">Risky</Badge> : null}
                        {active ? <Check size={12} /> : null}
                      </ResponsiveStack>
                    }
                    description={c.description}
                    onClick={() => setConfig(c.id)} />);


              })}
            </ResponsiveStack>
          </ResponsiveStack>

          {risky ?
          <Alert
            tone="warning"
            icon={<AlertTriangle size={14} />}
            title="Risky default selected">
            
              This config leaves traffic mostly unguarded. Make sure it matches
              this department&apos;s threat model.
            </Alert> :
          null}
        </ResponsiveStack>
      </Drawer>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        size="sm"
        title="Apply risky policy?"
        description="The selected default behaviour leaves the network broadly open. Confirm to continue."
        footer={
        <ResponsiveStack direction="row" gap={2} justify="end">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSave}>
              Apply anyway
            </Button>
          </ResponsiveStack>
        }>
        
        <Alert tone="warning" size="sm" icon={<AlertTriangle size={12} />}>
          The subnet will restart immediately. In-flight connections may drop.
        </Alert>
      </Dialog>
    </>);

}

const DepartmentSecurityTab = ({ department }) => {
  const departmentId = department?.id;
  const [applyingId, setApplyingId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState({ done: 0, total: 0 });

  const {
    rules = [],
    loading,
    error,
    createRule,
    deleteRule,
    refetch
  } = useFirewallData({
    entityType: ENTITY_TYPES.DEPARTMENT,
    entityId: departmentId
  });

  const policyKey = department?.firewallPolicy || 'BLOCK_ALL';
  const policyCfgId =
  department?.firewallDefaultConfig || getDefaultConfigFor(policyKey);
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
              description:
              rule.description || `From template: ${template.displayName}`,
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
      toast.success(
        `${template.displayName} applied · ${templateRules.length} rules added`
      );
    } catch (err) {
      debug.error('Template apply failed:', err);
      toast.error(`Template failed: ${err.message}`);
    } finally {
      setApplyingId(null);
    }
  };

  const rows = useMemo(() => shapeRules(rules), [rules]);

  const handleBulkDelete = async () => {
    const ids = selectedIds.filter(Boolean);
    if (ids.length === 0) {
      setBulkDeleteOpen(false);
      return;
    }
    setIsDeleting(true);
    setBulkDeleteOpen(false);
    setDeleteProgress({ done: 0, total: ids.length });
    try {
      let done = 0;
      await Promise.all(
        ids.map((ruleId) =>
        deleteRule({ variables: { ruleId } }).then(() => {
          done += 1;
          setDeleteProgress({ done, total: ids.length });
        })
        )
      );
      toast.success(
        `${ids.length} rule${ids.length !== 1 ? 's' : ''} deleted`
      );
      setSelectedIds([]);
    } catch (err) {
      debug.error('Failed to bulk delete:', err);
      toast.error(`Could not delete all rules: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setDeleteProgress({ done: 0, total: 0 });
      await refetch();
    }
  };

  const columns = useMemo(
    () => [
    {
      id: 'name',
      header: 'Rule',
      sortable: true,
      cell: ({ row }) =>
      <ResponsiveStack direction="row" gap={2} align="center">
            <StatusDot
          status={row.action === 'ACCEPT' ? 'online' : 'offline'} />
        
            <span>{row.name || '—'}</span>
          </ResponsiveStack>

    },
    {
      id: 'direction',
      header: 'Dir',
      width: 64,
      sortable: true,
      align: 'center',
      cell: ({ row: r }) => <span>{directionArrow(r.direction)}</span>
    },
    {
      id: 'protocol',
      header: 'Proto',
      width: 80,
      sortable: true,
      cell: ({ row: r }) => <span>{(r.protocol || '').toUpperCase()}</span>
    },
    {
      id: 'port',
      header: 'Port',
      width: 110,
      sortable: true,
      cell: ({ row: r }) => <span>{r.port}</span>
    },
    {
      id: 'action',
      header: 'Action',
      width: 110,
      sortable: true,
      cell: ({ row: r }) =>
      r.action === 'ACCEPT' ?
      <Badge tone="success">Allow</Badge> :

      <Badge tone="danger">Block</Badge>

    },
    {
      id: 'priority',
      header: 'Priority',
      width: 80,
      sortable: true,
      align: 'right',
      cell: ({ row: r }) => <span>{r.priority}</span>
    }],

    []
  );

  if (loading && rules.length === 0) {
    return (
      <ResponsiveStack direction="col" gap={6}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </ResponsiveStack>);

  }

  if (error) {
    return (
      <ResponsiveStack direction="col" gap={6}>
        <Alert
          tone="danger"
          title="Firewall unavailable"
          actions={
          <Button
            variant="primary"
            size="sm"
            icon={<RefreshCw size={14} />}
            onClick={refetch}>
            
              Retry
            </Button>
          }>
          
          We couldn&apos;t load the firewall rules for this department.
        </Alert>
      </ResponsiveStack>);

  }

  return (
    <>
      <ResponsiveStack direction="col" gap={6}>
        <Alert
          tone="info"
          icon={<Shield size={14} />}
          title="Inherited by all desktops">
          
          Every desktop in{' '}
          <strong>{department?.name || 'this department'}</strong> starts
          with these rules applied on top of its own stack. Individual
          desktops can mark their own rules with “overrides department” and
          take precedence for matching traffic.
        </Alert>

        <Card
          variant="default"
          spotlight={false}
          glow={false}
          leadingIcon={<PolicyIcon size={22} />}
          leadingIconTone={policyInfo.tone === 'danger' ? 'rose' : 'green'}
          title={
          <ResponsiveStack direction="row" gap={2} align="center" wrap>
              <span>Policy</span>
              <Badge tone={policyInfo.tone === 'danger' ? 'danger' : 'success'}>
                {policyInfo.label}
              </Badge>
              <span>·</span>
              <span>{configInfo?.label || policyCfgId}</span>
            </ResponsiveStack>
          }
          description={configInfo?.description || policyInfo.tagline}
          footer={
          <ResponsiveStack direction="row" justify="end">
              <Button
              variant="secondary"
              size="sm"
              icon={<Pencil size={14} />}
              onClick={() => setPolicyOpen(true)}>
              
                Edit policy
              </Button>
            </ResponsiveStack>
          } />
        

        <ResponsiveGrid columns={{ base: 1, md: 3 }} gap={4}>
          <Stat
            label="Rules"
            value={rules.length}
            icon={<Shield size={12} />} />
          
          <Stat
            label="Allow"
            value={rules.filter((r) => r.action === 'ACCEPT').length} />
          
          <Stat
            label="Block"
            value={rules.filter((r) => r.action !== 'ACCEPT').length} />
          
        </ResponsiveGrid>

        <Card
          variant="default"
          spotlight={false}
          glow={false}
          leadingIcon={<Zap size={18} />}
          leadingIconTone="amber"
          title="Quick security profiles"
          description="Apply a starter set of rules. Existing rules are kept — nothing is removed.">
          
          <ResponsiveStack direction="row" gap={2} wrap>
            {FIREWALL_TEMPLATES.map((tpl) =>
            <Button
              key={tpl.id}
              size="sm"
              variant={applyingId === tpl.id ? 'primary' : 'secondary'}
              loading={applyingId === tpl.id}
              disabled={!!applyingId}
              onClick={() => applyTemplate(tpl.id)}>
              
                {tpl.displayName}
              </Button>
            )}
          </ResponsiveStack>
        </Card>

        <Card
          variant="default"
          spotlight={false}
          glow={false}
          leadingIcon={<Shield size={18} />}
          leadingIconTone="sky"
          title="Department rules"
          description={`${rules.length} rule${rules.length !== 1 ? 's' : ''} · inherited by every VM in ${department?.name || 'this department'}`}
          footer={
          <ResponsiveStack direction="row" justify="between" align="center">
              {selectedIds.length > 0 ?
            <Button
              size="sm"
              variant="destructive"
              icon={<Trash2 size={14} />}
              onClick={() => setBulkDeleteOpen(true)}
              disabled={isDeleting || !!applyingId}>
              
                  Delete {selectedIds.length} selected
                </Button> :

            <span />
            }
              <Button
              size="sm"
              variant="primary"
              icon={<Plus size={14} />}
              onClick={() => setCreateOpen(true)}
              disabled={isDeleting || !!applyingId}>
              
                Add rule
              </Button>
            </ResponsiveStack>
          }>
          
          {isDeleting && deleteProgress.total > 0 ?
          <LoadingOverlay
            label="Deleting rules…"
            progress={deleteProgress} /> :

          rows.length === 0 ?
          <EmptyState
            variant="dashed"
            icon={<Shield size={18} />}
            title="No rules yet"
            description="Pick a Quick Security Profile above, or add your first rule manually."
            actions={
            <Button
              size="sm"
              variant="primary"
              icon={<Plus size={14} />}
              onClick={() => setCreateOpen(true)}>
              
                  Add rule
                </Button>
            } /> :


          <DataTable
            rows={rows}
            columns={columns}
            rowId={(r) => r.id}
            selectable
            selected={selectedIds}
            onSelectionChange={setSelectedIds}
            defaultDensity="compact" />

          }
        </Card>

      </ResponsiveStack>

      <PolicyEditor
        open={policyOpen}
        onClose={() => setPolicyOpen(false)}
        department={department}
        onSaved={refetch} />
      

      <CreateDepartmentFirewallRuleDialog
        departmentId={departmentId}
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => setCreateOpen(false)}
        existingRules={rules} />
      

      <Dialog
        open={bulkDeleteOpen}
        onClose={() => !isDeleting && setBulkDeleteOpen(false)}
        size="md"
        title="Delete selected rules?"
        footerAlign="end"
        footer={
        <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
            variant="secondary"
            disabled={isDeleting}
            onClick={() => setBulkDeleteOpen(false)}>
            
              Cancel
            </Button>
            <Button
            variant="destructive"
            loading={isDeleting}
            disabled={isDeleting}
            icon={<Trash2 size={14} />}
            onClick={handleBulkDelete}>
            
              Delete {selectedIds.length} rule
              {selectedIds.length !== 1 ? 's' : ''}
            </Button>
          </ResponsiveStack>
        }>
        
        <Alert tone="warning" size="sm" icon={<AlertTriangle size={14} />}>
          This will permanently remove {selectedIds.length} rule
          {selectedIds.length !== 1 ? 's' : ''} from this department. VMs
          inheriting these rules will lose them immediately.
        </Alert>
      </Dialog>
    </>);

};

export default DepartmentSecurityTab;