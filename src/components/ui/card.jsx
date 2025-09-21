import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useSizeContext, sizeVariants } from "./size-provider"
import { combineElevationAndGlow } from "@/utils/glass-effects"

const cardVariants = cva(
  "border bg-card text-card-foreground transition-all duration-200",
  {
    variants: {
      glass: {
        none: "",
        minimal: "glass-minimal backdrop-blur-sm",
        subtle: "glass-subtle backdrop-blur-sm",
        medium: "glass-medium backdrop-blur-md",
        strong: "glass-strong backdrop-blur-lg",
        mica: "mica backdrop-blur-xl",
        acrylic: "acrylic backdrop-blur-2xl",
        fluent: "fluent-card backdrop-blur-lg",
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
        sm: "rounded-fluent-sm",
        md: "rounded-fluent-md",
        lg: "rounded-fluent-lg",
        xl: "rounded-fluent-xl",
        default: "rounded-xl",
      },
    },
    defaultVariants: {
      glass: "none",
      elevation: "1",
      glow: "none",
      glowColor: "celeste",
      radius: "default",
    },
  }
)

const Card = React.forwardRef(({
  className,
  glass,
  elevation,
  glow,
  glowColor,
  radius,
  ...props
}, ref) => {
  const { size } = useSizeContext()

  // Size-responsive glass and elevation
  const getResponsiveGlass = (glass) => {
    if (!glass || glass === 'none') return 'none'
    if (size === 'sm') {
      return glass === 'strong' || glass === 'mica' || glass === 'acrylic' ? 'minimal' : glass
    }
    return glass
  }

  const responsiveGlass = getResponsiveGlass(glass)
  const responsiveElevation = elevation || (size === 'sm' ? '1' : elevation || '2')

  // Combine elevation and glow when glow is active
  const boxShadow = glow !== 'none' ? combineElevationAndGlow(Number(responsiveElevation), glowColor, glow) : undefined

  return (
    <div
      ref={ref}
      className={cn(
        cardVariants({
          glass: responsiveGlass,
          elevation: boxShadow ? 'none' : responsiveElevation, // Skip elevation class when using combined shadow
          glow: 'none', // Skip glow class when using combined shadow
          glowColor,
          radius
        }),
        className
      )}
      style={boxShadow ? { boxShadow } : undefined}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => {
  const { size } = useSizeContext()
  const sizes = sizeVariants[size]

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5",
        sizes.card.padding,
        className
      )}
      {...props}
    />
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => {
  const { size } = useSizeContext()
  const sizes = sizeVariants[size]

  return (
    <div
      ref={ref}
      className={cn(
        "font-semibold leading-none tracking-tight",
        sizes.card.title,
        className
      )}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { size } = useSizeContext()
  const sizes = sizeVariants[size]

  return (
    <div
      ref={ref}
      className={cn(
        "text-foreground",
        sizes.card.description,
        className
      )}
      {...props}
    />
  )
})
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => {
  const { size } = useSizeContext()
  const sizes = sizeVariants[size]

  return (
    <div
      ref={ref}
      className={cn(
        sizes.card.content,
        className
      )}
      {...props}
    />
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => {
  const { size } = useSizeContext()
  const sizes = sizeVariants[size]

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center",
        sizes.card.footer,
        className
      )}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
