'use client';

import { use, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import {
  Page,
  Alert,
  Badge,
  Button,
  ButtonGroup,
  Checkbox,
  DataTable,
  IconButton,
  Menu,
  MenuItem,
  ResponsiveStack,
  Spinner,
  StatusDot,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TextField } from
'@infinibay/harbor';
import {
  ArrowLeft,
  RefreshCcw,
  Pause,
  Play,
  Power,
  PowerOff,
  ExternalLink,
  MoreHorizontal,
  Move3d,
  Settings2,
  Layers,
  Monitor } from
'lucide-react';

import client from '@/apollo-client';
import { PageHeader } from '@/components/common/PageHeader';
import { usePageHeader } from '@/hooks/usePageHeader';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { fetchVms, playVm, pauseVm, stopVm } from '@/state/slices/vms';

// Statuses that mean a desktop is provisioned but not actively in use,
// i.e. immediately available for a user to check out ("hot" but idle).
const IDLE_STATUSES = ['off', 'stopped', 'paused', 'suspended'];

function typeLabel(type) {
  return type === 'persistent' ? 'Persistent' : 'Non-persistent';
}

const GOLDEN_IMAGES_QUERY = gql`
  query PoolGoldenImages {
    goldenImages { id name version osType }
  }
`;

const POOL_QUERY = gql`
  query PoolDetail($id: ID!) {
    pool(id: $id) {
      id
      name
      templateId
      goldenImageId
      departmentId
      type
      sizeMin
      sizeMax
      idleTimeoutMinutes
      resetOnLogoff
      draining
      currentSize
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_POOL = gql`
  mutation UpdatePool($id: ID!, $input: UpdatePoolInput!) {
    updatePool(id: $id, input: $input) { success error }
  }
`;

const SCALE_POOL = gql`
  mutation ScalePool($id: ID!, $targetSize: Int!) {
    scalePool(id: $id, targetSize: $targetSize) { success error }
  }
`;

const DRAIN_POOL = gql`
  mutation DrainPool($id: ID!) { drainPool(id: $id) { success error } }
`;

const UNDRAIN_POOL = gql`
  mutation UndrainPool($id: ID!) { undrainPool(id: $id) { success error } }
`;

export default function PoolDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(true);

  const [goldenImages, setGoldenImages] = useState([]);

  const departments = useSelector((s) => s.departments?.items ?? []);
  const templates = useSelector((s) => s.templates?.items ?? []);

  // Keep the global VM inventory warm so the Desktops tab and the
  // running/idle counts work even on a direct navigation to this page.
  const {
    data: vms,
    refresh: refreshVms
  } = useEnsureData('vms', fetchVms, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 30 * 1000,
    transform: (data) => data.items || data || []
  });

  const deptName = departments.find((d) => d.id === pool?.departmentId)?.name;
  const templateName = templates.find((t) => t.id === pool?.templateId)?.name;
  const goldenImageName = pool?.goldenImageId
    ? goldenImages.find((g) => g.id === pool.goldenImageId)?.name
    : null;

  const fetch = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await client.query({
        query: POOL_QUERY,
        variables: { id },
        fetchPolicy: 'network-only'
      });
      setPool(data?.pool ?? null);
    } catch (err) {
      if (!silent) toast.error(`Failed to load pool: ${err.message}`);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [id]);

  const refresh = useCallback(() => {
    fetch();
    refreshVms();
  }, [fetch, refreshVms]);

  useEffect(() => { fetch(); }, [fetch]);

  // Load published golden images once so we can show the pinned base by name.
  useEffect(() => {
    let cancelled = false;
    client
      .query({ query: GOLDEN_IMAGES_QUERY, fetchPolicy: 'cache-first' })
      .then(({ data }) => { if (!cancelled) setGoldenImages(data?.goldenImages ?? []); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Live refresh: pools spin desktops up/down in the background, so poll the
  // pool + the VM inventory on a light cadence while this page is open.
  useEffect(() => {
    const interval = setInterval(() => {
      fetch({ silent: true });
      refreshVms();
    }, 15000);
    return () => clearInterval(interval);
  }, [fetch, refreshVms]);

  const poolMachines = useMemo(
    () => (vms || []).filter((v) => v.poolId === id && v.status !== 'archived'),
    [vms, id]
  );

  // title intentionally omitted — the in-page <PageHeader> below renders the
  // page <h1>; setting it here too would duplicate it in GlobalHeader.
  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Pools', href: '/pools' },
        { label: pool?.name || 'Pool', isCurrent: true }
      ],
      actions: []
    },
    [pool?.name]
  );

  const run = async (mutation, variables, msg) => {
    try {
      const { data } = await client.mutate({ mutation, variables });
      const result = data && Object.values(data)[0];
      if (result && typeof result === 'object' && result.success === false) {
        throw new Error(result.error || 'mutation failed');
      }
      toast.success(msg);
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading && !pool) {
    return (
      <Page>
        <ResponsiveStack direction="row" gap={3} justify="center" align="center">
          <Spinner /> <span className="text-fg-muted text-sm">Loading pool…</span>
        </ResponsiveStack>
      </Page>);

  }
  if (!pool) {
    return (
      <Page>
        <Alert tone="danger" title="Pool not found">
          <Button onClick={() => router.push('/pools')}>Back to pools</Button>
        </Alert>
      </Page>);

  }

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <ResponsiveStack direction="row" gap={2} align="center">
          <IconButton size="sm" variant="ghost" label="Back" icon={<ArrowLeft size={14} />} onClick={() => router.push('/pools')} />
          <PageHeader
            title={pool.name}
            count={
            <ResponsiveStack direction="row" gap={2} align="center">
                <StatusDot
                status={pool.draining ? 'warning' : pool.currentSize < pool.sizeMin ? 'degraded' : 'online'}
                size={8} />

                <Badge tone={pool.type === 'persistent' ? 'info' : 'neutral'}>{typeLabel(pool.type)}</Badge>
                {pool.draining ? <Badge tone="warning">draining</Badge> : null}
              </ResponsiveStack>
            }
            secondary={
            <IconButton size="sm" variant="ghost" label="Refresh" icon={<RefreshCcw size={14} />} onClick={refresh} disabled={loading} />
            } />

        </ResponsiveStack>

        <Tabs defaultValue="overview" variant="underline">
          <TabList>
            <Tab value="overview" icon={<Layers size={14} />}>Overview</Tab>
            <Tab value="desktops" icon={<Monitor size={14} />}>Desktops · {poolMachines.length}</Tab>
            <Tab value="settings" icon={<Settings2 size={14} />}>Settings</Tab>
          </TabList>

          <TabPanel value="overview">
            <OverviewTab
              pool={pool}
              deptName={deptName}
              templateName={templateName}
              goldenImageName={goldenImageName}
              poolMachines={poolMachines}
              onScale={(t) => run(SCALE_POOL, { id: pool.id, targetSize: t }, 'Pool scaling')}
              onToggleDrain={() =>
              run(
                pool.draining ? UNDRAIN_POOL : DRAIN_POOL,
                { id: pool.id },
                pool.draining ? 'Pool resumed' : 'Pool draining'
              )
              } />

          </TabPanel>

          <TabPanel value="desktops">
            <DesktopsTab machines={poolMachines} onRefresh={refresh} />
          </TabPanel>

          <TabPanel value="settings">
            <SettingsTab
              pool={pool}
              onSaved={(patch, msg) => run(UPDATE_POOL, { id: pool.id, input: patch }, msg)} />

          </TabPanel>
        </Tabs>
      </ResponsiveStack>
    </Page>);

}

function OverviewTab({ pool, deptName, templateName, goldenImageName, poolMachines, onScale, onToggleDrain }) {
  const [scaleInput, setScaleInput] = useState(String(pool.currentSize));
  const runningCount = poolMachines.filter((m) => m.status === 'running').length;
  const idleCount = poolMachines.filter((m) => IDLE_STATUSES.includes(m.status)).length;

  return (
    <ResponsiveStack direction="col" gap={4}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Current size" value={pool.currentSize} hint={`${pool.sizeMin}–${pool.sizeMax} range`} />
        <Stat label="Running" value={runningCount} />
        <Stat label="Idle" value={idleCount} />
        <Stat label="Type" value={typeLabel(pool.type)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h3 className="text-sm uppercase tracking-wide text-fg-muted mb-2">Configuration</h3>
          <KV label="Department" value={deptName ?? pool.departmentId.slice(0, 8)} />
          <KV label="Blueprint" value={templateName ?? pool.templateId.slice(0, 8)} />
          <KV
            label="Golden image"
            value={goldenImageName ?? (pool.goldenImageId ? `${pool.goldenImageId.slice(0, 8)}…` : 'inherited from blueprint')}
            mono={!goldenImageName} />
          <KV label="Idle timeout" value={pool.idleTimeoutMinutes ? `${pool.idleTimeoutMinutes} min` : 'never'} />
          <KV label="Reset on logoff" value={pool.type === 'persistent' ? 'n/a (persistent)' : pool.resetOnLogoff ? 'yes' : 'no'} />
        </section>

        <section>
          <h3 className="text-sm uppercase tracking-wide text-fg-muted mb-2">Actions</h3>
          <ResponsiveStack direction="col" gap={3}>
            <div className="flex items-end gap-2">
              <TextField
                label="Scale to"
                type="number"
                min={0}
                max={pool.sizeMax}
                value={scaleInput}
                onChange={(e) => setScaleInput(e.target.value)} />

              <Button
                icon={<Move3d size={14} />}
                onClick={() => {
                  const n = parseInt(scaleInput, 10);
                  if (!Number.isFinite(n) || n < 0) return toast.error('Enter non-negative integer');
                  if (n > pool.sizeMax) return toast.error(`Max is ${pool.sizeMax}`);
                  onScale(n);
                }}>

                Apply
              </Button>
            </div>
            <Button
              variant={pool.draining ? 'primary' : 'secondary'}
              icon={pool.draining ? <Play size={14} /> : <Pause size={14} />}
              onClick={onToggleDrain}>

              {pool.draining ? 'Resume pool' : 'Drain pool'}
            </Button>
          </ResponsiveStack>
        </section>
      </div>
    </ResponsiveStack>);

}

function DesktopsTab({ machines, onRefresh }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [busyId, setBusyId] = useState(null);

  const openConsole = useCallback(
    (m) => {
      const dept = m.department?.name || m.departmentId || '';
      router.push(`/departments/${encodeURIComponent(dept)}/vm/${m.id}`);
    },
    [router]
  );

  const act = useCallback(
    async (m, thunk, msg) => {
      setBusyId(m.id);
      try {
        await dispatch(thunk({ id: m.id })).unwrap();
        toast.success(msg);
        onRefresh?.();
      } catch (err) {
        toast.error(typeof err === 'string' ? err : err?.message || 'Action failed');
      } finally {
        setBusyId(null);
      }
    },
    [dispatch, onRefresh]
  );

  const columns = useMemo(
    () => [
    {
      id: 'status',
      header: 'Status',
      width: 120,
      cell: ({ row: r }) =>
      <ResponsiveStack direction="row" gap={2} align="center">
            <StatusDot status={desktopDotStatus(r.status)} size={8} />
            <span className="text-xs text-fg-muted">{r.status === 'rebuilding' ? 'resetting' : r.status}</span>
          </ResponsiveStack>

    },
    { id: 'name', header: 'Name', cell: ({ row: r }) => <span className="font-medium">{r.name}</span> },
    { id: 'user', header: 'Assigned', cell: ({ row: r }) => r.user?.email ?? <span className="text-fg-subtle">—</span> },
    { id: 'ip', header: 'IP', cell: ({ row: r }) => r.localIP ? <span className="font-mono text-xs">{r.localIP}</span> : '—' },
    {
      id: 'actions',
      header: '',
      width: 40,
      cell: ({ row: r }) => {
        const isRunning = r.status === 'running';
        const isBusy = busyId === r.id || r.status === 'starting' || r.status === 'rebuilding';
        return (
          // Stop the click from bubbling to the row (onRowClick → openConsole),
          // which would navigate away before the menu could open.
          <div onClick={(e) => e.stopPropagation()}>
            <Menu
              trigger={
              <IconButton size="sm" variant="ghost" label="Desktop actions" icon={<MoreHorizontal size={14} />} disabled={isBusy} />
              }>
                <MenuItem icon={<ExternalLink size={14} />} onClick={() => openConsole(r)}>
                  Open console
                </MenuItem>
                {isRunning ?
              <>
                    <MenuItem icon={<Pause size={14} />} onClick={() => act(r, pauseVm, 'Suspending desktop')}>
                      Suspend
                    </MenuItem>
                    <MenuItem icon={<PowerOff size={14} />} danger onClick={() => act(r, stopVm, 'Powering off desktop')}>
                      Power off
                    </MenuItem>
                  </> :

              <MenuItem icon={<Power size={14} />} onClick={() => act(r, playVm, 'Powering on desktop')}>
                    Power on
                  </MenuItem>
              }
              </Menu>
            </div>);

      }
    }],

    [busyId, act, openConsole]
  );

  if (machines.length === 0) {
    return <div className="text-fg-muted text-sm py-8 text-center">No desktops in this pool yet.</div>;
  }

  return (
    <DataTable
      rows={machines}
      columns={columns}
      rowId={(r) => r.id}
      defaultDensity="compact"
      onRowClick={(row) => openConsole(row)} />);


}

function SettingsTab({ pool, onSaved }) {
  const isPersistent = pool.type === 'persistent';
  const [name, setName] = useState(pool.name);
  const [sizeMin, setSizeMin] = useState(String(pool.sizeMin));
  const [sizeMax, setSizeMax] = useState(String(pool.sizeMax));
  const [idle, setIdle] = useState(pool.idleTimeoutMinutes ? String(pool.idleTimeoutMinutes) : '');
  const [resetOnLogoff, setResetOnLogoff] = useState(pool.resetOnLogoff);

  const save = () => {
    const min = parseInt(sizeMin, 10);
    const max = parseInt(sizeMax, 10);
    if (!Number.isFinite(min) || !Number.isFinite(max)) return toast.error('Sizes must be numeric');
    if (min > max) return toast.error('Min cannot exceed Max');
    onSaved(
      {
        name: name.trim(),
        sizeMin: min,
        sizeMax: max,
        idleTimeoutMinutes: idle ? parseInt(idle, 10) : null,
        resetOnLogoff
      },
      'Pool updated'
    );
  };

  return (
    <ResponsiveStack direction="col" gap={4}>
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <TextField label="Min (kept warm)" type="number" min={0} value={sizeMin} onChange={(e) => setSizeMin(e.target.value)} />
        <TextField label="Max (cap)" type="number" min={1} value={sizeMax} onChange={(e) => setSizeMax(e.target.value)} />
      </div>
      <TextField
        label="Idle timeout (minutes)"
        type="number"
        placeholder="Empty = never"
        value={idle}
        onChange={(e) => setIdle(e.target.value)} />

      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={isPersistent ? false : resetOnLogoff}
          disabled={isPersistent}
          onChange={(e) => setResetOnLogoff(!!e.target.checked)} />
        <span>
          Reset desktop on logoff
          <span className="block text-xs text-fg-muted">
            {isPersistent
              ? 'Ignored for persistent pools — each user keeps their own desktop and state across logoffs.'
              : 'Delta qcow2 is wiped and the backing image re-used on next connect, so every session starts clean.'}
          </span>
        </span>
      </label>
      <ButtonGroup attached={false}>
        <Button variant="primary" onClick={save}>Save changes</Button>
      </ButtonGroup>
    </ResponsiveStack>);

}

function desktopDotStatus(status) {
  switch (status) {
    case 'running':
      return 'online';
    case 'starting':
    case 'rebuilding':
      return 'provisioning';
    case 'paused':
    case 'suspended':
      return 'degraded';
    case 'error':
      return 'warning';
    default:
      return 'offline';
  }
}

function Stat({ label, value, hint, mono }) {
  return (
    <div className="flex flex-col gap-0.5 p-3 bg-surface-2 rounded-md border border-border-subtle">
      <span className="text-xs uppercase tracking-wide text-fg-muted">{label}</span>
      <span className={`text-2xl ${mono ? 'font-mono' : 'font-semibold'}`}>{value}</span>
      {hint ? <span className="text-xs text-fg-subtle">{hint}</span> : null}
    </div>);

}

function KV({ label, value, mono }) {
  return (
    <div className="flex items-center gap-4 py-1.5 border-b border-border-subtle last:border-b-0">
      <span className="text-sm text-fg-muted w-36 shrink-0">{label}</span>
      <span className={`text-sm ${mono ? 'font-mono text-xs' : ''} truncate`}>{value}</span>
    </div>);

}
