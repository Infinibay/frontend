"use client"

import * as React from "react"

const HeaderActionContext = React.createContext(null)

/**
 * Hook to access header actions context
 * @returns {Object} Context value with actionRegistry and triggerAction
 * @throws {Error} When used outside HeaderActionProvider
 */
export function useHeaderActions() {
  const context = React.useContext(HeaderActionContext)
  if (!context) {
    throw new Error("useHeaderActions must be used within HeaderActionProvider")
  }
  return context
}

/**
 * Provider component for header action registry
 * Provides a shared registry for action callbacks between pages and header
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export function HeaderActionProvider({ children }) {
  const actionRegistry = React.useRef(new Map())

  const value = React.useMemo(() => ({
    actionRegistry,
    triggerAction: (id) => {
      const handler = actionRegistry.current.get(id)
      if (handler) {
        handler()
      } else {
        console.warn(`No handler registered for action: ${id}`)
      }
    }
  }), [])

  return (
    <HeaderActionContext.Provider value={value}>
      {children}
    </HeaderActionContext.Provider>
  )
}
