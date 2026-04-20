'use client';

import {
  Alert,
  Badge,
  Card,
  FormField,
  Page,
  PropertyList,
  ResponsiveGrid,
  ResponsiveStack,
  Skeleton,
} from '@infinibay/harbor';
import { useWizardContext } from '../wizard/wizard';
import { useFormError } from '../wizard/form-error-provider';
import { fetchGraphics } from '@/state/slices/system';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { createDebugger } from '@/utils/debug';
import { MonitorOff, Zap } from 'lucide-react';

const debug = createDebugger('frontend:components:gpu-selection-step');

export function GpuSelectionStep({ id }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};

  const {
    data: graphics,
    isLoading: loading,
    error,
    hasData,
  } = useEnsureData('system', fetchGraphics, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 10 * 60 * 1000,
    transform: (data) => data?.graphics || data || [],
  });

  debug.info('GpuSelectionStep state:', {
    graphicsCount: graphics?.length || 0,
    selectedGpu: stepValues.gpuId,
    loading,
    hasError: !!error,
    hasData,
  });

  const allOptions = [
    { pciBus: 'no-gpu', vendor: '', model: 'No GPU', memory: 0 },
    ...(graphics || []),
  ];

  const formatMemory = (memory) => {
    if (!memory) return '';
    if (memory < 1) {
      const mbValue = Math.round(memory * 1024);
      return `${mbValue}MB VRAM`;
    }
    return `${Math.round(memory)}GB VRAM`;
  };

  const pickGpu = (pciBus) => {
    debug.info('GPU selection changed:', pciBus);
    const selectedGpu = allOptions.find((gpu) => gpu.pciBus === pciBus);
    setValue(`${id}.gpuId`, pciBus);
    setValue(`${id}.pciBus`, pciBus === 'no-gpu' ? null : pciBus);
    setValue(
      `${id}.gpuInfo`,
      pciBus === 'no-gpu'
        ? null
        : {
            model: selectedGpu.model,
            vendor: selectedGpu.vendor,
            memory: selectedGpu.memory,
          },
    );
  };

  if (loading) {
    return (
      <Page size="lg">
        <FormField label="Select a Graphics Card">
          <ResponsiveGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
            {[...Array(4)].map((_, index) => (
              <Card key={index} variant="default" spotlight={false} glow={false}>
                <ResponsiveStack direction="col" gap={3}>
                  <Skeleton />
                  <Skeleton />
                  <Skeleton />
                </ResponsiveStack>
              </Card>
            ))}
          </ResponsiveGrid>
        </FormField>
      </Page>
    );
  }

  if (error) {
    return (
      <Page size="lg">
        <FormField label="Select a Graphics Card">
          <Alert tone="danger" title="Error loading graphics cards">
            {error?.message || 'Failed to load available graphics cards'}
          </Alert>
        </FormField>
      </Page>
    );
  }

  return (
    <Page size="lg">
      <FormField
        label="Select a Graphics Card"
        helper="A GPU can significantly improve graphics performance for applications that require hardware acceleration."
        error={getError('gpuId')}
      >
        <ResponsiveGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          {allOptions.map((gpu) => {
            const isSelected = stepValues.gpuId === gpu.pciBus;
            const isNoGpu = gpu.pciBus === 'no-gpu';
            return (
              <Card
                key={gpu.pciBus}
                variant="default"
                spotlight={false}
                glow={false}
                interactive
                selected={isSelected}
                fullHeight
                leadingIcon={
                  isNoGpu ? <MonitorOff size={18} /> : <Zap size={18} />
                }
                leadingIconTone={isNoGpu ? 'neutral' : 'purple'}
                title={isNoGpu ? 'No GPU' : gpu.model}
                description={
                  isNoGpu ? 'Continue without graphics acceleration' : undefined
                }
                onClick={() => pickGpu(gpu.pciBus)}
              >
                {!isNoGpu && (
                  <ResponsiveStack direction="col" gap={3}>
                    {formatMemory(gpu.memory) && (
                      <Badge tone="purple">{formatMemory(gpu.memory)}</Badge>
                    )}
                    <PropertyList
                      items={[
                        { key: 'type', label: 'Type', value: 'Graphics Controller' },
                        { key: 'vendor', label: 'Vendor', value: gpu.vendor || '—' },
                        { key: 'pci', label: 'PCI Bus', value: gpu.pciBus },
                      ]}
                    />
                  </ResponsiveStack>
                )}
              </Card>
            );
          })}
        </ResponsiveGrid>
      </FormField>
    </Page>
  );
}
