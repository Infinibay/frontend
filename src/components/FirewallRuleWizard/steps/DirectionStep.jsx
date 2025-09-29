'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { SelectionCard } from '@/components/ui/selection-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import { ArrowDown, ArrowUp, Shield, ShieldX, ShieldAlert, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:direction-step');

/**
 * DirectionStep - First step of the firewall wizard
 *
 * Asks users about their intent using everyday language:
 * 1. What do you want to do? (Allow/Block/Reject)
 * 2. Which direction? (Incoming/Outgoing)
 *
 * Uses large clickable cards with icons and descriptions to make
 * the technical concepts accessible to non-technical users.
 *
 * @param {string} context - Context type ('department' or 'vm') for customizing text
 */
export function DirectionStep({ id, context = 'department' }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};

  const actionOptions = [
    {
      value: 'allow',
      title: 'Allow Access',
      description: 'Permit connections matching this rule',
      icon: Shield,
      explanation: 'Traffic will be allowed through the firewall'
    },
    {
      value: 'deny',
      title: 'Block Access',
      description: 'Silently drop connections without response',
      icon: ShieldX,
      explanation: 'Traffic will be silently dropped (no response sent)'
    },
    {
      value: 'reject',
      title: 'Reject Access',
      description: 'Block connections and send rejection response',
      icon: ShieldAlert,
      explanation: 'Traffic will be blocked with an active rejection message'
    }
  ];

  // Context-specific direction options
  const getDirectionOptions = () => {
    if (context === 'vm') {
      return [
        {
          value: 'inbound',
          title: 'Incoming Connections',
          description: 'Others connecting to this virtual machine',
          icon: ArrowDown,
          explanation: 'Controls traffic coming INTO this virtual machine from outside'
        },
        {
          value: 'outbound',
          title: 'Outgoing Connections',
          description: 'This virtual machine connecting to others',
          icon: ArrowUp,
          explanation: 'Controls traffic going OUT from this virtual machine to external systems'
        }
      ];
    }

    // Default to department context
    return [
      {
        value: 'inbound',
        title: 'Incoming Connections',
        description: 'Others connecting to your department\'s computers',
        icon: ArrowDown,
        explanation: 'Controls traffic coming INTO your department from outside'
      },
      {
        value: 'outbound',
        title: 'Outgoing Connections',
        description: 'Your department\'s computers connecting to others',
        icon: ArrowUp,
        explanation: 'Controls traffic going OUT from your department to external systems'
      }
    ];
  };

  const directionOptions = getDirectionOptions();

  const handleActionSelect = (action) => {
    debug.info('Action selected', { action, context });
    setValue(`${id}.action`, action);
  };

  const handleDirectionSelect = (direction) => {
    debug.info('Direction selected', { direction, context });
    setValue(`${id}.direction`, direction);
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
      {/* Action Selection */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold tracking-tight">
              What do you want to do?
            </h3>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-xs">
                  <p className="font-medium mb-2">Action Types:</p>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Allow:</strong> Traffic will pass through the firewall</li>
                    <li><strong>Block:</strong> Traffic will be silently dropped</li>
                    <li><strong>Reject:</strong> Traffic will be blocked with an error response</li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-muted-foreground">
            Choose the action to take when traffic matches this rule
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {actionOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = stepValues.action === option.value;

            return (
              <SelectionCard
                key={option.value}
                selected={isSelected}
                onSelect={() => handleActionSelect(option.value)}
                selectionIndicator
                className="p-6 glass-strong"
              >
                <div className="space-y-4">
                  <div className={cn(
                    "h-12 w-12 rounded-lg flex items-center justify-center mx-auto",
                    isSelected ? "bg-primary/20" : "bg-muted"
                  )}>
                    <IconComponent className={cn(
                      "h-6 w-6",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="text-center space-y-2">
                    <h4 className="font-semibold text-base">
                      {option.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      {option.explanation}
                    </p>
                  </div>
                </div>
              </SelectionCard>
            );
          })}
        </div>

        {getError('action') && (
          <p className="text-sm text-destructive text-center" role="alert">
            {getError('action')}
          </p>
        )}
      </div>

      {/* Direction Selection */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold tracking-tight">
              Which direction?
            </h3>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-xs">
                  <p className="font-medium mb-2">Traffic Direction:</p>
                  <ul className="space-y-1 text-sm">
                    <li><strong>Incoming:</strong> Traffic coming INTO your {context === 'vm' ? 'virtual machine' : 'department'} from outside sources</li>
                    <li><strong>Outgoing:</strong> Traffic going OUT from your {context === 'vm' ? 'virtual machine' : 'department'} to external destinations</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">
                    Most security rules focus on incoming traffic for protection.
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-muted-foreground">
            Select whether this rule applies to incoming or outgoing connections
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {directionOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = stepValues.direction === option.value;

            return (
              <SelectionCard
                key={option.value}
                selected={isSelected}
                onSelect={() => handleDirectionSelect(option.value)}
                selectionIndicator
                className="p-6 glass-strong"
              >
                <div className="space-y-4">
                  <div className={cn(
                    "h-12 w-12 rounded-lg flex items-center justify-center mx-auto",
                    isSelected ? "bg-primary/20" : "bg-muted"
                  )}>
                    <IconComponent className={cn(
                      "h-6 w-6",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="text-center space-y-2">
                    <h4 className="font-semibold text-base">
                      {option.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      {option.explanation}
                    </p>
                  </div>
                </div>
              </SelectionCard>
            );
          })}
        </div>

        {getError('direction') && (
          <p className="text-sm text-destructive text-center" role="alert">
            {getError('direction')}
          </p>
        )}
      </div>

      {/* Summary of selections */}
      {stepValues.action && stepValues.direction && (
        <Card
          className="p-4 glass-strong"
        >
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              You're creating a rule to{' '}
              <span className="font-semibold text-primary">
                {actionOptions.find(opt => opt.value === stepValues.action)?.title.toLowerCase()}
              </span>{' '}
              <span className="font-semibold text-primary">
                {directionOptions.find(opt => opt.value === stepValues.direction)?.title.toLowerCase()}
              </span>
            </p>
          </div>
        </Card>
      )}
      </div>
    </TooltipProvider>
  );
}