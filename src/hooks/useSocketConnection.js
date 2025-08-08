import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getRealTimeReduxService } from '@/services/realTimeReduxService'
import { createDebugger } from '@/utils/debug'

// Create debug instance for socket connection hook
const debug = createDebugger('frontend:hooks:socketConnection')

// Hook to manage Socket.io connection and real-time Redux integration
export const useSocketConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [error, setError] = useState(null)
  const [realTimeService, setRealTimeService] = useState(null)

  // Get auth state from Redux
  const { isLoggedIn, token, socketNamespace } = useSelector(state => state.auth)

  useEffect(() => {
    let service = null

    const initializeRealTime = async () => {
      if (!isLoggedIn || !token || !socketNamespace) {
        debug.warn('init', 'Not ready for real-time connection:', { isLoggedIn, hasToken: !!token, hasNamespace: !!socketNamespace })
        return
      }

      try {
        setConnectionStatus('connecting')
        setError(null)

        // Get or create the real-time service
        try {
          service = getRealTimeReduxService()
        } catch (e) {
          // Service doesn't exist yet, it will be created in the layout
          debug.warn('init', 'Real-time service not yet available, will retry...')
          return
        }

        // Initialize the service
        await service.initialize()

        setRealTimeService(service)
        setConnectionStatus('connected')
        debug.success('init', 'Socket connection hook: Real-time service initialized')

      } catch (error) {
        console.error('❌ Socket connection hook: Failed to initialize real-time service:', error)
        setError(error.message)
        setConnectionStatus('error')
      }
    }

    const cleanupRealTime = () => {
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

  // Get connection info
  const getConnectionInfo = () => {
    if (!realTimeService) {
      return {
        status: connectionStatus,
        isConnected: false,
        error,
        socketInfo: null
      }
    }

    const serviceStatus = realTimeService.getStatus()
    return {
      status: connectionStatus,
      isConnected: connectionStatus === 'connected' && serviceStatus.socketInfo.isConnected,
      error,
      socketInfo: serviceStatus.socketInfo,
      subscriptionCount: serviceStatus.subscriptionCount
    }
  }

  return {
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    isConnecting: connectionStatus === 'connecting',
    hasError: connectionStatus === 'error',
    error,
    realTimeService,
    getConnectionInfo
  }
}

export default useSocketConnection
