'use client';

import { useEffect, useMemo, useState } from 'react';
import { Cpu, Save } from 'lucide-react';
import {
  Alert,
  Badge,
  Button,
  Card,
  FieldRow,
  FormField,
  FormSection,
  NumberField,
  ResponsiveStack,
  Skeleton,
  Switch,
} from '@infinibay/harbor';
import {
  useDepartmentGpuPolicyQuery,
  useUpdateDepartmentGpuPolicyMutation,
} from '@/gql/hooks';

// The policy fields the broker admits against (mirrors DepartmentGpuPolicyType /
// GpuBrokerService). Each carries a human explanation of what it controls.
const NUMERIC_FIELDS = [
  {
    key: 'vramReserveMB',
    label: 'VRAM reserve (MB)',
    helper: 'Guaranteed VRAM held for each admitted GPU VM in this department.',
    min: 0,
    step: 256,
  },
  {
    key: 'vramCapMB',
    label: 'VRAM cap (MB)',
    helper: 'Maximum VRAM a single GPU VM may consume before it is refused.',
    min: 0,
    step: 256,
  },
  {
    key: 'maxConcurrentGpuVMs',
    label: 'Max concurrent GPU VMs',
    helper: 'How many GPU VMs from this department may be admitted at once.',
    min: 0,
    step: 1,
  },
  {
    key: 'priorityTier',
    label: 'Priority tier',
    helper: 'Scheduling priority — lower runs first (1 = highest, 3 = lowest).',
    min: 1,
    max: 3,
    step: 1,
  },
  {
    key: 'gpuTimeWeight',
    label: 'GPU time weight',
    helper: 'Weighted fair-share of GPU time vs other departments at the same tier.',
    min: 1,
    step: 1,
  },
  {
    key: 'submissionRateTokens',
    label: 'Submission rate tokens',
    helper: 'Command-submission budget per VM (throttles a runaway guest).',
    min: 0,
    step: 1000,
  },
];

const POLICY_KEYS = ['gpuEnabled', ...NUMERIC_FIELDS.map((f) => f.key)];

const pickPolicy = (policy) =>
  policy
    ? POLICY_KEYS.reduce((acc, k) => ({ ...acc, [k]: policy[k] }), {})
    : null;

const DepartmentGpuTab = ({ departmentId }) => {
  const { data, loading, error } = useDepartmentGpuPolicyQuery({
    variables: { departmentId },
    skip: !departmentId,
  });
  const [updatePolicy, { loading: saving }] = useUpdateDepartmentGpuPolicyMutation();

  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Seed the form once the policy loads (the Department row always carries
  // defaults, so this is populated even before GPUs were ever enabled).
  const loaded = useMemo(() => pickPolicy(data?.departmentGpuPolicy), [data]);
  useEffect(() => {
    if (loaded && !form) setForm(loaded);
  }, [loaded, form]);

  const dirty = useMemo(
    () => !!form && !!loaded && POLICY_KEYS.some((k) => form[k] !== loaded[k]),
    [form, loaded],
  );

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
    setSaveError(null);
  };

  const handleSave = async () => {
    setSaveError(null);
    try {
      await updatePolicy({
        variables: { input: { departmentId, ...form } },
      });
      setSaved(true);
    } catch (err) {
      setSaveError(err?.message || 'Could not save the GPU policy.');
    }
  };

  if (loading || !form) {
    return (
      <Card className="p-6">
        <ResponsiveStack gap="md">
          <Skeleton width="40%" height={24} />
          <Skeleton width="100%" height={48} />
          <Skeleton width="100%" height={120} />
        </ResponsiveStack>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="error" title="Could not load the GPU policy">
        {error.message}
      </Alert>
    );
  }

  return (
    <ResponsiveStack gap="lg">
      <Card className="p-6">
        <ResponsiveStack gap="md">
          <div className="flex items-center gap-2">
            <Cpu size={18} />
            <h2 className="text-base font-semibold m-0">GPU (infinigpu)</h2>
            <Badge tone={form.gpuEnabled ? 'success' : 'neutral'}>
              {form.gpuEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
          <p className="text-sm opacity-70 m-0">
            Give this department’s VMs a virtual GPU. When enabled, new GPU VMs are
            admitted by the host broker against the quotas below; other departments
            are unaffected.
          </p>

          <FormField
            label="Enable virtual GPUs for this department"
            helper="VMs created here can request a GPU. The vfio-user device attaches at boot."
            labelless
          >
            <Switch
              label={form.gpuEnabled ? 'On' : 'Off'}
              checked={form.gpuEnabled}
              onChange={(e) => setField('gpuEnabled', e.target.checked)}
            />
          </FormField>
        </ResponsiveStack>
      </Card>

      <Card className="p-6">
        <FormSection
          title="Scheduling & quotas"
          description="What the host broker admits GPU VMs against. Applies when GPUs are enabled."
        >
          <FieldRow>
            {NUMERIC_FIELDS.map((f) => (
              <FormField key={f.key} label={f.label} helper={f.helper}>
                <NumberField
                  value={form[f.key]}
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  disabled={!form.gpuEnabled}
                  onChange={(v) => setField(f.key, v)}
                />
              </FormField>
            ))}
          </FieldRow>
        </FormSection>
      </Card>

      {saveError && (
        <Alert variant="error" title="Save failed">
          {saveError}
        </Alert>
      )}
      {saved && !dirty && (
        <Alert variant="success" title="GPU policy saved">
          The department GPU policy is updated.
        </Alert>
      )}

      <div className="flex justify-end">
        <Button
          variant="primary"
          icon={<Save size={14} />}
          onClick={handleSave}
          disabled={!dirty || saving}
          loading={saving}
        >
          {saving ? 'Saving…' : 'Save GPU policy'}
        </Button>
      </div>
    </ResponsiveStack>
  );
};

export default DepartmentGpuTab;
