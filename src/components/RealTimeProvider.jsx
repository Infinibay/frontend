import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { createRealTimeReduxService } from '@/services/realTimeReduxService'
import { getSocketService } from '@/services/socketService'
import { store } from '@/state/store'
import { createDebugger } from '@/utils/debug'

// Real-time context
const RealTimeContext = createContext(null)

// Real-Time Provider Component
// Create debug instance for RealTimeProvider
const debug = createDebugger('frontend:realtime:provider')

export function RealTimeProvider({ children }) {
  const [realTimeService, setRealTimeService] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [error, setError] = useState(null)

  // Monotonic generation counter shared across effect runs. The real-time
  // service is a module singleton, so a stale async init from a superseded
  // effect run must NOT tear down the singleton the current run owns. Each run
  // captures its generation; only the run whose generation is still current is
  // allowed to clean up the shared service.
  const generationRef = useRef(0)

  // Get auth state from Redux
  const { isLoggedIn, token, socketNamespace } = useSelector(state => state.auth)

  useEffect(() => {
    const myGeneration = ++generationRef.current
    let service = null
    let isCleanedUp = false
    let initializationTimeout = null
    let resolveDelay = null
    let retryCleanup = null
    let lifecycleCleanup = null

    // This run still owns the singleton iff it hasn't been locally cleaned up
    // AND no newer effect run has bumped the generation past ours.
    const isCurrentOwner = () => !isCleanedUp && generationRef.current === myGeneration

    // A failed FIRST connect rejects the connect promise, so subscribeToEvents()
    // never runs — yet socket.io's manager keeps retrying and may connect
    // seconds later. Without this, real-time would stay permanently dead. When
    // the socket (re)connects after such a failure, re-run initialize(): the
    // service's isInitialized flag is false (it threw), and connect() resolves
    // immediately for an already-connected socket, so subscriptions register.
    const armReconnectRetry = () => {
      if (retryCleanup) return
      const sock = getSocketService().socket
      if (!sock) return

      const onReconnected = async () => {
        if (!isCurrentOwner()) return
        debug.info('retry', 'Socket (re)connected after earlier failure — retrying real-time init')
        try {
          await service.initialize()
          if (!isCurrentOwner()) {
            service.cleanup()
            return
          }
          setRealTimeService(service)
          setConnectionStatus('connected')
          setError(null)
          armLifecycleListeners()
          debug.success('retry', 'Real-time service recovered after reconnect')
        } catch (retryError) {
          if (isCurrentOwner()) {
            debug.error('retry', 'Real-time init retry failed:', retryError)
          }
        }
      }

      sock.on('connect', onReconnected)
      sock.io.on('reconnect', onReconnected)
      retryCleanup = () => {
        sock.off('connect', onReconnected)
        sock.io.off('reconnect', onReconnected)
        retryCleanup = null
      }
    }

    // After a SUCCESSFUL init, keep connectionStatus honest for the rest of the
    // session by mirroring the socket's lifecycle into React state. socket.io's
    // manager auto-reconnects (reconnection:true), so subscriptions registered
    // on this socket instance survive a transient drop; we only need to reflect
    // the transport state so consumers of the context (isConnected/isConnecting/
    // hasError) don't read a frozen 'connected'.
    const armLifecycleListeners = () => {
      if (lifecycleCleanup) return
      const sock = getSocketService().socket
      if (!sock) return

      const onDisconnect = (reason) => {
        if (!isCurrentOwner()) return
        debug.warn('lifecycle', 'Socket disconnected — reconnecting:', reason)
        // Manager will attempt to reconnect; surface the degraded state.
        setConnectionStatus('connecting')
      }
      const onReconnect = () => {
        if (!isCurrentOwner()) return
        debug.success('lifecycle', 'Socket reconnected')
        setConnectionStatus('connected')
        setError(null)
      }
      const onReconnectFailed = () => {
        if (!isCurrentOwner()) return
        debug.error('lifecycle', 'Socket reconnection failed — real-time degraded')
        setConnectionStatus('error')
        setError('Real-time connection lost')
      }

      sock.on('disconnect', onDisconnect)
      sock.io.on('reconnect', onReconnect)
      sock.io.on('reconnect_failed', onReconnectFailed)
      lifecycleCleanup = () => {
        sock.off('disconnect', onDisconnect)
        sock.io.off('reconnect', onReconnect)
        sock.io.off('reconnect_failed', onReconnectFailed)
        lifecycleCleanup = null
      }
    }

    const initializeRealTime = async () => {
      if (!isLoggedIn || !token || !socketNamespace) {
        debug.warn('init', 'Not ready for connection:', {
          isLoggedIn,
          hasToken: !!token,
          hasNamespace: !!socketNamespace
        })
        return
      }

      try {
        debug.info('init', 'Initializing real-time service...')
        setConnectionStatus('connecting')
        setError(null)

        // Add a small delay to avoid rapid connect/disconnect in React Strict Mode
        await new Promise(resolve => {
          resolveDelay = resolve
          initializationTimeout = setTimeout(resolve, 100)
        })

        // Check if we were cleaned up (or superseded) during the delay
        if (!isCurrentOwner()) {
          debug.info('init', 'Initialization cancelled - run was cleaned up or superseded')
          return
        }

        // Create the real-time Redux service
        service = createRealTimeReduxService(store)

        // Initialize the service
        await service.initialize()

        // Check again after the async init. If a NEWER effect run has taken
        // ownership of the singleton, do NOT clean up — that would disconnect
        // the live socket the newer run just wired up. Only tear down when this
        // run was cleaned up AND is still the current generation.
        if (!isCurrentOwner()) {
          if (isCleanedUp && generationRef.current === myGeneration) {
            debug.info('init', 'Init completed but run was cleaned up - cleaning service')
            service.cleanup()
          } else {
            debug.info('init', 'Init completed but run was superseded - leaving singleton to current owner')
          }
          return
        }

        setRealTimeService(service)
        setConnectionStatus('connected')
        armLifecycleListeners()
        debug.success('init', 'Real-time service initialized successfully')

      } catch (error) {
        if (isCurrentOwner()) {
          debug.error('init', 'Failed to initialize real-time service:', error)
          setError(error.message)
          setConnectionStatus('error')
          // Keep the service reference so the reconnect retry can re-init it.
          if (!service) service = createRealTimeReduxService(store)
          armReconnectRetry()
        }
      }
    }

    const cleanupRealTime = () => {
      debug.info('cleanup', '🧹 RealTimeProvider: Cleaning up real-time service')
      isCleanedUp = true

      if (initializationTimeout) {
        clearTimeout(initializationTimeout)
        initializationTimeout = null
      }
      // Settle the StrictMode delay promise so its async frame doesn't hang
      // pending forever after we clear the timer.
      if (resolveDelay) {
        resolveDelay()
        resolveDelay = null
      }

      if (retryCleanup) {
        retryCleanup()
      }

      if (lifecycleCleanup) {
        lifecycleCleanup()
      }

      // Only tear down the shared singleton if this run is still the current
      // owner. If a newer run has already taken over, leave it alone.
      if (service && generationRef.current === myGeneration) {
        service.cleanup()
      }
      setRealTimeService(null)
      setConnectionStatus('disconnected')
      setError(null)
    }

    if (isLoggedIn && token && socketNamespace) {
      initializeRealTime()
    } else {
      cleanupRealTime()
    }

    // Cleanup on unmount or auth changes
    return () => {
      cleanupRealTime()
    }
    // NOTE: `token` is intentionally NOT a dependency. A silent access-token
    // rotation (refreshAccessToken -> setTokens, ~hourly) changes state.auth.token
    // WITHOUT changing isLoggedIn/socketNamespace. If token were a dep, every
    // rotation would tear the service down (socketService.disconnect() clears ALL
    // event handlers, orphaning component-level subscriptions until those
    // components remount). An already-connected/authed socket does not need to
    // re-handshake on a silent refresh, and the socket's `auth` callback
    // (socketService.js) re-reads the freshest token from localStorage on any
    // genuine transport reconnect — so realtime survives the rotation. The effect
    // still initializes on login (isLoggedIn) and re-inits on namespace change
    // (socketNamespace); when isLoggedIn flips true a current token is already in
    // state (see auth slice fetchCurrentUser.fulfilled), so the captured token is fresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, socketNamespace])

  // Context value
  const contextValue = {
    realTimeService,
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    isConnecting: connectionStatus === 'connecting',
    hasError: connectionStatus === 'error',
    error,
    getStatus: () => {
      if (!realTimeService) {
        return {
          isInitialized: false,
          socketInfo: { isConnected: false },
          subscriptionCount: 0
        }
      }
      return realTimeService.getStatus()
    }
  }

  return (
    <RealTimeContext.Provider value={contextValue}>
      {children}

    </RealTimeContext.Provider>
  )
}

// Hook to use real-time context
export function useRealTimeContext() {
  const context = useContext(RealTimeContext)
  if (!context) {
    throw new Error('useRealTimeContext must be used within a RealTimeProvider')
  }
  return context
}

export default RealTimeProvider
