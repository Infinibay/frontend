/**
 * Frontend Debug System - localStorage-based debugging similar to backend
 * 
 * Usage:
 * - Enable debugging: localStorage.setItem('DEBUG', 'frontend:realtime:*')
 * - Multiple namespaces: localStorage.setItem('DEBUG', 'frontend:state:vms,frontend:graphql:*')
 * - Enable all: localStorage.setItem('DEBUG', '*')
 * - Disable: localStorage.removeItem('DEBUG')
 * 
 * Example:
 * const debug = createDebugger('frontend:realtime:redux')
 * debug.log('init', 'Initializing service')
 * debug.info('event', 'Received data:', data)
 * debug.error('connection', 'Failed to connect:', error)
 */

// Global debug panel instance - managed by DebugPanelManager

class FrontendDebugger {
  constructor(namespace) {
    this.namespace = namespace
    this.enabled = this.isEnabled()

    // Initialize debug panel if UI mode is enabled (but only once)
    this.initializeDebugPanel()
  }

  isEnabled() {
    if (typeof window === 'undefined') return false

    const debugConfig = localStorage.getItem('DEBUG')
    if (!debugConfig) return false

    const enabledNamespaces = debugConfig.split(',').map(ns => ns.trim())

    // Check for exact match or wildcard match
    return enabledNamespaces.some(enabled => {
      if (enabled === '*') return true
      if (enabled.endsWith('*')) {
        const prefix = enabled.slice(0, -1)
        return this.namespace.startsWith(prefix)
      }
      return this.namespace === enabled
    })
  }

  isUIMode() {
    if (typeof window === 'undefined') return false

    const debugConfig = localStorage.getItem('DEBUG')
    if (!debugConfig) return false

    const enabledNamespaces = debugConfig.split(',').map(ns => ns.trim().toLowerCase())
    return enabledNamespaces.includes('ui')
  }

  initializeDebugPanel() {
    if (this.isUIMode() && typeof window !== 'undefined') {
      // Use the global manager to ensure only one panel
      const manager = window.__infinibayDebugPanelManager || DebugPanelManager
      manager.ensurePanel()
    }
  }

  log(subNamespace, ...args) {
    const fullNamespace = subNamespace
      ? `${this.namespace}:${subNamespace}`
      : this.namespace

    const timestamp = new Date().toISOString().substring(11, 23)
    const color = this.getNamespaceColor(fullNamespace)

    // Always log to debug panel if UI mode is enabled (regardless of namespace filtering)
    if (this.isUIMode()) {
      const manager = window.__infinibayDebugPanelManager || DebugPanelManager
      const panel = manager.getPanel()
      if (panel) {
        panel.addLog({
          timestamp,
          namespace: fullNamespace,
          level: 'log',
          args,
          color
        })
      }
    }

    // Only log to console if this namespace is enabled
    if (!this.isEnabled()) return

    console.log(
      `%c[${timestamp}] ${fullNamespace}`,
      `color: ${color}; font-weight: bold;`,
      ...args
    )
  }

  // Different log levels with emojis for easy identification
  info(subNamespace, ...args) {
    this._logWithLevel('info', subNamespace, '📘', ...args)
  }

  warn(subNamespace, ...args) {
    this._logWithLevel('warn', subNamespace, '⚠️', ...args)
  }

  error(subNamespace, ...args) {
    this._logWithLevel('error', subNamespace, '❌', ...args)
  }

  success(subNamespace, ...args) {
    this._logWithLevel('success', subNamespace, '✅', ...args)
  }

  _logWithLevel(level, subNamespace, emoji, ...args) {
    const fullNamespace = subNamespace
      ? `${this.namespace}:${subNamespace}`
      : this.namespace

    const timestamp = new Date().toISOString().substring(11, 23)
    const color = this.getNamespaceColor(fullNamespace)

    // Always log to debug panel if UI mode is enabled (regardless of namespace filtering)
    if (this.isUIMode()) {
      const manager = window.__infinibayDebugPanelManager || DebugPanelManager
      const panel = manager.getPanel()
      if (panel) {
        panel.addLog({
          timestamp,
          namespace: fullNamespace,
          level,
          args: [emoji, ...args],
          color
        })
      }
    }

    // Only log to console if this namespace is enabled
    if (!this.isEnabled()) return

    console.log(
      `%c[${timestamp}] ${fullNamespace}`,
      `color: ${color}; font-weight: bold;`,
      emoji,
      ...args
    )
  }

  // Generate consistent colors for namespaces
  getNamespaceColor(namespace) {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ]

    let hash = 0
    for (let i = 0; i < namespace.length; i++) {
      hash = namespace.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }
}

// Global debug panel manager
const DebugPanelManager = {
  panel: null,
  initializing: false,

  async ensurePanel() {
    if (this.panel || this.initializing) return this.panel

    this.initializing = true
    try {
      const { DebugPanel } = await import('./debugPanel')
      if (!this.panel) { // Double-check after async operation
        this.panel = new DebugPanel()
      }
      return this.panel
    } catch (error) {
      console.warn('Failed to load debug panel:', error)
      return null
    } finally {
      this.initializing = false
    }
  },

  destroyPanel() {
    if (this.panel) {
      this.panel.destroy()
      this.panel = null
    }
    this.initializing = false
  },

  getPanel() {
    return this.panel
  }
}

// Make the manager globally accessible to prevent duplicates
if (typeof window !== 'undefined') {
  if (!window.__infinibayDebugPanelManager) {
    window.__infinibayDebugPanelManager = DebugPanelManager
  }
  // Use the global instance
  Object.assign(DebugPanelManager, window.__infinibayDebugPanelManager)
}

export const createDebugger = (namespace) => new FrontendDebugger(namespace)

// Global function to toggle debug panel
export const toggleDebugPanel = () => {
  if (typeof window === 'undefined') return

  const currentDebug = localStorage.getItem('DEBUG') || ''
  const debugValues = currentDebug.split(',').map(v => v.trim()).filter(v => v)

  if (debugValues.includes('ui') || debugValues.includes('UI')) {
    // Remove UI mode
    const newDebug = debugValues.filter(v => v.toLowerCase() !== 'ui').join(',')
    localStorage.setItem('DEBUG', newDebug)

    // Destroy panel if it exists
    DebugPanelManager.destroyPanel()
  } else {
    // Add UI mode
    debugValues.push('ui')
    localStorage.setItem('DEBUG', debugValues.join(','))

    // Create panel
    DebugPanelManager.ensurePanel()
  }
}
