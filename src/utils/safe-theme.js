/**
 * Safe Theme Utilities
 *
 * Provides fallback theme handling when ThemeProvider is not available
 * This is useful for Storybook, tests, or standalone component usage
 */

/**
 * Get safe theme that works without ThemeProvider
 * @returns {string} Current resolved theme or fallback
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
 * Safe version of useResolvedTheme that provides fallback
 * @returns {string} Current resolved theme
 */
export function useSafeResolvedTheme() {
  try {
    // Try to import and use the actual ThemeProvider hook
    const { useResolvedTheme } = require("@/contexts/ThemeProvider");
    return useResolvedTheme();
  } catch (error) {
    // If ThemeProvider is not available, use system preference
    return getSafeTheme();
  }
}

/**
 * Get theme-aware classes with fallback
 * @param {function} getClasses - Function that takes theme and returns classes
 * @param {any} ...args - Additional arguments for the function
 * @returns {string} CSS classes
 */
export function withSafeTheme(getClasses, ...args) {
  const theme = getSafeTheme();
  return getClasses(theme, ...args);
}