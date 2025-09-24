import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'infinibay_firewall_mode'
const DEFAULT_MODE = 'simple'

/**
 * @typedef {'simple' | 'advanced'} FirewallMode
 */

/**
 * Custom hook for managing firewall mode preferences with localStorage persistence
 * @returns {{mode: FirewallMode, toggleMode: () => void, setMode: (mode: FirewallMode) => void}}
 */
export function useFirewallMode() {
  // Initialize state from localStorage
  const [mode, setModeState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved === 'advanced' ? 'advanced' : DEFAULT_MODE
    } catch (error) {
      console.warn('Failed to read firewall mode from localStorage:', error)
      return DEFAULT_MODE
    }
  })

  // Sync mode changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch (error) {
      console.warn('Failed to save firewall mode to localStorage:', error)
    }
  }, [mode])

  // Toggle between simple and advanced modes
  const toggleMode = useCallback(() => {
    setModeState(prevMode => prevMode === 'simple' ? 'advanced' : 'simple')
  }, [])

  // Set specific mode
  const setMode = useCallback((newMode) => {
    if (newMode === 'simple' || newMode === 'advanced') {
      setModeState(newMode)
    }
  }, [])

  return {
    mode,
    toggleMode,
    setMode
  }
}

export default useFirewallMode