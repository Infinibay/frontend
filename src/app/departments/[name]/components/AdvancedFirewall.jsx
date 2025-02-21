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
import { knownServices, findServiceByPort, getRiskLevelDescription } from '@/config/securityServices';
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
  const [formData, setFormData] = useState(() => {
    if (rule) {
      return { ...rule };
    }
    return {
      name: '',
      description: '',
      enabled: true,
      direction: 'inbound',
      action: 'allow',
      protocol: 'tcp',
      portStart: '',
      portEnd: '',
      source: '*',
      destination: '*'
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const knownServiceOptions = knownServices.map(service => ({
    label: service.name,
    value: service.name,
    ports: service.ports,
    riskLevel: service.riskLevel,
    riskReason: service.riskReason
  }));

  const handleServiceSelect = (serviceName) => {
    const service = knownServices.find(s => s.name === serviceName);
    if (service && service.ports.length > 0) {
      const firstPort = service.ports[0];
      setFormData(prev => ({
        ...prev,
        name: service.name,
        description: service.description,
        protocol: firstPort.protocol,
        portStart: firstPort.start,
        portEnd: firstPort.end
      }));
    }
  };

  const renderRiskInfo = () => {
    const service = knownServices.find(s => s.name === formData.name);
    if (!service) return null;

    const riskColors = {
      5: 'text-red-500 border-red-200 bg-red-50',
      4: 'text-orange-500 border-orange-200 bg-orange-50',
      3: 'text-yellow-500 border-yellow-200 bg-yellow-50',
      2: 'text-blue-500 border-blue-200 bg-blue-50',
      1: 'text-green-500 border-green-200 bg-green-50',
      0: 'text-green-600 border-green-200 bg-green-50'
    };

    return (
      <div className={`mt-4 p-3 rounded-md border ${riskColors[service.riskLevel] || 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Security Risk Level: {service.riskLevel}</span>
        </div>
        <p className="mt-2 text-sm">{service.riskReason}</p>
        <p className="mt-2 text-sm font-medium">{getRiskLevelDescription(service.riskLevel)}</p>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{rule ? 'Edit Rule' : 'Add New Rule'}</DialogTitle>
          <DialogDescription>
            Configure the firewall rule settings below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Known Service</Label>
              <Select
                value={formData.name}
                onValueChange={handleServiceSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a known service..." />
                </SelectTrigger>
                <SelectContent>
                  {knownServiceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.name && renderRiskInfo()}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Direction</Label>
                <Select value={formData.direction} onValueChange={(val) => setFormData(prev => ({ ...prev, direction: val }))}>
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

            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Rule name"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input 
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Rule description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Protocol</Label>
                <Select value={formData.protocol} onValueChange={(val) => setFormData(prev => ({ ...prev, protocol: val }))}>
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
              <div className="space-y-2">
                <Label>Action</Label>
                <Select value={formData.action} onValueChange={(val) => setFormData(prev => ({ ...prev, action: val }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allow">Allow</SelectItem>
                    <SelectItem value="deny">Deny</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.protocol !== 'icmp' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Port Start</Label>
                  <Input 
                    type="number"
                    value={formData.portStart}
                    onChange={(e) => setFormData(prev => ({ ...prev, portStart: e.target.value }))}
                    placeholder="Start port"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Port End</Label>
                  <Input 
                    type="number"
                    value={formData.portEnd}
                    onChange={(e) => setFormData(prev => ({ ...prev, portEnd: e.target.value }))}
                    placeholder="End port"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">
              {rule ? 'Update Rule' : 'Add Rule'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const RulesList = ({ rules, scope, vmId = null, onEdit, onDelete, onToggle }) => {
  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Protocol</TableHead>
            <TableHead>Ports</TableHead>
            <TableHead>Direction</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => {
            const service = rule.name ? knownServices.find(s => s.name === rule.name) : null;
            const riskLevel = service ? service.riskLevel : 3;
            
            return (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {rule.name}
                    {riskLevel >= 4 && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{rule.protocol.toUpperCase()}</TableCell>
                <TableCell>
                  {rule.protocol === 'icmp' ? 'N/A' : `${rule.portStart}${rule.portEnd !== rule.portStart ? `-${rule.portEnd}` : ''}`}
                </TableCell>
                <TableCell>{rule.direction}</TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    rule.action === 'allow' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  )}>
                    {rule.action}
                  </span>
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={rule.enabled}
                    onCheckedChange={() => onToggle(rule.id)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(rule)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const AdvancedFirewall = () => {
  const [selectedVM, setSelectedVM] = useState(null);
  const [ruleDialog, setRuleDialog] = useState({ open: false, rule: null, scope: 'department' });
  const [rules, setRules] = useState({});

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

  const handleDeleteRule = (ruleId) => {
    // Here you would implement the actual delete logic
    console.log('Deleting rule:', ruleId);
  };

  const handleToggleRule = (ruleId) => {
    // Here you would implement the actual toggle logic
    console.log('Toggling rule:', ruleId);
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
          rules={selectedVM ? (rules.vms && rules.vms[selectedVM]) || [] : (rules.department || [])}
          scope={selectedVM ? 'vm' : 'department'}
          vmId={selectedVM}
          onEdit={handleEditRule}
          onDelete={handleDeleteRule}
          onToggle={handleToggleRule}
        />
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-6">Default Security Filters</h3>
        <div className="space-y-4">
          {knownServices.map((service) => (
            <div key={service.name} className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="flex-shrink-0 pt-1">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">{service.name}</h5>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                  <Switch checked={service.enabled} />
                </div>
                <p className="text-sm text-gray-500 mt-2">{service.details}</p>
                {service.recommended && (
                  <div className="mt-2 flex items-center text-sm text-green-600">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Recommended for security
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
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
