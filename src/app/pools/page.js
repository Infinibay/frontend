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
  EmptyState,
  IconButton,
  Menu,
  ResponsiveStack,
  Select,
  StatusDot,
  TextField } from
'@infinibay/harbor';
import {
  Plus,
  MoreHorizontal,
  RefreshCcw,
  Pause,
  Play,
  Trash2,
  Move3d } from
'lucide-react';

import client from '@/apollo-client';
import { PageHeader } from '@/components/common/PageHeader';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:pages:pools');

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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PoolsListPage() {
  const router = useRouter();
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scaleTarget, setScaleTarget] = useState(null);

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

  const fetchPools = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.query({
        query: POOLS_QUERY,
        fetchPolicy: 'network-only'
      });
      setPools(data?.pools ?? []);
    } catch (err) {
      debug.error('fetch', err);
      toast.error(`Failed to load pools: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPools();
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

  const columns = useMemo(
    () => [
    {
      id: 'health',
      header: '',
      width: 28,
      cell: ({ row }) =>
      <StatusDot
        status={
        row.draining ?
        'warning' :
        row.currentSize < row.sizeMin ?
        'degraded' :
        'online'
        }
        size={8} />


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
      <Badge tone={row.type === 'persistent' ? 'info' : 'neutral'} size="sm">
            {row.type}
          </Badge>

    },
    {
      id: 'size',
      header: 'Size',
      cell: ({ row }) =>
      <span className="font-mono text-xs">
            {row.currentSize}
            <span className="text-fg-subtle"> / {row.sizeMin}–{row.sizeMax}</span>
          </span>

    },
    {
      id: 'state',
      header: 'State',
      cell: ({ row }) =>
      row.draining ?
      <Badge tone="warning" size="sm">draining</Badge> :

      <span className="text-fg-muted text-xs">live</span>

    },
    {
      id: 'actions',
      header: '',
      width: 40,
      cell: ({ row }) =>
      <Menu
        trigger={
        <IconButton size="sm" variant="ghost" aria-label="Actions">
                <MoreHorizontal size={14} />
              </IconButton>
        }
        items={[
        {
          id: 'scale',
          label: 'Scale…',
          icon: <Move3d size={14} />,
          onSelect: () => setScaleTarget(row)
        },
        row.draining ?
        {
          id: 'undrain',
          label: 'Resume',
          icon: <Play size={14} />,
          onSelect: () =>
          runMutation(UNDRAIN_POOL, { id: row.id }, 'Pool resumed')
        } :
        {
          id: 'drain',
          label: 'Drain',
          icon: <Pause size={14} />,
          onSelect: () =>
          runMutation(DRAIN_POOL, { id: row.id }, 'Pool draining')
        },
        {
          id: 'delete',
          label: 'Delete',
          icon: <Trash2 size={14} />,
          tone: 'danger',
          onSelect: () => {
            if (
            confirm(
              `Delete pool "${row.name}"? This archives all ${row.currentSize} desktop(s) and removes the pool.`
            ))
            {
              runMutation(DELETE_POOL, { id: row.id }, 'Pool deleted');
            }
          }
        }]
        } />


    }],

    [deptNameById, templateNameById, runMutation]
  );

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PageHeader
          title="Pools"
          count={`${pools.length} pool${pools.length !== 1 ? 's' : ''}`}
          secondary={
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="Refresh"
            onClick={fetchPools}
            disabled={loading}>
            
              <RefreshCcw size={14} />
            </IconButton>
          }
          primary={
          <Button
            size="sm"
            variant="primary"
            icon={<Plus size={14} />}
            onClick={() => setDialogOpen(true)}>
            
              New Pool
            </Button>
          } />
        

        {loading && pools.length === 0 ?
        <div className="text-fg-muted text-sm">Loading…</div> :
        pools.length === 0 ?
        <EmptyState
          title="No pools yet"
          description="A pool groups desktops sharing a blueprint + golden image."
          action={
          <Button variant="primary" icon={<Plus size={14} />} onClick={() => setDialogOpen(true)}>
                New Pool
              </Button>
          } /> :


        <DataTable
          rows={pools}
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
  const [type, setType] = useState('non-persistent');
  const [sizeMin, setSizeMin] = useState('0');
  const [sizeMax, setSizeMax] = useState('10');
  const [idleTimeoutMinutes, setIdleTimeoutMinutes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error('Name required');
    if (!departmentId) return toast.error('Department required');
    if (!templateId) return toast.error('Blueprint required');
    const min = parseInt(sizeMin, 10);
    const max = parseInt(sizeMax, 10);
    if (!Number.isFinite(min) || !Number.isFinite(max)) return toast.error('Sizes must be numeric');
    if (min > max) return toast.error('sizeMin cannot exceed sizeMax');

    setSubmitting(true);
    try {
      const { data } = await client.mutate({
        mutation: CREATE_POOL,
        variables: {
          input: {
            name: name.trim(),
            departmentId,
            templateId,
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
      toast.success(`Pool "${name}" created`);
      onCreated();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onClose={onClose} title="New Pool">
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
          label="Type"
          value={type}
          onChange={setType}
          options={[
          { value: 'non-persistent', label: 'Non-persistent (reset on logoff)' },
          { value: 'persistent', label: 'Persistent (each user has their own)' }]
          } />
        
        <div className="grid grid-cols-2 gap-3">
          <TextField label="Size min" type="number" min={0} value={sizeMin} onChange={(e) => setSizeMin(e.target.value)} />
          <TextField label="Size max" type="number" min={1} value={sizeMax} onChange={(e) => setSizeMax(e.target.value)} />
        </div>
        <TextField
          label="Idle timeout (minutes)"
          type="number"
          placeholder="Empty = never"
          value={idleTimeoutMinutes}
          onChange={(e) => setIdleTimeoutMinutes(e.target.value)} />
        
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>Create pool</Button>
        </div>
      </div>
    </Dialog>);

}

function ScalePoolDialog({ pool, onClose, onScaled }) {
  const [target, setTarget] = useState(String(pool.currentSize));
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const n = parseInt(target, 10);
    if (!Number.isFinite(n) || n < 0) return toast.error('Enter a non-negative integer');
    if (n > pool.sizeMax) return toast.error(`Cannot exceed sizeMax (${pool.sizeMax})`);

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
    <Dialog open onClose={onClose} title={`Scale "${pool.name}"`}>
      <div className="flex flex-col gap-4 min-w-[380px]">
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
        
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>Apply</Button>
        </div>
      </div>
    </Dialog>);

}