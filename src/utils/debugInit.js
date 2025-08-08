/**
 * Debug Panel Initialization
 * This module automatically initializes the debug panel when UI mode is enabled
 */

import { createDebugger } from './debug'

// Initialize debug panel if UI mode is enabled
export const initializeDebugPanel = () => {
  if (typeof window === 'undefined') return

  const debugConfig = localStorage.getItem('DEBUG')
  if (!debugConfig) return

  const enabledNamespaces = debugConfig.split(',').map(ns => ns.trim().toLowerCase())
  const isUIMode = enabledNamespaces.includes('ui')

  if (isUIMode) {
    // Use the global manager from debug.js to ensure singleton
    const manager = window.__infinibayDebugPanelManager
    if (manager) {
      manager.ensurePanel().then(panel => {
        if (panel) {
          // Add some initial logs to show it's working
          const debug = createDebugger('frontend:debug:panel')
          debug.success('init', 'Debug panel initialized successfully!')
          debug.info('init', 'Available features:', {
            'Namespace navigation': 'Click namespaces in left sidebar',
            'Clear logs': 'Click 🗑️ button',
            'Export logs': 'Click 💾 button',
            'Filter logs': 'Use search box',
            'Toggle levels': 'Use checkboxes for log levels',
            'Toggle sidebar': 'Click 📋 button',
            'Drag panel': 'Click and drag header',
            'Resize panel': 'Drag bottom-right corner'
          })
        }
      })
    }
  }
}

// Listen for localStorage changes to enable/disable panel
export const watchDebugChanges = () => {
  if (typeof window === 'undefined') return

  // Listen for storage events (when localStorage changes in other tabs)
  window.addEventListener('storage', (e) => {
    if (e.key === 'DEBUG') {
      handleDebugChange(e.newValue)
    }
  })

  // Also check periodically for changes in the same tab
  let lastDebugValue = localStorage.getItem('DEBUG')
  setInterval(() => {
    const currentDebugValue = localStorage.getItem('DEBUG')
    if (currentDebugValue !== lastDebugValue) {
      handleDebugChange(currentDebugValue)
      lastDebugValue = currentDebugValue
    }
  }, 1000)
}

const handleDebugChange = (newDebugValue) => {
  const enabledNamespaces = (newDebugValue || '').split(',').map(ns => ns.trim().toLowerCase())
  const isUIMode = enabledNamespaces.includes('ui')

  const manager = window.__infinibayDebugPanelManager
  if (!manager) return

  if (isUIMode && !manager.getPanel()) {
    // Enable UI mode
    initializeDebugPanel()
  } else if (!isUIMode && manager.getPanel()) {
    // Disable UI mode
    manager.destroyPanel()
  }
}

// Keyboard shortcut to toggle debug panel (Ctrl+Shift+D)
export const enableDebugShortcut = () => {
  if (typeof window === 'undefined') return

  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault()
      toggleDebugUI()
    }
  })
}

const toggleDebugUI = () => {
  const currentDebug = localStorage.getItem('DEBUG') || ''
  const debugValues = currentDebug.split(',').map(v => v.trim()).filter(v => v)

  if (debugValues.some(v => v.toLowerCase() === 'ui')) {
    // Remove UI mode
    const newDebug = debugValues.filter(v => v.toLowerCase() !== 'ui').join(',')
    localStorage.setItem('DEBUG', newDebug)
  } else {
    // Add UI mode
    debugValues.push('ui')
    localStorage.setItem('DEBUG', debugValues.join(','))
  }
}

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
  // Initialize on next tick to ensure DOM is ready
  setTimeout(() => {
    initializeDebugPanel()
    watchDebugChanges()
    enableDebugShortcut()
  }, 100)
}
