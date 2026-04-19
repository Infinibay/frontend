'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Card, TextField } from '@infinibay/harbor';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import { fetchTemplates, selectTemplatesState } from '@/state/slices/templates';
import { fetchTemplateCategories } from '@/state/slices/templateCategories';
import { Settings2, Server, HardDrive, Cpu, MemoryStick, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetSystemResourcesQuery } from '@/gql/hooks';

// Calculate performance score based on CPU, RAM, and Storage
const calculatePerformanceScore = (cores, ram, storage) => {
  const cpuScore = Math.min((cores / 32) * 100, 100);
  const ramScore = Math.min((ram / 128) * 100, 100);
  const storageScore = Math.min((storage / 1000) * 100, 100);

  const totalScore = (cpuScore * 0.4) + (ramScore * 0.4) + (storageScore * 0.2);

  return {
    score: Math.round(totalScore),
    level:
      totalScore <= 20 ? 'Basic' :
      totalScore <= 40 ? 'Standard' :
      totalScore <= 60 ? 'Advanced' :
      totalScore <= 80 ? 'High Performance' :
      'Enterprise',
    percentage: Math.min(totalScore, 100),
  };
};

function perfBarClass(score) {
  if (score <= 20) return 'bg-info';
  if (score <= 40) return 'bg-success';
  if (score <= 60) return 'bg-warning';
  if (score <= 80) return 'bg-accent-3';
  return 'bg-gradient-to-r from-accent to-accent-3';
}

// Simple range slider rendered with Harbor tokens.
function ResourceSlider({ value, min, max, step = 1, color, onChange }) {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  return (
    <div className="flex-1 relative">
      <div className="relative h-2 bg-white/8 rounded-full">
        <div
          className={cn('absolute left-0 top-0 h-full rounded-full pointer-events-none', color)}
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          style={{ margin: 0, padding: 0 }}
        />
        <div
          className={cn('absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-harbor-sm border-2 bg-surface-2 pointer-events-none', color.replace('bg-', 'border-'))}
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>
    </div>
  );
}

export function ResourcesStep({ id, className }) {
  const dispatch = useDispatch();
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const { items: templates, loading: templatesLoading, error: templatesError } = useSelector(selectTemplatesState);
  const { items: categories } = useSelector(state => state.templateCategories);
  const stepValues = values[id] || {};

  const { data: systemResources } = useGetSystemResourcesQuery();

  const [useCustomHardware, setUseCustomHardware] = useState(false);
  const [customHardware, setCustomHardware] = useState({
    cores: stepValues.customCores || 4,
    ram: stepValues.customRam || 8,
    storage: stepValues.customStorage || 50,
  });

  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchTemplateCategories());
  }, [dispatch]);

  const handleTemplateSelect = (templateId) => {
    setUseCustomHardware(false);
    setValue(`${id}.templateId`, templateId);
    setValue(`${id}.customCores`, null);
    setValue(`${id}.customRam`, null);
    setValue(`${id}.customStorage`, null);
  };

  const handleCustomSelect = () => {
    if (!useCustomHardware) {
      setUseCustomHardware(true);
      setValue(`${id}.templateId`, 'custom');
      setValue(`${id}.customCores`, customHardware.cores);
      setValue(`${id}.customRam`, customHardware.ram);
      setValue(`${id}.customStorage`, customHardware.storage);
    }
  };

  const updateCustomHardware = (key, value) => {
    const newHardware = { ...customHardware, [key]: value };
    setCustomHardware(newHardware);
    setValue(`${id}.custom${key.charAt(0).toUpperCase() + key.slice(1)}`, value);
  };

  const cpuLimit = systemResources?.getSystemResources?.cpu?.available || 64;
  const memoryLimit = systemResources?.getSystemResources?.memory?.available || 512;
  const diskAvailable = systemResources?.getSystemResources?.disk?.available || 800;

  if (templatesLoading.fetch) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-fg-muted">Loading templates...</div>
      </div>
    );
  }

  if (templatesError.fetch) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-danger">Error loading templates</div>
      </div>
    );
  }

  const templatesByCategory = templates.reduce((acc, template) => {
    const categoryId = template.categoryId;
    if (!acc[categoryId]) acc[categoryId] = [];
    acc[categoryId].push(template);
    return acc;
  }, {});

  const hasTemplates = templates.length > 0;
  const customActive = useCustomHardware || stepValues.templateId === 'custom';

  return (
    <div className={cn("space-y-6", className)}>
      <p className="text-sm text-fg-muted">
        {hasTemplates
          ? 'Choose a template or configure custom hardware for your machine.'
          : 'Configure custom hardware for your machine.'}
      </p>

      {/* Custom Hardware */}
      <Card
        variant="default"
        spotlight={false}
        glow={false}
        interactive
        className={cn(
          'cursor-pointer transition-all',
          customActive
            ? 'border-accent/60 bg-accent/10 ring-2 ring-accent/30'
            : 'hover:border-accent/40'
        )}
        onClick={handleCustomSelect}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'h-12 w-12 rounded-xl flex items-center justify-center border transition-all',
              customActive
                ? 'bg-accent/20 text-accent border-accent/40'
                : 'bg-white/5 text-fg-muted border-white/8'
            )}>
              <Settings2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-fg">Custom Hardware</h3>
              <p className="text-sm text-fg-muted">
                Configure your own hardware specifications
              </p>
            </div>
          </div>

          {customActive && (
            <div
              className="space-y-6 pt-4 border-t border-white/8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* CPU */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-fg">
                  <Cpu className="h-4 w-4 text-accent-2" />
                  CPU Cores:{' '}
                  <span className="font-bold text-base text-accent-2">{customHardware.cores}</span>
                  <span className="text-xs text-fg-muted ml-auto">
                    Max available: {cpuLimit}
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <ResourceSlider
                    value={customHardware.cores}
                    min={1}
                    max={cpuLimit}
                    step={1}
                    color="bg-accent-2"
                    onChange={(v) => updateCustomHardware('cores', Math.min(Math.max(v, 1), cpuLimit))}
                  />
                  <div className="w-24">
                    <TextField
                      type="number"
                      value={String(customHardware.cores)}
                      min={1}
                      max={cpuLimit}
                      step={1}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (!Number.isNaN(v)) updateCustomHardware('cores', Math.min(Math.max(v, 1), cpuLimit));
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs text-fg-muted">Between 1 and {cpuLimit} cores</p>
              </div>

              {/* RAM */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-fg">
                  <MemoryStick className="h-4 w-4 text-success" />
                  RAM:{' '}
                  <span className="font-bold text-base text-success">{customHardware.ram} GB</span>
                  <span className="text-xs text-fg-muted ml-auto">
                    Max available: {memoryLimit} GB
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <ResourceSlider
                    value={customHardware.ram}
                    min={1}
                    max={memoryLimit}
                    step={1}
                    color="bg-success"
                    onChange={(v) => updateCustomHardware('ram', Math.min(Math.max(v, 1), memoryLimit))}
                  />
                  <div className="w-24">
                    <TextField
                      type="number"
                      value={String(customHardware.ram)}
                      min={1}
                      max={memoryLimit}
                      step={1}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (!Number.isNaN(v)) updateCustomHardware('ram', Math.min(Math.max(v, 1), memoryLimit));
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs text-fg-muted">Between 1 and {memoryLimit} GB</p>
              </div>

              {/* Storage */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-fg">
                  <HardDrive className="h-4 w-4 text-accent" />
                  Storage:{' '}
                  <span className="font-bold text-base text-accent">{customHardware.storage} GB</span>
                  <span className="text-xs text-fg-muted ml-auto">
                    Available: {diskAvailable} GB
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <ResourceSlider
                    value={customHardware.storage}
                    min={10}
                    max={Math.max(diskAvailable, 10)}
                    step={10}
                    color="bg-accent"
                    onChange={(v) => updateCustomHardware('storage', v)}
                  />
                  <div className="w-24">
                    <TextField
                      type="number"
                      value={String(customHardware.storage)}
                      min={10}
                      max={diskAvailable}
                      step={10}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (!Number.isNaN(v)) updateCustomHardware('storage', v);
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs text-fg-muted">Minimum 10 GB</p>
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-fg mb-3">Configuration Summary:</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 p-2 bg-accent-2/10 rounded-md border border-accent-2/20">
                      <Cpu className="h-4 w-4 text-accent-2" />
                      <span className="font-medium text-fg">{customHardware.cores} Cores</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-success/10 rounded-md border border-success/20">
                      <MemoryStick className="h-4 w-4 text-success" />
                      <span className="font-medium text-fg">{customHardware.ram} GB RAM</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-accent/10 rounded-md border border-accent/20">
                      <HardDrive className="h-4 w-4 text-accent" />
                      <span className="font-medium text-fg">{customHardware.storage} GB Storage</span>
                    </div>
                  </div>
                </div>

                {(() => {
                  const perf = calculatePerformanceScore(customHardware.cores, customHardware.ram, customHardware.storage);
                  return (
                    <div className="pt-3 border-t border-white/8">
                      <div className="flex items-center justify-between text-xs text-fg-muted mb-1">
                        <span>Performance Score</span>
                        <span className="font-medium text-fg">
                          {perf.level} ({perf.score}%)
                        </span>
                      </div>
                      <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all duration-300', perfBarClass(perf.score))}
                          style={{ width: `${perf.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Templates */}
      {hasTemplates ? (
        <div className="space-y-6">
          {categories.map((category) => (
            <Card key={category.id} variant="default" spotlight={false} glow={false}>
              <div className="space-y-6">
                <div className="space-y-2 border-b border-white/8 pb-4">
                  <h3 className="text-lg font-semibold text-fg">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-fg-muted">{category.description}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {templatesByCategory[category.id]?.map((template) => {
                    const isSelected = stepValues.templateId === template.id && !useCustomHardware;
                    const perf = calculatePerformanceScore(template.cores, template.ram, template.storage);
                    return (
                      <Card
                        key={template.id}
                        variant="default"
                        spotlight={false}
                        glow={false}
                        interactive
                        className={cn(
                          'cursor-pointer transition-all duration-200',
                          isSelected
                            ? 'border-accent/60 bg-accent/10 ring-2 ring-accent/30'
                            : 'hover:border-accent/40'
                        )}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <div className="w-full space-y-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-base text-fg">
                                  {template.name}
                                </h3>
                                {perf.score > 60 && (
                                  <Badge tone="purple">Recommended</Badge>
                                )}
                              </div>
                              <p className="text-sm text-fg-muted line-clamp-2">
                                {template.description}
                              </p>
                            </div>
                            {isSelected && (
                              <div className="h-6 w-6 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0 shadow-harbor-sm">
                                <Check className="h-3.5 w-3.5" strokeWidth={3} />
                              </div>
                            )}
                          </div>

                          <div className="space-y-3 pt-3 border-t border-white/8">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-accent-2/10 border border-accent-2/20 flex items-center justify-center flex-shrink-0">
                                <Cpu className="h-4 w-4 text-accent-2" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-fg-muted">CPU</p>
                                <p className="font-semibold text-sm text-fg">{template.cores} Cores</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center flex-shrink-0">
                                <MemoryStick className="h-4 w-4 text-success" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-fg-muted">Memory</p>
                                <p className="font-semibold text-sm text-fg">{template.ram} GB RAM</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                                <HardDrive className="h-4 w-4 text-accent" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-fg-muted">Storage</p>
                                <p className="font-semibold text-sm text-fg">{template.storage} GB</p>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/8">
                            <div className="flex items-center justify-between text-xs text-fg-muted mb-1">
                              <span>Performance Score</span>
                              <span className="font-medium text-fg">
                                {perf.level} ({perf.score}%)
                              </span>
                            </div>
                            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                              <div
                                className={cn('h-full rounded-full transition-all duration-500', perfBarClass(perf.score))}
                                style={{ width: `${perf.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                  {(!templatesByCategory[category.id] || templatesByCategory[category.id].length === 0) && (
                    <p className="col-span-full text-center text-fg-muted py-8 border-2 border-white/8 border-dashed rounded-lg">
                      No templates in this category
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="default" spotlight={false} glow={false} className="border-2 border-dashed border-white/10">
          <div className="text-center space-y-3 py-4">
            <Server className="h-12 w-12 mx-auto text-fg-subtle" />
            <h3 className="font-medium text-lg text-fg">No Templates Available</h3>
            <p className="text-sm text-fg-muted max-w-md mx-auto">
              No pre-configured templates have been created yet. You can use the custom hardware option above to configure your machine specifications.
            </p>
          </div>
        </Card>
      )}

      {getError('templateId') && (
        <p className="text-sm text-danger">{getError('templateId')}</p>
      )}
    </div>
  );
}
