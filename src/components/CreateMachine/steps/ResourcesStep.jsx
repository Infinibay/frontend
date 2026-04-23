'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Badge,
  Card,
  Divider,
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
  ToggleGroup,
} from '@infinibay/harbor';
import { Settings2, Server, HardDrive, Cpu, MemoryStick } from 'lucide-react';
import { useWizardContext } from '../wizard/wizard';
import { useFormError } from '../wizard/form-error-provider';
import { fetchTemplates, selectTemplatesState } from '@/state/slices/templates';
import { fetchTemplateCategories } from '@/state/slices/templateCategories';
import { useGetSystemResourcesQuery } from '@/gql/hooks';

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

export function ResourcesStep({ id }) {
  const dispatch = useDispatch();
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const {
    items: templates,
    loading: templatesLoading,
    error: templatesError,
  } = useSelector(selectTemplatesState);
  const { items: categories } = useSelector((state) => state.templateCategories);
  const stepValues = values[id] || {};

  const { data: systemResources } = useGetSystemResourcesQuery();
  const cpuLimit = systemResources?.getSystemResources?.cpu?.available || 64;
  const memoryLimit = systemResources?.getSystemResources?.memory?.available || 512;
  const diskAvailable = systemResources?.getSystemResources?.disk?.available || 800;

  const [mode, setMode] = useState(
    stepValues.templateId === 'custom' ? 'custom' : 'template',
  );
  const [customHardware, setCustomHardware] = useState({
    cores: stepValues.customCores || 4,
    ram: stepValues.customRam || 8,
    storage: stepValues.customStorage || 50,
  });

  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchTemplateCategories());
  }, [dispatch]);

  const handleModeChange = (next) => {
    setMode(next);
    if (next === 'custom') {
      setValue(`${id}.templateId`, 'custom');
      setValue(`${id}.customCores`, customHardware.cores);
      setValue(`${id}.customRam`, customHardware.ram);
      setValue(`${id}.customStorage`, customHardware.storage);
    } else {
      setValue(`${id}.customCores`, null);
      setValue(`${id}.customRam`, null);
      setValue(`${id}.customStorage`, null);
    }
  };

  const handleTemplateSelect = (templateId) => {
    setValue(`${id}.templateId`, templateId);
    setValue(`${id}.customCores`, null);
    setValue(`${id}.customRam`, null);
    setValue(`${id}.customStorage`, null);
  };

  const updateCustomHardware = (key, value) => {
    const next = { ...customHardware, [key]: value };
    setCustomHardware(next);
    setValue(`${id}.custom${key.charAt(0).toUpperCase() + key.slice(1)}`, value);
  };

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

  const hasTemplates = templates.length > 0;

  if (templatesLoading.fetch) {
    return (
      <Page size="md">
        <LoadingOverlay label="Loading templates…" />
      </Page>
    );
  }

  if (templatesError.fetch) {
    return (
      <Page size="md">
        <EmptyState
          icon={<Server />}
          title="Error loading templates"
          description="Something went wrong while fetching templates. Try again in a moment."
        />
      </Page>
    );
  }

  const perfCustom = calculatePerformanceScore(
    customHardware.cores,
    customHardware.ram,
    customHardware.storage,
  );

  const templateError = getError('templateId');

  return (
    <Page>
        <ResourceMeter
          layout="compact"
          resources={[
            {
              label: 'CPU',
              value:
                mode === 'custom'
                  ? (customHardware.cores / cpuLimit) * 100
                  : 0,
              icon: <Cpu size={14} />,
            },
            {
              label: 'RAM',
              value:
                mode === 'custom' ? (customHardware.ram / memoryLimit) * 100 : 0,
              icon: <MemoryStick size={14} />,
            },
            {
              label: 'Disk',
              value:
                mode === 'custom'
                  ? (customHardware.storage / diskAvailable) * 100
                  : 0,
              icon: <HardDrive size={14} />,
            },
          ]}
        />

        <ToggleGroup
          value={mode}
          onChange={handleModeChange}
          items={[
            { value: 'template', label: 'From blueprint', icon: <Server size={14} /> },
            { value: 'custom', label: 'Custom hardware', icon: <Settings2 size={14} /> },
          ]}
        />

        {mode === 'custom' && (
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
                    onChange={(v) =>
                      updateCustomHardware('cores', clamp(v, 1, cpuLimit))
                    }
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
                    onChange={(v) =>
                      updateCustomHardware('ram', clamp(v, 1, memoryLimit))
                    }
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
                      updateCustomHardware(
                        'storage',
                        clamp(v, 10, Math.max(diskAvailable, 10)),
                      )
                    }
                  />
                </FormField>
              </FormSection>

              <Divider />

              <ResponsiveGrid columns={{ base: 1, md: 3 }} gap={3}>
                <Stat
                  label="Cores"
                  value={customHardware.cores}
                  suffix="cores"
                  icon={<Cpu size={12} />}
                />
                <Stat
                  label="Memory"
                  value={customHardware.ram}
                  suffix="GB"
                  icon={<MemoryStick size={12} />}
                />
                <Stat
                  label="Storage"
                  value={customHardware.storage}
                  suffix="GB"
                  icon={<HardDrive size={12} />}
                />
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
        )}

        {mode === 'template' &&
          (hasTemplates ? (
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
                      title="No templates in this category"
                    />
                  ) : (
                    <ResponsiveGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                      {templatesByCategory[category.id].map((template) => {
                        const isSelected =
                          stepValues.templateId === template.id;
                        const perf = calculatePerformanceScore(
                          template.cores,
                          template.ram,
                          template.storage,
                        );
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
                              <ResponsiveStack
                                direction="row"
                                gap={2}
                                align="center"
                              >
                                <span>{template.name}</span>
                                {perf.score > 60 && (
                                  <Badge tone="purple">Recommended</Badge>
                                )}
                              </ResponsiveStack>
                            }
                            description={template.description}
                            onClick={() => handleTemplateSelect(template.id)}
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
                            <ResponsiveStack direction="row" gap={3} wrap>
                              <ResponsiveStack direction="row" gap={2} align="center">
                                <IconTile
                                  icon={<Cpu size={14} />}
                                  tone="sky"
                                  size="sm"
                                />
                                <span>{template.cores} cores</span>
                              </ResponsiveStack>
                              <ResponsiveStack direction="row" gap={2} align="center">
                                <IconTile
                                  icon={<MemoryStick size={14} />}
                                  tone="green"
                                  size="sm"
                                />
                                <span>{template.ram} GB</span>
                              </ResponsiveStack>
                              <ResponsiveStack direction="row" gap={2} align="center">
                                <IconTile
                                  icon={<HardDrive size={14} />}
                                  tone="purple"
                                  size="sm"
                                />
                                <span>{template.storage} GB</span>
                              </ResponsiveStack>
                            </ResponsiveStack>
                          </Card>
                        );
                      })}
                    </ResponsiveGrid>
                  )}
                </FormSection>
              ))}
            </ResponsiveStack>
          ) : (
            <EmptyState
              icon={<Server />}
              title="No templates available"
              description="No pre-configured templates exist yet. Switch to Custom hardware to configure your own machine specifications."
            />
          ))}

        {templateError && (
          <EmptyState
            variant="inline"
            icon={<Server />}
            title={templateError}
          />
        )}
    </Page>
  );
}
