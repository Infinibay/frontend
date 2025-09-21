"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"
import { useSizeContext } from "./size-provider"
import { getSwitchGlass, getFormFocusRing, getFormGlassTransition, getReducedTransparencyForm } from "@/utils/form-glass-effects"
import { useSafeResolvedTheme } from "@/utils/safe-theme"

const Switch = React.forwardRef(({ className, size, glass = false, ...props }, ref) => {
  const contextSize = useSizeContext()
  const theme = useSafeResolvedTheme()
  const effectiveSize = size || contextSize || 'md'

  const sizeClasses = {
    sm: "h-4 w-7",
    md: "h-5 w-9",
    lg: "h-6 w-11"
  }

  const thumbSizeClasses = {
    sm: "h-3 w-3 data-[state=checked]:translate-x-3",
    md: "h-4 w-4 data-[state=checked]:translate-x-4",
    lg: "h-5 w-5 data-[state=checked]:translate-x-5"
  }

  const glassEffect = getSwitchGlass(glass, effectiveSize, theme)
  const focusRing = getFormFocusRing(theme, glass)
  const transition = getFormGlassTransition()
  const reducedTransparency = glass ? getReducedTransparencyForm(glassEffect.track) : ''

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center radius-fluent-md border-2 border-transparent shadow-elevation-1 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:shadow-glow-subtle data-[state=unchecked]:bg-input",
        sizeClasses[effectiveSize],
        glassEffect.track,
        reducedTransparency,
        focusRing,
        transition,
        "focus-visible:outline-none",
        className
      )}
      {...props}
      ref={ref}>
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-background shadow-elevation-2 ring-0 data-[state=unchecked]:translate-x-0",
          thumbSizeClasses[effectiveSize],
          glassEffect.thumb,
          transition
        )} />
    </SwitchPrimitives.Root>
  )
})
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
