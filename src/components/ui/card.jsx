import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useSizeContext } from "./size-provider"
import { combineElevationAndGlow, getBrandGlow } from "@/utils/glass-effects"

const cardVariants = cva(
  "border bg-card text-card-foreground transition-all duration-200",
  {
    variants: {
      glass: {
        none: "",
        minimal: "glass-minimal",
        subtle: "glass-subtle",
        medium: "glass-medium",
        strong: "glass-strong",
      },
      effect: {
        none: "",
        mica: "mica",
        acrylic: "acrylic",
        fluent: "fluent-card",
      },
      elevation: {
        none: "",
        1: "shadow-elevation-1",
        2: "shadow-elevation-2",
        3: "shadow-elevation-3",
        4: "shadow-elevation-4",
        5: "shadow-elevation-5",
      },
      glow: {
        none: "",
        subtle: "glow-subtle",
        medium: "glow-medium",
        strong: "glow-strong",
      },
      glowColor: {
        celeste: "glow-celeste",
        "dark-blue": "glow-dark-blue",
        sun: "glow-sun",
      },
      radius: {
        sm: "radius-fluent-sm",
        md: "radius-fluent-md",
        lg: "radius-fluent-lg",
        xl: "radius-fluent-xl",
        default: "radius-fluent-lg",
      },
    },
    defaultVariants: {
      glass: "none",
      effect: "none",
      elevation: "1",
      glow: "none",
      glowColor: "celeste",
      radius: "lg",
    },
  }
)

/**
 * Card component with responsive glass effects.
 *
 * @param {boolean} forceGlass - When true, bypasses responsive glass downgrading.
 * Useful for components like SelectionCard that need to maintain strong glass effects
 * on small screens for design consistency.
 */
const Card = React.forwardRef(({
  className,
  glass,
  effect,
  elevation,
  glow,
  glowColor,
  radius,
  forceGlass = false,
  ...props
}, ref) => {
  const { size } = useSizeContext()

  // Size-responsive glass and elevation
  const getResponsiveGlass = (glass) => {
    if (!glass || glass === 'none') return 'none'
    if (forceGlass) return glass // Bypass responsive behavior when forceGlass is true
    if (size === 'sm') {
      return glass === 'strong' ? 'minimal' : glass
    }
    return glass
  }

  const responsiveGlass = getResponsiveGlass(glass)
  const responsiveElevation = elevation || (size === 'sm' ? '1' : elevation || '2')

  // Enforce precedence: if effect is specified, don't apply glass variant
  const effectiveGlass = effect !== 'none' ? undefined : responsiveGlass

  // Combine elevation and glow when glow is active
  const elevationLevel = responsiveElevation === 'none' ? 0 : Number(responsiveElevation)
  const boxShadow = glow !== 'none'
    ? (elevationLevel === 0
        ? getBrandGlow(glowColor, glow)
        : combineElevationAndGlow(elevationLevel, glowColor, glow)
      )
    : undefined

  return (
    <div
      ref={ref}
      className={cn(
        cardVariants({
          glass: effectiveGlass,
          effect,
          elevation: boxShadow ? 'none' : responsiveElevation, // Skip elevation class when using combined shadow
          glow: 'none', // Skip glow class when using combined shadow
          glowColor,
          radius
        }),
        // Apply backdrop-filter fallbacks
        "supports-[not(backdrop-filter:blur(1px))]:bg-card/95 supports-[not(backdrop-filter:blur(1px))]:border supports-[not(backdrop-filter:blur(1px))]:border-border",
        // Motion-reduce fallbacks
        "motion-reduce:backdrop-blur-none motion-reduce:bg-card motion-reduce:border motion-reduce:border-border",
        className
      )}
      style={boxShadow ? { boxShadow } : undefined}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5",
        "size-card-padding",
        className
      )}
      {...props}
    />
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "font-semibold leading-none tracking-tight",
        "size-card-title",
        className
      )}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "text-foreground",
        "size-card-description",
        className
      )}
      {...props}
    />
  )
})
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "size-card-content",
        className
      )}
      {...props}
    />
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center",
        "size-card-footer",
        className
      )}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
