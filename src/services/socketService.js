import { io } from 'socket.io-client'
import { createDebugger } from '@/utils/debug'

/**
 * Socket Service - Real-time WebSocket communication with backend
 *
 * Usage Examples:
 *
 * 1. Subscribe to specific resource events:
 *    const unsubscribe = socketService.subscribeToResource('scripts', 'schedule_created', (data) => {
 *      console.log('Schedule created:', data)
 *    })
 *    // Event pattern: user_abc123:scripts:schedule_created
 *
 * 2. Subscribe to multiple events for a resource:
 *    const unsubscribe = socketService.subscribeToAllResourceEvents('scripts', (action, data) => {
 *      console.log(`Received ${action} event`, data)
 *    }, ['schedule_created', 'schedule_updated', 'schedule_cancelled'])
 *
 * 3. Cleanup:
 *    unsubscribe() // Call the returned function to unsubscribe
 */

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
    // Truthful reconnect counter: updated from the manager's 'reconnect_attempt'
    // event and reset to 0 on a successful (re)connect. Surfaced via getConnectionInfo().
    this.reconnectAttempts = 0
    this.pendingSubscriptions = [] // Queue of subscriptions requested before the socket existed; flushed on connect
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
      // NOTE: do NOT reset pendingSubscriptions here. Components can subscribe before
      // connect() runs (child effects fire before the provider's connect on a hard
      // reload); those queued subscriptions must survive to be flushed on 'connect'.

      // Get backend host, preferring environment variable
      const backendHost = process.env.NEXT_PUBLIC_BACKEND_HOST || 'http://localhost:4000'
      this.debug.info('connect', 'Using backend host:', backendHost)

      // Create Socket.io connection.
      // Use the FUNCTION form of `auth` so socket.io re-reads the freshest token
      // from localStorage on every (re)connect. This prevents real-time from dying
      // ~1h after login when the access token is rotated (localStorage is updated by
      // the auth refresh flow, but the redux/connect-time token stays stale).
      this.socket = io(backendHost, {
        auth: (cb) => {
          const freshToken = (typeof window !== 'undefined' && localStorage.getItem('token')) || token
          cb({ token: freshToken, namespace })
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: true, // Force new connection for namespace changes
        reconnection: true, // Enable auto-reconnection
        // Retry forever with capped backoff. A finite cap (was 5 ≈ 15-20s) made
        // real-time die permanently after a brief backend outage with no recovery
        // path; socket.io's default is Infinity and the backoff below bounds load.
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000
      })

      // Connection successful
      this.socket.on('connect', () => {
        this.debug.success('connect', 'Connected to Socket.io server:', this.socket.id)
        this.connectionState = ConnectionState.CONNECTED
        this.reconnectAttempts = 0
        // Flush any subscriptions that were requested before the socket existed
        this.flushPendingSubscriptions()
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

        // Flush any subscriptions queued before the socket/namespace was ready
        this.flushPendingSubscriptions()
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

        // Do NOT run a manual reconnect loop here: socket.io's built-in manager
        // (reconnection:true, configured above) already handles transport drops with
        // proper backoff. A second manual loop only conflicts with it.
        if (reason === 'io server disconnect') {
          // Server forcibly disconnected us (e.g. backend restart) — the built-in
          // manager will NOT auto-reconnect in this case, so trigger it explicitly.
          // The auth callback re-reads the freshest token on this new attempt.
          this.debug.warn('disconnect', 'Server disconnected us, reconnecting explicitly')
          if (this.socket) {
            this.socket.connect()
          }
        } else if (reason === 'io client disconnect') {
          // Intentional client teardown (disconnect()) — must not reconnect.
          this.debug.info('disconnect', 'Client-initiated disconnect, not reconnecting')
        } else {
          // Transport-level drop — rely on the built-in manager to reconnect.
          this.debug.info('disconnect', 'Transport drop, relying on built-in reconnection')
        }
      })

      // Reconnection lifecycle events are emitted on the Manager (socket.io), not the
      // Socket. Bind them to this.socket.io or they never fire (socket.io-client v4).
      this.socket.io.on('reconnect_attempt', (attemptNumber) => {
        // Keep the counter truthful so getConnectionInfo().reconnectAttempts reflects
        // reality (a stale-data banner can read this to show retry progress).
        this.reconnectAttempts = attemptNumber
        this.debug.info('reconnect', `Reconnection attempt ${attemptNumber}`)
      })

      this.socket.io.on('reconnect', (attemptNumber) => {
        this.debug.success('reconnect', `Reconnected after ${attemptNumber} attempts`)
        this.connectionState = ConnectionState.CONNECTED
        this.reconnectAttempts = 0
      })

      this.socket.io.on('reconnect_failed', () => {
        // With reconnectionAttempts:Infinity this should not normally fire, but if it
        // ever does, surface the error state and schedule a fresh manual retry so
        // real-time is never left permanently dead.
        this.debug.error('reconnect', 'Failed to reconnect to Socket.io server, scheduling manual retry')
        this.connectionState = ConnectionState.ERROR
        if (this.socket) {
          this.socket.connect()
        }
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

  // Resolve the namespaced socket event name for a pattern using the CURRENT
  // namespace. Used both when registering handlers and when tearing them down, so
  // cleanup always targets the active handler even after a namespace reassignment.
  resolveFullEventName(eventPattern) {
    if (this.userNamespace && eventPattern.includes(':')) {
      return eventPattern.startsWith(this.userNamespace)
        ? eventPattern
        : `${this.userNamespace}:${eventPattern}`
    }
    return eventPattern
  }

  // Subscribe to events with pattern matching
  subscribe(eventPattern, callback) {
    if (!this.socket) {
      // The socket has not been created yet (e.g. a component mounts and subscribes
      // before RealTimeProvider finishes connecting on a hard reload). Queue the
      // request and replay it on 'connect' / namespace assignment instead of dropping it.
      this.debug.info('subscribe', `Socket not ready, queuing subscription: ${eventPattern}`)
      const pending = { eventPattern, callback, realUnsubscribe: null, cancelled: false }
      this.pendingSubscriptions.push(pending)

      // Return an unsubscribe that works whether or not the queue has been flushed yet
      return () => {
        pending.cancelled = true
        this.pendingSubscriptions = this.pendingSubscriptions.filter(p => p !== pending)
        if (pending.realUnsubscribe) {
          pending.realUnsubscribe()
          pending.realUnsubscribe = null
        }
      }
    }

    this.debug.info('subscribe', `Subscribing to event pattern: ${eventPattern}`)

    // Store listener for cleanup
    if (!this.eventListeners.has(eventPattern)) {
      this.eventListeners.set(eventPattern, new Set())
    }
    this.eventListeners.get(eventPattern).add(callback)

    // For namespace-specific events, listen for the full event name
    if (this.userNamespace && eventPattern.includes(':')) {
      const fullEventName = this.resolveFullEventName(eventPattern)

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

        // Only remove the socket handler if no more callbacks exist.
        // Recompute the full event name from the CURRENT namespace: after a
        // namespace reassignment the active handler is keyed by the new namespace,
        // so the fullEventName captured at subscribe time would miss it and leak.
        const callbacks = this.eventListeners.get(eventPattern)
        if (!callbacks || callbacks.size === 0) {
          const currentFullEventName = this.resolveFullEventName(eventPattern)
          if (this.socket && this.eventHandlers.has(currentFullEventName)) {
            const handler = this.eventHandlers.get(currentFullEventName)
            this.socket.off(currentFullEventName, handler)
            this.eventHandlers.delete(currentFullEventName)
            this.debug.info('unsubscribe', `Removed handler for: ${currentFullEventName}`)
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
      }
    }
  }

  // Replay subscriptions that were requested before the socket existed.
  // Called on 'connect' and after namespace assignment.
  flushPendingSubscriptions() {
    if (!this.socket || this.pendingSubscriptions.length === 0) {
      return
    }

    const queued = this.pendingSubscriptions
    this.pendingSubscriptions = []
    this.debug.info('subscribe', `Flushing ${queued.length} queued subscription(s)`)

    queued.forEach(pending => {
      if (pending.cancelled) {
        return
      }
      // Establish the real subscription now and remember its unsubscribe so a late
      // unsubscribe() call (from the queued handle) still tears it down.
      pending.realUnsubscribe = this.subscribe(pending.eventPattern, pending.callback)
    })
  }

  /**
   * Subscribe to specific resource events
   *
   * @param {string} resource - The resource name (e.g., 'scripts', 'vms', 'users')
   * @param {string} action - The action/event name (e.g., 'schedule_created', 'power_on')
   * @param {Function} callback - Callback function to handle the event
   * @returns {Function} Unsubscribe function - call this to stop listening
   *
   * @example
   * const unsubscribe = socketService.subscribeToResource('scripts', 'schedule_created', (data) => {
   *   console.log('Schedule created:', data)
   *   // data.status: 'success' | 'error'
   *   // data.data: { eventType, scriptId, executionIds, ... }
   *   // data.timestamp: ISO string
   * })
   *
   * // Later, to unsubscribe:
   * unsubscribe()
   *
   * Event Pattern: {userNamespace}:{resource}:{action}
   * Example: user_abc123:scripts:schedule_created
   */
  subscribeToResource(resource, action, callback) {
    const eventPattern = `${resource}:${action}`
    return this.subscribe(eventPattern, callback)
  }

  /**
   * Subscribe to multiple events for a resource with a single callback
   *
   * @param {string} resource - The resource name (e.g., 'scripts', 'vms')
   * @param {Function} callback - Callback function (action, data) => void
   * @param {Array<string>} actionsOverride - Optional array of actions to subscribe to.
   *                                          If not provided, uses default actions for the resource.
   * @returns {Function} Unsubscribe function - call this to stop listening to all subscribed events
   *
   * @example
   * const unsubscribe = socketService.subscribeToAllResourceEvents(
   *   'scripts',
   *   (action, data) => {
   *     switch (action) {
   *       case 'schedule_created':
   *         console.log('Schedule created:', data)
   *         break
   *       case 'schedule_updated':
   *         console.log('Schedule updated:', data)
   *         break
   *       case 'schedule_cancelled':
   *         console.log('Schedule cancelled:', data)
   *         break
   *     }
   *   },
   *   ['schedule_created', 'schedule_updated', 'schedule_cancelled']
   * )
   *
   * // Later, to unsubscribe from all:
   * unsubscribe()
   *
   * Default actions by resource:
   * - vms: ['create', 'update', 'delete', 'power_on', 'power_off', 'suspend']
   * - users: ['create', 'update', 'delete']
   * - departments: ['create', 'update', 'delete']
   * - applications: ['create', 'update', 'delete']
   */
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
        const newFullEventName = eventPattern.startsWith(newNamespace)
          ? eventPattern
          : `${newNamespace}:${eventPattern}`

        // Create new handler for this event. Do a LIVE lookup of the current
        // callbacks Set (matching subscribe()) instead of capturing the Set that
        // exists now: a later unsubscribe of the last callback replaces/empties the
        // stored Set, and future subscribe()s create a brand-new Set. Capturing the
        // stale Set would leave this handler firing an orphaned Set while new
        // subscribers silently receive nothing.
        const eventHandler = (data) => {
          this.debug.log('event', `Received event: ${newFullEventName}`, data)
          const currentCallbacks = this.eventListeners.get(eventPattern)
          if (currentCallbacks) {
            currentCallbacks.forEach(cb => {
              try {
                cb(data)
              } catch (error) {
                this.debug.error('event', `Error in callback for ${newFullEventName}:`, error)
              }
            })
          }
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
