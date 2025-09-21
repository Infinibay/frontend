"use client"

import * as React from "react"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons"
import * as SelectPrimitive from "@radix-ui/react-select"

import { cn } from "@/lib/utils"
import { useSizeContext } from "./size-provider"
import { getSelectGlass, getFormGlassTransition, getReducedTransparencyForm } from "@/utils/form-glass-effects"
import { useSafeResolvedTheme } from "@/utils/safe-theme"
import { useInputStates } from "@/utils/form-animations"

// Glass context for passing glass state to child components
const SelectGlassContext = React.createContext(false)

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef(({ className, children, size, glass = false, error, success, ...props }, ref) => {
  const contextSize = useSizeContext()
  const theme = useSafeResolvedTheme()
  const effectiveSize = size || contextSize || 'md'
  const { isHovered, handlers } = useInputStates()

  const sizeClasses = React.useMemo(() => ({
    sm: "h-11 px-5 py-3 text-sm",
    md: "h-13 px-6 py-4 text-sm",
    lg: "h-15 px-7 py-5 text-base"
  }), [])

  const iconSizeClasses = React.useMemo(() => ({
    sm: "h-4 w-4",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }), [])

  const glassEffect = React.useMemo(() => getSelectGlass(glass, theme), [glass, theme])
  const transition = React.useMemo(() => getFormGlassTransition(), [])
  const reducedTransparency = React.useMemo(() => glass ? getReducedTransparencyForm(glassEffect.trigger) : '', [glass, glassEffect.trigger])

  const getSelectStyles = () => {
    if (glass) {
      return cn(glassEffect.trigger, reducedTransparency, "backdrop-blur-xl")
    }
    return theme === 'dark'
      ? "bg-background/95 border-border/60"
      : "bg-background border-border/60"
  }

  const getSelectStateClasses = () => {
    if (error) {
      return "border-destructive/60 ring-2 ring-destructive/20 text-destructive"
    }
    if (success) {
      return "border-green-500/60 ring-2 ring-green-500/20"
    }
    return ""
  }

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex w-full items-center justify-between whitespace-nowrap rounded-lg border shadow-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        // Enhanced visibility and contrast
        "font-medium text-foreground input-focus-glow",
        // Focus states with enhanced visibility
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/60",
        // Hover states with micro-interactions
        "hover:border-border/80 hover:shadow-md hover:scale-[1.01] transition-all duration-200 ease-smooth",
        // Size classes
        sizeClasses[effectiveSize],
        // Dynamic styling
        getSelectStyles(),
        getSelectStateClasses(),
        transition,
        className
      )}
      {...handlers}
      {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <div className="flex items-center justify-center transition-all duration-200">
          <ChevronDownIcon className={cn(
            "text-foreground/70 transition-all duration-200 ease-smooth",
            "data-[state=open]:rotate-180 data-[state=open]:text-primary",
            isHovered && "scale-110",
            iconSizeClasses[effectiveSize]
          )} />
        </div>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1 text-foreground/70", className)}
    {...props}>
    <ChevronUpIcon className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1 text-foreground/70", className)}
    {...props}>
    <ChevronDownIcon className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef(({ className, children, position = "popper", size, glass = false, ...props }, ref) => {
  const contextSize = useSizeContext()
  const theme = useSafeResolvedTheme()
  const effectiveSize = size || contextSize || 'md'

  const sizeClasses = React.useMemo(() => ({
    sm: "text-sm",
    md: "text-sm",
    lg: "text-base"
  }), [])

  const viewportSizeClasses = React.useMemo(() => ({
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5"
  }), [])

  const glassEffect = React.useMemo(() => getSelectGlass(glass, theme), [glass, theme])
  const transition = React.useMemo(() => getFormGlassTransition(), [])
  const reducedTransparencyContent = React.useMemo(() => glass ? getReducedTransparencyForm(glassEffect.content) : '', [glass, glassEffect.content])

  return (
    <SelectPrimitive.Portal>
      <SelectGlassContext.Provider value={glass}>
        <SelectPrimitive.Content
          ref={ref}
          className={cn(
            "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border shadow-2xl",
            glass ? "glass-minimal backdrop-blur-xl" : "bg-popover",
            "text-popover-foreground border-border/30 animate-in fade-in-0 zoom-in-95",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            position === "popper" &&
              "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
            sizeClasses[effectiveSize],
            glass && glassEffect.content,
            glass && reducedTransparencyContent,
            transition,
            className
          )}
          position={position}
          {...props}>
          <SelectScrollUpButton />
          <SelectPrimitive.Viewport
            className={cn(
              viewportSizeClasses[effectiveSize],
              position === "popper" &&
                "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
            )}>
            {children}
          </SelectPrimitive.Viewport>
          <SelectScrollDownButton />
        </SelectPrimitive.Content>
      </SelectGlassContext.Provider>
    </SelectPrimitive.Portal>
  )
})
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef(({ className, size, ...props }, ref) => {
  const contextSize = useSizeContext()
  const effectiveSize = size || contextSize || 'md'

  const sizeClasses = {
    sm: "px-1.5 py-1 text-xs",
    md: "px-2 py-1.5 text-sm",
    lg: "px-3 py-2 text-base"
  }

  return (
    <SelectPrimitive.Label
      ref={ref}
      className={cn("font-semibold", sizeClasses[effectiveSize], className)}
      {...props} />
  )
})
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef(({ className, children, size, ...props }, ref) => {
  const contextSize = useSizeContext()
  const effectiveSize = size || contextSize || 'md'
  const parentGlass = React.useContext(SelectGlassContext)

  const sizeClasses = {
    sm: "py-3.5 pl-5 pr-10 text-sm min-h-[44px]",
    md: "py-4 pl-6 pr-11 text-sm min-h-[48px]",
    lg: "py-5 pl-7 pr-13 text-base min-h-[52px]"
  }

  const iconSizeClasses = {
    sm: "h-4 w-4 right-4",
    md: "h-4 w-4 right-5",
    lg: "h-5 w-5 right-6"
  }

  const checkIconSizeClasses = {
    sm: "h-4 w-4",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }

  const transition = getFormGlassTransition()

  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-md outline-none transition-colors duration-150",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "hover:bg-accent/50 hover:scale-[1.02] focus:bg-accent focus:text-accent-foreground",
        "data-[state=checked]:bg-primary/20 data-[state=checked]:text-primary data-[state=checked]:font-semibold data-[state=checked]:shadow-sm",
        "transition-all duration-150 ease-smooth",
        sizeClasses[effectiveSize],
        parentGlass && "hover:bg-primary/10 focus:bg-primary/15 data-[state=checked]:bg-primary/20",
        transition,
        className
      )}
      {...props}>
      <span className={cn("absolute flex items-center justify-center", iconSizeClasses[effectiveSize])}>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className={cn("text-primary", checkIconSizeClasses[effectiveSize])} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText className="font-medium">{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
})
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props} />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
