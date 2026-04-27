'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { openSpiceClient } from '@/utils/spiceConnect';
import { toast } from '@/hooks/use-toast';

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
  return { dot: 'offline', label: 'Stopped' };
}

function DesktopTile({ desktop }) {
  const meta = statusMeta(desktop.status);
  const graphic = typeof desktop?.configuration?.graphic === 'string'
    ? desktop.configuration.graphic
    : null;
  const canConnect = meta.dot === 'online' && graphic?.startsWith('spice://');

  const onConnect = () => {
    if (!canConnect) return;
    try {
      openSpiceClient(graphic, { vmName: desktop.name });
      toast({
        title: 'Opening SPICE client',
        description:
          'A .vv file was downloaded. Your OS should open it with virt-viewer or the default SPICE client.',
        variant: 'default',
      });
    } catch (err) {
      toast({
        title: 'Could not open SPICE client',
        description: err?.message || 'Invalid connection info',
        variant: 'destructive',
      });
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
            disabled={!canConnect}
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

function PoolTile({ pool, onConnect, connecting }) {
  const atCapacity = pool.currentSize >= pool.sizeMax;
  const disabled = pool.draining || (atCapacity && pool.currentSize === 0);
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
  const [connectingPoolId, setConnectingPoolId] = useState(null);

  const fetchPools = useCallback(async () => {
    setPoolsLoading(true);
    try {
      const { data } = await client.query({
        query: POOLS_QUERY,
        fetchPolicy: 'network-only',
      });
      setPools(data?.pools ?? []);
    } catch (err) {
      // Don't noisy-toast: pools are a bonus, not critical for the
      // direct-assignment path that already works.
      setPools([]);
    } finally {
      setPoolsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPools();
  }, [fetchPools]);

  const handlePoolConnect = useCallback(async (pool) => {
    setConnectingPoolId(pool.id);
    try {
      const { data } = await client.mutate({
        mutation: CONNECT_POOL,
        variables: { poolId: pool.id },
      });
      const machineId = data?.connectToPool;
      if (!machineId) throw new Error('No desktop returned from pool');

      // Pull the freshly-assigned machine so we have its SPICE URL.
      const { data: mdata } = await client.query({
        query: MACHINE_QUERY,
        variables: { id: machineId },
        fetchPolicy: 'network-only',
      });
      const m = mdata?.machine;
      const graphic = typeof m?.configuration?.graphic === 'string' ? m.configuration.graphic : null;
      if (!graphic || !graphic.startsWith('spice://')) {
        toast({
          title: 'Desktop is starting',
          description: 'Give it a few seconds, then refresh and click Connect again.',
        });
        refresh();
        fetchPools();
        return;
      }
      openSpiceClient(graphic, { vmName: m.name });
      toast({
        title: 'Opening SPICE client',
        description: 'A .vv file was downloaded. Open it with virt-viewer.',
      });
      refresh();
      fetchPools();
    } catch (err) {
      toast({
        title: 'Could not connect',
        description: err?.message || String(err),
        variant: 'destructive',
      });
    } finally {
      setConnectingPoolId(null);
    }
  }, [refresh, fetchPools]);

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
            onClick={refresh}
            disabled={isLoading}
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

        {isLoading && myDesktops.length === 0 ? (
          <ResponsiveGrid columns={{ base: 1, sm: 2 }} gap={3}>
            <Skeleton height={160} />
            <Skeleton height={160} />
          </ResponsiveGrid>
        ) : myDesktops.length === 0 && pools.length === 0 && !poolsLoading ? (
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
                    <DesktopTile key={d.id} desktop={d} />
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
