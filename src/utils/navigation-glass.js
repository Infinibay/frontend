/**
 * Navigation-specific glassmorphism utilities and helper functions
 * Provides Windows 11 Fluent Design patterns for navigation components
 */

/**
 * Navigation Glass Presets
 */

/**
 * Get appropriate glass classes for main navigation
 * @param {string} theme - Current theme (light/dark)
 * @param {string} size - Size context from size-provider
 * @returns {string} Glass class combination
 */
export const getNavbarGlass = (theme, size) => {
  const baseGlass = 'mica';
  const sizeModifier = getSizeGlassModifier(size);

  return `${baseGlass} ${sizeModifier} elevation-2 radius-fluent-md`;
};

/**
 * Get glass effects for sidebar variants
 * @param {string} theme - Current theme
 * @param {string} variant - Surface variant (main|sub|overlay) or glass effect (mica|acrylic|subtle)
 * @returns {string} Glass class combination
 */
export const getSidebarGlass = (theme, variant = 'main') => {
  // Map surface variants to glass effects
  const surfaceVariantMap = {
    main: 'mica elevation-2',
    sub: 'acrylic elevation-4',
    overlay: 'acrylic elevation-4' // Changed from acrylic-strong to avoid undefined class
  };

  // Map glass effects directly
  const glassEffectMap = {
    mica: 'mica elevation-2',
    acrylic: 'acrylic elevation-4',
    subtle: 'glass-subtle elevation-1',
    minimal: 'glass-minimal elevation-1'
  };

  // Check if variant is a surface variant or glass effect
  const glassClasses = surfaceVariantMap[variant] || glassEffectMap[variant] || surfaceVariantMap['main'];

  // Add consistent border for minimal variant and don't add radius as it has its own radius defined
  if (variant === 'minimal') {
    return `${glassClasses} border border-sidebar-border/20`;
  }

  return `${glassClasses} radius-fluent-md`;
};

/**
 * Generate header glass effects with sticky enhancement
 * @param {string} theme - Current theme
 * @param {boolean} sticky - Whether header is sticky
 * @returns {string} Glass class combination
 */
export const getHeaderGlass = (theme, sticky = false) => {
  const baseGlass = sticky ? 'acrylic' : 'mica';
  const elevation = sticky ? 'elevation-4' : 'elevation-2';

  return `${baseGlass} ${elevation} radius-fluent-md`;
};

/**
 * Get theme-aware header glass effects that provide proper contrast
 * @param {string} resolvedTheme - Current resolved theme (light/dark)
 * @param {boolean} sticky - Whether header is sticky
 * @returns {string} Theme-aware glass class combination
 */
export const getThemeAwareHeaderGlass = (resolvedTheme, sticky = false) => {
  const baseGlass = sticky ? 'acrylic backdrop-blur-lg' : 'mica backdrop-blur-md';
  const elevation = sticky ? 'elevation-4' : 'elevation-2';

  // Use semantic tokens that adapt to theme
  const background = resolvedTheme === 'dark'
    ? 'bg-background/95 backdrop-saturate-150'
    : 'bg-background/95 backdrop-saturate-150'; // Use background token for proper theme adaptation

  const border = 'border-border/20';
  const textColor = 'text-foreground'; // Use foreground token for proper contrast

  return `${baseGlass} ${background} ${border} ${textColor} ${elevation}`;
};

/**
 * Brand-Colored Navigation Effects
 */

/**
 * Generate brand-colored glows for navigation items
 * @param {string} color - Brand color (celeste, dark-blue, sun)
 * @param {string} intensity - Glow intensity (subtle, medium, strong)
 * @returns {string} Glow class combination
 */
export const getNavBrandGlow = (color = 'celeste', intensity = 'subtle') => {
  const colorMap = {
    celeste: 'glow-celeste',
    'dark-blue': 'glow-dark-blue',
    sun: 'glow-sun'
  };

  const intensityMap = {
    subtle: 'glow-subtle',
    medium: 'glow-medium',
    strong: 'glow-strong'
  };

  return `${colorMap[color]} ${intensityMap[intensity]}`;
};

/**
 * Get active navigation item styling with brand colors
 * @param {string} theme - Current theme
 * @returns {string} Active state classes
 */
export const getActiveNavStyle = (theme) => {
  return 'bg-selection text-selection-foreground glass-subtle border-l-2 border-brand-celeste glow-celeste glow-subtle';
};

/**
 * Generate hover effects for navigation elements
 * @param {string} theme - Current theme
 * @returns {string} Hover state classes
 */
export const getHoverNavStyle = (theme) => {
  return 'hover:bg-selection/20 hover:text-sidebar-foreground hover:glass-subtle hover:glow-celeste hover:glow-subtle transition-all duration-200';
};

/**
 * Windows 11 Navigation Patterns
 */

/**
 * Mica effect for persistent navigation surfaces
 * @param {string} theme - Current theme
 * @returns {string} Mica navigation classes
 */
export const getMicaNavigation = (theme) => {
  const background = theme === 'dark' ? 'bg-sidebar/85' : 'bg-sidebar/90';
  return `mica backdrop-blur-md ${background} border border-sidebar-border/20 elevation-2 text-sidebar-foreground`;
};

/**
 * Acrylic effect for overlay navigation (sub-sidebars, mobile)
 * @param {string} theme - Current theme
 * @returns {string} Acrylic overlay classes
 */
export const getAcrylicOverlay = (theme) => {
  const background = theme === 'dark' ? 'bg-background/85' : 'bg-background/90';
  return `acrylic backdrop-blur-lg ${background} border border-border/30 elevation-4 text-foreground`;
};

/**
 * Fluent Design card styling for navigation sections
 * @param {string} theme - Current theme
 * @returns {string} Fluent card classes
 */
export const getFluentNavCard = (theme) => {
  return 'fluent-card backdrop-blur-sm border border-sidebar-border/20 radius-fluent-md elevation-1';
};

/**
 * Minimal glass effect for very subtle transparency needs
 * @param {string} theme - Current theme
 * @returns {string} Minimal glass classes
 */
export const getMinimalGlassContainer = (theme) => {
  return 'glass-minimal border border-sidebar-border/10 elevation-1';
};

/**
 * Responsive Glass Scaling
 */

/**
 * Adjust glass intensity based on component size
 * @param {string} glassEffect - Base glass effect
 * @param {string} size - Size context (xs, sm, md, lg, xl)
 * @returns {string} Size-adjusted glass classes
 */
export const scaleGlassForSize = (glassEffect, size) => {
  const sizeModifier = getSizeGlassModifier(size);
  return `${glassEffect} ${sizeModifier}`;
};

/**
 * Get appropriate blur radius for different sizes
 * @param {string} size - Size context
 * @returns {string} Blur class
 */
export const getResponsiveBlur = (size) => {
  const blurMap = {
    xs: 'backdrop-blur-sm',
    sm: 'backdrop-blur-md',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  return blurMap[size] || 'backdrop-blur-md';
};

/**
 * Optimize glass effects for mobile performance
 * @returns {string} Mobile-optimized glass classes
 */
export const getMobileGlassAdjustment = () => {
  return 'backdrop-blur-sm elevation-2';
};

/**
 * Get size-based glass modifier
 * @param {string} size - Size context
 * @returns {string} Size modifier classes
 */
const getSizeGlassModifier = (size) => {
  const modifierMap = {
    xs: 'glass-minimal',
    sm: 'glass-subtle',
    md: 'glass-medium',
    lg: 'glass-medium',
    xl: 'glass-strong'
  };

  return modifierMap[size] || 'glass-medium';
};

/**
 * Accessibility Navigation Helpers
 */

/**
 * Ensure proper contrast ratios
 * @param {string} background - Background class
 * @param {string} theme - Current theme
 * @returns {string} Contrast-safe classes
 */
export const getAccessibleNavContrast = (background, theme) => {
  return 'text-sidebar-foreground contrast-more:text-sidebar-foreground';
};

/**
 * Provide fallbacks for reduced transparency
 * @param {string} glassClass - Glass effect class
 * @returns {string} Fallback classes
 */
export const getReducedTransparencyFallback = (glassClass) => {
  return 'data-[reduced-transparency=true]:border-sidebar-border data-[reduced-transparency=true]:shadow-elevation-1 motion-reduce:border-sidebar-border motion-reduce:shadow-elevation-1';
};

/**
 * Generate visible focus rings on glass backgrounds
 * @param {string} theme - Current theme
 * @returns {string} Focus ring classes
 */
export const getFocusRingForGlass = (theme) => {
  return 'focus:outline-none focus:ring-2 focus:ring-brand-celeste focus:ring-offset-2 focus:ring-offset-sidebar';
};

/**
 * Performance Optimization
 */

/**
 * Minimize backdrop-filter layers in navigation
 * @param {Array} elements - Navigation elements
 * @returns {string} Optimized classes
 */
export const optimizeNavBlur = (elements) => {
  return 'will-change-auto transform-gpu';
};

/**
 * Smooth glass transitions during navigation
 * @returns {string} Transition classes
 */
export const debounceNavGlassTransition = () => {
  return 'transition-all duration-300 ease-out';
};

/**
 * Optimize layered glass effects
 * @returns {string} Efficient glass stack classes
 */
export const getEfficientGlassStack = () => {
  return 'isolate backdrop-blur-md';
};

/**
 * Brand Integration Utilities
 */

/**
 * Celeste-tinted glass for primary navigation
 * @param {number} opacity - Opacity level (0-1)
 * @returns {string} Celeste tint classes
 */
export const getCelesteNavTint = (opacity = 0.1) => {
  const opacityClass = Math.round(opacity * 100);
  return `bg-brand-celeste/${opacityClass} border-brand-celeste/20`;
};

/**
 * Dark blue accents for active states
 * @param {string} intensity - Accent intensity (subtle, medium, strong)
 * @returns {string} Dark blue accent classes
 */
export const getDarkBlueNavAccent = (intensity = 'medium') => {
  const intensityMap = {
    subtle: 'bg-brand-dark-blue/5 border-brand-dark-blue/10',
    medium: 'bg-brand-dark-blue/10 border-brand-dark-blue/20',
    strong: 'bg-brand-dark-blue/20 border-brand-dark-blue/30'
  };

  return intensityMap[intensity];
};

/**
 * Sun-colored highlights for special actions
 * @param {boolean} subtle - Whether to use subtle highlighting
 * @returns {string} Sun highlight classes
 */
export const getSunNavHighlight = (subtle = true) => {
  return subtle
    ? 'bg-brand-sun/5 border-brand-sun/10 glow-sun glow-subtle'
    : 'bg-brand-sun/10 border-brand-sun/20 glow-sun glow-medium';
};

/**
 * Theme-Aware Navigation
 */

/**
 * Get complete navigation color scheme for theme
 * @param {string} theme - Current theme
 * @returns {Object} Navigation color scheme
 */
export const getThemeNavColors = (theme) => {
  return {
    background: '', // Remove solid background to allow glass effect
    foreground: 'text-sidebar-foreground',
    accent: '', // Remove solid accent background
    primary: 'bg-selection',
    border: 'border-sidebar-border',
    glass: getMicaNavigation(theme)
  };
};

/**
 * Get theme-appropriate header variant implementation
 * @param {string} variant - Header variant
 * @param {string} resolvedTheme - Current resolved theme
 * @returns {string} Theme-appropriate variant classes
 */
export const getHeaderVariantForTheme = (variant, resolvedTheme) => {
  const variantMap = {
    glass: () => getThemeAwareHeaderGlass(resolvedTheme, false),
    acrylic: () => getAcrylicOverlay(resolvedTheme),
    fluent: () => `fluent-card ${getThemeAwareHeaderGlass(resolvedTheme, false)} border-brand-celeste/20 glow-brand-celeste glow-subtle`,
    mica: () => getMicaNavigation(resolvedTheme)
  };

  return variantMap[variant] ? variantMap[variant]() : '';
};

/**
 * Map semantic tokens to navigation-specific values
 * @param {string} theme - Current theme
 * @returns {Object} Semantic token mapping
 */
export const getSemanticNavTokens = (theme) => {
  return {
    surface: '', // Remove solid background to allow glass effect
    surfaceAccent: '', // Remove solid accent background
    surfacePrimary: 'bg-selection',
    textPrimary: 'text-sidebar-foreground',
    textSecondary: 'text-sidebar-foreground/80',
    borderSubtle: 'border-sidebar-border/20',
    borderAccent: 'border-sidebar-border'
  };
};

/**
 * Generate theme-appropriate gradients for navigation
 * @param {string} theme - Current theme
 * @returns {Object} Navigation gradients
 */
export const getNavGradients = (theme) => {
  return {
    primary: 'bg-gradient-to-r from-brand-celeste/10 to-brand-dark-blue/10',
    accent: 'bg-gradient-to-r from-brand-dark-blue/5 to-brand-celeste/5',
    highlight: 'bg-gradient-to-r from-brand-sun/5 to-brand-celeste/5',
    depth: '' // Remove solid background gradient to allow glass effect
  };
};

/**
 * Utility Combinations for Common Navigation Patterns
 */

/**
 * Complete glass navigation item styling
 * @param {Object} options - Styling options
 * @returns {string} Complete navigation item classes
 */
export const getGlassNavItem = ({
  active = false,
  theme = 'light',
  size = 'md',
  brand = 'celeste'
} = {}) => {
  const baseClasses = [
    'radius-fluent-sm',
    'transition-all duration-200',
    getFocusRingForGlass(theme),
    getResponsiveBlur(size)
  ];

  if (active) {
    baseClasses.push(
      getActiveNavStyle(theme),
      getNavBrandGlow(brand, 'subtle')
    );
  } else {
    baseClasses.push(getHoverNavStyle(theme));
  }

  return baseClasses.join(' ');
};

/**
 * Complete glass navigation container styling
 * @param {Object} options - Container options
 * @returns {string} Complete navigation container classes
 */
export const getGlassNavContainer = ({
  variant = 'main',
  theme = 'light',
  size = 'md',
  sticky = false
} = {}) => {
  const baseClasses = [
    getSidebarGlass(theme, variant),
    debounceNavGlassTransition(),
    getReducedTransparencyFallback(),
    optimizeNavBlur()
  ];

  if (variant !== 'minimal') {
    baseClasses.push(getResponsiveBlur(size));
  }

  if (sticky) {
    baseClasses.push('sticky top-0 z-40');
  }

  return baseClasses.join(' ');
};