import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSocketNamespace } from '@/state/slices/auth'

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
      console.log('🔒 SocketNamespaceGuard: Storing namespace:', socketNamespace)
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
        console.warn('⚠️ SocketNamespaceGuard: Namespace lost while logged in')
        
        // Try to restore from localStorage first
        if (storedNamespace) {
          console.log('✅ SocketNamespaceGuard: Restoring from localStorage:', storedNamespace)
          dispatch(setSocketNamespace(storedNamespace))
        }
        // If not in localStorage but we have a reference, restore it
        else if (lastKnownNamespace.current) {
          console.log('✅ SocketNamespaceGuard: Restoring from memory:', lastKnownNamespace.current)
          dispatch(setSocketNamespace(lastKnownNamespace.current))
        }
        // If we have user ID, generate it (fallback)
        else if (user?.id) {
          const generatedNamespace = `user_${user.id.substring(0, 8)}`
          console.log('✅ SocketNamespaceGuard: Generating namespace from user ID:', generatedNamespace)
          dispatch(setSocketNamespace(generatedNamespace))
        }
      }
      
      // Also ensure localStorage is in sync
      if (socketNamespace && storedNamespace !== socketNamespace) {
        console.log('🔄 SocketNamespaceGuard: Syncing localStorage with Redux state')
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
        console.log('🔄 SocketNamespaceGuard: Storage event detected, updating namespace:', e.newValue)
        dispatch(setSocketNamespace(e.newValue))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [socketNamespace, dispatch])

  return children
}

export default SocketNamespaceGuard