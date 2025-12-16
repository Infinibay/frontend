"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Cross2Icon } from "@radix-ui/react-icons"
import { useSizeContext } from "./size-provider"
import { useSafeResolvedTheme } from "@/utils/safe-theme"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => {
  const { theme } = useSafeResolvedTheme()
  const isDark = theme === 'dark'
  const blurClass = isDark ? 'backdrop-blur-sm' : 'backdrop-blur-md'

  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-1000 glass-overlay",
        blurClass,
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
      {...props} />
  )
})
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const dialogContentVariants = cva(
  "fixed left-[50%] top-[50%] z-1000 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border bg-background duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
  {
    variants: {
      glass: {
        none: "",
        subtle: "glass-subtle backdrop-blur-sm",
        medium: "glass-medium backdrop-blur-md",
        strong: "glass-strong backdrop-blur-lg",
        mica: "mica backdrop-blur-xl",
        acrylic: "acrylic backdrop-blur-2xl",
        fluent: "fluent-card backdrop-blur-lg",
      },
    },
    defaultVariants: {
      glass: "none",
    },
  }
)

const DialogContent = React.forwardRef(({ className, children, glass, ...props }, ref) => {
  const { size: contextSize } = useSizeContext();

  // Size-responsive glass intensity
  const getResponsiveGlass = (glass) => {
    if (!glass || glass === 'none') return 'none'
    if (contextSize === 'sm') {
      return glass === 'strong' || glass === 'mica' || glass === 'acrylic' ? 'medium' : glass
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
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          dialogContentVariants({ glass: responsiveGlass }),
          "size-spacing-container",
          getFluentRadius(),
          getElevation(),
          className
        )}
        {...props}>
        {children}
        <DialogPrimitive.Close
          className={cn(
            "absolute right-[var(--size-padding)] top-[var(--size-padding)] rounded-sm ring-offset-background",
            "transition-all duration-200 hover:bg-accent/20 focus:outline-none focus:ring-2",
            "focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
            "text-muted-foreground hover:text-foreground",
            glass && glass !== 'none' && "glass-subtle backdrop-blur-sm",
            "size-icon-button min-h-[2rem] min-w-[2rem] flex items-center justify-center"
          )}>
          <Cross2Icon className="size-icon" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col text-center sm:text-left",
        "size-gap",
        className
      )}
      {...props}
    />
  )
}
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
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
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Title
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
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Description
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
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
