import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, TestTube, Construction } from 'lucide-react';

const MockDataBadge = ({ 
  variant = 'default',
  size = 'default',
  className,
  children,
  icon: Icon,
  position = 'inline'
}) => {
  const variants = {
    default: 'bg-orange-100 text-orange-800 border-orange-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    subtle: 'bg-muted text-muted-foreground border-border',
  };

  const sizes = {
    sm: 'text-xs px-1.5 py-0.5',
    default: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1.5',
  };

  const positions = {
    inline: '',
    'top-right': 'absolute top-2 right-2 z-10',
    'top-left': 'absolute top-2 left-2 z-10',
    'bottom-right': 'absolute bottom-2 right-2 z-10',
    'bottom-left': 'absolute bottom-2 left-2 z-10',
  };

  const IconComponent = Icon || TestTube;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-md border',
        variants[variant],
        sizes[size],
        positions[position],
        className
      )}
    >
      <IconComponent className="h-3 w-3" />
      <span>{children || 'Mock Data'}</span>
    </span>
  );
};

// Wrapper component to mark entire sections as mock
const MockDataSection = ({ 
  children, 
  className,
  showBadge = true,
  badgeProps = {},
  message = 'This section displays mock data'
}) => {
  return (
    <div className={cn('relative', className)}>
      {showBadge && (
        <MockDataBadge 
          position="top-right" 
          variant="default"
          {...badgeProps}
        >
          {message}
        </MockDataBadge>
      )}
      {children}
    </div>
  );
};

// Inline indicator for small mock values
const MockDataIndicator = ({ 
  children,
  showIndicator = true,
  tooltip = 'Mock data'
}) => {
  if (!showIndicator) return children;
  
  return (
    <span className="relative inline-flex items-center gap-1 group">
      {children}
      <span 
        className="inline-flex items-center justify-center w-3 h-3 text-orange-600"
        title={tooltip}
      >
        <TestTube className="h-3 w-3" />
      </span>
    </span>
  );
};

export { MockDataBadge, MockDataSection, MockDataIndicator };
export default MockDataBadge;