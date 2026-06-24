'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import {
  Page,
  Badge,
  Button,
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
  SegmentedControl,
  Select,
  Spinner,
  StatusDot,
  TextField,
  Tooltip } from
'@infinibay/harbor';
import {
  Plus,
  MoreHorizontal,
  RefreshCcw,
  Pause,
  Play,
  Trash2,
  Move3d,
  Layers,
  AlertCircle } from
'lucide-react';

import client from '@/apollo-client';
import { PageHeader } from '@/components/common/PageHeader';
import { usePageHeader } from '@/hooks/usePageHeader';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { fetchVms } from '@/state/slices/vms';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:pages:pools');

const IDLE_STATUSES = ['off', 'stopped', 'paused', 'suspended'];

// Human-facing label for the pool persistence model.
function typeLabel(type) {
  return type === 'persistent' ? 'Persistent' : 'Non-persistent';
}

// One-line health summary used for the status dot tooltip + a11y label.
function healthLabel(pool) {
  if (pool.draining) return 'Draining — existing sessions keep running, no new connections handed out';
  if (pool.currentSize < pool.sizeMin) return `Below minimum (${pool.currentSize}/${pool.sizeMin}) — refilling`;
  return 'Healthy — at or above the warm minimum';
}

function healthDot(pool) {
  if (pool.draining) return 'warning';
  if (pool.currentSize < pool.sizeMin) return 'degraded';
  return 'online';
}

// ---------------------------------------------------------------------------
// GraphQL
// ---------------------------------------------------------------------------

const POOL_FIELDS = gql`
  fragment PoolFields on Pool {
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
`;

const POOLS_QUERY = gql`
  query Pools { pools { ...PoolFields } }
  ${POOL_FIELDS}
`;

const CREATE_POOL = gql`
  mutation CreatePool($input: CreatePoolInput!) {
    createPool(input: $input) { success error pool { ...PoolFields } }
  }
  ${POOL_FIELDS}
`;

const SCALE_POOL = gql`
  mutation ScalePool($id: ID!, $targetSize: Int!) {
    scalePool(id: $id, targetSize: $targetSize) { success error pool { ...PoolFields } }
  }
  ${POOL_FIELDS}
`;

const DRAIN_POOL = gql`
  mutation DrainPool($id: ID!) { drainPool(id: $id) { success error pool { ...PoolFields } } }
  ${POOL_FIELDS}
`;

const UNDRAIN_POOL = gql`
  mutation UndrainPool($id: ID!) { undrainPool(id: $id) { success error pool { ...PoolFields } } }
  ${POOL_FIELDS}
`;

const DELETE_POOL = gql`
  mutation DeletePool($id: ID!) { deletePool(id: $id) }
`;

const GOLDEN_IMAGES_FOR_POOLS = gql`
  query GoldenImagesForPools {
    goldenImages { id name osType status version }
  }
`;

// ---------------------------------------------------------------------------
// Contextual help (matches the house pattern used across the app)
// ---------------------------------------------------------------------------

const HELP_CONFIG = {
  title: 'Pools',
  description: 'Keep a set of desktops warm and ready so users connect instantly.',
  icon: <Layers size={20} />,
  sections: [
    {
      id: 'types',
      title: 'Persistent vs non-persistent',
      icon: <Layers size={16} />,
      content: (
        <p>
          <strong>Persistent</strong> pools assign each user their own desktop that keeps its state
          across logoffs. <strong>Non-persistent</strong> pools hand out any idle desktop and reset it
          to the golden image on logoff, so every session starts clean.
        </p>
      )
    },
    {
      id: 'sizing',
      title: 'Sizing & refill',
      icon: <Move3d size={16} />,
      content: (
        <p>
          <strong>Min</strong> is the number of desktops kept warm in the background; the refill job
          tops the pool up automatically. <strong>Max</strong> caps how large the pool can grow under
          on-demand load.
        </p>
      )
    },
    {
      id: 'draining',
      title: 'Draining',
      icon: <Pause size={16} />,
      content: (
        <p>
          Draining stops new check-outs while letting current sessions finish — use it before
          maintenance, then Resume to bring the pool back online.
        </p>
      )
    }
  ],
  quickTips: [
    'Click a pool to open its desktops and settings',
    'Drain a pool before maintenance to avoid cutting off users',
    'Min keeps desktops warm; Max caps on-demand growth'
  ]
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PoolsListPage() {
  const router = useRouter();
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scaleTarget, setScaleTarget] = useState(null);
  const [poolToDelete, setPoolToDelete] = useState(null);
  const [deptFilter, setDeptFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const departments = useSelector((s) => s.departments?.items ?? []);
  const templates = useSelector((s) => s.templates?.items ?? []);
  const deptNameById = useMemo(
    () => Object.fromEntries(departments.map((d) => [d.id, d.name])),
    [departments]
  );
  const templateNameById = useMemo(
    () => Object.fromEntries(templates.map((t) => [t.id, t.name])),
    [templates]
  );

  // Pull the VM inventory so we can show how many desktops are actually
  // running vs idle per pool (currentSize alone doesn't tell utilization).
  const { data: vms } = useEnsureData('vms', fetchVms, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 30 * 1000,
    transform: (data) => data.items || data || []
  });

  const runningByPool = useMemo(() => {
    const acc = {};
    (vms || []).forEach((m) => {
      if (!m.poolId || m.status === 'archived') return;
      if (!acc[m.poolId]) acc[m.poolId] = { running: 0, idle: 0 };
      if (m.status === 'running') acc[m.poolId].running += 1;
      else if (IDLE_STATUSES.includes(m.status)) acc[m.poolId].idle += 1;
    });
    return acc;
  }, [vms]);

  const fetchPools = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await client.query({
        query: POOLS_QUERY,
        fetchPolicy: 'network-only'
      });
      setPools(data?.pools ?? []);
    } catch (err) {
      debug.error('fetch', err);
      if (!silent) toast.error(`Failed to load pools: ${err.message}`);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  // Background refill spins desktops up/down, so keep currentSize fresh
  // while the operator has the list open.
  useEffect(() => {
    const interval = setInterval(() => fetchPools({ silent: true }), 20000);
    return () => clearInterval(interval);
  }, [fetchPools]);

  const runMutation = useCallback(
    async (mutation, variables, successMsg) => {
      try {
        const { data } = await client.mutate({ mutation, variables });
        const first = data && Object.values(data)[0];
        if (first && typeof first === 'object' && first.success === false) {
          throw new Error(first.error || 'mutation failed');
        }
        toast.success(successMsg);
        fetchPools();
      } catch (err) {
        toast.error(err.message);
      }
    },
    [fetchPools]
  );

  const filteredPools = useMemo(
    () =>
    pools.filter((p) => {
      if (deptFilter !== 'all' && p.departmentId !== deptFilter) return false;
      if (typeFilter !== 'all' && p.type !== typeFilter) return false;
      return true;
    }),
    [pools, deptFilter, typeFilter]
  );

  const totalDesktops = useMemo(() => pools.reduce((n, p) => n + p.currentSize, 0), [pools]);
  const totalRunning = useMemo(
    () => Object.values(runningByPool).reduce((n, x) => n + x.running, 0),
    [runningByPool]
  );

  const countText = pools.length === 0
    ? null
    : [
      `${pools.length} pool${pools.length !== 1 ? 's' : ''}`,
      `${totalDesktops} desktop${totalDesktops !== 1 ? 's' : ''}`,
      totalRunning > 0 ? `${totalRunning} running` : null].
      filter(Boolean).join(' · ');

  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Pools', isCurrent: true }],

      title: 'Pools',
      actions: [],
      helpConfig: HELP_CONFIG,
      helpTooltip: 'Pools help'
    },
    []
  );

  const columns = useMemo(
    () => [
    {
      id: 'health',
      header: '',
      width: 28,
      cell: ({ row }) =>
      <Tooltip content={healthLabel(row)}>
            <span className="inline-flex" aria-label={healthLabel(row)}>
              <StatusDot status={healthDot(row)} size={8} />
            </span>
          </Tooltip>

    },
    {
      id: 'name',
      header: 'Pool',
      cell: ({ row }) => <span className="font-medium">{row.name}</span>
    },
    {
      id: 'department',
      header: 'Department',
      cell: ({ row }) =>
      <span className="text-fg-muted text-sm">
            {deptNameById[row.departmentId] ?? row.departmentId.slice(0, 8)}
          </span>

    },
    {
      id: 'template',
      header: 'Blueprint',
      cell: ({ row }) =>
      <span className="text-fg-muted text-sm">
            {templateNameById[row.templateId] ?? row.templateId.slice(0, 8)}
          </span>

    },
    {
      id: 'type',
      header: 'Type',
      cell: ({ row }) =>
      <Badge tone={row.type === 'persistent' ? 'info' : 'neutral'}>
            {typeLabel(row.type)}
          </Badge>

    },
    {
      id: 'size',
      header: 'Capacity',
      cell: ({ row }) => {
        const live = runningByPool[row.id];
        return (
          <div className="flex flex-col leading-tight">
              <span className="font-mono text-xs">
                {row.currentSize}
                <span className="text-fg-subtle"> / {row.sizeMin}–{row.sizeMax}</span>
              </span>
              {live && live.running > 0 ?
            <span className="text-fg-subtle text-[11px]">{live.running} running</span> :
            null}
            </div>);

      }
    },
    {
      id: 'state',
      header: 'State',
      cell: ({ row }) =>
      row.draining ?
      <Badge tone="warning">draining</Badge> :

      <span className="text-fg-muted text-xs">live</span>

    },
    {
      id: 'actions',
      header: '',
      width: 40,
      cell: ({ row }) =>
      <Menu
        trigger={
        <IconButton size="sm" variant="ghost" label="Actions" icon={<MoreHorizontal size={14} />} />
        }>
            <MenuItem icon={<Move3d size={14} />} onClick={() => setScaleTarget(row)}>
              Scale…
            </MenuItem>
            {row.draining ?
        <MenuItem
          icon={<Play size={14} />}
          onClick={() => runMutation(UNDRAIN_POOL, { id: row.id }, 'Pool resumed')}>
                Resume
              </MenuItem> :

        <MenuItem
          icon={<Pause size={14} />}
          onClick={() => runMutation(DRAIN_POOL, { id: row.id }, 'Pool draining')}>
                Drain
              </MenuItem>
        }
            <MenuItem
          icon={<Trash2 size={14} />}
          danger
          onClick={() => setPoolToDelete(row)}>
              Delete
            </MenuItem>
          </Menu>


    }],

    [deptNameById, templateNameById, runningByPool, runMutation]
  );

  const hasFilters = deptFilter !== 'all' || typeFilter !== 'all';

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PageHeader
          title="Pools"
          count={countText}
          secondary={
          <IconButton
            size="sm"
            variant="ghost"
            label="Refresh"
            icon={<RefreshCcw size={14} />}
            onClick={() => fetchPools()}
            disabled={loading} />
          }
          primary={
          <Button
            size="sm"
            variant="primary"
            icon={<Plus size={14} />}
            onClick={() => setDialogOpen(true)}>

              New Pool
            </Button>
          }
          filters={
          pools.length > 0 ?
          <>
                <div className="w-[180px]">
                  <Select
                value={deptFilter}
                onChange={setDeptFilter}
                options={[
                { value: 'all', label: 'All departments' },
                ...departments.map((d) => ({ value: d.id, label: d.name }))]
                } />

                </div>
                <div className="w-[170px]">
                  <Select
                value={typeFilter}
                onChange={setTypeFilter}
                options={[
                { value: 'all', label: 'All types' },
                { value: 'persistent', label: 'Persistent' },
                { value: 'non-persistent', label: 'Non-persistent' }]
                } />

                </div>
                {hasFilters ?
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setDeptFilter('all');
                setTypeFilter('all');
              }}>
                    Clear
                  </Button> :
            null}
              </> :
          null
          } />


        {loading && pools.length === 0 ?
        <ResponsiveStack direction="row" gap={3} justify="center" align="center">
            <Spinner /> <span className="text-fg-muted text-sm">Loading pools…</span>
          </ResponsiveStack> :
        pools.length === 0 ?
        <EmptyState
          icon={<Layers size={18} />}
          title="No pools yet"
          description="A pool keeps desktops sharing a blueprint + golden image warm and ready to hand out."
          actions={
          <Button variant="primary" icon={<Plus size={14} />} onClick={() => setDialogOpen(true)}>
                New Pool
              </Button>
          } /> :

        filteredPools.length === 0 ?
        <EmptyState
          icon={<Layers size={18} />}
          title="No pools match the filters"
          description={`${pools.length} pool${pools.length !== 1 ? 's' : ''} don't match the current filters.`}
          actions={
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setDeptFilter('all');
              setTypeFilter('all');
            }}>
                Clear filters
              </Button>
          } /> :


        <DataTable
          rows={filteredPools}
          columns={columns}
          rowId={(r) => r.id}
          defaultDensity="compact"
          onRowClick={(r) => router.push(`/pools/${r.id}`)} />

        }
      </ResponsiveStack>

      {dialogOpen &&
      <NewPoolDialog
        onClose={() => setDialogOpen(false)}
        onCreated={() => {
          setDialogOpen(false);
          fetchPools();
        }} />

      }

      {scaleTarget &&
      <ScalePoolDialog
        pool={scaleTarget}
        onClose={() => setScaleTarget(null)}
        onScaled={() => {
          setScaleTarget(null);
          fetchPools();
        }} />

      }

      <Dialog open={!!poolToDelete} onClose={() => setPoolToDelete(null)} size="sm">
        <DialogTitle>
          <ResponsiveStack direction="row" gap={2} align="center">
            <AlertCircle size={16} />
            Delete pool
          </ResponsiveStack>
        </DialogTitle>
        <DialogDescription>
          {poolToDelete
            ? `This archives all ${poolToDelete.currentSize} desktop${poolToDelete.currentSize !== 1 ? 's' : ''} in “${poolToDelete.name}” and removes the pool.`
            : 'This action cannot be undone.'}
        </DialogDescription>
        <DialogBody>
          <p className="text-sm text-fg-muted">
            Active sessions on these desktops will be terminated. This cannot be undone.
          </p>
        </DialogBody>
        <DialogButtons align="end">
          <Button variant="secondary" onClick={() => setPoolToDelete(null)}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={() => {
              const target = poolToDelete;
              setPoolToDelete(null);
              runMutation(DELETE_POOL, { id: target.id }, 'Pool deleted');
            }}>
            Delete pool
          </Button>
        </DialogButtons>
      </Dialog>
    </Page>);

}

// ---------------------------------------------------------------------------
// Dialogs
// ---------------------------------------------------------------------------

function NewPoolDialog({ onClose, onCreated }) {
  const departments = useSelector((s) => s.departments?.items ?? []);
  const templates = useSelector((s) => s.templates?.items ?? []);
  const [name, setName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [goldenImageId, setGoldenImageId] = useState('');
  const [goldenImages, setGoldenImages] = useState([]);
  const [type, setType] = useState('non-persistent');
  const [sizeMin, setSizeMin] = useState('0');
  const [sizeMax, setSizeMax] = useState('10');
  const [idleTimeoutMinutes, setIdleTimeoutMinutes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load published golden images so the operator can pin the pool to a
  // specific sealed base instead of inheriting the blueprint's default.
  useEffect(() => {
    let cancelled = false;
    client.
    query({ query: GOLDEN_IMAGES_FOR_POOLS, fetchPolicy: 'network-only' }).
    then(({ data }) => {
      if (!cancelled) setGoldenImages(data?.goldenImages ?? []);
    }).
    catch((err) => debug.warn('golden images load', err));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error('Name required');
    if (!departmentId) return toast.error('Department required');
    if (!templateId) return toast.error('Blueprint required');
    const min = parseInt(sizeMin, 10);
    const max = parseInt(sizeMax, 10);
    if (!Number.isFinite(min) || !Number.isFinite(max)) return toast.error('Sizes must be numeric');
    if (min > max) return toast.error('Min cannot exceed Max');

    setSubmitting(true);
    try {
      const { data } = await client.mutate({
        mutation: CREATE_POOL,
        variables: {
          input: {
            name: name.trim(),
            departmentId,
            templateId,
            goldenImageId: goldenImageId || null,
            type,
            sizeMin: min,
            sizeMax: max,
            idleTimeoutMinutes: idleTimeoutMinutes ? parseInt(idleTimeoutMinutes, 10) : null,
            resetOnLogoff: true
          }
        }
      });
      const res = data?.createPool;
      if (!res?.success) throw new Error(res?.error || 'create failed');
      toast.success(`Pool “${name}” created`);
      onCreated();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>New Pool</DialogTitle>
      <DialogDescription>
        Group desktops sharing a blueprint and golden image, kept warm for instant hand-out.
      </DialogDescription>
      <DialogBody>
        <div className="flex flex-col gap-4 min-w-[480px]">
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          <Select
            label="Department"
            value={departmentId}
            onChange={setDepartmentId}
            options={[
            { value: '', label: '— pick a department —' },
            ...departments.map((d) => ({ value: d.id, label: d.name }))]
            } />

          <Select
            label="Blueprint"
            value={templateId}
            onChange={setTemplateId}
            options={[
            { value: '', label: '— pick a blueprint —' },
            ...templates.map((t) => ({ value: t.id, label: t.name }))]
            } />

          <Select
            label="Golden image (optional)"
            value={goldenImageId}
            onChange={setGoldenImageId}
            options={[
            { value: '', label: '— inherit from blueprint —' },
            ...goldenImages.
            filter((g) => g.status === 'published').
            map((g) => ({ value: g.id, label: `${g.name} · v${g.version} (${g.osType})` }))]
            } />

          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-fg-muted">Type</span>
            <SegmentedControl
              value={type}
              onChange={setType}
              items={[
              { value: 'non-persistent', label: 'Non-persistent' },
              { value: 'persistent', label: 'Persistent' }]
              } />

            <span className="text-xs text-fg-subtle">
              {type === 'persistent' ?
              'Each user keeps their own desktop and state across logoffs.' :
              'Any idle desktop is handed out and reset to the golden image on logoff.'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <TextField label="Min (kept warm)" type="number" min={0} value={sizeMin} onChange={(e) => setSizeMin(e.target.value)} />
            <TextField label="Max (cap)" type="number" min={1} value={sizeMax} onChange={(e) => setSizeMax(e.target.value)} />
          </div>
          <TextField
            label="Idle timeout (minutes)"
            type="number"
            placeholder="Empty = never"
            value={idleTimeoutMinutes}
            onChange={(e) => setIdleTimeoutMinutes(e.target.value)} />

        </div>
      </DialogBody>
      <DialogButtons align="end">
        <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} loading={submitting}>Create pool</Button>
      </DialogButtons>
    </Dialog>);

}

function ScalePoolDialog({ pool, onClose, onScaled }) {
  const [target, setTarget] = useState(String(pool.currentSize));
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const n = parseInt(target, 10);
    if (!Number.isFinite(n) || n < 0) return toast.error('Enter a non-negative integer');
    if (n > pool.sizeMax) return toast.error(`Cannot exceed Max (${pool.sizeMax})`);

    setSubmitting(true);
    try {
      const { data } = await client.mutate({
        mutation: SCALE_POOL,
        variables: { id: pool.id, targetSize: n }
      });
      const res = data?.scalePool;
      if (!res?.success) throw new Error(res?.error || 'scale failed');
      const delta = n - pool.currentSize;
      toast.success(
        delta === 0 ?
        'No change' :
        delta > 0 ?
        `Spawning ${delta} desktop(s)` :
        `Archiving ${-delta} desktop(s)`
      );
      onScaled();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onClose={onClose} size="sm">
      <DialogTitle>{`Scale “${pool.name}”`}</DialogTitle>
      <DialogDescription>
        Set the number of desktops to provision now. The background refill job still keeps at least Min warm.
      </DialogDescription>
      <DialogBody>
        <div className="flex flex-col gap-4 min-w-[360px]">
          <div className="text-sm text-fg-muted">
            Current: <span className="font-mono text-fg">{pool.currentSize}</span>
            {' · '}Range: <span className="font-mono text-fg">{pool.sizeMin}–{pool.sizeMax}</span>
          </div>
          <TextField
            label="Target size"
            type="number"
            min={0}
            max={pool.sizeMax}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            autoFocus />

        </div>
      </DialogBody>
      <DialogButtons align="end">
        <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} loading={submitting}>Apply</Button>
      </DialogButtons>
    </Dialog>);

}
