/**
 * Form Glass Effects Utilities
 *
 * Comprehensive utility functions for form and data display glassmorphism effects.
 * Integrates with theme system, size-provider, and brand colors.
 */

/**
 * Safe theme getter that provides fallback when ThemeProvider is not available
 * @returns {string} Current resolved theme or 'light' as fallback
 */
export function getSafeTheme() {
  try {
    // Try to get theme from system preference if available
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  } catch (error) {
    // Fallback to light theme if there's any error
    return 'light';
  }
}

/**
 * Generate glass effects for form elements with semantic tokens
 * @param {string} intensity - Glass intensity: 'subtle', 'medium', 'strong'
 * @param {string} theme - Current theme: 'light', 'dark'
 * @returns {string} CSS classes for glass effect
 */
export function getFormGlassEffect(intensity = 'subtle', theme = 'light') {
  const baseGlass = {
    subtle: 'glass-subtle',
    medium: 'glass-medium',
    strong: 'glass-strong'
  };

  const glassClass = baseGlass[intensity] || baseGlass.subtle;

  // Add semantic background that adapts to theme with valid supports syntax
  return `${glassClass} bg-background/80 supports-[backdrop-filter:blur(0)]:bg-background/20`;
}

/**
 * Specific glass styling for input-like components
 * @param {string|boolean} glass - Glass setting
 * @param {string} size - Component size
 * @param {string} theme - Current theme
 * @returns {string} CSS classes for input glass
 */
export function getInputGlass(glass, size = 'md', theme = 'light') {
  if (!glass) return '';

  const intensity = typeof glass === 'string' ? glass : 'subtle';
  return getFormGlassEffect(intensity, theme);
}

/**
 * Glass effects for select dropdowns and triggers
 * @param {string|boolean} glass - Glass setting
 * @param {string} theme - Current theme
 * @returns {object} CSS classes for trigger and content
 */
export function getSelectGlass(glass, theme = 'light') {
  if (!glass) return { trigger: '', content: '' };

  const intensity = typeof glass === 'string' ? glass : 'subtle';

  return {
    trigger: getFormGlassEffect(intensity, theme),
    content: 'acrylic' // Special acrylic glass for dropdowns
  };
}

/**
 * Glass effects for checkbox and radio components
 * @param {string|boolean} glass - Glass setting
 * @param {string} size - Component size
 * @param {string} theme - Current theme
 * @returns {string} CSS classes for checkbox/radio glass
 */
export function getCheckboxGlass(glass, size = 'md', theme = 'light') {
  if (!glass) return '';

  const intensity = typeof glass === 'string' ? glass : 'subtle';
  return getFormGlassEffect(intensity, theme);
}

/**
 * Glass effects for switch components
 * @param {string|boolean} glass - Glass setting
 * @param {string} size - Component size
 * @param {string} theme - Current theme
 * @returns {object} CSS classes for track and thumb
 */
export function getSwitchGlass(glass, size = 'md', theme = 'light') {
  if (!glass) return { track: '', thumb: '' };

  const intensity = typeof glass === 'string' ? glass : 'subtle';

  // Handle mica glass option
  if (intensity === 'mica') {
    return {
      track: 'glass-medium backdrop-blur-lg bg-background/30 border border-white/10',
      thumb: 'glass-subtle backdrop-blur-sm bg-background/70 border border-white/20'
    };
  }

  const glassClass = getFormGlassEffect(intensity, theme);

  return {
    track: glassClass,
    thumb: 'glass-subtle' // Thumb always subtle
  };
}

/**
 * Glass effects for table components
 * @param {string|boolean} glass - Glass setting
 * @param {string} theme - Current theme
 * @returns {object} CSS classes for table elements
 */
export function getTableGlass(glass, theme = 'light') {
  if (!glass) return { container: '', header: '', row: '' };

  const intensity = typeof glass === 'string' ? glass : 'subtle';

  return {
    container: getFormGlassEffect(intensity, theme),
    header: intensity === 'subtle' ? 'glass-medium' : 'glass-strong',
    row: 'glass-subtle'
  };
}

/**
 * Glass effects for badge variants
 * @param {string} variant - Badge variant
 * @param {string|boolean} glass - Glass setting
 * @param {string} theme - Current theme
 * @returns {string} CSS classes for badge glass
 */
export function getBadgeGlass(variant, glass, theme = 'light') {
  if (!glass) return '';

  const intensity = typeof glass === 'string' ? glass : 'subtle';
  return getFormGlassEffect(intensity, theme);
}

/**
 * Glass effects for progress bars
 * @param {string} variant - Progress variant
 * @param {string|boolean} glass - Glass setting
 * @param {string} theme - Current theme
 * @returns {object} CSS classes for track and indicator
 */
export function getProgressGlass(variant, glass, theme = 'light') {
  if (!glass) return { track: '', indicator: '' };

  const intensity = typeof glass === 'string' ? glass : 'subtle';

  return {
    track: getFormGlassEffect(intensity, theme),
    indicator: 'glass-subtle'
  };
}

/**
 * Glass effects for data display cards
 * @param {string|boolean} glass - Glass setting
 * @param {number} elevation - Elevation level
 * @param {string} theme - Current theme
 * @returns {string} CSS classes for data card glass
 */
export function getDataCardGlass(glass, elevation = 1, theme = 'light') {
  if (!glass) return '';

  const intensity = typeof glass === 'string' ? glass : 'medium';
  return getFormGlassEffect(intensity, theme);
}

/**
 * Celeste-tinted glass for primary form elements
 * @param {number} opacity - Opacity level (0-1)
 * @returns {string} CSS classes for celeste tint
 */
export function getCelesteFormTint(opacity = 0.1) {
  return 'bg-brand-celeste/10 border-brand-celeste/20';
}

/**
 * Dark blue accents for active/focused states
 * @param {string} intensity - Accent intensity
 * @returns {string} CSS classes for dark blue accents
 */
export function getDarkBlueFormAccent(intensity = 'subtle') {
  const accents = {
    subtle: 'ring-brand-dark-blue/20 shadow-glow-brand-dark-blue/20',
    medium: 'ring-brand-dark-blue/40 shadow-glow-brand-dark-blue/40',
    strong: 'ring-brand-dark-blue/60 shadow-glow-brand-dark-blue/60'
  };

  return accents[intensity] || accents.subtle;
}

/**
 * Sun-colored highlights for success states and accents
 * @param {boolean} subtle - Use subtle highlighting
 * @returns {string} CSS classes for sun highlights
 */
export function getSunFormHighlight(subtle = true) {
  return subtle
    ? 'bg-brand-sun/10 border-brand-sun/20'
    : 'bg-brand-sun/20 border-brand-sun/40';
}

/**
 * Brand-colored glows for form element states
 * @param {string} color - Brand color: 'celeste', 'dark-blue', 'sun'
 * @param {string} state - Element state: 'default', 'hover', 'focus', 'active'
 * @returns {string} CSS classes for brand glow
 */
export function getBrandFormGlow(color = 'celeste', state = 'default') {
  const colors = {
    celeste: {
      default: 'shadow-glow-brand-celeste/20',
      hover: 'shadow-glow-brand-celeste/30',
      focus: 'shadow-glow-brand-celeste/40',
      active: 'shadow-glow-brand-celeste/50'
    },
    'dark-blue': {
      default: 'shadow-glow-brand-dark-blue/20',
      hover: 'shadow-glow-brand-dark-blue/30',
      focus: 'shadow-glow-brand-dark-blue/40',
      active: 'shadow-glow-brand-dark-blue/50'
    },
    sun: {
      default: 'shadow-glow-brand-sun/20',
      hover: 'shadow-glow-brand-sun/30',
      focus: 'shadow-glow-brand-sun/40',
      active: 'shadow-glow-brand-sun/50'
    }
  };

  return colors[color]?.[state] || colors.celeste.default;
}

/**
 * Adjust glass intensity for form element sizes
 * @param {string} glassEffect - Base glass effect
 * @param {string} size - Element size
 * @returns {string} Size-adjusted glass effect
 */
export function scaleFormGlass(glassEffect, size = 'md') {
  if (!glassEffect) return '';

  // Smaller elements use more subtle glass
  if (size === 'sm' && glassEffect.includes('medium')) {
    return glassEffect.replace('medium', 'subtle');
  }

  // Larger elements can handle stronger glass
  if (size === 'lg' && glassEffect.includes('subtle')) {
    return glassEffect.replace('subtle', 'medium');
  }

  return glassEffect;
}

/**
 * Get appropriate blur radius for form elements
 * @param {string} size - Element size
 * @returns {string} CSS classes for blur
 */
export function getResponsiveFormBlur(size = 'md') {
  const blurs = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur',
    lg: 'backdrop-blur-md'
  };

  return blurs[size] || blurs.md;
}

/**
 * Complete glass styling for size context
 * @param {string|boolean} glass - Glass setting
 * @param {string} size - Element size
 * @returns {string} Complete glass styling
 */
export function getFormGlassForSize(glass, size = 'md') {
  if (!glass) return '';

  const intensity = typeof glass === 'string' ? glass : 'subtle';
  const baseGlass = getFormGlassEffect(intensity);
  const sizedGlass = scaleFormGlass(baseGlass, size);

  return sizedGlass;
}

/**
 * Ensure form element contrast
 * @param {string} background - Background type
 * @param {string} theme - Current theme
 * @returns {string} CSS classes for contrast
 */
export function getAccessibleFormContrast(background = 'glass', theme = 'light') {
  if (background === 'glass') {
    return theme === 'dark'
      ? 'text-foreground placeholder:text-muted-foreground'
      : 'text-foreground placeholder:text-muted-foreground';
  }

  return '';
}

/**
 * Generate visible focus rings on glass backgrounds
 * @param {string} theme - Current theme
 * @param {boolean} glass - Has glass background
 * @returns {string} CSS classes for focus ring
 */
export function getFormFocusRing(theme = 'light', glass = false) {
  if (glass) {
    return 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
  }

  return 'focus-visible:ring-1 focus-visible:ring-ring';
}

/**
 * Provide form-specific fallbacks for reduced transparency
 * @param {string} glassClass - Glass CSS class
 * @returns {string} CSS classes with fallback
 */
export function getReducedTransparencyForm(glassClass) {
  if (!glassClass) return '';

  return 'supports-[backdrop-filter:blur(0)]:bg-background/20';
}

/**
 * Glass effects for table rows (hover, selected)
 * @param {string|boolean} glass - Glass setting
 * @param {string} state - Row state: 'default', 'hover', 'selected'
 * @param {string} theme - Current theme
 * @returns {string} CSS classes for table row glass
 */
export function getTableRowGlass(glass, state = 'default', theme = 'light') {
  if (!glass) return '';

  const states = {
    default: '',
    hover: 'glass-subtle',
    selected: 'glass-medium bg-brand-celeste/10'
  };

  return states[state] || states.default;
}

/**
 * Combine badge variants with glass effects
 * @param {string} variant - Badge variant
 * @param {string|boolean} glass - Glass setting
 * @param {string} theme - Current theme
 * @returns {string} CSS classes for glass badge variant
 */
export function getBadgeGlassVariant(variant, glass, theme = 'light') {
  if (!glass) return '';

  const glassVariants = {
    default: 'glass-subtle bg-primary/20 text-primary',
    secondary: 'glass-subtle bg-secondary/20 text-secondary-foreground',
    destructive: 'glass-subtle bg-destructive/20 text-destructive',
    'brand-primary': 'glass-subtle bg-brand-dark-blue/20 text-brand-dark-blue',
    'brand-celeste': 'glass-subtle bg-brand-celeste/20 text-brand-dark-blue',
    'brand-sun': 'glass-subtle bg-brand-sun/20 text-brand-dark-blue'
  };

  return glassVariants[variant] || glassVariants.default;
}

/**
 * Glass effects for progress track
 * @param {string} variant - Progress variant
 * @param {string|boolean} glass - Glass setting
 * @param {string} theme - Current theme
 * @returns {string} CSS classes for progress track glass
 */
export function getProgressGlassTrack(variant, glass, theme = 'light') {
  if (!glass) return '';

  return 'glass-subtle bg-brand-celeste/10';
}

/**
 * Glass effects for progress indicator
 * @param {string} variant - Progress variant
 * @param {string|boolean} glass - Glass setting
 * @param {number} value - Progress value (0-100)
 * @param {string} theme - Current theme
 * @returns {string} CSS classes for progress indicator glass
 */
export function getProgressGlassIndicator(variant, glass, value = 0, theme = 'light') {
  if (!glass) return '';

  const glowIntensity = Math.min(value / 100 * 0.5, 0.5);

  const variants = {
    default: `glass-subtle shadow-glow-brand-dark-blue/${Math.round(glowIntensity * 100)}`,
    success: `glass-subtle shadow-glow-brand-sun/${Math.round(glowIntensity * 100)}`,
    warning: `glass-subtle shadow-glow-brand-sun/${Math.round(glowIntensity * 100)}`,
    error: `glass-subtle shadow-glow-destructive/${Math.round(glowIntensity * 100)}`
  };

  return variants[variant] || variants.default;
}

/**
 * Smooth transitions for form glass effects
 * @returns {string} CSS classes for transitions
 */
export function getFormGlassTransition() {
  return 'transition-all duration-200 ease-in-out';
}

/**
 * Animations for data display glass effects
 * @returns {string} CSS classes for animations
 */
export function getDataGlassAnimation() {
  return 'transition-all duration-300 ease-in-out';
}

/**
 * Performance optimizations for form glass
 * @returns {string} CSS classes for performance
 */
export function optimizeFormGlassPerformance() {
  return 'transform-gpu will-change-transform';
}

/**
 * Get theme-appropriate glass for form components
 * @param {string} theme - Current theme
 * @param {string} component - Component type
 * @returns {string} CSS classes for theme glass
 */
export function getFormThemeGlass(theme = 'light', component = 'input') {
  // Use semantic tokens that automatically adapt to theme
  const themeEffects = {
    light: {
      input: 'glass-subtle bg-background/20',
      button: 'glass-medium bg-background/30',
      card: 'glass-medium bg-background/40'
    },
    dark: {
      input: 'glass-subtle bg-background/20',
      button: 'glass-medium bg-background/30',
      card: 'glass-medium bg-background/40'
    }
  };

  return themeEffects[theme]?.[component] || themeEffects.light.input;
}

/**
 * Get theme-appropriate glass for data components
 * @param {string} theme - Current theme
 * @param {string} component - Component type
 * @returns {string} CSS classes for data glass
 */
export function getDataThemeGlass(theme = 'light', component = 'table') {
  // Use semantic tokens that automatically adapt to theme
  const themeEffects = {
    light: {
      table: 'glass-medium bg-background/30',
      badge: 'glass-subtle bg-background/20',
      progress: 'glass-subtle bg-background/25'
    },
    dark: {
      table: 'glass-medium bg-background/30',
      badge: 'glass-subtle bg-background/20',
      progress: 'glass-subtle bg-background/25'
    }
  };

  return themeEffects[theme]?.[component] || themeEffects.light.table;
}

/**
 * Map semantic tokens to glass effects
 * @param {string} semantic - Semantic token name
 * @param {string|boolean} glass - Glass setting
 * @param {string} theme - Current theme
 * @returns {string} CSS classes for semantic glass
 */
export function getSemanticFormGlass(semantic, glass, theme = 'light') {
  if (!glass) return '';

  const semanticMapping = {
    primary: 'glass-subtle bg-primary/20',
    secondary: 'glass-subtle bg-secondary/20',
    accent: 'glass-subtle bg-accent/20',
    muted: 'glass-subtle bg-muted/20',
    destructive: 'glass-subtle bg-destructive/20'
  };

  return semanticMapping[semantic] || semanticMapping.primary;
}