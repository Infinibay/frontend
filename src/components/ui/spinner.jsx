"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const speedVariants = {
  slow: "animate-[spin_3s_linear_infinite]",
  medium: "animate-[spin_1.5s_linear_infinite]",
  fast: "animate-[spin_0.75s_linear_infinite]",
};

const sizeVariants = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

const Spinner = React.forwardRef(({ 
  className,
  speed = "medium",
  style = "circular",
  size = "md",
  ...props 
}, ref) => {
  // Common classes for all spinners
  const baseClasses = cn(
    sizeVariants[size],
    speedVariants[speed],
    className
  );

  // Circular Spinner (Default)
  if (style === "circular") {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-block border-2 rounded-full border-current",
          "border-r-transparent border-b-transparent",
          baseClasses
        )}
        {...props}
      />
    );
  }

  // Windows Spinner
  if (style === "windows") {
    return (
      <div ref={ref} className={cn("relative flex items-center justify-center", sizeVariants[size], className)} {...props}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-[15%] h-[15%] rounded-full",
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
        className={cn("flex items-center gap-1", sizeVariants[size], className)}
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
          "relative rounded-full",
          baseClasses,
          className
        )}
        {...props}
      >
        <div 
          className="absolute inset-0 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]"
          style={{ backgroundColor: 'currentColor' }}
        />
        <div 
          className="absolute inset-0 rounded-full animate-[pulse_1.5s_ease-in-out_infinite] delay-500"
          style={{ backgroundColor: 'currentColor', opacity: 0.7 }}
        />
      </div>
    );
  }

  // Default to circular if invalid style
  return (
    <div
      ref={ref}
      className={cn(
        "inline-block border-2 rounded-full border-current",
        "border-r-transparent border-b-transparent",
        baseClasses
      )}
      {...props}
    />
  );
});

Spinner.displayName = "Spinner";

export { Spinner };
