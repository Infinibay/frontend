import * as React from "react"

// Available sizes and their labels
const AVAILABLE_SIZES = ['sm', 'md', 'lg', 'xl'];
const SIZE_LABELS = {
  sm: 'Compact',
  md: 'Standard',
  lg: 'Comfortable',
  xl: 'Spacious'
};

const SizeContext = React.createContext(null)

export function useSizeContext() {
  const context = React.useContext(SizeContext)
  if (!context) {
    throw new Error("useSizeContext must be used within a SizeProvider")
  }
  return context
}

export function useOptionalSizeContext() {
  const context = React.useContext(SizeContext)
  return context
}

/**
 * Validates if the provided size is a valid size option
 * @param {string} size - The size to validate
 * @returns {boolean} - Whether the size is valid
 */
export function isValidSize(size) {
  return AVAILABLE_SIZES.includes(size);
}

/**
 * Gets the human-readable label for a size
 * @param {string} size - The size to get label for
 * @returns {string} - The human-readable label
 */
export function getSizeLabel(size) {
  return SIZE_LABELS[size] || SIZE_LABELS.md;
}

/**
 * Gets the next size in the cycle (for size cycling functionality)
 * @param {string} currentSize - The current size
 * @returns {string} - The next size
 */
export function getNextSize(currentSize) {
  const currentIndex = AVAILABLE_SIZES.indexOf(currentSize);
  const nextIndex = (currentIndex + 1) % AVAILABLE_SIZES.length;
  return AVAILABLE_SIZES[nextIndex];
}

/**
 * Gets the previous size in the cycle (for size cycling functionality)
 * @param {string} currentSize - The current size
 * @returns {string} - The previous size
 */
export function getPrevSize(currentSize) {
  const currentIndex = AVAILABLE_SIZES.indexOf(currentSize);
  const prevIndex = currentIndex === 0 ? AVAILABLE_SIZES.length - 1 : currentIndex - 1;
  return AVAILABLE_SIZES[prevIndex];
}

export function SizeProvider({
  size,
  defaultSize = "md",
  children
}) {
  // Use state to handle dynamic size changes
  const [currentSize, setCurrentSize] = React.useState(() => {
    // Prioritize the size prop, then defaultSize, ensuring it's valid
    const initialSize = size || defaultSize;
    return isValidSize(initialSize) ? initialSize : 'md';
  });

  // Update internal state when size prop changes
  React.useEffect(() => {
    if (size && isValidSize(size) && size !== currentSize) {
      setCurrentSize(size);
    }
  }, [size, currentSize]);

  // Enhanced context value with all helper functions
  const value = React.useMemo(() => ({
    size: currentSize,
    setSize: setCurrentSize,
    availableSizes: AVAILABLE_SIZES,
    sizeLabels: SIZE_LABELS,
    getSizeLabel: (sizeToCheck) => getSizeLabel(sizeToCheck || currentSize),
    getNextSize: () => getNextSize(currentSize),
    getPrevSize: () => getPrevSize(currentSize),
    isValidSize
  }), [currentSize]);

  return (
    <SizeContext.Provider value={value}>
      {children}
    </SizeContext.Provider>
  )
}

// Common size classes that can be shared across components
export const sizeVariants = {
  sm: {
    text: "text-sm",
    heading: "text-lg font-semibold",
    padding: "px-3 py-2",
    height: "h-8",
    width: "w-8",
    gap: "gap-2",
    spacing: {
      container: "p-3",
      item: "px-4 py-2",
      subItem: "pl-10 pr-4 py-2",
    },
    navbar: {
      width: "16rem",
      mobileWidth: "18rem",
      padding: "px-4",
      fixedWidth: "16rem",
    },
    animation: {
      duration: "250ms",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
    icon: {
      size: "w-4 h-4",
      button: "w-8 h-8",
      nav: "w-5 h-5",
    },
    radius: "rounded-md",
    avatar: "w-8 h-8",
    logo: "h-6",
    input: {
      height: "h-8",
      padding: "px-3 py-1.5",
      text: "text-sm",
    },
    badge: {
      size: "w-5 h-5",
      text: "text-xs",
      padding: "px-1.5",
    },
    card: {
      padding: "p-3",
      title: "text-lg",
      description: "text-xs",
      content: "p-3 pt-0",
      footer: "p-3 pt-0",
    },
    popover: {
      width: "w-56",
    }
  },
  md: {
    text: "text-base",
    heading: "text-xl font-semibold",
    padding: "px-4 py-2",
    height: "h-10",
    width: "w-10",
    gap: "gap-3",
    spacing: {
      container: "p-4",
      item: "px-5 py-3",
      subItem: "pl-12 pr-5 py-3",
    },
    navbar: {
      width: "18rem",
      mobileWidth: "20rem",
      padding: "px-5",
      fixedWidth: "18rem",
    },
    animation: {
      duration: "300ms",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
    icon: {
      size: "w-5 h-5",
      button: "w-10 h-10",
      nav: "w-6 h-6",
    },
    radius: "rounded-md",
    avatar: "w-10 h-10",
    logo: "h-8",
    input: {
      height: "h-10",
      padding: "px-4 py-2",
      text: "text-base",
    },
    badge: {
      size: "w-6 h-6",
      text: "text-sm",
      padding: "px-2",
    },
    card: {
      padding: "p-4",
      title: "text-xl",
      description: "text-sm",
      content: "p-4 pt-0",
      footer: "p-4 pt-0",
    },
    popover: {
      width: "w-64",
    }
  },
  lg: {
    text: "text-lg",
    heading: "text-2xl font-semibold",
    padding: "px-6 py-3",
    height: "h-12",
    width: "w-12",
    gap: "gap-4",
    spacing: {
      container: "p-6",
      item: "px-6 py-4",
      subItem: "pl-14 pr-6 py-4",
    },
    navbar: {
      width: "20rem",
      mobileWidth: "22rem",
      padding: "px-6",
      fixedWidth: "20rem",
    },
    animation: {
      duration: "350ms",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
    icon: {
      size: "w-6 h-6",
      button: "w-12 h-12",
      nav: "w-7 h-7",
    },
    radius: "rounded-lg",
    avatar: "w-12 h-12",
    logo: "h-10",
    input: {
      height: "h-12",
      padding: "px-6 py-3",
      text: "text-lg",
    },
    badge: {
      size: "w-7 h-7",
      text: "text-base",
      padding: "px-2.5",
    },
    card: {
      padding: "p-6",
      title: "text-2xl",
      description: "text-base",
      content: "p-6 pt-0",
      footer: "p-6 pt-0",
    },
    popover: {
      width: "w-72",
    }
  },
  xl: {
    text: "text-xl",
    heading: "text-3xl font-semibold",
    padding: "px-8 py-4",
    height: "h-14",
    width: "w-14",
    gap: "gap-6",
    spacing: {
      container: "p-8",
      item: "px-8 py-6",
      subItem: "pl-16 pr-8 py-5",
    },
    navbar: {
      width: "24rem",
      mobileWidth: "26rem",
      padding: "px-8",
      fixedWidth: "24rem",
    },
    animation: {
      duration: "400ms",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
    icon: {
      size: "w-7 h-7",
      button: "w-14 h-14",
      nav: "w-8 h-8",
    },
    radius: "rounded-xl",
    avatar: "w-14 h-14",
    logo: "h-12",
    input: {
      height: "h-14",
      padding: "px-8 py-4",
      text: "text-xl",
    },
    badge: {
      size: "w-8 h-8",
      text: "text-lg",
      padding: "px-3",
    },
    card: {
      padding: "p-8",
      title: "text-3xl",
      description: "text-lg",
      content: "p-8 pt-0",
      footer: "p-8 pt-0",
    },
    popover: {
      width: "w-80",
    }
  },
}

// Helper functions for animation support
export function getSizeAnimationProps(size) {
  const variant = sizeVariants[size] || sizeVariants.md;
  return {
    duration: variant.animation.duration,
    easing: variant.animation.easing,
    fixedWidth: variant.navbar.fixedWidth,
  };
}

export function toCSSCustomProperties(size) {
  const variant = sizeVariants[size] || sizeVariants.md;
  return {
    '--sidebar-width-fixed': variant.navbar.fixedWidth,
    '--sidebar-animation-duration': variant.animation.duration,
    '--sidebar-animation-easing': variant.animation.easing,
  };
}

export function toMotionDivProps(size) {
  const variant = sizeVariants[size] || sizeVariants.md;
  return {
    style: { width: variant.navbar.fixedWidth },
    transition: {
      duration: parseFloat(variant.animation.duration) / 1000, // Convert to seconds
      ease: variant.animation.easing,
    },
  };
}
