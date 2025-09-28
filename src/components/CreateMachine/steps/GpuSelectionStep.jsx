'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { fetchGraphics } from '@/state/slices/system';
import { cn } from '@/lib/utils';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:gpu-selection-step');

export function GpuSelectionStep({ id }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};

  // Use optimized data loading for graphics cards
  const {
    data: graphics,
    isLoading: loading,
    error,
    hasData
  } = useEnsureData('system', fetchGraphics, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 10 * 60 * 1000, // 10 minutes (graphics don't change often)
    transform: (data) => data?.graphics || data || []
  });

  debug.info('GpuSelectionStep state:', {
    graphicsCount: graphics?.length || 0,
    selectedGpu: stepValues.gpuId,
    loading,
    hasError: !!error,
    hasData
  });

  // Add "No GPU" option to the list
  const allOptions = [
    { pciBus: 'no-gpu', vendor: '', model: 'No GPU', memory: 0 },
    ...(graphics || [])
  ];

  const formatGpuName = (gpu) => {
    if (gpu.pciBus === 'no-gpu') return 'No GPU';
    return gpu.model;
  };

  const formatMemory = (memory) => {
    if (!memory) return '';
    // Convert to MB for values less than 1GB
    if (memory < 1) {
      const mbValue = Math.round(memory * 1024);
      return `${mbValue}MB VRAM`;
    }
    return `${Math.round(memory)}GB VRAM`;
  };

  const renderLoadingSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="relative flex rounded-lg p-4 border space-y-3">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderErrorState = () => (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center space-y-2">
        <div className="text-red-500">Error loading graphics cards</div>
        <div className="text-sm text-muted-foreground">
          {error?.message || 'Failed to load available graphics cards'}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Select Graphics Card</h2>
          <p className="text-sm text-muted-foreground">
            Choose a graphics card for your virtual machine or select "No GPU" if you don't need one.
          </p>
        </div>
        <Card glass="subtle" className={cn("p-6", "glass-subtle border border-border/20")}>
          <div className="space-y-4">
            <Label>Select a Graphics Card</Label>
            {renderLoadingSkeleton()}
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Select Graphics Card</h2>
          <p className="text-sm text-muted-foreground">
            Choose a graphics card for your virtual machine or select "No GPU" if you don't need one.
          </p>
        </div>
        <Card glass="subtle" className={cn("p-6", "glass-subtle border border-border/20")}>
          <div className="space-y-4">
            <Label>Select a Graphics Card</Label>
            {renderErrorState()}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Select Graphics Card</h2>
        <p className="text-sm text-muted-foreground">
          Choose a graphics card for your virtual machine or select "No GPU" if you don't need one.
        </p>
      </div>

      <Card glass="subtle" className={cn("p-6", "glass-subtle border border-border/20")}>
        <div className="space-y-4">
          <Label
            moreInformation="A GPU can significantly improve graphics performance for applications that require hardware acceleration."
          >
            Select a Graphics Card
          </Label>
          <RadioGroup
            value={stepValues.gpuId}
            onValueChange={(value) => {
              debug.info('GPU selection changed:', value);
              const selectedGpu = allOptions.find(gpu => gpu.pciBus === value);
              setValue(`${id}.gpuId`, value);
              setValue(`${id}.pciBus`, value === 'no-gpu' ? null : value);
              // Store additional GPU information for the review step
              setValue(`${id}.gpuInfo`, value === 'no-gpu' ? null : {
                model: selectedGpu.model,
                vendor: selectedGpu.vendor,
                memory: selectedGpu.memory
              });
            }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {allOptions.map((gpu) => (
              <Label
                key={gpu.pciBus}
                className={cn(
                  "relative flex cursor-pointer rounded-lg p-4 transition-all duration-200",
                  "glass-subtle border border-border/20",
                  stepValues.gpuId === gpu.pciBus
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                    : 'hover:border-primary/50 hover:bg-primary/5'
                )}
              >
                <RadioGroupItem
                  value={gpu.pciBus}
                  id={gpu.pciBus}
                  className="sr-only"
                />
                <div className="flex flex-col gap-2 w-full">
                  {gpu.pciBus === 'no-gpu' ? (
                    <div className="text-center py-2">
                      <span className="text-base font-semibold">No GPU</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        Continue without graphics acceleration
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm leading-tight break-words flex-1">
                            {gpu.model}
                          </h4>
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full whitespace-nowrap">
                            {formatMemory(gpu.memory)}
                          </span>
                        </div>
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="font-medium">Graphics Controller</span>
                          </div>
                          <div className="text-muted-foreground truncate" title={gpu.vendor}>
                            <span className="font-medium">Vendor:</span> {gpu.vendor}
                          </div>
                          <div className="text-muted-foreground">
                            <span className="font-medium">PCI Bus:</span> {gpu.pciBus}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>
      </Card>
    </div>
  );
}
