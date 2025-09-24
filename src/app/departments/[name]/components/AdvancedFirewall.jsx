"use client";

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  useCreateFilterRuleMutation,
  useCreateFilterMutation,
  useDeleteFilterRuleMutation
} from '@/gql/hooks';
import { useToast } from '@/hooks/use-toast';
import {
  normalizeAction,
  normalizeDirection
} from '@/utils/firewallHelpers';
import {
  Shield,
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  Building,
  Info
} from 'lucide-react';

const RuleDialog = ({
  open,
  onOpenChange,
  rule = null,
  scope = 'department',
  departmentId = null,
  departmentFilters = [],
  onSave
}) => {
  const [formData, setFormData] = useState(() => {
    if (rule) {
      return {
        comment: rule.comment || '',
        direction: normalizeDirection(rule.direction) || 'inbound',
        action: normalizeAction(rule.action) || 'allow',
        protocol: rule.protocol || 'tcp',
        srcPortStart: rule.srcPortStart || '',
        srcPortEnd: rule.srcPortEnd || '',
        dstPortStart: rule.dstPortStart || '',
        dstPortEnd: rule.dstPortEnd || '',
        srcIpAddr: rule.srcIpAddr || '',
        srcIpMask: rule.srcIpMask || '',
        dstIpAddr: rule.dstIpAddr || '',
        dstIpMask: rule.dstIpMask || '',
        priority: rule.priority || 100
      };
    }
    return {
      comment: '',
      direction: 'inbound',
      action: 'allow',
      protocol: 'tcp',
      srcPortStart: '',
      srcPortEnd: '',
      dstPortStart: '',
      dstPortEnd: '',
      srcIpAddr: '',
      srcIpMask: '',
      dstIpAddr: '',
      dstIpMask: '',
      priority: 100
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
        comment: service.name,
        protocol: firstPort.protocol,
        dstPortStart: firstPort.start,
        dstPortEnd: firstPort.end
      }));
    }
  };

  const renderRiskInfo = () => {
    const service = knownServices.find(s => s.name === formData.comment);
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
                value={formData.comment}
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

            {formData.comment && renderRiskInfo()}

            <div className="space-y-2">
              <Label>Rule Description</Label>
              <Input
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Describe the rule purpose"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
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
              <div className="space-y-2">
                <Label>Action</Label>
                <Select value={formData.action} onValueChange={(val) => setFormData(prev => ({ ...prev, action: val }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allow">Allow</SelectItem>
                    <SelectItem value="deny">Deny</SelectItem>
                    <SelectItem value="reject">Reject</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 100 }))}
                  placeholder="100"
                  min="1"
                  max="1000"
                />
              </div>
            </div>

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

            {formData.protocol !== 'icmp' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Source Port Start</Label>
                    <Input
                      type="number"
                      value={formData.srcPortStart}
                      onChange={(e) => setFormData(prev => ({ ...prev, srcPortStart: e.target.value }))}
                      placeholder="Any (leave empty)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Source Port End</Label>
                    <Input
                      type="number"
                      value={formData.srcPortEnd}
                      onChange={(e) => setFormData(prev => ({ ...prev, srcPortEnd: e.target.value }))}
                      placeholder="Any (leave empty)"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Destination Port Start</Label>
                    <Input
                      type="number"
                      value={formData.dstPortStart}
                      onChange={(e) => setFormData(prev => ({ ...prev, dstPortStart: e.target.value }))}
                      placeholder="Any (leave empty)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Destination Port End</Label>
                    <Input
                      type="number"
                      value={formData.dstPortEnd}
                      onChange={(e) => setFormData(prev => ({ ...prev, dstPortEnd: e.target.value }))}
                      placeholder="Any (leave empty)"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Source IP Address</Label>
                  <Input
                    value={formData.srcIpAddr}
                    onChange={(e) => setFormData(prev => ({ ...prev, srcIpAddr: e.target.value }))}
                    placeholder="Any (leave empty)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Source IP Mask</Label>
                  <Input
                    type="number"
                    value={formData.srcIpMask}
                    onChange={(e) => setFormData(prev => ({ ...prev, srcIpMask: e.target.value }))}
                    placeholder="24"
                    min="0"
                    max="32"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Destination IP Address</Label>
                  <Input
                    value={formData.dstIpAddr}
                    onChange={(e) => setFormData(prev => ({ ...prev, dstIpAddr: e.target.value }))}
                    placeholder="Any (leave empty)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Destination IP Mask</Label>
                  <Input
                    type="number"
                    value={formData.dstIpMask}
                    onChange={(e) => setFormData(prev => ({ ...prev, dstIpMask: e.target.value }))}
                    placeholder="24"
                    min="0"
                    max="32"
                  />
                </div>
              </div>
            </div>
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

const RulesList = ({ rules, scope, departmentName, onEdit, onDelete }) => {
  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Direction</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Protocol</TableHead>
            <TableHead>Ports</TableHead>
            <TableHead>IP Addresses</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => {
            const formatted = {
              comment: rule.comment || `Rule ${rule.id}`,
              direction: normalizeDirection(rule.direction) || 'unknown',
              action: normalizeAction(rule.action) || 'unknown',
              protocol: rule.protocol?.toLowerCase() || 'unknown',
              portDisplay: [],
              ipDisplay: [],
              priority: rule.priority || 0
            };

            // Format ports
            if (rule.srcPortStart && rule.srcPortEnd) {
              formatted.portDisplay.push(`Src: ${rule.srcPortStart}${rule.srcPortStart !== rule.srcPortEnd ? `-${rule.srcPortEnd}` : ''}`);
            }
            if (rule.dstPortStart && rule.dstPortEnd) {
              formatted.portDisplay.push(`Dst: ${rule.dstPortStart}${rule.dstPortStart !== rule.dstPortEnd ? `-${rule.dstPortEnd}` : ''}`);
            }

            // Format IPs
            if (rule.srcIpAddr) {
              formatted.ipDisplay.push(`Src: ${rule.srcIpAddr}${rule.srcIpMask ? `/${rule.srcIpMask}` : ''}`);
            }
            if (rule.dstIpAddr) {
              formatted.ipDisplay.push(`Dst: ${rule.dstIpAddr}${rule.dstIpMask ? `/${rule.dstIpMask}` : ''}`);
            }

            return (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{formatted.comment}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Dept: {departmentName}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    formatted.direction === 'inbound' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                  )}>
                    {formatted.direction === 'inbound' ? '↓' : '↑'} {formatted.direction}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    formatted.action === 'allow' ? 'bg-green-100 text-green-800' :
                    formatted.action === 'deny' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  )}>
                    {formatted.action}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-sm">{formatted.protocol.toUpperCase()}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatted.portDisplay.length > 0 ? formatted.portDisplay.join(', ') : 'Any'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatted.ipDisplay.length > 0 ? formatted.ipDisplay.join(', ') : 'Any'}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                    {formatted.priority}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(rule)}
                      className="h-8 w-8"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(rule.id)}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
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

const AdvancedFirewall = ({
  departmentId,
  departmentName,
  departmentFilters = [],
  customRules = [],
  effectiveRules = [],
  onRuleChange
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState(null);
  const [scope, setScope] = useState('department');

  const { toast } = useToast();

  // GraphQL mutations
  const [createFilterRule, { loading: createRuleLoading }] = useCreateFilterRuleMutation();
  const [createFilter, { loading: createFilterLoading }] = useCreateFilterMutation();
  const [deleteFilterRule, { loading: deleteRuleLoading }] = useDeleteFilterRuleMutation();

  // Determine which rules to display
  const displayRules = scope === 'department' ? customRules : effectiveRules;

  const handleAddRule = () => {
    setCurrentRule(null);
    setDialogOpen(true);
  };

  const handleEditRule = (rule) => {
    setCurrentRule(rule);
    setDialogOpen(true);
  };

  const handleDeleteRule = async (ruleId) => {
    const rule = displayRules.find(r => r.id === ruleId);
    const confirmed = window.confirm(
      `Are you sure you want to delete the rule "${rule?.comment || rule?.id}"?\n\n` +
      `This action will affect all VMs in the ${departmentName} department and cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteFilterRule({
        variables: { id: ruleId }
      });

      toast({
        title: 'Rule Deleted',
        description: `The firewall rule has been removed from the ${departmentName} department.`,
        variant: 'default'
      });

      if (onRuleChange) onRuleChange();
    } catch (error) {
      console.error('Error deleting department rule:', error);
      toast({
        title: 'Error Deleting Rule',
        description: error.message || 'Failed to delete the firewall rule. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleSaveRule = async (ruleData) => {
    try {
      let filterId = null;

      // Find existing department filter or create one
      const existingFilter = departmentFilters.find(f => f.departmentId === departmentId);

      if (existingFilter) {
        filterId = existingFilter.id;
      } else {
        // Create a new filter for the department
        const createFilterResult = await createFilter({
          variables: {
            input: {
              name: `${departmentName} Department Filter`,
              description: `Firewall filter for ${departmentName} department`,
              departmentId: departmentId,
              vmId: null // Department-level filter
            }
          }
        });

        if (createFilterResult.data?.createFilter?.id) {
          filterId = createFilterResult.data.createFilter.id;
        } else {
          throw new Error('Failed to create department filter');
        }
      }

      // Create the rule
      const ruleInput = {
        comment: ruleData.comment || 'Department Rule',
        direction: ruleData.direction,
        action: ruleData.action,
        protocol: ruleData.protocol,
        priority: ruleData.priority || 100
      };

      // Add port fields if not ICMP
      if (ruleData.protocol !== 'icmp') {
        if (ruleData.srcPortStart) ruleInput.srcPortStart = parseInt(ruleData.srcPortStart);
        if (ruleData.srcPortEnd) ruleInput.srcPortEnd = parseInt(ruleData.srcPortEnd);
        if (ruleData.dstPortStart) ruleInput.dstPortStart = parseInt(ruleData.dstPortStart);
        if (ruleData.dstPortEnd) ruleInput.dstPortEnd = parseInt(ruleData.dstPortEnd);
      }

      // Add IP fields if provided
      if (ruleData.srcIpAddr) ruleInput.srcIpAddr = ruleData.srcIpAddr;
      if (ruleData.srcIpMask) ruleInput.srcIpMask = parseInt(ruleData.srcIpMask);
      if (ruleData.dstIpAddr) ruleInput.dstIpAddr = ruleData.dstIpAddr;
      if (ruleData.dstIpMask) ruleInput.dstIpMask = parseInt(ruleData.dstIpMask);

      await createFilterRule({
        variables: {
          input: ruleInput,
          filterId: filterId
        }
      });

      toast({
        title: 'Rule Created',
        description: `The firewall rule has been added to the ${departmentName} department.`,
        variant: 'default'
      });

      setDialogOpen(false);
      if (onRuleChange) onRuleChange();

    } catch (error) {
      console.error('Error creating department rule:', error);
      toast({
        title: 'Error Creating Rule',
        description: error.message || 'Failed to create the firewall rule. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Department Context Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Building className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800">Advanced Firewall Configuration</h4>
            <p className="text-sm text-blue-700 mt-1">
              Technical interface for creating detailed firewall rules for <strong>{departmentName}</strong> department.
              Rules created here will be applied to all VMs in the department.
            </p>
          </div>
        </div>
      </div>

      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Department Firewall Rules</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="rule-scope">View:</Label>
            <Select value={scope} onValueChange={setScope}>
              <SelectTrigger id="rule-scope" className="w-[180px]">
                <SelectValue placeholder="Select scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="department">Custom Rules Only</SelectItem>
                <SelectItem value="effective">All Effective Rules</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleAddRule}
            disabled={createRuleLoading || createFilterLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {createRuleLoading || createFilterLoading ? 'Creating...' : 'Add Rule'}
          </Button>
        </div>
      </div>

      {/* Rules Display */}
      {displayRules.length === 0 ? (
        <Card className="border-dashed">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <Shield className="h-12 w-12 text-gray-300 mx-auto" />
              <div>
                <p className="text-gray-500 font-medium">
                  {scope === 'department' ? 'No custom department rules' : 'No effective rules'}
                </p>
                <p className="text-sm text-gray-400">
                  {scope === 'department'
                    ? 'Create the first advanced firewall rule for the department'
                    : 'Switch to "Custom Rules Only" to create new rules'
                  }
                </p>
              </div>
              {scope === 'department' && (
                <Button onClick={handleAddRule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Rule
                </Button>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <RulesList
            rules={displayRules}
            scope={scope}
            departmentName={departmentName}
            onEdit={handleEditRule}
            onDelete={handleDeleteRule}
          />
        </Card>
      )}

      <RuleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        rule={currentRule}
        scope={scope}
        departmentId={departmentId}
        departmentFilters={departmentFilters}
        onSave={handleSaveRule}
      />
    </div>
  );
};

export default AdvancedFirewall;