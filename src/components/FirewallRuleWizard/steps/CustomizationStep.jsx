'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SelectionCard } from '@/components/ui/selection-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import {
  Target,
  Layers,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Building,
  Globe,
  AlertTriangle,
  Info,
  Zap,
  ArrowDown,
  Settings,
  Server
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateRiskLevel } from '@/utils/firewallHelpers';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:customization-step');

/**
 * CustomizationStep - Third step of the firewall wizard
 *
 * Provides basic customization with progressive disclosure of advanced options.
 * Uses everyday language for basic settings and shows technical details only
 * when needed. Includes real-time risk assessment and validation.
 *
 * @param {string} context - Context type ('department' or 'vm') for customizing text
 * @param {string} contextName - Name of the context for display
 */
export function CustomizationStep({ id, context = 'department', contextName }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};
  const allValues = values;
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Context-specific target options
  const getTargetOptions = () => {
    if (context === 'vm') {
      return [
        {
          value: 'all',
          title: 'Apply to this virtual machine',
          description: `Apply to all virtual machines in ${contextName}`,
          icon: Server,
          srcIp: null,
          dstIp: null
        },
        {
          value: 'specific',
          title: 'Specific addresses',
          description: 'Apply to specific IP addresses or ranges',
          icon: Target,
          srcIp: '',
          dstIp: ''
        },
        {
          value: 'external',
          title: 'External connections',
          description: 'Apply to any external source (internet)',
          icon: Globe,
          srcIp: '0.0.0.0/0',
          dstIp: null
        }
      ];
    }

    // Default to department context
    return [
      {
        value: 'all',
        title: 'All department computers',
        description: `Apply to all virtual machines in ${contextName}`,
        icon: Building,
        srcIp: null,
        dstIp: null
      },
      {
        value: 'specific',
        title: 'Specific computers',
        description: 'Apply to specific IP addresses or ranges',
        icon: Target,
        srcIp: '',
        dstIp: ''
      },
      {
        value: 'external',
        title: 'External connections',
        description: 'Apply to any external source (internet)',
        icon: Globe,
        srcIp: '0.0.0.0/0',
        dstIp: null
      }
    ];
  };

  const targetOptions = getTargetOptions();

  // Priority level options
  const priorityOptions = [
    {
      value: 150,
      label: 'High Priority',
      description: 'Processed first (100-200)',
      color: 'red'
    },
    {
      value: 500,
      label: 'Normal Priority',
      description: 'Standard processing (400-600)',
      color: 'blue'
    },
    {
      value: 850,
      label: 'Low Priority',
      description: 'Processed last (800-900)',
      color: 'gray'
    }
  ];

  // Calculate current risk level
  const getCurrentRisk = () => {
    if (!allValues.direction || !allValues.service) return null;

    const ruleData = {
      action: allValues.direction?.action,
      direction: allValues.direction?.direction,
      protocol: allValues.service?.protocol,
      port: allValues.service?.ports,
      srcIpAddr: stepValues.srcIpAddr,
      dstIpAddr: stepValues.dstIpAddr,
      priority: stepValues.priority
    };

    return calculateRiskLevel(ruleData);
  };

  const riskAssessment = getCurrentRisk();

  const handleTargetSelect = (targetValue) => {
    const target = targetOptions.find(t => t.value === targetValue);
    if (target) {
      debug.info('Target selected', {
        targetValue,
        targetTitle: target.title,
        srcIp: target.srcIp,
        dstIp: target.dstIp,
        context
      });
      setValue(`${id}.targetType`, targetValue);
      setValue(`${id}.srcIpAddr`, target.srcIp);
      setValue(`${id}.dstIpAddr`, target.dstIp);
    }
  };

  const handlePrioritySelect = (priority) => {
    debug.info('Priority selected', { priority, context });
    setValue(`${id}.priority`, parseInt(priority, 10));
  };

  const suggestCommonIPs = () => [
    { ip: '192.168.1.0/24', description: 'Local network (192.168.1.x)' },
    { ip: '10.0.0.0/8', description: 'Private network (10.x.x.x)' },
    { ip: '172.16.0.0/12', description: 'Private network (172.16-31.x.x)' },
    { ip: '0.0.0.0/0', description: 'Any address (internet)' }
  ];

  return (
    <div className="space-y-8">
      {/* Basic Customization */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">
            Customize Your Rule
          </h3>
          <p className="text-muted-foreground">
            Fine-tune who this rule applies to and when it runs
          </p>
        </div>

        {/* Target Selection */}
        <Card
          className="p-6 bg-background/50 border border-border/30"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-base font-semibold">
                  Which {context === 'vm' ? 'addresses' : 'computers'} should this apply to?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Choose the scope of this firewall rule
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {targetOptions.map((option) => {
                const IconComponent = option.icon;
                const isSelected = stepValues.targetType === option.value;

                return (
                  <SelectionCard
                    key={option.value}
                    selected={isSelected}
                    onSelect={() => handleTargetSelect(option.value)}
                    selectionIndicator
                    className="p-4 bg-background/40 border border-border/30"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <IconComponent className={cn(
                          "h-4 w-4",
                          isSelected ? "text-primary" : "text-muted-foreground"
                        )} />
                        <span className={cn(
                          "font-medium text-sm",
                          isSelected ? "text-primary" : "text-foreground"
                        )}>{option.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </SelectionCard>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Priority Selection */}
        <Card
          className="p-6 bg-background/50 border border-border/30"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Layers className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-base font-semibold">Priority Level</h4>
                <p className="text-sm text-muted-foreground">
                  How important is this rule compared to others?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {priorityOptions.map((option) => {
                const isSelected = stepValues.priority === option.value;

                return (
                  <SelectionCard
                    key={option.value}
                    selected={isSelected}
                    onSelect={() => handlePrioritySelect(option.value)}
                    selectionIndicator
                    className="p-4 bg-background/40 border border-border/30"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          isSelected ? "bg-primary" : (
                            option.color === 'red' ? "bg-destructive" :
                            option.color === 'blue' ? "bg-primary" : "bg-muted-foreground"
                          )
                        )} />
                        <span className={cn(
                          "font-medium text-sm",
                          isSelected ? "text-primary" : "text-foreground"
                        )}>{option.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </SelectionCard>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Description */}
        <Card
          className="p-6 bg-background/50 border border-border/30"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="text-base font-semibold">Add a Description (Optional)</h4>
                <p className="text-sm text-muted-foreground">
                  Help others understand what this rule is for
                </p>
              </div>
            </div>

            <Textarea
              placeholder={context === 'vm' ?
                "e.g., Allow web access for this VM, Block SSH access from external sources" :
                "e.g., Allow web access for marketing team, Block social media during work hours"
              }
              value={stepValues.comment || ''}
              onChange={(e) => setValue(`${id}.comment`, e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </Card>
      </div>

      {/* Advanced Options */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            Advanced Options
            {showAdvanced ? (
              <ChevronDown className="h-4 w-4 ml-2" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-2" />
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-4 mt-4">
          <Card
            className="p-6 bg-background/60 border border-border/40"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold">Advanced Configuration</h4>
                <p className="text-sm text-muted-foreground">
                  For power users who need precise control over IP addresses and priorities
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Source IP */}
                <div className="space-y-2">
                  <Label htmlFor="srcIpAddr">Source IP Address</Label>
                  <Input
                    id="srcIpAddr"
                    placeholder="e.g., 192.168.1.0/24 or leave empty for any"
                    value={stepValues.srcIpAddr || ''}
                    onChange={(e) => setValue(`${id}.srcIpAddr`, e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Where connections come from (leave empty for any source)
                  </p>
                  {getError('srcIpAddr') && (
                    <p className="text-sm text-destructive">{getError('srcIpAddr')}</p>
                  )}
                </div>

                {/* Destination IP */}
                <div className="space-y-2">
                  <Label htmlFor="dstIpAddr">Destination IP Address</Label>
                  <Input
                    id="dstIpAddr"
                    placeholder="e.g., 192.168.1.100 or leave empty for any"
                    value={stepValues.dstIpAddr || ''}
                    onChange={(e) => setValue(`${id}.dstIpAddr`, e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Where connections go to (leave empty for any destination)
                  </p>
                  {getError('dstIpAddr') && (
                    <p className="text-sm text-destructive">{getError('dstIpAddr')}</p>
                  )}
                </div>
              </div>

              {/* Common IP suggestions */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Common IP ranges:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {suggestCommonIPs().map((suggestion) => (
                    <button
                      key={suggestion.ip}
                      type="button"
                      className="text-left text-xs px-3 py-2 rounded bg-muted hover:bg-muted/80 transition-colors"
                      onClick={() => setValue(`${id}.srcIpAddr`, suggestion.ip)}
                    >
                      <div className="font-mono">{suggestion.ip}</div>
                      <div className="text-muted-foreground">{suggestion.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Priority */}
              <div className="space-y-2">
                <Label htmlFor="customPriority">Custom Priority (1-1000)</Label>
                <Input
                  id="customPriority"
                  type="number"
                  min="1"
                  max="1000"
                  placeholder="500"
                  value={stepValues.priority || ''}
                  onChange={(e) => setValue(`${id}.priority`, parseInt(e.target.value, 10) || 500)}
                />
                <p className="text-xs text-muted-foreground">
                  Lower numbers = higher priority. Use 1-200 for critical rules, 800-1000 for low priority.
                </p>
                {getError('priority') && (
                  <p className="text-sm text-destructive">{getError('priority')}</p>
                )}
              </div>
            </div>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Risk Assessment */}
      {riskAssessment && (
        <Card
          className={cn(
            "p-6 border",
            riskAssessment.level === 'high' && "border-destructive/50 bg-destructive/5",
            riskAssessment.level === 'medium' && "border-warning/50 bg-warning/5",
            riskAssessment.level === 'low' && "border-success/50 bg-success/5"
          )}
        >
          <div className="flex items-start gap-3">
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center",
              riskAssessment.level === 'high' && "bg-destructive/20",
              riskAssessment.level === 'medium' && "bg-warning/20",
              riskAssessment.level === 'low' && "bg-success/20"
            )}>
              {riskAssessment.level === 'high' && <AlertTriangle className="h-5 w-5 text-destructive" />}
              {riskAssessment.level === 'medium' && <Zap className="h-5 w-5 text-warning" />}
              {riskAssessment.level === 'low' && <Info className="h-5 w-5 text-success" />}
            </div>
            <div className="flex-1">
              <h4 className={cn(
                "font-semibold",
                riskAssessment.level === 'high' && "text-destructive",
                riskAssessment.level === 'medium' && "text-warning",
                riskAssessment.level === 'low' && "text-success"
              )}>
                {riskAssessment.level === 'high' && 'High Risk Configuration'}
                {riskAssessment.level === 'medium' && 'Medium Risk Configuration'}
                {riskAssessment.level === 'low' && 'Low Risk Configuration'}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {riskAssessment.explanation}
              </p>
              {riskAssessment.recommendations && riskAssessment.recommendations.length > 0 && (
                <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
                  {riskAssessment.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}