'use client';

import React from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ENTITY_TYPES } from '@/config/firewallEntityConfig';
import { calculateSecurityScore } from '@/utils/firewallHelpers';

/**
 * Unified FirewallStatusHeader component
 * Works for both Department and VM based on entityType
 * Based on department implementation which works correctly
 */
const FirewallStatusHeader = ({ entityType, rules, conflicts, onRefresh, onCreateRule }) => {
  const { score, level, issues } = calculateSecurityScore(rules || []);

  const statusConfig = {
    SECURE: {
      icon: '🟢',
      label: 'Secure',
      color: 'text-green-700 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800',
      description: entityType === ENTITY_TYPES.DEPARTMENT
        ? 'Department has strong baseline protection'
        : 'Your VM is well protected'
    },
    MODERATE: {
      icon: '🟡',
      label: 'Moderate',
      color: 'text-yellow-700 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      description: entityType === ENTITY_TYPES.DEPARTMENT
        ? 'Baseline security could be improved'
        : 'Security could be improved'
    },
    AT_RISK: {
      icon: '🔴',
      label: 'At Risk',
      color: 'text-red-700 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800',
      description: entityType === ENTITY_TYPES.DEPARTMENT
        ? 'Critical: Configure baseline protection'
        : 'Critical: Configure firewall protection'
    },
    UNCONFIGURED: {
      icon: '⚪',
      label: 'Unconfigured',
      color: 'text-gray-700 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-950',
      borderColor: 'border-gray-200 dark:border-gray-800',
      description: entityType === ENTITY_TYPES.DEPARTMENT
        ? 'No department-level rules configured'
        : 'No firewall rules configured'
    }
  };

  const status = statusConfig[level] || statusConfig.UNCONFIGURED;
  const totalRules = rules?.length || 0;
  const hasConflicts = conflicts && conflicts.length > 0;

  const headerTitle = entityType === ENTITY_TYPES.DEPARTMENT
    ? 'Department Security Status'
    : 'Security Status';

  const rulesLabel = entityType === ENTITY_TYPES.DEPARTMENT
    ? 'department rule'
    : 'active rule';

  return (
    <div className="glass-subtle p-6 rounded-lg border border-border/20">
      <div className="flex items-start justify-between">
        {/* Left: Status info */}
        <div className="flex items-start gap-4 flex-1">
          <div className="text-4xl" role="img" aria-label={status.label}>
            {status.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="size-heading">{headerTitle}</h2>
              <Badge className={`${status.bgColor} ${status.color} ${status.borderColor} border`}>
                {status.label}
              </Badge>
              {hasConflicts && entityType === ENTITY_TYPES.VM && (
                <Badge className="bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800 border">
                  {conflicts.length} Conflict{conflicts.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {status.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <span>
                <strong>{totalRules}</strong> {rulesLabel}{totalRules !== 1 ? 's' : ''}
              </span>
              <span>•</span>
              <span>
                Security score: <strong className={status.color}>{score}/100</strong>
              </span>
              {issues.length > 0 && (
                <>
                  <span>•</span>
                  <span className="text-orange-600 dark:text-orange-400">
                    {issues.length} issue{issues.length !== 1 ? 's' : ''} detected
                  </span>
                </>
              )}
            </div>
            {/* Show issues list if any */}
            {issues.length > 0 && (
              <ul className="mt-3 space-y-1">
                {issues.slice(0, 3).map((issue, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                    <span className="text-orange-500">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
                {issues.length > 3 && (
                  <li className="text-xs text-muted-foreground">
                    ... and {issues.length - 3} more
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onCreateRule}
            className="size-button"
          >
            <Plus className="size-icon mr-2" />
            Add Rule
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="size-button"
            title="Refresh firewall data"
          >
            <RefreshCw className="size-icon" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FirewallStatusHeader;
