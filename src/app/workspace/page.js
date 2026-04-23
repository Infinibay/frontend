'use client';

import { useMemo } from 'react';
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
import { Monitor, AlertCircle, RefreshCw, Play } from 'lucide-react';

import { fetchVms } from '@/state/slices/vms';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { selectUser } from '@/state/slices/auth';
import { openSpiceClient } from '@/utils/spiceConnect';
import { toast } from '@/hooks/use-toast';

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
        ) : myDesktops.length === 0 ? (
          <EmptyState
            variant="dashed"
            icon={<Monitor size={18} />}
            title="No desktops assigned"
            description="Contact your administrator to get one."
          />
        ) : (
          <ResponsiveGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={3}>
            {myDesktops.map((d) => (
              <DesktopTile key={d.id} desktop={d} />
            ))}
          </ResponsiveGrid>
        )}
      </ResponsiveStack>
    </Page>
  );
}
