"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useSizeContext, sizeVariants } from "./size-provider"
import { getInputGlass, getFormFocusRing, getFormGlassTransition, getReducedTransparencyForm } from "@/utils/form-glass-effects"
import { useSafeResolvedTheme } from "@/utils/safe-theme"
import {
  getFloatingLabelClasses,
  getInputContainerClasses,
  useFloatingLabel,
  useInputStates
} from "@/utils/form-animations"

const Textarea = React.forwardRef(({
  className,
  size,
  glass = false,
  label,
  error,
  success,
  placeholder,
  floatingLabel = false,
  autoResize = false,
  maxRows = 10,
  ...props
}, ref) => {
  const contextSize = useSizeContext()
  const theme = useSafeResolvedTheme()
  const effectiveSize = size || contextSize || 'md'

  const [value, setValue] = React.useState(props.value || props.defaultValue || "")
  const { isFocused, isHovered, handlers } = useInputStates()
  const { isFloated } = useFloatingLabel(value, isFocused)

  const textareaRef = React.useRef(null)
  React.useImperativeHandle(ref, () => textareaRef.current)

  const sizeClasses = {
    sm: "min-h-[80px] px-3 text-sm",
    md: "min-h-[100px] px-4 text-sm",
    lg: "min-h-[120px] px-5 text-base"
  }

  const getTextareaStyles = () => {
    if (glass) {
      const glassClasses = getInputGlass(glass, effectiveSize, theme)
      const reducedTransparency = getReducedTransparencyForm(glassClasses)
      return cn(glassClasses, reducedTransparency, "backdrop-blur-sm")
    }

    return theme === 'dark'
      ? "bg-background/90 border-border/60 text-foreground"
      : "bg-background border-border/60 text-foreground"
  }

  const handleChange = (e) => {
    setValue(e.target.value)
    props.onChange?.(e)

    // Auto-resize functionality
    if (autoResize && textareaRef.current) {
      const textarea = textareaRef.current
      textarea.style.height = 'auto'
      const scrollHeight = Math.min(textarea.scrollHeight, maxRows * 24) // Approximate line height
      textarea.style.height = `${scrollHeight}px`
    }
  }

  const handleLabelClick = () => {
    textareaRef.current?.focus()
  }

  const containerClasses = getInputContainerClasses(isFocused, error, success, isHovered)
  const transition = getFormGlassTransition()

  const textareaElement = (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      className={cn(
        // Base styles with better contrast
        "flex w-full rounded-lg border shadow-sm font-medium text-foreground caret-primary resize-vertical input-focus-glow",
        // Conditional placeholder visibility for floating labels
        floatingLabel
          ? "placeholder:text-transparent focus:placeholder:text-muted-foreground/50"
          : "placeholder:text-muted-foreground/70 placeholder:font-normal",
        "focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30",
        // Size classes with padding adjustment for floating labels
        sizeClasses[effectiveSize],
        floatingLabel ? "pt-6 pb-3" : "py-3",
        // Dynamic styles and animations
        getTextareaStyles(),
        containerClasses,
        transition,
        "focus-visible:outline-none",
        // Auto-resize handling
        autoResize && "resize-none overflow-hidden",
        className
      )}
      placeholder={floatingLabel ? (isFloated ? placeholder : "") : placeholder}
      {...handlers}
      {...props}
    />
  )

  // If floating label is disabled, return simple textarea
  if (!floatingLabel || !label) {
    return textareaElement
  }

  // Return textarea with floating label
  return (
    <div className="relative">
      {textareaElement}
      <label
        onClick={handleLabelClick}
        className={cn(
          "absolute left-4 pointer-events-none cursor-text select-none",
          "transition-all duration-200 ease-smooth origin-left",
          getFloatingLabelClasses(isFloated, error, success),
          isFloated
            ? "top-2 transform -translate-y-0 scale-75"
            : "top-4 transform -translate-y-0 scale-100"
        )}
      >
        {label}
      </label>
      {/* Character count */}
      {props.maxLength && (
        <div className={cn(
          "absolute bottom-2 right-3 text-xs transition-colors duration-200",
          value.length > props.maxLength * 0.9 ? "text-amber-500" : "text-muted-foreground",
          value.length >= props.maxLength && "text-destructive"
        )}>
          {value.length}/{props.maxLength}
        </div>
      )}
      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-destructive animate-shake">
          {error}
        </p>
      )}
      {/* Success message */}
      {success && (
        <p className="mt-1 text-sm text-green-600 animate-pulse-once">
          {success}
        </p>
      )}
    </div>
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
