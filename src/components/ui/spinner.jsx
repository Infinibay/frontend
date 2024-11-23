"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useSizeContext, sizeVariants } from "./size-provider";

const speedVariants = {
  slow: "animate-[spin_3s_linear_infinite]",
  medium: "animate-[spin_1.5s_linear_infinite]",
  fast: "animate-[spin_0.75s_linear_infinite]",
};

const spinnerSizeVariants = {
  sm: "w-4 h-4 border",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-2",
  xl: "w-10 h-10 border-3",
};

const windowsSizeVariants = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-10 h-10"
};

const Spinner = React.forwardRef(({ 
  className,
  speed = "medium",
  style = "circular",
  size: sizeProp,
  ...props 
}, ref) => {
  const { size: contextSize } = useSizeContext();
  const size = sizeProp || contextSize || "md";
  
  // Common classes for all spinners
  const baseClasses = cn(
    spinnerSizeVariants[size],
    speedVariants[speed],
    className
  );

  // Get icon size from sizeVariants for consistent sizing
  const iconSize = sizeVariants[size]?.icon?.size;

  // Circular Spinner (Default)
  if (style === "circular") {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-block rounded-full border-current",
          "border-r-transparent border-b-transparent",
          baseClasses
        )}
        {...props}
      />
    );
  }

  // Windows Spinner
  if (style === "windows") {
    const dotSizeClasses = {
      sm: "w-1 h-1",
      md: "w-1.5 h-1.5",
      lg: "w-2 h-2",
      xl: "w-2.5 h-2.5"
    };

    return (
      <div 
        ref={ref} 
        className={cn(
          "relative flex items-center justify-center", 
          windowsSizeVariants[size],
          className
        )} 
        {...props}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute rounded-full",
              dotSizeClasses[size],
              "animate-[fade_1.5s_linear_infinite]"
            )}
            style={{
              backgroundColor: 'currentColor',
              opacity: 1 - (i * 0.1),
              transform: `rotate(${i * 45}deg) translate(150%)`,
              animationDelay: `${-i * 0.125}s`,
            }}
          />
        ))}
      </div>
    );
  }

  // Beat Spinner
  if (style === "beat") {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-1", 
          iconSize,
          className
        )}
        {...props}
      >
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-full rounded-full",
              "animate-[beat_1.5s_ease-in-out_infinite]"
            )}
            style={{
              backgroundColor: 'currentColor',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    );
  }

  // Pulse Spinner
  if (style === "pulse") {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center justify-center",
          iconSize,
          className
        )}
        {...props}
      >
        <div className={cn(
          "absolute rounded-full bg-current animate-[pulse_1.5s_ease-in-out_infinite]",
          "w-full h-full opacity-75"
        )} />
        <div className={cn(
          "absolute rounded-full bg-current animate-[pulse_1.5s_ease-in-out_infinite_0.4s]",
          "w-2/3 h-2/3 opacity-50"
        )} />
      </div>
    );
  }

  return null;
});

Spinner.displayName = "Spinner";

export { Spinner };
