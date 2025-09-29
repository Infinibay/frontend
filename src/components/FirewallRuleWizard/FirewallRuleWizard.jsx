'use client';

import React, { useState } from 'react';
import { Shield, ArrowRight, ArrowDown, Settings, CheckCircle } from 'lucide-react';
import { Wizard, WizardStep } from '@/components/ui/wizard';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createDebugger } from '@/utils/debug';
import {
  denormalizeAction,
  denormalizeDirection,
  validateRule,
  generateRuleDescription,
  calculateRiskLevel
} from '@/utils/firewallHelpers';
import { DirectionStep } from './steps/DirectionStep';
import { ServiceStep } from './steps/ServiceStep';
import { CustomizationStep } from './steps/CustomizationStep';
import { ReviewStep } from './steps/ReviewStep';
import { getGlassClasses } from '@/utils/glass-effects';
import { cn } from '@/lib/utils';

const debug = createDebugger('frontend:components:firewall-rule-wizard');

/**
 * FirewallRuleWizard - Shared firewall rule creation wizard
 *
 * This wizard guides users through creating firewall rules with a simplified
 * Direction → Service → Customization → Review flow. It abstracts away
 * technical complexity while providing smart defaults and risk assessment.
 *
 * Works for both department and VM contexts through configuration props.
 *
 * @param {string} context - Context type ('department' or 'vm')
 * @param {string} contextId - ID of the context (department ID or VM ID)
 * @param {string} contextName - Name of the context for display
 * @param {Array} contextFilters - Existing filters for the context
 * @param {Function} createRuleFunction - Function to create the firewall rule
 * @param {Function} onRuleCreated - Callback when a rule is created/updated
 * @param {Function} onComplete - Optional callback when wizard completes
 * @param {Object} initialValues - Optional initial values for the wizard
 */
export default function FirewallRuleWizard({
  context = 'department',
  contextId,
  contextName,
  contextFilters = [],
  createRuleFunction,
  onRuleCreated,
  onComplete,
  initialValues: providedInitialValues
}) {
  const { toast } = useToast();
  const [isCreatingRule, setIsCreatingRule] = useState(false);

  // Smart defaults for firewall rules
  const defaultInitialValues = {
    direction: {
      action: 'allow',
      direction: 'inbound'
    },
    service: {
      protocol: 'tcp',
      ports: '',
      serviceType: null
    },
    customization: {
      srcIpAddr: null,
      dstIpAddr: null,
      priority: 500,
      comment: ''
    }
  };

  const initialValues = { ...defaultInitialValues, ...providedInitialValues };

  /**
   * Parse port string into start/end values for GraphQL
   */
  const parsePortsForGraphQL = (portString) => {
    if (!portString) return { start: null, end: null };

    const portStr = portString.toString().trim();
    if (portStr === '' || portStr === '*') return { start: null, end: null };

    // Handle range (e.g., "80-90")
    if (portStr.includes('-')) {
      const [start, end] = portStr.split('-').map(p => parseInt(p.trim(), 10));
      return { start, end };
    }

    // Handle single port
    const port = parseInt(portStr, 10);
    return { start: port, end: port };
  };

  /**
   * Parse port string into array of individual ports for multiple rule creation
   */
  const parseMultiplePorts = (portString) => {
    if (!portString) return [];

    const portStr = portString.toString().trim();
    if (portStr === '' || portStr === '*') return [];

    // Split by comma for multiple ports
    return portStr.split(',').map(port => {
      const trimmedPort = port.trim();

      // Handle range (e.g., "80-90")
      if (trimmedPort.includes('-')) {
        const [start, end] = trimmedPort.split('-').map(p => parseInt(p.trim(), 10));
        const range = [];
        for (let p = start; p <= end; p++) {
          range.push({ start: p, end: p });
        }
        return range;
      }

      // Handle single port
      const portNum = parseInt(trimmedPort, 10);
      return { start: portNum, end: portNum };
    }).flat();
  };

  /**
   * Creates firewall rule(s) using the provided creation function
   */
  const handleComplete = async (values) => {
    debug.info('Starting firewall rule creation', { context, contextName, values });

    if (!createRuleFunction) {
      debug.error('Configuration error: No rule creation function provided');
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "No rule creation function provided"
      });
      return;
    }

    setIsCreatingRule(true);

    try {
      // Extract and transform values for the backend
      const ruleData = {
        action: denormalizeAction(values.direction.action),
        direction: denormalizeDirection(values.direction.direction),
        protocol: values.service.protocol,
        srcPort: values.service.ports,
        dstPort: values.service.ports,
        srcIpAddr: values.customization.srcIpAddr,
        dstIpAddr: values.customization.dstIpAddr,
        priority: values.customization.priority,
        comment: values.customization.comment || null
      };

      // Validate the rule before creation (map to helper's expected structure)
      const helperRule = {
        name: values.customization?.comment?.trim() || `${contextName} firewall rule`,
        action: values.direction.action,
        direction: values.direction.direction,
        protocol: values.service.protocol,
        port: values.service.ports,
        sourceIp: values.customization.srcIpAddr || undefined,
        destinationIp: values.customization.dstIpAddr || undefined,
      };
      const validation = validateRule(helperRule);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Parse ports for multiple rules creation
      const portRanges = parseMultiplePorts(values.service.ports);

      // Coerce priority to a number
      const priority = values.customization.priority != null ? Number(values.customization.priority) : 500;

      // Create rules using the provided function
      debug.info('Creating firewall rules', { portRanges, priority, ruleData });
      const ruleResults = await createRuleFunction({
        values,
        ruleData,
        portRanges,
        priority,
        contextId,
        contextName,
        contextFilters
      });

      // Generate a user-friendly summary
      const ruleDescription = generateRuleDescription({
        action: values.direction.action,
        direction: values.direction.direction,
        protocol: values.service.protocol,
        port: values.service.ports,
      });
      const riskLevel = calculateRiskLevel(ruleData);

      const ruleCount = Array.isArray(ruleResults) ? ruleResults.length : 1;
      debug.success('Firewall rules created successfully', {
        ruleCount,
        riskLevel: riskLevel.level,
        context: contextName
      });

      toast({
        variant: "success",
        title: ruleCount === 1 ? "Firewall Rule Created!" : `${ruleCount} Firewall Rules Created!`,
        description: ruleCount === 1 ?
          `${ruleDescription}. Risk level: ${riskLevel.level.toUpperCase()}` :
          `Created ${ruleCount} rules for ${values.service.serviceType?.title || 'service'} ports. Risk level: ${riskLevel.level.toUpperCase()}`
      });

      // Notify parent component of the change
      if (onRuleCreated) {
        const result = Array.isArray(ruleResults) ? ruleResults[ruleResults.length - 1] : ruleResults;
        onRuleCreated(result);
      }

      // Call completion callback if provided
      if (onComplete) {
        const result = Array.isArray(ruleResults) ? ruleResults[ruleResults.length - 1] : ruleResults;
        onComplete(result);
      }

    } catch (error) {
      debug.error('create-rule', 'Failed to create firewall rule:', error);

      // Handle GraphQL-specific errors
      let errorMessage = "An error occurred while creating the firewall rule. Please try again.";

      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        errorMessage = error.graphQLErrors[0].message;
      } else if (error.networkError) {
        errorMessage = "Network error - please check your connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Failed to Create Rule",
        description: errorMessage
      });
    } finally {
      setIsCreatingRule(false);
    }
  };

  /**
   * Validates the direction step
   */
  const validateDirectionStep = async (values) => {
    const errors = {};

    if (!values.action) {
      errors.action = 'Please select what you want to do (Allow/Block/Reject)';
    }

    if (!values.direction) {
      errors.direction = 'Please select the traffic direction (Incoming/Outgoing)';
    }

    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  };

  /**
   * Validates the service step
   */
  const validateServiceStep = async (values) => {
    const errors = {};

    if (!values.protocol) {
      errors.protocol = 'Please select a protocol (TCP/UDP/ICMP)';
    }

    if (values.protocol !== 'icmp' && !values.ports) {
      errors.ports = 'Please specify port(s) for this service';
    }

    // Basic port validation
    if (values.ports && values.protocol !== 'icmp') {
      const portRegex = /^(\d+(-\d+)?)(,\s*\d+(-\d+)?)*$/;
      if (!portRegex.test(values.ports)) {
        errors.ports = 'Invalid port format. Use: 80, 80-90, or 80,443';
      }
    }

    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  };

  /**
   * Validates the customization step
   */
  const validateCustomizationStep = async (values) => {
    const errors = {};

    // Validate priority
    if (values.priority !== undefined && values.priority !== null) {
      const priority = parseInt(values.priority, 10);
      if (isNaN(priority) || priority < 1 || priority > 1000) {
        errors.priority = 'Priority must be between 1 and 1000';
      }
    }

    // Validate IP addresses if provided
    if (values.srcIpAddr) {
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
      if (!ipRegex.test(values.srcIpAddr)) {
        errors.srcIpAddr = 'Invalid IP address format (e.g., 192.168.1.0/24)';
      }
    }

    if (values.dstIpAddr) {
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
      if (!ipRegex.test(values.dstIpAddr)) {
        errors.dstIpAddr = 'Invalid IP address format (e.g., 192.168.1.0/24)';
      }
    }

    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  };

  return (
    <div className="w-full">
      <Wizard
        onComplete={handleComplete}
        initialValues={initialValues}
        className="relative"
      >
        <WizardStep
          id="direction"
          validate={validateDirectionStep}
        >
          <DirectionStep id="direction" context={context} />
        </WizardStep>

        <WizardStep
          id="service"
          validate={validateServiceStep}
        >
          <ServiceStep id="service" context={context} />
        </WizardStep>

        <WizardStep
          id="customization"
          validate={validateCustomizationStep}
        >
          <CustomizationStep
            id="customization"
            context={context}
            contextName={contextName}
          />
        </WizardStep>

        <WizardStep id="review">
          <ReviewStep
            id="review"
            context={context}
            contextName={contextName}
            contextFilters={contextFilters}
            isCreating={isCreatingRule}
          />
        </WizardStep>
      </Wizard>

      {isCreatingRule && (
        <div className="absolute inset-0 glass-overlay backdrop-blur-md flex items-center justify-center z-50 rounded-fluent-lg">
          <div className="flex items-center gap-3 text-foreground bg-background/90 border border-primary/20 px-6 py-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-lg font-medium">Creating firewall rule...</span>
          </div>
        </div>
      )}
    </div>
  );
}