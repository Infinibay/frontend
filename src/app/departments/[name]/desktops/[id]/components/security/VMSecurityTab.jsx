'use client';

import { useMemo, useState } from 'react';
import { Plus, RefreshCw, Shield, Trash2, Zap } from 'lucide-react';
import {
  Alert,
  Badge,
  Button,
  Card,
  DataTable,
  Dialog,
  EmptyState,
  IconButton,
  LoadingOverlay,
  Page,
  ResponsiveStack,
  Skeleton,
  StatusDot } from
'@infinibay/harbor';
import { createDebugger } from '@/utils/debug';
import { toast } from 'sonner';

import { ENTITY_TYPES } from '@/config/firewallEntityConfig';
import { useFirewallData } from '@/hooks/useFirewallData';
import {
  FIREWALL_TEMPLATES,
  expandTemplateToRules,
  getFirewallTemplate } from
'@/config/firewallTemplates';

import CreateFirewallRuleDialog from './CreateFirewallRuleDialog';

const debug = createDebugger('frontend:components:vm-security-tab');

const formatPort = (r) => {
  if (!r.dstPortStart) return '—';
  if (r.dstPortEnd && r.dstPortEnd !== r.dstPortStart) {
    return `${r.dstPortStart}–${r.dstPortEnd}`;
  }
  return String(r.dstPortStart);
};

const shapeRules = (vmRules, departmentRules) => {
  const rows = [];
  (departmentRules || []).forEach((r, i) => {
    rows.push({
      id: `dept-${r.id || i}`,
      ruleId: r.id,
      source: 'department',
      name: r.name,
      direction: r.direction,
      protocol: r.protocol,
      port: formatPort(r),
      action: r.action,
      priority: r.priority ?? 500
    });
  });
  (vmRules || []).forEach((r, i) => {
    rows.push({
      id: `vm-${r.id || i}`,
      ruleId: r.id,
      source: 'custom',
      name: r.name,
      direction: r.direction,
      protocol: r.protocol,
      port: formatPort(r),
      action: r.action,
      priority: r.priority ?? 500
    });
  });
  return rows;
};

const directionArrow = (d) => {
  const v = (d || '').toUpperCase();
  if (v === 'IN') return '↓';
  if (v === 'OUT') return '↑';
  if (v === 'INOUT') return '↔';
  return v;
};

const VMSecurityTab = ({ vmId, vmOs, departmentId }) => {
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);
  const [applyingId, setApplyingId] = useState(null);
  const [applyProgress, setApplyProgress] = useState({ done: 0, total: 0 });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState({ done: 0, total: 0 });

  const {
    rules: vmRules,
    effectiveRules,
    departmentRules,
    loading,
    error,
    createRule,
    deleteRule,
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

  const applyTemplate = async (templateId) => {
    setApplyingId(templateId);
    setIsApplyingTemplate(true);
    try {
      const template = getFirewallTemplate(templateId);
      if (!template) throw new Error(`Template ${templateId} not found`);
      const rules = expandTemplateToRules(template);
      setApplyProgress({ done: 0, total: rules.length });
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        await createRule({
          variables: {
            vmId,
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
        setApplyProgress({ done: i + 1, total: rules.length });
      }
      toast.success(`${template.displayName} applied (${rules.length} rules)`);
    } catch (err) {
      debug.error('Failed to apply template:', err);
      toast.error(`Failed to apply template: ${err.message}`);
    } finally {
      setIsApplyingTemplate(false);
      setApplyingId(null);
      setApplyProgress({ done: 0, total: 0 });
      await refetch();
    }
  };

  const handleDeleteRule = async () => {
    if (!ruleToDelete) return;
    setIsDeleting(true);
    try {
      await deleteRule({ variables: { ruleId: ruleToDelete.ruleId } });
      toast.success('Firewall rule deleted');
      setRuleToDelete(null);
      await refetch();
    } catch (err) {
      debug.error('Failed to delete rule:', err);
      toast.error(`Could not delete rule: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    const targetRuleIds = rows.
    filter((r) => selectedIds.includes(r.id) && r.source === 'custom').
    map((r) => r.ruleId).
    filter(Boolean);
    if (targetRuleIds.length === 0) {
      setBulkDeleteOpen(false);
      return;
    }
    setIsDeleting(true);
    setBulkDeleteOpen(false);
    setDeleteProgress({ done: 0, total: targetRuleIds.length });
    try {
      let done = 0;
      await Promise.all(
        targetRuleIds.map((ruleId) =>
        deleteRule({ variables: { ruleId } }).then(() => {
          done += 1;
          setDeleteProgress({ done, total: targetRuleIds.length });
        })
        )
      );
      toast.success(
        `${targetRuleIds.length} rule${targetRuleIds.length !== 1 ? 's' : ''} deleted`
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

  // Let React Compiler handle memoization — manual useMemo here was being
  // skipped because shapeRules is module-scoped.
  const rows = shapeRules(vmRules, departmentRules);

  const columns = useMemo(
    () => [
    {
      id: 'name',
      header: 'Rule',
      sortable: true,
      cell: ({ row }) =>
      <ResponsiveStack direction="row" gap={2} align="center">
            <StatusDot status={row.action === 'ACCEPT' ? 'online' : 'offline'} />
            <span>{row.name || '—'}</span>
          </ResponsiveStack>

    },
    {
      id: 'direction',
      header: 'Dir',
      width: 64,
      sortable: true,
      align: 'center',
      cell: ({ row }) => <span>{directionArrow(row.direction)}</span>
    },
    {
      id: 'protocol',
      header: 'Proto',
      width: 80,
      sortable: true,
      cell: ({ row }) => <span>{(row.protocol || '').toUpperCase()}</span>
    },
    {
      id: 'port',
      header: 'Port',
      width: 110,
      sortable: true,
      cell: ({ row }) => <span>{row.port}</span>
    },
    {
      id: 'action',
      header: 'Action',
      width: 110,
      sortable: true,
      cell: ({ row }) =>
      row.action === 'ACCEPT' ?
      <Badge tone="success">Allow</Badge> :

      <Badge tone="danger">Block</Badge>

    },
    {
      id: 'source',
      header: 'Scope',
      width: 110,
      sortable: true,
      cell: ({ row }) =>
      row.source === 'department' ?
      <Badge tone="info">Inherited</Badge> :

      <Badge tone="purple">Custom</Badge>

    },
    {
      id: 'priority',
      header: 'Priority',
      width: 80,
      sortable: true,
      align: 'right',
      cell: ({ row }) => <span>{row.priority}</span>
    },
    {
      id: 'actions',
      header: '',
      width: 56,
      align: 'right',
      cell: ({ row }) =>
      row.source === 'custom' ?
      <IconButton
        size="sm"
        variant="ghost"
        reactive={false}
        label="Delete rule"
        icon={<Trash2 size={14} />}
        onClick={(e) => {
          e.stopPropagation();
          setRuleToDelete(row);
        }} /> :

      null
    }],

    []
  );

  if (loading) {
    return (
      <Page>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Page>);

  }

  if (error) {
    return (
      <Page>
        <Alert
          tone="danger"
          title="Failed to load firewall configuration"
          actions={
          <Button
            size="sm"
            variant="primary"
            icon={<RefreshCw size={14} />}
            onClick={handleRefresh}>
            
              Retry
            </Button>
          }>
          
          We couldn&apos;t load the firewall rules for this VM.
        </Alert>
      </Page>);

  }

  const hasNoRules = effectiveRules.length === 0 && !isApplyingTemplate;

  return (
    <>
      <Page>
        {hasNoRules ?
        <Alert
          tone="warning"
          icon={<Shield size={14} />}
          title="No firewall rules configured"
          actions={
          <Button
            size="sm"
            variant="primary"
            icon={<Shield size={14} />}
            loading={applyingId === 'desktop-secure'}
            disabled={isApplyingTemplate}
            onClick={() => applyTemplate('desktop-secure')}>
            
                Apply Desktop Secure
              </Button>
          }>
          
            Without rules this VM cannot connect to the internet. Start with the{' '}
            <strong>Desktop Secure</strong> profile for HTTPS, DNS and RDP
            access.
          </Alert> :
        null}

        {departmentRules.length > 0 ?
        <Alert
          tone="info"
          icon={<Shield size={14} />}
          title={`${departmentRules.length} inherited rule${departmentRules.length !== 1 ? 's' : ''} from the department`}>
          
            VM-specific rules you add apply on top of these. Use{' '}
            <em>Override</em> to weaken a department rule for this VM only.
          </Alert> :
        null}

        <Card
          variant="default"
          spotlight={false}
          glow={false}
          leadingIcon={<Zap size={18} />}
          leadingIconTone="amber"
          title="Quick security profiles"
          description="Apply a pre-configured rule set. Rules from the profile are added on top of what already exists.">
          
          <ResponsiveStack direction="row" gap={2} wrap>
            {FIREWALL_TEMPLATES.map((tpl) =>
            <Button
              key={tpl.id}
              size="sm"
              variant={applyingId === tpl.id ? 'primary' : 'secondary'}
              loading={applyingId === tpl.id}
              disabled={isApplyingTemplate}
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
          title="Firewall rules"
          description={`${departmentRules.length} inherited · ${vmRules.length} custom · ${effectiveRules.length} effective`}
          footer={
          <ResponsiveStack direction="row" justify="between" align="center">
              {selectedIds.length > 0 ?
            <Button
              size="sm"
              variant="destructive"
              icon={<Trash2 size={14} />}
              onClick={() => setBulkDeleteOpen(true)}
              disabled={isDeleting || isApplyingTemplate}>
              
                  Delete {selectedIds.length} selected
                </Button> :

            <span />
            }
              <Button
              size="sm"
              variant="primary"
              icon={<Plus size={14} />}
              onClick={() => setIsCreateDialogOpen(true)}
              disabled={isApplyingTemplate || isDeleting}>
              
                Add rule
              </Button>
            </ResponsiveStack>
          }>
          
          {isApplyingTemplate ?
          <LoadingOverlay
            label={`Applying ${
            applyingId ?
            getFirewallTemplate(applyingId)?.displayName :
            'template'}…`
            }
            progress={applyProgress} /> :

          isDeleting && deleteProgress.total > 0 ?
          <LoadingOverlay label="Deleting rules…" progress={deleteProgress} /> :
          rows.length === 0 ?
          <EmptyState
            variant="dashed"
            icon={<Shield size={18} />}
            title="No firewall rules configured for this desktop yet."
            description="Use a quick profile above or add a custom rule." /> :


          <DataTable
            rows={rows}
            columns={columns}
            rowId={(r) => r.id}
            selectable
            isRowSelectable={(r) => r.source === 'custom'}
            selected={selectedIds}
            onSelectionChange={setSelectedIds}
            defaultDensity="compact" />

          }
        </Card>
      </Page>

      <CreateFirewallRuleDialog
        vmId={vmId}
        vmOs={vmOs}
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => setIsCreateDialogOpen(false)}
        existingRules={effectiveRules} />
      

      <Dialog
        open={!!ruleToDelete}
        onClose={() => !isDeleting ? setRuleToDelete(null) : null}
        size="sm"
        title="Delete firewall rule?"
        description={
        ruleToDelete ?
        `This will permanently remove "${ruleToDelete.name}" from this VM.` :
        undefined
        }
        footer={
        <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
            variant="secondary"
            onClick={() => setRuleToDelete(null)}
            disabled={isDeleting}>
            
              Cancel
            </Button>
            <Button
            variant="destructive"
            icon={<Trash2 size={14} />}
            onClick={handleDeleteRule}
            loading={isDeleting}
            disabled={isDeleting}>
            
              Delete rule
            </Button>
          </ResponsiveStack>
        } />
      

      <Dialog
        open={bulkDeleteOpen}
        onClose={() => !isDeleting ? setBulkDeleteOpen(false) : null}
        size="sm"
        title={`Delete ${selectedIds.length} firewall rule${selectedIds.length !== 1 ? 's' : ''}?`}
        description="This will permanently remove the selected custom rules from this desktop. Inherited rules are unaffected."
        footer={
        <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
            variant="secondary"
            onClick={() => setBulkDeleteOpen(false)}
            disabled={isDeleting}>
            
              Cancel
            </Button>
            <Button
            variant="destructive"
            icon={<Trash2 size={14} />}
            onClick={handleBulkDelete}
            loading={isDeleting}
            disabled={isDeleting}>
            
              Delete {selectedIds.length} rule{selectedIds.length !== 1 ? 's' : ''}
            </Button>
          </ResponsiveStack>
        } />
      
    </>);

};

export default VMSecurityTab;