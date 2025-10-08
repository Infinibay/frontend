'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Shield, Settings, Check, ChevronsUpDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreateDepartmentFirewallRuleMutation } from '@/gql/hooks';
import { createDebugger } from '@/utils/debug';
import { toast } from 'sonner';
import { getPriorityFromLabel } from '@/utils/firewallHelpers';
import { SERVICE_PRESETS } from '@/config/servicePresets';
import { cn } from '@/lib/utils';

const debug = createDebugger('frontend:components:create-department-firewall-rule-dialog');

// Service Combobox Component
const ServiceCombobox = ({ value, onValueChange, error }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  const selectedPreset = SERVICE_PRESETS.find(p => p.id === value);

  // Manual filtering when search query is not empty
  const filteredPresets = searchQuery.trim() === ''
    ? SERVICE_PRESETS
    : SERVICE_PRESETS.filter(preset => {
        const searchLower = searchQuery.toLowerCase();
        return preset.displayName.toLowerCase().includes(searchLower) ||
               preset.description.toLowerCase().includes(searchLower) ||
               preset.category.toLowerCase().includes(searchLower);
      });

  const handleSelect = (presetId) => {
    onValueChange(presetId);
    setOpen(false);
    setSearchQuery('');
  };

  // Focus input when popover opens
  useEffect(() => {
    if (open) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        const input = document.querySelector('[cmdk-input]');
        if (input) {
          input.focus();
          debug.log('Input focused');
        }
      });
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between hover:bg-accent/50",
            error && "border-destructive"
          )}
        >
          {selectedPreset ? (
            <span className="flex items-center gap-2">
              <span className="text-lg">{selectedPreset.icon}</span>
              <span>{selectedPreset.displayName}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Select a service...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[400px] p-0 !z-[9999]"
        align="start"
        sideOffset={5}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          // Focus the input after preventing default
          requestAnimationFrame(() => {
            const input = document.querySelector('[cmdk-input]');
            if (input) {
              input.focus();
            }
          });
        }}
      >
        <Command shouldFilter={false}>
          <CommandInput
            ref={inputRef}
            placeholder="Search services..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {filteredPresets.length === 0 ? (
              <CommandEmpty>No service found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredPresets.map((preset) => (
                  <CommandItem
                    key={preset.id}
                    value={`${preset.id} ${preset.displayName} ${preset.description}`}
                    onSelect={() => handleSelect(preset.id)}
                    className="cursor-pointer hover:bg-accent !opacity-100"
                    style={{ opacity: 1 }}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex items-center justify-center h-4 w-4">
                        <Check
                          className={cn(
                            "h-4 w-4",
                            value === preset.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </div>
                      <span className="text-lg">{preset.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-foreground" style={{ opacity: 1 }}>
                          {preset.displayName}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1" style={{ opacity: 1 }}>
                          {preset.description}
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const CreateDepartmentFirewallRuleDialog = ({ departmentId, isOpen, onClose, onSuccess, existingRules }) => {
  const [mode, setMode] = useState('simple');
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    action: 'ACCEPT',
    direction: 'INBOUND',
    priorityLabel: 'MEDIUM',
    customPriority: '',
    protocol: 'TCP',
    dstPortStart: '',
    dstPortEnd: '',
    srcPortStart: '',
    srcPortEnd: '',
    srcIpAddr: '',
    srcIpMask: '',
    dstIpAddr: '',
    dstIpMask: ''
  });

  const [selectedPreset, setSelectedPreset] = useState('');
  const [createRule, { loading }] = useCreateDepartmentFirewallRuleMutation();

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePresetChange = (presetId) => {
    setSelectedPreset(presetId);
    const preset = SERVICE_PRESETS.find(p => p.id === presetId);
    if (preset && preset.rules.length > 0) {
      const firstRule = preset.rules[0];
      setFormData(prev => ({
        ...prev,
        name: `Allow ${preset.displayName}`,
        description: preset.description,
        action: firstRule.action,
        direction: firstRule.direction,
        protocol: firstRule.protocol,
        dstPortStart: firstRule.dstPortStart?.toString() || '',
        dstPortEnd: firstRule.dstPortEnd?.toString() || '',
        srcPortStart: '',
        srcPortEnd: '',
        srcIpAddr: '',
        srcIpMask: '',
        dstIpAddr: '',
        dstIpMask: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Rule name is required';
    }

    if (mode === 'simple' && !selectedPreset) {
      newErrors.preset = 'Please select a service';
    }

    if (mode === 'advanced') {
      if (formData.dstPortStart && (isNaN(formData.dstPortStart) || formData.dstPortStart < 1 || formData.dstPortStart > 65535)) {
        newErrors.dstPortStart = 'Invalid port (1-65535)';
      }
      if (formData.dstPortEnd && (isNaN(formData.dstPortEnd) || formData.dstPortEnd < 1 || formData.dstPortEnd > 65535)) {
        newErrors.dstPortEnd = 'Invalid port (1-65535)';
      }
      if (formData.dstPortStart && formData.dstPortEnd && parseInt(formData.dstPortStart) > parseInt(formData.dstPortEnd)) {
        newErrors.dstPortEnd = 'End port must be >= start port';
      }

      if (formData.priorityLabel === 'CUSTOM' && (!formData.customPriority || isNaN(formData.customPriority) || formData.customPriority < 1 || formData.customPriority > 1000)) {
        newErrors.customPriority = 'Priority must be 1-1000';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix form errors');
      return;
    }

    debug.log('Creating department firewall rule:', formData);

    try {
      const priority = formData.priorityLabel === 'CUSTOM'
        ? parseInt(formData.customPriority)
        : getPriorityFromLabel(formData.priorityLabel);

      const input = {
        name: formData.name,
        description: formData.description || null,
        action: formData.action,
        direction: formData.direction,
        priority,
        protocol: formData.protocol.toLowerCase(),
        dstPortStart: formData.dstPortStart ? parseInt(formData.dstPortStart) : null,
        dstPortEnd: formData.dstPortEnd ? parseInt(formData.dstPortEnd) : null,
        srcPortStart: formData.srcPortStart ? parseInt(formData.srcPortStart) : null,
        srcPortEnd: formData.srcPortEnd ? parseInt(formData.srcPortEnd) : null,
        srcIpAddr: formData.srcIpAddr || null,
        srcIpMask: formData.srcIpMask || null,
        dstIpAddr: formData.dstIpAddr || null,
        dstIpMask: formData.dstIpMask || null,
        overridesDept: false
      };

      debug.log('Submitting department rule input:', input);

      await createRule({
        variables: { departmentId, input }
      });

      toast.success('Department firewall rule created');
      onSuccess();
      resetForm();
    } catch (error) {
      debug.error('Failed to create department rule:', error);
      toast.error(`Failed to create rule: ${error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      action: 'ACCEPT',
      direction: 'INBOUND',
      priorityLabel: 'MEDIUM',
      customPriority: '',
      protocol: 'TCP',
      dstPortStart: '',
      dstPortEnd: '',
      srcPortStart: '',
      srcPortEnd: '',
      srcIpAddr: '',
      srcIpMask: '',
      dstIpAddr: '',
      dstIpMask: ''
    });
    setSelectedPreset('');
    setErrors({});
    setMode('simple');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent glass="strong" className="max-w-2xl max-h-[90vh] overflow-y-auto space-y-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="size-icon" />
            Create Department Firewall Rule
          </DialogTitle>
          <DialogDescription>
            Add a department-wide firewall rule that will be inherited by all VMs
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
          <AlertCircle className="size-icon text-purple-600 dark:text-purple-400 mt-0.5" />
          <p className="text-xs text-purple-700 dark:text-purple-300">
            This rule will apply to all VMs in this department. Individual VMs can override it if needed.
          </p>
        </div>

        <Tabs value={mode} onValueChange={setMode} className="w-full space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simple">
              <Shield className="size-icon mr-2" />
              Simple Mode
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Settings className="size-icon mr-2" />
              Advanced Mode
            </TabsTrigger>
          </TabsList>

          {/* Simple Mode - Searchable combobox */}
          <TabsContent value="simple" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preset">Service</Label>
              <ServiceCombobox
                value={selectedPreset}
                onValueChange={handlePresetChange}
                error={errors.preset}
              />
              {errors.preset && <p className="text-xs text-destructive">{errors.preset}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="simple-name">Rule Name</Label>
              <Input
                id="simple-name"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="e.g., Allow HTTPS"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="simple-action">Action</Label>
              <Select value={formData.action} onValueChange={(v) => handleFieldChange('action', v)}>
                <SelectTrigger id="simple-action">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACCEPT">✅ Allow Traffic</SelectItem>
                  <SelectItem value="DROP">🚫 Block Traffic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Advanced Mode - Simplified, no override option */}
          <TabsContent value="advanced" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adv-name">Rule Name *</Label>
                <Input
                  id="adv-name"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="e.g., Allow Custom App"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="adv-action">Action</Label>
                <Select value={formData.action} onValueChange={(v) => handleFieldChange('action', v)}>
                  <SelectTrigger id="adv-action">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACCEPT">✅ Allow</SelectItem>
                    <SelectItem value="DROP">🚫 Block</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adv-desc">Description (optional)</Label>
              <Textarea
                id="adv-desc"
                value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                placeholder="Describe the purpose of this rule"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adv-direction">Direction</Label>
                <Select value={formData.direction} onValueChange={(v) => handleFieldChange('direction', v)}>
                  <SelectTrigger id="adv-direction">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INBOUND">⬇️ Inbound</SelectItem>
                    <SelectItem value="OUTBOUND">⬆️ Outbound</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adv-protocol">Protocol</Label>
                <Select value={formData.protocol} onValueChange={(v) => handleFieldChange('protocol', v)}>
                  <SelectTrigger id="adv-protocol">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TCP">TCP</SelectItem>
                    <SelectItem value="UDP">UDP</SelectItem>
                    <SelectItem value="ICMP">ICMP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Destination Ports</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Start port"
                  value={formData.dstPortStart}
                  onChange={(e) => handleFieldChange('dstPortStart', e.target.value)}
                  className={errors.dstPortStart ? 'border-destructive' : ''}
                />
                <Input
                  placeholder="End port (optional)"
                  value={formData.dstPortEnd}
                  onChange={(e) => handleFieldChange('dstPortEnd', e.target.value)}
                  className={errors.dstPortEnd ? 'border-destructive' : ''}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select value={formData.priorityLabel} onValueChange={(v) => handleFieldChange('priorityLabel', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGH">🔴 High (200)</SelectItem>
                    <SelectItem value="MEDIUM">🟡 Medium (500)</SelectItem>
                    <SelectItem value="LOW">🟢 Low (800)</SelectItem>
                    <SelectItem value="CUSTOM">⚙️ Custom</SelectItem>
                  </SelectContent>
                </Select>
                {formData.priorityLabel === 'CUSTOM' && (
                  <Input
                    type="number"
                    placeholder="1-1000"
                    value={formData.customPriority}
                    onChange={(e) => handleFieldChange('customPriority', e.target.value)}
                    className={errors.customPriority ? 'border-destructive' : ''}
                  />
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Department Rule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDepartmentFirewallRuleDialog;
