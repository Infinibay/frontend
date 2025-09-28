'use client';

import React, { useState } from 'react';
import { Shield, ArrowRight, ArrowDown, Settings, CheckCircle } from 'lucide-react';
import { Wizard, WizardStep } from '@/components/ui/wizard';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createDebugger } from '@/utils/debug';
import {
  useCreateFilterRuleMutation,
  useCreateFilterMutation
} from '@/gql/hooks';
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

const debug = createDebugger('frontend:components:department-firewall-wizard');

/**
 * DepartmentFirewallWizard - User-friendly firewall rule creation wizard
 *
 * This wizard guides users through creating firewall rules with a simplified
 * Direction → Service → Customization → Review flow. It abstracts away
 * technical complexity while providing smart defaults and risk assessment.
 *
 * @param {string} departmentId - ID of the department to create rules for
 * @param {string} departmentName - Name of the department for display
 * @param {Array} departmentFilters - Existing filters for the department
 * @param {Function} onRuleChange - Callback when a rule is created/updated
 * @param {Function} onComplete - Optional callback when wizard completes
 */
export default function DepartmentFirewallWizard({
  departmentId,
  departmentName,
  departmentFilters = [],
  onRuleChange,
  onComplete
}) {
  const { toast } = useToast();
  const [createFilterRule, { loading: createRuleLoading }] = useCreateFilterRuleMutation();
  const [createFilter, { loading: createFilterLoading }] = useCreateFilterMutation();
  const [isCreatingRule, setIsCreatingRule] = useState(false);

  // Smart defaults for firewall rules
  const initialValues = {
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
   * Creates or finds a filter for the rule, then creates the rule
   */
  const handleComplete = async (values) => {
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
        name: values.customization?.comment?.trim() || 'Department firewall rule',
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

      // Find or create a filter for this department
      let filterId = null;

      // Try to find an existing filter for this department (prioritize department-specific filters)
      const existingFilter = departmentFilters.find(filter =>
        // First priority: exact match for expected name
        filter.name === `${departmentName}-default`
      ) || departmentFilters.find(filter =>
        // Second priority: filters that include the department name and are DEPARTMENT type
        filter.name.toLowerCase().includes(departmentName.toLowerCase()) && filter.type === 'DEPARTMENT'
      ) || departmentFilters.find(filter =>
        // Third priority: filters that include 'default' in the name and are DEPARTMENT type
        filter.name.toLowerCase().includes('default') && filter.type === 'DEPARTMENT'
      ) || departmentFilters.find(filter =>
        // Last fallback: any DEPARTMENT type filter
        filter.type === 'DEPARTMENT'
      );

      if (existingFilter) {
        filterId = existingFilter.id;
      } else {
        // Create a new default filter for the department
        const filterResult = await createFilter({
          variables: {
            input: {
              name: `${departmentName}-default`,
              description: `Default firewall filter for ${departmentName} department`,
              type: 'DEPARTMENT', // Department-level filter
              chain: 'root' // Required chain field with default value
            }
          }
        });
        filterId = filterResult.data.createFilter.id;
      }

      // Parse ports for multiple rules creation
      const portRanges = parseMultiplePorts(values.service.ports);

      // Coerce priority to a number
      const priority = values.customization.priority != null ? Number(values.customization.priority) : 500;

      // Create rules for each port range
      const ruleResults = [];
      for (let i = 0; i < portRanges.length; i++) {
        const portRange = portRanges[i];

        // Create comment that identifies the port
        let ruleComment = values.customization.comment?.trim();
        if (portRanges.length > 1) {
          // For multiple ports, add port information to comment
          const portDesc = portRange.start === portRange.end ?
            `port ${portRange.start}` :
            `ports ${portRange.start}-${portRange.end}`;
          ruleComment = ruleComment ?
            `${ruleComment} (${portDesc})` :
            `${values.service.serviceType?.title || 'Service'} - ${portDesc}`;
        }

        // Create the firewall rule with proper GraphQL structure
        const ruleResult = await createFilterRule({
          variables: {
            filterId: filterId,
            input: {
              action: denormalizeAction(values.direction.action),
              direction: denormalizeDirection(values.direction.direction),
              protocol: values.service.protocol,
              srcPortStart: portRange.start,
              srcPortEnd: portRange.end,
              dstPortStart: portRange.start,
              dstPortEnd: portRange.end,
              priority: priority,
              ...(ruleComment ? { comment: ruleComment } : {})
              // TODO: IP scoping requires backend support before re-adding srcIpAddr/dstIpAddr fields
              // srcIpAddr: values.customization.srcIpAddr || undefined,
              // dstIpAddr: values.customization.dstIpAddr || undefined,
            }
          }
        });

        ruleResults.push(ruleResult);
      }

      // Use the last created rule for response (or first if only one)
      const ruleResult = ruleResults[ruleResults.length - 1];

      // Generate a user-friendly summary
      const ruleDescription = generateRuleDescription({
        action: values.direction.action,
        direction: values.direction.direction,
        protocol: values.service.protocol,
        port: values.service.ports,
      });
      const riskLevel = calculateRiskLevel(ruleData);

      toast({
        variant: "success",
        title: ruleResults.length === 1 ? "Firewall Rule Created!" : `${ruleResults.length} Firewall Rules Created!`,
        description: ruleResults.length === 1 ?
          `${ruleDescription}. Risk level: ${riskLevel.level.toUpperCase()}` :
          `Created ${ruleResults.length} rules for ${values.service.serviceType?.title || 'service'} ports. Risk level: ${riskLevel.level.toUpperCase()}`
      });

      // Notify parent component of the change
      if (onRuleChange) {
        onRuleChange(ruleResult.data.createFilterRule);
      }

      // Call completion callback if provided
      if (onComplete) {
        onComplete(ruleResult.data.createFilterRule);
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
          <DirectionStep id="direction" />
        </WizardStep>

        <WizardStep
          id="service"
          validate={validateServiceStep}
        >
          <ServiceStep id="service" />
        </WizardStep>

        <WizardStep
          id="customization"
          validate={validateCustomizationStep}
        >
          <CustomizationStep
            id="customization"
            departmentName={departmentName}
          />
        </WizardStep>

        <WizardStep id="review">
          <ReviewStep
            id="review"
            departmentName={departmentName}
            departmentFilters={departmentFilters}
            isCreating={isCreatingRule}
          />
        </WizardStep>
      </Wizard>

      {(createRuleLoading || createFilterLoading || isCreatingRule) && (
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

