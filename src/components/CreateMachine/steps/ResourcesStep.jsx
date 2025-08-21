'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { fetchTemplates, selectTemplatesState } from '@/state/slices/templates';
import { fetchTemplateCategories } from '@/state/slices/templateCategories';
import { Settings2, Server, HardDrive, Cpu, MemoryStick } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { DiskSpaceSlider } from '@/components/ui/disk-space-slider';
import { useGetSystemResourcesQuery } from '@/gql/hooks';

// Calculate performance score based on CPU, RAM, and Storage
const calculatePerformanceScore = (cores, ram, storage) => {
  // Normalize values (0-100 scale)
  // CPU: max 32 cores for normalization
  const cpuScore = Math.min((cores / 32) * 100, 100);
  
  // RAM: max 128 GB for normalization
  const ramScore = Math.min((ram / 128) * 100, 100);
  
  // Storage: max 1000 GB for normalization
  const storageScore = Math.min((storage / 1000) * 100, 100);
  
  // Weighted average: CPU 40%, RAM 40%, Storage 20%
  const totalScore = (cpuScore * 0.4) + (ramScore * 0.4) + (storageScore * 0.2);
  
  return {
    score: Math.round(totalScore),
    level: totalScore <= 20 ? 'Basic' : 
           totalScore <= 40 ? 'Standard' : 
           totalScore <= 60 ? 'Advanced' : 
           totalScore <= 80 ? 'High Performance' : 
           'Enterprise',
    percentage: Math.min(totalScore, 100)
  };
};

export function ResourcesStep({ id }) {
  const dispatch = useDispatch();
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const { items: templates, loading: templatesLoading, error: templatesError } = useSelector(selectTemplatesState);
  const { items: categories } = useSelector(state => state.templateCategories);
  const stepValues = values[id] || {};
  
  // Fetch system resources
  const { data: systemResources, loading: resourcesLoading } = useGetSystemResourcesQuery();
  
  // State for custom hardware
  const [useCustomHardware, setUseCustomHardware] = useState(false);
  const [customHardware, setCustomHardware] = useState({
    cores: stepValues.customCores || 4,
    ram: stepValues.customRam || 8,
    storage: stepValues.customStorage || 50
  });

  useEffect(() => {
    dispatch(fetchTemplates());
    dispatch(fetchTemplateCategories());
  }, [dispatch]);

  // Only set templateId to 'custom' when custom hardware is selected
  // The individual values are already being set by updateCustomHardware

  const handleTemplateSelect = (templateId) => {
    setUseCustomHardware(false);
    setValue(`${id}.templateId`, templateId);
    // Clear custom values when selecting a template
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
  
  // Get system limits or use defaults
  const cpuLimit = systemResources?.getSystemResources?.cpu?.available || 64;
  const memoryLimit = systemResources?.getSystemResources?.memory?.available || 512;
  const diskTotal = systemResources?.getSystemResources?.disk?.total || 1000;
  const diskUsed = systemResources?.getSystemResources?.disk?.used || 200;
  const diskAvailable = systemResources?.getSystemResources?.disk?.available || 800;

  if (templatesLoading.fetch) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading templates...</div>
      </div>
    );
  }
  
  if (templatesError.fetch) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">Error loading templates</div>
      </div>
    );
  }

  // Group templates by category
  const templatesByCategory = templates.reduce((acc, template) => {
    const categoryId = template.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(template);
    return acc;
  }, {});

  const hasTemplates = templates.length > 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Select Resources</h2>
        <p className="text-sm text-muted-foreground">
          {hasTemplates 
            ? 'Choose a template or configure custom hardware for your machine.'
            : 'Configure custom hardware for your machine.'}
        </p>
      </div>

      {/* Custom Hardware Option */}
      <Card 
        className={cn(
          "p-6 border cursor-pointer transition-all",
          useCustomHardware || stepValues.templateId === 'custom'
            ? "border-primary bg-primary/5 shadow-lg"
            : "hover:border-primary/50 hover:shadow-md hover:bg-accent/50"
        )}
        onClick={handleCustomSelect}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center transition-all",
              useCustomHardware || stepValues.templateId === 'custom'
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}>
              <Settings2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Custom Hardware</h3>
              <p className="text-sm text-muted-foreground">
                Configure your own hardware specifications
              </p>
            </div>
          </div>

          {(useCustomHardware || stepValues.templateId === 'custom') && (
            <div className="space-y-6 pt-4 border-t" onClick={(e) => e.stopPropagation()}>
              {/* CPU Cores */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Cpu className="h-4 w-4 text-blue-500" />
                  CPU Cores: <span className="font-bold text-base text-blue-600">{customHardware.cores}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    Max available: {cpuLimit}
                  </span>
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="range"
                    value={customHardware.cores}
                    onChange={(e) => updateCustomHardware('cores', parseInt(e.target.value))}
                    min={1}
                    max={cpuLimit}
                    step={1}
                    className="flex-1 accent-blue-500"
                  />
                  <Input
                    type="number"
                    value={customHardware.cores}
                    onChange={(e) => updateCustomHardware('cores', Math.min(cpuLimit, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-20 border-blue-200 focus:border-blue-500"
                    min={1}
                    max={cpuLimit}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Between 1 and {cpuLimit} cores</p>
              </div>

              {/* RAM */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <MemoryStick className="h-4 w-4 text-green-500" />
                  RAM: <span className="font-bold text-base text-green-600">{customHardware.ram} GB</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    Max available: {memoryLimit} GB
                  </span>
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="range"
                    value={customHardware.ram}
                    onChange={(e) => updateCustomHardware('ram', parseInt(e.target.value))}
                    min={1}
                    max={memoryLimit}
                    step={1}
                    className="flex-1 accent-green-500"
                  />
                  <Input
                    type="number"
                    value={customHardware.ram}
                    onChange={(e) => updateCustomHardware('ram', Math.min(memoryLimit, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-20 border-green-200 focus:border-green-500"
                    min={1}
                    max={memoryLimit}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Between 1 and {memoryLimit} GB</p>
              </div>

              {/* Storage - Using the new DiskSpaceSlider component */}
              <DiskSpaceSlider
                total={diskTotal}
                used={diskUsed}
                available={diskAvailable}
                value={customHardware.storage}
                onChange={(value) => updateCustomHardware('storage', value)}
                min={10}
                step={10}
                label="Storage"
                color="purple"
              />

              {/* Summary with Performance Score */}
              <div className="p-4 bg-muted/50 rounded-lg border space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-3">Configuration Summary:</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded-md">
                      <Cpu className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{customHardware.cores} Cores</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded-md">
                      <MemoryStick className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{customHardware.ram} GB RAM</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-purple-500/10 rounded-md">
                      <HardDrive className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">{customHardware.storage} GB Storage</span>
                    </div>
                  </div>
                </div>
                
                {/* Performance Score for Custom Hardware */}
                {(() => {
                  const perf = calculatePerformanceScore(customHardware.cores, customHardware.ram, customHardware.storage);
                  return (
                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Performance Score</span>
                        <span className="font-medium">
                          {perf.level} ({perf.score}%)
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-300",
                            perf.score <= 20 ? 'bg-blue-400' : 
                            perf.score <= 40 ? 'bg-green-400' : 
                            perf.score <= 60 ? 'bg-yellow-400' :
                            perf.score <= 80 ? 'bg-orange-400' : 
                            'bg-gradient-to-r from-purple-400 to-pink-400'
                          )}
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
        <RadioGroup
          value={useCustomHardware ? '' : stepValues.templateId}
          onValueChange={handleTemplateSelect}
          className="space-y-6"
        >
          {categories.map((category) => (
            <Card key={category.id} className="p-6 border-2 shadow-sm">
              <div className="space-y-6">
                <div className="space-y-2 border-b pb-4">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  )}
                </div>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {templatesByCategory[category.id]?.map((template) => (
                    <Label
                      key={template.id}
                      className={cn(
                        "relative flex cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 group",
                        stepValues.templateId === template.id && !useCustomHardware
                          ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg scale-[1.02]' 
                          : 'border-border/60 bg-card hover:border-primary/60 hover:shadow-lg hover:scale-[1.01] hover:bg-gradient-to-br hover:from-accent/30 hover:to-accent/10'
                      )}
                    >
                      <RadioGroupItem
                        value={template.id}
                        id={template.id}
                        className="sr-only"
                      />
                      <div className="w-full space-y-4">
                        {/* Header with icon and title */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                              {template.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {template.description}
                            </p>
                          </div>
                          {stepValues.templateId === template.id && !useCustomHardware && (
                            <div className="ml-2 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Specs with icons and colors */}
                        <div className="space-y-3 pt-3 border-t border-border/50">
                          {/* CPU */}
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                              <Cpu className="h-4 w-4 text-blue-500" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground">CPU</p>
                              <p className="font-semibold text-sm">{template.cores} Cores</p>
                            </div>
                          </div>

                          {/* RAM */}
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                              <MemoryStick className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground">Memory</p>
                              <p className="font-semibold text-sm">{template.ram} GB RAM</p>
                            </div>
                          </div>

                          {/* Storage */}
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                              <HardDrive className="h-4 w-4 text-purple-500" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground">Storage</p>
                              <p className="font-semibold text-sm">{template.storage} GB</p>
                            </div>
                          </div>
                        </div>

                        {/* Performance indicator bar */}
                        <div className="pt-3 border-t border-border/50">
                          {(() => {
                            const perf = calculatePerformanceScore(template.cores, template.ram, template.storage);
                            return (
                              <>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                  <span>Performance Score</span>
                                  <span className="font-medium">
                                    {perf.level} ({perf.score}%)
                                  </span>
                                </div>
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className={cn(
                                      "h-full rounded-full transition-all duration-500",
                                      perf.score <= 20 ? 'bg-blue-400' : 
                                      perf.score <= 40 ? 'bg-green-400' : 
                                      perf.score <= 60 ? 'bg-yellow-400' :
                                      perf.score <= 80 ? 'bg-orange-400' : 
                                      'bg-gradient-to-r from-purple-400 to-pink-400'
                                    )}
                                    style={{ width: `${perf.percentage}%` }}
                                  />
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </Label>
                  ))}
                  {(!templatesByCategory[category.id] || templatesByCategory[category.id].length === 0) && (
                    <p className="col-span-full text-center text-muted-foreground py-8 border-2 border-input border-dashed rounded-lg">
                      No templates in this category
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </RadioGroup>
      ) : (
        <Card className="p-8 border-2 border-dashed">
          <div className="text-center space-y-3">
            <Server className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="font-medium text-lg">No Templates Available</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              No pre-configured templates have been created yet. You can use the custom hardware option above to configure your machine specifications.
            </p>
          </div>
        </Card>
      )}

      {getError('templateId') && (
        <p className="text-sm text-red-500">{getError('templateId')}</p>
      )}
    </div>
  );
}