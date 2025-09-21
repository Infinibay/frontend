import * as React from "react"
import PropTypes from 'prop-types'
import { MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { Input } from "./input"
import { useOptionalSizeContext, sizeVariants } from "./size-provider"

const AppSearchBar = React.forwardRef(({
  searchTerm = "",
  onSearchChange,
  onEnter,
  placeholder = "Search applications...",
  size: propSize,
  className,
  glass,
  ...props
}, ref) => {
  const sizeContext = useOptionalSizeContext()
  const size = propSize || sizeContext?.size || 'md'
  const sizes = sizeVariants[size] || sizeVariants.md

  const [localValue, setLocalValue] = React.useState(searchTerm)
  const [debouncedValue, setDebouncedValue] = React.useState(searchTerm)
  const inputRef = React.useRef(null)

  React.useImperativeHandle(ref, () => inputRef.current)

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(localValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [localValue])

  // Call onSearchChange when debounced value changes
  React.useEffect(() => {
    onSearchChange?.(debouncedValue)
  }, [debouncedValue, onSearchChange])

  // Update local value when searchTerm prop changes
  React.useEffect(() => {
    if (searchTerm !== localValue) {
      setLocalValue(searchTerm)
    }
  }, [searchTerm])

  const handleChange = (e) => {
    setLocalValue(e.target.value)
  }

  const handleClear = () => {
    setLocalValue("")
    onSearchChange?.("")
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear()
    } else if (e.key === 'Enter') {
      onEnter?.()
    }
    props.onKeyDown?.(e)
  }

  return (
    <div className={cn("relative flex items-center", className)}>
      <div className="absolute left-3 z-10 pointer-events-none">
        <MagnifyingGlassIcon
          className={cn(
            "text-foreground/60",
            sizes.icon?.sm || "h-4 w-4"
          )}
        />
      </div>

      <Input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        size={size}
        glass={glass}
        className={cn(
          "pl-10 pr-10",
          localValue && "pr-10"
        )}
        role="searchbox"
        aria-label="Search applications"
        {...props}
      />

      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            "absolute right-3 z-10 rounded-sm",
            "text-foreground/60 hover:text-foreground",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-1 focus:ring-primary",
            "p-0.5"
          )}
          aria-label="Clear search"
        >
          <Cross2Icon
            className={cn(
              sizes.icon?.sm || "h-4 w-4"
            )}
          />
        </button>
      )}
    </div>
  )
})

AppSearchBar.displayName = "AppSearchBar"

AppSearchBar.propTypes = {
  searchTerm: PropTypes.string,
  onSearchChange: PropTypes.func,
  onEnter: PropTypes.func,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  glass: PropTypes.bool,
  onKeyDown: PropTypes.func
}

export { AppSearchBar }