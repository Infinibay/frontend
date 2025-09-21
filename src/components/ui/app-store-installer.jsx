import * as React from "react"
import PropTypes from 'prop-types'
import { cn } from "@/lib/utils"
import { AppSearchBar } from "./app-search-bar"
import { CategoryFilter } from "./category-filter"
import { AppCard } from "./app-card"
import { SelectedAppsPanel } from "./selected-apps-panel"
import { useOptionalSizeContext } from "./size-provider"

const AppStoreInstaller = React.forwardRef(({
  apps = [],
  selectedAppIds = [],
  onSelectionChange,
  onBulkSelectionChange,
  size: propSize,
  className,
  glass = false,
  variant = "default",
  gridCols = "auto",
  showSelectedPanel = true,
  selectedPanelPosition = "right",
  processingApps = [],
  ...props
}, ref) => {
  const sizeContext = useOptionalSizeContext()
  const size = propSize || sizeContext?.size || 'md'

  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [viewMode, setViewMode] = React.useState("grid")
  const firstAppCardRef = React.useRef(null)

  // Extract unique categories from apps
  const categories = React.useMemo(() => {
    const categoryCounts = apps.reduce((acc, app) => {
      const category = app.category || "Other"
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {})

    return Object.entries(categoryCounts).map(([category, count]) => ({
      value: category.toLowerCase(),
      label: category,
      count
    })).sort((a, b) => a.label.localeCompare(b.label))
  }, [apps])

  // Filter apps based on search and category
  const filteredApps = React.useMemo(() => {
    let filtered = apps

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(app =>
        app.name.toLowerCase().includes(searchLower) ||
        (app.description && app.description.toLowerCase().includes(searchLower)) ||
        (app.category && app.category.toLowerCase().includes(searchLower))
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(app =>
        (app.category || "other").toLowerCase() === selectedCategory
      )
    }

    return filtered
  }, [apps, searchTerm, selectedCategory])

  // Get selected apps data
  const selectedApps = React.useMemo(() => {
    return apps.filter(app =>
      selectedAppIds.includes(app.id || app.name)
    )
  }, [apps, selectedAppIds])

  const handleSelectionChange = (appId, isSelected) => {
    onSelectionChange?.(appId, isSelected)
  }

  const handleRemoveApp = (appId) => {
    onSelectionChange?.(appId, false)
  }

  const handleClearAll = () => {
    if (onBulkSelectionChange) {
      onBulkSelectionChange(selectedAppIds, false)
    } else {
      selectedAppIds.forEach(appId => {
        onSelectionChange?.(appId, false)
      })
    }
  }

  const handleSearchEnter = () => {
    if (filteredApps.length > 0 && firstAppCardRef.current) {
      firstAppCardRef.current.focus()
    }
  }

  const isAppSelected = (app) => {
    return selectedAppIds.includes(app.id || app.name)
  }

  const isAppProcessing = (app) => {
    return processingApps.includes(app.id || app.name)
  }

  const getGridColumns = () => {
    if (gridCols === "auto") {
      switch (size) {
        case 'sm': return "grid-cols-2"
        case 'md': return "grid-cols-3"
        case 'lg': return "grid-cols-4"
        case 'xl': return "grid-cols-5"
        default: return "grid-cols-3"
      }
    }
    return gridCols
  }

  const layoutClass = showSelectedPanel && selectedPanelPosition === "right"
    ? "grid grid-cols-1 lg:grid-cols-3 gap-6"
    : "flex flex-col gap-6"

  const mainContentClass = showSelectedPanel && selectedPanelPosition === "right"
    ? "lg:col-span-2"
    : "flex-1"

  return (
    <div
      ref={ref}
      className={cn(
        "w-full space-y-6",
        className
      )}
      {...props}
    >
      {/* Search and Filters */}
      <div className="space-y-4">
        <AppSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onEnter={handleSearchEnter}
          placeholder="Search applications..."
          size={size}
          glass={glass}
        />

        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            size={size}
            glass={glass}
            showCounts={true}
          />
        )}
      </div>

      {/* Main Layout */}
      <div className={layoutClass}>
        {/* Apps Grid */}
        <div className={mainContentClass}>
          {filteredApps.length === 0 ? (
            <div className="text-center py-12">
              <div className={cn(
                "text-muted-foreground mb-4",
                size === 'sm' ? "text-4xl" : "text-6xl"
              )}>
                {searchTerm || selectedCategory !== "all" ? '🔍' : '📦'}
              </div>
              <h3 className={cn(
                "font-semibold mb-2",
                "text-lg"
              )}>
                {searchTerm || selectedCategory !== "all"
                  ? 'No apps found'
                  : 'No apps available'
                }
              </h3>
              <p className={cn(
                "text-muted-foreground max-w-md mx-auto",
                "text-base"
              )}>
                {searchTerm || selectedCategory !== "all"
                  ? 'Try adjusting your search terms or category filter.'
                  : 'There are no applications available to install.'}
              </p>
            </div>
          ) : (
            <div className={cn(
              "grid gap-4",
              getGridColumns()
            )}>
              {filteredApps.map((app, index) => (
                <AppCard
                  key={app.id || app.name}
                  ref={index === 0 ? firstAppCardRef : undefined}
                  app={app}
                  isSelected={isAppSelected(app)}
                  onToggle={handleSelectionChange}
                  isProcessing={isAppProcessing(app)}
                  size={size}
                  glass={glass}
                  variant={variant}
                />
              ))}
            </div>
          )}
        </div>

        {/* Selected Apps Panel */}
        {showSelectedPanel && (
          <div className={cn(
            selectedPanelPosition === "right" ? "lg:col-span-1" : "w-full",
            selectedPanelPosition === "bottom" && "order-last"
          )}>
            <SelectedAppsPanel
              selectedApps={selectedApps}
              onRemoveApp={handleRemoveApp}
              onClearAll={handleClearAll}
              size={size}
              glass={glass}
              collapsible={selectedPanelPosition === "bottom"}
            />
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="flex justify-between items-center text-sm text-muted-foreground pt-4 border-t">
        <span>
          Showing {filteredApps.length} of {apps.length} applications
        </span>
        {selectedApps.length > 0 && (
          <span>
            {selectedApps.length} app{selectedApps.length !== 1 ? 's' : ''} selected
          </span>
        )}
      </div>
    </div>
  )
})

AppStoreInstaller.displayName = "AppStoreInstaller"

AppStoreInstaller.propTypes = {
  apps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      category: PropTypes.string,
      version: PropTypes.string,
      icon: PropTypes.string,
      iconType: PropTypes.oneOf(['svg', 'image']),
      fallbackIcon: PropTypes.string
    })
  ),
  selectedAppIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  onSelectionChange: PropTypes.func,
  onBulkSelectionChange: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  glass: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'installed']),
  gridCols: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf(['auto'])
  ]),
  showSelectedPanel: PropTypes.bool,
  selectedPanelPosition: PropTypes.oneOf(['right', 'bottom']),
  processingApps: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  )
}

export { AppStoreInstaller }