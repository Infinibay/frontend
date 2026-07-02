import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSocketNamespace } from '@/state/slices/auth'
import { createDebugger } from '@/utils/debug'

const debug = createDebugger('frontend:components:socket-namespace-guard')

/**
 * Component to guard against socket namespace loss in Chrome
 * Chrome sometimes clears localStorage or Redux state unexpectedly
 */
export function SocketNamespaceGuard({ children }) {
  const dispatch = useDispatch()
  const { isLoggedIn, socketNamespace, user } = useSelector(state => state.auth)
  const lastKnownNamespace = useRef(null)
  const checkInterval = useRef(null)

  useEffect(() => {
    // Store the namespace when we have it
    if (socketNamespace) {
      lastKnownNamespace.current = socketNamespace
      debug.info('store', '🔒 SocketNamespaceGuard: Storing namespace:', socketNamespace)
    }
  }, [socketNamespace])

  useEffect(() => {
    if (!isLoggedIn) {
      // Clear interval if user is not logged in
      if (checkInterval.current) {
        clearInterval(checkInterval.current)
        checkInterval.current = null
      }
      return
    }

    // Function to check and restore namespace
    const checkAndRestoreNamespace = () => {
      // Check localStorage
      const storedNamespace = localStorage.getItem('socketNamespace')
      
      // If we're logged in but lost the namespace
      if (isLoggedIn && !socketNamespace) {
        debug.warn('restore', '⚠️ SocketNamespaceGuard: Namespace lost while logged in')
        
        // Try to restore from localStorage first
        if (storedNamespace) {
          debug.success('restore', '✅ SocketNamespaceGuard: Restoring from localStorage:', storedNamespace)
          dispatch(setSocketNamespace(storedNamespace))
        }
        // If not in localStorage but we have a reference, restore it
        else if (lastKnownNamespace.current) {
          debug.success('restore', '✅ SocketNamespaceGuard: Restoring from memory:', lastKnownNamespace.current)
          dispatch(setSocketNamespace(lastKnownNamespace.current))
        }
        // If we have user ID, generate it (fallback). Use the FULL user id:
        // the backend keys namespaces on the complete id to avoid the 32-bit
        // prefix collision risk, so an 8-char prefix would never match.
        else if (user?.id) {
          const generatedNamespace = `user_${user.id}`
          debug.success('generate', '✅ SocketNamespaceGuard: Generating namespace from user ID:', generatedNamespace)
          dispatch(setSocketNamespace(generatedNamespace))
        }
      }

      // Backfill ONLY a MISSING localStorage key — never overwrite it. The
      // server assigns the authoritative namespace on the socket 'connected'
      // welcome and socketService writes it straight to localStorage; redux can
      // lag behind that value, so overwriting here would stomp the server's
      // assignment every interval tick.
      if (socketNamespace && !storedNamespace) {
        debug.log('sync', '🔄 SocketNamespaceGuard: Backfilling missing localStorage namespace')
        localStorage.setItem('socketNamespace', socketNamespace)
      }
    }

    // Check immediately
    checkAndRestoreNamespace()

    // Set up periodic check (every 5 seconds) - Chrome specific workaround
    checkInterval.current = setInterval(checkAndRestoreNamespace, 5000)

    // Cleanup
    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current)
        checkInterval.current = null
      }
    }
  }, [isLoggedIn, socketNamespace, user?.id, dispatch])

  // Also listen for storage events (cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'socketNamespace' && e.newValue && e.newValue !== socketNamespace) {
        debug.log('event', '🔄 SocketNamespaceGuard: Storage event detected, updating namespace:', e.newValue)
        dispatch(setSocketNamespace(e.newValue))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [socketNamespace, dispatch])

  return children
}

export default SocketNamespaceGuard