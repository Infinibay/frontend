"use client"

import * as React from "react"
import { CheckIcon } from "@radix-ui/react-icons"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"
import { useSizeContext } from "./size-provider"
import { getCheckboxGlass, getFormFocusRing, getFormGlassTransition, getReducedTransparencyForm } from "@/utils/form-glass-effects"
import { useSafeResolvedTheme } from "@/utils/safe-theme"

const RadioGroup = React.forwardRef(({ className, size, ...props }, ref) => {
  const contextSize = useSizeContext()
  const effectiveSize = size || contextSize || 'md'

  const gapClasses = {
    sm: "gap-1.5",
    md: "gap-2",
    lg: "gap-3"
  }

  return (
    <RadioGroupPrimitive.Root
      className={cn("grid", gapClasses[effectiveSize], className)}
      {...props}
      ref={ref}
    />
  );
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef(({ className, size, glass = false, ...props }, ref) => {
  const contextSize = useSizeContext()
  const theme = useSafeResolvedTheme()
  const effectiveSize = size || contextSize || 'md'

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }

  const iconSizeClasses = {
    sm: "h-2.5 w-2.5",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4"
  }

  const glassClasses = getCheckboxGlass(glass, effectiveSize, theme)
  const focusRing = getFormFocusRing(theme, glass)
  const transition = getFormGlassTransition()
  const reducedTransparency = glass ? getReducedTransparencyForm(glassClasses) : ''

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square rounded-full border border-primary text-primary shadow-elevation-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:shadow-glow-subtle",
        sizeClasses[effectiveSize],
        glassClasses,
        reducedTransparency,
        focusRing,
        transition,
        "focus:outline-none",
        className
      )}
      {...props}>
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <CheckIcon className={cn("fill-primary", iconSizeClasses[effectiveSize])} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
