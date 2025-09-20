/**
 * Form Animation Utilities
 * Modern animation system for form components with floating labels and micro-interactions
 */

import * as React from "react"

/**
 * CSS Variables for consistent animations
 */
export const FORM_ANIMATION_VARS = {
  // Timing functions
  '--form-ease-smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  '--form-ease-bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  '--form-ease-sharp': 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Durations
  '--form-duration-fast': '150ms',
  '--form-duration-normal': '200ms',
  '--form-duration-slow': '300ms',

  // Transform values
  '--form-label-translate': 'translateY(-50%)',
  '--form-label-scale': 'scale(0.85)',
  '--form-ring-scale': 'scale(1.02)',
  '--form-shake-distance': '4px',
}

/**
 * Animation classes for different input states
 */
export const FORM_ANIMATION_CLASSES = {
  // Base transition class
  base: 'transition-all duration-200 ease-smooth',

  // Label animations
  labelFloat: 'transform transition-all duration-200 ease-smooth origin-left',
  labelFloated: 'transform -translate-y-6 scale-85 text-primary font-semibold',
  labelDefault: 'transform translate-y-0 scale-100 text-muted-foreground',

  // Input container animations
  containerFocus: 'ring-2 ring-primary/20 border-primary/60 shadow-lg',
  containerHover: 'border-border/80 shadow-md',
  containerError: 'ring-2 ring-destructive/20 border-destructive animate-shake',
  containerSuccess: 'ring-2 ring-green-500/20 border-green-500/60 animate-pulse-once',

  // Micro-interactions
  typingFeedback: 'animate-pulse-border',
  focusGlow: 'shadow-glow-primary',
  errorShake: 'animate-shake',
  successPulse: 'animate-pulse-once',
}

/**
 * Get floating label classes based on state
 */
export const getFloatingLabelClasses = (isFloated, hasError, hasSuccess) => {
  const baseClasses = FORM_ANIMATION_CLASSES.labelFloat

  if (hasError) {
    return `${baseClasses} ${isFloated ? FORM_ANIMATION_CLASSES.labelFloated : FORM_ANIMATION_CLASSES.labelDefault} text-destructive`
  }

  if (hasSuccess) {
    return `${baseClasses} ${isFloated ? FORM_ANIMATION_CLASSES.labelFloated : FORM_ANIMATION_CLASSES.labelDefault} text-green-600`
  }

  return `${baseClasses} ${isFloated ? FORM_ANIMATION_CLASSES.labelFloated : FORM_ANIMATION_CLASSES.labelDefault}`
}

/**
 * Get input container classes based on state
 */
export const getInputContainerClasses = (isFocused, hasError, hasSuccess, isHovered) => {
  let classes = FORM_ANIMATION_CLASSES.base

  if (hasError) {
    classes += ` ${FORM_ANIMATION_CLASSES.containerError}`
  } else if (hasSuccess) {
    classes += ` ${FORM_ANIMATION_CLASSES.containerSuccess}`
  } else if (isFocused) {
    classes += ` ${FORM_ANIMATION_CLASSES.containerFocus} ${FORM_ANIMATION_CLASSES.focusGlow}`
  } else if (isHovered) {
    classes += ` ${FORM_ANIMATION_CLASSES.containerHover}`
  }

  return classes
}

/**
 * Custom CSS keyframes for animations
 */
export const FORM_KEYFRAMES = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-${FORM_ANIMATION_VARS['--form-shake-distance']}); }
    20%, 40%, 60%, 80% { transform: translateX(${FORM_ANIMATION_VARS['--form-shake-distance']}); }
  }

  @keyframes pulse-once {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }

  @keyframes pulse-border {
    0%, 100% { border-color: var(--border); }
    50% { border-color: var(--primary); }
  }

  @keyframes glow-primary {
    0%, 100% { box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0); }
    50% { box-shadow: 0 0 20px 5px rgba(var(--primary-rgb), 0.1); }
  }
`

/**
 * Utility classes to add to Tailwind config
 */
export const TAILWIND_ANIMATION_UTILITIES = {
  '.animate-shake': {
    animation: 'shake 0.5s ease-in-out',
  },
  '.animate-pulse-once': {
    animation: 'pulse-once 0.6s ease-out',
  },
  '.animate-pulse-border': {
    animation: 'pulse-border 1s ease-in-out infinite',
  },
  '.shadow-glow-primary': {
    animation: 'glow-primary 2s ease-in-out infinite',
  },
  '.ease-smooth': {
    'transition-timing-function': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
  '.ease-bounce': {
    'transition-timing-function': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  '.scale-85': {
    transform: 'scale(0.85)',
  },
  '.-translate-y-6': {
    transform: 'translateY(-1.5rem)',
  },
}

/**
 * React hook for managing floating label state
 */
export const useFloatingLabel = (value, isFocused) => {
  const isFloated = Boolean(value) || isFocused
  return { isFloated }
}

/**
 * React hook for managing input interaction states
 */
export const useInputStates = () => {
  const [isFocused, setIsFocused] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)
  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  return {
    isFocused,
    isHovered,
    handlers: {
      onFocus: handleFocus,
      onBlur: handleBlur,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    }
  }
}