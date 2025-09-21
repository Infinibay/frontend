"use client"

import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"
import { useSizeContext, sizeVariants } from "./size-provider"
import { getBadgeGlass, getBadgeGlassVariant, getDataGlassAnimation, getReducedTransparencyForm } from "@/utils/form-glass-effects"
import { useSafeResolvedTheme } from "@/utils/safe-theme"

const badgeVariants = cva(
  "inline-flex items-center radius-fluent-sm border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-elevation-1",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        glass: "glass-minimal border-transparent bg-primary/20 text-primary backdrop-blur-sm hover:bg-primary/30",
        "glass-secondary": "glass-minimal border-transparent bg-secondary/20 text-secondary-foreground backdrop-blur-sm hover:bg-secondary/30",
        "glass-destructive": "glass-minimal border-transparent bg-destructive/20 text-destructive backdrop-blur-sm hover:bg-destructive/30",
        "brand-primary": "border-transparent bg-brand-dark-blue text-white shadow hover:bg-brand-dark-blue/80",
        "brand-celeste": "border-transparent bg-brand-celeste text-brand-dark-blue shadow hover:bg-brand-celeste/80",
        "brand-sun": "border-transparent bg-brand-sun text-brand-dark-blue shadow hover:bg-brand-sun/80",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

const Badge = React.forwardRef(({
  className,
  variant,
  size,
  glass = false,
  ...props
}, ref) => {
  const contextSize = useSizeContext()
  const theme = useSafeResolvedTheme()
  const effectiveSize = size || contextSize || 'md'
  const animation = getDataGlassAnimation()

  // If glass is enabled but variant doesn't include glass, convert to glass variant
  const effectiveVariant = glass && !variant?.includes('glass') && variant !== 'outline'
    ? `glass${variant === 'default' ? '' : `-${variant}`}`
    : variant

  const glassEffect = getBadgeGlass(effectiveVariant, glass, theme)
  const reducedTransparency = glass ? getReducedTransparencyForm(glassEffect) : ''

  return (
    <div
      ref={ref}
      className={cn(
        badgeVariants({ variant: effectiveVariant, size: effectiveSize }),
        glass && animation,
        glass && reducedTransparency,
        className
      )}
      {...props}
    />
  );
})
Badge.displayName = "Badge"

export { Badge, badgeVariants }
