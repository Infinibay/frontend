"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useSizeContext } from "./size-provider"
import { getProgressGlass, getProgressGlassTrack, getProgressGlassIndicator, getDataGlassAnimation, getReducedTransparencyForm } from "@/utils/form-glass-effects"
import { useSafeResolvedTheme } from "@/utils/safe-theme"

const progressVariants = cva(
  "relative w-full overflow-hidden radius-fluent-sm shadow-elevation-1",
  {
    variants: {
      variant: {
        default: "bg-primary/20",
        success: "bg-accent/20",
        warning: "bg-accent/20",
        error: "bg-destructive/20"
      },
      size: {
        sm: "h-1.5",
        md: "h-2",
        lg: "h-3"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
)

const indicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-accent",
        warning: "bg-accent",
        error: "bg-destructive"
      },
      glow: {
        true: "shadow-glow-subtle",
        false: ""
      },
      striped: {
        true: "bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_100%] bg-repeat-x",
        false: ""
      },
      animated: {
        true: "animate-pulse",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      glow: false,
      striped: false,
      animated: false
    }
  }
)

const Progress = React.forwardRef(({
  className,
  value,
  variant = "default",
  size,
  glass = false,
  glow = false,
  animated = true,
  striped = false,
  ...props
}, ref) => {
  const contextSize = useSizeContext()
  const theme = useSafeResolvedTheme()
  const effectiveSize = size || contextSize || 'md'

  const glassEffect = getProgressGlass(variant, glass, theme)
  const trackGlass = getProgressGlassTrack(variant, glass, theme)
  const indicatorGlass = getProgressGlassIndicator(variant, glass, value, theme)
  const animation = getDataGlassAnimation()
  const reducedTransparency = glass ? getReducedTransparencyForm(trackGlass) : ''

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        progressVariants({ variant, size: effectiveSize }),
        glass && trackGlass,
        glass && reducedTransparency,
        animated && animation,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          indicatorVariants({ variant, glow, striped, animated: striped && animated }),
          glass && indicatorGlass,
          animated && !striped && "transition-transform duration-500 ease-out",
          striped && animated && "animate-[progress-stripes_1s_linear_infinite]"
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
