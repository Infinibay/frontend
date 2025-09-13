/**
 * Reusable badge component for displaying problem priority levels
 */

import React from 'react';
import { Badge } from '../../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { PriorityLevel } from '../../../types/problems';
import ProblemPriorityService from '../../../services/ProblemPriorityService';

const PriorityBadge = ({ 
  priority, 
  size = 'default', 
  showIcon = true, 
  showLabel = true,
  animated = false,
  className = '' 
}) => {
  const icon = ProblemPriorityService.getPriorityIcon(priority);
  const label = ProblemPriorityService.getPriorityLabel(priority);
  const description = ProblemPriorityService.getPriorityDescription(priority);
  const colorClass = ProblemPriorityService.getPriorityColor(priority);

  // Size variants
  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    default: 'text-sm px-3 py-1',
    large: 'text-base px-4 py-2'
  };

  // Animation for critical issues
  const animationClass = animated && priority === PriorityLevel.CRITICAL 
    ? 'animate-pulse' 
    : '';

  const badgeContent = (
    <>
      {showIcon && (
        <span className="mr-1" role="img" aria-label={`Priority ${label}`}>
          {icon}
        </span>
      )}
      {showLabel && (
        <span className="font-medium">
          {label}
        </span>
      )}
    </>
  );

  const badgeElement = (
    <Badge 
      variant="outline"
      className={`
        ${colorClass} 
        ${sizeClasses[size]} 
        ${animationClass}
        border-2 font-semibold
        ${className}
      `}
    >
      {badgeContent}
    </Badge>
  );

  // Wrap with tooltip if description is available
  if (description) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badgeElement}
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-sm">{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badgeElement;
};

// Specialized variants for common use cases
export const CriticalBadge = ({ ...props }) => (
  <PriorityBadge 
    priority={PriorityLevel.CRITICAL} 
    animated={true}
    {...props} 
  />
);

export const ImportantBadge = ({ ...props }) => (
  <PriorityBadge 
    priority={PriorityLevel.IMPORTANT} 
    {...props} 
  />
);

export const InformationalBadge = ({ ...props }) => (
  <PriorityBadge 
    priority={PriorityLevel.INFORMATIONAL} 
    {...props} 
  />
);

// Priority indicator for lists (compact version)
export const PriorityIndicator = ({ priority, className = '' }) => (
  <div className={`flex items-center ${className}`}>
    <span 
      className={`
        w-3 h-3 rounded-full mr-2 flex-shrink-0
        ${priority === PriorityLevel.CRITICAL ? 'bg-red-500' : ''}
        ${priority === PriorityLevel.IMPORTANT ? 'bg-yellow-500' : ''}
        ${priority === PriorityLevel.INFORMATIONAL ? 'bg-blue-500' : ''}
      `}
      aria-label={`Priority: ${ProblemPriorityService.getPriorityLabel(priority)}`}
    />
    <span className="text-sm font-medium">
      {ProblemPriorityService.getPriorityIcon(priority)} {ProblemPriorityService.getPriorityLabel(priority)}
    </span>
  </div>
);

// Priority summary component for dashboards
export const PrioritySummary = ({ problems = [] }) => {
  const summary = ProblemPriorityService.getPrioritySummary(problems);

  return (
    <div className="flex items-center space-x-4 text-sm">
      {summary.critical > 0 && (
        <div className="flex items-center text-red-600">
          <span className="mr-1">🚨</span>
          <span className="font-semibold">{summary.critical}</span>
          <span className="ml-1">críticos</span>
        </div>
      )}
      {summary.important > 0 && (
        <div className="flex items-center text-yellow-600">
          <span className="mr-1">⚠️</span>
          <span className="font-semibold">{summary.important}</span>
          <span className="ml-1">importantes</span>
        </div>
      )}
      {summary.informational > 0 && (
        <div className="flex items-center text-blue-600">
          <span className="mr-1">ℹ️</span>
          <span className="font-semibold">{summary.informational}</span>
          <span className="ml-1">informativos</span>
        </div>
      )}
      {summary.total === 0 && (
        <div className="flex items-center text-green-600">
          <span className="mr-1">✅</span>
          <span>Sin problemas detectados</span>
        </div>
      )}
    </div>
  );
};

export default PriorityBadge;
