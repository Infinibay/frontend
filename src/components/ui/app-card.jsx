import * as React from "react"
import PropTypes from 'prop-types'
import Image from 'next/image'
import { cn } from "@/lib/utils"
import { PlusIcon, CheckIcon, TrashIcon } from "@radix-ui/react-icons"
import { Card, CardContent } from "./card"
import { Badge } from "./badge"
import { Spinner } from "./spinner"
import { useOptionalSizeContext } from "./size-provider"
import { createSanitizedSVGMarkup } from "@/utils/svg-sanitizer"

const AppCard = React.forwardRef(({
  app,
  isSelected = false,
  onToggle,
  isProcessing = false,
  size: propSize,
  className,
  glass = false,
  variant = "default",
  ...props
}, ref) => {
  const sizeContext = useOptionalSizeContext()
  const size = propSize || sizeContext?.size || 'md'

  const handleClick = () => {
    if (!isProcessing) {
      onToggle?.(app.id || app.name, !isSelected)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'sm': return { width: 24, height: 24 }
      case 'md': return { width: 32, height: 32 }
      case 'lg': return { width: 40, height: 40 }
      case 'xl': return { width: 48, height: 48 }
      default: return { width: 32, height: 32 }
    }
  }

  const iconSize = getIconSize()

  const getButtonIcon = () => {
    if (isProcessing) {
      return <Spinner size={size} className="text-current" />
    }

    if (isSelected) {
      return variant === "installed" ? (
        <TrashIcon className={cn("transition-transform duration-200", sizes.icon?.size || "h-4 w-4")} />
      ) : (
        <CheckIcon className={cn("transition-transform duration-200", sizes.icon?.size || "h-4 w-4")} />
      )
    }

    return <PlusIcon className={cn("transition-transform duration-200", sizes.icon?.size || "h-4 w-4")} />
  }

  const getButtonVariant = () => {
    if (isProcessing) return "secondary"

    if (isSelected) {
      return variant === "installed" ? "destructive" : "primary"
    }

    return "outline"
  }

  const getButtonText = () => {
    if (isProcessing) return "..."

    if (isSelected) {
      return variant === "installed" ? "Remove" : "Added"
    }

    return "Add"
  }

  return (
    <Card
      ref={ref}
      glass={glass ? "minimal" : "none"}
      elevation={isSelected ? "3" : "1"}
      glow={isSelected ? "subtle" : "none"}
      glowColor="celeste"
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:scale-[1.02]",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isSelected && "ring-2 ring-primary ring-offset-2",
        isProcessing && "cursor-not-allowed opacity-75",
        !isProcessing && "hover:shadow-lg",
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      aria-label={`${isSelected ? 'Remove' : 'Add'} ${app.name}`}
      {...props}
    >
      <CardContent className={cn("relative", sizes.card?.content || "p-4")}>
        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
            <Spinner size={size} speed="medium" />
          </div>
        )}

        {/* App Icon */}
        <div className="flex items-center justify-center mb-3">
          <div className={cn(
            "relative flex items-center justify-center rounded-lg border bg-background/50 shadow-sm",
            "transition-transform duration-200 group-hover:scale-110",
            sizes.avatar || "w-12 h-12"
          )}>
            {app.iconType === 'svg' && app.icon ? (
              <div
                className={cn("flex items-center justify-center overflow-hidden", sizes.icon?.size || "w-8 h-8")}
                // NOTE: SVG is sanitized before injecting to mitigate XSS (see src/utils/svg-sanitizer.js)
                dangerouslySetInnerHTML={createSanitizedSVGMarkup(app.icon)}
              />
            ) : (
              <Image
                src={app.icon || app.fallbackIcon || 'https://cdn.simpleicons.org/package'}
                alt={`${app.name} icon`}
                width={iconSize.width}
                height={iconSize.height}
                className="object-contain"
              />
            )}
          </div>
        </div>

        {/* App Info */}
        <div className="text-center mb-4">
          <h3 className={cn(
            "font-semibold truncate mb-1",
            sizes.card?.title || "text-sm"
          )}>
            {app.name}
          </h3>

          {app.description && (
            <p className={cn(
              "text-muted-foreground line-clamp-2 mb-2",
              sizes.card?.description || "text-xs"
            )}>
              {app.description}
            </p>
          )}

          {/* Category Badge */}
          {app.category && (
            <Badge
              variant="secondary"
              size={size}
              glass={glass}
              className="mb-2"
            >
              {app.category}
            </Badge>
          )}

          {/* Version */}
          {app.version && (
            <p className={cn(
              "text-muted-foreground font-mono",
              sizes.card?.description || "text-xs"
            )}>
              v{app.version}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "px-4 py-2",
              sizes.button?.text || "text-sm",

              // Variant styles
              getButtonVariant() === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
              getButtonVariant() === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              getButtonVariant() === "outline" && "border border-input hover:bg-accent/10 hover:border-primary/50",
              getButtonVariant() === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/90",

              // Processing state
              isProcessing && "cursor-not-allowed opacity-75",
              !isProcessing && "hover:scale-105 active:scale-95"
            )}
            disabled={isProcessing}
            onClick={(e) => {
              e.stopPropagation()
              handleClick()
            }}
            aria-label={`${getButtonText()} ${app.name}`}
          >
            {getButtonIcon()}
            <span>{getButtonText()}</span>
          </button>
        </div>
      </CardContent>
    </Card>
  )
})

AppCard.displayName = "AppCard"

AppCard.propTypes = {
  app: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string,
    version: PropTypes.string,
    icon: PropTypes.string,
    iconType: PropTypes.oneOf(['svg', 'image']),
    fallbackIcon: PropTypes.string
  }).isRequired,
  isSelected: PropTypes.bool,
  onToggle: PropTypes.func,
  isProcessing: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  glass: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'installed'])
}

export { AppCard }