'use client';

import React, { useState } from 'react';
import { AlertCircle, Shield, Settings } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateVmFirewallRuleMutation } from '@/gql/hooks';
import { createDebugger } from '@/utils/debug';
import { toast } from 'sonner';
import {
  validateFirewallRule,
  detectRuleConflicts,
  getPriorityFromLabel
} from '@/utils/firewallHelpers';
import { SERVICE_PRESETS } from '@/config/servicePresets';

const debug = createDebugger('frontend:components:create-firewall-rule-dialog');

const CreateFirewallRuleDialog = ({ vmId, vmOs, isOpen, onClose, onSuccess, existingRules }) => {
  const [mode, setMode] = useState('simple'); // 'simple' or 'advanced'
  const [errors, setErrors] = useState({});
  const [conflicts, setConflicts] = useState([]);

  // Form state
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
    dstIpMask: '',
    overridesDept: false
  });

  // Simple mode: service preset selection
  const [selectedPreset, setSelectedPreset] = useState('');

  const [createRule, { loading }] = useCreateVmFirewallRuleMutation();

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
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
      // Port validation
      if (formData.dstPortStart && (isNaN(formData.dstPortStart) || formData.dstPortStart < 1 || formData.dstPortStart > 65535)) {
        newErrors.dstPortStart = 'Invalid port (1-65535)';
      }
      if (formData.dstPortEnd && (isNaN(formData.dstPortEnd) || formData.dstPortEnd < 1 || formData.dstPortEnd > 65535)) {
        newErrors.dstPortEnd = 'Invalid port (1-65535)';
      }
      if (formData.dstPortStart && formData.dstPortEnd && parseInt(formData.dstPortStart) > parseInt(formData.dstPortEnd)) {
        newErrors.dstPortEnd = 'End port must be >= start port';
      }

      // Custom priority validation
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

    debug.log('Creating firewall rule:', formData);

    try {
      // Determine priority
      const priority = formData.priorityLabel === 'CUSTOM'
        ? parseInt(formData.customPriority)
        : getPriorityFromLabel(formData.priorityLabel);

      // Build input
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
        overridesDept: formData.overridesDept
      };

      debug.log('Submitting input:', input);

      await createRule({
        variables: { vmId, input }
      });

      toast.success('Firewall rule created');
      onSuccess();
      resetForm();
    } catch (error) {
      debug.error('Failed to create rule:', error);
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
      dstIpMask: '',
      overridesDept: false
    });
    setSelectedPreset('');
    setErrors({});
    setConflicts([]);
    setMode('simple');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="size-icon" />
            Create Firewall Rule
          </DialogTitle>
          <DialogDescription>
            Add a new firewall rule to control network traffic for this VM
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={setMode} className="w-full">
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

          {/* Simple Mode */}
          <TabsContent value="simple" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="preset">Service</Label>
              <Select value={selectedPreset} onValueChange={handlePresetChange}>
                <SelectTrigger id="preset" className={errors.preset ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select a common service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_PRESETS.map(preset => (
                    <SelectItem key={preset.id} value={preset.id}>
                      <div className="flex items-center gap-2">
                        <span>{preset.icon}</span>
                        <span>{preset.displayName}</span>
                        <Badge variant="outline" className="text-xs ml-2">
                          {preset.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.preset && (
                <p className="text-xs text-destructive">{errors.preset}</p>
              )}
              {selectedPreset && (
                <p className="text-xs text-muted-foreground">
                  {SERVICE_PRESETS.find(p => p.id === selectedPreset)?.description}
                </p>
              )}
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
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
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

            <div className="flex items-center space-x-2">
              <Checkbox
                id="simple-override"
                checked={formData.overridesDept}
                onCheckedChange={(checked) => handleFieldChange('overridesDept', checked)}
              />
              <Label htmlFor="simple-override" className="text-sm font-normal cursor-pointer">
                Override department rules (Admin only)
              </Label>
            </div>
          </TabsContent>

          {/* Advanced Mode */}
          <TabsContent value="advanced" className="space-y-4 mt-4">
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
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
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
                    <SelectItem value="INBOUND">⬇️ Inbound (Incoming)</SelectItem>
                    <SelectItem value="OUTBOUND">⬆️ Outbound (Outgoing)</SelectItem>
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
                <div>
                  <Input
                    placeholder="Start port"
                    value={formData.dstPortStart}
                    onChange={(e) => handleFieldChange('dstPortStart', e.target.value)}
                    className={errors.dstPortStart ? 'border-destructive' : ''}
                  />
                  {errors.dstPortStart && (
                    <p className="text-xs text-destructive mt-1">{errors.dstPortStart}</p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="End port (optional)"
                    value={formData.dstPortEnd}
                    onChange={(e) => handleFieldChange('dstPortEnd', e.target.value)}
                    className={errors.dstPortEnd ? 'border-destructive' : ''}
                  />
                  {errors.dstPortEnd && (
                    <p className="text-xs text-destructive mt-1">{errors.dstPortEnd}</p>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Leave end port empty for a single port. Use range for multiple ports.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={formData.priorityLabel}
                  onValueChange={(v) => handleFieldChange('priorityLabel', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGH">🔴 High (200) - Processed first</SelectItem>
                    <SelectItem value="MEDIUM">🟡 Medium (500) - Standard</SelectItem>
                    <SelectItem value="LOW">🟢 Low (800) - Processed last</SelectItem>
                    <SelectItem value="CUSTOM">⚙️ Custom</SelectItem>
                  </SelectContent>
                </Select>
                {formData.priorityLabel === 'CUSTOM' && (
                  <div>
                    <Input
                      type="number"
                      placeholder="1-1000"
                      value={formData.customPriority}
                      onChange={(e) => handleFieldChange('customPriority', e.target.value)}
                      min="1"
                      max="1000"
                      className={errors.customPriority ? 'border-destructive' : ''}
                    />
                    {errors.customPriority && (
                      <p className="text-xs text-destructive mt-1">{errors.customPriority}</p>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Lower numbers = higher priority (processed first)
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="adv-override"
                checked={formData.overridesDept}
                onCheckedChange={(checked) => handleFieldChange('overridesDept', checked)}
              />
              <Label htmlFor="adv-override" className="text-sm font-normal cursor-pointer">
                Override department rules (Admin only)
              </Label>
            </div>

            {formData.overridesDept && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
                <AlertCircle className="size-icon text-orange-600 dark:text-orange-400 mt-0.5" />
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  This rule will override similar department rules. Use with caution as this may reduce security.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Rule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFirewallRuleDialog;
