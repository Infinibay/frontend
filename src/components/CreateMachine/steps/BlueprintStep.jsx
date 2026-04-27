'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  FormField,
  FormSection,
  IconTile,
  LoadingOverlay,
  Page,
  Progress,
  ResourceMeter,
  ResponsiveGrid,
  ResponsiveStack,
  SliderField,
  Stat,
  TextField,
  ToggleGroup,
} from '@infinibay/harbor';
import {
  Server,
  Settings2,
  Cpu,
  MemoryStick,
  HardDrive,
  Package,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  CloudDownload,
  KeyRound,
  Upload,
} from 'lucide-react';
import { FaUbuntu, FaWindows } from 'react-icons/fa';
import { SiFedora } from 'react-icons/si';
import { useWizardContext } from '../wizard/wizard';
import { useFormError } from '../wizard/form-error-provider';
import { fetchTemplates, selectTemplatesState } from '@/state/slices/templates';
import { fetchTemplateCategories } from '@/state/slices/templateCategories';
import { useGetSystemResourcesQuery } from '@/gql/hooks';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { useRouter } from 'next/navigation';

const osOptions = [
  {
    id: 'WINDOWS10',
    name: 'Windows 10',
    icon: FaWindows,
    tone: 'sky',
    description: 'Microsoft Windows 10 operating system',
  },
  {
    id: 'WINDOWS11',
    name: 'Windows 11',
    icon: FaWindows,
    tone: 'sky',
    description: 'Latest version of Microsoft Windows',
  },
  {
    id: 'UBUNTU',
    name: 'Ubuntu',
    icon: FaUbuntu,
    tone: 'amber',
    description: 'Popular Linux distribution known for its ease of use',
  },
  {
    id: 'FEDORA',
    name: 'Fedora',
    icon: SiFedora,
    tone: 'purple',
    description: 'Advanced Linux distribution with latest features',
  },
];

const calculatePerformanceScore = (cores, ram, storage) => {
  const cpuScore = Math.min((cores / 32) * 100, 100);
  const ramScore = Math.min((ram / 128) * 100, 100);
  const storageScore = Math.min((storage / 1000) * 100, 100);
  const total = cpuScore * 0.4 + ramScore * 0.4 + storageScore * 0.2;
  return {
    score: Math.round(total),
    level:
      total <= 20
        ? 'Basic'
        : total <= 40
          ? 'Standard'
          : total <= 60
            ? 'Advanced'
            : total <= 80
              ? 'High Performance'
              : 'Enterprise',
    percentage: Math.min(total, 100),
  };
};

function progressTone(score) {
  if (score <= 20) return 'sky';
  if (score <= 40) return 'green';
  if (score <= 60) return 'amber';
  if (score <= 80) return 'purple';
  return 'purple';
}

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

export function BlueprintStep({ id }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};

  const {
    items: templates,
    loading: templatesLoading,
    error: templatesError,
  } = useSelector(selectTemplatesState);
  const { items: categories } = useSelector((state) => state.templateCategories);

  const { data: systemResources } = useGetSystemResourcesQuery();
  const cpuLimit = systemResources?.getSystemResources?.cpu?.available || 64;
  const memoryLimit = systemResources?.getSystemResources?.memory?.available || 512;
  const diskAvailable = systemResources?.getSystemResources?.disk?.available || 800;

  const { isOSAvailable, loading: osLoading, isReady } = useSystemStatus({ checkOnMount: true });

  const [mode, setMode] = useState(stepValues.mode || 'blueprint');
  const [selectedTemplateId, setSelectedTemplateId] = useState(stepValues.templateId || null);
  const [customOs, setCustomOs] = useState(stepValues.customOs || null);
  const [customHardware, setCustomHardware] = useState({
    cores: stepValues.customCores || 4,
    ram: stepValues.customRam || 8,
    storage: stepValues.customStorage || 50,
  });

  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchTemplateCategories());
  }, [dispatch]);

  // Make sure the wizard has a mode value from the start, so validation
  // doesn't fall through to the custom branch on first render.
  useEffect(() => {
    if (stepValues.mode == null) {
      setValue(`${id}.mode`, mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const templatesByCategory = useMemo(
    () =>
      templates.reduce((acc, template) => {
        const categoryId = template.categoryId;
        if (!acc[categoryId]) acc[categoryId] = [];
        acc[categoryId].push(template);
        return acc;
      }, {}),
    [templates],
  );

  const handleModeChange = (next) => {
    setMode(next);
    setValue(`${id}.mode`, next);
    if (next === 'blueprint') {
      setCustomOs(null);
      setValue(`${id}.customOs`, null);
      setValue(`${id}.templateId`, selectedTemplateId);
    } else {
      setSelectedTemplateId(null);
      setValue(`${id}.templateId`, null);
      // Pre-fill custom OS if already selected
      if (customOs) {
        setValue(`${id}.os`, customOs);
      }
    }
  };

  const handleBlueprintSelect = (template) => {
    setSelectedTemplateId(template.id);
    setMode('blueprint');
    setCustomOs(null);
    setValue(`${id}.mode`, 'blueprint');
    setValue(`${id}.customOs`, null);
    setValue(`${id}.templateId`, template.id);
    setValue(`${id}.os`, template.osType?.toUpperCase());
    setValue(`${id}.customCores`, template.cores);
    setValue(`${id}.customRam`, template.ram);
    setValue(`${id}.customStorage`, template.storage);

    // Pre-fill applications and scripts for the later step
    if (template.applications?.length) {
      setValue(
        'applications.applications',
        template.applications.map((a) => a.applicationId),
      );
    } else {
      setValue('applications.applications', []);
    }

    if (template.scripts?.length) {
      setValue(
        'applications.scripts',
        template.scripts.map((s) => ({
          scriptId: s.scriptId,
          inputValues: s.inputValues || {},
        })),
      );
    } else {
      setValue('applications.scripts', []);
    }
  };

  const handleCustomOsSelect = (osId) => {
    setCustomOs(osId);
    setMode('custom');
    setSelectedTemplateId(null);
    setValue(`${id}.mode`, 'custom');
    setValue(`${id}.customOs`, osId);
    setValue(`${id}.os`, osId);
    setValue(`${id}.templateId`, 'custom');
    setValue(`${id}.customCores`, customHardware.cores);
    setValue(`${id}.customRam`, customHardware.ram);
    setValue(`${id}.customStorage`, customHardware.storage);
    setValue('applications.applications', []);
    setValue('applications.scripts', []);
  };

  const updateCustomHardware = (key, value) => {
    const next = { ...customHardware, [key]: value };
    setCustomHardware(next);
    setValue(`${id}.custom${key.charAt(0).toUpperCase() + key.slice(1)}`, value);
  };

  const perfCustom = calculatePerformanceScore(
    customHardware.cores,
    customHardware.ram,
    customHardware.storage,
  );

  const templateError = getError('templateId');
  const osError = getError('os');
  const selectedOs = stepValues.os;
  const isWindows = typeof selectedOs === 'string' && selectedOs.startsWith('WINDOWS');

  if (templatesLoading.fetch) {
    return (
      <Page size="md">
        <LoadingOverlay label="Loading blueprints…" />
      </Page>
    );
  }

  if (templatesError.fetch) {
    return (
      <Page size="md">
        <EmptyState
          icon={<Server />}
          title="Error loading blueprints"
          description="Something went wrong while fetching blueprints. Try again in a moment."
        />
      </Page>
    );
  }

  return (
    <Page>
      <ToggleGroup
        value={mode}
        onChange={handleModeChange}
        items={[
          { value: 'blueprint', label: 'From blueprint', icon: <Server size={14} /> },
          { value: 'custom', label: 'Custom OS & hardware', icon: <Settings2 size={14} /> },
        ]}
      />

      {/* ─── Blueprint mode ─── */}
      {mode === 'blueprint' && (
        <ResponsiveStack direction="col" gap={6}>
          {categories.map((category) => (
            <FormSection
              key={category.id}
              title={category.name}
              description={category.description}
            >
              {!templatesByCategory[category.id] ||
              templatesByCategory[category.id].length === 0 ? (
                <EmptyState
                  variant="dashed"
                  icon={<Server />}
                  title="No blueprints in this category"
                />
              ) : (
                <ResponsiveGrid columns={{ base: 1, lg: 2 }} gap={4}>
                  {templatesByCategory[category.id].map((template) => {
                    const isSelected = selectedTemplateId === template.id;
                    const perf = calculatePerformanceScore(
                      template.cores,
                      template.ram,
                      template.storage,
                    );
                    const osOption = osOptions.find(
                      (o) => o.id === template.osType?.toUpperCase(),
                    );
                    const OsIcon = osOption?.icon;

                    return (
                      <Card
                        key={template.id}
                        variant="default"
                        spotlight={false}
                        glow={false}
                        interactive
                        selected={isSelected}
                        fullHeight
                        leadingIcon={<Server size={18} />}
                        leadingIconTone="purple"
                        title={
                          <ResponsiveStack direction="row" gap={2} align="center" wrap>
                            <span>{template.name}</span>
                            {perf.score > 60 && (
                              <Badge tone="purple">Recommended</Badge>
                            )}
                            {OsIcon && (
                              <Badge tone={osOption.tone}>
                                <OsIcon size={12} />
                              </Badge>
                            )}
                          </ResponsiveStack>
                        }
                        description={template.description}
                        onClick={() => handleBlueprintSelect(template)}
                        footer={
                          <Progress
                            value={perf.percentage}
                            max={100}
                            tone={progressTone(perf.score)}
                            label="Performance"
                            valueSlot={`${perf.level} · ${perf.score}%`}
                          />
                        }
                      >
                        <ResponsiveStack direction="col" gap={3}>
                          {/* Specs */}
                          <ResponsiveGrid columns={{ base: 3 }} gap={2}>
                            <ResponsiveStack direction="row" gap={1} align="center">
                              <IconTile icon={<Cpu size={12} />} tone="sky" size="sm" />
                              <span className="text-xs">{template.cores} cores</span>
                            </ResponsiveStack>
                            <ResponsiveStack direction="row" gap={1} align="center">
                              <IconTile icon={<MemoryStick size={12} />} tone="green" size="sm" />
                              <span className="text-xs">{template.ram} GB</span>
                            </ResponsiveStack>
                            <ResponsiveStack direction="row" gap={1} align="center">
                              <IconTile icon={<HardDrive size={12} />} tone="purple" size="sm" />
                              <span className="text-xs">{template.storage} GB</span>
                            </ResponsiveStack>
                          </ResponsiveGrid>

                          {/* Included apps */}
                          {template.applications?.length > 0 && (
                            <ResponsiveStack direction="row" gap={1} wrap>
                              <Package size={12} className="text-fg-muted" />
                              {template.applications.map((app) => (
                                <Badge key={app.applicationId} tone="purple" size="sm">
                                  {app.name}
                                </Badge>
                              ))}
                            </ResponsiveStack>
                          )}

                          {/* Included scripts */}
                          {template.scripts?.length > 0 && (
                            <ResponsiveStack direction="row" gap={1} wrap>
                              <ShieldCheck size={12} className="text-fg-muted" />
                              {template.scripts.map((s) => (
                                <Badge key={s.scriptId} tone="neutral" size="sm">
                                  {s.name}
                                </Badge>
                              ))}
                            </ResponsiveStack>
                          )}

                          {/* Extra features */}
                          <ResponsiveStack direction="row" gap={1} wrap>
                            {template.encryptDisk && (
                              <Badge tone="danger" size="sm">
                                Encryption
                              </Badge>
                            )}
                            {template.wallpaperUrl && (
                              <Badge tone="info" size="sm">
                                Wallpaper
                              </Badge>
                            )}
                            {template.powerPlan && (
                              <Badge tone="warning" size="sm">
                                Power: {template.powerPlan}
                              </Badge>
                            )}
                          </ResponsiveStack>
                        </ResponsiveStack>
                      </Card>
                    );
                  })}
                </ResponsiveGrid>
              )}
            </FormSection>
          ))}

          {templateError && (
            <EmptyState variant="inline" icon={<Server />} title={templateError} />
          )}
        </ResponsiveStack>
      )}

      {/* ─── Custom mode ─── */}
      {mode === 'custom' && (
        <ResponsiveStack direction="col" gap={6}>
          {/* OS selection */}
          <FormField label="Operating System" error={osError}>
            <ResponsiveGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
              {osOptions.map((os) => {
                const Icon = os.icon;
                const available = isOSAvailable(os.id);
                const isDisabled = !available;
                const isSelected = customOs === os.id && !isDisabled;

                return (
                  <Card
                    key={os.id}
                    variant="default"
                    spotlight={false}
                    glow={false}
                    interactive={!isDisabled}
                    selected={isSelected}
                    disabled={isDisabled}
                    fullHeight
                    onClick={() => !isDisabled && handleCustomOsSelect(os.id)}
                    footer={
                      <ResponsiveStack direction="col" gap={1} align="center">
                        {!available ? (
                          <Badge tone="danger" icon={<AlertCircle size={12} />}>
                            ISO Required
                          </Badge>
                        ) : null}
                        {isDisabled && (
                          <Button
                            variant="link"
                            size="sm"
                            icon={<Upload size={12} />}
                            reactive={false}
                            ripple={false}
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push('/settings?tab=iso');
                            }}
                          >
                            Upload ISO
                          </Button>
                        )}
                      </ResponsiveStack>
                    }
                  >
                    <ResponsiveStack direction="col" gap={3} align="center">
                      <IconTile icon={<Icon size={40} />} tone={os.tone} size="lg" />
                      <ResponsiveStack direction="col" gap={1} align="center">
                        <span>{os.name}</span>
                        <span>{isDisabled ? 'ISO not available' : os.description}</span>
                      </ResponsiveStack>
                    </ResponsiveStack>
                  </Card>
                );
              })}
            </ResponsiveGrid>
          </FormField>

          {!osLoading && osOptions.some((os) => !isOSAvailable(os.id)) && (
            <Alert
              tone="info"
              icon={<CloudDownload size={14} />}
              title="ISO Required means no disc image has been uploaded for that OS yet."
              actions={
                <Button
                  variant="link"
                  size="sm"
                  reactive={false}
                  ripple={false}
                  onClick={() => router.push('/settings?tab=iso')}
                >
                  Manage ISOs
                </Button>
              }
            />
          )}

          {!osLoading && !isReady && (
            <Alert
              tone="warning"
              icon={<AlertTriangle size={14} />}
              title="No ISOs Available"
              actions={
                <Button
                  variant="link"
                  size="sm"
                  reactive={false}
                  ripple={false}
                  onClick={() => router.push('/settings?tab=iso')}
                >
                  Go to Settings
                </Button>
              }
            >
              You need to upload at least one ISO image to create desktops.
            </Alert>
          )}

          {osLoading && <EmptyState variant="inline" title="Checking ISO availability…" />}

          {/* Hardware sliders */}
          <ResourceMeter
            layout="compact"
            resources={[
              {
                label: 'CPU',
                value: (customHardware.cores / cpuLimit) * 100,
                icon: <Cpu size={14} />,
              },
              {
                label: 'RAM',
                value: (customHardware.ram / memoryLimit) * 100,
                icon: <MemoryStick size={14} />,
              },
              {
                label: 'Disk',
                value: (customHardware.storage / diskAvailable) * 100,
                icon: <HardDrive size={14} />,
              },
            ]}
          />

          <Card
            variant="default"
            spotlight={false}
            glow={false}
            title="Custom hardware"
            description="Configure your own specifications"
            leadingIcon={<Settings2 size={18} />}
            leadingIconTone="purple"
          >
            <ResponsiveStack direction="col" gap={5}>
              <FormSection title="Compute">
                <FormField label="CPU cores" helper={`Between 1 and ${cpuLimit} cores`}>
                  <SliderField
                    value={customHardware.cores}
                    min={1}
                    max={cpuLimit}
                    step={1}
                    unit="cores"
                    tone="sky"
                    icon={<Cpu size={18} />}
                    limit={cpuLimit}
                    limitLabel="Max available"
                    onChange={(v) => updateCustomHardware('cores', clamp(v, 1, cpuLimit))}
                  />
                </FormField>
                <FormField label="RAM" helper={`Between 1 and ${memoryLimit} GB`}>
                  <SliderField
                    value={customHardware.ram}
                    min={1}
                    max={memoryLimit}
                    step={1}
                    unit="GB"
                    tone="green"
                    icon={<MemoryStick size={18} />}
                    limit={memoryLimit}
                    limitLabel="Max available"
                    onChange={(v) => updateCustomHardware('ram', clamp(v, 1, memoryLimit))}
                  />
                </FormField>
              </FormSection>

              <FormSection title="Storage">
                <FormField label="Disk" helper="Minimum 10 GB">
                  <SliderField
                    value={customHardware.storage}
                    min={10}
                    max={Math.max(diskAvailable, 10)}
                    step={10}
                    unit="GB"
                    tone="purple"
                    icon={<HardDrive size={18} />}
                    limit={diskAvailable}
                    limitLabel="Available"
                    onChange={(v) =>
                      updateCustomHardware('storage', clamp(v, 10, Math.max(diskAvailable, 10)))
                    }
                  />
                </FormField>
              </FormSection>

              <ResponsiveGrid columns={{ base: 1, md: 3 }} gap={3}>
                <Stat label="Cores" value={customHardware.cores} suffix="cores" icon={<Cpu size={12} />} />
                <Stat label="Memory" value={customHardware.ram} suffix="GB" icon={<MemoryStick size={12} />} />
                <Stat label="Storage" value={customHardware.storage} suffix="GB" icon={<HardDrive size={12} />} />
              </ResponsiveGrid>

              <Progress
                value={perfCustom.percentage}
                max={100}
                tone={progressTone(perfCustom.score)}
                label="Performance"
                valueSlot={`${perfCustom.level} · ${perfCustom.score}%`}
              />
            </ResponsiveStack>
          </Card>
        </ResponsiveStack>
      )}

      {isWindows && (
        <Card
          variant="default"
          spotlight={false}
          glow={false}
          title="Product Key (Optional)"
          description="If you have a Windows product key, enter it here"
          leadingIcon={<KeyRound size={18} />}
          leadingIconTone="amber"
        >
          <FormField error={getError('productKey')}>
            <TextField
              id="productKey"
              icon={<KeyRound size={14} />}
              placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
              value={stepValues.productKey || ''}
              onChange={(e) => setValue(`${id}.productKey`, e.target.value)}
            />
          </FormField>
        </Card>
      )}
    </Page>
  );
}
