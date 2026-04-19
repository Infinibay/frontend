'use client';

import React from 'react';
import { Badge, Card, Skeleton } from '@infinibay/harbor';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import { fetchGraphics } from '@/state/slices/system';
import { cn } from '@/lib/utils';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { createDebugger } from '@/utils/debug';
import { Check, Cpu, MonitorOff, Zap } from 'lucide-react';

const debug = createDebugger('frontend:components:gpu-selection-step');

export function GpuSelectionStep({ id, className }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};

  // Use optimized data loading for graphics cards
  const {
    data: graphics,
    isLoading: loading,
    error,
    hasData,
  } = useEnsureData('system', fetchGraphics, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 10 * 60 * 1000, // 10 minutes
    transform: (data) => data?.graphics || data || [],
  });

  debug.info('GpuSelectionStep state:', {
    graphicsCount: graphics?.length || 0,
    selectedGpu: stepValues.gpuId,
    loading,
    hasError: !!error,
    hasData,
  });

  // Add "No GPU" option to the list
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
          }
    );
  };

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        <label className="text-sm font-medium text-fg">Select a Graphics Card</label>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(4)].map((_, index) => (
            <Card key={index} variant="default" spotlight={false} glow={false}>
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('space-y-4', className)}>
        <label className="text-sm font-medium text-fg">Select a Graphics Card</label>
        <Card variant="default" spotlight={false} glow={false} className="border-danger/30 bg-danger/10">
          <div className="text-center space-y-2 py-4">
            <div className="text-danger font-medium">Error loading graphics cards</div>
            <div className="text-sm text-fg-muted">
              {error?.message || 'Failed to load available graphics cards'}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <label className="text-sm font-medium text-fg">Select a Graphics Card</label>
        <p className="text-xs text-fg-muted mt-0.5">
          A GPU can significantly improve graphics performance for applications that require hardware acceleration.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              className={cn(
                'cursor-pointer transition-all duration-200 relative',
                isSelected
                  ? 'border-accent/60 bg-accent/10 ring-2 ring-accent/30'
                  : 'hover:border-accent/40'
              )}
              onClick={() => pickGpu(gpu.pciBus)}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-accent text-white flex items-center justify-center z-10 shadow-harbor-sm">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
              )}

              {isNoGpu ? (
                <div className="text-center py-4 space-y-2">
                  <div className="h-12 w-12 mx-auto rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">
                    <MonitorOff className="h-6 w-6 text-fg-subtle" />
                  </div>
                  <div className="text-base font-semibold text-fg">No GPU</div>
                  <p className="text-sm text-fg-muted">
                    Continue without graphics acceleration
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                        <Zap className="h-4 w-4 text-accent" />
                      </div>
                      <h4 className="font-semibold text-sm text-fg leading-tight break-words flex-1 pr-6">
                        {gpu.model}
                      </h4>
                    </div>
                  </div>
                  {formatMemory(gpu.memory) && (
                    <div>
                      <Badge tone="purple">{formatMemory(gpu.memory)}</Badge>
                    </div>
                  )}
                  <div className="text-xs space-y-1 text-fg-muted">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-3 w-3" />
                      <span>Graphics Controller</span>
                    </div>
                    <div className="truncate" title={gpu.vendor}>
                      <span className="font-medium text-fg">Vendor:</span> {gpu.vendor}
                    </div>
                    <div>
                      <span className="font-medium text-fg">PCI Bus:</span> {gpu.pciBus}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {getError('gpuId') && (
        <p className="text-sm text-danger">{getError('gpuId')}</p>
      )}
    </div>
  );
}
