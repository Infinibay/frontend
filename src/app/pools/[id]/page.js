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
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
  EmptyState,
  IconButton,
  Menu,
  MenuItem,
  ResponsiveStack,
  Skeleton,
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
import { fetchTemplates } from '@/state/slices/templates';
import { createDebugger } from '@/utils/debug';
import { IDLE_STATUSES, typeLabel } from '../_components/pool-helpers';
import { SCALE_POOL, DRAIN_POOL, UNDRAIN_POOL, POOL_FIELDS } from '../_components/pools-gql';

const debug = createDebugger('frontend:pages:pool-detail');

const GOLDEN_IMAGES_QUERY = gql`
  query PoolGoldenImages {
    goldenImages { id name version osType }
  }
`;

// Reuse the shared PoolFields fragment so the detail query can never drift
// from the list query's selection set.
const POOL_QUERY = gql`
  query PoolDetail($id: ID!) {
    pool(id: $id) { ...PoolFields }
  }
  ${POOL_FIELDS}
`;

const UPDATE_POOL = gql`
  mutation UpdatePool($id: ID!, $input: UpdatePoolInput!) {
    updatePool(id: $id, input: $input) { success error }
  }
`;

export default function PoolDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(true);
  // Track the load error separately from a null result so we can tell an
  // actual fetch failure (show error + retry) apart from a successful query
  // that simply returned no pool (show "Pool not found").
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const [goldenImages, setGoldenImages] = useState([]);

  const departments = useSelector((s) => s.departments?.items ?? []);
  const templates = useSelector((s) => s.templates?.items ?? []);

  // Blueprints (templates) aren't preloaded by init.js, so warm the slice here
  // to resolve the pool's blueprint name instead of showing a raw id prefix.
  useEnsureData('templates', fetchTemplates, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 5 * 60 * 1000
  });

  // Keep the global VM inventory warm so the Desktops tab and the
  // running/idle counts work even on a direct navigation to this page.
  const {
    data: vms,
    isLoading: vmsLoading,
    error: vmsError,
    hasData: hasVms,
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

  const fetchPool = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const { data, error } = await client.query({
        query: POOL_QUERY,
        variables: { id },
        fetchPolicy: 'network-only'
      });
      // errorPolicy:'all' (apollo-client.js) RESOLVES a GraphQL error instead of
      // throwing, so the catch below never fires for one — a transient silent-poll
      // error would fall straight through to setPool(null) and unmount the page to
      // "Pool not found". On a silent poll that resolved with an error or no pool,
      // keep the last-good render.
      if (silent && (error || !data?.pool)) return;
      setPool(data?.pool ?? null);
      setError(null);
    } catch (err) {
      // A failed silent poll must not blow away an already-rendered pool.
      if (!silent) {
        setError(err);
        toast.error(`Failed to load pool: ${err.message}`);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [id]);

  const refresh = useCallback(() => {
    fetchPool();
    refreshVms();
  }, [fetchPool, refreshVms]);

  useEffect(() => { fetchPool(); }, [fetchPool]);

  // Load published golden images once so we can show the pinned base by name.
  useEffect(() => {
    let cancelled = false;
    client
      .query({ query: GOLDEN_IMAGES_QUERY, fetchPolicy: 'cache-first' })
      .then(({ data }) => { if (!cancelled) setGoldenImages(data?.goldenImages ?? []); })
      .catch((err) => debug.warn('golden images load', err));
    return () => { cancelled = true; };
  }, []);

  // Live refresh: pools spin desktops up/down in the background, so poll the
  // pool + the VM inventory on a light cadence while this page is open.
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPool({ silent: true });
      refreshVms();
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchPool, refreshVms]);

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
    setBusy(true);
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
    } finally {
      setBusy(false);
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
  // A genuine fetch failure — distinct from a successful query that returned no
  // pool — gets an error state with a Retry, not a misleading "Pool not found".
  if (error && !pool) {
    return (
      <Page>
        <Alert
          tone="danger"
          title="Couldn't load pool"
          actions={
          <ResponsiveStack direction="row" gap={2} align="center">
              <Button size="sm" icon={<RefreshCcw size={16} />} onClick={() => fetchPool()}>
                Retry
              </Button>
              <Button size="sm" variant="secondary" onClick={() => router.push('/pools')}>
                Back to pools
              </Button>
            </ResponsiveStack>
          }>
          {String(error?.message || error)}
        </Alert>
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
            secondary={
            <ResponsiveStack direction="row" gap={2} align="center">
                <StatusDot
                status={pool.draining ? 'warning' : pool.currentSize < pool.sizeMin ? 'degraded' : 'online'}
                size={8}
                label={null} />

                <Badge tone={pool.type === 'persistent' ? 'info' : 'neutral'}>{typeLabel(pool.type)}</Badge>
                {pool.draining ? <Badge tone="warning">draining</Badge> : null}
                <IconButton size="sm" variant="ghost" label="Refresh" icon={<RefreshCcw size={14} />} onClick={refresh} disabled={loading} />
              </ResponsiveStack>
            } />

        </ResponsiveStack>

        <Tabs defaultValue="overview" variant="underline">
          <TabList>
            <Tab value="overview" icon={<Layers size={14} />}>Overview</Tab>
            <Tab value="desktops" icon={<Monitor size={14} />}>
              {hasVms ? `Desktops · ${poolMachines.length}` : 'Desktops'}
            </Tab>
            <Tab value="settings" icon={<Settings2 size={14} />}>Settings</Tab>
          </TabList>

          <TabPanel value="overview">
            <OverviewTab
              pool={pool}
              deptName={deptName}
              templateName={templateName}
              goldenImageName={goldenImageName}
              poolMachines={poolMachines}
              busy={busy}
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
            <DesktopsTab
              machines={poolMachines}
              loading={vmsLoading && !hasVms}
              error={vmsError}
              onRetry={refreshVms}
              onRefresh={refresh} />

          </TabPanel>

          <TabPanel value="settings">
            <SettingsTab
              pool={pool}
              busy={busy}
              onSaved={(patch, msg) => run(UPDATE_POOL, { id: pool.id, input: patch }, msg)} />

          </TabPanel>
        </Tabs>
      </ResponsiveStack>
    </Page>);

}

function OverviewTab({ pool, deptName, templateName, goldenImageName, poolMachines, busy, onScale, onToggleDrain }) {
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
                loading={busy}
                disabled={busy}
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
              loading={busy}
              disabled={busy}
              onClick={onToggleDrain}>

              {pool.draining ? 'Resume pool' : 'Drain pool'}
            </Button>
          </ResponsiveStack>
        </section>
      </div>
    </ResponsiveStack>);

}

function DesktopsTab({ machines, loading, error, onRetry, onRefresh }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [busyId, setBusyId] = useState(null);
  // Hard power-off terminates any active session, so confirm first.
  const [powerOffTarget, setPowerOffTarget] = useState(null);

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
            <StatusDot status={desktopDotStatus(r.status)} size={8} label={null} />
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
                    <MenuItem icon={<PowerOff size={14} />} danger onClick={() => setPowerOffTarget(r)}>
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

  // Confirm dialog for the destructive hard power-off, rendered alongside
  // whichever state the tab is in.
  const confirmDialog = (
    <Dialog open={!!powerOffTarget} onClose={() => setPowerOffTarget(null)} size="sm">
      <DialogTitle>
        <ResponsiveStack direction="row" gap={2} align="center">
          <PowerOff size={16} />
          Power off desktop
        </ResponsiveStack>
      </DialogTitle>
      <DialogDescription>
        {powerOffTarget?.user?.email ?
        `“${powerOffTarget?.name}” is assigned to ${powerOffTarget.user.email}.` :
        `Hard power off “${powerOffTarget?.name}”.`}
      </DialogDescription>
      <DialogBody>
        <p className="text-sm text-fg-muted">
          This is a hard power off — any active session is terminated immediately and unsaved work is lost.
        </p>
      </DialogBody>
      <DialogButtons align="end">
        <Button variant="secondary" onClick={() => setPowerOffTarget(null)}>Cancel</Button>
        <Button
          variant="destructive"
          onClick={() => {
            const target = powerOffTarget;
            setPowerOffTarget(null);
            act(target, stopVm, 'Powering off desktop');
          }}>
          Power off
        </Button>
      </DialogButtons>
    </Dialog>);

  let body;
  if (loading) {
    body = (
      <ResponsiveStack direction="col" gap={2}>
        <Skeleton height={40} />
        <Skeleton height={40} />
        <Skeleton height={40} />
      </ResponsiveStack>);
  } else if (error) {
    body = (
      <Alert
        tone="danger"
        title="Couldn't load desktops"
        actions={
        <Button size="sm" icon={<RefreshCcw size={16} />} onClick={onRetry}>
            Retry
          </Button>
        }>
        {String(error?.message || error)}
      </Alert>);
  } else if (machines.length === 0) {
    body = (
      <EmptyState
        icon={<Monitor size={18} />}
        title="No desktops in this pool yet"
        description="Desktops appear here as the pool spins them up to meet its warm minimum." />);
  } else {
    body = (
      <DataTable
        rows={machines}
        columns={columns}
        rowId={(r) => r.id}
        defaultDensity="compact"
        onRowClick={(row) => openConsole(row)} />);
  }

  return (
    <>
      {body}
      {confirmDialog}
    </>);


}

function SettingsTab({ pool, busy, onSaved }) {
  const isPersistent = pool.type === 'persistent';
  const [name, setName] = useState(pool.name);
  const [sizeMin, setSizeMin] = useState(String(pool.sizeMin));
  const [sizeMax, setSizeMax] = useState(String(pool.sizeMax));
  const [idle, setIdle] = useState(pool.idleTimeoutMinutes ? String(pool.idleTimeoutMinutes) : '');
  const [resetOnLogoff, setResetOnLogoff] = useState(pool.resetOnLogoff);
  const [errors, setErrors] = useState({});

  const save = () => {
    const min = parseInt(sizeMin, 10);
    const max = parseInt(sizeMax, 10);
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!Number.isFinite(min)) e.sizeMin = 'Enter a number';
    else if (min < 0) e.sizeMin = 'Cannot be negative';
    if (!Number.isFinite(max)) e.sizeMax = 'Enter a number';
    else if (max < 1) e.sizeMax = 'Must be at least 1';
    if (Number.isFinite(min) && Number.isFinite(max) && min > max) e.sizeMax = 'Min cannot exceed Max';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
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
      <TextField
        label="Name"
        value={name}
        error={errors.name}
        onChange={(e) => {
          setName(e.target.value);
          setErrors((p) => (p.name ? { ...p, name: undefined } : p));
        }} />

      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Min (kept warm)"
          type="number"
          min={0}
          value={sizeMin}
          error={errors.sizeMin}
          onChange={(e) => {
            setSizeMin(e.target.value);
            setErrors((p) => (p.sizeMin || p.sizeMax ? { ...p, sizeMin: undefined, sizeMax: undefined } : p));
          }} />

        <TextField
          label="Max (cap)"
          type="number"
          min={1}
          value={sizeMax}
          error={errors.sizeMax}
          onChange={(e) => {
            setSizeMax(e.target.value);
            setErrors((p) => (p.sizeMin || p.sizeMax ? { ...p, sizeMin: undefined, sizeMax: undefined } : p));
          }} />

      </div>
      <TextField
        label="Idle timeout (minutes)"
        type="number"
        placeholder="Empty = never"
        value={idle}
        onChange={(e) => setIdle(e.target.value)} />

      <Checkbox
        label="Reset desktop on logoff"
        description={
        isPersistent ?
        'Ignored for persistent pools — each user keeps their own desktop and state across logoffs.' :
        'Delta qcow2 is wiped and the backing image re-used on next connect, so every session starts clean.'
        }
        checked={isPersistent ? false : resetOnLogoff}
        disabled={isPersistent}
        onChange={(e) => setResetOnLogoff(!!e.target.checked)} />

      <ButtonGroup attached={false}>
        <Button variant="primary" onClick={save} loading={busy} disabled={busy}>Save changes</Button>
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
