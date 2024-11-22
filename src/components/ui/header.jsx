import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const headerVariants = cva(
  "w-full flex items-center justify-between border-b transition-all duration-200",
  {
    variants: {
      size: {
        sm: "h-12 px-4 gap-4",
        md: "h-16 px-6 gap-6",
        lg: "h-20 px-8 gap-8",
        xl: "h-24 px-10 gap-10",
      },
      variant: {
        default: "bg-white border-gray-200",
        primary: "bg-primary text-primary-foreground border-primary/20",
        secondary: "bg-gray-900 text-white border-gray-800",
        success: "bg-emerald-500 text-white border-emerald-600",
        error: "bg-red-500 text-white border-red-600",
        warning: "bg-amber-500 text-white border-amber-600",
        info: "bg-blue-500 text-white border-blue-600",
        dark: "bg-gray-950 text-gray-200 border-gray-800",
        glass: "bg-white/70 backdrop-blur-md border-white/20 shadow-sm",
        gradient: "bg-gradient-to-r from-primary/90 to-primary text-primary-foreground border-transparent",
        "gradient-secondary": "bg-gradient-to-r from-gray-900 to-gray-800 text-white border-transparent",
        "gradient-success": "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-transparent",
        "gradient-error": "bg-gradient-to-r from-red-600 to-red-500 text-white border-transparent",
      },
      sticky: {
        true: "sticky top-0 z-50",
      },
      elevated: {
        true: "shadow-md",
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
    compoundVariants: [
      {
        variant: "glass",
        sticky: true,
        className: "backdrop-blur-lg bg-white/80"
      },
    ],
  }
)

const Header = React.forwardRef(({ 
  className, 
  size, 
  variant, 
  sticky,
  elevated,
  bordered,
  ...props 
}, ref) => {
  return (
    <header
      ref={ref}
      className={cn(headerVariants({ 
        size, 
        variant, 
        sticky,
        elevated,
        bordered,
        className 
      }))}
      {...props}
    />
  )
})
Header.displayName = "Header"

const HeaderLeft = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-4 min-w-fit", className)}
      {...props}
    />
  )
})
HeaderLeft.displayName = "HeaderLeft"

const HeaderCenter = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center flex-grow", className)}
      {...props}
    />
  )
})
HeaderCenter.displayName = "HeaderCenter"

const HeaderRight = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-end gap-4 min-w-fit", className)}
      {...props}
    />
  )
})
HeaderRight.displayName = "HeaderRight"

export { Header, HeaderLeft, HeaderCenter, HeaderRight, headerVariants }
