'use client';

import { cn } from '@/lib/utils';

export function LoadingOverlay({ 
  message = 'Please wait...', 
  variant = 'default',
  size = 'default',
  className 
}) {
  return (
    <div className={cn(
      'fixed inset-0 bg-background/80 backdrop-blur-sm z-[9999]',
      'flex items-center justify-center',
      className
    )}>
      <div className="text-center space-y-4">
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
        <p className="text-foreground/70">{message}</p>
      </div>
    </div>
  );
}
