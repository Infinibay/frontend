import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Info,
  AlertTriangle,
  CheckCircle,
  Circle,
  Building,
  HelpCircle,
  X,
  Clock,
  Zap,
  Target,
  Network,
  Globe,
  Lock,
  Loader2
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
import { Textarea } from '@components/ui/textarea';
import { Switch } from '@components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import {
  useCreateFilterRuleMutation,
  useDeleteFilterRuleMutation,
  useCreateFilterMutation
} from '@/gql/hooks';
import { useToast } from '@/hooks/use-toast';
import {
  formatRuleForDisplay,
  validateRule,
  calculateRiskLevel,
  sortRulesByPriority,
  filterRules,
  isValidPort,
  isValidIP,
  denormalizeAction,
  denormalizeDirection,
  normalizeAction,
  normalizeDirection,
  COMMON_SERVICES,
  ACTIONS,
  DIRECTIONS,
  PROTOCOLS,
  getProtocolPortSuggestions,
  getPortDescription,
  validatePortRange,
  validateIPAddress,
  validatePriority,
  validateRuleCombination,
  getValidationSuggestions,
  suggestPortsForService,
  suggestPriorityForRule,
  getCommonIPRanges,
  generateRulePreview,
  detectRuleConflicts,
  getRiskExplanation,
  getSuggestedAlternatives,
  isHighRiskCombination,
  getFieldDependencies,
  shouldDisablePortFields,
  getConditionalFields,
  getFieldPlaceholders,
  getFieldTooltips,
  getProtocolExplanation,
  getDirectionExplanation,
  getActionExplanation,
  getPortExplanation,
  getIPExplanation
} from '@/utils/firewallHelpers';

const DepartmentFirewallRulesSection = ({
  customRules = [],
  effectiveRules = [],
  departmentFilters = [],
  departmentId,
  departmentName,
  onRuleChange
}) => {
  // Limit to safe subset of actions and directions for department rules
  const SUPPORTED_ACTION_KEYS = ['allow', 'deny', 'reject'];
  const SUPPORTED_DIRECTION_KEYS = ['inbound', 'outbound'];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [showAll, setShowAll] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  // Enhanced form state with validation
  const { toast } = useToast();
  const [fieldValidation, setFieldValidation] = useState({});
  const [showPortSuggestions, setShowPortSuggestions] = useState(false);
  const [showRulePreview, setShowRulePreview] = useState(false);
  const [ruleConflicts, setRuleConflicts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form setup with validation rules
  const form = useForm({
    defaultValues: {
      name: '',
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
      comment: '',
      priority: 500
    },
    mode: 'onChange',
    resolver: undefined // We'll use custom validation
  });

  const watchedValues = form.watch();
  const formState = form.formState;

  // Get available tooltips and suggestions
  const tooltips = getFieldTooltips();
  const protocolSuggestions = getProtocolPortSuggestions(watchedValues.protocol);
  const commonIpRanges = getCommonIPRanges();
  const fieldDependencies = getFieldDependencies(watchedValues);
  const conditionalFields = getConditionalFields(watchedValues.action);

  const [createFilterRule, { loading: createRuleLoading }] = useCreateFilterRuleMutation();
  const [deleteFilterRule, { loading: deleteRuleLoading }] = useDeleteFilterRuleMutation();
  const [createFilter, { loading: createFilterLoading }] = useCreateFilterMutation();

  const isLoading = createRuleLoading || deleteRuleLoading || createFilterLoading;

  // Determine which rules to display
  const displayRules = showAll ? effectiveRules : customRules;

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

  const resetForm = () => {
    form.reset();
    setSelectedService('');
    setFieldValidation({});
    setShowPortSuggestions(false);
    setShowRulePreview(false);
    setRuleConflicts([]);
  };

  // Real-time validation effect - simplified to prevent infinite loops
  useEffect(() => {
    const newValidation = {};

    // Validate ports
    if (watchedValues.srcPortStart) {
      newValidation.srcPortStart = validatePortRange(watchedValues.srcPortStart);
    }

    if (watchedValues.srcPortEnd) {
      newValidation.srcPortEnd = validatePortRange(watchedValues.srcPortEnd);
      // Check if end port is provided without start port
      if (watchedValues.srcPortEnd && !watchedValues.srcPortStart) {
        newValidation.srcPortEnd = {
          isValid: false,
          error: 'Source port start is required when end port is specified'
        };
      }
    }

    if (watchedValues.dstPortStart) {
      newValidation.dstPortStart = validatePortRange(watchedValues.dstPortStart);
    }

    if (watchedValues.dstPortEnd) {
      newValidation.dstPortEnd = validatePortRange(watchedValues.dstPortEnd);
      // Check if end port is provided without start port
      if (watchedValues.dstPortEnd && !watchedValues.dstPortStart) {
        newValidation.dstPortEnd = {
          isValid: false,
          error: 'Destination port start is required when end port is specified'
        };
      }
    }

    // Validate IPs
    if (watchedValues.srcIpAddr) {
      const fullIp = watchedValues.srcIpAddr + (watchedValues.srcIpMask ? `/${watchedValues.srcIpMask}` : '');
      newValidation.srcIpAddr = validateIPAddress(fullIp);
    }

    // Check for mask without IP
    if (watchedValues.srcIpMask && !watchedValues.srcIpAddr) {
      newValidation.srcIpMask = {
        isValid: false,
        error: 'Source IP address is required when mask is specified'
      };
    }

    if (watchedValues.dstIpAddr) {
      const fullIp = watchedValues.dstIpAddr + (watchedValues.dstIpMask ? `/${watchedValues.dstIpMask}` : '');
      newValidation.dstIpAddr = validateIPAddress(fullIp);
    }

    // Check for mask without IP
    if (watchedValues.dstIpMask && !watchedValues.dstIpAddr) {
      newValidation.dstIpMask = {
        isValid: false,
        error: 'Destination IP address is required when mask is specified'
      };
    }

    // Validate priority
    if (watchedValues.priority) {
      newValidation.priority = validatePriority(watchedValues.priority);
    }

    // Create normalized rule for conflict detection
    const normalizedRule = {
      ...watchedValues,
      action: normalizeAction(watchedValues.action),
      direction: normalizeDirection(watchedValues.direction),
      protocol: watchedValues.protocol
    };

    // Check for rule conflicts
    const conflicts = detectRuleConflicts(normalizedRule, customRules);
    setRuleConflicts(conflicts);

    setFieldValidation(newValidation);
  }, [watchedValues.srcPortStart, watchedValues.srcPortEnd, watchedValues.dstPortStart, watchedValues.dstPortEnd,
      watchedValues.srcIpAddr, watchedValues.srcIpMask, watchedValues.dstIpAddr, watchedValues.dstIpMask,
      watchedValues.priority, watchedValues.action, watchedValues.direction, watchedValues.protocol, customRules]);

  // Protocol change effect
  useEffect(() => {
    if (watchedValues.protocol === 'icmp') {
      form.setValue('srcPortStart', '');
      form.setValue('srcPortEnd', '');
      form.setValue('dstPortStart', '');
      form.setValue('dstPortEnd', '');
    }
  }, [watchedValues.protocol]);

  const validateDepartmentRule = (formData) => {
    const errors = [];
    const warnings = [];

    // Check required fields
    if (!formData.direction) errors.push('Direction is required');
    if (!formData.action) errors.push('Action is required');
    if (!formData.protocol) errors.push('Protocol is required');

    // Enhanced port validation
    if (formData.srcPortStart) {
      const validation = validatePortRange(formData.srcPortStart);
      if (!validation.isValid) errors.push(`Source port start: ${validation.error}`);
      if (validation.warning) warnings.push(`Source port start: ${validation.warning}`);
    }
    if (formData.srcPortEnd) {
      const validation = validatePortRange(formData.srcPortEnd);
      if (!validation.isValid) errors.push(`Source port end: ${validation.error}`);
      if (validation.warning) warnings.push(`Source port end: ${validation.warning}`);
      // Check if end port is provided without start port
      if (!formData.srcPortStart) {
        errors.push('Source port start is required when source port end is specified');
      }
    }
    if (formData.dstPortStart) {
      const validation = validatePortRange(formData.dstPortStart);
      if (!validation.isValid) errors.push(`Destination port start: ${validation.error}`);
      if (validation.warning) warnings.push(`Destination port start: ${validation.warning}`);
    }
    if (formData.dstPortEnd) {
      const validation = validatePortRange(formData.dstPortEnd);
      if (!validation.isValid) errors.push(`Destination port end: ${validation.error}`);
      if (validation.warning) warnings.push(`Destination port end: ${validation.warning}`);
      // Check if end port is provided without start port
      if (!formData.dstPortStart) {
        errors.push('Destination port start is required when destination port end is specified');
      }
    }

    // Validate port ranges (start <= end)
    if (formData.srcPortStart && formData.srcPortEnd) {
      const srcStart = parseInt(formData.srcPortStart);
      const srcEnd = parseInt(formData.srcPortEnd);
      if (srcStart > srcEnd) {
        errors.push('Source port start must be less than or equal to end');
      }
    }
    if (formData.dstPortStart && formData.dstPortEnd) {
      const dstStart = parseInt(formData.dstPortStart);
      const dstEnd = parseInt(formData.dstPortEnd);
      if (dstStart > dstEnd) {
        errors.push('Destination port start must be less than or equal to end');
      }
    }

    // Enhanced IP validation
    if (formData.srcIpAddr) {
      const fullIp = formData.srcIpAddr + (formData.srcIpMask ? `/${formData.srcIpMask}` : '');
      const validation = validateIPAddress(fullIp);
      if (!validation.isValid) errors.push(`Source IP: ${validation.error}`);
      if (validation.warning) warnings.push(`Source IP: ${validation.warning}`);
    }
    // Check for mask without IP
    if (formData.srcIpMask && !formData.srcIpAddr) {
      errors.push('Source IP address is required when source mask is specified');
    }

    if (formData.dstIpAddr) {
      const fullIp = formData.dstIpAddr + (formData.dstIpMask ? `/${formData.dstIpMask}` : '');
      const validation = validateIPAddress(fullIp);
      if (!validation.isValid) errors.push(`Destination IP: ${validation.error}`);
      if (validation.warning) warnings.push(`Destination IP: ${validation.warning}`);
    }
    // Check for mask without IP
    if (formData.dstIpMask && !formData.dstIpAddr) {
      errors.push('Destination IP address is required when destination mask is specified');
    }

    // Priority validation
    if (formData.priority) {
      const validation = validatePriority(formData.priority);
      if (!validation.isValid) errors.push(`Priority: ${validation.error}`);
    }

    // Rule combination warnings
    const combinationWarnings = validateRuleCombination(formData);
    warnings.push(...combinationWarnings.map(w => w.message));

    // Conflict detection with normalized rule
    const normalizedFormData = {
      ...formData,
      action: normalizeAction(formData.action),
      direction: normalizeDirection(formData.direction)
    };
    const conflicts = detectRuleConflicts(normalizedFormData, customRules);
    if (conflicts.length > 0) {
      warnings.push(...conflicts.map(c => c.message));
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const handleServiceSelect = (serviceKey) => {
    const service = COMMON_SERVICES[serviceKey];
    if (service) {
      const firstPort = service.ports[0];
      form.setValue('name', `${service.name} - ${firstPort.name}`);
      form.setValue('dstPortStart', firstPort.port.toString());
      form.setValue('dstPortEnd', firstPort.port.toString());
      form.setValue('protocol', firstPort.protocol);
      form.setValue('comment', service.description);

      // Auto-suggest priority based on service
      const prioritySuggestion = suggestPriorityForRule({
        action: watchedValues.action,
        port: firstPort.port
      });
      form.setValue('priority', prioritySuggestion.priority);

      toast({
        title: 'Service Template Applied',
        description: `Configuration for ${service.name} has been applied to the form.`,
        variant: 'default'
      });
    }
    setSelectedService(serviceKey);
  };

  const handlePortSuggestionClick = (port) => {
    form.setValue('dstPortStart', port.port);
    form.setValue('dstPortEnd', port.port);

    const description = getPortDescription(port.port, watchedValues.protocol);
    if (description && !watchedValues.comment) {
      form.setValue('comment', `Allow ${description}`);
    }

    toast({
      title: 'Port Applied',
      description: `Port ${port.port} (${port.name}) has been applied.`,
      variant: 'default'
    });
  };

  const handleIpSuggestionClick = (ipRange) => {
    const [ip, mask] = ipRange.ip.split('/');
    form.setValue('srcIpAddr', ip);
    if (mask) {
      form.setValue('srcIpMask', mask);
    }

    toast({
      title: 'IP Range Applied',
      description: `${ipRange.name} (${ipRange.ip}) has been applied.`,
      variant: 'default'
    });
  };

  const handleCreateRule = async (formData) => {
    setIsSubmitting(true);

    try {
      const validation = validateDepartmentRule(formData);

      // Show warnings but allow continuation
      if (validation.warnings.length > 0) {
        toast({
          title: 'Rule Warnings',
          description: validation.warnings.join('; '),
          variant: 'default'
        });
      }

      if (!validation.isValid) {
        toast({
          title: 'Validation Failed',
          description: validation.errors.join('; '),
          variant: 'destructive'
        });
        return;
      }

      // Check for high-risk combinations and ask for confirmation
      if (isHighRiskCombination(formData)) {
        const confirmed = window.confirm(
          'This rule configuration poses a security risk. Are you sure you want to proceed?\n\n' +
          'Consider reviewing the suggested alternatives in the risk assessment.'
        );
        if (!confirmed) {
          return;
        }
      }

      // First, create a custom filter for this department if it doesn't exist
      let customFilterId = null;
      const customFilter = departmentFilters.find(f => f.name === `${departmentName}_custom_rules`);

      if (customFilter) {
        customFilterId = customFilter.id;
      } else {
        const createFilterResult = await createFilter({
          variables: {
            input: {
              name: `${departmentName}_custom_rules`,
              description: `Custom rules for department ${departmentName}`,
              type: 'DEPARTMENT',
              departmentId: departmentId
            }
          }
        });
        customFilterId = createFilterResult.data.createFilter.id;
      }

      // Create the rule in the custom filter using denormalization
      await createFilterRule({
        variables: {
          filterId: customFilterId,
          input: {
            protocol: formData.protocol.toUpperCase(),
            direction: denormalizeDirection(formData.direction).toUpperCase(),
            action: denormalizeAction(formData.action).toUpperCase(),
            priority: parseInt(formData.priority),
            ipVersion: 'IPv4',
            srcIpAddr: formData.srcIpAddr || null,
            srcIpMask: formData.srcIpMask || null,
            dstIpAddr: formData.dstIpAddr || null,
            dstIpMask: formData.dstIpMask || null,
            srcPortStart: formData.srcPortStart ? parseInt(formData.srcPortStart) : null,
            srcPortEnd: formData.srcPortEnd ? parseInt(formData.srcPortEnd) : null,
            dstPortStart: formData.dstPortStart ? parseInt(formData.dstPortStart) : null,
            dstPortEnd: formData.dstPortEnd ? parseInt(formData.dstPortEnd) : null,
            comment: formData.comment || null,
          }
        }
      });

      toast({
        title: 'Rule Created Successfully',
        description: `Department firewall rule has been created and will be applied to all VMs in ${departmentName}.`,
        variant: 'default'
      });

      setIsCreateDialogOpen(false);
      resetForm();
      if (onRuleChange) onRuleChange();
    } catch (error) {
      console.error('Error creating department rule:', error);
      toast({
        title: 'Error Creating Rule',
        description: error.message || 'Failed to create the firewall rule. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRule = async (rule) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the rule "${rule.comment || rule.id}"?\n\n` +
      `This action will affect all VMs in the ${departmentName} department and cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteFilterRule({
        variables: { id: rule.id }
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

            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Dept. Rule
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Create New Rule for Department
                  </DialogTitle>
                  <DialogDescription>
                    Configure a new custom rule that will be applied to all VMs in the <strong>{departmentName}</strong> department.
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                <div className="space-y-6">
                  {/* Department Warning */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Building className="h-4 w-4 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-amber-800 font-medium">Department-Level Impact</p>
                        <p className="text-xs text-amber-700">
                          This rule will be automatically applied to all VMs in department {departmentName}.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Service Template Selection */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Quick Setup - Service Template (Optional)
                    </Label>
                    <p className="text-sm text-gray-600 mb-3">Choose a common service to auto-configure ports and settings</p>
                    <Select value={selectedService} onValueChange={handleServiceSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a common service..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(COMMON_SERVICES).map(([key, service]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center justify-between w-full">
                              <span>{service.name}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                {service.ports.map(p => p.port).join(', ')}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Basic Rule Configuration */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="direction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Direction *
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-md">
                                <p>{tooltips.direction.content}</p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className={fieldValidation.direction?.isValid === false ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select direction..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(DIRECTIONS)
                                .filter(([k]) => SUPPORTED_DIRECTION_KEYS.includes(k))
                                .map(([key, dir]) => (
                                  <SelectItem key={key} value={key}>
                                    <div className="flex items-center gap-2">
                                      <span>{dir.icon}</span>
                                      <div>
                                        <div>{dir.name}</div>
                                        <div className="text-xs text-gray-500">{dir.description}</div>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="action"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Action *
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-md">
                                <p>{tooltips.action.content}</p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select action..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(ACTIONS)
                                .filter(([k]) => SUPPORTED_ACTION_KEYS.includes(k))
                                .map(([key, action]) => (
                                  <SelectItem key={key} value={key}>
                                    <div className="flex items-center gap-2">
                                      <span>{action.icon}</span>
                                      <div>
                                        <div>{action.name}</div>
                                        <div className="text-xs text-gray-500">{action.description}</div>
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="protocol"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Protocol *
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-md">
                                <p>{tooltips.protocol.content}</p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select protocol..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(PROTOCOLS).map(([key, protocol]) => (
                                <SelectItem key={key} value={key}>
                                  <div>
                                    <div>{protocol.name}</div>
                                    <div className="text-xs text-gray-500">{protocol.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            Priority
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-md">
                                <p>{tooltips.priority.content}</p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder={getFieldPlaceholders('priority')}
                              min="1"
                              max="1000"
                              className={fieldValidation.priority?.isValid === false ? 'border-red-500' :
                                        fieldValidation.priority?.isValid === true ? 'border-green-500' : ''}
                              {...field}
                            />
                          </FormControl>
                          {fieldValidation.priority?.error && (
                            <FormDescription className="text-red-600">
                              {fieldValidation.priority.error}
                            </FormDescription>
                          )}
                          {fieldValidation.priority?.info && (
                            <FormDescription className="text-blue-600">
                              {fieldValidation.priority.info}
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Port Configuration */}
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Network className="h-4 w-4" />
                      Port Configuration
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-md">
                          <p>{tooltips.port.content}</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>

                    {/* Protocol-specific port suggestions */}
                    {protocolSuggestions.length > 0 && !shouldDisablePortFields(watchedValues.protocol) && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-blue-800">Common {watchedValues.protocol?.toUpperCase()} Ports</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPortSuggestions(!showPortSuggestions)}
                          >
                            {showPortSuggestions ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                        </div>
                        {showPortSuggestions && (
                          <div className="flex flex-wrap gap-2">
                            {protocolSuggestions.slice(0, 8).map((port) => (
                              <Button
                                key={port.port}
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handlePortSuggestionClick(port)}
                                className="text-xs h-8"
                              >
                                {port.port} - {port.name}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {shouldDisablePortFields(watchedValues.protocol) && (
                      <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <Info className="h-4 w-4 inline mr-1" />
                          ICMP protocol doesn't use ports. Port fields are disabled.
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <FormField
                        control={form.control}
                        name="srcPortStart"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Source Port Start</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={getFieldPlaceholders('port', watchedValues)}
                                disabled={shouldDisablePortFields(watchedValues.protocol)}
                                className={fieldValidation.srcPortStart?.isValid === false ? 'border-red-500' :
                                          fieldValidation.srcPortStart?.isValid === true ? 'border-green-500' : ''}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="srcPortEnd"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Source Port End</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={getFieldPlaceholders('port', watchedValues)}
                                disabled={shouldDisablePortFields(watchedValues.protocol)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dstPortStart"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Destination Port Start</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={getFieldPlaceholders('port', watchedValues)}
                                disabled={shouldDisablePortFields(watchedValues.protocol)}
                                className={fieldValidation.dstPortStart?.isValid === false ? 'border-red-500' :
                                          fieldValidation.dstPortStart?.isValid === true ? 'border-green-500' : ''}
                                {...field}
                              />
                            </FormControl>
                            {fieldValidation.dstPortStart?.error && (
                              <FormDescription className="text-red-600 text-xs">
                                {fieldValidation.dstPortStart.error}
                              </FormDescription>
                            )}
                            {fieldValidation.dstPortStart?.warning && (
                              <FormDescription className="text-orange-600 text-xs">
                                {fieldValidation.dstPortStart.warning}
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dstPortEnd"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Destination Port End</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={getFieldPlaceholders('port', watchedValues)}
                                disabled={shouldDisablePortFields(watchedValues.protocol)}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* IP Configuration */}
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      IP Configuration
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-md">
                          <div>
                            <p className="mb-2">{tooltips.sourceIp.content}</p>
                            <p>{tooltips.destinationIp.content}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </Label>

                    {/* IP range suggestions */}
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-800 mb-2">Common IP Ranges</p>
                      <div className="flex flex-wrap gap-2">
                        {commonIpRanges.slice(0, 4).map((range) => (
                          <Button
                            key={range.ip}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleIpSuggestionClick(range)}
                            className="text-xs h-8"
                          >
                            {range.name} ({range.ip})
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-2">
                      <FormField
                        control={form.control}
                        name="srcIpAddr"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Source IP</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={getFieldPlaceholders('sourceIp')}
                                className={fieldValidation.srcIpAddr?.isValid === false ? 'border-red-500' :
                                          fieldValidation.srcIpAddr?.isValid === true ? 'border-green-500' : ''}
                                {...field}
                              />
                            </FormControl>
                            {fieldValidation.srcIpAddr?.error && (
                              <FormDescription className="text-red-600 text-xs">
                                {fieldValidation.srcIpAddr.error}
                              </FormDescription>
                            )}
                            {fieldValidation.srcIpAddr?.warning && (
                              <FormDescription className="text-orange-600 text-xs">
                                {fieldValidation.srcIpAddr.warning}
                              </FormDescription>
                            )}
                            {fieldValidation.srcIpAddr?.info && (
                              <FormDescription className="text-blue-600 text-xs">
                                {fieldValidation.srcIpAddr.info}
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="srcIpMask"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Source Mask</FormLabel>
                            <FormControl>
                              <Input placeholder="24" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dstIpAddr"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Destination IP</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={getFieldPlaceholders('destinationIp')}
                                className={fieldValidation.dstIpAddr?.isValid === false ? 'border-red-500' :
                                          fieldValidation.dstIpAddr?.isValid === true ? 'border-green-500' : ''}
                                {...field}
                              />
                            </FormControl>
                            {fieldValidation.dstIpAddr?.error && (
                              <FormDescription className="text-red-600 text-xs">
                                {fieldValidation.dstIpAddr.error}
                              </FormDescription>
                            )}
                            {fieldValidation.dstIpAddr?.warning && (
                              <FormDescription className="text-orange-600 text-xs">
                                {fieldValidation.dstIpAddr.warning}
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dstIpMask"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Destination Mask</FormLabel>
                            <FormControl>
                              <Input placeholder="8" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description/Comment</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={getFieldPlaceholders('description')}
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Describe what this rule does and why it's needed for the department.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Rule Preview and Risk Assessment */}
                  {Object.keys(watchedValues).some(key => watchedValues[key]) && (
                    <div className="space-y-4">
                      {/* Rule Preview */}
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Rule Preview
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowRulePreview(!showRulePreview)}
                          >
                            {showRulePreview ? 'Hide' : 'Show'}
                          </Button>
                        </div>
                        {showRulePreview && (
                          <div className="bg-white p-3 rounded border">
                            <p className="text-sm font-mono">
                              {generateRulePreview(watchedValues)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Risk Assessment */}
                      {(watchedValues.action && watchedValues.direction) && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <Label className="flex items-center gap-2 text-yellow-800 font-medium">
                            <AlertTriangle className="h-4 w-4" />
                            Security Risk Assessment
                          </Label>
                          <div className="mt-2 space-y-3">
                            {/* Risk Level and Explanation */}
                            {(() => {
                              const normalizedRule = {
                                ...watchedValues,
                                action: normalizeAction(watchedValues.action),
                                direction: normalizeDirection(watchedValues.direction)
                              };
                              const riskLevel = calculateRiskLevel(normalizedRule);
                              const riskExplanation = getRiskExplanation(riskLevel);

                              return (
                                <div className="bg-white p-3 rounded border">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge
                                      variant="outline"
                                      className={`${
                                        riskLevel.color === 'red' ? 'border-red-500 text-red-700 bg-red-50' :
                                        riskLevel.color === 'orange' ? 'border-orange-500 text-orange-700 bg-orange-50' :
                                        riskLevel.color === 'yellow' ? 'border-yellow-500 text-yellow-700 bg-yellow-50' :
                                        riskLevel.color === 'green' ? 'border-green-500 text-green-700 bg-green-50' :
                                        'border-blue-500 text-blue-700 bg-blue-50'
                                      }`}
                                    >
                                      {riskLevel.label} Risk
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-700 mb-2">{riskExplanation.description}</p>
                                  <div className="text-xs text-gray-600">
                                    <strong>Recommendations:</strong>
                                    <ul className="list-disc list-inside mt-1 space-y-1">
                                      {riskExplanation.recommendations.map((rec, index) => (
                                        <li key={index}>{rec}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Rule Combination Warnings */}
                            {validateRuleCombination(watchedValues).map((warning, index) => (
                              <div key={index} className="text-sm text-yellow-700">
                                <strong>{warning.type === 'danger' ? '⚠️' : 'ℹ️'}</strong> {warning.message}
                                {warning.suggestion && (
                                  <div className="text-xs text-yellow-600 mt-1 ml-4">
                                    💡 {warning.suggestion}
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* High Risk Alternatives */}
                            {(() => {
                              const normalizedRule = {
                                ...watchedValues,
                                action: normalizeAction(watchedValues.action),
                                direction: normalizeDirection(watchedValues.direction)
                              };
                              if (isHighRiskCombination(normalizedRule)) {
                                const alternatives = getSuggestedAlternatives(normalizedRule);
                                if (alternatives.length > 0) {
                                  return (
                                    <div className="border-t border-yellow-300 pt-3 mt-3">
                                      <p className="text-sm font-medium text-yellow-800 mb-2">⚡ Suggested Safer Alternatives:</p>
                                      {alternatives.map((alt, index) => (
                                        <div key={index} className="bg-white p-2 rounded border text-xs mb-2">
                                          <strong className="text-green-700">{alt.title}:</strong>
                                          <p className="text-gray-600 mt-1">{alt.description}</p>
                                          {alt.example && (
                                            <p className="text-blue-600 mt-1">
                                              <em>Example: {alt.example}</em>
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  );
                                }
                              }
                              return null;
                            })()}

                            {/* Rule Conflicts */}
                            {ruleConflicts.length > 0 && (
                              <div className="border-t border-yellow-300 pt-2 mt-2">
                                <p className="text-sm font-medium text-yellow-800">🔍 Rule Conflicts:</p>
                                {ruleConflicts.map((conflict, index) => (
                                  <div key={index} className="text-sm text-yellow-700 ml-4">
                                    • {conflict.message}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                </Form>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={form.handleSubmit(handleCreateRule)}
                    disabled={isLoading || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Dept. Rule'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Department Rule
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
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