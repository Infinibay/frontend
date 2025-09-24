"use client"

import * as React from "react"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Wand2, Settings } from "lucide-react"

/**
 * @typedef {'simple' | 'advanced'} FirewallMode
 */

/**
 * Reusable mode toggle component that follows the design system guidelines
 * @param {Object} props
 * @param {FirewallMode} props.mode - Current mode ('simple' | 'advanced')
 * @param {(mode: FirewallMode) => void} props.onModeChange - Callback for mode changes
 * @param {string} [props.simpleLabel="Simple Mode"] - Label for simple mode
 * @param {string} [props.advancedLabel="Advanced Mode"] - Label for advanced mode
 * @param {boolean} [props.disabled=false] - Whether the toggle is disabled
 * @param {string} [props.className] - Additional CSS classes
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Size variant
 * @param {boolean} [props.showTooltip=true] - Whether to show tooltips
 */
const ModeToggle = React.forwardRef(({
  mode,
  onModeChange,
  simpleLabel = "Simple Mode",
  advancedLabel = "Advanced Mode",
  disabled = false,
  className,
  size = 'md',
  showTooltip = true,
  ...props
}, ref) => {
  const isAdvanced = mode === 'advanced'

  const handleChange = React.useCallback((checked) => {
    const newMode = checked ? 'advanced' : 'simple'
    onModeChange?.(newMode)
  }, [onModeChange])

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }

  const iconSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }

  const content = (
    <div className={cn("flex items-center space-x-3", className)} {...props} ref={ref}>
      {/* Simple Mode Icon and Label */}
      <div className={cn(
        "flex items-center space-x-1.5 transition-colors",
        sizeClasses[size],
        !isAdvanced ? "text-foreground font-medium" : "text-muted-foreground"
      )}>
        <Wand2 className={cn(iconSizeClasses[size], "shrink-0")} />
        <span className="whitespace-nowrap">{simpleLabel}</span>
      </div>

      {/* Toggle Switch */}
      <Switch
        checked={isAdvanced}
        onCheckedChange={handleChange}
        disabled={disabled}
        size={size}
        aria-label={`Switch to ${isAdvanced ? simpleLabel : advancedLabel}`}
        aria-describedby={`mode-toggle-description-${size}`}
      />

      {/* Advanced Mode Icon and Label */}
      <div className={cn(
        "flex items-center space-x-1.5 transition-colors",
        sizeClasses[size],
        isAdvanced ? "text-foreground font-medium" : "text-muted-foreground"
      )}>
        <Settings className={cn(iconSizeClasses[size], "shrink-0")} />
        <span className="whitespace-nowrap">{advancedLabel}</span>
      </div>

      {/* Hidden description for screen readers */}
      <span id={`mode-toggle-description-${size}`} className="sr-only">
        {isAdvanced
          ? `Currently in ${advancedLabel}. Switch to ${simpleLabel} for guided wizard interface.`
          : `Currently in ${simpleLabel}. Switch to ${advancedLabel} for technical form interface.`
        }
      </span>
    </div>
  )

  if (!showTooltip) {
    return content
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="text-sm">
            {isAdvanced
              ? `${advancedLabel}: Technical form with detailed rule configuration`
              : `${simpleLabel}: Guided wizard for easy rule creation`
            }
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})

ModeToggle.displayName = "ModeToggle"

export { ModeToggle }