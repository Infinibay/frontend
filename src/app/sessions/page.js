'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import {
  Page,
  Alert,
  Badge,
  Button,
  DataTable,
  EmptyState,
  ResponsiveStack,
  Skeleton,
  StatusDot } from
'@infinibay/harbor';
import { PlugZap, RefreshCw } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { fetchVms } from '@/state/slices/vms';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';

const SOCKET_CONNECTION_STATS_QUERY = gql`
  query SessionsSocketConnectionStats {
    socketConnectionStats {
      totalConnections
      activeConnections
      connections {
        vmId
        isConnected
        reconnectAttempts
        lastMessageTime
        keepAlive {
          averageRtt
          successRate
          consecutiveFailures
        }
      }
    }
  }
`;

function timeAgo(iso) {
  if (!iso) return '-';
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return '-';
  const mins = Math.max(0, Math.round(ms / 60000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function SessionsListPage() {
  const router = useRouter();
  const {
    data,
    loading,
    error,
    refetch
  } = useQuery(SOCKET_CONNECTION_STATS_QUERY, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 20_000
  });

  const {
    data: machines,
    isLoading: vmsLoading
  } = useEnsureData('vms', fetchVms, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 30 * 1000,
    transform: (payload) => payload.items || payload || []
  });

  const rows = useMemo(() => {
    const byId = new Map((machines || []).map((vm) => [vm.id, vm]));
    const connections = data?.socketConnectionStats?.connections || [];
    return connections.map((connection) => {
      const vm = byId.get(connection.vmId);
      return {
        id: connection.vmId,
        vmId: connection.vmId,
        desktopName: vm?.name || connection.vmId,
        department: vm?.department?.name || '-',
        vmStatus: vm?.status || '-',
        isConnected: connection.isConnected,
        lastMessageTime: connection.lastMessageTime,
        reconnectAttempts: connection.reconnectAttempts,
        averageRtt: connection.keepAlive?.averageRtt,
        successRate: connection.keepAlive?.successRate,
        consecutiveFailures: connection.keepAlive?.consecutiveFailures
      };
    });
  }, [data, machines]);

  const columns = useMemo(
    () => [
    {
      id: 'desktop',
      header: 'Desktop',
      cell: ({ row }) =>
      <ResponsiveStack direction="row" gap={2} align="center">
            <StatusDot status={row.isConnected ? 'online' : 'offline'} size={8} />
            <ResponsiveStack direction="col" gap={0}>
              <span className="font-medium">{row.desktopName}</span>
              <span className="text-fg-muted text-xs font-mono">{row.vmId}</span>
            </ResponsiveStack>
          </ResponsiveStack>

    },
    {
      id: 'department',
      header: 'Department',
      width: 140,
      cell: ({ row }) => <span className="text-sm text-fg-muted">{row.department}</span>
    },
    {
      id: 'vmStatus',
      header: 'VM status',
      width: 120,
      cell: ({ row }) => <Badge tone="neutral">{row.vmStatus}</Badge>
    },
    {
      id: 'lastMessageTime',
      header: 'Last message',
      width: 130,
      cell: ({ row }) => <span className="font-mono text-xs">{timeAgo(row.lastMessageTime)}</span>
    },
    {
      id: 'reconnectAttempts',
      header: 'Reconnects',
      width: 100,
      align: 'right',
      cell: ({ row }) => <span className="font-mono text-xs">{row.reconnectAttempts}</span>
    },
    {
      id: 'averageRtt',
      header: 'RTT',
      width: 90,
      align: 'right',
      cell: ({ row }) =>
      <span
        className={[
        'font-mono text-xs',
        row.averageRtt > 60 ? 'text-warning' : ''].
        join(' ')}>
        
            {row.averageRtt == null ? '-' : `${Math.round(row.averageRtt)} ms`}
          </span>

    }],

    []
  );

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PageHeader
          title="Sessions"
          count={`${data?.socketConnectionStats?.activeConnections || 0} agent connection${data?.socketConnectionStats?.activeConnections === 1 ? '' : 's'}`}
          description="Live InfiniService agent connections. User desktop session control is not implemented yet."
          secondary={
          <Button variant="secondary" onClick={() => refetch()} disabled={loading || vmsLoading}>
              <RefreshCw size={14} />
              Refresh
            </Button>
          } />

        {loading && rows.length === 0 ?
        <ResponsiveStack direction="col" gap={3}>
            <Skeleton height={130} />
            <Skeleton height={180} />
          </ResponsiveStack> :
        null}

        {error && rows.length === 0 ?
        <EmptyState
          icon={<PlugZap size={22} />}
          title="Connection stats unavailable"
          description={error.message || 'The backend socket watcher did not return VM agent connection data.'}
          actions={
          <Button variant="secondary" onClick={() => refetch()} disabled={loading}>
                <RefreshCw size={14} />
                Retry
              </Button>
          } /> :
        null}

        {error && rows.length > 0 ?
        <Alert
          tone="warning"
          title="Live data may be stale"
          actions={
          <Button size="sm" variant="secondary" onClick={() => refetch()} disabled={loading}>
                <RefreshCw size={14} />
                Retry
              </Button>
          }>
            The latest connection-stats poll failed{error.message ? ` — ${error.message}` : ''}. Showing the last successful data.
          </Alert> :
        null}

        {rows.length > 0 ?
        <DataTable
          rows={rows}
          columns={columns}
          rowId={(r) => r.id}
          onRowClick={(row) => router.push(`/sessions/${row.id}`)}
          defaultDensity="compact" /> :
        !loading && !error ?
        <EmptyState
          icon={<PlugZap size={22} />}
          title="No active agent connections"
          description="Running VMs will appear here when InfiniService connects through the virtio socket." /> :
        null}
        
      </ResponsiveStack>
    </Page>);

}
