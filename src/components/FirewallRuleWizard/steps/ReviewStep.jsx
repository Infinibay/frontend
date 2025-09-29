'use client';

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useWizardContext } from '@/components/ui/wizard';
import {
  CheckCircle,
  AlertTriangle,
  Shield,
  ChevronDown,
  ChevronRight,
  Building,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Info,
  Loader2,
  Server
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  generateRuleDescription,
  calculateRiskLevel,
  denormalizeAction,
  denormalizeDirection
} from '@/utils/firewallHelpers';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:review-step');

/**
 * ReviewStep - Final step of the firewall wizard
 *
 * Displays a comprehensive summary in plain language with technical details
 * in collapsible sections. Shows risk assessment, context impact warnings,
 * and conflict detection results.
 *
 * @param {string} context - Context type ('department' or 'vm') for customizing text
 * @param {string} contextName - Name of the context for display
 * @param {Array} contextFilters - Existing filters for conflict detection
 * @param {boolean} isCreating - Whether the rule is currently being created
 */
export function ReviewStep({ id, context = 'department', contextName, contextFilters = [], isCreating = false }) {
  const { setValue, values } = useWizardContext();
  const stepValues = values[id] || {};
  const [showTechnical, setShowTechnical] = React.useState(false);
  const [confirmed, setConfirmed] = React.useState(false);

  // Store confirmation state for wizard
  React.useEffect(() => {
    setValue(`${id}.confirmed`, confirmed);
    debug.info('Confirmation state changed', { confirmed, context });
  }, [confirmed, setValue, id]);

  // Build complete rule data for analysis
  const ruleData = useMemo(() => {
    if (!values.direction || !values.service) return null;

    const data = {
      action: denormalizeAction(values.direction.action),
      direction: denormalizeDirection(values.direction.direction),
      protocol: values.service.protocol,
      port: values.service.ports,
      srcIpAddr: values.customization?.srcIpAddr || null,
      dstIpAddr: values.customization?.dstIpAddr || null,
      priority: values.customization?.priority || 500,
      comment: values.customization?.comment || null
    };

    debug.info('Rule data calculated for review', { data, context });
    return data;
  }, [values]);

  // Generate rule preview
  const rulePreview = useMemo(() => {
    if (!ruleData) return null;
    return generateRuleDescription(ruleData);
  }, [ruleData]);

  // Calculate risk assessment
  const riskAssessment = useMemo(() => {
    if (!ruleData) return null;
    return calculateRiskLevel(ruleData);
  }, [ruleData]);

  // Detect conflicts - disabled for now to avoid compilation errors
  const conflicts = useMemo(() => {
    return []; // TODO: Re-implement conflict detection
  }, [ruleData, contextFilters]);

  // Get suggested alternatives - disabled for now to avoid compilation errors
  const alternatives = useMemo(() => {
    return []; // TODO: Re-implement suggested alternatives
  }, [ruleData, riskAssessment]);

  // Context-specific text
  const getImpactMessage = () => {
    if (context === 'vm') {
      return `This rule will apply to the ${contextName} virtual machine`;
    }
    return `This rule will apply to ALL virtual machines in the ${contextName} department`;
  };

  const getConfirmationText = () => {
    if (context === 'vm') {
      return `I understand this rule will affect the ${contextName} virtual machine`;
    }
    return `I understand this rule will affect all virtual machines in the ${contextName} department`;
  };

  const getContextIcon = () => {
    return context === 'vm' ? Server : Building;
  };

  if (!ruleData || !rulePreview) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading rule preview...</p>
        </div>
      </div>
    );
  }

  const getActionIcon = () => {
    switch (values.direction.action) {
      case 'allow': return <Shield className="h-5 w-5 text-success" />;
      case 'deny': return <Shield className="h-5 w-5 text-destructive" />;
      case 'reject': return <Shield className="h-5 w-5 text-warning" />;
      default: return <Shield className="h-5 w-5 text-primary" />;
    }
  };

  const getDirectionIcon = () => {
    switch (values.direction.direction) {
      case 'inbound': return <ArrowDown className="h-5 w-5 text-primary" />;
      case 'outbound': return <ArrowUp className="h-5 w-5 text-primary" />;
      default: return <ArrowRight className="h-5 w-5 text-primary" />;
    }
  };

  const ContextIcon = getContextIcon();

  return (
    <div className="space-y-6">
      {/* Main Rule Summary */}
      <Card
        glass="strong"
        elevation="4"
        className="p-6"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
              {getActionIcon()}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Rule Summary</h3>
              <p className="text-muted-foreground">Review your firewall rule before creating it</p>
            </div>
          </div>

          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-lg font-medium leading-relaxed text-foreground">
              {rulePreview}
            </p>
          </div>
        </div>
      </Card>

      {/* Risk Assessment */}
      <Card
        glass={riskAssessment.level === 'high' ? 'strong' : riskAssessment.level === 'medium' ? 'medium' : 'subtle'}
        className={cn(
          "p-6",
          riskAssessment.level === 'high' && "border-destructive/50 bg-destructive/5",
          riskAssessment.level === 'medium' && "border-warning/50 bg-warning/5",
          riskAssessment.level === 'low' && "border-success/50 bg-success/5"
        )}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center",
              riskAssessment.level === 'high' && "bg-destructive/20",
              riskAssessment.level === 'medium' && "bg-warning/20",
              riskAssessment.level === 'low' && "bg-success/20"
            )}>
              {riskAssessment.level === 'high' && <AlertTriangle className="h-5 w-5 text-destructive" />}
              {riskAssessment.level === 'medium' && <AlertTriangle className="h-5 w-5 text-warning" />}
              {riskAssessment.level === 'low' && <CheckCircle className="h-5 w-5 text-success" />}
            </div>
            <div>
              <h4 className={cn(
                "font-semibold text-lg",
                riskAssessment.level === 'high' && "text-destructive",
                riskAssessment.level === 'medium' && "text-warning",
                riskAssessment.level === 'low' && "text-success"
              )}>
                {riskAssessment.level === 'high' && 'High Risk - Review Carefully'}
                {riskAssessment.level === 'medium' && 'Medium Risk - Consider Alternatives'}
                {riskAssessment.level === 'low' && 'Low Risk - Safe Configuration'}
              </h4>
              <p className="text-muted-foreground">
                {riskAssessment.explanation}
              </p>
            </div>
          </div>

          {riskAssessment.recommendations && riskAssessment.recommendations.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium">Recommendations:</p>
              <ul className="space-y-1">
                {riskAssessment.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-muted-foreground">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* Context Impact Warning */}
      <Alert>
        <ContextIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>{context === 'vm' ? 'Virtual Machine' : 'Department'} Impact:</strong> {getImpactMessage()}. Make sure this is what you intend.
        </AlertDescription>
      </Alert>

      {/* Conflict Detection */}
      {conflicts.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Potential Conflicts:</strong> This rule may conflict with {conflicts.length} existing rule(s).
            Review your existing rules to ensure this doesn't cause unexpected behavior.
          </AlertDescription>
        </Alert>
      )}

      {/* Suggested Alternatives for High-Risk Rules */}
      {alternatives.length > 0 && (
        <Card
          glass="medium"
          className="p-6"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">Suggested Safer Alternatives</h4>
                <p className="text-sm text-muted-foreground">
                  Consider these safer configurations instead
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {alternatives.map((alt, index) => (
                <div key={index} className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm">{alt.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alt.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Technical Details */}
      <Collapsible open={showTechnical} onOpenChange={setShowTechnical}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            <Info className="h-4 w-4 mr-2" />
            Technical Details
            {showTechnical ? (
              <ChevronDown className="h-4 w-4 ml-2" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-2" />
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4">
          <Card
            glass="medium"
            className="p-6"
          >
            <div className="space-y-4">
              <h4 className="font-semibold">Raw Rule Configuration</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Action:</span>
                  <span className="ml-2 font-mono text-primary">{ruleData.action}</span>
                </div>
                <div>
                  <span className="font-medium">Direction:</span>
                  <span className="ml-2 font-mono text-primary">{ruleData.direction}</span>
                </div>
                <div>
                  <span className="font-medium">Protocol:</span>
                  <span className="ml-2 font-mono text-primary">{ruleData.protocol}</span>
                </div>
                <div>
                  <span className="font-medium">Ports:</span>
                  <span className="ml-2 font-mono text-primary">{ruleData.port || 'any'}</span>
                </div>
                <div>
                  <span className="font-medium">Source IP:</span>
                  <span className="ml-2 font-mono text-primary">{ruleData.srcIpAddr || 'any'}</span>
                </div>
                <div>
                  <span className="font-medium">Destination IP:</span>
                  <span className="ml-2 font-mono text-primary">{ruleData.dstIpAddr || 'any'}</span>
                </div>
                <div>
                  <span className="font-medium">Priority:</span>
                  <span className="ml-2 font-mono text-primary">{ruleData.priority}</span>
                </div>
                <div>
                  <span className="font-medium">Comment:</span>
                  <span className="ml-2 text-primary">{ruleData.comment || 'none'}</span>
                </div>
              </div>
            </div>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Final Confirmation */}
      <Card
        glass="subtle"
        className="p-6"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox
              id="confirm"
              checked={confirmed}
              onCheckedChange={setConfirmed}
              disabled={isCreating}
            />
            <Label
              htmlFor="confirm"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {getConfirmationText()}
            </Label>
          </div>

          {!confirmed && (
            <p className="text-sm text-muted-foreground">
              Please confirm that you understand the impact of this rule before proceeding.
            </p>
          )}

          {isCreating && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating firewall rule...
            </div>
          )}
        </div>
      </Card>

    </div>
  );
}