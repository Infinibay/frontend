"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { useSizeContext } from "./size-provider"
import { getCheckboxGlass, getFormFocusRing, getFormGlassTransition, getReducedTransparencyForm } from "@/utils/form-glass-effects"
import { useSafeResolvedTheme } from "@/utils/safe-theme"

const Checkbox = React.forwardRef(({ className, size, glass = false, ...props }, ref) => {
  const contextSize = useSizeContext()
  const theme = useSafeResolvedTheme()
  const effectiveSize = size || contextSize || 'md'

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }

  const iconSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }

  const glassClasses = getCheckboxGlass(glass, effectiveSize, theme)
  const focusRing = getFormFocusRing(theme, glass)
  const transition = getFormGlassTransition()
  const reducedTransparency = glass ? getReducedTransparencyForm(glassClasses) : ''

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer shrink-0 radius-fluent-sm border border-primary shadow-elevation-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:shadow-glow-subtle",
        sizeClasses[effectiveSize],
        glassClasses,
        reducedTransparency,
        focusRing,
        transition,
        "focus-visible:outline-none",
        className
      )}
      {...props}>
      <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
        <CheckIcon className={iconSizeClasses[effectiveSize]} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
