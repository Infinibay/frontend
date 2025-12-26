'use client';

import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getGlassClasses } from '@/utils/glass-effects';
import { calculateNetworkHealth, STATUS_MESSAGES } from './networkDiagnosticsHelp';

const NetworkHealthScore = ({ diagnostics }) => {
  const health = calculateNetworkHealth(diagnostics);
  const statusInfo = STATUS_MESSAGES[health.status];

  const getScoreColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 dark:text-green-400';
      case 'degraded':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getBackgroundStyle = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50/80 dark:bg-green-950/40 border-green-200 dark:border-green-800';
      case 'degraded':
        return 'bg-yellow-50/80 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-800';
      case 'critical':
        return 'bg-red-50/80 dark:bg-red-950/40 border-red-200 dark:border-red-800';
      default:
        return 'bg-muted/50 border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
      case 'critical':
        return <XCircle className="w-8 h-8 text-red-600" />;
      default:
        return <Activity className="w-8 h-8 text-muted-foreground" />;
    }
  };

  const failedCount = health.failedChecks.length;
  const passedCount = health.passedChecks.length;

  return (
    <div
      className={cn(
        'p-6 rounded-xl border-2 transition-all duration-200',
        getBackgroundStyle(health.status)
      )}
    >
      <div className="flex items-center justify-between">
        {/* Left side: Icon + Status info */}
        <div className="flex items-center gap-6">
          {/* Status Icon */}
          <div className="flex-shrink-0">
            {getStatusIcon(health.status)}
          </div>

          {/* Status Text */}
          <div>
            <h3 className={cn('text-xl font-semibold mb-1', getScoreColor(health.status))}>
              {statusInfo.title}
            </h3>
            <p className="text-sm text-foreground/70 max-w-md">
              {statusInfo.description}
            </p>
          </div>
        </div>

        {/* Right side: Score + Checks summary */}
        <div className="flex items-center gap-6">
          {/* Checks summary */}
          <div className="flex items-center gap-2">
            {passedCount > 0 && (
              <Badge className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                {passedCount} OK
              </Badge>
            )}
            {failedCount > 0 && (
              <Badge variant="destructive">
                <XCircle className="w-3 h-3 mr-1" />
                {failedCount} Issues
              </Badge>
            )}
          </div>

          {/* Score */}
          <div className="text-center">
            <div className={cn('text-4xl font-bold', getScoreColor(health.status))}>
              {health.score}
            </div>
            <div className="text-xs text-muted-foreground">
              Health Score
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkHealthScore;
