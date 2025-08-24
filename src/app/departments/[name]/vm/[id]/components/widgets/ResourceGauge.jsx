import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const ResourceGauge = ({ 
  label, 
  value, 
  max = 100, 
  unit = '%', 
  color = 'blue',
  showThreshold = true 
}) => {
  const percentage = (value / max) * 100;
  
  // Determine color based on threshold
  const getColor = () => {
    if (!showThreshold) return color;
    
    if (percentage > 90) return 'red';
    if (percentage > 70) return 'yellow';
    return 'green';
  };
  
  const currentColor = getColor();
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-bold">
          {value}{unit}
        </span>
      </div>
      <div className="relative">
        <Progress 
          value={percentage} 
          className="h-3"
        />
        <div 
          className={cn(
            "absolute top-0 left-0 h-full rounded-full transition-all",
            colorClasses[currentColor]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showThreshold && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>{max / 2}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};

export default ResourceGauge;