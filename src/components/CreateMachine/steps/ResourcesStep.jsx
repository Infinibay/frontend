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

export function ResourcesStep({ id }) {
  const dispatch = useDispatch();
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const { items: templates, loading: templatesLoading, error: templatesError } = useSelector(selectTemplatesState);
  const { items: categories } = useSelector(state => state.templateCategories);
  const stepValues = values[id] || {};
  
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
          "p-6 border-2 cursor-pointer transition-all bg-gradient-to-br",
          useCustomHardware || stepValues.templateId === 'custom'
            ? "border-primary from-primary/10 via-primary/5 to-background shadow-xl"
            : "from-background to-background hover:border-primary/50 hover:shadow-lg hover:from-primary/5 hover:to-background"
        )}
        onClick={handleCustomSelect}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center transition-all",
              useCustomHardware || stepValues.templateId === 'custom'
                ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg"
                : "bg-gradient-to-br from-muted to-muted/50"
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
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="range"
                    value={customHardware.cores}
                    onChange={(e) => updateCustomHardware('cores', parseInt(e.target.value))}
                    min={1}
                    max={64}
                    step={1}
                    className="flex-1 accent-blue-500"
                  />
                  <Input
                    type="number"
                    value={customHardware.cores}
                    onChange={(e) => updateCustomHardware('cores', Math.min(64, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-20 border-blue-200 focus:border-blue-500"
                    min={1}
                    max={64}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Between 1 and 64 cores</p>
              </div>

              {/* RAM */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <MemoryStick className="h-4 w-4 text-green-500" />
                  RAM: <span className="font-bold text-base text-green-600">{customHardware.ram} GB</span>
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="range"
                    value={customHardware.ram}
                    onChange={(e) => updateCustomHardware('ram', parseInt(e.target.value))}
                    min={1}
                    max={512}
                    step={1}
                    className="flex-1 accent-green-500"
                  />
                  <Input
                    type="number"
                    value={customHardware.ram}
                    onChange={(e) => updateCustomHardware('ram', Math.min(512, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-20 border-green-200 focus:border-green-500"
                    min={1}
                    max={512}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Between 1 and 512 GB</p>
              </div>

              {/* Storage */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <HardDrive className="h-4 w-4 text-purple-500" />
                  Storage: <span className="font-bold text-base text-purple-600">{customHardware.storage} GB</span>
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="range"
                    value={customHardware.storage}
                    onChange={(e) => updateCustomHardware('storage', parseInt(e.target.value))}
                    min={10}
                    max={1024}
                    step={10}
                    className="flex-1 accent-purple-500"
                  />
                  <Input
                    type="number"
                    value={customHardware.storage}
                    onChange={(e) => updateCustomHardware('storage', Math.min(1024, Math.max(10, parseInt(e.target.value) || 10)))}
                    className="w-20 border-purple-200 focus:border-purple-500"
                    min={10}
                    max={1024}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Between 10 and 1024 GB</p>
              </div>

              {/* Summary */}
              <div className="p-4 bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-lg border border-primary/20">
                <p className="text-sm font-semibold mb-3 text-primary">Configuration Summary:</p>
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
                        "relative flex cursor-pointer rounded-lg border-2 p-4 hover:border-primary hover:shadow-md transition-all",
                        stepValues.templateId === template.id && !useCustomHardware
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-input bg-card'
                      )}
                    >
                      <RadioGroupItem
                        value={template.id}
                        id={template.id}
                        className="sr-only"
                      />
                      <div className="space-y-2">
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-sm mt-4 pt-4 border-t">
                          <div>
                            <span className="font-medium">{template.cores}</span> Cores
                          </div>
                          <div>
                            <span className="font-medium">{template.ram}</span> GB RAM
                          </div>
                          <div>
                            <span className="font-medium">{template.storage}</span> GB Storage
                          </div>
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