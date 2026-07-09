'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Page,
  EmptyState,
  ResourceMeter,
  DataTable,
  ResponsiveStack,
  Button,
  Skeleton } from
'@infinibay/harbor';
import {
  Building2,
  Plus,
  AlertCircle,
  CheckCircle2,
  Server,
  Activity,
  ArrowUpRight,
  RefreshCw } from
'lucide-react';

import { fetchVms } from '@/state/slices/vms';
import { fetchDepartments } from '@/state/slices/departments';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';
import { useGetSystemResourcesQuery } from '@/gql/hooks';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusChip } from '@/components/common/StatusChip';
import { usePageHeader } from '@/hooks/usePageHeader';

const GB = (bytes) => bytes != null ? Math.round(bytes / 1024) : null;

function vmStatusGroup(status, setupComplete) {
  const s = String(status || '').toLowerCase();
  if (s === 'running' || s === 'active') {
    // VM is up but the OS hasn't finished setup → counts as transitional, not running.
    return setupComplete ? 'running' : 'other';
  }
  if (s === 'off' || s === 'shutoff' || s === 'stopped' || s === 'shut off') return 'stopped';
  if (s === 'paused' || s === 'suspended') return 'paused';
  return 'other';
}

function buildDepartmentRows(departments, machines) {
  const byDept = new Map();
  for (const m of machines || []) {
    const did = m.department?.id || m.departmentId;
    if (!did) continue;
    if (!byDept.has(did)) byDept.set(did, { total: 0, running: 0, stopped: 0 });
    const agg = byDept.get(did);
    agg.total += 1;
    const g = vmStatusGroup(m.status, m.setupComplete);
    if (g === 'running') agg.running += 1;else
    if (g === 'stopped') agg.stopped += 1;
  }
  return (departments || []).map((d) => {
    const agg = byDept.get(d.id) || { total: 0, running: 0, stopped: 0 };
    const health =
    agg.total === 0 ? 'offline' :
    agg.running === agg.total ? 'online' :
    agg.running === 0 ? 'offline' :
    'degraded';
    return {
      id: d.id,
      name: d.name,
      total: agg.total,
      running: agg.running,
      stopped: agg.stopped,
      health
    };
  });
}

function buildCurrentState(machines) {
  return (machines || []).slice(0, 8).map((m) => {
    const g = vmStatusGroup(m.status, m.setupComplete);
    return {
      id: m.id,
      name: m.name,
      dept: m.department?.name,
      tone: g
    };
  });
}

export default function OverviewPage() {
  const router = useRouter();

  // Register the global header so breadcrumbs/title/actions don't leak in from
  // the previously visited page (usePageHeader intentionally skips resetHeader).
  usePageHeader(
    {
      breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Overview', isCurrent: true }],
      title: 'Overview',
      actions: []
    },
    []
  );

  const {
    data: machines,
    isLoading: vmsLoading,
    error: vmsError,
    refresh: refreshVms
  } = useEnsureData('vms', fetchVms, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 30 * 1000,
    transform: (data) => data.items || data || []
  });

  const {
    data: departments,
    isLoading: deptLoading,
    error: deptError,
    lastUpdated: deptLastUpdated,
    refresh: refreshDepartments
  } = useEnsureData('departments', fetchDepartments, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 5 * 60 * 1000,
    transform: (data) => data.items || data || []
  });

  const {
    data: sysData,
    loading: sysLoading,
    refetch: refetchSys
  } = useGetSystemResourcesQuery({
    fetchPolicy: 'cache-and-network'
  });

  // No polling: host CPU/RAM/disk changes as VMs are created/removed/powered,
  // so refetch on 'vms' events over the websocket instead of every 15s.
  useRealtimeRefetch('vms', refetchSys, { minIntervalMs: 2000 });

  const loading = vmsLoading || deptLoading;
  const anyError = vmsError || deptError;

  // Recover from a failed load without a full page reload: re-run whichever
  // slice(s) failed (useEnsureData.refresh ignores cache + terminal-failure
  // cooldown). Silently ignore rejections here — the banner stays visible and
  // reflects the still-present slice error.
  const handleRetry = () => {
    if (vmsError) refreshVms().catch(() => {});
    if (deptError) refreshDepartments().catch(() => {});
  };

  const stats = useMemo(() => {
    const list = machines || [];
    const running = list.filter((m) => vmStatusGroup(m.status, m.setupComplete) === 'running').length;
    const stopped = list.filter((m) => vmStatusGroup(m.status, m.setupComplete) === 'stopped').length;
    return {
      total: list.length,
      running,
      stopped,
      departments: (departments || []).length
    };
  }, [machines, departments]);

  const deptRows = useMemo(
    () => buildDepartmentRows(departments, machines),
    [departments, machines]
  );

  const machineStates = useMemo(() => buildCurrentState(machines), [machines]);

  const resources = useMemo(() => {
    const r = sysData?.getSystemResources;
    if (!r) return null;
    const cpuTotal = r.cpu?.total ?? 0;
    const cpuAvailable = r.cpu?.available ?? 0;
    const cpuUsedPct = cpuTotal > 0 ? Math.round((cpuTotal - cpuAvailable) / cpuTotal * 100) : 0;

    const memTotalMb = r.memory?.total ?? 0;
    const memAvailMb = r.memory?.available ?? 0;
    const memUsedPct = memTotalMb > 0 ? Math.round((memTotalMb - memAvailMb) / memTotalMb * 100) : 0;

    const diskTotal = r.disk?.total ?? 0;
    const diskUsed = r.disk?.used ?? 0;
    const diskUsedPct = diskTotal > 0 ? Math.round(diskUsed / diskTotal * 100) : 0;

    return [
    { label: 'CPU', value: cpuUsedPct, detail: `${cpuTotal - cpuAvailable}/${cpuTotal} vCPU` },
    { label: 'Memory', value: memUsedPct, detail: `${GB(memTotalMb - memAvailMb)}/${GB(memTotalMb)} GB` },
    { label: 'Disk', value: diskUsedPct, detail: `${GB(diskUsed)}/${GB(diskTotal)} GB` }];

  }, [sysData]);

  const deptColumns = useMemo(
    () => [
    {
      id: 'name',
      header: 'Department',
      cell: ({ row: r }) =>
      <ResponsiveStack direction="row" gap={2} align="center">
            <span className="font-medium">{r.name}</span>
          </ResponsiveStack>

    },
    {
      id: 'health',
      header: 'Status',
      width: 120,
      cell: ({ row: r }) =>
      r.total === 0 ?
      <span className="text-fg-subtle text-xs">empty</span> :

      <StatusChip status={r.health} label={
      r.health === 'online' ? 'Healthy' :
      r.health === 'degraded' ? 'Partial' :
      'Idle'
      } />

    },
    {
      id: 'usage',
      header: 'Running',
      width: 160,
      cell: ({ row: r }) => {
        if (r.total === 0) return <span className="text-fg-subtle text-xs">—</span>;
        const pct = Math.round(r.running / r.total * 100);
        return (
          <ResponsiveStack direction="col" gap={0}>
              <span className="font-mono text-xs text-fg-muted">
                {r.running} / {r.total}
              </span>
              <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                className={[
                'h-full transition-all duration-300',
                pct === 100 ? 'bg-success' : pct > 0 ? 'bg-accent' : 'bg-white/10'].
                join(' ')}
                style={{ width: `${Math.max(2, pct)}%` }} />
              
              </div>
            </ResponsiveStack>);

      }
    },
    {
      id: 'total',
      header: 'Desktops',
      width: 90,
      align: 'right',
      cell: ({ row: r }) => <span className="font-mono text-xs">{r.total}</span>
    }],

    []
  );

  // Weighted attention banner: green muted strip on OK, red on alerts.
  const attentionBanner = anyError ?
  <div className="flex items-start gap-3 rounded-md border-l-2 border-danger bg-danger/10 px-3 py-2">
      <AlertCircle size={18} className="text-danger shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-fg">Couldn't load instance state</div>
        <div className="text-fg-muted text-xs mt-0.5">
          {String(anyError?.message || anyError)}
        </div>
      </div>
      <Button
      size="sm"
      variant="ghost"
      icon={<RefreshCw size={14} />}
      onClick={handleRetry}
      disabled={loading}
      className="shrink-0">

        Retry
      </Button>
    </div> :

  <div className="flex items-center gap-3 rounded-md border-l-2 border-success/40 bg-success/5 px-3 py-2">
      <CheckCircle2 size={16} className="text-success shrink-0" />
      <div className="flex-1 text-sm">
        <span className="text-fg">All systems normal</span>
        {stats.total > 0 ?
      <span className="text-fg-muted">
            {' '}· {stats.running} of {stats.total} desktops running
            {stats.departments > 0 ? ` across ${stats.departments} department${stats.departments !== 1 ? 's' : ''}` : ''}
          </span> :
      null}
      </div>
    </div>;


  return (
    <Page>
      <ResponsiveStack direction="col" gap={5}>
        <PageHeader title="Overview" />
        {attentionBanner}

        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h2 className="text-base font-semibold m-0 flex items-center gap-2">
              <Building2 size={14} className="text-fg-muted" />
              Departments
              <span className="text-fg-muted text-xs font-normal ml-1">
                · {stats.departments}
              </span>
            </h2>
            <Button
              size="sm"
              variant="ghost"
              icon={<ArrowUpRight size={14} />}
              onClick={() => router.push('/departments')}>
              
              View all
            </Button>
          </div>
          {loading && deptRows.length === 0 && !deptLastUpdated ?
          <ResponsiveStack direction="col" gap={1}>
              <Skeleton height={28} />
              <Skeleton height={28} />
              <Skeleton height={28} />
            </ResponsiveStack> :
          deptRows.length === 0 ?
          <EmptyState
            icon={<Building2 size={18} />}
            title="No departments yet"
            description="Create your first department to start grouping desktops."
            actions={
            <Button
              size="sm"
              variant="primary"
              icon={<Plus size={14} />}
              onClick={() => router.push('/departments')}>
              
                  New Department
                </Button>
            } /> :


          <DataTable
            rows={deptRows}
            columns={deptColumns}
            rowId={(r) => r.id}
            defaultDensity="compact"
            onRowClick={(r) =>
            router.push(`/departments/${encodeURIComponent(r.name)}`)
            } />

          }
        </section>

        <ResponsiveStack direction={{ base: 'col', lg: 'row' }} gap={5}>
          <section className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h2 className="text-base font-semibold m-0 flex items-center gap-2">
                <Activity size={14} className="text-fg-muted" />
                Current state
              </h2>
            </div>
            {machineStates.length === 0 ?
            <span className="text-fg-muted text-sm py-2">
                No desktops yet. Create a desktop to see it here.
              </span> :

            <div className="flex flex-col divide-y divide-[color:var(--harbor-border-subtle)]">
                {machineStates.map((ev) =>
              <div key={ev.id} className="flex items-center gap-3 py-2 group">
                    <StatusChip status={ev.tone === 'running' ? 'online' : ev.tone === 'paused' ? 'degraded' : 'offline'} label={
                ev.tone === 'running' ? 'Running' :
                ev.tone === 'paused' ? 'Paused' :
                ev.tone === 'stopped' ? 'Stopped' :
                'Other'
                } />
                    <span className="flex-1 min-w-0 truncate text-sm">{ev.name}</span>
                    {ev.dept ?
                <span className="text-fg-muted text-xs hidden md:inline">{ev.dept}</span> :
                null}
                  </div>
              )}
              </div>
            }
          </section>

          <section className="flex flex-col gap-2 lg:w-[380px] shrink-0">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h2 className="text-base font-semibold m-0 flex items-center gap-2">
                <Server size={14} className="text-fg-muted" />
                Host utilization
              </h2>
            </div>
            {sysLoading && !resources ?
            <ResponsiveStack direction="col" gap={1}>
                <Skeleton height={24} />
                <Skeleton height={24} />
                <Skeleton height={24} />
              </ResponsiveStack> :
            resources ?
            <ResourceMeter resources={resources} layout="rows" /> :

            <span className="text-fg-muted text-sm py-2">
                No host metrics available.
              </span>
            }
          </section>
        </ResponsiveStack>
      </ResponsiveStack>
    </Page>);

}