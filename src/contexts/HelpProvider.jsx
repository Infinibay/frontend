"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

/**
 * Help configuration interface
 * @typedef {Object} HelpConfig
 * @property {string} title - The title displayed in the help sheet header
 * @property {string} [description] - Optional description shown below the title
 * @property {React.ReactNode} [icon] - Optional icon component to display in header
 * @property {HelpSection[]} sections - Array of collapsible help sections
 * @property {string[]} [quickTips] - Optional array of quick tip strings
 */

/**
 * Help section interface
 * @typedef {Object} HelpSection
 * @property {string} id - Unique identifier for the accordion item
 * @property {string} title - Section title displayed in accordion trigger
 * @property {React.ReactNode} [icon] - Optional icon for the section
 * @property {React.ReactNode} content - Section content (can be JSX)
 */

/**
 * Help context value
 * @typedef {Object} HelpContextValue
 * @property {HelpConfig | null} helpConfig - Current help configuration (null if no help registered)
 * @property {function(HelpConfig | null): void} setHelpConfig - Function to update help configuration
 */

const HelpContext = React.createContext(null)

/**
 * Hook to access help context
 * @returns {HelpContextValue} Help context value
 * @throws {Error} When used outside HelpProvider
 */
export function useHelp() {
  const context = React.useContext(HelpContext)
  if (!context) {
    throw new Error("useHelp must be used within a HelpProvider")
  }
  return context
}

/**
 * Help provider component that manages contextual help state
 * Automatically clears help configuration when route changes
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export function HelpProvider({ children }) {
  const pathname = usePathname()
  const [helpConfig, setHelpConfig] = React.useState(null)

  // Auto-reset help configuration when route changes
  React.useEffect(() => {
    setHelpConfig(null)
  }, [pathname])

  // Memoize context value to prevent unnecessary re-renders
  const value = React.useMemo(() => ({
    helpConfig,
    setHelpConfig
  }), [helpConfig])

  return (
    <HelpContext.Provider value={value}>
      {children}
    </HelpContext.Provider>
  )
}
