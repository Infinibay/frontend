'use client';

import { use, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import {
  Page,
  Alert,
  Badge,
  Button,
  ButtonGroup,
  DataTable,
  IconButton,
  ResponsiveStack,
  StatusDot,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TextField,
  Checkbox } from
'@infinibay/harbor';
import {
  ArrowLeft,
  RefreshCcw,
  Pause,
  Play,
  Move3d,
  Settings2,
  Layers,
  Monitor } from
'lucide-react';

import client from '@/apollo-client';
import { PageHeader } from '@/components/common/PageHeader';

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

  const departments = useSelector((s) => s.departments?.items ?? []);
  const templates = useSelector((s) => s.templates?.items ?? []);
  const vms = useSelector((s) => s.vms?.items ?? []);
  const deptName = departments.find((d) => d.id === pool?.departmentId)?.name;
  const templateName = templates.find((t) => t.id === pool?.templateId)?.name;

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.query({
        query: POOL_QUERY,
        variables: { id },
        fetchPolicy: 'network-only'
      });
      setPool(data?.pool ?? null);
    } catch (err) {
      toast.error(`Failed to load pool: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {fetch();}, [fetch]);

  const poolMachines = useMemo(
    () => vms.filter((v) => v.poolId === id),
    [vms, id]
  );

  const run = async (mutation, variables, msg) => {
    try {
      const { data } = await client.mutate({ mutation, variables });
      const result = data && Object.values(data)[0];
      if (result && typeof result === 'object' && result.success === false) {
        throw new Error(result.error || 'mutation failed');
      }
      toast.success(msg);
      fetch();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading && !pool) {
    return <Page><div className="text-fg-muted">Loading…</div></Page>;
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
          <IconButton size="sm" variant="ghost" aria-label="Back" onClick={() => router.push('/pools')}>
            <ArrowLeft size={14} />
          </IconButton>
          <PageHeader
            title={pool.name}
            count={
            <ResponsiveStack direction="row" gap={2} align="center">
                <StatusDot
                status={pool.draining ? 'warning' : pool.currentSize < pool.sizeMin ? 'degraded' : 'online'}
                size={8} />
              
                <Badge tone={pool.type === 'persistent' ? 'info' : 'neutral'} size="sm">{pool.type}</Badge>
                {pool.draining ? <Badge tone="warning" size="sm">draining</Badge> : null}
              </ResponsiveStack>
            }
            secondary={
            <IconButton size="sm" variant="ghost" aria-label="Refresh" onClick={fetch} disabled={loading}>
                <RefreshCcw size={14} />
              </IconButton>
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
            <DesktopsTab machines={poolMachines} />
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

function OverviewTab({ pool, deptName, templateName, poolMachines, onScale, onToggleDrain }) {
  const [scaleInput, setScaleInput] = useState(String(pool.currentSize));
  const runningCount = poolMachines.filter((m) => m.status === 'running').length;
  const idleCount = poolMachines.filter((m) => ['off', 'stopped', 'paused'].includes(m.status)).length;

  return (
    <ResponsiveStack direction="col" gap={4}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Current size" value={pool.currentSize} hint={`${pool.sizeMin}–${pool.sizeMax} range`} />
        <Stat label="Running" value={runningCount} />
        <Stat label="Idle" value={idleCount} />
        <Stat label="Type" value={pool.type} mono />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h3 className="text-sm uppercase tracking-wide text-fg-muted mb-2">Configuration</h3>
          <KV label="Department" value={deptName ?? pool.departmentId.slice(0, 8)} />
          <KV label="Blueprint" value={templateName ?? pool.templateId.slice(0, 8)} />
          <KV label="Golden image" value={pool.goldenImageId ?? '—'} mono />
          <KV label="Idle timeout" value={pool.idleTimeoutMinutes ? `${pool.idleTimeoutMinutes} min` : 'never'} />
          <KV label="Reset on logoff" value={pool.resetOnLogoff ? 'yes' : 'no'} />
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

function DesktopsTab({ machines }) {
  const router = useRouter();
  const columns = useMemo(
    () => [
    {
      id: 'status',
      header: 'Status',
      width: 100,
      cell: ({ row: r }) =>
      <ResponsiveStack direction="row" gap={2} align="center">
            <StatusDot status={r.status === 'running' ? 'online' : 'offline'} size={8} />
            <span className="text-xs text-fg-muted">{r.status}</span>
          </ResponsiveStack>

    },
    { id: 'name', header: 'Name', cell: ({ row: r }) => <span className="font-medium">{r.name}</span> },
    { id: 'user', header: 'Assigned', cell: ({ row: r }) => r.user?.email ?? <span className="text-fg-subtle">—</span> },
    { id: 'ip', header: 'IP', cell: ({ row: r }) => r.localIP ? <span className="font-mono text-xs">{r.localIP}</span> : '—' }],

    []
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
      onRowClick={(row) => router.push(`/departments/${row.department?.name || row.departmentId}/vm/${row.id}`)} />);


}

function SettingsTab({ pool, onSaved }) {
  const [name, setName] = useState(pool.name);
  const [sizeMin, setSizeMin] = useState(String(pool.sizeMin));
  const [sizeMax, setSizeMax] = useState(String(pool.sizeMax));
  const [idle, setIdle] = useState(pool.idleTimeoutMinutes ? String(pool.idleTimeoutMinutes) : '');
  const [resetOnLogoff, setResetOnLogoff] = useState(pool.resetOnLogoff);

  const save = () => {
    const min = parseInt(sizeMin, 10);
    const max = parseInt(sizeMax, 10);
    if (!Number.isFinite(min) || !Number.isFinite(max)) return toast.error('Sizes must be numeric');
    if (min > max) return toast.error('sizeMin cannot exceed sizeMax');
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
        <TextField label="Size min" type="number" min={0} value={sizeMin} onChange={(e) => setSizeMin(e.target.value)} />
        <TextField label="Size max" type="number" min={1} value={sizeMax} onChange={(e) => setSizeMax(e.target.value)} />
      </div>
      <TextField
        label="Idle timeout (minutes)"
        type="number"
        placeholder="Empty = never"
        value={idle}
        onChange={(e) => setIdle(e.target.value)} />
      
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={resetOnLogoff} onChange={(e) => setResetOnLogoff(!!e.target.checked)} />
        <span>
          Reset desktop on logoff
          <span className="block text-xs text-fg-muted">
            Non-persistent pools only. Delta qcow2 is wiped and the backing image re-used on next connect.
          </span>
        </span>
      </label>
      <ButtonGroup attached={false}>
        <Button variant="primary" onClick={save}>Save changes</Button>
      </ButtonGroup>
    </ResponsiveStack>);

}

function Stat({ label, value, hint, mono }) {
  return (
    <div className="flex flex-col gap-0.5 p-3 bg-white/[0.02] rounded-md border border-white/5">
      <span className="text-xs uppercase tracking-wide text-fg-muted">{label}</span>
      <span className={`text-2xl ${mono ? 'font-mono' : 'font-semibold'}`}>{value}</span>
      {hint ? <span className="text-xs text-fg-subtle">{hint}</span> : null}
    </div>);

}

function KV({ label, value, mono }) {
  return (
    <div className="flex items-center gap-4 py-1.5 border-b border-white/5 last:border-b-0">
      <span className="text-sm text-fg-muted w-36 shrink-0">{label}</span>
      <span className={`text-sm ${mono ? 'font-mono text-xs' : ''} truncate`}>{value}</span>
    </div>);

}