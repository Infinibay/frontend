"use client"

import React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"

/**
 * SelectionCard component with strong glassmorphism effect by default.
 *
 * @version Changed in latest update: Default glass effect upgraded from "subtle" to "strong"
 * for enhanced visual impact. This provides 75% opacity with 50px blur.
 *
 * @performance The strong blur effect may impact performance on lower-end devices or
 * in high-density views. Consider overriding the `glass` prop to "subtle" or "minimal"
 * if performance issues are observed.
 *
 * @responsive On small screens (sm), the glass effect automatically downgrades from
 * "strong" to "minimal" for better readability, unless Card's `forceGlass` prop is used.
 */
const SelectionCard = React.forwardRef(
  (
    {
      className,
      selected = false,
      onSelect,
      selectionIndicator = false,
      disabled = false,
      children,
      glass = "strong",
      elevation = "2",
      glow = "none",
      glowColor = "celeste",
      radius = "lg",
      effect = "none",
      ...props
    },
    ref
  ) => {
    const handleClick = () => {
      if (!disabled && onSelect) {
        onSelect()
      }
    }

    const handleKeyDown = (event) => {
      if ((event.key === "Enter" || event.key === " ") && !disabled && onSelect) {
        event.preventDefault()
        onSelect()
      }
    }

    const selectedGlass = selected ? "strong" : glass
    const selectedElevation = selected ? "4" : elevation
    const selectedGlow = selected ? "subtle" : glow

    return (
      <Card
        ref={ref}
        className={cn(
          "cursor-pointer transition-all duration-300 group relative",
          selected && "border-primary/50 bg-primary/5",
          disabled && "cursor-not-allowed opacity-50",
          !disabled && "hover:scale-[1.02]",
          className
        )}
        glass={selectedGlass}
        elevation={selectedElevation}
        glow={selectedGlow}
        glowColor={glowColor}
        radius={radius}
        effect={effect}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-pressed={selected}
        aria-disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {selectionIndicator && selected && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-primary text-primary-foreground rounded-full p-1">
              <Check className="h-3 w-3" />
            </div>
          </div>
        )}
        {children}
      </Card>
    )
  }
)

SelectionCard.displayName = "SelectionCard"

export { SelectionCard }