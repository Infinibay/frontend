"use client";

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockFirewallRules, commonPortRanges, defaultFilters } from '@/config/firewallRules';
import { mockDetectedServices } from '@/config/securityServices';
import { 
  Shield,
  Plus,
  Trash2,
  Edit2,
  ArrowUpDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const RuleDialog = ({ 
  open, 
  onOpenChange, 
  rule = null, 
  scope = 'department',
  vmId = null,
  onSave 
}) => {
  const [formData, setFormData] = useState(rule || {
    name: '',
    description: '',
    ports: '',
    protocol: 'tcp',
    direction: 'inbound',
    action: 'allow',
    priority: 100,
    enabled: true,
    scope
  });

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{rule ? 'Edit Rule' : 'New Rule'}</DialogTitle>
          <DialogDescription>
            {rule ? 'Modify existing firewall rule' : 'Create a new firewall rule'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Rule Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Allow Web Traffic"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the rule"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Common Port Ranges</Label>
              <Select 
                onValueChange={(value) => setFormData(prev => ({ ...prev, ports: commonPortRanges[value] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ports" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(commonPortRanges).map(([name, ports]) => (
                    <SelectItem key={name} value={name}>
                      {name} ({ports})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="ports">Port(s)</Label>
              <Input
                id="ports"
                value={formData.ports}
                onChange={(e) => setFormData(prev => ({ ...prev, ports: e.target.value }))}
                placeholder="e.g., 80,443 or 8000-9000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Protocol</Label>
              <Select 
                value={formData.protocol}
                onValueChange={(value) => setFormData(prev => ({ ...prev, protocol: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tcp">TCP</SelectItem>
                  <SelectItem value="udp">UDP</SelectItem>
                  <SelectItem value="icmp">ICMP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Direction</Label>
              <Select 
                value={formData.direction}
                onValueChange={(value) => setFormData(prev => ({ ...prev, direction: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inbound">Inbound</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Action</Label>
              <Select 
                value={formData.action}
                onValueChange={(value) => setFormData(prev => ({ ...prev, action: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allow">Allow</SelectItem>
                  <SelectItem value="deny">Deny</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                min="1"
                max="1000"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="enabled"
              checked={formData.enabled}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
            />
            <Label htmlFor="enabled">Rule Enabled</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {rule ? 'Save Changes' : 'Create Rule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RulesList = ({ rules, scope, vmId = null, onEdit, onDelete, onToggle }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Status</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Ports</TableHead>
          <TableHead>Protocol</TableHead>
          <TableHead>Direction</TableHead>
          <TableHead>Action</TableHead>
          <TableHead className="w-[150px]">Controls</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rules.map((rule) => (
          <TableRow key={rule.id}>
            <TableCell>
              <Switch
                checked={rule.enabled}
                onCheckedChange={() => onToggle(rule)}
                size="sm"
              />
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{rule.name}</div>
                <div className="text-sm text-gray-500">{rule.description}</div>
              </div>
            </TableCell>
            <TableCell>{rule.ports}</TableCell>
            <TableCell className="uppercase">{rule.protocol}</TableCell>
            <TableCell className="capitalize">{rule.direction}</TableCell>
            <TableCell>
              <span className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs",
                rule.action === 'allow' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              )}>
                {rule.action === 'allow' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                {rule.action}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(rule)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(rule)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const DefaultFilters = () => {
  return (
    <div className="space-y-4">
      {defaultFilters.map((filter) => (
        <div key={filter.id} className="flex items-start space-x-4 p-4 border rounded-lg">
          <div className="flex-shrink-0 pt-1">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium">{filter.name}</h5>
                <p className="text-sm text-gray-600">{filter.description}</p>
              </div>
              <Switch checked={filter.enabled} />
            </div>
            <p className="text-sm text-gray-500 mt-2">{filter.details}</p>
            {filter.recommended && (
              <div className="mt-2 flex items-center text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Recommended for security
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const AdvancedFirewall = () => {
  const [selectedVM, setSelectedVM] = useState(null);
  const [ruleDialog, setRuleDialog] = useState({ open: false, rule: null, scope: 'department' });
  const [rules, setRules] = useState(mockFirewallRules);

  const handleAddRule = () => {
    setRuleDialog({ 
      open: true, 
      rule: null, 
      scope: selectedVM ? 'vm' : 'department',
      vmId: selectedVM
    });
  };

  const handleEditRule = (rule) => {
    setRuleDialog({ 
      open: true, 
      rule, 
      scope: rule.scope,
      vmId: selectedVM
    });
  };

  const handleSaveRule = (formData) => {
    // Here you would implement the actual save logic
    console.log('Saving rule:', formData);
  };

  const handleDeleteRule = (rule) => {
    // Here you would implement the actual delete logic
    console.log('Deleting rule:', rule);
  };

  const handleToggleRule = (rule) => {
    // Here you would implement the actual toggle logic
    console.log('Toggling rule:', rule);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium">Firewall Rules</h3>
          <div className="flex items-center space-x-4">
            <Select
              value={selectedVM || 'department'}
              onValueChange={(value) => setSelectedVM(value === 'department' ? null : value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="department">Department-wide Rules</SelectItem>
                {mockDetectedServices.map((vm) => (
                  <SelectItem key={vm.vmId} value={vm.vmId}>
                    {vm.vmName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddRule}>
              <Plus className="w-4 h-4 mr-2" />
              Add Rule
            </Button>
          </div>
        </div>

        <RulesList
          rules={selectedVM ? (rules.vms[selectedVM] || []) : rules.department}
          scope={selectedVM ? 'vm' : 'department'}
          vmId={selectedVM}
          onEdit={handleEditRule}
          onDelete={handleDeleteRule}
          onToggle={handleToggleRule}
        />
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-6">Default Security Filters</h3>
        <DefaultFilters />
      </Card>

      <RuleDialog 
        open={ruleDialog.open}
        onOpenChange={(open) => setRuleDialog(prev => ({ ...prev, open }))}
        rule={ruleDialog.rule}
        scope={ruleDialog.scope}
        vmId={ruleDialog.vmId}
        onSave={handleSaveRule}
      />
    </div>
  );
};

export default AdvancedFirewall;
