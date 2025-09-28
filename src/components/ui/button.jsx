"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useSizeContext } from "./size-provider"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap radius-fluent-md font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-input bg-background text-foreground hover:bg-accent/10 hover:border-ring/30 active:bg-accent/20",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        outline:
          "border-2 border-input bg-transparent hover:bg-accent/10 hover:border-ring/30 active:bg-accent/20",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/70",
        ghost: "hover:bg-accent/10 hover:text-foreground active:bg-accent/20",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/90 active:text-primary/70",
        success:
          "bg-accent text-accent-foreground hover:bg-accent/90 active:bg-accent/80",
        error:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        info:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        warning:
          "bg-accent text-accent-foreground hover:bg-accent/90 active:bg-accent/80",
      },
      glass: {
        none: "",
        subtle: "glass-subtle backdrop-blur-sm",
        medium: "glass-medium backdrop-blur-md",
        strong: "glass-strong backdrop-blur-lg",
        mica: "mica backdrop-blur-xl",
        acrylic: "acrylic backdrop-blur-2xl",
      },
      size: {
        sm: "size-padding size-text size-height [&>svg]:size-icon",
        md: "size-padding size-text size-height [&>svg]:size-icon",
        lg: "size-padding size-text size-height [&>svg]:size-icon",
        xl: "size-padding size-text size-height [&>svg]:size-icon",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      glass: "none",
    },
  }
)

/**
 * Button component with multiple variants, sizes, and glass effects
 * Supports responsive sizing and elevation states
 */
const Button = React.forwardRef(({
  className,
  size: sizeProp,
  variant,
  glass: glassProp,
  asChild = false,
  ...props
}, ref) => {
  const { size: contextSize, getSizeClassName } = useSizeContext()
  const size = sizeProp || contextSize

  // Size-responsive glass intensity
  const getResponsiveGlass = (glass) => {
    if (!glass || glass === 'none') return 'none'
    if (size === 'sm') {
      return glass === 'strong' || glass === 'mica' || glass === 'acrylic' ? 'medium' : glass
    }
    return glass
  }

  // Size-responsive elevation adjustments
  const getElevationClasses = () => {
    if (variant === 'ghost' || variant === 'link') return ''

    const baseElevation = size === 'sm' ? 'shadow-elevation-1' : 'shadow-elevation-1'
    const hoverElevation = size === 'sm' ? 'hover:shadow-elevation-1' : 'hover:shadow-elevation-2'

    return `${baseElevation} ${hoverElevation}`
  }

  const glass = getResponsiveGlass(glassProp)
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(
        buttonVariants({ size, variant, glass, className }),
        getElevationClasses(),
        sizeProp && getSizeClassName(sizeProp)
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
export default Button
