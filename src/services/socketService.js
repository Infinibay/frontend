import { io } from 'socket.io-client'

// Socket connection states
export const ConnectionState = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error'
}

// Frontend Socket Service for managing Socket.io connections
export class SocketService {
  constructor() {
    this.socket = null
    this.connectionState = ConnectionState.DISCONNECTED
    this.eventListeners = new Map()
    this.userNamespace = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.pendingSubscriptions = [] // Store subscription info for re-subscribing
  }

  // Connect to Socket.io server with authentication
  connect(token, namespace) {
    if (this.socket?.connected) {
      console.log('🔌 Already connected to Socket.io server')
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      console.log('🔌 Connecting to Socket.io server...', { namespace })

      this.connectionState = ConnectionState.CONNECTING
      this.userNamespace = namespace
      this.pendingSubscriptions = [] // Store subscriptions that need to be re-applied

      // Create Socket.io connection
      this.socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true // Force new connection for namespace changes
      })

      // Connection successful
      this.socket.on('connect', () => {
        console.log('🎉 Connected to Socket.io server:', this.socket.id)
        this.connectionState = ConnectionState.CONNECTED
        this.reconnectAttempts = 0
        resolve()
      })

      // Welcome message with namespace info
      this.socket.on('connected', (data) => {
        console.log('👋 Socket.io welcome:', data.message)
        console.log('🏷️ Assigned namespace:', data.namespace)

        const oldNamespace = this.userNamespace
        this.userNamespace = data.namespace

        // Update namespace in localStorage if it changed
        if (typeof window !== 'undefined') {
          localStorage.setItem('socketNamespace', data.namespace)
        }

        // If namespace changed, we need to re-subscribe to all events with the new namespace
        if (oldNamespace !== data.namespace) {
          console.log(`🔄 Namespace changed from ${oldNamespace} to ${data.namespace}, re-subscribing to events...`)
          this.resubscribeWithNewNamespace(oldNamespace, data.namespace)
        }
      })

      // Connection error
      this.socket.on('connect_error', (error) => {
        console.error('❌ Socket.io connection error:', error.message)
        this.connectionState = ConnectionState.ERROR
        reject(error)
      })

      // Disconnection
      this.socket.on('disconnect', (reason) => {
        console.log('💔 Disconnected from Socket.io server:', reason)
        this.connectionState = ConnectionState.DISCONNECTED

        // Auto-reconnect for certain disconnect reasons
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, don't reconnect automatically
          console.log('🚫 Server disconnected us, not reconnecting automatically')
        } else if (this.reconnectAttempts < this.maxReconnectAttempts) {
          // Client-side disconnect, attempt to reconnect
          this.reconnectAttempts++
          console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
          setTimeout(() => this.reconnect(), 2000 * this.reconnectAttempts)
        }
      })

      // Reconnection events
      this.socket.on('reconnect', (attemptNumber) => {
        console.log(`✅ Reconnected after ${attemptNumber} attempts`)
        this.connectionState = ConnectionState.CONNECTED
        this.reconnectAttempts = 0
      })

      this.socket.on('reconnect_failed', () => {
        console.error('❌ Failed to reconnect to Socket.io server')
        this.connectionState = ConnectionState.ERROR
      })
    })
  }

  // Disconnect from server
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting from Socket.io server')
      this.socket.disconnect()
      this.socket = null
      this.connectionState = ConnectionState.DISCONNECTED
      this.userNamespace = null
      this.eventListeners.clear()
      this.pendingSubscriptions = []
    }
  }

  // Reconnect to server
  reconnect() {
    if (this.socket) {
      this.socket.connect()
    }
  }

  // Subscribe to events with pattern matching
  subscribe(eventPattern, callback) {
    if (!this.socket) {
      console.warn(`⚠️ Cannot subscribe to ${eventPattern}: not connected`)
      return () => { } // Return empty unsubscribe function
    }

    console.log(`👂 Subscribing to event pattern: ${eventPattern}`)

    // Store listener for cleanup
    if (!this.eventListeners.has(eventPattern)) {
      this.eventListeners.set(eventPattern, new Set())
    }
    this.eventListeners.get(eventPattern).add(callback)

    // Store subscription info for potential re-subscribing
    const subscriptionInfo = { eventPattern, callback }
    this.pendingSubscriptions.push(subscriptionInfo)

    // For namespace-specific events, listen for the full event name
    if (this.userNamespace && eventPattern.includes(':')) {
      const fullEventName = eventPattern.startsWith(this.userNamespace)
        ? eventPattern
        : `${this.userNamespace}:${eventPattern}`

      console.log(`🔔 Subscribing to event: ${fullEventName} (namespace: ${this.userNamespace})`)
      this.socket.on(fullEventName, (data) => {
        console.log(`📨 Received event: ${fullEventName}`, data)
        callback(data)
      })

      return () => {
        if (this.socket) {
          this.socket.off(fullEventName, callback)
        }
        this.removeEventListener(eventPattern, callback)
        this.removePendingSubscription(eventPattern, callback)
      }
    } else {
      // For general events (like 'connected', 'disconnect', etc.)
      this.socket.on(eventPattern, callback)

      return () => {
        if (this.socket) {
          this.socket.off(eventPattern, callback)
        }
        this.removeEventListener(eventPattern, callback)
        this.removePendingSubscription(eventPattern, callback)
      }
    }
  }

  // Subscribe to specific resource events
  subscribeToResource(resource, action, callback) {
    const eventPattern = `${resource}:${action}`
    return this.subscribe(eventPattern, callback)
  }

  // Subscribe to all events for a resource, with sensible defaults per resource.
  // Optionally override actions by providing an array of action names.
  subscribeToAllResourceEvents(resource, callback, actionsOverride = null) {
    const defaultActionsByResource = {
      vms: ['create', 'update', 'delete', 'power_on', 'power_off', 'suspend'],
      users: ['create', 'update', 'delete'],
      departments: ['create', 'update', 'delete'],
      applications: ['create', 'update', 'delete']
    }

    const patterns = Array.isArray(actionsOverride) && actionsOverride.length > 0
      ? actionsOverride
      : (defaultActionsByResource[resource] || ['create', 'update', 'delete'])

    const unsubscribeFunctions = []

    patterns.forEach(action => {
      const unsubscribe = this.subscribeToResource(resource, action, (data) => {
        console.log(`📨 Received ${resource}:${action} event`, data)
        callback(action, data)
      })
      unsubscribeFunctions.push(unsubscribe)
    })

    // Return function to unsubscribe from all
    return () => {
      unsubscribeFunctions.forEach(fn => fn())
    }
  }

  // Remove event listener
  removeEventListener(eventPattern, callback) {
    const listeners = this.eventListeners.get(eventPattern)
    if (listeners) {
      listeners.delete(callback)
      if (listeners.size === 0) {
        this.eventListeners.delete(eventPattern)
      }
    }
  }

  // Remove pending subscription
  removePendingSubscription(eventPattern, callback) {
    this.pendingSubscriptions = this.pendingSubscriptions.filter(
      sub => !(sub.eventPattern === eventPattern && sub.callback === callback)
    )
  }

  // Re-subscribe to all events with new namespace
  resubscribeWithNewNamespace(oldNamespace, newNamespace) {
    if (!this.socket || !newNamespace) {
      console.warn('⚠️ Cannot re-subscribe: socket not available or no new namespace')
      return
    }

    console.log(`🔄 Re-subscribing ${this.pendingSubscriptions.length} events with new namespace: ${newNamespace}`)

    // Remove old event listeners that used the old namespace
    this.pendingSubscriptions.forEach(({ eventPattern, callback }) => {
      if (eventPattern.includes(':')) {
        const oldFullEventName = eventPattern.startsWith(oldNamespace)
          ? eventPattern
          : `${oldNamespace}:${eventPattern}`

        // Remove old listener
        this.socket.off(oldFullEventName, callback)
        console.log(`🗑️ Removed old listener: ${oldFullEventName}`)

        // Add new listener with updated namespace
        const newFullEventName = eventPattern.startsWith(newNamespace)
          ? eventPattern
          : `${newNamespace}:${eventPattern}`

        this.socket.on(newFullEventName, (data) => {
          console.log(`📨 Received event: ${newFullEventName}`, data)
          callback(data)
        })
        console.log(`✅ Added new listener: ${newFullEventName}`)
      }
    })

    console.log('🎯 Re-subscription complete')
  }

  // Emit event to server (if needed for bidirectional communication)
  emit(event, data) {
    if (!this.socket?.connected) {
      console.warn(`⚠️ Cannot emit ${event}: not connected`)
      return false
    }

    console.log(`📡 Emitting ${event}:`, data)
    this.socket.emit(event, data)
    return true
  }

  // Get connection info
  getConnectionInfo() {
    return {
      state: this.connectionState,
      isConnected: this.connectionState === ConnectionState.CONNECTED,
      isConnecting: this.connectionState === ConnectionState.CONNECTING,
      isDisconnected: this.connectionState === ConnectionState.DISCONNECTED,
      hasError: this.connectionState === ConnectionState.ERROR,
      namespace: this.userNamespace,
      socketId: this.socket?.id,
      reconnectAttempts: this.reconnectAttempts
    }
  }

  // Get current namespace
  getNamespace() {
    return this.userNamespace
  }

  // Check if connected
  isConnected() {
    return this.connectionState === ConnectionState.CONNECTED && this.socket?.connected
  }
}

// Singleton instance
let socketService = null

export const createSocketService = () => {
  if (!socketService) {
    socketService = new SocketService()
  }
  return socketService
}

export const getSocketService = () => {
  if (!socketService) {
    socketService = new SocketService()
  }
  return socketService
}

export default SocketService
