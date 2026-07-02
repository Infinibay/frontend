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

// Listen for localStorage changes to enable/disable panel.
// Cross-tab changes arrive via the 'storage' event; same-tab changes are
// dispatched explicitly from toggleDebugUI() below. This replaces the old
// always-on 1 Hz setInterval poller.
export const watchDebugChanges = () => {
  if (typeof window === 'undefined') return

  // Listen for storage events (when localStorage changes in other tabs)
  window.addEventListener('storage', (e) => {
    if (e.key === 'DEBUG') {
      handleDebugChange(e.newValue)
    }
  })
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

  let newDebug
  if (debugValues.some(v => v.toLowerCase() === 'ui')) {
    // Remove UI mode
    newDebug = debugValues.filter(v => v.toLowerCase() !== 'ui').join(',')
  } else {
    // Add UI mode
    debugValues.push('ui')
    newDebug = debugValues.join(',')
  }
  localStorage.setItem('DEBUG', newDebug)
  // The 'storage' event does not fire in the tab that made the change, so drive
  // the panel directly here instead of relying on a polling loop.
  handleDebugChange(newDebug)
}

// Auto-initialize when module is imported — DEVELOPMENT ONLY. In production this
// tooling (a keydown hook on Ctrl+Shift+D, a cross-tab storage listener, and the
// injected debug panel) must never run for end users.
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  // Initialize on next tick to ensure DOM is ready
  setTimeout(() => {
    initializeDebugPanel()
    watchDebugChanges()
    enableDebugShortcut()
  }, 100)
}
