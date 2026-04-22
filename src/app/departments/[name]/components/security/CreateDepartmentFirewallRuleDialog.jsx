'use client';

import { useMemo, useState } from 'react';
import { Settings, Shield } from 'lucide-react';
import {
  Alert,
  Badge,
  Button,
  Drawer,
  FormField,
  ResponsiveGrid,
  ResponsiveStack,
  Select,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  TextField,
  Textarea,
} from '@infinibay/harbor';
import { toast } from 'sonner';

import { useCreateDepartmentFirewallRuleMutation } from '@/gql/hooks';
import { createDebugger } from '@/utils/debug';
import { getPriorityFromLabel } from '@/utils/firewallHelpers';
import { SERVICE_PRESETS } from '@/config/servicePresets';

const debug = createDebugger(
  'frontend:components:create-dept-firewall-rule-dialog',
);

const EMPTY_FORM = {
  name: '',
  description: '',
  action: 'ACCEPT',
  direction: 'IN',
  priorityLabel: 'MEDIUM',
  customPriority: '',
  protocol: 'TCP',
  dstPortStart: '',
  dstPortEnd: '',
  srcIpAddr: '',
  srcIpMask: '',
  dstIpAddr: '',
  dstIpMask: '',
};

const ACTION_OPTIONS = [
  { value: 'ACCEPT', label: '✓ Allow traffic' },
  { value: 'DROP', label: '✗ Block traffic' },
];
const DIRECTION_OPTIONS = [
  { value: 'IN', label: '↓ Inbound' },
  { value: 'OUT', label: '↑ Outbound' },
  { value: 'INOUT', label: '↔ Bidirectional' },
];
const PROTOCOL_OPTIONS = [
  { value: 'TCP', label: 'TCP' },
  { value: 'UDP', label: 'UDP' },
  { value: 'ICMP', label: 'ICMP' },
];
const PRIORITY_OPTIONS = [
  { value: 'HIGH', label: '● High (200)' },
  { value: 'MEDIUM', label: '● Medium (500)' },
  { value: 'LOW', label: '● Low (800)' },
  { value: 'CUSTOM', label: '⚙ Custom' },
];

const CreateDepartmentFirewallRuleDialog = ({
  departmentId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState('simple');
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [selectedPreset, setSelectedPreset] = useState('');

  const [createRule, { loading }] = useCreateDepartmentFirewallRuleMutation();

  const presetOptions = useMemo(
    () => [
      { value: '', label: '— select a service —' },
      ...SERVICE_PRESETS.map((p) => ({
        value: p.id,
        label: `${p.icon ? p.icon + ' ' : ''}${p.displayName} · ${p.category}`,
      })),
    ],
    [],
  );

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handlePresetChange = (presetId) => {
    setSelectedPreset(presetId);
    if (!presetId) return;
    const preset = SERVICE_PRESETS.find((p) => p.id === presetId);
    if (!preset || !preset.rules.length) return;
    const r = preset.rules[0];
    update({
      name: `Allow ${preset.displayName}`,
      description: preset.description,
      action: 'ACCEPT',
      direction: r.direction,
      protocol: r.protocol.toUpperCase(),
      dstPortStart:
        r.port?.toString() || r.portRange?.start?.toString() || '',
      dstPortEnd: r.port?.toString() || r.portRange?.end?.toString() || '',
      srcIpAddr: '',
      srcIpMask: '',
      dstIpAddr: '',
      dstIpMask: '',
    });
  };

  const validateForm = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Rule name is required';
    if (mode === 'simple' && !selectedPreset)
      next.preset = 'Pick a service first';
    if (mode === 'advanced') {
      const ds = Number(form.dstPortStart);
      const de = Number(form.dstPortEnd);
      if (form.dstPortStart && (isNaN(ds) || ds < 1 || ds > 65535))
        next.dstPortStart = 'Port must be 1–65535';
      if (form.dstPortEnd && (isNaN(de) || de < 1 || de > 65535))
        next.dstPortEnd = 'Port must be 1–65535';
      if (form.dstPortStart && form.dstPortEnd && ds > de)
        next.dstPortEnd = 'End ≥ start';
      if (form.priorityLabel === 'CUSTOM') {
        const p = Number(form.customPriority);
        if (!form.customPriority || isNaN(p) || p < 1 || p > 1000)
          next.customPriority = '1–1000';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setSelectedPreset('');
    setErrors({});
    setMode('simple');
  };

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors above');
      return;
    }
    debug.log('Creating department firewall rule', form);
    try {
      const priority =
        form.priorityLabel === 'CUSTOM'
          ? parseInt(form.customPriority, 10)
          : getPriorityFromLabel(form.priorityLabel);
      const input = {
        name: form.name,
        description: form.description || null,
        action: form.action,
        direction: form.direction,
        priority,
        protocol: form.protocol.toLowerCase(),
        dstPortStart: form.dstPortStart ? parseInt(form.dstPortStart, 10) : null,
        dstPortEnd: form.dstPortEnd ? parseInt(form.dstPortEnd, 10) : null,
        srcIpAddr: form.srcIpAddr || null,
        srcIpMask: form.srcIpMask || null,
        dstIpAddr: form.dstIpAddr || null,
        dstIpMask: form.dstIpMask || null,
      };
      await createRule({ variables: { departmentId, input } });
      toast.success('Department firewall rule created');
      onSuccess?.();
      reset();
    } catch (err) {
      toast.error(`Could not create rule: ${err.message || err}`);
    }
  };

  return (
    <Drawer
      open={!!isOpen}
      onClose={handleClose}
      side="right"
      size={520}
      title={
        <ResponsiveStack direction="row" gap={2} align="center">
          <Shield size={14} />
          <span>New department rule</span>
        </ResponsiveStack>
      }
      footer={
        <ResponsiveStack direction="row" gap={2} justify="end">
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Creating…' : 'Create rule'}
          </Button>
        </ResponsiveStack>
      }
    >
      <ResponsiveStack direction="col" gap={5}>
        <Alert tone="info" icon={<Shield size={14} />}>
          Rules created here apply to <strong>every VM</strong> in this
          department. Individual VMs can still override with the{' '}
          <Badge tone="neutral">overrides department</Badge> flag.
        </Alert>

        <Tabs value={mode} onValueChange={setMode} variant="pill">
          <TabList>
            <Tab value="simple" icon={<Shield size={12} />}>
              Simple
            </Tab>
            <Tab value="advanced" icon={<Settings size={12} />}>
              Advanced
            </Tab>
          </TabList>

          <TabPanel value="simple">
            <ResponsiveStack direction="col" gap={4}>
              <FormField
                label="Service"
                error={errors.preset}
                helper={
                  selectedPreset
                    ? SERVICE_PRESETS.find((p) => p.id === selectedPreset)
                        ?.description
                    : undefined
                }
              >
                <Select
                  value={selectedPreset}
                  onChange={handlePresetChange}
                  options={presetOptions}
                  placeholder="Pick a common service"
                />
              </FormField>

              <FormField label="Rule name" error={errors.name}>
                <TextField
                  placeholder="e.g. Allow HTTPS"
                  value={form.name}
                  onChange={(e) => {
                    update({ name: e.target.value });
                    clearFieldError('name');
                  }}
                />
              </FormField>

              <FormField label="Action">
                <Select
                  value={form.action}
                  onChange={(v) => update({ action: v })}
                  options={ACTION_OPTIONS}
                />
              </FormField>
            </ResponsiveStack>
          </TabPanel>

          <TabPanel value="advanced">
            <ResponsiveStack direction="col" gap={4}>
              <ResponsiveGrid columns={{ base: 1, md: 2 }} gap={3}>
                <FormField label="Rule name" required error={errors.name}>
                  <TextField
                    placeholder="e.g. Allow custom app"
                    value={form.name}
                    onChange={(e) => {
                      update({ name: e.target.value });
                      clearFieldError('name');
                    }}
                  />
                </FormField>
                <FormField label="Action">
                  <Select
                    value={form.action}
                    onChange={(v) => update({ action: v })}
                    options={ACTION_OPTIONS}
                  />
                </FormField>
              </ResponsiveGrid>

              <FormField label="Description" optional>
                <Textarea
                  value={form.description}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder="What does this rule do?"
                  rows={2}
                />
              </FormField>

              <ResponsiveGrid columns={{ base: 1, md: 2 }} gap={3}>
                <FormField label="Direction">
                  <Select
                    value={form.direction}
                    onChange={(v) => update({ direction: v })}
                    options={DIRECTION_OPTIONS}
                  />
                </FormField>
                <FormField label="Protocol">
                  <Select
                    value={form.protocol}
                    onChange={(v) => update({ protocol: v })}
                    options={PROTOCOL_OPTIONS}
                  />
                </FormField>
              </ResponsiveGrid>

              <FormField
                label="Destination ports"
                helper="Leave end empty for a single port."
              >
                <ResponsiveGrid columns={{ base: 1, md: 2 }} gap={2}>
                  <TextField
                    placeholder="Start"
                    value={form.dstPortStart}
                    onChange={(e) => {
                      update({ dstPortStart: e.target.value });
                      clearFieldError('dstPortStart');
                    }}
                    error={errors.dstPortStart}
                  />
                  <TextField
                    placeholder="End (optional)"
                    value={form.dstPortEnd}
                    onChange={(e) => {
                      update({ dstPortEnd: e.target.value });
                      clearFieldError('dstPortEnd');
                    }}
                    error={errors.dstPortEnd}
                  />
                </ResponsiveGrid>
              </FormField>

              <FormField
                label="Priority"
                helper="Lower numbers evaluate first."
              >
                <ResponsiveGrid columns={{ base: 1, md: 2 }} gap={2}>
                  <Select
                    value={form.priorityLabel}
                    onChange={(v) => update({ priorityLabel: v })}
                    options={PRIORITY_OPTIONS}
                  />
                  {form.priorityLabel === 'CUSTOM' ? (
                    <TextField
                      type="number"
                      placeholder="1–1000"
                      value={form.customPriority}
                      onChange={(e) => {
                        update({ customPriority: e.target.value });
                        clearFieldError('customPriority');
                      }}
                      error={errors.customPriority}
                    />
                  ) : null}
                </ResponsiveGrid>
              </FormField>
            </ResponsiveStack>
          </TabPanel>
        </Tabs>
      </ResponsiveStack>
    </Drawer>
  );
};

export default CreateDepartmentFirewallRuleDialog;
