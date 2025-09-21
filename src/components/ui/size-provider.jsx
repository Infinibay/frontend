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

/**
 * SizeProvider component that provides global size context and applies CSS variables/classes.
 *
 * IMPORTANT: Only mount ONE SizeProvider globally at a time, as it mutates the document root
 * element's classList and CSS custom properties. Multiple providers will conflict and cause
 * unpredictable behavior.
 *
 * @param {Object} props - Component props
 * @param {string} props.size - Controlled size value
 * @param {string} props.defaultSize - Default size when uncontrolled
 * @param {ReactNode} props.children - Child components
 */
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

  // Apply CSS custom properties and CSS classes when size changes
  React.useEffect(() => {
    try {
      // Apply CSS variables
      const customProperties = generateSizeCustomProperties(currentSize);
      Object.entries(customProperties).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });

      // Apply CSS classes
      applySizeClasses(currentSize);
    } catch (error) {
      console.warn('Failed to apply size properties:', error);
    }

    // Cleanup function to remove size classes on unmount
    return () => {
      try {
        removeSizeClasses();
      } catch (error) {
        console.warn('Failed to cleanup size classes:', error);
      }
    };
  }, [currentSize]);

  // Safe setter that validates input sizes to prevent context desync
  const safeSetSize = React.useCallback((s) => {
    setCurrentSize(isValidSize(s) ? s : 'md');
  }, []);

  // Alias the exported helper to avoid name shadowing
  const getSizeLabelFn = getSizeLabel;

  // Enhanced context value with all helper functions and CSS class utilities
  const value = React.useMemo(() => ({
    size: currentSize,
    setSize: safeSetSize,
    availableSizes: AVAILABLE_SIZES,
    sizeLabels: SIZE_LABELS,
    getSizeLabel: (s) => getSizeLabelFn(s || currentSize),
    getNextSize: () => getNextSize(currentSize),
    getPrevSize: () => getPrevSize(currentSize),
    isValidSize,
    // CSS class utilities
    currentSizeClass: getSizeClassName(currentSize),
    applySizeClass: applySizeClasses,
    getSizeClassName,
    getAllSizeClassNames,
    isSizeClassApplied,
    getCurrentSizeClass
  }), [currentSize, safeSetSize]);

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
    typography: {
      mainheading: "text-2xl sm:text-3xl lg:text-4xl font-bold",
      subheading: "text-lg sm:text-xl lg:text-2xl font-bold",
      heading2: "text-base sm:text-lg lg:text-xl font-bold",
      text: "text-sm",
      small: "text-xs",
      xsmall: "text-xs",
    },
    layout: {
      section: "space-y-3",
      container: "p-3",
      cardGrid: "gap-3",
      sectionSpacing: "mb-4",
      maxWidth: "max-w-6xl",
    },
    grid: {
      departments: "grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      computers: "gap-3",
      settings: "gap-3",
      themeOptions: "grid grid-cols-1 md:grid-cols-3 gap-3",
      sizeOptions: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3",
      columns: "2",
    },
    spacing: {
      container: "p-3",
      item: "px-4 py-2",
      subItem: "pl-10 pr-4 py-2",
      marginXs: "mr-1",
      marginSm: "mr-2",
      spaceX: "space-x-2",
      paddingIconLeft: "pl-8",
      marginStartXs: "ml-1",
      marginTopXs: "mt-1",
      iconContainerPaddingStart: "pl-2",
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
      hero: "w-12 h-12",
    },
    radius: "rounded-md",
    avatar: "w-8 h-8",
    logo: "h-6",
    thumbnail: "w-8 h-8",
    input: {
      height: "h-8",
      padding: "px-3 py-1.5",
      text: "text-sm",
      withIconLeftPadding: "pl-8",
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
    typography: {
      mainheading: "text-3xl sm:text-4xl lg:text-5xl font-bold",
      subheading: "text-xl sm:text-2xl lg:text-3xl font-bold",
      heading2: "text-lg sm:text-xl lg:text-2xl font-bold",
      text: "text-base",
      small: "text-sm",
      xsmall: "text-xs",
    },
    layout: {
      section: "space-y-4",
      container: "p-4",
      cardGrid: "gap-4",
      sectionSpacing: "mb-6",
      maxWidth: "max-w-7xl",
    },
    grid: {
      departments: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
      computers: "gap-4",
      settings: "gap-4",
      themeOptions: "grid grid-cols-1 md:grid-cols-3 gap-4",
      sizeOptions: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
      columns: "3",
    },
    spacing: {
      container: "p-4",
      item: "px-5 py-3",
      subItem: "pl-12 pr-5 py-3",
      marginXs: "mr-2",
      marginSm: "mr-3",
      spaceX: "space-x-3",
      paddingIconLeft: "pl-10",
      marginStartXs: "ml-2",
      marginTopXs: "mt-2",
      iconContainerPaddingStart: "pl-3",
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
      hero: "w-16 h-16",
    },
    radius: "rounded-md",
    avatar: "w-10 h-10",
    logo: "h-8",
    thumbnail: "w-10 h-10",
    input: {
      height: "h-10",
      padding: "px-4 py-2",
      text: "text-base",
      withIconLeftPadding: "pl-10",
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
    typography: {
      mainheading: "text-4xl sm:text-5xl lg:text-6xl font-bold",
      subheading: "text-2xl sm:text-3xl lg:text-4xl font-bold",
      heading2: "text-xl sm:text-2xl lg:text-3xl font-bold",
      text: "text-lg",
      small: "text-base",
      xsmall: "text-sm",
    },
    layout: {
      section: "space-y-6",
      container: "p-6",
      cardGrid: "gap-6",
      sectionSpacing: "mb-8",
      maxWidth: "max-w-7xl",
    },
    grid: {
      departments: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6",
      computers: "gap-6",
      settings: "gap-6",
      themeOptions: "grid grid-cols-1 md:grid-cols-3 gap-6",
      sizeOptions: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
      columns: "4",
    },
    spacing: {
      container: "p-6",
      item: "px-6 py-4",
      subItem: "pl-14 pr-6 py-4",
      marginXs: "mr-2",
      marginSm: "mr-3",
      spaceX: "space-x-4",
      paddingIconLeft: "pl-12",
      marginStartXs: "ml-2",
      marginTopXs: "mt-2",
      iconContainerPaddingStart: "pl-4",
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
      hero: "w-20 h-20",
    },
    radius: "rounded-lg",
    avatar: "w-12 h-12",
    logo: "h-10",
    thumbnail: "w-12 h-12",
    input: {
      height: "h-12",
      padding: "px-6 py-3",
      text: "text-lg",
      withIconLeftPadding: "pl-12",
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
    typography: {
      mainheading: "text-5xl sm:text-6xl lg:text-7xl font-bold",
      subheading: "text-3xl sm:text-4xl lg:text-5xl font-bold",
      heading2: "text-2xl sm:text-3xl lg:text-4xl font-bold",
      text: "text-xl",
      small: "text-lg",
      xsmall: "text-base",
    },
    layout: {
      section: "space-y-8",
      container: "p-8",
      cardGrid: "gap-8",
      sectionSpacing: "mb-10",
      maxWidth: "max-w-8xl",
    },
    grid: {
      departments: "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7",
      computers: "gap-8",
      settings: "gap-8",
      themeOptions: "grid grid-cols-1 md:grid-cols-3 gap-8",
      sizeOptions: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
      columns: "5",
    },
    spacing: {
      container: "p-8",
      item: "px-8 py-6",
      subItem: "pl-16 pr-8 py-5",
      marginXs: "mr-3",
      marginSm: "mr-4",
      spaceX: "space-x-6",
      paddingIconLeft: "pl-14",
      marginStartXs: "ml-3",
      marginTopXs: "mt-3",
      iconContainerPaddingStart: "pl-5",
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
      hero: "w-24 h-24",
    },
    radius: "rounded-xl",
    avatar: "w-14 h-14",
    logo: "h-12",
    thumbnail: "w-14 h-14",
    input: {
      height: "h-14",
      padding: "px-8 py-4",
      text: "text-xl",
      withIconLeftPadding: "pl-14",
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

// Helper functions for page-level layout utilities
export function getTypographyClass(type, size) {
  const variant = sizeVariants[size] || sizeVariants.md;
  return variant.typography[type] || variant.typography.text;
}

export function getLayoutSpacing(type, size) {
  const variant = sizeVariants[size] || sizeVariants.md;
  return variant.layout[type] || variant.layout.container;
}

export function getGridClasses(page, size) {
  const variant = sizeVariants[size] || sizeVariants.md;
  return variant.grid[page] || variant.grid.departments;
}

export function getGridSpacing(size) {
  const variant = sizeVariants[size] || sizeVariants.md;
  return variant.grid.computers;
}

/**
 * Gets the CSS class name for a given size
 * @param {string} size - The size to get class name for
 * @returns {string} - The CSS class name (e.g., 'size-md')
 */
export function getSizeClassName(size) {
  if (!isValidSize(size)) {
    console.warn(`Invalid size '${size}', falling back to 'md'`);
    return 'size-md';
  }
  return `size-${size}`;
}

/**
 * Gets all possible size class names
 * @returns {string[]} - Array of all size class names
 */
export function getAllSizeClassNames() {
  return AVAILABLE_SIZES.map(size => getSizeClassName(size));
}

/**
 * Applies the appropriate size class to the document root element
 * @param {string} size - The size to apply
 */
export function applySizeClasses(size) {
  if (typeof document === 'undefined') {
    console.warn('Document not available, skipping size class application');
    return;
  }

  try {
    // Development-time warning for multiple SizeProviders
    if (process.env.NODE_ENV !== 'production') {
      const existing = getCurrentSizeClass();
      const next = getSizeClassName(size);
      if (existing && existing !== next) {
        console.warn(`[SizeProvider] Overwriting existing ${existing} with ${next}. Ensure only one provider is mounted.`);
      }
    }

    const html = document.documentElement;

    // Remove all existing size classes
    removeSizeClasses();

    // Add the new size class
    const sizeClass = getSizeClassName(size);
    html.classList.add(sizeClass);
  } catch (error) {
    console.error('Failed to apply size classes:', error);
  }
}

/**
 * Removes all size classes from the document root element
 */
export function removeSizeClasses() {
  if (typeof document === 'undefined') {
    return;
  }

  try {
    const html = document.documentElement;
    const allSizeClasses = getAllSizeClassNames();

    allSizeClasses.forEach(className => {
      html.classList.remove(className);
    });
  } catch (error) {
    console.error('Failed to remove size classes:', error);
  }
}

/**
 * Gets the currently applied size class from the document root
 * @returns {string|null} - The current size class or null if none found
 */
export function getCurrentSizeClass() {
  if (typeof document === 'undefined') {
    return null;
  }

  try {
    const html = document.documentElement;
    const allSizeClasses = getAllSizeClassNames();

    for (const className of allSizeClasses) {
      if (html.classList.contains(className)) {
        return className;
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to get current size class:', error);
    return null;
  }
}

/**
 * Checks if a specific size class is currently applied to the document root
 * @param {string} size - The size to check
 * @returns {boolean} - Whether the size class is applied
 */
export function isSizeClassApplied(size) {
  if (typeof document === 'undefined') {
    return false;
  }

  try {
    const html = document.documentElement;
    const sizeClass = getSizeClassName(size);
    return html.classList.contains(sizeClass);
  } catch (error) {
    console.error('Failed to check size class application:', error);
    return false;
  }
}

// Utility functions to convert Tailwind classes to CSS values
function convertTailwindSpacing(classes) {
  if (!classes) return '0';

  // Extract spacing values from Tailwind classes
  const spacingMap = {
    '1': '0.25rem', '1.5': '0.375rem', '2': '0.5rem', '2.5': '0.625rem',
    '3': '0.75rem', '4': '1rem', '5': '1.25rem', '6': '1.5rem',
    '7': '1.75rem', '8': '2rem', '10': '2.5rem', '12': '3rem',
    '14': '3.5rem', '16': '4rem', '20': '5rem', '24': '6rem'
  };

  // Helper function to get rem value
  const getRem = (value) => spacingMap[value] || value + 'rem';

  // Parse all padding values - handles mixed padding classes like 'pl-10 pr-4 py-2'
  const paddingTop = classes.match(/(?:py-(\d+(?:\.\d+)?)|pt-(\d+(?:\.\d+)?))/)?.[1] || classes.match(/(?:py-(\d+(?:\.\d+)?)|pt-(\d+(?:\.\d+)?))/)?.[2];
  const paddingRight = classes.match(/(?:px-(\d+(?:\.\d+)?)|pr-(\d+(?:\.\d+)?))/)?.[1] || classes.match(/(?:px-(\d+(?:\.\d+)?)|pr-(\d+(?:\.\d+)?))/)?.[2];
  const paddingBottom = classes.match(/(?:py-(\d+(?:\.\d+)?)|pb-(\d+(?:\.\d+)?))/)?.[1] || classes.match(/(?:py-(\d+(?:\.\d+)?)|pb-(\d+(?:\.\d+)?))/)?.[2];
  const paddingLeft = classes.match(/(?:px-(\d+(?:\.\d+)?)|pl-(\d+(?:\.\d+)?))/)?.[1] || classes.match(/(?:px-(\d+(?:\.\d+)?)|pl-(\d+(?:\.\d+)?))/)?.[2];
  const padding = classes.match(/p-(\d+(?:\.\d+)?)/)?.[1];

  // Handle padding combinations
  if (padding) {
    // Single value for all sides (p-4 -> 1rem)
    return getRem(padding);
  } else if (paddingTop || paddingRight || paddingBottom || paddingLeft) {
    // Mixed padding values - use 4-value shorthand: top right bottom left
    // Examples:
    // - 'px-4' -> '0 1rem' (py=0, px=1rem)
    // - 'pl-10 pr-4 py-2' -> '0.5rem 1rem 0.5rem 2.5rem' (top=py, right=pr, bottom=py, left=pl)
    const top = paddingTop ? getRem(paddingTop) : '0';
    const right = paddingRight ? getRem(paddingRight) : '0';
    const bottom = paddingBottom ? getRem(paddingBottom) : '0';
    const left = paddingLeft ? getRem(paddingLeft) : '0';

    // Optimize shorthand notation
    if (top === bottom && left === right) {
      if (top === left) {
        // All sides equal (4 values -> 1 value)
        return top;
      } else {
        // Vertical and horizontal pairs (4 values -> 2 values)
        return `${top} ${right}`;
      }
    } else if (left === right) {
      // Left and right equal (4 values -> 3 values)
      return `${top} ${right} ${bottom}`;
    } else {
      // All different (4 values)
      return `${top} ${right} ${bottom} ${left}`;
    }
  }

  // Parse margin values
  const marginX = classes.match(/mx-(\d+(?:\.\d+)?)/)?.[1];
  const marginY = classes.match(/my-(\d+(?:\.\d+)?)/)?.[1];
  const margin = classes.match(/m-(\d+(?:\.\d+)?)/)?.[1];
  const marginR = classes.match(/mr-(\d+(?:\.\d+)?)/)?.[1];
  const marginL = classes.match(/ml-(\d+(?:\.\d+)?)/)?.[1];
  const marginT = classes.match(/mt-(\d+(?:\.\d+)?)/)?.[1];
  const marginB = classes.match(/mb-(\d+(?:\.\d+)?)/)?.[1];

  if (marginR) return getRem(marginR);
  if (marginL) return getRem(marginL);
  if (marginT) return getRem(marginT);
  if (marginB) return getRem(marginB);
  if (margin) return getRem(margin);

  // Parse gap
  const gap = classes.match(/gap-(\d+(?:\.\d+)?)/)?.[1];
  if (gap) return getRem(gap);

  // Parse space-x
  const spaceX = classes.match(/space-x-(\d+(?:\.\d+)?)/)?.[1];
  if (spaceX) return getRem(spaceX);

  return '0';
}

function convertTailwindDimensions(classes) {
  if (!classes) return 'auto';

  const dimensionMap = {
    '4': '1rem', '5': '1.25rem', '6': '1.5rem', '7': '1.75rem',
    '8': '2rem', '10': '2.5rem', '12': '3rem', '14': '3.5rem',
    '16': '4rem', '20': '5rem', '24': '6rem'
  };

  // Parse height
  const height = classes.match(/h-(\d+(?:\.\d+)?)/)?.[1];
  if (height) return dimensionMap[height] || height + 'rem';

  // Parse width
  const width = classes.match(/w-(\d+(?:\.\d+)?)/)?.[1];
  if (width) {
    // Handle special width cases
    if (width === '56') return '14rem';
    if (width === '64') return '16rem';
    if (width === '72') return '18rem';
    if (width === '80') return '20rem';
    return dimensionMap[width] || width + 'rem';
  }

  return 'auto';
}

function convertTailwindFontSize(classes) {
  if (!classes) return '1rem';

  const fontSizeMap = {
    'xs': '0.75rem',
    'sm': '0.875rem',
    'base': '1rem',
    'lg': '1.125rem',
    'xl': '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem'
  };

  const fontSize = classes.match(/text-(\w+)/)?.[1];
  return fontSizeMap[fontSize] || '1rem';
}

function convertTailwindRadius(classes) {
  if (!classes) return '0';

  const radiusMap = {
    'rounded': '0.25rem',
    'rounded-md': '0.375rem',
    'rounded-lg': '0.5rem',
    'rounded-xl': '0.75rem',
    'rounded-2xl': '1rem'
  };

  return radiusMap[classes] || '0.375rem';
}

// Generate CSS custom properties for dynamic scaling
export function generateSizeCustomProperties(size) {
  const variant = sizeVariants[size] || sizeVariants.md;

  return {
    // Typography variables
    '--size-text': convertTailwindFontSize(variant.text),
    '--size-heading': convertTailwindFontSize(variant.heading),
    '--size-mainheading': convertTailwindFontSize(variant.typography.mainheading),
    '--size-subheading': convertTailwindFontSize(variant.typography.subheading),
    '--size-heading2': convertTailwindFontSize(variant.typography.heading2),
    '--size-small': convertTailwindFontSize(variant.typography.small),
    '--size-xsmall': convertTailwindFontSize(variant.typography.xsmall),

    // Spacing variables
    '--size-padding': convertTailwindSpacing(variant.padding),
    '--size-gap': convertTailwindSpacing(variant.gap),
    '--size-container': convertTailwindSpacing(variant.layout.container),
    '--size-item': convertTailwindSpacing(variant.spacing.item),
    '--size-sub-item': convertTailwindSpacing(variant.spacing.subItem),
    '--size-margin-xs': convertTailwindSpacing(variant.spacing.marginXs),
    '--size-margin-sm': convertTailwindSpacing(variant.spacing.marginSm),
    '--size-space-x': convertTailwindSpacing(variant.spacing.spaceX),
    '--size-padding-icon-left': convertTailwindSpacing(variant.spacing.paddingIconLeft),
    '--size-margin-start-xs': convertTailwindSpacing(variant.spacing.marginStartXs),
    '--size-margin-top-xs': convertTailwindSpacing(variant.spacing.marginTopXs),
    '--size-icon-container-padding-start': convertTailwindSpacing(variant.spacing.iconContainerPaddingStart),

    // Dimension variables
    '--size-height': convertTailwindDimensions(variant.height),
    '--size-width': convertTailwindDimensions(variant.width),
    '--size-icon': convertTailwindDimensions(variant.icon.size),
    '--size-icon-button': convertTailwindDimensions(variant.icon.button),
    '--size-icon-nav': convertTailwindDimensions(variant.icon.nav),
    '--size-icon-hero': convertTailwindDimensions(variant.icon.hero),
    '--size-avatar': convertTailwindDimensions(variant.avatar),
    '--size-thumbnail': convertTailwindDimensions(variant.thumbnail),
    '--size-logo': convertTailwindDimensions(variant.logo),

    // Component-specific variables
    '--size-input-height': convertTailwindDimensions(variant.input.height),
    '--size-input-padding': convertTailwindSpacing(variant.input.padding),
    '--size-input-text': convertTailwindFontSize(variant.input.text),
    '--size-input-with-icon-left-padding': convertTailwindSpacing(variant.input.withIconLeftPadding),

    '--size-badge-size': convertTailwindDimensions(variant.badge.size),
    '--size-badge-text': convertTailwindFontSize(variant.badge.text),
    '--size-badge-padding': convertTailwindSpacing(variant.badge.padding),

    '--size-card-padding': convertTailwindSpacing(variant.card.padding),
    '--size-card-title': convertTailwindFontSize(variant.card.title),
    '--size-card-description': convertTailwindFontSize(variant.card.description),
    '--size-card-content': convertTailwindSpacing(variant.card.content),
    '--size-card-footer': convertTailwindSpacing(variant.card.footer),

    '--size-navbar-width': variant.navbar.width,
    '--size-navbar-mobile-width': variant.navbar.mobileWidth,
    '--size-navbar-padding': convertTailwindSpacing(variant.navbar.padding),
    '--size-navbar-fixed-width': variant.navbar.fixedWidth,

    '--size-popover-width': convertTailwindDimensions(variant.popover.width),

    // Layout variables
    '--size-card-grid': convertTailwindSpacing(variant.layout.cardGrid),
    '--size-section-spacing': convertTailwindSpacing(variant.layout.sectionSpacing),
    '--size-max-width': variant.layout.maxWidth,
    '--size-radius': convertTailwindRadius(variant.radius),

    // Grid variables - comprehensive coverage of all sizeVariants grid fields
    '--size-grid-departments': convertTailwindSpacing(variant.grid.departments),
    '--size-grid-computers': convertTailwindSpacing(variant.grid.computers),
    '--size-grid-settings': convertTailwindSpacing(variant.grid.settings),
    '--size-grid-theme-options': convertTailwindSpacing(variant.grid.themeOptions),
    '--size-grid-size-options': convertTailwindSpacing(variant.grid.sizeOptions),
    '--size-grid-columns': variant.grid.columns,

    // Spacing variables - comprehensive coverage including container
    '--size-spacing-container': convertTailwindSpacing(variant.spacing.container),

    // Animation variables
    '--size-animation-duration': variant.animation.duration,
    '--size-animation-easing': variant.animation.easing,

    // Legacy variables for backward compatibility
    '--font-size-main-heading': convertTailwindFontSize(variant.typography.mainheading),
    '--font-size-sub-heading': convertTailwindFontSize(variant.typography.subheading),
    '--font-size-heading-2': convertTailwindFontSize(variant.typography.heading2),
    '--font-size-text': convertTailwindFontSize(variant.typography.text),
    '--line-height-main-heading': '1.2',
    '--line-height-sub-heading': '1.3',
    '--line-height-heading-2': '1.4',
    '--line-height-text': '1.5',
    '--section-spacing': convertTailwindSpacing(variant.layout.sectionSpacing),
    '--container-spacing': convertTailwindSpacing(variant.layout.container),
    '--layout-gap': convertTailwindSpacing(variant.layout.cardGrid),
    '--grid-gap': convertTailwindSpacing(variant.layout.cardGrid),
    '--grid-columns': variant.grid.columns,
  };
}
