import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AlertBanner = ({ 
  variant = 'default', 
  title, 
  description, 
  onDismiss,
  className,
  actions = []
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const variantClasses = {
    default: '',
    destructive: 'border-red-500 bg-red-50 dark:bg-red-950',
    warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950',
    success: 'border-green-500 bg-green-50 dark:bg-green-950'
  };

  return (
    <Alert 
      variant={variant} 
      className={cn(variantClasses[variant], className)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2 flex-1">
          {getIcon()}
          <div className="flex-1">
            <AlertTitle>{title}</AlertTitle>
            {description && (
              <AlertDescription className="mt-1">
                {description}
              </AlertDescription>
            )}
            {actions.length > 0 && (
              <div className="flex gap-2 mt-3">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant={action.variant || 'outline'}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
        {onDismiss && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
};

export default AlertBanner;