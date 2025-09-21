import * as React from "react"
import {
  getInitialTheme,
  applyTheme,
  setThemeCookie,
  createSystemThemeListener,
  resolveTheme,
  isValidTheme
} from "@/utils/theme"

/**
 * Theme context type definition
 * @typedef {Object} ThemeContextValue
 * @property {'light' | 'dark' | 'system'} theme - Current theme preference
 * @property {'light' | 'dark'} resolvedTheme - Actual theme applied (resolves 'system')
 * @property {function} setTheme - Function to change theme preference
 * @property {function} toggleTheme - Function to toggle between light and dark
 */

const ThemeContext = React.createContext(null)

/**
 * Hook to access theme context
 * @returns {ThemeContextValue} Theme context value
 * @throws {Error} When used outside ThemeProvider
 */
export function useAppTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProvider")
  }
  return context
}

// Keep useTheme as an alias for backward compatibility
export const useTheme = useAppTheme

/**
 * Theme provider component that manages theme state and persistence
 * @param {Object} props
 * @param {'light' | 'dark' | 'system'} [props.defaultTheme='system'] - Default theme if no preference stored
 * @param {React.ReactNode} props.children - Child components
 * @param {boolean} [props.enableSystem=true] - Whether to enable system theme detection
 * @param {string} [props.cookieString] - Cookie string for SSR (Next.js)
 * @param {function} [props.onThemeChange] - Callback function called when theme changes
 */
export function ThemeProvider({
  defaultTheme = 'system',
  children,
  enableSystem = true,
  cookieString,
  onThemeChange,
  ...props
}) {
  // Initialize theme from cookie or default
  const [theme, setThemeState] = React.useState(() => {
    // For SSR, we need to be careful about hydration mismatches
    if (typeof window === 'undefined') {
      return getInitialTheme(cookieString) || defaultTheme
    }
    return getInitialTheme() || defaultTheme
  })

  // Track resolved theme (what's actually applied)
  const [resolvedTheme, setResolvedTheme] = React.useState(() => {
    if (typeof window === 'undefined') {
      // Server-side: assume light mode to prevent hydration mismatch
      return 'light'
    }
    return resolveTheme(theme)
  })

  // Apply theme to DOM and update resolved theme when theme changes
  React.useEffect(() => {
    const resolved = resolveTheme(theme)
    setResolvedTheme(resolved)
    applyTheme(theme)
  }, [theme])

  // Set up system theme listener
  React.useEffect(() => {
    if (!enableSystem) return

    const cleanup = createSystemThemeListener((systemTheme) => {
      // Only update resolved theme if current preference is 'system'
      if (theme === 'system') {
        setResolvedTheme(systemTheme)
        applyTheme('system') // Re-apply to ensure DOM is updated
      }
    })

    return cleanup
  }, [theme, enableSystem])

  // Function to change theme preference
  const setTheme = React.useCallback((newTheme) => {
    if (!isValidTheme(newTheme)) {
      console.warn(`Invalid theme value: ${newTheme}`)
      return
    }

    setThemeState(newTheme)
    setThemeCookie(newTheme)

    // Call onThemeChange callback if provided
    if (onThemeChange && typeof onThemeChange === 'function') {
      try {
        onThemeChange(newTheme)
      } catch (error) {
        console.error('Error in onThemeChange callback:', error)
      }
    }
  }, [onThemeChange])

  // Function to toggle between light and dark (ignoring system)
  const toggleTheme = React.useCallback(() => {
    const currentResolved = resolveTheme(theme)
    const newTheme = currentResolved === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }, [theme, setTheme])

  // Memoize context value to prevent unnecessary re-renders
  const value = React.useMemo(() => ({
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme
  }), [theme, resolvedTheme, setTheme, toggleTheme])

  return (
    <ThemeContext.Provider value={value} {...props}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Higher-order component to provide theme context
 * @param {React.Component} Component - Component to wrap
 * @returns {React.Component} Wrapped component with theme context
 */
export function withAppTheme(Component) {
  return React.forwardRef((props, ref) => {
    const theme = useAppTheme()
    return <Component {...props} ref={ref} theme={theme} />
  })
}

// Keep withTheme as an alias for backward compatibility
export const withTheme = withAppTheme

/**
 * Hook to get only the resolved theme (light/dark) without context re-renders
 * Useful for components that only need to know the current theme state
 * @returns {'light' | 'dark'} Current resolved theme
 */
export function useResolvedTheme() {
  const { resolvedTheme } = useAppTheme()
  return resolvedTheme
}

/**
 * Hook to get theme toggle function without subscribing to theme state
 * Useful for toggle buttons that don't need to re-render on theme changes
 * @returns {function} Toggle theme function
 */
export function useThemeToggle() {
  const { toggleTheme } = useAppTheme()
  return toggleTheme
}