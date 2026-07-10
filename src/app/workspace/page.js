'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gql } from '@apollo/client';
import { useSelector } from 'react-redux';
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Page,
  ResponsiveGrid,
  ResponsiveStack,
  Skeleton,
  StatusDot,
} from '@infinibay/harbor';
import { Monitor, AlertCircle, RefreshCw, Play, Layers } from 'lucide-react';

import client from '@/apollo-client';
import { fetchVms } from '@/state/slices/vms';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { selectUser } from '@/state/slices/auth';
import { useOpenConsole } from '@/hooks/useOpenConsole';
import { toast } from 'sonner';

const POOLS_QUERY = gql`
  query WorkspacePools {
    pools {
      id
      name
      type
      draining
      currentSize
      sizeMax
      departmentId
    }
  }
`;

const CONNECT_POOL = gql`
  mutation ConnectToPool($poolId: ID!) { connectToPool(poolId: $poolId) }
`;

const MACHINE_QUERY = gql`
  query WorkspaceMachine($id: String!) {
    machine(id: $id) {
      id
      name
      status
      configuration
    }
  }
`;

function statusMeta(status) {
  const s = String(status || '').toLowerCase();
  if (s === 'running' || s === 'active') return { dot: 'online', label: 'Running' };
  if (s === 'paused' || s === 'suspended') return { dot: 'degraded', label: 'Paused' };
  if (s === 'starting' || s === 'provisioning') return { dot: 'provisioning', label: 'Starting' };
  // Cross-node migration in flight — a busy/transitional state, not "Stopped".
  if (s === 'moving') return { dot: 'provisioning', label: 'Moving…' };
  return { dot: 'offline', label: 'Stopped' };
}

function DesktopTile({ desktop, busy }) {
  // Frozen while a golden image is being built from this desktop — not connectable
  // (the backend refuses the console too). Overrides the run-state so it never reads
  // as a normal "Running" tile the user can connect to.
  const isLocked = !!desktop?.goldenImageBuildId;
  const meta = isLocked ? { dot: 'degraded', label: 'Building image' } : statusMeta(desktop.status);
  const graphic = typeof desktop?.configuration?.graphic === 'string'
    ? desktop.configuration.graphic
    : null;
  const canConnect = meta.dot === 'online' && graphic?.startsWith('spice://') && !isLocked;
  const openConsole = useOpenConsole();
  const [connecting, setConnecting] = useState(false);

  const onConnect = async () => {
    if (!canConnect || connecting) return;
    setConnecting(true);
    try {
      await openConsole(desktop, graphic);
    } finally {
      setConnecting(false);
    }
  };

  const os = desktop?.configuration?.os || desktop?.os;
  const cpu = desktop?.cpuCores;
  const ram = desktop?.ramGB;

  return (
    <Card
      variant="default"
      title={
        <ResponsiveStack direction="row" gap={2} align="center">
          <StatusDot status={meta.dot} size={10} />
          <span>{desktop.name}</span>
        </ResponsiveStack>
      }
      description={desktop.department?.name ? `${desktop.department.name}` : undefined}
      footer={
        <ResponsiveStack direction="row" gap={2} justify="between" align="center">
          <Badge tone={meta.dot === 'online' ? 'success' : 'neutral'}>
            {meta.label}
          </Badge>
          <Button
            variant="primary"
            size="sm"
            icon={<Play size={14} />}
            disabled={!canConnect || busy}
            loading={connecting}
            onClick={onConnect}
          >
            Connect
          </Button>
        </ResponsiveStack>
      }
    >
      <ResponsiveStack direction="row" gap={3} wrap>
        {os ? <span>{os}</span> : null}
        {cpu ? <span>· {cpu} vCPU</span> : null}
        {ram ? <span>· {ram} GB</span> : null}
        {desktop?.localIP ? (
          <span className="font-mono">· {desktop.localIP}</span>
        ) : null}
      </ResponsiveStack>
    </Card>
  );
}

function PoolTile({ pool, onConnect, connecting, busy }) {
  const atCapacity = pool.currentSize >= pool.sizeMax;
  const disabled = pool.draining || (atCapacity && pool.currentSize === 0) || busy;
  return (
    <Card
      variant="default"
      title={
        <ResponsiveStack direction="row" gap={2} align="center">
          <Layers size={14} />
          <span>{pool.name}</span>
        </ResponsiveStack>
      }
      description={pool.type === 'persistent' ? 'Persistent pool' : 'Non-persistent pool'}
      footer={
        <ResponsiveStack direction="row" gap={2} justify="between" align="center">
          {pool.draining ? (
            <Badge tone="warning">draining</Badge>
          ) : atCapacity ? (
            <Badge tone="neutral">at capacity</Badge>
          ) : (
            <Badge tone="success">available</Badge>
          )}
          <Button
            variant="primary"
            size="sm"
            icon={<Play size={14} />}
            disabled={disabled}
            loading={connecting}
            onClick={() => onConnect(pool)}
          >
            Connect
          </Button>
        </ResponsiveStack>
      }
    >
      <ResponsiveStack direction="row" gap={3} wrap>
        <span className="text-fg-muted">
          {pool.currentSize}/{pool.sizeMax} desktops
        </span>
      </ResponsiveStack>
    </Card>
  );
}

export default function WorkspacePage() {
  const user = useSelector(selectUser);
  const openConsole = useOpenConsole();

  const {
    data: machines,
    isLoading,
    error,
    refresh,
  } = useEnsureData('vms', fetchVms, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 30 * 1000,
    transform: (data) => data.items || data || [],
  });

  const myDesktops = useMemo(() => {
    const uid = user?.id;
    if (!uid) return [];
    return (machines || []).filter(
      (m) => m.userId === uid || m.user?.id === uid,
    );
  }, [machines, user?.id]);

  const [pools, setPools] = useState([]);
  const [poolsLoading, setPoolsLoading] = useState(true);
  const [poolsError, setPoolsError] = useState(null);
  const [connectingPoolId, setConnectingPoolId] = useState(null);
  const anyPoolConnecting = connectingPoolId !== null;

  // Tracks whether the component is still mounted so long-running pool
  // connect polling can bail out instead of querying / launching a console
  // on a page the user has already navigated away from.
  const abortedRef = useRef(false);
  useEffect(() => {
    abortedRef.current = false;
    return () => {
      abortedRef.current = true;
    };
  }, []);

  const fetchPools = useCallback(async () => {
    setPoolsLoading(true);
    setPoolsError(null);
    try {
      const { data } = await client.query({
        query: POOLS_QUERY,
        fetchPolicy: 'network-only',
      });
      setPools(data?.pools ?? []);
    } catch (err) {
      setPoolsError(err?.message || String(err));
      setPools([]);
    } finally {
      setPoolsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  const handleRefresh = useCallback(() => {
    refresh();
    fetchPools();
  }, [refresh, fetchPools]);

  const handlePoolConnect = useCallback(async (pool) => {
    setConnectingPoolId(pool.id);
    try {
      const { data } = await client.mutate({
        mutation: CONNECT_POOL,
        variables: { poolId: pool.id },
      });
      const machineId = data?.connectToPool;
      if (!machineId) throw new Error('No desktop returned from pool');

      // The desktop may need a few seconds to boot before its SPICE endpoint
      // is up. Poll until it's reachable, then launch the client automatically
      // so the user never has to come back and click Connect again.
      const deadline = Date.now() + 60_000;
      let launched = false;
      while (Date.now() < deadline) {
        if (abortedRef.current) return;
        const { data: mdata } = await client.query({
          query: MACHINE_QUERY,
          variables: { id: machineId },
          fetchPolicy: 'network-only',
        });
        const m = mdata?.machine;
        const graphic =
          typeof m?.configuration?.graphic === 'string' ? m.configuration.graphic : null;
        if (graphic && graphic.startsWith('spice://')) {
          if (abortedRef.current) return;
          await openConsole(m, graphic);
          launched = true;
          break;
        }
        await new Promise((r) => setTimeout(r, 2500));
      }
      if (abortedRef.current) return;
      if (!launched) {
        toast('Desktop is still starting', {
          description:
            'It is taking longer than usual. Once it shows as Running, click Connect on its card.',
        });
      }
      refresh();
      fetchPools();
    } catch (err) {
      if (abortedRef.current) return;
      toast.error('Could not connect', {
        description: err?.message || String(err),
      });
    } finally {
      if (!abortedRef.current) setConnectingPoolId(null);
    }
  }, [refresh, fetchPools, openConsole]);

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <ResponsiveStack direction="row" gap={2} align="center" justify="between">
          <ResponsiveStack direction="col" gap={1}>
            <h1>Workspace</h1>
            <p className="text-fg-muted">
              {user?.firstName
                ? `Hi ${user.firstName}, here are your desktops.`
                : 'Your desktops.'}
            </p>
          </ResponsiveStack>
          <Button
            variant="ghost"
            size="sm"
            icon={<RefreshCw size={14} />}
            onClick={handleRefresh}
            disabled={isLoading || poolsLoading}
          >
            Refresh
          </Button>
        </ResponsiveStack>

        {error ? (
          <Alert
            tone="danger"
            icon={<AlertCircle size={14} />}
            title="Couldn't load your desktops"
            actions={
              <Button size="sm" icon={<RefreshCw size={14} />} onClick={refresh}>
                Retry
              </Button>
            }
          >
            {String(error?.message || error)}
          </Alert>
        ) : null}

        {poolsError ? (
          <Alert
            tone="danger"
            icon={<AlertCircle size={14} />}
            title="Couldn't load desktop pools"
            actions={
              <Button
                size="sm"
                icon={<RefreshCw size={14} />}
                onClick={fetchPools}
                disabled={poolsLoading}
              >
                Retry
              </Button>
            }
          >
            {poolsError}
          </Alert>
        ) : null}

        {(isLoading || poolsLoading) && myDesktops.length === 0 && pools.length === 0 ? (
          <ResponsiveGrid columns={{ base: 1, sm: 2 }} gap={3}>
            <Skeleton height={160} />
            <Skeleton height={160} />
          </ResponsiveGrid>
        ) : !error && !poolsError && myDesktops.length === 0 && pools.length === 0 ? (
          <EmptyState
            variant="dashed"
            icon={<Monitor size={18} />}
            title="No desktops assigned"
            description="Contact your administrator to get one."
          />
        ) : (
          <>
            {myDesktops.length > 0 ? (
              <ResponsiveStack direction="col" gap={2}>
                <h2 className="text-sm uppercase tracking-wide text-fg-muted">
                  My desktops
                </h2>
                <ResponsiveGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={3}>
                  {myDesktops.map((d) => (
                    <DesktopTile key={d.id} desktop={d} busy={anyPoolConnecting} />
                  ))}
                </ResponsiveGrid>
              </ResponsiveStack>
            ) : null}

            {pools.length > 0 ? (
              <ResponsiveStack direction="col" gap={2}>
                <h2 className="text-sm uppercase tracking-wide text-fg-muted">
                  Available pools
                </h2>
                <ResponsiveGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={3}>
                  {pools.map((p) => (
                    <PoolTile
                      key={p.id}
                      pool={p}
                      onConnect={handlePoolConnect}
                      connecting={connectingPoolId === p.id}
                      busy={anyPoolConnecting}
                    />
                  ))}
                </ResponsiveGrid>
              </ResponsiveStack>
            ) : null}
          </>
        )}
      </ResponsiveStack>
    </Page>
  );
}
