import { useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { createDebugger } from '@/utils/debug'
import { useRealtimeRefetch } from './useRealtimeRefetch'

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
 * @param {boolean} [options.skip=false] - Skip the query entirely
 * @returns {{ isConnected: boolean, isLoading: boolean, lastMessageTime: string|null, error: object|null }}
 */
export const useVmAgentConnection = (vmId, options = {}) => {
  const { skip = false } = options

  const { data, loading, error, refetch } = useQuery(SOCKET_CONNECTION_STATS_QUERY, {
    skip: skip || !vmId,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-and-network'
  })

  // No polling: the backend emits 'agent_connections:update' when this VM's
  // InfiniService agent connects/disconnects — refetch on that instead of a 20s poll.
  useRealtimeRefetch('agent_connections', refetch, {
    actions: ['update'],
    minIntervalMs: 2000,
    skip: skip || !vmId,
    predicate: (_action, event) => event?.data?.vmId === vmId,
  })

  // Apollo Client v4 removed the onError/onCompleted useQuery callbacks, so we
  // log failures by observing the returned `error` instead. Consumers should
  // still surface `error` in the UI.
  useEffect(() => {
    if (error) {
      debug.warn('query-error', 'Failed to fetch socket connection stats:', error.message)
    }
  }, [error])

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
