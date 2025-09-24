import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Plus,
  Trash2,
  Search,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  ArrowDown,
  Building,
  Settings,
  X,
  ShieldCheck,
  ShieldX,
  ChevronDown,
  ChevronUp,
  Minus,
  Download
} from 'lucide-react';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import { Switch } from '@components/ui/switch';
import { Checkbox } from '@components/ui/checkbox';
import {
  useDeleteFilterRuleMutation,
  useCreateFilterMutation
} from '@/gql/hooks';
import { useToast } from '@/hooks/use-toast';
import {
  normalizeAction,
  normalizeDirection,
  formatRuleForDisplay
} from '@/utils/firewallHelpers';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useFirewallMode } from '@/hooks/useFirewallMode';
import AdvancedFirewall from './AdvancedFirewall';

const DepartmentFirewallRulesSection = ({
  customRules = [],
  effectiveRules = [],
  departmentFilters = [],
  departmentId,
  departmentName,
  onRuleChange,
  availableTemplates = [],
  appliedTemplates = []
}) => {
  const router = useRouter();
  // Limit to safe subset of actions and directions for department rules
  const SUPPORTED_ACTION_KEYS = ['allow', 'deny', 'reject'];
  const SUPPORTED_DIRECTION_KEYS = ['inbound', 'outbound'];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [showAll, setShowAll] = useState(true);
  const [editingRule, setEditingRule] = useState(null);
  const [showAdvancedForm, setShowAdvancedForm] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [expandedTemplate, setExpandedTemplate] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [selectedRules, setSelectedRules] = useState(new Set());
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [singleDeleteDialog, setSingleDeleteDialog] = useState(null);

  // Firewall mode management
  const { mode, setMode } = useFirewallMode();

  const { toast } = useToast();

  const [deleteFilterRule, { loading: deleteRuleLoading }] = useDeleteFilterRuleMutation();
  const [createFilter, { loading: createLoading }] = useCreateFilterMutation();

  const isLoading = deleteRuleLoading || createLoading;


  // Determine which rules to display
  const displayRules = showAll ? effectiveRules : customRules;

  const calculateDeptRuleRisk = (rule) => {
    let riskScore = 0;
    let factors = [];

    const normalizedDirection = normalizeDirection(rule.direction);
    const normalizedAction = normalizeAction(rule.action);

    // Penalize inbound allow rules
    if (normalizedDirection === 'inbound' && normalizedAction === 'allow') {
      riskScore += 3;
      factors.push('Inbound traffic allowed');
    }

    // Penalize wide port ranges
    if (rule.dstPortStart && rule.dstPortEnd) {
      const portRange = parseInt(rule.dstPortEnd) - parseInt(rule.dstPortStart);
      if (portRange > 100) {
        riskScore += 2;
        factors.push('Wide port range');
      } else if (portRange > 10) {
        riskScore += 1;
        factors.push('Moderate port range');
      }
    }

    // Penalize missing port restrictions (any port)
    if (!rule.dstPortStart && !rule.dstPortEnd) {
      riskScore += 2;
      factors.push('No port restriction');
    }

    // Penalize wide IP ranges (mask < 16)
    if (rule.srcIpMask && parseInt(rule.srcIpMask) < 16) {
      riskScore += 2;
      factors.push('Very wide IP range');
    }
    if (rule.dstIpMask && parseInt(rule.dstIpMask) < 16) {
      riskScore += 1;
      factors.push('Destination with wide IP range');
    }

    // Penalize any source IP
    if (!rule.srcIpAddr || rule.srcIpAddr === '0.0.0.0') {
      riskScore += 1;
      factors.push('Allows any source');
    }

    // Determine risk level
    let level, color, label;
    if (riskScore >= 6) {
      level = 'high';
      color = 'red';
      label = 'High';
    } else if (riskScore >= 3) {
      level = 'medium';
      color = 'yellow';
      label = 'Medium';
    } else if (riskScore >= 1) {
      level = 'low';
      color = 'green';
      label = 'Low';
    } else {
      level = 'minimal';
      color = 'blue';
      label = 'Minimal';
    }

    return {
      level,
      color,
      label,
      score: riskScore,
      factors
    };
  };

  // Filter and sort rules - tailored for department rules
  const processedRules = useMemo(() => {
    let filtered = displayRules.filter(rule => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const comment = (rule.comment || '').toLowerCase();
        const protocol = (rule.protocol || '').toLowerCase();
        const srcPortRange = rule.srcPortStart && rule.srcPortEnd
          ? `${rule.srcPortStart}-${rule.srcPortEnd}` : '';
        const dstPortRange = rule.dstPortStart && rule.dstPortEnd
          ? `${rule.dstPortStart}-${rule.dstPortEnd}` : '';
        const srcIp = rule.srcIpAddr || '';
        const dstIp = rule.dstIpAddr || '';

        const searchableText = `${comment} ${protocol} ${srcPortRange} ${dstPortRange} ${srcIp} ${dstIp}`;
        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }

      // Direction filter with normalization
      const dir = normalizeDirection(rule.direction);
      if (filterBy === 'inbound' && dir !== 'inbound') return false;
      if (filterBy === 'outbound' && dir !== 'outbound') return false;

      // Action filter with normalization
      const act = normalizeAction(rule.action);
      if (filterBy === 'allow' && act !== 'allow') return false;
      if (filterBy === 'deny' && act !== 'deny') return false;

      return true;
    });

    // Sort filtered rules
    if (sortBy === 'priority') {
      filtered = [...filtered].sort((a, b) => (a.priority || 0) - (b.priority || 0));
    } else if (sortBy === 'name') {
      filtered = filtered.sort((a, b) => {
        const aName = a.comment || a.id || '';
        const bName = b.comment || b.id || '';
        return aName.localeCompare(bName);
      });
    } else if (sortBy === 'risk') {
      filtered = filtered.sort((a, b) => {
        const aRisk = calculateDeptRuleRisk(a);
        const bRisk = calculateDeptRuleRisk(b);
        const riskOrder = { high: 3, medium: 2, low: 1, minimal: 0 };
        return riskOrder[bRisk.level] - riskOrder[aRisk.level];
      });
    }

    return filtered;
  }, [displayRules, searchTerm, filterBy, sortBy]);

  // Template functions
  const isTemplateApplied = (templateName) => {
    return appliedTemplates.includes(templateName);
  };

  const findDeptTemplateFilter = (templateName) => {
    return departmentFilters.find(f => f.name === templateName);
  };

  const toggleTemplateDetails = (templateName) => {
    setExpandedTemplate(expandedTemplate === templateName ? null : templateName);
  };

  const handleApplyTemplate = async (template) => {
    try {
      await createFilter({
        variables: {
          input: {
            name: template.template,
            description: `${template.description} - Applied at department level`,
            type: 'DEPARTMENT',
            departmentId: departmentId
          }
        }
      });

      toast({
        title: 'Template Applied',
        description: `Template "${template.name}" has been applied to the ${departmentName} department.`,
        variant: 'default'
      });

      setConfirmDialog(null);
      if (onRuleChange) {
        onRuleChange();
      }
    } catch (error) {
      console.error('Error applying department template:', error);
      toast({
        title: 'Error Applying Template',
        description: error.message || 'Failed to apply template. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleRemoveTemplate = async (template) => {
    try {
      const filter = findDeptTemplateFilter(template.template);
      if (!filter) {
        console.error('Filter not found for template:', template.template);
        return;
      }

      await deleteFilterRule({
        variables: { id: filter.id }
      });

      toast({
        title: 'Template Removed',
        description: `Template "${template.name}" has been removed from the ${departmentName} department.`,
        variant: 'default'
      });

      setConfirmDialog(null);
      if (onRuleChange) {
        onRuleChange();
      }
    } catch (error) {
      console.error('Error removing department template:', error);
      toast({
        title: 'Error Removing Template',
        description: error.message || 'Failed to remove template. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const getTemplateIcon = (template) => {
    const isApplied = isTemplateApplied(template.template);
    if (isApplied) {
      return <ShieldCheck className="h-5 w-5 text-green-600" />;
    }
    return <Shield className="h-5 w-5 text-gray-400" />;
  };

  const handleDeleteRule = (rule) => {
    setSingleDeleteDialog(rule);
  };

  const confirmDeleteRule = async (rule) => {
    try {
      await deleteFilterRule({
        variables: { id: rule.id }
      });

      toast({
        title: 'Rule Deleted',
        description: `The firewall rule has been removed from the ${departmentName} department.`,
        variant: 'default'
      });

      setSingleDeleteDialog(null);
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

  const getRuleIcon = (rule) => {
    const risk = calculateDeptRuleRisk(rule);
    if (risk.level === 'high') return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (risk.level === 'medium') return <Info className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const formatDepartmentRule = (rule) => {
    const portDisplay = [];
    if (rule.srcPortStart && rule.srcPortEnd) {
      portDisplay.push(`Src: ${rule.srcPortStart}${rule.srcPortStart !== rule.srcPortEnd ? `-${rule.srcPortEnd}` : ''}`);
    }
    if (rule.dstPortStart && rule.dstPortEnd) {
      portDisplay.push(`Dst: ${rule.dstPortStart}${rule.dstPortStart !== rule.dstPortEnd ? `-${rule.dstPortEnd}` : ''}`);
    }

    const ipDisplay = [];
    if (rule.srcIpAddr) {
      ipDisplay.push(`Src: ${rule.srcIpAddr}${rule.srcIpMask ? `/${rule.srcIpMask}` : ''}`);
    }
    if (rule.dstIpAddr) {
      ipDisplay.push(`Dst: ${rule.dstIpAddr}${rule.dstIpMask ? `/${rule.dstIpMask}` : ''}`);
    }

    return {
      name: rule.comment || `Rule ${rule.id}`,
      direction: normalizeDirection(rule.direction) || 'unknown',
      action: normalizeAction(rule.action) || 'unknown',
      protocol: rule.protocol?.toLowerCase() || 'unknown',
      portDisplay: portDisplay.join(', ') || 'Any',
      ipDisplay: ipDisplay.join(', ') || 'Any',
      priority: rule.priority || 0
    };
  };

  // Bulk selection handlers
  const handleSelectRule = (ruleId, checked) => {
    const newSelected = new Set(selectedRules);
    if (checked) {
      newSelected.add(ruleId);
    } else {
      newSelected.delete(ruleId);
    }
    setSelectedRules(newSelected);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRules(new Set(processedRules.map(rule => rule.id)));
    } else {
      setSelectedRules(new Set());
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRules.size === 0) return;

    try {
      // Delete all selected rules
      await Promise.all(
        Array.from(selectedRules).map(ruleId =>
          deleteFilterRule({ variables: { id: ruleId } })
        )
      );

      toast({
        title: 'Rules Deleted',
        description: `${selectedRules.size} firewall rules have been removed from the ${departmentName} department.`,
        variant: 'default'
      });

      setSelectedRules(new Set());
      setShowBulkDeleteDialog(false);
      if (onRuleChange) onRuleChange();
    } catch (error) {
      console.error('Error deleting rules in bulk:', error);
      toast({
        title: 'Error Deleting Rules',
        description: error.message || 'Failed to delete some firewall rules. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const areAllSelected = processedRules.length > 0 && selectedRules.size === processedRules.length;
  const areSomeSelected = selectedRules.size > 0 && selectedRules.size < processedRules.length;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">
              {showAll ? 'All Department Rules' : 'Custom Department Rules'}
            </h3>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p className="text-sm">
                  {showAll
                    ? 'Shows all active department rules (templates + custom)'
                    : 'Shows only custom rules created for the department'
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={showAll}
                onCheckedChange={setShowAll}
                id="show-all-dept"
              />
              <Label htmlFor="show-all-dept" className="text-sm">
                Show all rules
              </Label>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowTemplateDialog(true)}
              disabled={!availableTemplates.length}
            >
              <Download className="h-4 w-4 mr-2" />
              Import rules from template
            </Button>

            <div className="border-l pl-3">
              <ModeToggle
                mode={mode}
                onModeChange={setMode}
                size="sm"
                className="text-xs"
              />
            </div>

            {mode === 'simple' ? (
              <Button
                size="sm"
                onClick={() => router.push(`/departments/${encodeURIComponent(departmentName)}/firewall/create`)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Rule
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setShowAdvancedForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Settings className="h-4 w-4 mr-2" />
                Advanced Mode
              </Button>
            )}
          </div>
        </div>

        {/* Department Impact Warning */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Building className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800">Department-Level Rules</h4>
              <p className="text-sm text-blue-700 mt-1">
                Rules configured here will be automatically applied to all VMs in department
                <strong> {departmentName}</strong> and will take priority over individually configured
                rules on each VM.
              </p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search rules by description, IP, port..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filter by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="inbound">Inbound</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                  <SelectItem value="allow">Allow</SelectItem>
                  <SelectItem value="deny">Deny</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="risk">Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Mode Component */}
        {mode === 'advanced' && showAdvancedForm && (
          <Card className="border-2 border-blue-200 bg-blue-50/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Advanced Firewall Configuration
                  </CardTitle>
                  <CardDescription>
                    Technical interface for creating and managing firewall rules for the {departmentName} department.
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedForm(false)}
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AdvancedFirewall
                departmentId={departmentId}
                departmentName={departmentName}
                departmentFilters={departmentFilters}
                customRules={customRules}
                effectiveRules={effectiveRules}
                onRuleChange={() => {
                  onRuleChange();
                  setShowAdvancedForm(false);
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Rules Table */}
        {processedRules.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <Shield className="h-12 w-12 text-gray-300 mx-auto" />
                <div>
                  <p className="text-gray-500 font-medium">No department rules to show</p>
                  <p className="text-sm text-gray-400">
                    {searchTerm || filterBy !== 'all'
                      ? 'Try adjusting the search filters'
                      : 'Create the first firewall rule for the department'
                    }
                  </p>
                </div>
                {!searchTerm && filterBy === 'all' && (
                  <Button onClick={() => router.push(`/departments/${encodeURIComponent(departmentName)}/firewall/create`)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Rule
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="ml-4">
            {/* Bulk Actions Bar */}
            {selectedRules.size > 0 && (
              <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-blue-800">
                      {selectedRules.size} rule{selectedRules.size !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRules(new Set())}
                    >
                      Clear selection
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowBulkDeleteDialog(true)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete selected
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px] pl-6">
                    <Checkbox
                      checked={areAllSelected}
                      indeterminate={areSomeSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Ports</TableHead>
                  <TableHead>IPs</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedRules.map((rule) => {
                  const formatted = formatDepartmentRule(rule);
                  const risk = calculateDeptRuleRisk(rule);

                  return (
                    <TableRow key={rule.id}>
                      <TableCell className="pl-6">
                        <Checkbox
                          checked={selectedRules.has(rule.id)}
                          onCheckedChange={(checked) => handleSelectRule(rule.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        {getRuleIcon(rule)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{formatted.name}</div>
                          <Badge variant="outline" className="text-xs mt-1 border-blue-300 text-blue-700">
                            Dept. Wide
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {formatted.direction === 'inbound' ? '↓' : '↑'} {formatted.direction}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            formatted.action === 'allow' ? 'border-green-300 text-green-700 bg-green-50' :
                            formatted.action === 'deny' ? 'border-red-300 text-red-700 bg-red-50' :
                            'border-gray-300 text-gray-700'
                          }`}
                        >
                          {formatted.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {formatted.protocol.toUpperCase()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatted.portDisplay}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatted.ipDisplay}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {formatted.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            risk.color === 'red' ? 'border-red-300 text-red-700 bg-red-50' :
                            risk.color === 'yellow' ? 'border-yellow-300 text-yellow-700 bg-yellow-50' :
                            risk.color === 'green' ? 'border-green-300 text-green-700 bg-green-50' :
                            'border-blue-300 text-blue-700 bg-blue-50'
                          }`}
                        >
                          {risk.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteRule(rule)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete department rule</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Template Import Dialog */}
        <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Import Rules from Template
              </DialogTitle>
              <DialogDescription>
                Select a firewall template to import rules into the {departmentName} department.
                These rules will be applied to all VMs in the department.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {!availableTemplates.length ? (
                <Card className="border-dashed">
                  <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center space-y-2">
                      <ShieldX className="h-8 w-8 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-500">No firewall templates available</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {availableTemplates.map((template) => {
                    const isApplied = isTemplateApplied(template.template);
                    const isExpanded = expandedTemplate === template.template;

                    return (
                      <Card
                        key={template.template}
                        className={`transition-all ${
                          isApplied
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              {getTemplateIcon(template)}
                              <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                  {template.name}
                                  {isApplied && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                      Applied to Dept.
                                    </Badge>
                                  )}
                                </CardTitle>
                                <CardDescription className="text-sm mt-1">
                                  {template.description}
                                </CardDescription>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{template.rules?.length || 0} rules</span>
                              {isApplied && (
                                <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                                  Dept. Wide
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleTemplateDetails(template.template)}
                                className="h-8 px-2"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>

                              <Dialog open={confirmDialog?.template === template.template} onOpenChange={(open) => {
                                setConfirmDialog(open ? { template: template.template, action: isApplied ? 'remove' : 'apply' } : null);
                              }}>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant={isApplied ? "outline" : "default"}
                                    disabled={isLoading}
                                    className={isApplied ? "border-red-300 text-red-700 hover:bg-red-50" : ""}
                                  >
                                    {isApplied ? (
                                      <>
                                        <Minus className="h-4 w-4 mr-1" />
                                        Remove
                                      </>
                                    ) : (
                                      <>
                                        <Plus className="h-4 w-4 mr-1" />
                                        Apply to Dept.
                                      </>
                                    )}
                                  </Button>
                                </DialogTrigger>

                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      {isApplied ? (
                                        <>
                                          <AlertCircle className="h-5 w-5 text-red-500" />
                                          Remove template from department
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle className="h-5 w-5 text-green-500" />
                                          Apply template to department
                                        </>
                                      )}
                                    </DialogTitle>
                                    <DialogDescription className="space-y-3">
                                      <p>
                                        {isApplied
                                          ? `Are you sure you want to remove the template "${template.name}" from department ${departmentName}?`
                                          : `Are you sure you want to apply the template "${template.name}" to the entire ${departmentName} department?`
                                        }
                                      </p>

                                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                        <h4 className="font-medium text-sm text-amber-800 mb-2">
                                          <Building className="h-4 w-4 inline mr-1" />
                                          Impact on department:
                                        </h4>
                                        <p className="text-xs text-amber-700">
                                          {isApplied
                                            ? `Rules will be removed from ALL VMs in department ${departmentName}.`
                                            : `Rules will be automatically applied to ALL VMs in department ${departmentName}.`
                                          }
                                        </p>
                                      </div>

                                      <div className="bg-gray-50 p-3 rounded-lg">
                                        <h4 className="font-medium text-sm mb-2">Rules to be {isApplied ? 'removed' : 'applied'}:</h4>
                                        <div className="space-y-1">
                                          {template.rules?.map((rule, index) => {
                                            const formatted = formatRuleForDisplay(rule);
                                            return (
                                              <div key={index} className="text-xs flex items-center gap-2">
                                                <Badge
                                                  variant="outline"
                                                  className={`text-xs ${
                                                    formatted.actionColor === 'green' ? 'border-green-300 text-green-700' :
                                                    formatted.actionColor === 'red' ? 'border-red-300 text-red-700' :
                                                    'border-gray-300 text-gray-700'
                                                  }`}
                                                >
                                                  {formatted.formattedAction}
                                                </Badge>
                                                <span>{formatted.formattedDirection}</span>
                                                <span>{formatted.formattedProtocol}</span>
                                                {rule.port && <span>port {rule.port}</span>}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>

                                      {!isApplied && (
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                          <p className="text-sm text-blue-800">
                                            <strong>Note:</strong> Rules will be applied immediately
                                            to all VMs in the department and will take priority over
                                            individually configured rules.
                                          </p>
                                        </div>
                                      )}
                                    </DialogDescription>
                                  </DialogHeader>

                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => setConfirmDialog(null)}
                                      disabled={isLoading}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant={isApplied ? "destructive" : "default"}
                                      onClick={() => isApplied ? handleRemoveTemplate(template) : handleApplyTemplate(template)}
                                      disabled={isLoading}
                                    >
                                      {isLoading ? 'Processing...' : (isApplied ? 'Remove from Dept.' : 'Apply to Dept.')}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </CardHeader>

                        {isExpanded && template.rules && (
                          <CardContent className="pt-0 border-t">
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-700">Included rules:</h4>
                              <div className="space-y-2">
                                {template.rules.map((rule, index) => {
                                  const formatted = formatRuleForDisplay(rule);
                                  return (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg text-sm"
                                    >
                                      <div className="flex items-center gap-3">
                                        <Badge
                                          variant="outline"
                                          className={`text-xs ${
                                            formatted.actionColor === 'green' ? 'border-green-300 text-green-700 bg-green-50' :
                                            formatted.actionColor === 'red' ? 'border-red-300 text-red-700 bg-red-50' :
                                            'border-gray-300 text-gray-700'
                                          }`}
                                        >
                                          {formatted.formattedAction}
                                        </Badge>
                                        <span className="text-gray-600">{formatted.formattedDirection}</span>
                                        <span className="font-mono text-gray-800">
                                          {formatted.formattedProtocol}
                                          {rule.port && `:${rule.port}`}
                                        </span>
                                      </div>
                                      {rule.description && (
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <Info className="h-4 w-4 text-gray-400" />
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p className="text-sm">{rule.description}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}

              {appliedTemplates.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium text-green-800">Active Templates in Department</h4>
                  </div>
                  <p className="text-xs text-green-700 mb-3">
                    These templates are applied to all VMs in department {departmentName}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {appliedTemplates.map((templateName) => {
                      const template = availableTemplates.find(t => t.template === templateName);
                      return (
                        <Badge key={templateName} variant="secondary" className="bg-green-100 text-green-800">
                          {template?.name || templateName}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Delete Confirmation Dialog */}
        <Dialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Delete Selected Rules
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedRules.size} selected firewall rule{selectedRules.size !== 1 ? 's' : ''} from the {departmentName} department?
                <br /><br />
                <span className="font-medium text-amber-700">
                  This action will affect all VMs in the department and cannot be undone.
                </span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowBulkDeleteDialog(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : `Delete ${selectedRules.size} rule${selectedRules.size !== 1 ? 's' : ''}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Single Rule Delete Confirmation Dialog */}
        <Dialog open={!!singleDeleteDialog} onOpenChange={(open) => !open && setSingleDeleteDialog(null)}>
          <DialogContent className="glass-strong">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Delete Firewall Rule
              </DialogTitle>
              <DialogDescription className="space-y-3">
                <p>
                  Are you sure you want to delete the rule <strong>"{singleDeleteDialog?.comment || singleDeleteDialog?.id}"</strong> from the {departmentName} department?
                </p>

                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Building className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm text-amber-800 dark:text-amber-200">
                        Department-wide Impact
                      </h4>
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        This action will affect all VMs in the {departmentName} department and cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>

                {singleDeleteDialog && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-gray-100">Rule Details:</h4>
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Direction:</span>
                        <Badge variant="outline" className="text-xs">
                          {normalizeDirection(singleDeleteDialog.direction) === 'inbound' ? '↓' : '↑'} {normalizeDirection(singleDeleteDialog.direction)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Action:</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            normalizeAction(singleDeleteDialog.action) === 'allow' ? 'border-green-300 text-green-700 bg-green-50 dark:bg-green-950/20' :
                            normalizeAction(singleDeleteDialog.action) === 'deny' ? 'border-red-300 text-red-700 bg-red-50 dark:bg-red-950/20' :
                            'border-gray-300 text-gray-700'
                          }`}
                        >
                          {normalizeAction(singleDeleteDialog.action)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Protocol:</span>
                        <span className="font-mono">{singleDeleteDialog.protocol?.toUpperCase() || 'Unknown'}</span>
                      </div>
                      {(singleDeleteDialog.dstPortStart || singleDeleteDialog.srcPortStart) && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Ports:</span>
                          <span className="font-mono">
                            {singleDeleteDialog.srcPortStart && `Src: ${singleDeleteDialog.srcPortStart}${singleDeleteDialog.srcPortStart !== singleDeleteDialog.srcPortEnd ? `-${singleDeleteDialog.srcPortEnd}` : ''} `}
                            {singleDeleteDialog.dstPortStart && `Dst: ${singleDeleteDialog.dstPortStart}${singleDeleteDialog.dstPortStart !== singleDeleteDialog.dstPortEnd ? `-${singleDeleteDialog.dstPortEnd}` : ''}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSingleDeleteDialog(null)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => confirmDeleteRule(singleDeleteDialog)}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete Rule'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rules Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{processedRules.length}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Allow</p>
                <p className="text-2xl font-bold text-green-600">
                  {processedRules.filter(r => normalizeAction(r.action) === 'allow').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inbound</p>
                <p className="text-2xl font-bold text-blue-600">
                  {processedRules.filter(r => normalizeDirection(r.direction) === 'inbound').length}
                </p>
              </div>
              <ArrowDown className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-red-600">
                  {processedRules.filter(r => calculateDeptRuleRisk(r).level === 'high').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DepartmentFirewallRulesSection;