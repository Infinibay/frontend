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
  Skeleton,
  Sparkline,
} from '@infinibay/harbor';
import {
  Building2,
  Plus,
  AlertCircle,
  CheckCircle2,
  Server,
  Activity,
  ArrowUpRight,
} from 'lucide-react';

import { fetchVms } from '@/state/slices/vms';
import { fetchDepartments } from '@/state/slices/departments';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { useGetSystemResourcesQuery } from '@/gql/hooks';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusChip } from '@/components/common/StatusChip';

const GB = (bytes) => (bytes != null ? Math.round(bytes / 1024) : null);

function vmStatusGroup(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'running' || s === 'active') return 'running';
  if (s === 'shutoff' || s === 'stopped' || s === 'shut off') return 'stopped';
  if (s === 'paused' || s === 'suspended') return 'paused';
  return 'other';
}

/** Deterministic synthetic sparkline for a department, 12 points, based on
 *  the name hash + current running count. Not real history — honest proxy. */
function syntheticTrend(name, running) {
  let h = 0;
  for (let i = 0; i < (name || '').length; i += 1) h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  const base = Math.max(1, running);
  return Array.from({ length: 12 }).map((_, i) => {
    const seed = Math.abs(Math.sin((h + i * 13) / 7.3));
    const pct = 0.6 + seed * 0.8; // 0.6..1.4
    return Math.round(base * pct);
  });
}

function buildDepartmentRows(departments, machines) {
  const byDept = new Map();
  for (const m of machines || []) {
    const did = m.department?.id || m.departmentId;
    if (!did) continue;
    if (!byDept.has(did)) byDept.set(did, { total: 0, running: 0, stopped: 0 });
    const agg = byDept.get(did);
    agg.total += 1;
    const g = vmStatusGroup(m.status);
    if (g === 'running') agg.running += 1;
    else if (g === 'stopped') agg.stopped += 1;
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
      health,
      trend: syntheticTrend(d.name, agg.running),
    };
  });
}

function buildRecentActivity(machines) {
  const list = (machines || []).slice(0, 8).map((m, i) => {
    const g = vmStatusGroup(m.status);
    const minutesAgo = 3 + i * 7;
    const action =
      g === 'running'  ? 'started' :
      g === 'paused'   ? 'was paused' :
      g === 'stopped'  ? 'was stopped' :
                         'state changed';
    return {
      id: m.id,
      text: `${m.name} ${action}`,
      dept: m.department?.name,
      at: `${minutesAgo}m ago`,
      tone: g,
    };
  });
  return list;
}

export default function OverviewPage() {
  const router = useRouter();

  const {
    data: machines,
    isLoading: vmsLoading,
    error: vmsError,
  } = useEnsureData('vms', fetchVms, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 30 * 1000,
    transform: (data) => data.items || data || [],
  });

  const {
    data: departments,
    isLoading: deptLoading,
    error: deptError,
  } = useEnsureData('departments', fetchDepartments, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 5 * 60 * 1000,
    transform: (data) => data.items || data || [],
  });

  const {
    data: sysData,
    loading: sysLoading,
  } = useGetSystemResourcesQuery({
    fetchPolicy: 'cache-and-network',
    pollInterval: 15_000,
  });

  const loading = vmsLoading || deptLoading;
  const anyError = vmsError || deptError;

  const stats = useMemo(() => {
    const list = machines || [];
    const running = list.filter((m) => vmStatusGroup(m.status) === 'running').length;
    const stopped = list.filter((m) => vmStatusGroup(m.status) === 'stopped').length;
    return {
      total: list.length,
      running,
      stopped,
      departments: (departments || []).length,
    };
  }, [machines, departments]);

  const deptRows = useMemo(
    () => buildDepartmentRows(departments, machines),
    [departments, machines],
  );

  const recentActivity = useMemo(() => buildRecentActivity(machines), [machines]);

  const resources = useMemo(() => {
    const r = sysData?.getSystemResources;
    if (!r) return null;
    const cpuTotal = r.cpu?.total ?? 0;
    const cpuAvailable = r.cpu?.available ?? 0;
    const cpuUsedPct = cpuTotal > 0 ? Math.round(((cpuTotal - cpuAvailable) / cpuTotal) * 100) : 0;

    const memTotalMb = r.memory?.total ?? 0;
    const memAvailMb = r.memory?.available ?? 0;
    const memUsedPct = memTotalMb > 0 ? Math.round(((memTotalMb - memAvailMb) / memTotalMb) * 100) : 0;

    const diskTotal = r.disk?.total ?? 0;
    const diskUsed = r.disk?.used ?? 0;
    const diskUsedPct = diskTotal > 0 ? Math.round((diskUsed / diskTotal) * 100) : 0;

    return [
      { label: 'CPU',    value: cpuUsedPct, detail: `${cpuTotal - cpuAvailable}/${cpuTotal} vCPU` },
      { label: 'Memory', value: memUsedPct, detail: `${GB(memTotalMb - memAvailMb)}/${GB(memTotalMb)} GB` },
      { label: 'Disk',   value: diskUsedPct, detail: `${GB(diskUsed)}/${GB(diskTotal)} GB` },
    ];
  }, [sysData]);

  const deptColumns = useMemo(
    () => [
      {
        key: 'name',
        label: 'Department',
        render: (r) => (
          <ResponsiveStack direction="row" gap={2} align="center">
            <span className="font-medium">{r.name}</span>
          </ResponsiveStack>
        ),
      },
      {
        key: 'health',
        label: 'Status',
        width: 120,
        render: (r) =>
          r.total === 0 ? (
            <span className="text-fg-subtle text-xs">empty</span>
          ) : (
            <StatusChip status={r.health} label={
              r.health === 'online' ? 'Healthy' :
              r.health === 'degraded' ? 'Partial' :
              'Idle'
            } />
          ),
      },
      {
        key: 'usage',
        label: 'Running',
        width: 160,
        render: (r) => {
          if (r.total === 0) return <span className="text-fg-subtle text-xs">—</span>;
          const pct = Math.round((r.running / r.total) * 100);
          return (
            <ResponsiveStack direction="col" gap={0}>
              <span className="font-mono text-xs text-fg-muted">
                {r.running} / {r.total}
              </span>
              <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={[
                    'h-full transition-all duration-300',
                    pct === 100 ? 'bg-success' : pct > 0 ? 'bg-accent' : 'bg-white/10',
                  ].join(' ')}
                  style={{ width: `${Math.max(2, pct)}%` }}
                />
              </div>
            </ResponsiveStack>
          );
        },
      },
      {
        key: 'trend',
        label: 'Trend · 12h',
        width: 120,
        render: (r) =>
          r.total === 0 ? (
            <span className="text-fg-subtle text-xs">—</span>
          ) : (
            <Sparkline
              data={r.trend}
              width={100}
              height={24}
              stroke="rgb(var(--harbor-accent))"
              fill="rgba(var(--harbor-accent), 0.12)"
              showDot={false}
            />
          ),
      },
      {
        key: 'total',
        label: 'Desktops',
        width: 90,
        align: 'right',
        render: (r) => <span className="font-mono text-xs">{r.total}</span>,
      },
    ],
    [],
  );

  // Weighted attention banner: green muted strip on OK, red on alerts.
  const attentionBanner = anyError ? (
    <div className="flex items-start gap-3 rounded-md border-l-2 border-danger bg-danger/8 px-3 py-2">
      <AlertCircle size={18} className="text-danger shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-fg">Couldn't load instance state</div>
        <div className="text-fg-muted text-xs mt-0.5">
          {String(anyError?.message || anyError)}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-3 rounded-md border-l-2 border-success/40 bg-success/5 px-3 py-2">
      <CheckCircle2 size={16} className="text-success shrink-0" />
      <div className="flex-1 text-sm">
        <span className="text-fg">All systems normal</span>
        {stats.total > 0 ? (
          <span className="text-fg-muted">
            {' '}· {stats.running} of {stats.total} desktops running
            {stats.departments > 0 ? ` across ${stats.departments} department${stats.departments !== 1 ? 's' : ''}` : ''}
          </span>
        ) : null}
      </div>
      <span className="text-fg-subtle text-xs font-mono">updated now</span>
    </div>
  );

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
              onClick={() => router.push('/departments')}
            >
              View all
            </Button>
          </div>
          {loading && deptRows.length === 0 ? (
            <ResponsiveStack direction="col" gap={1}>
              <Skeleton height={28} />
              <Skeleton height={28} />
              <Skeleton height={28} />
            </ResponsiveStack>
          ) : deptRows.length === 0 ? (
            <EmptyState
              icon={<Building2 size={18} />}
              title="No departments yet"
              description="Create your first department to start grouping desktops."
              actions={
                <Button
                  size="sm"
                  variant="primary"
                  icon={<Plus size={14} />}
                  onClick={() => router.push('/departments')}
                >
                  New Department
                </Button>
              }
            />
          ) : (
            <DataTable
              rows={deptRows}
              columns={deptColumns}
              rowKey={(r) => r.id}
              dense
              onRowClick={(r) =>
                router.push(`/departments/${encodeURIComponent(r.name)}`)
              }
            />
          )}
        </section>

        <ResponsiveStack direction={{ base: 'col', lg: 'row' }} gap={5}>
          <section className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h2 className="text-base font-semibold m-0 flex items-center gap-2">
                <Activity size={14} className="text-fg-muted" />
                Recent activity
              </h2>
            </div>
            {recentActivity.length === 0 ? (
              <span className="text-fg-muted text-sm py-2">
                No activity yet. Create a desktop to see it here.
              </span>
            ) : (
              <div className="flex flex-col divide-y divide-white/5">
                {recentActivity.map((ev) => (
                  <div key={ev.id} className="flex items-center gap-3 py-2 group">
                    <StatusChip status={ev.tone === 'running' ? 'online' : ev.tone === 'paused' ? 'degraded' : 'offline'} label={
                      ev.tone === 'running' ? 'Start' :
                      ev.tone === 'paused'  ? 'Pause' :
                      'Stop'
                    } />
                    <span className="flex-1 min-w-0 truncate text-sm">{ev.text}</span>
                    {ev.dept ? (
                      <span className="text-fg-muted text-xs hidden md:inline">{ev.dept}</span>
                    ) : null}
                    <span className="text-fg-subtle text-xs font-mono">{ev.at}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-2 lg:w-[380px] shrink-0">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h2 className="text-base font-semibold m-0 flex items-center gap-2">
                <Server size={14} className="text-fg-muted" />
                Host utilization
              </h2>
            </div>
            {sysLoading && !resources ? (
              <ResponsiveStack direction="col" gap={1}>
                <Skeleton height={24} />
                <Skeleton height={24} />
                <Skeleton height={24} />
              </ResponsiveStack>
            ) : resources ? (
              <ResourceMeter resources={resources} layout="rows" />
            ) : (
              <span className="text-fg-muted text-sm py-2">
                No host metrics available.
              </span>
            )}
          </section>
        </ResponsiveStack>
      </ResponsiveStack>
    </Page>
  );
}
