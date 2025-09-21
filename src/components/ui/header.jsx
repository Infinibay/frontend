"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useSizeContext, sizeVariants } from "./size-provider"
import { useAppTheme } from "@/contexts/ThemeProvider"
import {
  getHeaderGlass,
  getMicaNavigation,
  getAcrylicOverlay,
  getNavBrandGlow,
  getSunNavHighlight,
  debounceNavGlassTransition,
  getReducedTransparencyFallback,
  getThemeAwareHeaderGlass
} from "@/utils/navigation-glass"

const headerVariants = cva(
  "w-full flex items-center justify-between border-b border-border transition-all duration-200",
  {
    variants: {
      size: {
        sm: cn("h-12", sizeVariants.sm.padding, sizeVariants.sm.gap, sizeVariants.sm.text),
        md: cn("h-16", sizeVariants.md.padding, sizeVariants.md.gap, sizeVariants.md.text),
        lg: cn("h-20", sizeVariants.lg.padding, sizeVariants.lg.gap, sizeVariants.lg.text),
        xl: cn("h-24", sizeVariants.xl.padding, sizeVariants.xl.gap, sizeVariants.xl.text),
      },
      variant: {
        default: "bg-background text-foreground border-border",
        primary: "bg-primary text-primary-foreground border-primary/20",
        secondary: "bg-secondary text-secondary-foreground border-secondary/20",
        success: "bg-accent text-accent-foreground border-accent/20",
        error: "bg-destructive text-destructive-foreground border-destructive/20",
        warning: "bg-accent text-accent-foreground border-accent/20",
        info: "bg-primary text-primary-foreground border-primary/20",
        dark: "bg-muted text-muted-foreground border-muted/20",
        glass: "border-border/20",
        acrylic: "border-border/30",
        fluent: "border-brand-celeste/20",
        gradient: "bg-gradient-to-r from-primary/90 to-primary text-primary-foreground border-transparent",
        "gradient-secondary": "bg-gradient-to-r from-secondary/90 to-secondary text-secondary-foreground border-transparent",
        "gradient-success": "bg-gradient-to-r from-accent/90 to-accent text-accent-foreground border-transparent",
        "gradient-error": "bg-gradient-to-r from-destructive/90 to-destructive text-destructive-foreground border-transparent",
        "brand-primary": "bg-brand-dark-blue text-primary-foreground border-brand-dark-blue/20 glow-brand-dark-blue glow-subtle",
        "brand-secondary": "bg-brand-celeste text-primary-foreground border-brand-celeste/20 glow-brand-celeste glow-medium",
        "brand-accent": "bg-brand-sun text-primary-foreground border-brand-sun/20 glow-brand-sun glow-subtle",
      },
      sticky: {
        true: "sticky z-50 top-0",
      },
      elevated: {
        true: "shadow-md",
      },
      elevation: {
        1: "elevation-1",
        2: "elevation-2",
        3: "elevation-3",
        4: "elevation-4",
        5: "elevation-5",
      },
      glow: {
        celeste: "glow-brand-celeste glow-subtle",
        "dark-blue": "glow-brand-dark-blue glow-medium",
        sun: "glow-brand-sun glow-subtle",
      },
      glass: {
        subtle: "glass-subtle",
        medium: "glass-medium",
        strong: "glass-strong",
        mica: "mica",
        acrylic: "acrylic",
      },
      bordered: {
        true: "border",
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      sticky: false,
      elevated: false,
      bordered: true,
    },
    compoundVariants: [],
  }
)

const Header = React.forwardRef(({
  className,
  size: sizeProp,
  variant,
  sticky,
  elevated,
  bordered,
  elevation,
  glow,
  glass,
  reducedTransparency = false,
  ...props
}, ref) => {
  const { size: contextSize } = useSizeContext()
  const { resolvedTheme } = useAppTheme()
  const size = sizeProp || contextSize

  // If glass prop is provided, override any glass-related variant
  const effectiveVariant = glass ? (variant === 'glass' || variant === 'acrylic' || variant === 'fluent' ? 'default' : variant) : variant

  // Get theme-aware glass classes for glass variants
  const getThemeAwareGlassClasses = () => {
    if (variant === 'glass') {
      return getThemeAwareHeaderGlass(resolvedTheme, sticky)
    }
    if (variant === 'acrylic') {
      return getAcrylicOverlay(resolvedTheme)
    }
    if (variant === 'fluent') {
      return `fluent-card ${getThemeAwareHeaderGlass(resolvedTheme, sticky)} border-brand-celeste/20 glow-brand-celeste glow-subtle`
    }
    return ''
  }

  return (
    <header
      ref={ref}
      className={cn(headerVariants({
        size,
        variant: effectiveVariant,
        sticky,
        elevated,
        bordered,
        elevation,
        glow,
        glass
      }),
      // Apply theme-aware glass classes for glass variants
      (variant === 'glass' || variant === 'acrylic' || variant === 'fluent') && getThemeAwareGlassClasses(),
      // Apply subtle shadow for glass variants when not elevated
      (variant === 'glass' || variant === 'acrylic' || variant === 'fluent') && !elevated && 'shadow-sm',
      ((variant === 'glass' || variant === 'acrylic' || variant === 'fluent') || glass) && getReducedTransparencyFallback(),
      ((variant === 'glass' || variant === 'acrylic' || variant === 'fluent') || glass) && debounceNavGlassTransition(),
      className)}
      style={{
        ...props.style
      }}
      data-reduced-transparency={reducedTransparency ? 'true' : undefined}
      {...props}
    />
  )
})
Header.displayName = "Header"

const HeaderLeft = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-inherit min-w-fit [&>*]:flex [&>*]:items-center", className)}
      {...props}
    />
  )
})
HeaderLeft.displayName = "HeaderLeft"

const HeaderCenter = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center flex-grow gap-inherit [&>*]:flex [&>*]:items-center", className)}
      {...props}
    />
  )
})
HeaderCenter.displayName = "HeaderCenter"

const HeaderRight = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-end gap-inherit min-w-fit [&>*]:flex [&>*]:items-center", className)}
      {...props}
    />
  )
})
HeaderRight.displayName = "HeaderRight"

export { Header, HeaderLeft, HeaderCenter, HeaderRight, headerVariants }
