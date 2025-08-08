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

class FrontendDebugger {
  constructor(namespace) {
    this.namespace = namespace
    this.enabled = this.isEnabled()
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

  log(subNamespace, ...args) {
    if (!this.isEnabled()) return

    const fullNamespace = subNamespace
      ? `${this.namespace}:${subNamespace}`
      : this.namespace

    const timestamp = new Date().toISOString().substring(11, 23)
    const color = this.getNamespaceColor(fullNamespace)

    console.log(
      `%c[${timestamp}] ${fullNamespace}`,
      `color: ${color}; font-weight: bold;`,
      ...args
    )
  }

  // Different log levels with emojis for easy identification
  info(subNamespace, ...args) {
    this.log(subNamespace, '📘', ...args)
  }

  warn(subNamespace, ...args) {
    this.log(subNamespace, '⚠️', ...args)
  }

  error(subNamespace, ...args) {
    this.log(subNamespace, '❌', ...args)
  }

  success(subNamespace, ...args) {
    this.log(subNamespace, '✅', ...args)
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

export const createDebugger = (namespace) => new FrontendDebugger(namespace)
