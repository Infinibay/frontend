"use client"

import * as React from "react"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  Cross2Icon,
  UpdateIcon,
} from "@radix-ui/react-icons"
import * as SelectPrimitive from "@radix-ui/react-select"

import { cn } from "@/lib/utils"
import { useSizeContext } from "./size-provider"
import { getSelectGlass, getFormGlassTransition, getReducedTransparencyForm } from "@/utils/form-glass-effects"
import { useSafeResolvedTheme } from "@/utils/safe-theme"
import { useInputStates } from "@/utils/form-animations"

// Glass context for passing glass state to child components
const SelectGlassContext = React.createContext(false)

// Search context for combobox functionality
const SelectSearchContext = React.createContext(null)

// Enhanced Select component with search functionality
const Select = React.forwardRef(({ searchable = false, onSearch, children, value, onValueChange, open, onOpenChange, ...props }, ref) => {
  const [searchValue, setSearchValue] = React.useState("")
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState("")
  const [selectedLabel, setSelectedLabel] = React.useState("")
  const [activeDescendant, setActiveDescendant] = React.useState("")

  // Generate unique IDs for accessibility (when searchable)
  const listboxId = React.useMemo(() => searchable ? `select-listbox-${Math.random().toString(36).substring(2, 11)}` : null, [searchable])

  // Determine if we're in controlled mode for value and open state
  const isValueControlled = value !== undefined
  const isOpenControlled = searchable && open !== undefined
  const currentValue = isValueControlled ? value : internalValue
  const currentOpen = isOpenControlled ? open : internalOpen

  const handleValueChange = React.useCallback((newValue) => {
    // Update internal state for uncontrolled mode
    if (!isValueControlled) {
      setInternalValue(newValue)
    }

    // Always call the callback if provided
    if (onValueChange) {
      onValueChange(newValue)
    }

    // Clear search when value changes and close if not controlled
    if (searchable) {
      setSearchValue("")
      if (!isOpenControlled) {
        setInternalOpen(false)
      }
    }
  }, [onValueChange, searchable, isValueControlled, isOpenControlled])

  const handleOpenChange = React.useCallback((open) => {
    // Update internal state for uncontrolled mode
    if (!isOpenControlled) {
      setInternalOpen(open)
    }

    // Always call the callback if provided
    if (onOpenChange) {
      onOpenChange(open)
    }

    // Clear search when menu closes
    if (!open && searchable) {
      setSearchValue("")
    }
  }, [onOpenChange, searchable, isOpenControlled])

  // Debounced search functionality
  React.useEffect(() => {
    if (!onSearch) return

    const timer = setTimeout(() => {
      onSearch(searchValue)
    }, 150)

    return () => clearTimeout(timer)
  }, [searchValue, onSearch])

  // Sync selectedLabel when currentValue changes (for controlled mode or initial selection)
  React.useEffect(() => {
    if (!searchable || !currentValue) return

    // Derive label from children by scanning SelectItem elements
    const findLabelFromChildren = (childrenToScan) => {
      let foundLabel = ''

      React.Children.forEach(childrenToScan, (child) => {
        if (foundLabel || !React.isValidElement(child)) return

        // Check SelectItem directly
        if (child.type?.displayName === 'SelectItem' || child.type === SelectItem) {
          if (String(child.props.value) === String(currentValue)) {
            foundLabel = typeof child.props.children === 'string'
              ? child.props.children
              : String(child.props.value || '')
          }
          return
        }

        // Check SelectGroup recursively
        if (child.type?.displayName === 'SelectGroup' || child.type === SelectGroup) {
          foundLabel = findLabelFromChildren(child.props.children)
        }
      })

      return foundLabel
    }

    const derivedLabel = findLabelFromChildren(children)
    if (derivedLabel && derivedLabel !== selectedLabel) {
      setSelectedLabel(derivedLabel)
    }
  }, [searchable, currentValue, children, selectedLabel])

  // Memoize stable functions separately to avoid unnecessary re-renders
  const stableFunctions = React.useMemo(() => ({
    setSearchValue,
    setIsOpen: isOpenControlled ? onOpenChange : setInternalOpen,
    setSelectedValue: setInternalValue,
    setSelectedLabel,
  }), [isOpenControlled, onOpenChange])

  const contextValue = React.useMemo(() => ({
    searchValue,
    isSearchable: searchable,
    isOpen: currentOpen,
    onSearch,
    selectedValue: currentValue,
    selectedLabel,
    listboxId,
    activeDescendant,
    setActiveDescendant,
    ...stableFunctions,
  }), [searchValue, searchable, currentOpen, onSearch, currentValue, selectedLabel, listboxId, activeDescendant, stableFunctions])

  // For searchable selects, we need to handle open state manually
  if (searchable) {
    // Destructure conflicting props to prevent override of internal handlers
    const { value: _, onValueChange: __, open: ___, onOpenChange: ____, ...rootProps } = props

    return (
      <SelectSearchContext.Provider value={contextValue}>
        <SelectPrimitive.Root
          ref={ref}
          open={currentOpen}
          onOpenChange={handleOpenChange}
          value={currentValue}
          onValueChange={handleValueChange}
          {...rootProps}
        >
          {children}
        </SelectPrimitive.Root>
      </SelectSearchContext.Provider>
    )
  }

  // For regular selects, let Radix handle everything
  // Destructure value and onValueChange to prevent props collision
  const { value: _, onValueChange: __, ...restProps } = props

  return (
    <SelectSearchContext.Provider value={contextValue}>
      <SelectPrimitive.Root
        ref={ref}
        value={currentValue}
        onValueChange={handleValueChange}
        {...restProps}
      >
        {children}
      </SelectPrimitive.Root>
    </SelectSearchContext.Provider>
  )
})
Select.displayName = "Select"

const SelectGroup = SelectPrimitive.Group
SelectGroup.displayName = SelectPrimitive.Group.displayName

const SelectValue = SelectPrimitive.Value
SelectValue.displayName = SelectPrimitive.Value.displayName

const SelectTrigger = React.forwardRef(({ className, children, size, glass = false, error, success, placeholder, ...props }, ref) => {
  const contextSize = useSizeContext()
  const theme = useSafeResolvedTheme()
  const effectiveSize = size || contextSize || 'md'
  const { isHovered, handlers } = useInputStates()
  const { searchValue, setSearchValue, isSearchable, isOpen, setIsOpen, selectedLabel, listboxId, activeDescendant } = React.useContext(SelectSearchContext) || {}
  const [isFocused, setIsFocused] = React.useState(false)
  const inputRef = React.useRef(null)

  // Get display value - for searchable, always show search value to maintain combobox appearance
  const displayValue = React.useMemo(() => {
    if (isSearchable) {
      return searchValue
    }
    return selectedLabel || ""
  }, [isSearchable, searchValue, selectedLabel])

  // Get placeholder text - for searchable, show selection in placeholder when not searching
  const placeholderText = React.useMemo(() => {
    if (isSearchable) {
      // If we have a selection and no search value, show the selected label as placeholder
      if (selectedLabel && !searchValue) {
        return selectedLabel
      }
      // Otherwise show the regular placeholder
      return placeholder || "Search options..."
    }
    return placeholder
  }, [isSearchable, selectedLabel, searchValue, placeholder])

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
      ? "bg-background/95 border-border/50"
      : "bg-background/95 border-border/50"
  }

  const getSelectStateClasses = () => {
    if (error) {
      return "border-destructive/70 ring-2 ring-destructive/25 text-destructive"
    }
    if (success) {
      return "border-emerald-500/70 ring-2 ring-emerald-500/25"
    }
    return ""
  }

  const handleInputClick = () => {
    if (isSearchable) {
      if (!isOpen) {
        setIsOpen(true)
      }
      // Use immediate focus without setTimeout
      inputRef.current?.focus()
    }
  }

  const handleInputChange = (e) => {
    if (isSearchable) {
      const value = e.target.value
      setSearchValue(value)
      if (!isOpen) {
        setIsOpen(true)
      }
    }
  }

  const handleKeyDown = (e) => {
    if (!isSearchable) return

    switch (e.key) {
      case 'Escape':
        if (isOpen) {
          setIsOpen(false)
          inputRef.current?.blur()
          e.preventDefault()
        }
        break
      case 'ArrowDown':
        // Open menu and allow Radix to handle navigation
        if (!isOpen) {
          setIsOpen(true)
        }
        // Don't prevent default - let Radix handle the navigation
        break
      case 'ArrowUp':
        // Open menu and allow Radix to handle navigation
        if (!isOpen) {
          setIsOpen(true)
        }
        // Don't prevent default - let Radix handle the navigation
        break
      case 'Enter':
        // If menu is closed, open it
        if (!isOpen) {
          setIsOpen(true)
          e.preventDefault()
        }
        // If menu is open, let Radix handle the selection
        break
      case 'Tab':
        // Allow natural tab behavior, close menu if open
        if (isOpen) {
          setIsOpen(false)
        }
        break
    }
  }

  const clearSearch = () => {
    setSearchValue("")
    // Use setTimeout to ensure the input ref is still valid after clearing
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  if (isSearchable) {
    // Destructure user event handlers to compose with internal handlers
    const { onClick: userOnClick, ...restProps } = props

    // Compose onClick handlers - internal first, then user callback
    const composedOnClick = (e) => {
      handleInputClick(e)
      if (userOnClick) {
        userOnClick(e)
      }
    }


    return (
      <SelectPrimitive.Trigger asChild>
        <div
          ref={ref}
          className={cn(
            "relative flex w-full items-center rounded-xl border shadow-sm ring-offset-background group",
            "transition-all duration-300 ease-out cursor-pointer",
            // Enhanced glass effect using form glass effects
            glass ? cn(glassEffect.trigger, reducedTransparency, "backdrop-blur-xl") : getSelectStyles(),
            // Focus states with glow effect
            isFocused && "ring-2 ring-primary/30 border-primary/60 shadow-lg shadow-primary/10",
            // Hover states with elevation
            "hover:border-border/90 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5",
            // State-based styling
            getSelectStateClasses(),
            transition,
            sizeClasses[effectiveSize],
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id || 'select'}-error` : props['aria-describedby']}
          onClick={composedOnClick}
          {...handlers}
          {...restProps}
        >
          {/* Search Icon */}
          <div className="absolute left-4 flex items-center pointer-events-none z-10">
            <MagnifyingGlassIcon className={cn(
              "text-muted-foreground transition-colors duration-200",
              (isFocused || searchValue) && "text-primary",
              iconSizeClasses[effectiveSize]
            )} />
          </div>

          {/* Hidden SelectValue for Radix UI compatibility */}
          <div className="sr-only">
            {children}
          </div>

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={(e) => {
              setIsFocused(true)
              if (!isOpen) {
                setIsOpen(true)
              }
              e.stopPropagation()
            }}
            onBlur={(e) => {
              setIsFocused(false)
              e.stopPropagation()
            }}
            onClick={(e) => {
              e.stopPropagation()
              handleInputClick()
            }}
            placeholder={placeholderText}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={activeDescendant || undefined}
            aria-label={placeholder || "Search and select an option"}
            aria-describedby={error ? `${props.id || 'select'}-error` : props['aria-describedby']}
            className={cn(
              "flex-1 bg-transparent border-0 outline-none pl-10 pr-16 z-20 relative",
              "placeholder:text-muted-foreground/70 text-foreground font-medium",
              "selection:bg-primary/20",
              // Ensure input appears active and ready for typing
              "caret-primary"
            )}
          />

          {/* Clear Button */}
          {searchValue && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                clearSearch()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  e.stopPropagation()
                  clearSearch()
                }
              }}
              className={cn(
                "absolute right-12 p-1 rounded-md opacity-100 z-30",
                "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                "transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary/50"
              )}
              aria-label="Clear search"
            >
              <Cross2Icon className="h-3 w-3" aria-hidden="true" />
            </button>
          )}

          {/* Dropdown Icon */}
          <SelectPrimitive.Icon asChild>
            <div className="absolute right-4 flex items-center pointer-events-none z-10">
              <ChevronDownIcon className={cn(
                "text-muted-foreground transition-all duration-300 ease-out",
                isOpen && "rotate-180 text-primary",
                isHovered && "scale-110",
                iconSizeClasses[effectiveSize]
              )} />
            </div>
          </SelectPrimitive.Icon>
        </div>
      </SelectPrimitive.Trigger>
    )
  }

  // Traditional select trigger (non-searchable)
  // For non-searchable, no internal onClick to compose, so handlers come from useInputStates
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex w-full items-center justify-between rounded-xl border shadow-sm ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        // Enhanced typography and visual hierarchy
        "font-semibold text-foreground tracking-wide",
        // Advanced focus states with glow
        "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 focus:shadow-lg focus:shadow-primary/10",
        // Sophisticated hover effects
        "hover:border-border/90 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5 hover:scale-[1.01]",
        "transition-all duration-300 ease-out",
        // Size and styling
        sizeClasses[effectiveSize],
        glass ? cn(glassEffect.trigger, reducedTransparency, "backdrop-blur-xl") : "bg-background/98 border-border/60 backdrop-blur-sm",
        getSelectStateClasses(),
        transition,
        className
      )}
      {...handlers}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <div className="flex items-center justify-center transition-all duration-300">
          <ChevronDownIcon className={cn(
            "text-muted-foreground transition-all duration-300 ease-out",
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

const SelectContent = React.forwardRef(({ className, children, position = "popper", size, glass = false, loading = false, ...props }, ref) => {
  const contextSize = useSizeContext()
  const theme = useSafeResolvedTheme()
  const effectiveSize = size || contextSize || 'md'
  const { isSearchable, searchValue, listboxId, setActiveDescendant } = React.useContext(SelectSearchContext) || {}
  const viewportRef = React.useRef(null)

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

  // Helper function to highlight matches in text
  const highlightMatches = React.useCallback((text, searchTerm) => {
    if (!searchTerm || !text) return text

    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedTerm})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) => {
      // Use case-insensitive direct comparison to avoid regex.test issues
      if (part.toLowerCase() === searchTerm.toLowerCase()) {
        return (
          <mark
            key={index}
            className="bg-primary/20 text-primary font-medium rounded-sm px-0.5"
          >
            {part}
          </mark>
        )
      }
      return part
    })
  }, [])

  // Separate filtering logic from transformation
  const filteredChildren = React.useMemo(() => {
    if (!isSearchable || !searchValue) {
      return children // Show all when not searching
    }

    const searchTerm = searchValue.toLowerCase().trim()
    if (!searchTerm) {
      return children
    }

    const filterItems = (items) => {
      const filtered = []

      React.Children.forEach(items, (child) => {
        if (!React.isValidElement(child)) {
          return
        }

        // Handle SelectItem
        if (child.type?.displayName === 'SelectItem' || child.type === SelectItem) {
          const childText = typeof child.props.children === 'string'
            ? child.props.children
            : (child.props.value || '')

          // Convert to string safely and handle null/undefined
          const searchTarget = String(childText || '').toLowerCase()

          // Case-insensitive partial match
          if (searchTarget.includes(searchTerm)) {
            // Clone item with highlighted text
            const highlightedChildren = typeof child.props.children === 'string'
              ? highlightMatches(child.props.children, searchTerm)
              : child.props.children

            filtered.push(
              React.cloneElement(child, {
                key: child.key,
                children: highlightedChildren
              })
            )
          }
          return
        }

        // Handle SelectGroup recursively
        if (child.type?.displayName === 'SelectGroup' || child.type === SelectGroup) {
          const filteredGroupChildren = filterItems(child.props.children)
          if (filteredGroupChildren.length > 0) {
            filtered.push(
              React.cloneElement(child, { key: child.key }, filteredGroupChildren)
            )
          }
          return
        }

        // Keep labels, separators, and other elements as-is
        if (child.type?.displayName === 'SelectLabel' ||
            child.type?.displayName === 'SelectSeparator' ||
            child.type === SelectLabel ||
            child.type === SelectSeparator) {
          filtered.push(child)
        }
      })

      return filtered
    }

    return filterItems(children)
  }, [children, isSearchable, searchValue, highlightMatches])

  // Show "No results" message for searchable selects with no matches
  const showNoResults = React.useMemo(() => {
    if (!isSearchable || !searchValue?.trim()) {
      return false
    }

    // Count actual SelectItems in filtered results
    const hasSelectItems = React.Children.toArray(filteredChildren).some(child => {
      if (React.isValidElement(child)) {
        if (child.type?.displayName === 'SelectItem' || child.type === SelectItem) {
          return true
        }
        if (child.type?.displayName === 'SelectGroup' || child.type === SelectGroup) {
          return React.Children.toArray(child.props.children).some(groupChild =>
            React.isValidElement(groupChild) &&
            (groupChild.type?.displayName === 'SelectItem' || groupChild.type === SelectItem)
          )
        }
      }
      return false
    })

    return !hasSelectItems
  }, [isSearchable, searchValue, filteredChildren])

  // Set up MutationObserver to track highlighted element for keyboard navigation
  React.useEffect(() => {
    if (!isSearchable || !setActiveDescendant || !viewportRef.current) {
      return
    }

    const viewport = viewportRef.current

    // Function to update active descendant based on highlighted element
    const updateActiveDescendant = () => {
      const highlightedElement = viewport.querySelector('[data-highlighted]')
      const elementId = highlightedElement?.id || ''
      setActiveDescendant(elementId)
    }

    // Initialize on mount
    updateActiveDescendant()

    // Set up mutation observer to watch for highlight changes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        // Check for attribute changes (data-highlighted)
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-highlighted') {
          updateActiveDescendant()
          break
        }
        // Check for child list changes (items added/removed)
        if (mutation.type === 'childList') {
          updateActiveDescendant()
          break
        }
      }
    })

    // Start observing
    observer.observe(viewport, {
      attributes: true,
      attributeFilter: ['data-highlighted'],
      childList: true,
      subtree: true
    })

    // Cleanup
    return () => {
      observer.disconnect()
    }
  }, [isSearchable, setActiveDescendant])

  return (
    <SelectPrimitive.Portal>
      <SelectGlassContext.Provider value={glass}>
        <SelectPrimitive.Content
          ref={ref}
          className={cn(
            "relative z-50 max-h-96 min-w-[12rem] overflow-hidden rounded-2xl border shadow-2xl",
            // Enhanced glass effect with better depth and blur
            glass ? cn(glassEffect.content, reducedTransparencyContent, "backdrop-blur-2xl") : "bg-popover/95 backdrop-blur-sm border-border/60",
            "text-popover-foreground",
            // Premium animations with spring physics
            "animate-in fade-in-0 zoom-in-98 duration-300",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-98 data-[state=open]:zoom-in-98",
            "data-[state=closed]:duration-200 data-[state=open]:duration-300",
            // Directional slide animations with enhanced smoothness
            "data-[side=bottom]:slide-in-from-top-3 data-[side=left]:slide-in-from-right-3",
            "data-[side=right]:slide-in-from-left-3 data-[side=top]:slide-in-from-bottom-3",
            position === "popper" &&
              "data-[side=bottom]:translate-y-2 data-[side=left]:-translate-x-2 data-[side=right]:translate-x-2 data-[side=top]:-translate-y-2",
            sizeClasses[effectiveSize],
            transition,
            className
          )}
          position={position}
          {...props}>

          <SelectScrollUpButton />

          <SelectPrimitive.Viewport
            ref={viewportRef}
            className={cn(
              "relative",
              viewportSizeClasses[effectiveSize],
              position === "popper" &&
                "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
            )}
            id={listboxId}
            role="listbox"
            aria-label="Available options">

            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center" role="status" aria-live="polite">
                <UpdateIcon className="h-8 w-8 text-muted-foreground/60 mb-3 animate-spin" aria-hidden="true" />
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Loading options...
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Please wait while we fetch the data
                </p>
              </div>
            ) : showNoResults ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center" role="status" aria-live="polite">
                <MagnifyingGlassIcon className="h-8 w-8 text-muted-foreground/40 mb-3" aria-hidden="true" />
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  No results found
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Try a different search term
                </p>
              </div>
            ) : (
              filteredChildren
            )}

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

const SelectItem = React.forwardRef(({ className, children, size, disabled, value, ...props }, ref) => {
  const contextSize = useSizeContext()
  const effectiveSize = size || contextSize || 'md'
  const parentGlass = React.useContext(SelectGlassContext)
  const { isSearchable, setSelectedLabel, setSearchValue, selectedValue, setActiveDescendant } = React.useContext(SelectSearchContext)
  const [isHovered, setIsHovered] = React.useState(false)
  const isMountedRef = React.useRef(false)

  // Generate unique ID for this item
  const itemId = React.useMemo(() => `select-option-${String(value).replace(/[^a-zA-Z0-9]/g, '-')}`, [value])

  // Set label when this item matches the selected value
  React.useEffect(() => {
    // Only update after the component has mounted to avoid render-phase updates
    if (isMountedRef.current && isSearchable && String(selectedValue) === String(value)) {
      const label = typeof children === 'string' ? children : String(value || '')
      setSelectedLabel(label)
    }
  }, [isSearchable, selectedValue, value, children, setSelectedLabel])

  // Track mounting state
  React.useEffect(() => {
    isMountedRef.current = true
    // If this item is selected on mount, update the label
    if (isSearchable && String(selectedValue) === String(value)) {
      const label = typeof children === 'string' ? children : String(value || '')
      setSelectedLabel(label)
    }
  }, [isSearchable, selectedValue, value, children, setSelectedLabel])

  const sizeClasses = {
    sm: "py-3.5 pl-5 pr-12 text-sm min-h-[44px]",
    md: "py-4 pl-6 pr-14 text-sm min-h-[48px]",
    lg: "py-5 pl-7 pr-16 text-base min-h-[52px]"
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

  const handleSelect = (event) => {
    if (isSearchable) {
      // Set the selected label and clear search immediately
      const label = typeof children === 'string' ? children : value || ''
      setSelectedLabel(label)
      setSearchValue("")
      // Let Radix UI handle the selection and closing naturally
      // No setTimeout needed - align with Radix lifecycle
    }
    // Call the original onSelect if provided
    if (props.onSelect) {
      props.onSelect(event)
    }
  }

  return (
    <SelectPrimitive.Item
      ref={ref}
      disabled={disabled}
      onMouseEnter={() => {
        setIsHovered(true)
        if (isSearchable && setActiveDescendant) {
          setActiveDescendant(itemId)
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        if (isSearchable && setActiveDescendant) {
          setActiveDescendant('')
        }
      }}
      value={value}
      onSelect={handleSelect}
      id={itemId}
      role="option"
      aria-selected={String(selectedValue) === String(value)}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-xl mx-1 outline-none group",
        "transition-all duration-200 ease-out",
        // Enhanced disabled state
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed",
        // Sophisticated hover effects with glass morphism
        "hover:bg-gradient-to-r hover:from-primary/8 hover:to-primary/4",
        "hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02] hover:-translate-y-0.5",
        "hover:border hover:border-primary/20",
        // Focus states with enhanced visibility
        "focus:bg-gradient-to-r focus:from-primary/12 focus:to-primary/6 focus:text-foreground",
        "focus:shadow-lg focus:shadow-primary/10 focus:ring-2 focus:ring-primary/20",
        // Selected state with premium styling
        "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary/15 data-[state=checked]:to-primary/8",
        "data-[state=checked]:text-primary data-[state=checked]:font-semibold",
        "data-[state=checked]:shadow-lg data-[state=checked]:shadow-primary/10",
        "data-[state=checked]:border data-[state=checked]:border-primary/30",
        // Size and layout
        sizeClasses[effectiveSize],
        // Glass-specific enhancements
        parentGlass && [
          "hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5",
          "focus:bg-gradient-to-r focus:from-white/15 focus:to-white/8",
          "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary/20 data-[state=checked]:to-primary/10"
        ],
        transition,
        className
      )}
      {...props}>

      {/* Check icon with smooth animations */}
      <span className={cn(
        "absolute flex items-center justify-center transition-all duration-200",
        iconSizeClasses[effectiveSize]
      )}>
        <SelectPrimitive.ItemIndicator>
          <div className="relative">
            <CheckIcon className={cn(
              "text-primary transition-all duration-200 ease-out",
              "scale-110 drop-shadow-sm",
              checkIconSizeClasses[effectiveSize]
            )} />
            {/* Subtle glow effect for selected state */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-sm scale-150 opacity-0 animate-ping" />
          </div>
        </SelectPrimitive.ItemIndicator>
      </span>

      {/* Content with enhanced typography */}
      <SelectPrimitive.ItemText className={cn(
        "font-medium tracking-wide transition-all duration-200",
        "group-hover:text-foreground/90",
        "group-data-[state=checked]:font-semibold group-data-[state=checked]:tracking-normal",
        disabled && "text-muted-foreground/50"
      )}>
        {children}
      </SelectPrimitive.ItemText>

      {/* Hover indicator */}
      {isHovered && !disabled && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
      )}
    </SelectPrimitive.Item>
  )
})
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn(
      "mx-2 my-2 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent",
      "shadow-sm",
      className
    )}
    {...props} />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// Convenient hook for search functionality
const useSelectSearch = () => {
  const context = React.useContext(SelectSearchContext)
  if (!context) {
    // Return safe defaults when context is null (outside Select component)
    return {
      searchValue: "",
      setSearchValue: () => {},
      isSearchable: false,
      isOpen: false,
      setIsOpen: () => {},
      onSearch: undefined,
      selectedValue: "",
      setSelectedValue: () => {},
      selectedLabel: "",
      setSelectedLabel: () => {},
    }
  }
  return context
}

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
  useSelectSearch,
}
