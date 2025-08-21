import { io } from 'socket.io-client'
import { createDebugger } from '@/utils/debug'

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
    this.eventListeners = new Map() // Maps eventPattern -> Set of callbacks
    this.eventHandlers = new Map() // Maps fullEventName -> actual socket handler
    this.userNamespace = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.pendingSubscriptions = [] // Store subscription info for re-subscribing
    this.debug = createDebugger('frontend:realtime:socket')
  }

  // Connect to Socket.io server with authentication
  connect(token, namespace) {
    if (this.socket?.connected) {
      this.debug.warn('connect', 'Already connected to Socket.io server')
      return Promise.resolve()
    }

    // Clean up any existing socket before creating a new one
    if (this.socket) {
      this.debug.info('connect', 'Cleaning up existing socket before reconnecting')
      this.socket.removeAllListeners()
      this.socket.disconnect()
      this.socket = null
    }

    return new Promise((resolve, reject) => {
      this.debug.info('connect', 'Connecting to Socket.io server...', { namespace })

      this.connectionState = ConnectionState.CONNECTING
      this.userNamespace = namespace
      this.pendingSubscriptions = [] // Store subscriptions that need to be re-applied

      // Get backend host, preferring environment variable
      const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST || 'http://localhost:4000'
      this.debug.info('connect', 'Using backend host:', backendHost)

      // Create Socket.io connection
      this.socket = io(backendHost, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true, // Force new connection for namespace changes
        reconnection: true, // Enable auto-reconnection
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000
      })

      // Connection successful
      this.socket.on('connect', () => {
        this.debug.success('connect', 'Connected to Socket.io server:', this.socket.id)
        this.connectionState = ConnectionState.CONNECTED
        this.reconnectAttempts = 0
        resolve()
      })

      // Welcome message with namespace info
      this.socket.on('connected', (data) => {
        this.debug.info('welcome', 'Socket.io welcome:', data.message)
        this.debug.info('welcome', 'Assigned namespace:', data.namespace)

        const oldNamespace = this.userNamespace
        this.userNamespace = data.namespace

        // Update namespace in localStorage if it changed
        if (typeof window !== 'undefined') {
          localStorage.setItem('socketNamespace', data.namespace)
        }

        // If namespace changed, we need to re-subscribe to all events with the new namespace
        if (oldNamespace !== data.namespace) {
          this.debug.info('namespace', `Namespace changed from ${oldNamespace} to ${data.namespace}, re-subscribing to events...`)
          this.resubscribeWithNewNamespace(oldNamespace, data.namespace)
        }
      })

      // Connection error
      this.socket.on('connect_error', (error) => {
        this.debug.error('connect', 'Socket.io connection error:', error.message)
        this.connectionState = ConnectionState.ERROR
        reject(error)
      })

      // Disconnection
      this.socket.on('disconnect', (reason) => {
        this.debug.warn('disconnect', 'Disconnected from Socket.io server:', reason)
        this.connectionState = ConnectionState.DISCONNECTED

        // Auto-reconnect for certain disconnect reasons
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, don't reconnect automatically
          this.debug.warn('disconnect', 'Server disconnected us, not reconnecting automatically')
        } else if (this.reconnectAttempts < this.maxReconnectAttempts) {
          // Client-side disconnect, attempt to reconnect
          this.reconnectAttempts++
          this.debug.info('reconnect', `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
          setTimeout(() => this.reconnect(), 2000 * this.reconnectAttempts)
        }
      })

      // Reconnection events
      this.socket.on('reconnect', (attemptNumber) => {
        this.debug.success('reconnect', `Reconnected after ${attemptNumber} attempts`)
        this.connectionState = ConnectionState.CONNECTED
        this.reconnectAttempts = 0
      })

      this.socket.on('reconnect_failed', () => {
        this.debug.error('reconnect', 'Failed to reconnect to Socket.io server')
        this.connectionState = ConnectionState.ERROR
      })
    })
  }

  // Disconnect from server
  disconnect() {
    if (this.socket) {
      this.debug.info('disconnect', 'Disconnecting from Socket.io server')
      
      // Remove all event handlers from socket
      this.eventHandlers.forEach((handler, eventName) => {
        this.socket.off(eventName, handler)
      })
      
      this.socket.disconnect()
      this.socket = null
      this.connectionState = ConnectionState.DISCONNECTED
      this.userNamespace = null
      this.eventListeners.clear()
      this.eventHandlers.clear()
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
      this.debug.warn('subscribe', `Cannot subscribe to ${eventPattern}: not connected`)
      return () => { } // Return empty unsubscribe function
    }

    this.debug.info('subscribe', `Subscribing to event pattern: ${eventPattern}`)

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

      this.debug.info('subscribe', `Subscribing to event: ${fullEventName} (namespace: ${this.userNamespace})`)
      
      // Check if we already have a handler for this full event name
      let eventHandler = this.eventHandlers.get(fullEventName)
      
      if (!eventHandler) {
        // Create a new handler that will call all callbacks for this event
        eventHandler = (data) => {
          this.debug.log('event', `Received event: ${fullEventName}`, data)
          const callbacks = this.eventListeners.get(eventPattern)
          if (callbacks) {
            callbacks.forEach(cb => {
              try {
                cb(data)
              } catch (error) {
                this.debug.error('event', `Error in callback for ${fullEventName}:`, error)
              }
            })
          }
        }
        
        // Store the handler and register it with socket
        this.eventHandlers.set(fullEventName, eventHandler)
        this.socket.on(fullEventName, eventHandler)
        this.debug.success('subscribe', `Registered new handler for: ${fullEventName}`)
      }

      return () => {
        this.removeEventListener(eventPattern, callback)
        this.removePendingSubscription(eventPattern, callback)
        
        // Only remove the socket handler if no more callbacks exist
        const callbacks = this.eventListeners.get(eventPattern)
        if (!callbacks || callbacks.size === 0) {
          if (this.socket && this.eventHandlers.has(fullEventName)) {
            const handler = this.eventHandlers.get(fullEventName)
            this.socket.off(fullEventName, handler)
            this.eventHandlers.delete(fullEventName)
            this.debug.info('unsubscribe', `Removed handler for: ${fullEventName}`)
          }
        }
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
        this.debug.log('resource-event', `Received ${resource}:${action} event`, data)
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
      this.debug.warn('resubscribe', 'Cannot re-subscribe: socket not available or no new namespace')
      return
    }

    this.debug.info('resubscribe', `Re-subscribing events with new namespace: ${newNamespace}`)

    // Remove all old handlers
    this.eventHandlers.forEach((handler, eventName) => {
      if (eventName.startsWith(oldNamespace)) {
        this.socket.off(eventName, handler)
        this.eventHandlers.delete(eventName)
        this.debug.info('resubscribe', `Removed old handler: ${eventName}`)
      }
    })

    // Re-subscribe with new namespace
    this.eventListeners.forEach((callbacks, eventPattern) => {
      if (eventPattern.includes(':')) {
        const newFullEventName = `${newNamespace}:${eventPattern}`
        
        // Create new handler for this event
        const eventHandler = (data) => {
          this.debug.log('event', `Received event: ${newFullEventName}`, data)
          callbacks.forEach(cb => {
            try {
              cb(data)
            } catch (error) {
              this.debug.error('event', `Error in callback for ${newFullEventName}:`, error)
            }
          })
        }
        
        // Store and register the new handler
        this.eventHandlers.set(newFullEventName, eventHandler)
        this.socket.on(newFullEventName, eventHandler)
        this.debug.success('resubscribe', `Added new handler: ${newFullEventName}`)
      }
    })

    this.debug.success('resubscribe', 'Re-subscription complete')
  }

  // Emit event to server (if needed for bidirectional communication)
  emit(event, data) {
    if (!this.socket?.connected) {
      this.debug.warn('emit', `Cannot emit ${event}: not connected`)
      return false
    }

    this.debug.info('emit', `Emitting ${event}:`, data)
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
