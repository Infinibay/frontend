import { createContext, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { createRealTimeReduxService } from '@/services/realTimeReduxService'
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

  // Get auth state from Redux
  const { isLoggedIn, token, socketNamespace } = useSelector(state => state.auth)

  useEffect(() => {
    let service = null
    let isCleanedUp = false
    let initializationTimeout = null

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
          initializationTimeout = setTimeout(resolve, 100)
        })

        // Check if we were cleaned up during the delay
        if (isCleanedUp) {
          debug.info('init', 'Initialization cancelled - component was cleaned up')
          return
        }

        // Create the real-time Redux service
        service = createRealTimeReduxService(store)

        // Initialize the service
        await service.initialize()

        // Check again if we were cleaned up during initialization
        if (isCleanedUp) {
          debug.info('init', 'Initialization completed but component was cleaned up - cleaning service')
          service.cleanup()
          return
        }

        setRealTimeService(service)
        setConnectionStatus('connected')
        debug.success('init', 'Real-time service initialized successfully')

      } catch (error) {
        if (!isCleanedUp) {
          console.error('❌ RealTimeProvider: Failed to initialize real-time service:', error)
          setError(error.message)
          setConnectionStatus('error')
        }
      }
    }

    const cleanupRealTime = () => {
      console.log('🧹 RealTimeProvider: Cleaning up real-time service')
      isCleanedUp = true
      
      if (initializationTimeout) {
        clearTimeout(initializationTimeout)
        initializationTimeout = null
      }
      
      if (service) {
        service.cleanup()
        setRealTimeService(null)
      }
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
  }, [isLoggedIn, token, socketNamespace])

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

// Optional connection indicator for development
function RealTimeConnectionIndicator({ status, error }) {
  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-500'
      case 'connecting': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'connected': return '🟢 Real-time Connected'
      case 'connecting': return '🟡 Connecting...'
      case 'error': return '🔴 Connection Error'
      default: return '⚫ Disconnected'
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`px-3 py-1 rounded-full text-xs text-white ${getStatusColor()} shadow-lg`}>
        {getStatusText()}
        {error && (
          <div className="text-xs mt-1 text-red-200">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default RealTimeProvider
