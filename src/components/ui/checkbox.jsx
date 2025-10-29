"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { useSizeContext } from "./size-provider"

const Checkbox = React.forwardRef(({ className, size, ...props }, ref) => {
  const contextSize = useSizeContext()
  const effectiveSize = size || contextSize || 'md'

  const sizeClasses = {
    sm: "h-5 w-5 min-h-5 min-w-5",
    md: "h-5 w-5 min-h-5 min-w-5",
    lg: "h-6 w-6 min-h-6 min-w-6"
  }

  const iconSizeClasses = {
    sm: "h-3 w-3",
    md: "h-3 w-3",
    lg: "h-4 w-4"
  }

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "group peer shrink-0 relative inline-flex items-center justify-center rounded-full transition-all duration-200",
        // Unchecked state
        "bg-muted/50 border-2 border-muted-foreground/30",
        // Checked state
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        // Hover states
        "hover:border-muted-foreground/50 data-[state=checked]:hover:bg-primary/90",
        // Focus
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses[effectiveSize],
        className
      )}
      {...props}
    >
      {/* Always render icon with fixed size, control visibility with group-data pattern */}
      <CheckIcon
        className={cn(
          "text-primary-foreground transition-opacity duration-200",
          // Hidden when unchecked, visible when checked using group-data pattern
          "opacity-0 group-data-[state=checked]:opacity-100",
          iconSizeClasses[effectiveSize]
        )}
      />
      {/* Keep Indicator for accessibility but hide it visually */}
      <CheckboxPrimitive.Indicator className="hidden" />
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
