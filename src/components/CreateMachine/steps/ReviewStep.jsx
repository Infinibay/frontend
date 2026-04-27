'use client';

import {
  Alert,
  Badge,
  Card,
  EmptyState,
  Page,
  PropertyList,
  ResponsiveGrid,
  ResponsiveStack,
} from '@infinibay/harbor';
import { useWizardContext } from '../wizard/wizard';
import {
  CheckCircle2,
  Cpu,
  Monitor,
  Package,
  Settings2,
  User,
  Zap,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectDepartments } from '@/state/slices/departments';

const operatingSystems = {
  ubuntu20: 'Ubuntu 20.04 LTS',
  ubuntu22: 'Ubuntu 22.04 LTS',
  UBUNTU: 'Ubuntu',
  FEDORA: 'Fedora',
  WINDOWS10: 'Windows 10 Pro',
  WINDOWS11: 'Windows 11 Pro',
};

const formatMemory = (memory) => {
  if (!memory) return '';
  if (memory < 1) {
    const mbValue = Math.round(memory * 1024);
    return `${mbValue}MB VRAM`;
  }
  return `${Math.round(memory)}GB VRAM`;
};

export function ReviewStep() {
  const { values } = useWizardContext();
  const templates = useSelector((state) => state.templates.items);
  const applications = useSelector((state) => state.applications.items);
  const departments = useSelector(selectDepartments);

  const blueprint = values.blueprint || {};
  const selectedTemplate = templates.find(
    (t) => t.id === blueprint.templateId,
  );
  const selectedApps = values.applications?.applications || [];
  const selectedAppDetails = applications.filter((app) =>
    selectedApps.includes(app.id),
  );
  const selectedDepartment = departments.find(
    (d) => String(d.id) === String(values.basicInfo?.departmentId),
  );

  const isCustom = blueprint.mode === 'custom' || blueprint.templateId === 'custom';
  const cores = isCustom
    ? blueprint.customCores || 4
    : selectedTemplate?.cores;
  const ram = isCustom
    ? blueprint.customRam || 8
    : selectedTemplate?.ram;
  const storage = isCustom
    ? blueprint.customStorage || 50
    : selectedTemplate?.storage;

  const basicInfoItems = [
    { key: 'name', label: 'Name', value: values.basicInfo?.name || '—' },
    values.basicInfo?.username && {
      key: 'username',
      label: 'Username',
      value: values.basicInfo.username,
    },
    selectedDepartment && {
      key: 'department',
      label: 'Department',
      value: selectedDepartment.name,
    },
  ].filter(Boolean);

  const resourceItems = [
    {
      key: 'config',
      label: 'Configuration',
      value: isCustom ? 'Custom hardware' : selectedTemplate?.name || '—',
    },
    cores != null && { key: 'cpu', label: 'CPU', value: `${cores} cores` },
    ram != null && { key: 'ram', label: 'Memory', value: `${ram} GB` },
    storage != null && {
      key: 'disk',
      label: 'Storage',
      value: `${storage} GB`,
    },
    {
      key: 'gpu',
      label: 'Graphics',
      value: values.gpu?.gpuInfo
        ? `${values.gpu.gpuInfo.model} · ${formatMemory(values.gpu.gpuInfo.memory)}`
        : 'No GPU',
    },
  ].filter(Boolean);

  const systemItems = [
    {
      key: 'os',
      label: 'Operating system',
      value: operatingSystems[blueprint.os] || blueprint.os || '—',
    },
  ];

  const featureFlags = [
    blueprint.backup && {
      tone: 'success',
      title: 'Backup enabled',
      body: 'Daily backups will be performed automatically.',
    },
    blueprint.highAvailability && {
      tone: 'success',
      title: 'High availability',
      body: 'Automatic failover protection is enabled.',
    },
    (blueprint.gpuEnabled || values.gpu?.gpuInfo) && {
      tone: 'success',
      title: 'GPU support',
      body: 'GPU acceleration is enabled for this machine.',
    },
  ].filter(Boolean);

  return (
    <Page size="lg">
        <ResponsiveGrid columns={{ base: 1, lg: 2 }} gap={6}>
          <Card
            variant="default"
            spotlight={false}
            glow={false}
            fullHeight
            leadingIcon={<User size={18} />}
            leadingIconTone="purple"
            title="Basic information"
          >
            <PropertyList items={basicInfoItems} />
          </Card>

          <Card
            variant="default"
            spotlight={false}
            glow={false}
            fullHeight
            leadingIcon={isCustom ? <Settings2 size={18} /> : <Cpu size={18} />}
            leadingIconTone="sky"
            title="Resources"
            description={selectedTemplate?.description}
          >
            {resourceItems.length > 1 ? (
              <PropertyList items={resourceItems} />
            ) : (
              <EmptyState
                variant="inline"
                icon={<Cpu size={14} />}
                title="No resources selected"
              />
            )}
          </Card>

          <Card
            variant="default"
            spotlight={false}
            glow={false}
            fullHeight
            leadingIcon={<Monitor size={18} />}
            leadingIconTone="green"
            title="System configuration"
          >
            <PropertyList items={systemItems} />
          </Card>

          <Card
            variant="default"
            spotlight={false}
            glow={false}
            fullHeight
            leadingIcon={<Package size={18} />}
            leadingIconTone="amber"
            title="Applications"
            description={
              selectedAppDetails.length > 0
                ? `${selectedAppDetails.length} selected`
                : undefined
            }
          >
            {selectedAppDetails.length > 0 ? (
              <ResponsiveStack direction="row" gap={2} wrap>
                {selectedAppDetails.map((app) => (
                  <Badge key={app.id} tone="purple" icon={<Package size={12} />}>
                    {app.name}
                  </Badge>
                ))}
              </ResponsiveStack>
            ) : (
              <EmptyState
                variant="inline"
                icon={<Package size={14} />}
                title="No applications selected"
              />
            )}
          </Card>
        </ResponsiveGrid>

        {values.gpu?.gpuInfo && (
          <Card
            variant="default"
            spotlight={false}
            glow={false}
            leadingIcon={<Zap size={18} />}
            leadingIconTone="purple"
            title="GPU passthrough"
          >
            <PropertyList
              items={[
                { key: 'model', label: 'Model', value: values.gpu.gpuInfo.model },
                { key: 'vendor', label: 'Vendor', value: values.gpu.gpuInfo.vendor },
                {
                  key: 'memory',
                  label: 'Memory',
                  value: formatMemory(values.gpu.gpuInfo.memory),
                },
              ]}
            />
          </Card>
        )}

        {featureFlags.length > 0 && (
          <ResponsiveStack direction="col" gap={3}>
            {featureFlags.map((f) => (
              <Alert
                key={f.title}
                tone={f.tone}
                icon={<CheckCircle2 size={14} />}
                title={f.title}
              >
                {f.body}
              </Alert>
            ))}
          </ResponsiveStack>
        )}
    </Page>
  );
}
