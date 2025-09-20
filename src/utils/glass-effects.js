/**
 * Glass Effects Utility Library
 *
 * Provides utility functions for creating glassmorphism effects and Windows 11 styling.
 * Integrates with the existing brand color system and size-provider.
 *
 * GLOW STRATEGY:
 * - For GlassCard components: Use Tailwind shadow-glow-{color}-{glow} classes (recommended)
 * - For other components: Use CSS .glow-* classes or these utility functions
 */

import { sizeVariants } from "@/components/ui/size-provider"

// Brand color mappings for glass effects
const BRAND_COLORS = {
  celeste: {
    50: 'var(--brand-celeste-50)',
    100: 'var(--brand-celeste-100)',
    200: 'var(--brand-celeste-200)',
    300: 'var(--brand-celeste-300)',
    400: 'var(--brand-celeste-400)',
    500: 'var(--brand-celeste-500)',
    600: 'var(--brand-celeste-600)',
    700: 'var(--brand-celeste-700)',
    800: 'var(--brand-celeste-800)',
    900: 'var(--brand-celeste-900)',
  },
  'dark-blue': {
    50: 'var(--brand-dark-blue-50)',
    100: 'var(--brand-dark-blue-100)',
    200: 'var(--brand-dark-blue-200)',
    300: 'var(--brand-dark-blue-300)',
    400: 'var(--brand-dark-blue-400)',
    500: 'var(--brand-dark-blue-500)',
    600: 'var(--brand-dark-blue-600)',
    700: 'var(--brand-dark-blue-700)',
    800: 'var(--brand-dark-blue-800)',
    900: 'var(--brand-dark-blue-900)',
  },
  sun: {
    50: 'var(--brand-sun-50)',
    100: 'var(--brand-sun-100)',
    200: 'var(--brand-sun-200)',
    300: 'var(--brand-sun-300)',
    400: 'var(--brand-sun-400)',
    500: 'var(--brand-sun-500)',
    600: 'var(--brand-sun-600)',
    700: 'var(--brand-sun-700)',
    800: 'var(--brand-sun-800)',
    900: 'var(--brand-sun-900)',
  }
}

// Glass effect intensity presets
const GLASS_PRESETS = {
  subtle: {
    blur: 12,
    saturate: 1.1,
    opacity: [0.9, 0.8],
    borderOpacity: 0.2
  },
  medium: {
    blur: 20,
    saturate: 1.2,
    opacity: [0.8, 0.7],
    borderOpacity: 0.3
  },
  strong: {
    blur: 30,
    saturate: 1.5,
    opacity: [0.7, 0.6],
    borderOpacity: 0.4
  }
}

/**
 * Generate glass effect CSS properties
 * @param {string} intensity - 'subtle', 'medium', or 'strong'
 * @param {string} tint - Brand color name ('celeste', 'dark-blue', 'sun')
 * @param {number} customBlur - Optional custom blur value
 * @returns {object} CSS properties object
 */
export function createGlassStyle(intensity = 'medium', tint = 'celeste', customBlur = null) {
  const preset = GLASS_PRESETS[intensity] || GLASS_PRESETS.medium
  const blur = customBlur || preset.blur

  const tintColor = BRAND_COLORS[tint] || BRAND_COLORS.celeste

  // Calculate shadow opacity with proper precedence
  const extraOpacity = intensity === 'strong' ? 0.1 : intensity === 'medium' ? 0.05 : 0
  const shadowOpacity = 0.1 + extraOpacity

  return {
    backdropFilter: `blur(${blur}px) saturate(${preset.saturate})`,
    background: `linear-gradient(135deg, hsl(${tintColor[100]} / ${preset.opacity[0]}), hsl(${tintColor[200]} / ${preset.opacity[1]}))`,
    border: `1px solid hsl(0 0% 100% / ${preset.borderOpacity})`,
    boxShadow: `0 ${blur/3}px ${blur*1.6}px hsl(var(--brand-dark-blue-900) / ${shadowOpacity}), inset 0 1px 0 hsl(0 0% 100% / ${preset.borderOpacity})`
  }
}

/**
 * Get Windows 11 Mica effect styling
 * @param {string} theme - 'light' or 'dark'
 * @returns {object} CSS properties object
 */
export function getMicaEffect(theme = 'light') {
  const isLight = theme === 'light'

  return {
    backdropFilter: 'blur(8px) saturate(1.05)',
    background: isLight
      ? `linear-gradient(145deg, hsl(${BRAND_COLORS.celeste[50]} / 0.95), hsl(${BRAND_COLORS.celeste[100]} / 0.9))`
      : `linear-gradient(145deg, hsl(${BRAND_COLORS['dark-blue'][900]} / 0.9), hsl(${BRAND_COLORS['dark-blue'][800]} / 0.85))`,
    border: '1px solid hsl(var(--glass-border))',
    boxShadow: '0 2px 8px hsl(var(--brand-dark-blue-900) / 0.08), inset 0 1px 0 hsl(255 255 255 / 0.15)'
  }
}

/**
 * Get Windows 11 Acrylic effect styling with noise texture
 * @param {string} theme - 'light' or 'dark'
 * @returns {object} CSS properties object
 */
export function getAcrylicEffect(theme = 'light') {
  const isLight = theme === 'light'
  const noiseOpacity = isLight ? '0.03' : '0.05'

  const noiseTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${noiseOpacity}'/%3E%3C/svg%3E")`

  return {
    backdropFilter: 'blur(24px) saturate(1.3)',
    background: isLight
      ? `radial-gradient(circle at 50% 0%, hsl(${BRAND_COLORS.celeste[100]} / 0.4), transparent 50%), linear-gradient(135deg, hsl(${BRAND_COLORS.celeste[100]} / 0.75), hsl(${BRAND_COLORS.celeste[200]} / 0.65)), ${noiseTexture}`
      : `radial-gradient(circle at 50% 0%, hsl(${BRAND_COLORS.celeste[400]} / 0.2), transparent 50%), linear-gradient(135deg, hsl(${BRAND_COLORS['dark-blue'][800]} / 0.7), hsl(${BRAND_COLORS['dark-blue'][700]} / 0.6)), ${noiseTexture}`,
    border: '1px solid hsl(var(--glass-border))',
    boxShadow: '0 16px 64px hsl(var(--brand-dark-blue-900) / 0.18), inset 0 1px 0 hsl(255 255 255 / 0.35)'
  }
}

/**
 * Generate brand-colored glass tint
 * @param {string} color - Brand color name ('celeste', 'dark-blue', 'sun')
 * @param {number} opacity - Opacity value (0-1)
 * @returns {string} HSL color string
 */
export function getBrandGlassTint(color = 'celeste', opacity = 0.8) {
  const colorVar = BRAND_COLORS[color] || BRAND_COLORS.celeste
  return `hsl(${colorVar[200]} / ${opacity})`
}

/**
 * Get preset brand glass effects
 */
export function getCelesteGlass(intensity = 'medium') {
  return createGlassStyle(intensity, 'celeste')
}

export function getDarkBlueGlass(intensity = 'medium') {
  return createGlassStyle(intensity, 'dark-blue')
}

export function getSunGlass(intensity = 'medium') {
  return createGlassStyle(intensity, 'sun')
}

/**
 * Generate elevation shadow based on level
 * @param {number} level - Elevation level (1-5)
 * @returns {string} Box shadow CSS value
 */
export function getElevationShadow(level = 2) {
  const shadows = {
    1: '0 1px 3px hsl(var(--brand-dark-blue-900) / 0.12), 0 1px 2px hsl(var(--brand-dark-blue-900) / 0.08)',
    2: '0 3px 6px hsl(var(--brand-dark-blue-900) / 0.16), 0 2px 4px hsl(var(--brand-dark-blue-900) / 0.08)',
    3: '0 6px 16px hsl(var(--brand-dark-blue-900) / 0.16), 0 3px 6px hsl(var(--brand-dark-blue-900) / 0.08)',
    4: '0 12px 24px hsl(var(--brand-dark-blue-900) / 0.18), 0 6px 12px hsl(var(--brand-dark-blue-900) / 0.1)',
    5: '0 20px 40px hsl(var(--brand-dark-blue-900) / 0.2), 0 10px 20px hsl(var(--brand-dark-blue-900) / 0.12)'
  }

  return shadows[level] || shadows[2]
}

/**
 * Generate brand-colored glow effect
 * @param {string} color - Brand color name ('celeste', 'dark-blue', 'sun')
 * @param {string} intensity - 'subtle', 'medium', or 'strong'
 * @returns {string} Box shadow CSS value for glow
 */
export function getBrandGlow(color = 'celeste', intensity = 'medium') {
  const colorVar = BRAND_COLORS[color] || BRAND_COLORS.celeste

  const glowSizes = {
    subtle: { inner: 20, outer: 40, innerOpacity: 0.3, outerOpacity: 0.15 },
    medium: { inner: 30, outer: 60, innerOpacity: 0.4, outerOpacity: 0.2 },
    strong: { inner: 40, outer: 80, innerOpacity: 0.5, outerOpacity: 0.25 }
  }

  const glow = glowSizes[intensity] || glowSizes.medium

  return `0 0 ${glow.inner}px hsl(${colorVar[400]} / ${glow.innerOpacity}), 0 0 ${glow.outer}px hsl(${colorVar[400]} / ${glow.outerOpacity})`
}

/**
 * Combine elevation and glow effects
 * @param {number} elevation - Elevation level (1-5)
 * @param {string} color - Brand color for glow
 * @param {string} glowIntensity - Glow intensity
 * @returns {string} Combined box shadow CSS value
 */
export function combineElevationAndGlow(elevation = 2, color = 'celeste', glowIntensity = 'subtle') {
  const elevationShadow = getElevationShadow(elevation)
  const glow = getBrandGlow(color, glowIntensity)

  return `${elevationShadow}, ${glow}`
}

/**
 * Get responsive glass effects based on size
 * @param {string} size - Size variant ('sm', 'md', 'lg', 'xl')
 * @returns {object} Responsive glass configuration
 */
export function getResponsiveGlass(size = 'md') {
  const sizeConfig = {
    sm: { intensity: 'subtle', blur: 8, elevation: 1 },
    md: { intensity: 'medium', blur: 16, elevation: 2 },
    lg: { intensity: 'medium', blur: 20, elevation: 3 },
    xl: { intensity: 'strong', blur: 24, elevation: 4 }
  }

  return sizeConfig[size] || sizeConfig.md
}

/**
 * Get Fluent Design border radius for size
 * @param {string} size - Size variant
 * @returns {string} Border radius CSS value
 */
export function getFluentRadius(size = 'md') {
  const radiusMap = {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px'
  }

  return radiusMap[size] || radiusMap.md
}

/**
 * Browser support detection utilities
 */
export function supportsBackdropFilter() {
  if (typeof window === 'undefined') return false

  return CSS.supports('backdrop-filter', 'blur(1px)') ||
         CSS.supports('-webkit-backdrop-filter', 'blur(1px)')
}

export function getFallbackGlass() {
  return {
    background: 'hsl(var(--card) / 0.95)',
    border: '1px solid hsl(var(--border))',
    boxShadow: '0 4px 16px hsl(var(--brand-dark-blue-900) / 0.1)'
  }
}

export function shouldReduceTransparency() {
  if (typeof window === 'undefined') return false

  return window.matchMedia('(prefers-reduced-transparency: reduce)').matches
}

/**
 * Theme integration utilities
 */
export function getThemeGlass(theme = 'light', intensity = 'medium') {
  const isDark = theme === 'dark'
  const preset = GLASS_PRESETS[intensity] || GLASS_PRESETS.medium

  if (isDark) {
    return {
      backdropFilter: `blur(${preset.blur}px) saturate(${preset.saturate})`,
      background: `linear-gradient(135deg, hsl(${BRAND_COLORS['dark-blue'][900]} / ${preset.opacity[0] - 0.1}), hsl(${BRAND_COLORS['dark-blue'][800]} / ${preset.opacity[1] - 0.1}))`,
      border: '1px solid hsl(var(--glass-border))'
    }
  }

  return createGlassStyle(intensity, 'celeste')
}

export function getSemanticGlass(semantic = 'primary', intensity = 'medium') {
  const semanticColorMap = {
    primary: 'dark-blue',
    secondary: 'celeste',
    accent: 'sun'
  }

  const color = semanticColorMap[semantic] || 'celeste'
  return createGlassStyle(intensity, color)
}

/**
 * Performance optimization utilities
 */
export function optimizeGlassLayers() {
  // Return CSS that minimizes backdrop-filter layers for performance
  return {
    willChange: 'backdrop-filter, transform',
    transform: 'translateZ(0)', // Create stacking context
    backfaceVisibility: 'hidden'
  }
}

export function debounceGlassAnimation(callback, delay = 100) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => callback.apply(null, args), delay)
  }
}

/**
 * Utility class name generators for use with Tailwind
 */
export function getGlassClasses(config = {}) {
  const {
    glass = 'medium',
    effect = 'none',
    elevation = 2,
    glow = 'none',
    glowColor = 'celeste',
    radius = 'default'
  } = config

  const classes = []

  // Glass effect
  if (glass !== 'none') {
    classes.push(`glass-${glass}`)
  }

  // Windows 11 effects
  if (effect !== 'none') {
    classes.push(effect)
  }

  // Elevation
  if (elevation > 0) {
    classes.push(`shadow-elevation-${elevation}`)
  }

  // Glow effects
  if (glow !== 'none') {
    classes.push(`shadow-glow-${glowColor}-${glow}`)
  }

  // Radius
  if (radius !== 'default') {
    classes.push(`radius-fluent-${radius}`)
  } else {
    classes.push('rounded-xl')
  }

  // Accessibility and fallbacks
  classes.push(
    'transition-glass',
    'duration-300',
    'supports-[not(backdrop-filter:blur(1px))]:bg-card/95',
    'supports-[not(backdrop-filter:blur(1px))]:border',
    'supports-[not(backdrop-filter:blur(1px))]:border-border',
    'motion-reduce:backdrop-blur-none',
    'motion-reduce:bg-card',
    'motion-reduce:border',
    'motion-reduce:border-border'
  )

  return classes.join(' ')
}

// Export commonly used presets
export const GLASS_PRESETS_EXPORT = {
  dashboard: { glass: 'medium', elevation: 3, glow: 'subtle', glowColor: 'celeste' },
  modal: { effect: 'acrylic', elevation: 5, glow: 'medium', glowColor: 'dark-blue', radius: 'lg' },
  hero: { glass: 'strong', elevation: 4, glow: 'strong', glowColor: 'sun', radius: 'xl' },
  subtle: { effect: 'mica', elevation: 1, glow: 'none' }
}