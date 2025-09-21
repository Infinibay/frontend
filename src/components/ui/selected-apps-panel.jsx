import * as React from "react"
import PropTypes from 'prop-types'
import Image from 'next/image'
import { cn } from "@/lib/utils"
import { Cross2Icon, TrashIcon } from "@radix-ui/react-icons"
import { Card, CardHeader, CardTitle, CardContent } from "./card"
import { Badge } from "./badge"
import { useOptionalSizeContext, sizeVariants } from "./size-provider"
import { createSanitizedSVGMarkup } from "@/utils/svg-sanitizer"

const SelectedAppsPanel = React.forwardRef(({
  selectedApps = [],
  onRemoveApp,
  onClearAll,
  size: propSize,
  className,
  glass = false,
  collapsible = false,
  ...props
}, ref) => {
  const sizeContext = useOptionalSizeContext()
  const size = propSize || sizeContext?.size || 'md'
  const sizes = sizeVariants[size] || sizeVariants.md

  const [isCollapsed, setIsCollapsed] = React.useState(false)

  const isEmpty = selectedApps.length === 0

  const handleRemoveApp = (appId) => {
    onRemoveApp?.(appId)
  }

  const handleClearAll = () => {
    onClearAll?.()
  }

  const handleKeyDown = (e, action, appId = null) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (action === 'remove' && appId) {
        handleRemoveApp(appId)
      } else if (action === 'clear') {
        handleClearAll()
      } else if (action === 'toggle' && collapsible) {
        setIsCollapsed(!isCollapsed)
      }
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'sm': return { width: 20, height: 20 }
      case 'md': return { width: 24, height: 24 }
      case 'lg': return { width: 28, height: 28 }
      case 'xl': return { width: 32, height: 32 }
      default: return { width: 24, height: 24 }
    }
  }

  const iconSize = getIconSize()

  return (
    <Card
      ref={ref}
      glass={glass ? "minimal" : "none"}
      elevation="2"
      className={cn(
        "transition-all duration-200",
        collapsible && "hover:shadow-md",
        className
      )}
      {...props}
    >
      <CardHeader
        className={cn(
          "cursor-pointer select-none",
          collapsible && "hover:bg-accent/5"
        )}
        onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
        onKeyDown={collapsible ? (e) => handleKeyDown(e, 'toggle') : undefined}
        tabIndex={collapsible ? 0 : undefined}
        role={collapsible ? "button" : undefined}
        aria-expanded={collapsible ? !isCollapsed : undefined}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>Selected Apps</span>
            <Badge variant="secondary" size={size} glass={glass}>
              {selectedApps.length}
            </Badge>
          </CardTitle>

          {selectedApps.length > 0 && (
            <button
              className={cn(
                "p-1 rounded-md transition-colors",
                "hover:bg-destructive/10 text-destructive hover:text-destructive",
                "focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2",
                sizes.button?.padding || "p-1"
              )}
              onClick={(e) => {
                e.stopPropagation()
                handleClearAll()
              }}
              onKeyDown={(e) => {
                e.stopPropagation()
                handleKeyDown(e, 'clear')
              }}
              title="Clear all selected apps"
              aria-label="Clear all selected apps"
            >
              <TrashIcon className={cn(sizes.icon?.size || "h-4 w-4")} />
            </button>
          )}
        </div>
      </CardHeader>

      {(!collapsible || !isCollapsed) && (
        <CardContent className={cn("transition-all duration-300")}>
          {isEmpty ? (
            <div className="text-center py-8">
              <div className={cn(
                "text-muted-foreground mb-2",
                size === 'sm' ? "text-2xl" : "text-3xl"
              )}>
                📱
              </div>
              <p className={cn(
                "text-muted-foreground",
                sizes.text?.sm || "text-sm"
              )}>
                No apps selected
              </p>
              <p className={cn(
                "text-muted-foreground/70 mt-1",
                sizes.text?.xs || "text-xs"
              )}>
                Select apps to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedApps.map((app) => (
                <div
                  key={app.id || app.name}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg",
                    "bg-accent/5 hover:bg-accent/10 transition-colors",
                    "group"
                  )}
                >
                  {/* App Icon */}
                  <div className={cn(
                    "relative flex items-center justify-center rounded-md border bg-background shrink-0",
                    "shadow-sm",
                    sizes.avatar || "w-8 h-8"
                  )}>
                    {app.iconType === 'svg' && app.icon ? (
                      <div
                        className={cn("flex items-center justify-center overflow-hidden", sizes.icon?.xs || "w-4 h-4")}
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

                  {/* App Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className={cn(
                      "font-medium truncate",
                      sizes.text?.sm || "text-sm"
                    )}>
                      {app.name}
                    </h4>
                    {app.category && (
                      <p className={cn(
                        "text-muted-foreground truncate",
                        sizes.text?.xs || "text-xs"
                      )}>
                        {app.category}
                      </p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    className={cn(
                      "p-1 rounded-md transition-all duration-200",
                      "opacity-60 hover:opacity-100 focus:opacity-100",
                      "hover:bg-destructive/10 text-destructive hover:text-destructive",
                      "focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2",
                      sizes.button?.padding || "p-1"
                    )}
                    onClick={() => handleRemoveApp(app.id || app.name)}
                    onKeyDown={(e) => handleKeyDown(e, 'remove', app.id || app.name)}
                    title={`Remove ${app.name}`}
                    aria-label={`Remove ${app.name} from selection`}
                  >
                    <Cross2Icon className={cn(sizes.icon?.xs || "h-3 w-3")} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
})

SelectedAppsPanel.displayName = "SelectedAppsPanel"

SelectedAppsPanel.propTypes = {
  selectedApps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string.isRequired,
      category: PropTypes.string,
      icon: PropTypes.string,
      iconType: PropTypes.oneOf(['svg', 'image']),
      fallbackIcon: PropTypes.string
    })
  ),
  onRemoveApp: PropTypes.func,
  onClearAll: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  glass: PropTypes.bool,
  collapsible: PropTypes.bool
}

export { SelectedAppsPanel }