'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Page,
  Alert,
  Badge,
  Button,
  Card,
  Dialog,
  DurationPill,
  EmptyState,
  MetricCard,
  ResponsiveStack,
  Skeleton,
  StatusDot } from
'@infinibay/harbor';
import { ArrowLeft, ExternalLink, Monitor, PlugZap, RefreshCw, Unplug } from 'lucide-react';

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
  fmtRtt,
  fmtSuccess,
  linkQuality,
  minutesUntil,
  parseSuccessRate,
  QUALITY_META } from
'../_helpers';

// A labelled figure used inside the cards.
function Field({ label, value, tone }) {
  const toneClass = tone === 'warning' ? 'text-warning' : tone === 'danger' ? 'text-danger' : 'text-fg';
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-fg-subtle text-[11px] uppercase tracking-wider">{label}</span>
      <span className={`font-mono text-sm ${toneClass}`}>{value}</span>
    </div>);

}

export default function SessionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const vmId = params?.id;
  const openConsole = useOpenConsole();

  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useSessionsConnectionStatsQuery({ fetchPolicy: 'cache-and-network', skip: !vmId });

  const { data: consoleData, refetch: refetchConsole } = useConsoleSessionsQuery({
    fetchPolicy: 'cache-and-network',
    skip: !vmId
  });

  const [endConsoleSession] = useEndConsoleSessionMutation();

  const { data: machines } = useEnsureData('vms', fetchVms, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 30 * 1000,
    transform: (payload) => payload.items || payload || []
  });

  const refetchAll = useCallback(() => {
    refetchStats();
    refetchConsole();
  }, [refetchStats, refetchConsole]);
  // Refetch on this VM's agent events only (predicate keeps other desktops' churn
  // from re-rendering this page).
  useRealtimeRefetch('agent_connections', refetchAll, {
    actions: ['update'],
    minIntervalMs: 2000,
    predicate: (_action, event) => !event?.vmId || event.vmId === vmId
  });

  const conn = useMemo(
    () => (statsData?.socketConnectionStats?.connections || []).find((c) => c.vmId === vmId) || null,
    [statsData, vmId]
  );
  const consoleSession = useMemo(
    () => (consoleData?.consoleSessions || []).find((c) => c.vmId === vmId) || null,
    [consoleData, vmId]
  );
  const vm = useMemo(() => (machines || []).find((m) => m.id === vmId) || null, [machines, vmId]);

  const ka = conn?.keepAlive || null;
  const quality = linkQuality(conn);
  const meta = QUALITY_META[quality];
  const desktopName = vm?.name || vmId;
  const departmentName = vm?.department?.name || null;

  // Accumulate RTT samples for a live sparkline. keepAlive only gives the current
  // average, so we sample it over the viewing window — honest, and it never
  // fabricates history (the series starts empty until the first sample lands).
  const [rttSeries, setRttSeries] = useState([]);
  const lastRtt = useRef(null);
  useEffect(() => {
    const rtt = ka?.averageRtt;
    if (typeof rtt !== 'number' || Number.isNaN(rtt)) return;
    if (lastRtt.current === rtt) return;
    lastRtt.current = rtt;
    setRttSeries((prev) => [...prev, rtt].slice(-40));
  }, [ka?.averageRtt]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [ending, setEnding] = useState(false);

  const runEndConsole = useCallback(async () => {
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
      setConfirmOpen(false);
    }
  }, [endConsoleSession, refetchConsole, vmId]);

  const back = (
    <Button
      size="sm"
      variant="secondary"
      icon={<ArrowLeft size={14} />}
      onClick={() => router.push('/sessions')}>

      Back
    </Button>);


  if (!vmId) {
    return (
      <Page>
        <ResponsiveStack direction="col" gap={4}>
          <EmptyState icon={<PlugZap size={18} />} title="Session not found" actions={back} />
        </ResponsiveStack>
      </Page>);

  }

  const notFound = !conn && !consoleSession && !vm && !statsLoading;
  const successPct = parseSuccessRate(ka?.successRate);
  const expiresMin = minutesUntil(consoleSession?.expiresAt);

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PageHeader
          title={desktopName}
          count={departmentName || undefined}
          description="Live connection detail — the agent transport link and the console session for this desktop."
          secondary={
          <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={refetchAll} disabled={statsLoading}>
                <RefreshCw size={14} />
                Refresh
              </Button>
              {back}
            </div>
          } />

        {statsError && !conn ?
        <Alert tone="warning" title="Live data may be unavailable">
            {statsError.message || 'The backend socket watcher did not return connection data for this desktop.'}
          </Alert> :
        null}

        {statsLoading && !conn && !consoleSession ?
        <ResponsiveStack direction="col" gap={3}>
            <Skeleton height={160} />
            <Skeleton height={160} />
          </ResponsiveStack> :
        notFound ?
        <EmptyState
          icon={<PlugZap size={22} />}
          title="No connection for this desktop"
          description="This desktop has no active agent link or console session. It may be powered off, or its agent hasn't connected yet."
          actions={back} /> :

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* AGENT LINK */}
            <Card
            spotlight={false}
            title={
            <div className="flex items-center justify-between">
                  <span>Agent link</span>
                  <StatusDot status={meta.status} size={9} labelOverride={meta.label} />
                </div>
            }>

              {conn ?
            <div className="flex flex-col gap-4">
                  <MetricCard
                label="Round-trip time"
                value={fmtRtt(ka?.averageRtt)}
                raw={typeof ka?.averageRtt === 'number' ? ka.averageRtt : undefined}
                series={rttSeries.length > 1 ? rttSeries : undefined}
                threshold={[60, 120]}
                icon={<RefreshCw size={14} />} />

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <Field
                  label="Success"
                  value={fmtSuccess(ka?.successRate)}
                  tone={successPct != null && successPct < 95 ? 'warning' : undefined} />

                    <Field
                  label="Reconnects"
                  value={conn.reconnectAttempts ?? 0}
                  tone={conn.reconnectAttempts > 0 ? 'warning' : undefined} />

                    <Field
                  label="Consec. fails"
                  value={ka?.consecutiveFailures ?? 0}
                  tone={ka?.consecutiveFailures > 0 ? 'danger' : undefined} />

                    <Field label="Sent" value={ka?.sentCount ?? '—'} />
                    <Field label="Received" value={ka?.receivedCount ?? '—'} />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-fg-subtle text-[11px] uppercase tracking-wider">Last message</span>
                      {conn.lastMessageTime ?
                  <DurationPill from={conn.lastMessageTime} auto tone={quality === 'online' ? 'success' : 'warn'} /> :

                  <span className="font-mono text-sm text-fg-muted">—</span>
                  }
                    </div>
                  </div>
                </div> :

            <EmptyState
              icon={<PlugZap size={18} />}
              title="Agent offline"
              description="The in-guest InfiniService agent is not connected. Metrics and remote commands are unavailable until it reconnects." />

            }
            </Card>

            {/* CONSOLE SESSION */}
            <Card spotlight={false} title="Console session">
              {consoleSession ?
            <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    {consoleSession.connected ?
                <Badge tone="info">In use · {consoleSession.channels} channel{consoleSession.channels === 1 ? '' : 's'}</Badge> :

                <Badge tone="neutral">Idle relay</Badge>
                }
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Relay port" value={consoleSession.listenPort} />
                    <Field label="Channels" value={consoleSession.channels} />
                    <Field label="Expires in" value={expiresMin == null ? '—' : `~${expiresMin} min`} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" size="sm" icon={<Monitor size={14} />} onClick={() => openConsole(vm || { id: vmId, name: desktopName })}>
                      Open console
                    </Button>
                    <Button variant="destructive" size="sm" icon={<Unplug size={14} />} onClick={() => setConfirmOpen(true)}>
                      End session
                    </Button>
                  </div>
                </div> :

            <div className="flex flex-col gap-4">
                  <EmptyState
                icon={<Monitor size={18} />}
                title="No live console"
                description="No one is viewing this desktop through Infinibay's relay right now. Open a console to connect." />

                  <div>
                    <Button variant="secondary" size="sm" icon={<Monitor size={14} />} onClick={() => openConsole(vm || { id: vmId, name: desktopName })}>
                      Open console
                    </Button>
                  </div>
                </div>
            }
            </Card>
          </div>
        }

        {departmentName ?
        <div>
            <Button
            variant="ghost"
            size="sm"
            icon={<ExternalLink size={14} />}
            onClick={() =>
            router.push(`/departments/${encodeURIComponent(departmentName)}/desktops/${vmId}`)
            }>

            View desktop details, health &amp; controls
          </Button>
          </div> :
        null}
      </ResponsiveStack>

      <Dialog
        open={confirmOpen}
        onClose={() => (ending ? null : setConfirmOpen(false))}
        size="sm"
        title="End console session?"
        description={`This disconnects any live SPICE/VNC client viewing ${desktopName}. The desktop keeps running; the person can reconnect.`}
        footer={
        <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)} disabled={ending}>
              Cancel
            </Button>
            <Button variant="destructive" loading={ending} onClick={runEndConsole}>
              End session
            </Button>
          </div>
        } />

    </Page>);

}
