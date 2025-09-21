import * as React from "react"
import PropTypes from 'prop-types'
import { cn } from "@/lib/utils"
import { Badge } from "./badge"
import { useOptionalSizeContext, sizeVariants } from "./size-provider"

const CategoryFilter = React.forwardRef(({
  categories = [],
  selectedCategory = "all",
  onCategoryChange,
  size: propSize,
  className,
  glass = false,
  showCounts = false,
  ...props
}, ref) => {
  const sizeContext = useOptionalSizeContext()
  const size = propSize || sizeContext?.size || 'md'
  const sizes = sizeVariants[size] || sizeVariants.md

  const scrollContainerRef = React.useRef(null)

  React.useImperativeHandle(ref, () => scrollContainerRef.current)

  const allCategories = React.useMemo(() => {
    const allOption = {
      value: 'all',
      label: 'All',
      count: categories.reduce((sum, cat) => sum + (cat.count || 0), 0)
    }

    return [allOption, ...categories.map(cat => ({
      value: cat.value || cat.label?.toLowerCase() || cat,
      label: cat.label || cat,
      count: cat.count
    }))]
  }, [categories])

  const handleCategoryClick = (categoryValue) => {
    onCategoryChange?.(categoryValue)
  }

  const handleKeyDown = (e, categoryValue) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCategoryClick(categoryValue)
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      const currentIndex = allCategories.findIndex(cat => cat.value === selectedCategory)
      const nextIndex = e.key === 'ArrowRight'
        ? Math.min(currentIndex + 1, allCategories.length - 1)
        : Math.max(currentIndex - 1, 0)

      if (nextIndex !== currentIndex) {
        handleCategoryClick(allCategories[nextIndex].value)

        // Focus the next chip
        const nextElement = scrollContainerRef.current?.children[nextIndex]
        nextElement?.focus()
      }
    }
  }

  const getBadgeVariant = (categoryValue) => {
    const isSelected = categoryValue === selectedCategory

    if (glass) {
      return isSelected ? 'glass' : 'glass-secondary'
    }

    return isSelected ? 'default' : 'secondary'
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 overflow-x-auto scrollbar-hide",
        "py-2",
        className
      )}
      {...props}
    >
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 min-w-0"
        role="tablist"
        aria-label="Category filter"
      >
        {allCategories.map((category) => {
          const isSelected = category.value === selectedCategory

          return (
            <Badge
              key={category.value}
              variant={getBadgeVariant(category.value)}
              size={size}
              glass={glass}
              className={cn(
                "cursor-pointer select-none whitespace-nowrap transition-all duration-200",
                "hover:scale-105 active:scale-95",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isSelected && "ring-2 ring-primary ring-offset-2",
                !isSelected && "hover:bg-secondary/80"
              )}
              onClick={() => handleCategoryClick(category.value)}
              onKeyDown={(e) => handleKeyDown(e, category.value)}
              tabIndex={0}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`category-panel-${category.value}`}
            >
              <span className="flex items-center gap-1.5">
                <span>{category.label}</span>
                {showCounts && category.count !== undefined && (
                  <span
                    className={cn(
                      "text-xs opacity-75",
                      sizes.text?.xs || "text-xs"
                    )}
                  >
                    {category.count}
                  </span>
                )}
              </span>
            </Badge>
          )
        })}
      </div>
    </div>
  )
})

CategoryFilter.displayName = "CategoryFilter"

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
        count: PropTypes.number
      })
    ])
  ),
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  glass: PropTypes.bool,
  showCounts: PropTypes.bool
}

export { CategoryFilter }