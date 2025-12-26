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
import { useSizeContext, sizeVariants } from "./size-provider"
import { getSelectGlass, getReducedTransparencyForm, getFormGlassEffect, getBrandFormGlow, optimizeFormGlassPerformance, getFormGlassForSize, scaleFormGlass, getResponsiveFormBlur } from "@/utils/form-glass-effects"
import { useSafeResolvedTheme } from "@/utils/safe-theme"
import { useInputStates, FORM_ANIMATION_CLASSES } from "@/utils/form-animations"
import { Spinner } from "@/components/ui/spinner"

// Internal lightweight context for communication between sub-components
const SelectInternalContext = React.createContext(null)

// Shared utility for scroll button size mappings to eliminate duplication
const getScrollButtonSizeClasses = (effectiveSize) => {
  const variant = sizeVariants[effectiveSize] || sizeVariants.md

  return {
    button: cn(
      // Base styling with enhanced positioning
      "flex cursor-pointer items-center justify-center",
      "relative group transition-all duration-200 ease-bounce",

      // Brand color theming
      "text-foreground/70 hover:text-brand-dark-blue",
      "hover:bg-brand-celeste/10 active:bg-brand-celeste/20",

      // Enhanced interactivity
      "hover:shadow-glow-brand-celeste/20 hover:scale-110",
      "focus:outline-none focus:ring-2 focus:ring-brand-dark-blue/30",
      "focus:bg-brand-dark-blue/5",

      // Disabled state handling
      "disabled:cursor-not-allowed disabled:opacity-50",
      "disabled:hover:text-foreground/70 disabled:hover:bg-transparent",

      // Size System integration using sizeVariants
      variant.spacing.item,

      // Performance optimizations
      "will-change-transform",
      FORM_ANIMATION_CLASSES.base
    ),
    icon: variant.icon.size
  }
}

// Internal hook for managing value and open state
const useSelectState = ({ value, onValueChange, open, onOpenChange }) => {
  const [internalValue, setInternalValue] = React.useState("")
  const [internalOpen, setInternalOpen] = React.useState(false)

  // Determine if we're in controlled mode for value and open state
  const isValueControlled = value !== undefined
  const isOpenControlled = open !== undefined
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
  }, [onValueChange, isValueControlled])

  const handleOpenChange = React.useCallback((open) => {
    // Update internal state for uncontrolled mode
    if (!isOpenControlled) {
      setInternalOpen(open)
    }

    // Always call the callback if provided
    if (onOpenChange) {
      onOpenChange(open)
    }
  }, [onOpenChange, isOpenControlled])

  const setValue = isValueControlled ? onValueChange : setInternalValue
  const setOpen = isOpenControlled ? onOpenChange : setInternalOpen

  return {
    value: currentValue,
    setValue,
    open: currentOpen,
    setOpen,
    handleValueChange,
    handleOpenChange
  }
}

// Public hook for search functionality
const useSelectSearch = () => {
  const context = React.useContext(SelectInternalContext)
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
      navigateUp: () => {},
      navigateDown: () => {},
      selectHighlighted: () => null,
      highlightedIndex: -1,
      availableItems: []
    }
  }
  return context
}

// Internal hook for search functionality with debouncing and label derivation
const useSelectSearchInternal = ({ searchable, onSearch, children, value }) => {
  const [searchValue, setSearchValue] = React.useState("")
  const [selectedLabel, setSelectedLabel] = React.useState("")
  const [activeDescendant, setActiveDescendant] = React.useState("")
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const [availableItems, setAvailableItems] = React.useState([])

  // Generate unique IDs for accessibility (when searchable)
  const listboxId = React.useMemo(() => searchable ? `select-listbox-${Math.random().toString(36).substring(2, 11)}` : null, [searchable])

  // Debounced search functionality
  React.useEffect(() => {
    if (!onSearch) return

    const timer = setTimeout(() => {
      onSearch(searchValue)
    }, 150)

    return () => clearTimeout(timer)
  }, [searchValue, onSearch])

  // Sync selectedLabel when value changes (for controlled mode or initial selection)
  React.useEffect(() => {
    if (!searchable || !value) return

    // Derive label from children by scanning SelectItem elements
    const findLabelFromChildren = (childrenToScan) => {
      let foundLabel = ''

      React.Children.forEach(childrenToScan, (child) => {
        if (foundLabel || !React.isValidElement(child)) return

        // Check SelectItem directly
        if (child.type?.displayName === 'SelectItem' || child.type === SelectItem) {
          if (String(child.props.value) === String(value)) {
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
    } else if (!value) {
      setSelectedLabel("")
    } else if (!derivedLabel && selectedLabel) {
      setSelectedLabel("")
    }
  }, [searchable, value, children, selectedLabel])

  // Extract available items from children for keyboard navigation
  React.useEffect(() => {
    const extractItems = (childrenToScan) => {
      const items = []

      React.Children.forEach(childrenToScan, (child) => {
        if (!React.isValidElement(child)) return

        // Handle SelectItem directly
        if (child.type?.displayName === 'SelectItem' || child.type === SelectItem) {
          items.push({
            value: child.props.value,
            label: typeof child.props.children === 'string'
              ? child.props.children
              : String(child.props.value || ''),
            disabled: child.props.disabled || false
          })
          return
        }

        // Handle SelectGroup recursively
        if (child.type?.displayName === 'SelectGroup' || child.type === SelectGroup) {
          items.push(...extractItems(child.props.children))
        }
      })

      return items.filter(item => !item.disabled)
    }

    const items = extractItems(children)
    setAvailableItems(items)
  }, [children])

  // Reset highlighted index when items change
  React.useEffect(() => {
    setHighlightedIndex(-1)
  }, [availableItems])

  // Keyboard navigation functions
  const navigateUp = React.useCallback(() => {
    setHighlightedIndex(prev => {
      const newIndex = prev <= 0 ? availableItems.length - 1 : prev - 1
      const item = availableItems[newIndex]
      if (item) {
        setActiveDescendant(`select-option-${String(item.value).replace(/[^a-zA-Z0-9]/g, '-')}`)
      }
      return newIndex
    })
  }, [availableItems])

  const navigateDown = React.useCallback(() => {
    setHighlightedIndex(prev => {
      const newIndex = prev >= availableItems.length - 1 ? 0 : prev + 1
      const item = availableItems[newIndex]
      if (item) {
        setActiveDescendant(`select-option-${String(item.value).replace(/[^a-zA-Z0-9]/g, '-')}`)
      }
      return newIndex
    })
  }, [availableItems])

  const selectHighlighted = React.useCallback(() => {
    if (highlightedIndex >= 0 && highlightedIndex < availableItems.length) {
      const item = availableItems[highlightedIndex]
      return item.value
    }
    return null
  }, [highlightedIndex, availableItems])

  return {
    searchValue,
    setSearchValue,
    selectedLabel,
    setSelectedLabel,
    activeDescendant,
    setActiveDescendant,
    listboxId,
    highlightedIndex,
    setHighlightedIndex,
    availableItems,
    navigateUp,
    navigateDown,
    selectHighlighted
  }
}

// Enhanced Select component with simplified architecture
const Select = React.forwardRef(({ searchable = false, onSearch, children, value, onValueChange, open, onOpenChange, isLoading = false, ...props }, ref) => {
  // Use new utility hooks for clean separation of concerns
  const selectState = useSelectState({ value, onValueChange, open, onOpenChange })
  const searchState = useSelectSearchInternal({ searchable, onSearch, children, value: selectState.value })

  // Clear search when value changes or menu closes
  React.useEffect(() => {
    if (searchable) {
      searchState.setSearchValue("")
    }
  }, [selectState.value, searchable, searchState])

  React.useEffect(() => {
    if (!selectState.open && searchable) {
      searchState.setSearchValue("")
    }
  }, [selectState.open, searchable, searchState])

  // Create lightweight context value for sub-components
  const contextValue = React.useMemo(() => ({
    // State values
    searchValue: searchState.searchValue,
    isSearchable: searchable,
    isOpen: selectState.open,
    selectedValue: selectState.value,
    selectedLabel: searchState.selectedLabel,
    listboxId: searchState.listboxId,
    activeDescendant: searchState.activeDescendant,
    highlightedIndex: searchState.highlightedIndex,
    availableItems: searchState.availableItems,
    isLoading,
    onSearch,
    // State setters
    setSearchValue: searchState.setSearchValue,
    setIsOpen: selectState.setOpen,
    setSelectedValue: selectState.setValue,
    setSelectedLabel: searchState.setSelectedLabel,
    setActiveDescendant: searchState.setActiveDescendant,
    setHighlightedIndex: searchState.setHighlightedIndex,
    // Navigation functions
    navigateUp: searchState.navigateUp,
    navigateDown: searchState.navigateDown,
    selectHighlighted: searchState.selectHighlighted
  }), [
    searchState.searchValue,
    searchable,
    selectState.open,
    selectState.value,
    searchState.selectedLabel,
    searchState.listboxId,
    searchState.activeDescendant,
    searchState.highlightedIndex,
    searchState.availableItems,
    isLoading,
    onSearch,
    searchState.setSearchValue,
    selectState.setOpen,
    selectState.setValue,
    searchState.setSelectedLabel,
    searchState.setActiveDescendant,
    searchState.setHighlightedIndex,
    searchState.navigateUp,
    searchState.navigateDown,
    searchState.selectHighlighted
  ])

  // Prepare handlers and props for both searchable and regular modes
  const { value: _, onValueChange: __, open: ___, onOpenChange: originalOnOpenChange, ...restProps } = props

  // Always define the composed handler to avoid conditional hook usage
  const composedOpenChange = React.useCallback((nextOpen) => {
    selectState.handleOpenChange(nextOpen)
    if (originalOnOpenChange) {
      originalOnOpenChange(nextOpen)
    }
  }, [selectState, originalOnOpenChange])

  // For searchable selects, we need to handle open state manually
  if (searchable) {
    return (
      <SelectInternalContext.Provider value={contextValue}>
        <SelectPrimitive.Root
          ref={ref}
          open={selectState.open}
          onOpenChange={selectState.handleOpenChange}
          value={selectState.value}
          onValueChange={selectState.handleValueChange}
          {...restProps}
        >
          {children}
        </SelectPrimitive.Root>
      </SelectInternalContext.Provider>
    )
  }

  // For regular selects, let Radix handle everything

  return (
    <SelectInternalContext.Provider value={contextValue}>
      <SelectPrimitive.Root
        ref={ref}
        value={selectState.value}
        onValueChange={selectState.handleValueChange}
        {...(open !== undefined ? { open: selectState.open } : {})}
        onOpenChange={composedOpenChange}
        {...restProps}
      >
        {children}
      </SelectPrimitive.Root>
    </SelectInternalContext.Provider>
  )
})
Select.displayName = "Select"

/**
 * SelectGroup - Enhanced group wrapper with proper spacing and documentation
 *
 * Features:
 * - Subtle visual enhancements with proper spacing between groups
 * - Performance optimizations using optimizeFormGlassPerformance()
 * - Maintains backward compatibility while improving visual hierarchy
 * - Proper semantic grouping for accessibility
 *
 * @param {React.ReactNode} children - Group content including SelectLabel and SelectItem components
 * @param {string} className - Additional CSS classes
 * @param {...object} props - All other props passed to underlying Group component
 *
 * @example
 * ```jsx
 * <SelectGroup>
 *   <SelectLabel>Fruits</SelectLabel>
 *   <SelectItem value="apple">Apple</SelectItem>
 *   <SelectItem value="banana">Banana</SelectItem>
 * </SelectGroup>
 * ```
 */
const SelectGroup = React.forwardRef(({ className, ...props }, ref) => {
  // Memoized classes for performance optimization
  const groupClasses = React.useMemo(() => {
    return cn(
      // Subtle visual enhancements with proper spacing
      "space-y-1 [&:not(:first-child)]:mt-3",

      // Performance optimizations
      optimizeFormGlassPerformance(),

      className
    )
  }, [className])

  return (
    <SelectPrimitive.Group
      ref={ref}
      className={groupClasses}
      {...props}
    />
  )
})
SelectGroup.displayName = SelectPrimitive.Group.displayName

/**
 * SelectValue - Enhanced value display with typography and truncation
 *
 * Features:
 * - Enhanced typography with font-medium and tracking-wide
 * - Proper text truncation for long values with ellipsis
 * - Performance optimizations for re-renders
 * - Maintains compatibility with Radix UI Select
 * - Accessible placeholder handling
 *
 * @param {string} placeholder - Placeholder text when no value is selected
 * @param {string} className - Additional CSS classes
 * @param {...object} props - All other props passed to underlying Value component
 *
 * @example
 * ```jsx
 * <SelectValue placeholder="Choose an option..." />
 * <SelectValue placeholder="Select item" className="text-brand-dark-blue" />
 * ```
 */
const SelectValue = React.forwardRef(({ className, ...props }, ref) => {
  // Memoized classes for performance optimization
  const valueClasses = React.useMemo(() => {
    return cn(
      // Enhanced typography
      "font-medium tracking-wide",

      // Proper text truncation for long values
      "truncate max-w-full",

      // Performance optimizations
      optimizeFormGlassPerformance(),

      className
    )
  }, [className])

  return (
    <SelectPrimitive.Value
      ref={ref}
      className={valueClasses}
      {...props}
    />
  )
})
SelectValue.displayName = SelectPrimitive.Value.displayName

const SelectTrigger = React.forwardRef(({ className, children, size, glass = false, error, success, placeholder, textAlign = 'left', ...props }, ref) => {
  const theme = useSafeResolvedTheme()
  const { isHovered, handlers } = useInputStates()
  const {
    searchValue,
    setSearchValue,
    isSearchable,
    isOpen,
    setIsOpen,
    selectedLabel,
    listboxId,
    activeDescendant,
    navigateUp,
    navigateDown,
    selectHighlighted,
    setSelectedValue,
    isLoading
  } = React.useContext(SelectInternalContext) || {}
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

  // No more JS-based size classes - using CSS utility classes directly

  // 6-tier Glassmorphism Implementation
  const glassEffect = React.useMemo(() => {
    if (!glass) return null

    const intensity = typeof glass === 'string' ? glass : 'minimal'
    return getFormGlassEffect(intensity, theme)
  }, [glass, theme])

  // Glass blur intensity mapping
  const getGlassBlur = React.useMemo(() => {
    if (!glass) return ''

    const intensity = typeof glass === 'string' ? glass : 'minimal'
    const blurMap = {
      minimal: 'backdrop-blur-sm',
      subtle: 'backdrop-blur-sm',
      medium: 'backdrop-blur-md',
      strong: 'backdrop-blur-lg'
    }

    return blurMap[intensity] || 'backdrop-blur-sm'
  }, [glass])

  // Brand Color Integration - Focus on borders/rings/glows to preserve glass background
  const getBrandColorClasses = () => {
    // For glass mode, use minimal background tint to preserve glass effect
    // For non-glass mode, use more prominent background colors
    const baseClasses = glass
      ? "border-brand-celeste/20" // Glass mode: border-only accent
      : "bg-brand-celeste/10 border-brand-celeste/20" // Non-glass mode: background + border

    if (error) {
      return "border-destructive/70 ring-2 ring-destructive/20 text-destructive animate-shake" +
             (glass ? "" : " bg-destructive/5")
    }
    if (success) {
      return "border-brand-sun/30 ring-2 ring-brand-sun/25 animate-pulse-once" +
             (glass ? "" : " bg-brand-sun/10")
    }
    if (isFocused) {
      return "shadow-glow-brand-dark-blue/40 ring-2 ring-brand-dark-blue/30 ring-offset-2 ring-offset-background border-brand-dark-blue/50" +
             (glass ? "" : " bg-brand-dark-blue/5")
    }

    return baseClasses
  }

  // Text Alignment Classes
  const getTextAlignClasses = () => {
    const alignmentMap = {
      left: 'text-left justify-start',
      center: 'text-center justify-center',
      right: 'text-right justify-end'
    }
    return alignmentMap[textAlign] || alignmentMap.left
  }

  // Enhanced Visual Feedback States
  const getStateClasses = () => {
    const transition = "transition-all duration-200 ease-smooth"
    const hover = "hover:border-brand-celeste/40 hover:bg-brand-celeste/5 hover:shadow-lg hover:shadow-brand-celeste/10 hover:-translate-y-0.5"
    const focus = "focus:outline-none focus:ring-2 focus:ring-brand-dark-blue/30 focus:border-brand-dark-blue/60 focus:shadow-glow-brand-dark-blue/40"
    const disabled = "disabled:cursor-not-allowed disabled:opacity-50"

    return cn(transition, hover, focus, disabled)
  }

  // Simplified Input Event Handlers
  const handleInputClick = () => {
    if (isSearchable && !isOpen) {
      setIsOpen(true)
      inputRef.current?.focus()
    }
  }

  const handleInputChange = (e) => {
    if (isSearchable) {
      const value = e.target.value
      setSearchValue(value)
      if (!isOpen) setIsOpen(true)
    }
  }

  const handleSearchableKeyDown = (e) => {
    if (!isSearchable || props.disabled) return

    switch (e.key) {
      case 'Escape':
        if (isOpen) {
          setIsOpen(false)
          inputRef.current?.blur()
          e.preventDefault()
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          navigateDown?.()
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          navigateUp?.()
        }
        break
      case 'Enter':
        if (isOpen) {
          const selectedValue = selectHighlighted?.()
          if (selectedValue !== null) {
            setSelectedValue?.(selectedValue)
            setIsOpen?.(false)
          } else if (!isOpen) {
            setIsOpen(true)
            e.preventDefault()
          }
        } else {
          setIsOpen(true)
          e.preventDefault()
        }
        break
      case 'Tab':
        if (isOpen) setIsOpen(false)
        break
    }
  }

  const handleTraditionalKeyDown = (e) => {
    if (props.disabled) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen?.(true)
        } else {
          navigateDown?.()
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen?.(true)
        } else {
          navigateUp?.()
        }
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (isOpen) {
          const selectedValue = selectHighlighted?.()
          if (selectedValue !== null) {
            setSelectedValue?.(selectedValue)
            setIsOpen?.(false)
          }
        } else {
          setIsOpen?.(true)
        }
        break
      case 'Escape':
        if (isOpen) {
          e.preventDefault()
          setIsOpen?.(false)
        }
        break
    }
  }

  const clearSearch = () => {
    setSearchValue("")
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  // Searchable Mode Component
  if (isSearchable) {
    const { onClick: userOnClick, disabled, ...restProps } = props
    const composedOnClick = (e) => {
      if (disabled) return
      handleInputClick(e)
      userOnClick?.(e)
    }

    return (
      <SelectPrimitive.Trigger disabled={disabled || isLoading} asChild>
        <div
          ref={ref}
          className={cn(
            // Base styling with Size System
            "relative flex w-full items-center",
            textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-start',
            "size-radius",
            "border shadow-sm ring-offset-background group cursor-pointer",

            // Size System classes
            "size-input",

            // Glassmorphism with 6-tier system
            glass && glassEffect ? cn(glassEffect, getGlassBlur, "supports-[backdrop-filter:blur(0)]:bg-background/20") : "bg-background/95",

            // Brand colors and state feedback
            getBrandColorClasses(),

            // Enhanced animations and transitions
            getStateClasses(),

            // Disabled state
            (disabled || isLoading) && "pointer-events-none",

            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-disabled={(disabled || isLoading) ? 'true' : 'false'}
          aria-busy={isLoading ? 'true' : 'false'}
          aria-describedby={error ? `${props.id || 'select'}-error` : props['aria-describedby']}
          onClick={composedOnClick}
          {...handlers}
          {...restProps}
        >
          {/* Search Icon with Size System */}
          <div className={cn("absolute left-4 flex items-center pointer-events-none z-10")}>
            <MagnifyingGlassIcon className={cn(
              "text-muted-foreground transition-colors duration-200",
              (isFocused || searchValue) && "text-brand-dark-blue",
              "size-icon"
            )} />
          </div>

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute right-12 flex items-center pointer-events-none z-10">
              <Spinner size="sm" className="text-muted-foreground" />
            </div>
          )}

          {/* Hidden SelectValue for Radix UI compatibility */}
          <div className="sr-only">{children}</div>

          {/* Enhanced Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onKeyDown={handleSearchableKeyDown}
            onFocus={(e) => {
              if (disabled) return
              setIsFocused(true)
              if (!isOpen) setIsOpen(true)
              e.stopPropagation()
            }}
            onBlur={(e) => {
              setIsFocused(false)
              e.stopPropagation()
            }}
            onClick={(e) => {
              if (disabled) return
              e.stopPropagation()
              handleInputClick()
            }}
            placeholder={placeholderText}
            disabled={disabled || isLoading}
            tabIndex={(disabled || isLoading) ? -1 : undefined}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={activeDescendant || undefined}
            aria-label={placeholder || "Search and select an option"}
            aria-busy={isLoading ? 'true' : 'false'}
            aria-describedby={error ? `${props.id || 'select'}-error` : props['aria-describedby']}
            className={cn(
              "flex-1 bg-transparent border-0 outline-none z-20 relative",
              "placeholder:text-muted-foreground/70 text-foreground font-medium",
              "selection:bg-brand-dark-blue/20 caret-brand-dark-blue",
              "size-input-with-icon-left-padding",
              "pr-16", // Space for clear and dropdown icons
              getTextAlignClasses().split(' ')[0] // Apply text alignment (text-left, text-center, text-right)
            )}
          />

          {/* Enhanced Clear Button */}
          {searchValue && !disabled && (
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
                "absolute right-12 p-1 z-30",
                "size-radius",
                "text-muted-foreground hover:text-foreground hover:bg-brand-celeste/10",
                "transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-brand-dark-blue/50"
              )}
              aria-label="Clear search"
            >
              <Cross2Icon className="h-3 w-3" aria-hidden="true" />
            </button>
          )}

          {/* Enhanced Dropdown Icon */}
          <SelectPrimitive.Icon asChild>
            <div className="absolute right-4 flex items-center pointer-events-none z-10">
              <ChevronDownIcon className={cn(
                "text-muted-foreground transition-all duration-300 ease-smooth",
                isOpen && "rotate-180 text-brand-dark-blue",
                isHovered && "scale-110",
                "size-icon"
              )} />
            </div>
          </SelectPrimitive.Icon>
        </div>
      </SelectPrimitive.Trigger>
    )
  }

  // Traditional Select Trigger (Non-searchable)

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      onKeyDown={handleTraditionalKeyDown}
      disabled={props.disabled || isLoading}
      aria-busy={isLoading ? 'true' : 'false'}
      aria-disabled={(props.disabled || isLoading) ? 'true' : 'false'}
      className={cn(
        // Base styling with Size System
        "flex w-full items-center",
        textAlign === 'center' ? 'justify-center' : textAlign === 'right' ? 'justify-end' : 'justify-between',
        "size-radius",
        "border shadow-sm ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",

        // Size System classes
        "size-input",

        // Enhanced typography
        "font-medium text-foreground",

        // Text alignment
        getTextAlignClasses().split(' ')[0], // Apply text alignment (text-left, text-center, text-right)

        // Glassmorphism with 6-tier system
        glass && glassEffect ? cn(glassEffect, getGlassBlur, "supports-[backdrop-filter:blur(0)]:bg-background/20") : "bg-background border-input",

        // Brand colors and state feedback
        getBrandColorClasses(),

        // Enhanced animations and transitions
        getStateClasses(),
        "hover:scale-[1.01]", // Additional hover scale for non-searchable

        className
      )}
      {...handlers}
      {...props}
    >
      {children}
      {/* Loading Spinner */}
      {isLoading && (
        <Spinner size="sm" className="mr-2 text-muted-foreground" />
      )}
      <SelectPrimitive.Icon asChild>
        <div className="flex items-center justify-center transition-all duration-300">
          <ChevronDownIcon className={cn(
            "text-muted-foreground transition-all duration-300 ease-smooth",
            "data-[state=open]:rotate-180 data-[state=open]:text-brand-dark-blue",
            isHovered && "scale-110",
            "size-icon"
          )} />
        </div>
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

/**
 * SelectScrollUpButton - Enhanced scroll up button with Size System and brand color integration
 *
 * Features:
 * - Size System integration for consistent sizing
 * - Brand color theming with hover/focus states
 * - Enhanced interactivity with scale animations
 * - Proper accessibility with focus rings
 * - Performance optimized with memoization
 * - Smooth transitions with bounce easing
 *
 * @param {string} size - Size variant: 'sm', 'md', 'lg' (inherits from SizeProvider if not specified)
 * @param {string} className - Additional CSS classes
 * @param {React.Ref} ref - Forward ref for DOM access
 * @param {...object} props - All other props passed to underlying ScrollUpButton component
 *
 * @example
 * ```jsx
 * <SelectScrollUpButton /> // Standard size
 * <SelectScrollUpButton size="lg" /> // Large variant
 * <SelectScrollUpButton className="custom-class" /> // With custom styling
 * ```
 */
const SelectScrollUpButton = React.forwardRef(({ className, size, ...props }, ref) => {
  const contextSize = useSizeContext()
  const effectiveSize = size || contextSize || 'md'

  // Memoized classes for performance optimization using shared utility
  const buttonClasses = React.useMemo(() => {
    const sharedClasses = getScrollButtonSizeClasses(effectiveSize)

    return {
      button: cn(sharedClasses.button, className),
      icon: sharedClasses.icon
    }
  }, [effectiveSize, className])

  return (
    <SelectPrimitive.ScrollUpButton
      ref={ref}
      className={buttonClasses.button}
      aria-label="Scroll up to see more options"
      {...props}
    >
      <ChevronUpIcon
        className={cn(
          buttonClasses.icon,
          "transition-all duration-200 ease-bounce",
          "group-hover:scale-110 group-hover:text-brand-dark-blue"
        )}
        aria-hidden="true"
      />
    </SelectPrimitive.ScrollUpButton>
  )
})
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

/**
 * SelectScrollDownButton - Enhanced scroll down button with Size System and brand color integration
 *
 * Features:
 * - Size System integration for consistent sizing
 * - Brand color theming with hover/focus states
 * - Enhanced interactivity with scale animations
 * - Proper accessibility with focus rings and labels
 * - Performance optimized with memoization
 * - Smooth transitions with bounce easing
 * - Consistent styling with SelectScrollUpButton
 *
 * @param {string} size - Size variant: 'sm', 'md', 'lg' (inherits from SizeProvider if not specified)
 * @param {string} className - Additional CSS classes
 * @param {React.Ref} ref - Forward ref for DOM access
 * @param {...object} props - All other props passed to underlying ScrollDownButton component
 *
 * @example
 * ```jsx
 * <SelectScrollDownButton /> // Standard size
 * <SelectScrollDownButton size="lg" /> // Large variant
 * <SelectScrollDownButton className="custom-class" /> // With custom styling
 * ```
 */
const SelectScrollDownButton = React.forwardRef(({ className, size, ...props }, ref) => {
  const contextSize = useSizeContext()
  const effectiveSize = size || contextSize || 'md'

  // Memoized classes for performance optimization using shared utility
  const buttonClasses = React.useMemo(() => {
    const sharedClasses = getScrollButtonSizeClasses(effectiveSize)

    return {
      button: cn(sharedClasses.button, className),
      icon: sharedClasses.icon
    }
  }, [effectiveSize, className])

  return (
    <SelectPrimitive.ScrollDownButton
      ref={ref}
      className={buttonClasses.button}
      aria-label="Scroll down to see more options"
      {...props}
    >
      <ChevronDownIcon
        className={cn(
          buttonClasses.icon,
          "transition-all duration-200 ease-bounce",
          "group-hover:scale-110 group-hover:text-brand-dark-blue"
        )}
        aria-hidden="true"
      />
    </SelectPrimitive.ScrollDownButton>
  )
})
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef(({ className, children, position = "popper", size, glass = false, loading = false, ...props }, ref) => {
  const contextSize = useSizeContext()
  const effectiveSize = size || contextSize || 'md'
  const { isSearchable, searchValue, listboxId, setActiveDescendant } = React.useContext(SelectInternalContext) || {}
  const viewportRef = React.useRef(null)

  // Hook to detect if we're inside a dialog for proper z-index layering
  const [isInDialog, setIsInDialog] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const checkDialogContext = () => {
      // Check if any dialog is currently open in the document
      const hasOpenDialog = document.querySelector('[role="dialog"], [data-radix-dialog-content], [data-state="open"][role="dialog"]') !== null
      setIsInDialog(hasOpenDialog)
    }

    // Check immediately
    checkDialogContext()

    // Set up observer for dynamic dialog opening/closing
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' &&
            (mutation.attributeName === 'data-state' || mutation.attributeName === 'role')) {
          shouldCheck = true
          break
        }
        if (mutation.type === 'childList') {
          for (const node of [...mutation.addedNodes, ...mutation.removedNodes]) {
            if (node.nodeType === Node.ELEMENT_NODE &&
                (node.matches?.('[role="dialog"], [data-radix-dialog-content]') ||
                 node.querySelector?.('[role="dialog"], [data-radix-dialog-content]'))) {
              shouldCheck = true
              break
            }
          }
        }
        if (shouldCheck) break
      }
      if (shouldCheck) {
        setTimeout(checkDialogContext, 0) // Defer to next tick
      }
    })

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-state', 'role'],
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [])

  // Size System classes for consistent scaling
  const sizeClasses = React.useMemo(() => ({
    sm: "size-text-sm",
    md: "size-text-sm",
    lg: "size-text-base"
  }), [])

  const viewportSizeClasses = React.useMemo(() => ({
    sm: "size-padding-sm",
    md: "size-padding-md",
    lg: "size-padding-lg"
  }), [])

  // Enhanced glass effects with proper 6-tier system integration using utilities
  const contentGlass = React.useMemo(() => getFormGlassForSize(glass, effectiveSize), [glass, effectiveSize])
  const blur = React.useMemo(() => getResponsiveFormBlur(effectiveSize), [effectiveSize])

  const glassEffect = React.useMemo(() => {
    if (!glass) return { content: '' }
    // Use stronger background for better visibility while maintaining glass effect
    return {
      content: `${contentGlass} bg-background/95 backdrop-blur-xl border-border/30 shadow-xl`
    }
  }, [contentGlass, blur, glass])

  const reducedTransparencyContent = React.useMemo(() => glass ? getReducedTransparencyForm(glassEffect.content) : '', [glass, glassEffect.content])
  const performanceOptimization = React.useMemo(() => optimizeFormGlassPerformance(), [])

  // Enhanced search result highlighting with brand colors for complex content
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
            className={`bg-brand-sun/20 text-brand-dark-blue font-semibold rounded-sm px-0.5 border border-brand-sun/30 ${FORM_ANIMATION_CLASSES.base}`}
          >
            {part}
          </mark>
        )
      }
      return part
    })
  }, [])

  // Helper to highlight text nodes in complex React element trees
  const highlightTextNodes = React.useCallback((node, searchTerm) => {
    if (!searchTerm || !node) return node

    // Handle plain text strings
    if (typeof node === 'string') {
      return highlightMatches(node, searchTerm)
    }

    // Handle React elements recursively
    if (React.isValidElement(node)) {
      return React.cloneElement(node, {
        children: React.Children.map(node.props.children, child =>
          highlightTextNodes(child, searchTerm)
        )
      })
    }

    // Handle arrays of children
    if (Array.isArray(node)) {
      return node.map((child) => highlightTextNodes(child, searchTerm))
    }

    // Return other types as-is (numbers, booleans, etc.)
    return node
  }, [highlightMatches])

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

      React.Children.forEach(items, (child, index) => {
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
            // Clone item with enhanced highlighting for both simple text and complex content
            const highlightedChildren = React.isValidElement(child.props.children)
              ? highlightTextNodes(child.props.children, searchTerm)
              : typeof child.props.children === 'string'
              ? highlightMatches(child.props.children, searchTerm)
              : child.props.children

            filtered.push(
              React.cloneElement(child, {
                key: child.key ?? child.props.value ?? `item-${index}`,
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
              React.cloneElement(child, {
                key: child.key ?? child.props.label ?? `group-${index}`
              }, filteredGroupChildren)
            )
          }
          return
        }

        // Keep labels, separators, and other elements as-is
        if (child.type?.displayName === 'SelectLabel' ||
            child.type?.displayName === 'SelectSeparator' ||
            child.type === SelectLabel ||
            child.type === SelectSeparator) {
          filtered.push(React.cloneElement(child, {
            key: child.key ?? `${child.type?.displayName ?? 'element'}-${index}`
          }))
        }
      })

      return filtered
    }

    return filterItems(children)
  }, [children, isSearchable, searchValue, highlightMatches, highlightTextNodes])

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

  // Get current context and create enhanced context value that includes glass state
  const currentContext = React.useContext(SelectInternalContext)
  const enhancedContextValue = React.useMemo(() => ({
    ...(currentContext || {}),
    contentGlass: glass
  }), [currentContext, glass])

  // Ensure listboxId is set on the viewport when searchable
  React.useEffect(() => {
    if (isSearchable && listboxId && viewportRef.current) {
      viewportRef.current.setAttribute('id', listboxId)
    }
  }, [isSearchable, listboxId])

  return (
    <SelectPrimitive.Portal>
      <SelectInternalContext.Provider value={enhancedContextValue}>
        <SelectPrimitive.Content
          ref={ref}
          className={cn(
            // Base layout
            "relative overflow-hidden rounded-md border shadow-md",
            isInDialog ? 'z-[1050]' : 'z-50',
            "max-h-96 min-w-[8rem]",
            // Background - clean glass effect
            "bg-popover/95 backdrop-blur-sm border-border",
            "text-popover-foreground",
            // Simple animations
            "animate-in fade-in-0 zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
            className
          )}
          position={position}
          {...props}>

          <SelectScrollUpButton />

          <SelectPrimitive.Viewport
            ref={viewportRef}
            className={cn(
              "relative p-1",
              position === "popper" &&
                "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
            )}
            id={listboxId}
            role="listbox"
            aria-label="Available options">

            {loading ? (
              <div className="flex flex-col items-center justify-center size-padding-lg text-center glass-minimal bg-brand-celeste/5" role="status" aria-live="polite">
                <UpdateIcon className="size-icon-lg text-brand-dark-blue mb-3 animate-spin" aria-hidden="true" style={{
                  filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))'
                }} />
                <p className="size-text-lg font-semibold text-brand-dark-blue mb-1 tracking-wide">
                  Loading options...
                </p>
                <p className="size-text-sm text-brand-dark-blue/70">
                  Please wait while we fetch the data
                </p>
              </div>
            ) : showNoResults ? (
              <div className="flex flex-col items-center justify-center size-padding-lg text-center glass-minimal bg-brand-celeste/5" role="status" aria-live="polite">
                <MagnifyingGlassIcon className="size-icon-lg text-brand-celeste mb-3 animate-pulse-once" aria-hidden="true" style={{
                  filter: 'drop-shadow(0 0 6px rgba(14, 165, 233, 0.3))'
                }} />
                <p className="size-text-lg font-semibold text-brand-celeste mb-1 tracking-wide">
                  No results found
                </p>
                <p className="size-text-sm text-brand-celeste/70">
                  Try a different search term
                </p>
              </div>
            ) : (
              filteredChildren
            )}

          </SelectPrimitive.Viewport>

          <SelectScrollDownButton />
        </SelectPrimitive.Content>
      </SelectInternalContext.Provider>
    </SelectPrimitive.Portal>
  )
})
SelectContent.displayName = SelectPrimitive.Content.displayName

/**
 * SelectLabel - Enhanced select label component with Size System integration and brand color theming
 *
 * Features:
 * - Size System integration with consistent typography and spacing
 * - Brand color theming with subtle glass effects
 * - Enhanced visual hierarchy with gradient backgrounds
 * - Performance optimized with memoization
 * - Full accessibility compliance
 *
 * @param {string} size - Size variant: 'sm', 'md', 'lg' (inherits from SizeProvider if not specified)
 * @param {string} className - Additional CSS classes
 * @param {React.Ref} ref - Forward ref for DOM access
 * @param {...object} props - All other props passed to underlying Label component
 *
 * @example
 * ```jsx
 * <SelectLabel size="md">Choose an option</SelectLabel>
 * <SelectLabel className="text-brand-dark-blue">Custom styled label</SelectLabel>
 * ```
 */
const SelectLabel = React.forwardRef(({ className, size, ...props }, ref) => {
  const contextSize = useSizeContext()
  const effectiveSize = size || contextSize || 'md'

  // Memoized classes for performance optimization
  const labelClasses = React.useMemo(() => {
    // Size System classes for consistent scaling using sizeVariants
    const variant = sizeVariants[effectiveSize] || sizeVariants.md
    const sizeClasses = {
      sm: `${variant.typography.small} ${variant.spacing.item}`,
      md: `${variant.typography.text} ${variant.spacing.item}`,
      lg: `${variant.typography.text} ${variant.spacing.item}`
    }

    return cn(
      // Enhanced typography with brand color integration
      "font-semibold tracking-wide text-brand-dark-blue",

      // Subtle visual enhancements
      "border-l-2 border-brand-celeste/20 rounded-r-md",
      "bg-gradient-to-r from-brand-celeste/5 to-transparent",

      // Size System integration using sizeVariants
      sizeClasses[effectiveSize],

      // Smooth transitions
      FORM_ANIMATION_CLASSES.base,

      // Performance optimizations
      optimizeFormGlassPerformance(),

      className
    )
  }, [effectiveSize, className])

  return (
    <SelectPrimitive.Label
      ref={ref}
      className={labelClasses}
      {...props}
    />
  )
})
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef(({ className, children, size, disabled, value, ...props }, ref) => {
  const contextSize = useSizeContext()
  const effectiveSize = size || contextSize || 'md'
  const { contentGlass: parentGlass } = React.useContext(SelectInternalContext) || {}
  const {
    isSearchable,
    setSelectedLabel,
    setSearchValue,
    selectedValue,
    setActiveDescendant,
    highlightedIndex,
    availableItems,
    setHighlightedIndex
  } = React.useContext(SelectInternalContext) || {}
  const [isHovered, setIsHovered] = React.useState(false)
  const isMountedRef = React.useRef(false)

  // Generate unique ID for this item with random suffix to avoid collisions
  const uid = React.useMemo(() => Math.random().toString(36).slice(2, 7), [])
  const itemId = React.useMemo(() => {
    const sanitized = String(value).replace(/[^a-zA-Z0-9]/g, '-')
    return `select-option-${sanitized}-${uid}`
  }, [value, uid])

  // Check if this item is currently highlighted
  const isHighlighted = React.useMemo(() => {
    if (highlightedIndex === -1 || !availableItems) return false
    const currentItem = availableItems[highlightedIndex]
    return currentItem && String(currentItem.value) === String(value)
  }, [highlightedIndex, availableItems, value])

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

  // Size System classes for consistent scaling
  const sizeClasses = {
    sm: "size-input-height-sm size-padding-sm size-text-sm",
    md: "size-input-height-md size-padding-md size-text-sm",
    lg: "size-input-height-lg size-padding-lg size-text-base"
  }

  const iconSizeClasses = {
    sm: "size-icon-sm right-4",
    md: "size-icon-md right-5",
    lg: "size-icon-lg right-6"
  }

  const checkIconSizeClasses = {
    sm: "size-icon-sm",
    md: "size-icon-md",
    lg: "size-icon-lg"
  }

  // Size-aware glass effects for SelectItem
  const itemGlass = React.useMemo(() =>
    getFormGlassForSize(parentGlass || false, effectiveSize),
    [parentGlass, effectiveSize]
  )

  const itemBlur = React.useMemo(() =>
    getResponsiveFormBlur(effectiveSize),
    [effectiveSize]
  )


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
        // Update highlighted index when hovering
        if (availableItems && setHighlightedIndex) {
          const itemIndex = availableItems.findIndex(item => String(item.value) === String(value))
          if (itemIndex >= 0) {
            setHighlightedIndex(itemIndex)
          }
        }
        if (setActiveDescendant) {
          setActiveDescendant(itemId)
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false)
      }}
      value={value}
      onSelect={handleSelect}
      id={itemId}
      role="option"
      aria-selected={String(selectedValue) === String(value)}
      className={cn(
        // Base layout - clean and simple
        "relative flex w-full cursor-pointer select-none items-center",
        "rounded-md px-2 py-1.5 text-sm outline-none",
        "transition-colors duration-100",
        // Disabled state
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        // Default state
        "text-foreground",
        // Hover state - simple background change, no scale
        "hover:bg-accent hover:text-accent-foreground",
        // Focus state
        "focus:bg-accent focus:text-accent-foreground",
        // Keyboard navigation
        isHighlighted && "bg-accent text-accent-foreground",
        // Selected state - subtle indicator
        "data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary data-[state=checked]:font-medium",
        className
      )}
      data-highlighted={isHighlighted ? "true" : undefined}
      {...props}>

      {/* Content text */}
      <SelectPrimitive.ItemText className="flex-1 truncate">
        {children}
      </SelectPrimitive.ItemText>

      {/* Check icon - inline, not absolute */}
      <SelectPrimitive.ItemIndicator className="ml-auto pl-2">
        <CheckIcon className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
})
SelectItem.displayName = SelectPrimitive.Item.displayName

/**
 * SelectSeparator - Enhanced separator with 6-tier glassmorphism effects and brand color integration
 *
 * Features:
 * - 6-tier glassmorphism system integration
 * - Brand color gradients with Celeste accents
 * - Size-aware spacing and visual weight
 * - Optional glass overlay effects
 * - Performance optimized rendering
 * - Smooth animations and transitions
 *
 * @param {string|boolean} glass - Glass effect intensity: false, 'minimal', 'subtle', 'medium', 'strong'
 * @param {string} size - Size variant for responsive spacing
 * @param {string} className - Additional CSS classes
 * @param {React.Ref} ref - Forward ref for DOM access
 * @param {...object} props - All other props passed to underlying Separator component
 *
 * @example
 * ```jsx
 * <SelectSeparator /> // Standard separator
 * <SelectSeparator glass="subtle" /> // With glass effects
 * <SelectSeparator size="lg" className="my-4" /> // Large with custom spacing
 * ```
 */
const SelectSeparator = React.forwardRef(({ className, glass = false, size, ...props }, ref) => {
  const contextSize = useSizeContext()
  const effectiveSize = size || contextSize || 'md'

  // Memoized glass effects for performance
  const glassEffect = React.useMemo(() => {
    if (!glass) return null
    const intensity = typeof glass === 'string' ? glass : 'minimal'
    return getFormGlassForSize(intensity, effectiveSize)
  }, [glass, effectiveSize])

  // Size-aware spacing classes using sizeVariants
  const spacingClasses = React.useMemo(() => {
    const spacing = {
      sm: `mx-1 my-1`,
      md: `mx-2 my-2`,
      lg: `mx-3 my-3`
    }
    return spacing[effectiveSize]
  }, [effectiveSize])

  // Enhanced separator classes with brand colors and glass effects
  const separatorClasses = React.useMemo(() => {
    return cn(
      // Base styling with brand color gradients
      "h-px bg-gradient-to-r from-transparent via-brand-celeste/30 to-transparent",
      "relative overflow-hidden",

      // Size-aware spacing
      spacingClasses,

      // Glass effects integration
      glass && glassEffect && cn(
        glassEffect,
        "backdrop-blur-sm",
        "shadow-glow-brand-celeste/10"
      ),

      // Enhanced shadow and depth
      "shadow-sm drop-shadow-sm",

      // Smooth transitions
      FORM_ANIMATION_CLASSES.base,

      // Performance optimizations
      optimizeFormGlassPerformance(),

      className
    )
  }, [spacingClasses, glass, glassEffect, className])

  return (
    <SelectPrimitive.Separator
      ref={ref}
      className={separatorClasses}
      {...props}
    >
      {/* Optional glass overlay effect */}
      {glass && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-brand-celeste/10 via-brand-celeste/20 to-brand-celeste/10",
            "animate-pulse-once opacity-50"
          )}
          aria-hidden="true"
        />
      )}
    </SelectPrimitive.Separator>
  )
})
SelectSeparator.displayName = SelectPrimitive.Separator.displayName


/**
 * @fileoverview Enhanced Select Component System with Design Guidelines Integration
 *
 * A comprehensive select component system built on Radix UI primitives with extensive
 * enhancements following the Design Guidelines. Features 6-tier glassmorphism effects,
 * Size System integration, brand color theming, advanced search capabilities, and
 * comprehensive accessibility support.
 *
 * ## Key Features:
 *
 * ### Design System Integration
 * - **Size System**: Consistent sizing with 'sm', 'md', 'lg' variants
 * - **6-Tier Glassmorphism**: 'minimal', 'subtle', 'medium', 'strong' glass effects
 * - **Brand Colors**: Celeste, Dark Blue, and Sun color integration
 * - **Typography**: Enhanced font weights, tracking, and spacing
 *
 * ### Advanced Functionality
 * - **Searchable Selects**: Built-in search with debouncing and highlighting
 * - **Glass Effects**: Sophisticated backdrop blur and transparency effects
 * - **Real-time Filtering**: Dynamic option filtering with search highlighting
 * - **Keyboard Navigation**: Full keyboard accessibility with ARIA support
 *
 * ### Performance Optimizations
 * - **Memoized Calculations**: Expensive computations cached with React.useMemo
 * - **Optimized Re-renders**: Strategic use of React.useCallback for event handlers
 * - **Glass Performance**: Specialized optimizations for backdrop-filter operations
 * - **Lazy Evaluation**: Size and glass effects computed on-demand
 *
 * ### Accessibility Compliance
 * - **WCAG 2.1 AA**: Full compliance with accessibility standards
 * - **Screen Reader Support**: Comprehensive ARIA labels and descriptions
 * - **Keyboard Navigation**: Complete keyboard interaction support
 * - **Focus Management**: Proper focus rings and visual indicators
 *
 * ## Usage Examples:
 *
 * ### Basic Select
 * ```jsx
 * <Select>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Choose option..." />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="item1">Item 1</SelectItem>
 *     <SelectItem value="item2">Item 2</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 *
 * ### Searchable Select with Glass Effects
 * ```jsx
 * <Select searchable onSearch={handleSearch}>
 *   <SelectTrigger glass="medium" size="lg">
 *     <SelectValue placeholder="Search options..." />
 *   </SelectTrigger>
 *   <SelectContent glass="subtle">
 *     <SelectGroup>
 *       <SelectLabel>Group 1</SelectLabel>
 *       <SelectItem value="item1">Item 1</SelectItem>
 *       <SelectSeparator glass="minimal" />
 *       <SelectItem value="item2">Item 2</SelectItem>
 *     </SelectGroup>
 *   </SelectContent>
 * </Select>
 * ```
 *
 * ### Size System Integration
 * ```jsx
 * <SizeProvider size="lg">
 *   <Select>
 *     <SelectTrigger glass="strong">
 *       <SelectValue placeholder="Large select..." />
 *     </SelectTrigger>
 *     <SelectContent>
 *       <SelectLabel>Large Labels</SelectLabel>
 *       <SelectItem value="item">Large Item</SelectItem>
 *     </SelectContent>
 *   </Select>
 * </SizeProvider>
 * ```
 *
 * ### Loading State (Async Data Fetching)
 * ```jsx
 * const [options, setOptions] = useState([]);
 * const [isLoading, setIsLoading] = useState(false);
 *
 * const handleSearch = async (query) => {
 *   setIsLoading(true);
 *   const results = await fetchOptions(query);
 *   setOptions(results);
 *   setIsLoading(false);
 * };
 *
 * <Select searchable onSearch={handleSearch} isLoading={isLoading}>
 *   <SelectTrigger>
 *     <SelectValue placeholder="Search..." />
 *   </SelectTrigger>
 *   <SelectContent loading={isLoading}>
 *     {options.map(opt => (
 *       <SelectItem key={opt.value} value={opt.value}>
 *         {opt.label}
 *       </SelectItem>
 *     ))}
 *   </SelectContent>
 * </Select>
 * ```
 *
 * ## Props Reference:
 *
 * ### Select Component Props
 * @param {boolean} [searchable=false] - Enable search/filter functionality
 * @param {function} [onSearch] - Callback when search value changes (debounced)
 * @param {boolean} [isLoading=false] - Show loading state with spinner, disable interaction
 * @param {string} [value] - Controlled value
 * @param {function} [onValueChange] - Callback when value changes
 * @param {boolean} [open] - Controlled open state
 * @param {function} [onOpenChange] - Callback when open state changes
 *
 * ## Performance Notes:
 *
 * - Glass effects are optimized with `optimizeFormGlassPerformance()`
 * - Size calculations are memoized to prevent unnecessary recalculations
 * - Event handlers use `React.useCallback` to prevent child re-renders
 * - Search highlighting uses efficient string matching algorithms
 *
 * ## Accessibility Features:
 *
 * - Full ARIA labeling with role="combobox" for searchable selects
 * - Proper focus management with visible focus rings
 * - Screen reader announcements for state changes
 * - Keyboard shortcuts for all interactions
 * - High contrast mode support
 *
 * @version 2.0.0
 * @author Infinibay Design System Team
 */

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
