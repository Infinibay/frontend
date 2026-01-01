'use client';

/**
 * AutomationCard Component
 *
 * Card component for displaying an automation in the list view.
 */

import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AutomationStatusBadge } from './AutomationStatusBadge';
import { Zap, Power, Clock, Play, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const SEVERITY_CONFIG = {
  LOW: { icon: '🔵', color: 'text-blue-500' },
  MEDIUM: { icon: '🟡', color: 'text-yellow-500' },
  HIGH: { icon: '🟠', color: 'text-orange-500' },
  CRITICAL: { icon: '🔴', color: 'text-red-500' },
};

const SCOPE_LABELS = {
  ALL_VMS: 'All VMs',
  DEPARTMENT: 'Department',
  SPECIFIC_VMS: 'Specific VMs',
  EXCLUDE_VMS: 'Exclude VMs',
};

export function AutomationCard({ automation, onClick }) {
  const {
    name,
    description,
    status,
    isEnabled,
    isCompiled,
    severity,
    scope,
    department,
    lastExecutedAt,
    executionCount,
    createdAt,
  } = automation;

  const severityConfig = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.MEDIUM;
  const scopeLabel = scope === 'DEPARTMENT' && department
    ? department.name
    : SCOPE_LABELS[scope] || 'Unknown';

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md hover:border-primary/30',
        'group relative overflow-hidden',
        !isEnabled && status === 'APPROVED' && 'opacity-75'
      )}
      onClick={onClick}
    >
      {/* Enabled indicator line */}
      {isEnabled && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-green-500" />
      )}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
              {name}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {description}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-1">
            <AutomationStatusBadge status={status} />
            {isEnabled && (
              <Badge variant="outline" className="text-green-600 border-green-500 text-xs">
                <Power className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Metadata row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {/* Severity */}
          <span className={cn('flex items-center gap-1', severityConfig.color)}>
            <span>{severityConfig.icon}</span>
            {severity}
          </span>

          {/* Scope */}
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {scopeLabel}
          </span>

          {/* Compilation status */}
          {!isCompiled && status === 'DRAFT' && (
            <span className="flex items-center gap-1 text-amber-500">
              <AlertCircle className="h-3 w-3" />
              Not compiled
            </span>
          )}
        </div>

        {/* Execution stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs text-muted-foreground">
          {executionCount > 0 ? (
            <>
              <span className="flex items-center gap-1">
                <Play className="h-3 w-3" />
                {executionCount} execution{executionCount !== 1 ? 's' : ''}
              </span>
              {lastExecutedAt && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Last run {formatDistanceToNow(new Date(lastExecutedAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              )}
            </>
          ) : (
            <span className="flex items-center gap-1 italic">
              <Clock className="h-3 w-3" />
              Never executed
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default AutomationCard;
