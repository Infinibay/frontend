'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { fetchGraphics, selectGraphics, selectSystemLoading, selectSystemError } from '@/state/slices/system';

export function GpuSelectionStep({ id }) {
  const dispatch = useDispatch();
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const graphics = useSelector(selectGraphics);
  const loading = useSelector(selectSystemLoading);
  const error = useSelector(selectSystemError);
  const stepValues = values[id] || {};

  useEffect(() => {
    dispatch(fetchGraphics());
  }, [dispatch]);

  if (loading) return <div>Loading graphics cards...</div>;
  if (error) return <div>Error loading graphics cards</div>;

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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Select Graphics Card</h2>
        <p className="text-sm text-muted-foreground">
          Choose a graphics card for your virtual machine or select "No GPU" if you don't need one.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <Label
            moreInformation="A GPU can significantly improve graphics performance for applications that require hardware acceleration."
          >
            Select a Graphics Card
          </Label>
          <RadioGroup
            value={stepValues.gpuId}
            onValueChange={(value) => {
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
                className={`relative flex cursor-pointer rounded-lg border p-6 hover:border-primary transition-colors duration-200 ${
                  stepValues.gpuId === gpu.pciBus ? 'border-primary bg-primary/5 shadow-sm' : 'border-muted hover:shadow-sm'
                }`}
              >
                <RadioGroupItem
                  value={gpu.pciBus}
                  id={gpu.pciBus}
                  className="sr-only"
                />
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold leading-none">
                      {formatGpuName(gpu)}
                    </span>
                    {gpu.pciBus !== 'no-gpu' && (
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {formatMemory(gpu.memory)}
                      </span>
                    )}
                  </div>
                  {gpu.pciBus !== 'no-gpu' && (
                    <div className="space-y-1.5">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="font-medium text-foreground/80">Vendor:</span> {gpu.vendor}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="font-medium text-foreground/80">PCI Bus:</span> {gpu.pciBus}
                      </span>
                    </div>
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
