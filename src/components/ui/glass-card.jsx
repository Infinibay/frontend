import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useSizeContext } from "./size-provider"

/**
 * GlassCard Component Precedence Rules:
 *
 * 1. Effect variants (mica, acrylic, fluent) take precedence over glass variants
 * 2. When effect !== "none", glass variant is ignored to prevent background conflicts
 * 3. Glow shadows are applied as additional classes to override elevation shadows
 * 4. Size-based radius is used unless explicitly overridden
 */

const glassCardVariants = cva(
  "text-card-foreground transition-glass duration-300",
  {
    variants: {
      glass: {
        minimal: "glass-minimal",
        subtle: "glass-subtle",
        medium: "glass-medium",
        strong: "glass-strong",
        none: "bg-card border border-border shadow"
      },
      effect: {
        none: "",
        mica: "mica",
        acrylic: "acrylic",
        fluent: "fluent-card"
      },
      elevation: {
        0: "",
        1: "shadow-elevation-1",
        2: "shadow-elevation-2",
        3: "shadow-elevation-3",
        4: "shadow-elevation-4",
        5: "shadow-elevation-5"
      },
      // Remove glow variants - we'll handle them with Tailwind shadow classes
      radius: {
        sm: "radius-fluent-sm",
        md: "radius-fluent-md",
        lg: "radius-fluent-lg",
        xl: "radius-fluent-xl",
        default: "rounded-xl"
      }
    },
    defaultVariants: {
      glass: "minimal",
      effect: "none",
      elevation: 2,
      radius: "default"
    }
  }
)

const GlassCard = React.forwardRef(({
  className,
  glass,
  effect,
  elevation,
  glow = "none",
  glowColor = "celeste",
  radius,
  ...props
}, ref) => {
  const { size } = useSizeContext()

  // Use size-appropriate radius if not explicitly set
  const effectiveRadius = radius || "rounded-xl"

  // Generate glow shadow class if glow is specified
  const glowShadowClass = glow !== "none" ? `shadow-glow-${glowColor}-${glow}` : ""

  // Enforce precedence: if effect is specified, don't apply glass variant
  // Effect variants (mica, acrylic, fluent) take precedence over glass variants
  const effectiveGlass = effect !== "none" ? undefined : glass

  return (
    <div
      ref={ref}
      className={cn(
        glassCardVariants({
          glass: effectiveGlass, // Will be undefined if effect is set
          effect,
          elevation,
          radius: effectiveRadius
        }),
        // Apply glow shadow as additional class to override elevation
        glowShadowClass,
        // Apply accessibility fallbacks
        "supports-[not(backdrop-filter:blur(1px))]:bg-card/95 supports-[not(backdrop-filter:blur(1px))]:border supports-[not(backdrop-filter:blur(1px))]:border-border",
        // Reduced transparency support
        "motion-reduce:backdrop-blur-none motion-reduce:bg-card motion-reduce:border motion-reduce:border-border",
        className
      )}
      {...props}
    />
  )
})
GlassCard.displayName = "GlassCard"

const GlassCardHeader = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5",
        "size-spacing-container-header",
        className
      )}
      {...props}
    />
  )
})
GlassCardHeader.displayName = "GlassCardHeader"

const GlassCardTitle = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "leading-none tracking-tight",
        "size-heading",
        className
      )}
      {...props}
    />
  )
})
GlassCardTitle.displayName = "GlassCardTitle"

const GlassCardDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "text-foreground",
        "size-text",
        className
      )}
      {...props}
    />
  )
})
GlassCardDescription.displayName = "GlassCardDescription"

const GlassCardContent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "size-spacing-container-content",
        className
      )}
      {...props}
    />
  )
})
GlassCardContent.displayName = "GlassCardContent"

const GlassCardFooter = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center",
        "size-spacing-container-footer",
        className
      )}
      {...props}
    />
  )
})
GlassCardFooter.displayName = "GlassCardFooter"

// Preset glass card components for common use cases
const GlassDashboardCard = React.forwardRef((props, ref) => (
  <GlassCard
    ref={ref}
    glass="minimal"
    elevation={3}
    glow="subtle"
    glowColor="celeste"
    {...props}
  />
))
GlassDashboardCard.displayName = "GlassDashboardCard"

const GlassModalCard = React.forwardRef((props, ref) => (
  <GlassCard
    ref={ref}
    effect="acrylic"
    elevation={5}
    glow="medium"
    glowColor="dark-blue"
    radius="lg"
    {...props}
  />
))
GlassModalCard.displayName = "GlassModalCard"

const GlassHeroCard = React.forwardRef((props, ref) => (
  <GlassCard
    ref={ref}
    glass="minimal"
    elevation={4}
    glow="strong"
    glowColor="sun"
    radius="xl"
    {...props}
  />
))
GlassHeroCard.displayName = "GlassHeroCard"

const GlassSubtleCard = React.forwardRef((props, ref) => (
  <GlassCard
    ref={ref}
    effect="mica"
    elevation={1}
    glow="none"
    {...props}
  />
))
GlassSubtleCard.displayName = "GlassSubtleCard"

export {
  GlassCard,
  GlassCardHeader,
  GlassCardFooter,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  GlassDashboardCard,
  GlassModalCard,
  GlassHeroCard,
  GlassSubtleCard
}