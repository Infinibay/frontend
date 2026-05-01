import { useMemo } from 'react'
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { createDebugger } from '@/utils/debug'

const debug = createDebugger('frontend:hooks:useVmAgentConnection')

const SOCKET_CONNECTION_STATS_QUERY = gql`
  query SocketConnectionStats {
    socketConnectionStats {
      connections {
        vmId
        isConnected
        lastMessageTime
        reconnectAttempts
      }
      totalConnections
      activeConnections
    }
  }
`

/**
 * Hook to check if the infiniservice agent inside a specific VM is connected
 * via the VirtioSocketWatcher. This indicates both that the VM is running
 * AND that the guest agent is reachable.
 *
 * @param {string} vmId - The VM ID to check connection status for
 * @param {object} [options] - Options
 * @param {number} [options.pollInterval=20000] - Polling interval in ms (default 20s)
 * @param {boolean} [options.skip=false] - Skip the query entirely
 * @returns {{ isConnected: boolean, isLoading: boolean, lastMessageTime: string|null, error: object|null }}
 */
export const useVmAgentConnection = (vmId, options = {}) => {
  const { pollInterval = 20000, skip = false } = options

  const { data, loading, error } = useQuery(SOCKET_CONNECTION_STATS_QUERY, {
    pollInterval,
    skip: skip || !vmId,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-and-network',
    onError: (err) => {
      debug.warn('query-error', 'Failed to fetch socket connection stats:', err.message)
    }
  })

  const connectionInfo = useMemo(() => {
    if (!data?.socketConnectionStats?.connections) {
      return { isConnected: false, lastMessageTime: null }
    }

    const vmConnection = data.socketConnectionStats.connections.find(
      (conn) => conn.vmId === vmId
    )

    if (!vmConnection) {
      return { isConnected: false, lastMessageTime: null }
    }

    return {
      isConnected: vmConnection.isConnected === true,
      lastMessageTime: vmConnection.lastMessageTime || null
    }
  }, [data, vmId])

  return {
    isConnected: connectionInfo.isConnected,
    isLoading: loading,
    lastMessageTime: connectionInfo.lastMessageTime,
    error: error || null
  }
}

export default useVmAgentConnection
