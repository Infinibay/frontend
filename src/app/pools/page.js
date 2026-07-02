'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import {
  Page,
  Button,
  IconButton,
  ResponsiveStack,
  Select } from
'@infinibay/harbor';
import { Plus, RefreshCcw } from 'lucide-react';

import client from '@/apollo-client';
import { PageHeader } from '@/components/common/PageHeader';
import { usePageHeader } from '@/hooks/usePageHeader';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { fetchVms } from '@/state/slices/vms';
import { fetchTemplates } from '@/state/slices/templates';
import { createDebugger } from '@/utils/debug';

import { POOLS_QUERY, DELETE_POOL } from './_components/pools-gql';
import { IDLE_STATUSES } from './_components/pool-helpers';
import { HELP_CONFIG } from './_components/help-config';
import { createPoolColumns, poolRowActions } from './_components/pool-columns';
import { PoolsList } from './_components/pools-list';
import { NewPoolDialog } from './_components/new-pool-dialog';
import { ScalePoolDialog } from './_components/scale-pool-dialog';
import { DeletePoolDialog } from './_components/delete-pool-dialog';

const debug = createDebugger('frontend:pages:pools');

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PoolsListPage() {
  const router = useRouter();
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scaleTarget, setScaleTarget] = useState(null);
  const [poolToDelete, setPoolToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deptFilter, setDeptFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const departments = useSelector((s) => s.departments?.items ?? []);
  const templates = useSelector((s) => s.templates?.items ?? []);

  // Blueprints (templates) are not part of init.js's deferred preload, so a
  // direct navigation to /pools would otherwise leave the New Pool dialog's
  // Blueprint picker empty and the list's Blueprint column showing raw ids.
  // Warm the slice the same way we keep the VM inventory warm.
  useEnsureData('templates', fetchTemplates, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 5 * 60 * 1000
  });
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
      setError(null);
    } catch (err) {
      debug.error('fetch', err);
      // Only surface a persistent error on a foreground load; a failed silent
      // poll shouldn't blow away an already-rendered table.
      if (!silent) {
        setError(err);
        toast.error(`Failed to load pools: ${err.message}`);
      }
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

  // Live pool updates: realTimeReduxService refetches the Apollo cache on
  // backend 'pools' websocket events and broadcasts this CustomEvent, letting
  // us refresh instantly (create/scale/delete) instead of waiting for the
  // 20s poll. Silent so it doesn't flash the loading state.
  useEffect(() => {
    const onPoolsChanged = () => fetchPools({ silent: true });
    window.addEventListener('infinibay:pools:changed', onPoolsChanged);
    return () =>
      window.removeEventListener('infinibay:pools:changed', onPoolsChanged);
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

  // title is intentionally omitted: the in-page <PageHeader> renders the page
  // <h1> (with count + controls). Setting it here too would make GlobalHeader
  // emit a duplicate <h1>. We still drive breadcrumbs + help from this hook.
  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Pools', isCurrent: true }],

      actions: [],
      helpConfig: HELP_CONFIG,
      helpTooltip: 'Pools help'
    },
    []
  );

  const columns = useMemo(
    () =>
    createPoolColumns({
      deptNameById,
      templateNameById,
      runningByPool,
      runMutation,
      onScale: setScaleTarget,
      onDelete: setPoolToDelete
    }),
    [deptNameById, templateNameById, runningByPool, runMutation]
  );

  // Right-click menu shares the exact same action descriptors as each row's
  // kebab (see poolRowActions), so the two surfaces cannot drift.
  const buildRowMenu = useCallback(
    (row) =>
    poolRowActions({
      row,
      onScale: setScaleTarget,
      onDelete: setPoolToDelete,
      runMutation
    }),
    [runMutation]
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
                <div className="w-full sm:w-[180px]">
                  <Select
                aria-label="Filter by department"
                value={deptFilter}
                onChange={setDeptFilter}
                options={[
                { value: 'all', label: 'All departments' },
                ...departments.map((d) => ({ value: d.id, label: d.name }))]
                } />

                </div>
                <div className="w-full sm:w-[170px]">
                  <Select
                aria-label="Filter by pool type"
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


        <PoolsList
          error={error}
          pools={pools}
          loading={loading}
          filteredPools={filteredPools}
          columns={columns}
          onRetry={() => fetchPools()}
          onNew={() => setDialogOpen(true)}
          onClearFilters={() => {
            setDeptFilter('all');
            setTypeFilter('all');
          }}
          onRowClick={(r) => router.push(`/pools/${r.id}`)}
          buildRowMenu={buildRowMenu} />

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

      <DeletePoolDialog
        pool={poolToDelete}
        loading={deleting}
        onClose={() => setPoolToDelete(null)}
        onConfirm={async () => {
          const target = poolToDelete;
          if (!target) return;
          // Backend archives every member desktop sequentially before it
          // returns, so keep the dialog open with a busy Delete button until
          // the mutation resolves — then close on success, stay open on error.
          setDeleting(true);
          try {
            const { data } = await client.mutate({
              mutation: DELETE_POOL,
              variables: { id: target.id }
            });
            // deletePool resolves to a plain `Boolean!` — a `false` result means
            // the delete did not happen (and no error was thrown), so treat it as
            // a failure. A SuccessType-style envelope is also tolerated in case
            // the schema grows one later.
            const first = data && Object.values(data)[0];
            if (
              first === false ||
              (first && typeof first === 'object' && first.success === false)
            ) {
              throw new Error((first && first.error) || 'Failed to delete pool');
            }
            toast.success('Pool deleted');
            setPoolToDelete(null);
            fetchPools();
          } catch (err) {
            toast.error(err.message);
          } finally {
            setDeleting(false);
          }
        }} />

    </Page>);

}
