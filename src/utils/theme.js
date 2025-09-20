/**
 * Theme utility functions for managing light/dark mode preferences
 * and system integration.
 */

// Theme constants
export const THEME_VALUES = ['light', 'dark', 'system']
export const THEME_COOKIE_NAME = 'infinibay-theme'

/**
 * Validates if a theme value is valid
 * @param {string} theme - Theme value to validate
 * @returns {boolean} True if valid
 */
export function isValidTheme(theme) {
  return THEME_VALUES.includes(theme)
}

/**
 * Gets the current system color scheme preference
 * @returns {'light' | 'dark'} System theme preference
 */
export function getSystemTheme() {
  if (typeof window === 'undefined') return 'light'

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/**
 * Resolves a theme preference to an actual theme value
 * @param {'light' | 'dark' | 'system'} themePreference - Theme preference
 * @returns {'light' | 'dark'} Resolved theme
 */
export function resolveTheme(themePreference) {
  if (themePreference === 'system') {
    return getSystemTheme()
  }
  return themePreference
}

/**
 * Applies a theme to the DOM by managing the 'dark' class on html element
 * @param {'light' | 'dark' | 'system'} theme - Theme to apply
 */
export function applyTheme(theme) {
  if (typeof document === 'undefined') return

  const resolvedTheme = resolveTheme(theme)
  const htmlElement = document.documentElement

  if (resolvedTheme === 'dark') {
    htmlElement.classList.add('dark')
  } else {
    htmlElement.classList.remove('dark')
  }
}

/**
 * Creates a listener for system theme changes
 * @param {function} callback - Callback to execute when system theme changes
 * @returns {function} Cleanup function to remove the listener
 */
export function createSystemThemeListener(callback) {
  if (typeof window === 'undefined') return () => {}

  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = (e) => callback(e.matches ? 'dark' : 'light')

  // Modern browsers support addEventListener
  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }
  // Safari/older browsers fallback
  else if (typeof mq.addListener === 'function') {
    mq.addListener(handler)
    return () => mq.removeListener(handler)
  }

  return () => {}
}

/**
 * Gets theme preference from cookies
 * @param {string} cookieString - Cookie string (for SSR support)
 * @returns {'light' | 'dark' | 'system' | null} Theme from cookie or null
 */
export function getThemeFromCookie(cookieString) {
  if (typeof document === 'undefined' && !cookieString) return null

  const cookies = cookieString || document.cookie
  const match = cookies.match(new RegExp(`(^| )${THEME_COOKIE_NAME}=([^;]+)`))

  if (match) {
    const theme = match[2]
    return isValidTheme(theme) ? theme : null
  }

  return null
}

/**
 * Sets theme preference in cookies
 * @param {'light' | 'dark' | 'system'} theme - Theme to store
 */
export function setThemeCookie(theme) {
  if (typeof document === 'undefined') return

  if (!isValidTheme(theme)) {
    console.warn(`Invalid theme value: ${theme}`)
    return
  }

  // Set cookie to expire in 1 year
  const expires = new Date()
  expires.setFullYear(expires.getFullYear() + 1)

  // Add Secure flag when served over HTTPS
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''

  document.cookie = `${THEME_COOKIE_NAME}=${theme}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${secure}`
}

/**
 * Gets the initial theme preference, with fallbacks
 * Prioritizes: 1. Cookie 2. System preference 3. Light mode
 * @param {string} cookieString - Cookie string (for SSR support)
 * @returns {'light' | 'dark' | 'system'} Initial theme preference
 */
export function getInitialTheme(cookieString) {
  // Check cookie first
  const cookieTheme = getThemeFromCookie(cookieString)
  if (cookieTheme) {
    return cookieTheme
  }

  // Fallback to system preference if no cookie
  // Default to 'system' so it respects user's OS setting
  return 'system'
}

/**
 * Generates a color scale from a base hex color
 * @param {string} baseColor - Hex color (e.g., '#6ED0E0')
 * @returns {object} Color scale object with keys 50-900
 */
export function generateColorScale(baseColor) {
  // Convert hex to HSL for easier manipulation
  const hsl = hexToHsl(baseColor)

  // Generate scale with different lightness values
  const scale = {}
  const lightnessValues = {
    50: 95,
    100: 90,
    200: 80,
    300: 70,
    400: 60,
    500: 50, // Base color
    600: 40,
    700: 30,
    800: 20,
    900: 10
  }

  Object.entries(lightnessValues).forEach(([key, lightness]) => {
    scale[key] = `hsl(${hsl.h}, ${hsl.s}%, ${lightness}%)`
  })

  return scale
}

/**
 * Converts hex color to HSL
 * @param {string} hex - Hex color string
 * @returns {object} HSL object with h, s, l properties
 */
export function hexToHsl(hex) {
  // Remove hash if present
  hex = hex.replace('#', '')

  // Parse RGB values
  const r = parseInt(hex.substr(0, 2), 16) / 255
  const g = parseInt(hex.substr(2, 2), 16) / 255
  const b = parseInt(hex.substr(4, 2), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0 // Achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

/**
 * Creates a script tag content for preventing flash of wrong theme
 * This should be injected in the document head before React hydrates
 * @returns {string} Script content
 */
export function createThemeScript() {
  return `
    (function() {
      function getThemeFromCookie() {
        const match = document.cookie.match(new RegExp('(^| )${THEME_COOKIE_NAME}=([^;]+)'))
        return match ? match[2] : null
      }

      function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }

      function resolveTheme(preference) {
        if (preference === 'system') return getSystemTheme()
        return preference || 'light'
      }

      const theme = getThemeFromCookie() || 'system'
      const resolvedTheme = resolveTheme(theme)

      if (resolvedTheme === 'dark') {
        document.documentElement.classList.add('dark')
      }
    })()
  `
}