'use client';

import React, { useMemo, useState } from 'react';
import { Shield, Settings } from 'lucide-react';
import {
  Drawer,
  Button,
  ButtonGroup,
  TextField,
  Textarea,
  Select,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Alert,
} from '@infinibay/harbor';
import { toast } from 'sonner';

import { useCreateDepartmentFirewallRuleMutation } from '@/gql/hooks';
import { createDebugger } from '@/utils/debug';
import { getPriorityFromLabel } from '@/utils/firewallHelpers';
import { SERVICE_PRESETS } from '@/config/servicePresets';

const debug = createDebugger('frontend:components:create-dept-firewall-rule-dialog');

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
    []
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
      dstPortStart: r.port?.toString() || r.portRange?.start?.toString() || '',
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
    if (mode === 'simple' && !selectedPreset) next.preset = 'Pick a service first';
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
        <span className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-accent-2" />
          New department rule
        </span>
      }
      footer={
        <ButtonGroup className="justify-end">
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading} disabled={loading}>
            {loading ? 'Creating…' : 'Create rule'}
          </Button>
        </ButtonGroup>
      }
    >
      <div className="space-y-5">
        <Alert tone="info">
          Rules created here apply to <strong>every VM</strong> in this
          department. Individual VMs can still override with the
          <code className="mx-1 px-1 rounded bg-surface-1 text-[11px]">
            overrides department
          </code>
          flag.
        </Alert>

        <Tabs value={mode} onValueChange={setMode} variant="pill">
          <TabList>
            <Tab value="simple" icon={<Shield className="h-3.5 w-3.5" />}>
              Simple
            </Tab>
            <Tab value="advanced" icon={<Settings className="h-3.5 w-3.5" />}>
              Advanced
            </Tab>
          </TabList>

          <TabPanel value="simple" className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-fg">Service</label>
              <Select
                value={selectedPreset}
                onChange={handlePresetChange}
                options={presetOptions}
                placeholder="Pick a common service"
              />
              {errors.preset && (
                <p className="text-xs text-danger">{errors.preset}</p>
              )}
              {selectedPreset && (
                <p className="text-xs text-fg-muted">
                  {SERVICE_PRESETS.find((p) => p.id === selectedPreset)?.description}
                </p>
              )}
            </div>

            <TextField
              label="Rule name"
              placeholder="e.g. Allow HTTPS"
              value={form.name}
              onChange={(e) => {
                update({ name: e.target.value });
                clearFieldError('name');
              }}
              error={errors.name}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-fg">Action</label>
              <Select
                value={form.action}
                onChange={(v) => update({ action: v })}
                options={ACTION_OPTIONS}
              />
            </div>
          </TabPanel>

          <TabPanel value="advanced" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Rule name *"
                placeholder="e.g. Allow custom app"
                value={form.name}
                onChange={(e) => {
                  update({ name: e.target.value });
                  clearFieldError('name');
                }}
                error={errors.name}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-fg">Action</label>
                <Select
                  value={form.action}
                  onChange={(v) => update({ action: v })}
                  options={ACTION_OPTIONS}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-fg">
                Description (optional)
              </label>
              <Textarea
                value={form.description}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="What does this rule do?"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-fg">Direction</label>
                <Select
                  value={form.direction}
                  onChange={(v) => update({ direction: v })}
                  options={DIRECTION_OPTIONS}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-fg">Protocol</label>
                <Select
                  value={form.protocol}
                  onChange={(v) => update({ protocol: v })}
                  options={PROTOCOL_OPTIONS}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-fg">
                Destination ports
              </label>
              <div className="grid grid-cols-2 gap-2">
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
              </div>
              <p className="text-xs text-fg-muted">
                Leave end empty for a single port.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-fg">Priority</label>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={form.priorityLabel}
                  onChange={(v) => update({ priorityLabel: v })}
                  options={PRIORITY_OPTIONS}
                />
                {form.priorityLabel === 'CUSTOM' && (
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
                )}
              </div>
              <p className="text-xs text-fg-muted">
                Lower numbers evaluate first.
              </p>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </Drawer>
  );
};

export default CreateDepartmentFirewallRuleDialog;
