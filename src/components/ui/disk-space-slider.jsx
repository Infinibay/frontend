'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { HardDrive } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function DiskSpaceSlider({ 
  total = 1000, 
  used = 200, 
  available = 800,
  value = 50,
  onChange,
  min = 10,
  max,
  step = 10,
  label = "Storage",
  color = "purple"
}) {
  // Calculate the maximum value the user can select (available space)
  const maxSelectable = Math.min(max || available, available);
  
  // Calculate percentages for visualization
  const usedPercentage = (used / total) * 100;
  const availablePercentage = (available / total) * 100;
  const selectedPercentage = (value / total) * 100;
  
  // Ensure value is within bounds
  const clampedValue = Math.min(Math.max(value, min), maxSelectable);
  
  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value);
    if (onChange) {
      onChange(Math.min(newValue, maxSelectable));
    }
  };
  
  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value) || min;
    if (onChange) {
      onChange(Math.min(Math.max(newValue, min), maxSelectable));
    }
  };

  const colorVariants = {
    purple: {
      icon: "text-purple-500",
      label: "text-purple-600",
      slider: "accent-purple-500",
      input: "border-purple-200 focus:border-purple-500",
      used: "bg-red-500/90",
      selected: "bg-purple-500/90",
      available: "bg-purple-200/50",
      unavailable: "bg-gray-200"
    },
    blue: {
      icon: "text-blue-500",
      label: "text-blue-600",
      slider: "accent-blue-500",
      input: "border-blue-200 focus:border-blue-500",
      used: "bg-red-500",
      selected: "bg-blue-500",
      available: "bg-blue-200",
      unavailable: "bg-gray-300"
    },
    green: {
      icon: "text-green-500",
      label: "text-green-600",
      slider: "accent-green-500",
      input: "border-green-200 focus:border-green-500",
      used: "bg-red-500",
      selected: "bg-green-500",
      available: "bg-green-200",
      unavailable: "bg-gray-300"
    }
  };
  
  const colors = colorVariants[color] || colorVariants.purple;

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium">
        <HardDrive className={cn("h-4 w-4", colors.icon)} />
        {label}: <span className={cn("font-bold text-base", colors.label)}>{clampedValue} GB</span>
        <span className="text-xs text-muted-foreground ml-auto">
          {available} GB available of {total} GB total
        </span>
      </Label>
      
      {/* Visual disk usage bar */}
      <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden border">
        {/* Used space (system/other) */}
        {used > 0 && (
          <div 
            className={cn("absolute left-0 top-0 h-full flex items-center justify-center", colors.used)}
            style={{ width: `${usedPercentage}%` }}
            title={`${used} GB used by system`}
          >
            {usedPercentage > 15 && (
              <span className="text-xs font-semibold text-white px-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                {usedPercentage > 25 ? `System: ${used} GB` : `${used} GB`}
              </span>
            )}
          </div>
        )}
        
        {/* Selected space */}
        {clampedValue > 0 && (
          <div 
            className={cn("absolute top-0 h-full flex items-center justify-center transition-all duration-200", colors.selected)}
            style={{ 
              left: `${usedPercentage}%`,
              width: `${selectedPercentage}%` 
            }}
            title={`${clampedValue} GB selected`}
          >
            {selectedPercentage > 15 && (
              <span className="text-xs font-semibold text-white px-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                {selectedPercentage > 25 ? `Selected: ${clampedValue} GB` : `${clampedValue} GB`}
              </span>
            )}
          </div>
        )}
        
        {/* Available but not selected space */}
        <div 
          className={cn("absolute top-0 h-full flex items-center justify-center", colors.available)}
          style={{ 
            left: `${usedPercentage + selectedPercentage}%`,
            width: `${availablePercentage - selectedPercentage}%` 
          }}
          title={`${available - clampedValue} GB remaining available`}
        >
          {(availablePercentage - selectedPercentage) > 15 && (
            <span className="text-xs font-semibold text-gray-800 px-1">
              {(availablePercentage - selectedPercentage) > 25 ? `Free: ${available - clampedValue} GB` : `${available - clampedValue} GB`}
            </span>
          )}
        </div>
        
        {/* Unavailable space (if total > used + available due to reserved space) */}
        {(total - used - available) > 0 && (
          <div 
            className={cn("absolute right-0 top-0 h-full", colors.unavailable)}
            style={{ 
              width: `${((total - used - available) / total) * 100}%` 
            }}
            title={`${total - used - available} GB reserved/unavailable`}
          >
            <div className="absolute inset-0 bg-stripes opacity-10" />
          </div>
        )}
      </div>
      
      {/* Slider and input */}
      <div className="flex items-center gap-4">
        <Input
          type="range"
          value={clampedValue}
          onChange={handleSliderChange}
          min={min}
          max={maxSelectable}
          step={step}
          className={cn("flex-1", colors.slider)}
          style={{
            background: `linear-gradient(to right, 
              var(--tw-colors-${color}-500) 0%, 
              var(--tw-colors-${color}-500) ${(clampedValue - min) / (maxSelectable - min) * 100}%, 
              #e5e7eb ${(clampedValue - min) / (maxSelectable - min) * 100}%, 
              #e5e7eb 100%)`
          }}
        />
        <Input
          type="number"
          value={clampedValue}
          onChange={handleInputChange}
          className={cn("w-24", colors.input)}
          min={min}
          max={maxSelectable}
          step={step}
        />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Min: {min} GB</span>
        <span>Max available: {maxSelectable} GB</span>
      </div>
      
      {/* Legend */}
      <div className="flex gap-4 text-xs mt-2">
        <div className="flex items-center gap-1">
          <div className={cn("w-3 h-3 rounded", colors.used)} />
          <span>System Used</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={cn("w-3 h-3 rounded", colors.selected)} />
          <span>Your Selection</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={cn("w-3 h-3 rounded", colors.available)} />
          <span>Available</span>
        </div>
        {(total - used - available) > 0 && (
          <div className="flex items-center gap-1">
            <div className={cn("w-3 h-3 rounded", colors.unavailable)} />
            <span>Reserved</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Add CSS for striped pattern (only on client side)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const existingStyle = document.getElementById('disk-space-slider-styles');
  if (!existingStyle) {
    const style = document.createElement('style');
    style.id = 'disk-space-slider-styles';
    style.textContent = `
      .bg-stripes {
        background-image: repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          rgba(0,0,0,0.1) 10px,
          rgba(0,0,0,0.1) 20px
        );
      }
    `;
    document.head.appendChild(style);
  }
}