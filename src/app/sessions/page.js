'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Page,
  Alert,
  Badge,
  Button,
  DataTable,
  Dialog,
  EmptyState,
  IconButton,
  ResponsiveStack,
  SegmentedControl,
  Skeleton,
  StatusDot,
  TextField } from
'@infinibay/harbor';
import { Activity, Monitor, PlugZap, RefreshCw, Search, Unplug } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { fetchVms } from '@/state/slices/vms';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';
import { useOpenConsole } from '@/hooks/useOpenConsole';
import {
  useSessionsConnectionStatsQuery,
  useConsoleSessionsQuery,
  useEndConsoleSessionMutation } from
'@/gql/hooks';
import {
  buildSessionRows,
  fmtRtt,
  fmtSuccess,
  QUALITY_META,
  rowInView,
  rowMatches,
  timeAgo } from
'./_helpers';

// Calm, static KPI tile — no count-up animation, so live socket refetches don't
// re-animate the numbers from zero on every fleet change.
function Kpi({ label, value, tone = 'default', icon }) {
  const toneClass =
  tone === 'danger' ?
  'text-danger' :
  tone === 'warning' ?
  'text-warning' :
  tone === 'accent' ?
  'text-accent' :
  'text-fg';
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-surface-1 p-4 shadow-harbor-md">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-fg-subtle">
        {icon}
        {label}
      </div>
      <div className={`text-3xl font-semibold tabular-nums ${toneClass}`}>{value}</div>
    </div>);

}

const VIEW_ITEMS = [
{ value: 'all', label: 'All' },
{ value: 'online', label: 'Healthy' },
{ value: 'degraded', label: 'Degraded' },
{ value: 'offline', label: 'Offline' },
{ value: 'inuse', label: 'In use' }];


export default function SessionsListPage() {
  const router = useRouter();
  const openConsole = useOpenConsole();

  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useSessionsConnectionStatsQuery({ fetchPolicy: 'cache-and-network' });

  const { data: consoleData, refetch: refetchConsole } = useConsoleSessionsQuery({
    fetchPolicy: 'cache-and-network'
  });

  const [endConsoleSession] = useEndConsoleSessionMutation();

  const {
    data: machines,
    isLoading: vmsLoading
  } = useEnsureData('vms', fetchVms, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 30 * 1000,
    transform: (payload) => payload.items || payload || []
  });

  // No polling: the backend emits 'agent_connections:update' when any agent
  // connects/disconnects. Refetch both the transport stats and the console relay
  // list on that event — console relays have no dedicated socket signal, so they
  // ride the same tick (plus an explicit refetch after we end one).
  const refetchAll = useCallback(() => {
    refetchStats();
    refetchConsole();
  }, [refetchStats, refetchConsole]);
  useRealtimeRefetch('agent_connections', refetchAll, { actions: ['update'], minIntervalMs: 2000 });

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [endTarget, setEndTarget] = useState(null); // { vmId, name } | null
  const [ending, setEnding] = useState(false);

  const rows = useMemo(
    () =>
    buildSessionRows({
      connections: statsData?.socketConnectionStats?.connections || [],
      consoleSessions: consoleData?.consoleSessions || [],
      machines
    }),
    [statsData, consoleData, machines]
  );

  const kpis = useMemo(() => {
    let online = 0,degraded = 0,offline = 0,inUse = 0;
    for (const r of rows) {
      if (r.quality === 'online') online++;else
      if (r.quality === 'degraded') degraded++;else
      offline++;
      if (r.console?.connected) inUse++;
    }
    return { online, degraded, offline, inUse };
  }, [rows]);

  const visibleRows = useMemo(
    () => rows.filter((r) => rowMatches(r, query) && rowInView(r, filter)),
    [rows, query, filter]
  );

  const runEndConsole = useCallback(
    async (vmId) => {
      setEnding(true);
      try {
        await endConsoleSession({ variables: { vmId } });
        await refetchConsole();
        toast.success('Console session ended');
      } catch (err) {
        toast.error('Could not end console session', {
          description: err?.message || 'The relay may already be closed.'
        });
      } finally {
        setEnding(false);
        setEndTarget(null);
      }
    },
    [endConsoleSession, refetchConsole]
  );

  const columns = useMemo(
    () => [
    {
      id: 'desktop',
      header: 'Desktop',
      cell: ({ row }) => {
        const meta = QUALITY_META[row.quality];
        return (
          <ResponsiveStack direction="row" gap={2} align="center">
              <StatusDot status={meta.status} size={9} labelOverride={meta.label} />
              <ResponsiveStack direction="col" gap={0}>
                <span className="font-medium">{row.desktopName}</span>
                <span className="text-fg-subtle text-xs font-mono">{row.vmId}</span>
              </ResponsiveStack>
            </ResponsiveStack>);

      }
    },
    {
      id: 'department',
      header: 'Department',
      width: 140,
      cell: ({ row }) => <span className="text-sm text-fg-muted">{row.department}</span>
    },
    {
      id: 'link',
      header: 'Agent link',
      width: 150,
      cell: ({ row }) => {
        if (!row.isConnected) {
          return <span className="text-fg-subtle text-xs">Offline</span>;
        }
        const slow = row.quality === 'degraded';
        return (
          <div className="flex flex-col">
              <span className={`font-mono text-xs ${slow ? 'text-warning' : 'text-fg'}`}>
                {fmtRtt(row.averageRtt)}
              </span>
              <span className="text-fg-subtle text-[11px]">{fmtSuccess(row.successRate)} ok</span>
            </div>);

      }
    },
    {
      id: 'reconnects',
      header: 'Reconnects',
      width: 100,
      align: 'end',
      cell: ({ row }) =>
      <span className={`font-mono text-xs ${row.reconnectAttempts > 0 ? 'text-warning' : 'text-fg-muted'}`}>
            {row.reconnectAttempts}
          </span>

    },
    {
      id: 'console',
      header: 'Console',
      width: 150,
      cell: ({ row }) => {
        if (row.console?.connected) {
          return (
            <Badge tone="info">
                In use · {row.console.channels} ch
              </Badge>);

        }
        if (row.console) {
          return <Badge tone="neutral">Idle relay</Badge>;
        }
        return <span className="text-fg-subtle text-xs">—</span>;
      }
    },
    {
      id: 'lastMessage',
      header: 'Last message',
      width: 120,
      cell: ({ row }) => <span className="font-mono text-xs text-fg-muted">{timeAgo(row.lastMessageTime)}</span>
    },
    {
      id: 'actions',
      header: '',
      width: 88,
      align: 'end',
      cell: ({ row }) =>
      <div className="flex items-center justify-end gap-1">
            <IconButton
          size="sm"
          variant="ghost"
          label={`Open console for ${row.desktopName}`}
          icon={<Monitor size={14} />}
          onClick={(e) => {
            e.stopPropagation();
            openConsole(row.vm || { id: row.vmId, name: row.desktopName });
          }} />

            {row.console ?
        <IconButton
          size="sm"
          variant="ghost"
          label={`End console session for ${row.desktopName}`}
          icon={<Unplug size={14} />}
          onClick={(e) => {
            e.stopPropagation();
            setEndTarget({ vmId: row.vmId, name: row.desktopName });
          }} /> :

        null}
          </div>

    }],

    [openConsole]
  );

  const activeConsoles = kpis.inUse;
  const hasError = !!statsError;

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PageHeader
          title="Sessions"
          count={`${activeConsoles} live console${activeConsoles === 1 ? '' : 's'}`}
          description="Live desktop connections — each desktop's agent link (health) and its console session (SPICE/VNC relay) across the fleet."
          secondary={
          <Button variant="secondary" onClick={refetchAll} disabled={statsLoading || vmsLoading}>
              <RefreshCw size={14} />
              Refresh
            </Button>
          } />

        {/* KPI summary — real fleet counts, calm (no re-animating tiles) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Kpi label="Healthy" value={kpis.online} tone="accent" icon={<Activity size={13} />} />
          <Kpi label="Degraded" value={kpis.degraded} tone={kpis.degraded ? 'warning' : 'default'} />
          <Kpi label="Offline" value={kpis.offline} tone={kpis.offline ? 'danger' : 'default'} />
          <Kpi label="In use" value={kpis.inUse} icon={<Monitor size={13} />} />
        </div>

        {/* Toolbar — search + view filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-xs">
            <TextField
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search desktop, department, or ID…"
              icon={<Search size={14} />}
              aria-label="Search desktops" />
          </div>
          <SegmentedControl items={VIEW_ITEMS} value={filter} onChange={setFilter} size="sm" />
        </div>

        {statsLoading && rows.length === 0 ?
        <ResponsiveStack direction="col" gap={3}>
            <Skeleton height={130} />
            <Skeleton height={180} />
          </ResponsiveStack> :
        null}

        {hasError && rows.length === 0 ?
        <EmptyState
          icon={<PlugZap size={22} />}
          title="Connection stats unavailable"
          description={statsError.message || 'The backend socket watcher did not return agent connection data.'}
          actions={
          <Button variant="secondary" onClick={refetchAll} disabled={statsLoading}>
                <RefreshCw size={14} />
                Retry
              </Button>
          } /> :
        null}

        {hasError && rows.length > 0 ?
        <Alert
          tone="warning"
          title="Live data may be stale"
          actions={
          <Button size="sm" variant="secondary" onClick={refetchAll} disabled={statsLoading}>
                <RefreshCw size={14} />
                Retry
              </Button>
          }>
            The latest refresh failed{statsError.message ? ` — ${statsError.message}` : ''}. Showing the last successful data.
          </Alert> :
        null}

        {rows.length > 0 ?
        visibleRows.length > 0 ?
        <DataTable
          rows={visibleRows}
          columns={columns}
          rowId={(r) => r.id}
          onRowClick={(row) => router.push(`/sessions/${row.id}`)}
          defaultDensity="compact" /> :

        <EmptyState
          icon={<Search size={22} />}
          title="No desktops match"
          description="Adjust the search or filter to see more connections." /> :


        !statsLoading && !hasError ?
        <EmptyState
          icon={<PlugZap size={22} />}
          title="No active desktop connections"
          description="Running desktops appear here when their InfiniService agent connects, or when a console session opens." /> :

        null}
      </ResponsiveStack>

      <Dialog
        open={!!endTarget}
        onClose={() => (ending ? null : setEndTarget(null))}
        size="sm"
        title="End console session?"
        description={
        endTarget ?
        `This disconnects any live SPICE/VNC client viewing ${endTarget.name}. The desktop keeps running; the person can reconnect.` :
        ''
        }
        footer={
        <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEndTarget(null)} disabled={ending}>
              Cancel
            </Button>
            <Button variant="destructive" loading={ending} onClick={() => runEndConsole(endTarget.vmId)}>
              End session
            </Button>
          </div>
        } />

    </Page>);

}
