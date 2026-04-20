'use client';

import { useMemo, useState } from 'react';
import { Settings, Shield } from 'lucide-react';
import {
  Alert,
  Badge,
  Bento,
  BentoItem,
  Button,
  Checkbox,
  Drawer,
  FormField,
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

import { useCreateVmFirewallRuleMutation } from '@/gql/hooks';
import { createDebugger } from '@/utils/debug';
import { getPriorityFromLabel } from '@/utils/firewallHelpers';
import { SERVICE_PRESETS } from '@/config/servicePresets';

const debug = createDebugger('frontend:components:create-firewall-rule-dialog');

const parseValidationErrors = (errorMessage) => {
  if (!errorMessage) return [];
  const parts = errorMessage.split(
    /\. (?=Port overlap:|Destination port|Source port|Priority |Protocol )/,
  );
  return parts.map((part, i) => {
    const isOverlap = part.includes('Port overlap:');
    return {
      id: `err-${i}`,
      message: part.trim(),
      type: isOverlap ? 'overlap' : 'validation',
      canOverride: part.includes('overridesDept=true'),
      canConsolidate: part.includes('consolidating'),
    };
  });
};

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
  srcPortStart: '',
  srcPortEnd: '',
  srcIpAddr: '',
  srcIpMask: '',
  dstIpAddr: '',
  dstIpMask: '',
  overridesDept: false,
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

const CreateFirewallRuleDialog = ({
  vmId,
  vmOs,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState('simple');
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState('');

  const [createRule, { loading }] = useCreateVmFirewallRuleMutation();

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
    if (validationErrors.length) setValidationErrors([]);
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
      srcPortStart: '',
      srcPortEnd: '',
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
    setValidationErrors([]);
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
    debug.log('Creating firewall rule', form);
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
        srcPortStart: form.srcPortStart ? parseInt(form.srcPortStart, 10) : null,
        srcPortEnd: form.srcPortEnd ? parseInt(form.srcPortEnd, 10) : null,
        srcIpAddr: form.srcIpAddr || null,
        srcIpMask: form.srcIpMask || null,
        dstIpAddr: form.dstIpAddr || null,
        dstIpMask: form.dstIpMask || null,
        overridesDept: form.overridesDept,
      };
      await createRule({ variables: { vmId, input } });
      toast.success('Firewall rule created');
      onSuccess?.();
      reset();
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('Port overlap:') || msg.includes('overridesDept=true')) {
        const parsed = parseValidationErrors(msg);
        setValidationErrors(parsed);
        const overlaps = parsed.filter((e) => e.type === 'overlap').length;
        toast.error(
          overlaps === 1
            ? 'Rule conflicts with an existing rule'
            : `${overlaps} rule conflicts detected`,
        );
      } else {
        toast.error(`Could not create rule: ${msg}`);
      }
    }
  };

  const handleOverrideAndRetry = () => {
    update({ overridesDept: true });
    setValidationErrors([]);
    setTimeout(handleSubmit, 0);
  };

  const canOverride = validationErrors.some((e) => e.canOverride);

  return (
    <Drawer
      open={!!isOpen}
      onClose={handleClose}
      side="right"
      size={520}
      title={
        <ResponsiveStack direction="row" gap={2} align="center">
          <Shield size={14} />
          <span>New firewall rule</span>
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
        <span>
          Control network traffic for this VM. Rules here apply on top of the
          department defaults.
        </span>

        {validationErrors.length > 0 ? (
          <Alert
            tone="warning"
            title={
              validationErrors.length === 1
                ? 'Rule conflict detected'
                : `${validationErrors.length} rule conflicts detected`
            }
            actions={
              <ResponsiveStack direction="row" gap={2}>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setValidationErrors([])}
                >
                  Cancel
                </Button>
                {canOverride ? (
                  <Button size="sm" variant="primary" onClick={handleOverrideAndRetry}>
                    Override department rules
                  </Button>
                ) : null}
              </ResponsiveStack>
            }
          >
            <ResponsiveStack direction="col" gap={1}>
              {validationErrors.map((e) => (
                <span key={e.id}>• {e.message}</span>
              ))}
            </ResponsiveStack>
          </Alert>
        ) : null}

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

              <Checkbox
                checked={form.overridesDept}
                onChange={(e) => update({ overridesDept: e.target.checked })}
                label="Override department rules (admin only)"
              />
            </ResponsiveStack>
          </TabPanel>

          <TabPanel value="advanced">
            <ResponsiveStack direction="col" gap={4}>
              <Bento columns={{ base: 1, md: 2 }} gap={12}>
                <BentoItem>
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
                </BentoItem>
                <BentoItem>
                  <FormField label="Action">
                    <Select
                      value={form.action}
                      onChange={(v) => update({ action: v })}
                      options={ACTION_OPTIONS}
                    />
                  </FormField>
                </BentoItem>
              </Bento>

              <FormField label="Description" optional>
                <Textarea
                  value={form.description}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder="What does this rule do?"
                  rows={2}
                />
              </FormField>

              <Bento columns={{ base: 1, md: 2 }} gap={12}>
                <BentoItem>
                  <FormField label="Direction">
                    <Select
                      value={form.direction}
                      onChange={(v) => update({ direction: v })}
                      options={DIRECTION_OPTIONS}
                    />
                  </FormField>
                </BentoItem>
                <BentoItem>
                  <FormField label="Protocol">
                    <Select
                      value={form.protocol}
                      onChange={(v) => update({ protocol: v })}
                      options={PROTOCOL_OPTIONS}
                    />
                  </FormField>
                </BentoItem>
              </Bento>

              <FormField
                label="Destination ports"
                helper="Leave end empty for a single port."
              >
                <Bento columns={{ base: 1, md: 2 }} gap={8}>
                  <BentoItem>
                    <TextField
                      placeholder="Start"
                      value={form.dstPortStart}
                      onChange={(e) => {
                        update({ dstPortStart: e.target.value });
                        clearFieldError('dstPortStart');
                      }}
                      error={errors.dstPortStart}
                    />
                  </BentoItem>
                  <BentoItem>
                    <TextField
                      placeholder="End (optional)"
                      value={form.dstPortEnd}
                      onChange={(e) => {
                        update({ dstPortEnd: e.target.value });
                        clearFieldError('dstPortEnd');
                      }}
                      error={errors.dstPortEnd}
                    />
                  </BentoItem>
                </Bento>
              </FormField>

              <FormField
                label="Priority"
                helper="Lower numbers evaluate first."
              >
                <Bento columns={{ base: 1, md: 2 }} gap={8}>
                  <BentoItem>
                    <Select
                      value={form.priorityLabel}
                      onChange={(v) => update({ priorityLabel: v })}
                      options={PRIORITY_OPTIONS}
                    />
                  </BentoItem>
                  {form.priorityLabel === 'CUSTOM' ? (
                    <BentoItem>
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
                    </BentoItem>
                  ) : null}
                </Bento>
              </FormField>

              <Checkbox
                checked={form.overridesDept}
                onChange={(e) => update({ overridesDept: e.target.checked })}
                label="Override department rules (admin only)"
              />

              {form.overridesDept ? (
                <Alert tone="warning">
                  This rule will override matching department rules. Use sparingly
                  — it can weaken the department baseline.
                </Alert>
              ) : null}
            </ResponsiveStack>
          </TabPanel>
        </Tabs>

        {vmOs ? (
          <ResponsiveStack direction="row" gap={2} align="center">
            <span>Target OS:</span>
            <Badge tone="neutral">{vmOs}</Badge>
          </ResponsiveStack>
        ) : null}
      </ResponsiveStack>
    </Drawer>
  );
};

export default CreateFirewallRuleDialog;
