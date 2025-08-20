'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';

/**
 * Enhanced progress overlay with multi-stage progress indicators
 */
export function ProgressOverlay({ 
  stages = [],
  currentStage = 0,
  message,
  variant = 'default',
  size = 'default',
  showCancel = false,
  onCancel,
  estimatedTime,
  className 
}) {
  const getStageIcon = (stage, index) => {
    if (index < currentStage) {
      // Completed stage
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    } else if (index === currentStage) {
      // Current stage
      if (stage.status === 'error') {
        return <XCircle className="h-5 w-5 text-red-500" />;
      }
      return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
    } else {
      // Pending stage
      return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStageClassName = (index) => {
    if (index < currentStage) {
      return 'text-green-600 dark:text-green-400';
    } else if (index === currentStage) {
      return 'text-primary font-semibold';
    } else {
      return 'text-muted-foreground';
    }
  };

  const progressPercentage = stages.length > 0 
    ? Math.round((currentStage / stages.length) * 100)
    : 0;

  return (
    <div className={cn(
      'fixed inset-0 bg-background/80 backdrop-blur-sm z-50',
      'flex items-center justify-center p-4',
      className
    )}>
      <div className={cn(
        'bg-card rounded-lg shadow-xl border',
        'w-full max-w-md',
        size === 'lg' && 'max-w-lg',
        size === 'xl' && 'max-w-xl'
      )}>
        {/* Header */}
        <div className="p-6 pb-4">
          <h3 className="text-lg font-semibold mb-2">
            {message || 'Processing...'}
          </h3>
          
          {/* Progress bar */}
          {stages.length > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Estimated time */}
          {estimatedTime && (
            <p className="text-sm text-muted-foreground">
              Estimated time remaining: {estimatedTime}
            </p>
          )}
        </div>

        {/* Stages list */}
        {stages.length > 0 && (
          <div className="px-6 pb-6">
            <div className="space-y-3">
              {stages.map((stage, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {getStageIcon(stage, index)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm',
                      getStageClassName(index)
                    )}>
                      {stage.label}
                    </p>
                    {stage.description && index === currentStage && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {stage.description}
                      </p>
                    )}
                    {stage.status === 'error' && stage.error && index === currentStage && (
                      <p className="text-xs text-red-500 mt-1">
                        {stage.error}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Simple loading state when no stages */}
        {stages.length === 0 && (
          <div className="px-6 pb-6">
            <div className="flex justify-center">
              <div className={cn(
                'inline-block animate-spin rounded-full border-4 border-current border-t-transparent',
                {
                  'h-8 w-8': size === 'default',
                  'h-12 w-12': size === 'lg',
                  'h-16 w-16': size === 'xl',
                  'text-primary': variant === 'default',
                  'text-primary animate-pulse': variant === 'pulse',
                }
              )} />
            </div>
          </div>
        )}

        {/* Cancel button */}
        {showCancel && onCancel && (
          <div className="px-6 pb-6 pt-2 border-t">
            <button
              onClick={onCancel}
              className={cn(
                'w-full px-4 py-2 text-sm font-medium',
                'bg-secondary hover:bg-secondary/80',
                'text-secondary-foreground',
                'rounded-md transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary'
              )}
            >
              Cancel Operation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Hook to manage progress overlay stages
 */
export function useProgressStages(initialStages = []) {
  const [stages, setStages] = React.useState(initialStages);
  const [currentStage, setCurrentStage] = React.useState(0);

  const updateStage = React.useCallback((index, updates) => {
    setStages(prev => prev.map((stage, i) => 
      i === index ? { ...stage, ...updates } : stage
    ));
  }, []);

  const nextStage = React.useCallback(() => {
    setCurrentStage(prev => Math.min(prev + 1, stages.length - 1));
  }, [stages.length]);

  const setStageError = React.useCallback((error) => {
    updateStage(currentStage, { status: 'error', error });
  }, [currentStage, updateStage]);

  const reset = React.useCallback(() => {
    setCurrentStage(0);
    setStages(initialStages);
  }, [initialStages]);

  return {
    stages,
    currentStage,
    updateStage,
    nextStage,
    setStageError,
    reset
  };
}