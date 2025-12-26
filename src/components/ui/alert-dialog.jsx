"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useSizeContext } from "./size-provider"
import { useSafeResolvedTheme } from "@/utils/safe-theme"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => {
  const { theme } = useSafeResolvedTheme()
  const isDark = theme === 'dark'
  const blurClass = isDark ? 'backdrop-blur-md' : 'backdrop-blur-lg'

  return (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-1000 glass-strong",
        blurClass,
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:backdrop-blur-none",
        "transition-all duration-200",
        className
      )}
      {...props} />
  )
})
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const alertDialogContentVariants = cva(
  "fixed left-[50%] top-[50%] z-1000 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border bg-background duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
  {
    variants: {
      glass: {
        none: "",
        subtle: "glass-subtle backdrop-blur-sm",
        medium: "glass-medium backdrop-blur-md",
        strong: "glass-strong backdrop-blur-lg",
      },
    },
    defaultVariants: {
      glass: "medium",
    },
  }
)

const AlertDialogContent = React.forwardRef(({ className, glass, ...props }, ref) => {
  const { size: contextSize } = useSizeContext();

  // Size-responsive glass intensity
  const getResponsiveGlass = (glass) => {
    if (!glass || glass === 'none') return 'none'
    if (contextSize === 'sm') {
      return glass === 'strong' ? 'medium' : glass
    }
    return glass
  }

  // Size-responsive radius and elevation
  const getFluentRadius = () => {
    switch(contextSize) {
      case 'sm': return 'radius-fluent-md'
      case 'md':
      case 'lg': return 'radius-fluent-lg'
      case 'xl': return 'radius-fluent-xl'
      default: return 'radius-fluent-lg'
    }
  }

  const getElevation = () => {
    return contextSize === 'sm' ? 'shadow-elevation-4' : 'shadow-elevation-5'
  }

  const responsiveGlass = getResponsiveGlass(glass)

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          alertDialogContentVariants({ glass: responsiveGlass }),
          "size-padding",
          getFluentRadius(),
          getElevation(),
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
})
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col space-y-2 text-center sm:text-left",
        "size-gap",
        className
      )}
      {...props}
    />
  )
}
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end",
        "size-gap",
        className
      )}
      {...props}
    />
  )
}
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Title
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
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={cn(
        "text-muted-foreground",
        "size-text",
        className
      )}
      {...props}
    />
  )
})
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef(({ className, variant, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Action
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium",
        "transition-colors focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        "px-4 py-2 text-sm",
        variant === "destructive"
          ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
          : "bg-primary text-primary-foreground hover:bg-primary/90",
        className
      )}
      {...props}
    />
  )
})
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium",
        "transition-colors focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        "px-4 py-2 text-sm",
        "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
})
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
