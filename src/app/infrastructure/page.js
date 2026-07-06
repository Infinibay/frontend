'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  Page,
  Alert,
  Badge,
  Button,
  DataTable,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
  EmptyState,
  ResourceMeter,
  ResponsiveStack,
  Skeleton,
  StatusDot
} from '@infinibay/harbor';
import { Cpu, Database, HardDrive, MemoryStick, RefreshCw, Server } from 'lucide-react';

import {
  useGetNodeInventoryQuery,
  useGetSystemResourcesQuery,
  useSetNodeMaintenanceModeMutation
} from '@/gql/hooks';
import { toast } from 'sonner';
import { usePermissions } from '@/hooks/usePermissions';
import { PageHeader } from '@/components/common/PageHeader';
import { PendingNodesSection } from '@/components/infrastructure/PendingNodesSection';

function pctUsed(total, available) {
  if (!total || total <= 0) return 0;
  return Math.round(((total - available) / total) * 100);
}

function pctDiskUsed(total, used) {
  if (!total || total <= 0) return 0;
  return Math.round((used / total) * 100);
}

function capacityTone(value) {
  if (value >= 90) return 'danger';
  if (value >= 70) return 'warning';
  return 'success';
}

function formatNumber(value, suffix = '') {
  if (value == null || Number.isNaN(Number(value))) return '-';
  return `${Number(value).toLocaleString()}${suffix}`;
}

function buildResources(resources) {
  if (!resources) return [];

  const cpuUsed = pctUsed(resources.cpu?.total, resources.cpu?.available);
  const memoryUsed = pctUsed(resources.memory?.total, resources.memory?.available);
  const diskUsed = pctDiskUsed(resources.disk?.total, resources.disk?.used);

  return [
    {
      label: 'CPU',
      value: cpuUsed,
      detail: `${formatNumber(resources.cpu?.total - resources.cpu?.available)} / ${formatNumber(resources.cpu?.total)} vCPU`,
      icon: <Cpu size={14} />
    },
    {
      label: 'Memory',
      value: memoryUsed,
      detail: `${formatNumber(resources.memory?.total - resources.memory?.available, ' GB')} / ${formatNumber(resources.memory?.total, ' GB')}`,
      icon: <MemoryStick size={14} />
    },
    {
      label: 'Storage',
      value: diskUsed,
      detail: `${formatNumber(resources.disk?.used, ' GB')} / ${formatNumber(resources.disk?.total, ' GB')}`,
      icon: <HardDrive size={14} />
    }
  ];
}

function formatUpdatedAt(value) {
  if (!value) return 'Never reported';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleString();
}

export default function InfrastructurePage() {
  const {
    data,
    loading,
    error,
    refetch
  } = useGetSystemResourcesQuery({
    fetchPolicy: 'cache-and-network',
    pollInterval: 30_000,
    // Don't re-emit loading:true on the 30s poll — getSystemResources is a
    // non-nullable root field, so a poll error nulls `data` and the `loading &&
    // !resources` guard below would flash a skeleton over the rendered content.
    notifyOnNetworkStatusChange: false
  });

  const {
    data: nodeData,
    loading: nodesLoading,
    error: nodesError,
    refetch: refetchNodes
  } = useGetNodeInventoryQuery({
    fetchPolicy: 'cache-and-network',
    pollInterval: 30_000
  });
  const [setNodeMaintenanceMode, { loading: maintenanceUpdating }] = useSetNodeMaintenanceModeMutation();
  const { can } = usePermissions();
  const canEditNodes = can('node:edit');

  // Node pending confirmation before it is put into maintenance mode.
  const [maintenanceTarget, setMaintenanceTarget] = useState(null);

  const applyMaintenance = useCallback(async (node, enabled) => {
    try {
      await setNodeMaintenanceMode({ variables: { id: node.id, enabled } });
      await refetchNodes();
      toast.success(
        enabled
          ? `${node.name} entering maintenance mode`
          : `${node.name} resumed from maintenance`
      );
      return true;
    } catch (err) {
      toast.error(err?.message || 'Failed to update maintenance mode');
      return false;
    }
  }, [setNodeMaintenanceMode, refetchNodes]);

  const confirmMaintenance = useCallback(async () => {
    if (!maintenanceTarget) return;
    const ok = await applyMaintenance(maintenanceTarget, true);
    // Keep the confirmation open on failure so the user can retry.
    if (ok) setMaintenanceTarget(null);
  }, [maintenanceTarget, applyMaintenance]);

  const resources = data?.getSystemResources;
  const nodes = useMemo(() => nodeData?.nodes || [], [nodeData?.nodes]);
  const nodeSummary = nodeData?.nodeInventorySummary;
  const meters = useMemo(() => buildResources(resources), [resources]);

  const nodeRows = useMemo(() => {
    if (nodes.length > 0) {
      return nodes.map((node) => {
        const degradedDisks = Math.max(0, node.diskCount - node.healthyDiskCount);
        const diskLabel = node.diskCount === 0
          ? 'No disks registered'
          : `${node.healthyDiskCount}/${node.diskCount} healthy`;
        const totalRamGB = Math.round(node.ram / 1024);
        const cpuPressure = pctUsed(node.cores, node.availableCores);
        const memoryPressure = pctUsed(totalRamGB, node.availableRamGB);
        const pressure = node.health === 'online'
          ? Math.max(cpuPressure, memoryPressure)
          : 100;

        return {
          id: node.id,
          name: node.name,
          role: node.currentRaid ? `RAID ${node.currentRaid}` : 'Registered node',
          status: node.health === 'online' ? 'online' : 'degraded',
          maintenanceMode: node.maintenanceMode,
          cpu: `${formatNumber(node.availableCores)} free / ${formatNumber(node.cores)} cores`,
          memory: `${formatNumber(node.availableRamGB, ' GB')} free / ${formatNumber(totalRamGB, ' GB')}`,
          storage: degradedDisks > 0 ? `${diskLabel} · ${degradedDisks} degraded` : diskLabel,
          workload: `${formatNumber(node.runningMachineCount)} running / ${formatNumber(node.machineCount)} total`,
          usage: pressure,
          updatedAt: formatUpdatedAt(node.updatedAt)
        };
      });
    }

    if (!resources) return [];

    const cpuUsed = pctUsed(resources.cpu?.total, resources.cpu?.available);
    const memoryUsed = pctUsed(resources.memory?.total, resources.memory?.available);
    const diskUsed = pctDiskUsed(resources.disk?.total, resources.disk?.used);
    const highestUse = Math.max(cpuUsed, memoryUsed, diskUsed);
    const inventoryFailed = !!nodesError;

    return [
      {
        id: 'local',
        name: 'Local node',
        role: inventoryFailed ? 'Inventory unavailable' : 'Primary',
        status: error ? 'degraded' : 'online',
        cpu: `${formatNumber(resources.cpu?.available)} free / ${formatNumber(resources.cpu?.total)} vCPU`,
        memory: `${formatNumber(resources.memory?.available, ' GB')} free / ${formatNumber(resources.memory?.total, ' GB')}`,
        storage: `${formatNumber(resources.disk?.available, ' GB')} free / ${formatNumber(resources.disk?.total, ' GB')}`,
        workload: inventoryFailed ? 'Local telemetry only' : 'Local telemetry',
        usage: highestUse,
        maintenanceMode: false,
        updatedAt: inventoryFailed
          ? 'Inventory unavailable — showing local telemetry only'
          : (error ? 'Stale local sample' : 'Live local sample')
      }
    ];
  }, [nodes, resources, error, nodesError]);

  const columns = useMemo(
    () => [
      {
        id: 'name',
        header: 'Node',
        cell: ({ row }) => (
          <ResponsiveStack direction="row" gap={2} align="center">
            <StatusDot status={row.status} size={8} />
            <ResponsiveStack direction="col" gap={0}>
              <span className="font-medium">{row.name}</span>
              <span className="text-xs text-fg-subtle">{row.role}</span>
            </ResponsiveStack>
          </ResponsiveStack>
        )
      },
      {
        id: 'cpu',
        header: 'CPU',
        width: 190,
        cell: ({ row }) => <span className="font-mono text-xs text-fg-muted">{row.cpu}</span>
      },
      {
        id: 'memory',
        header: 'Memory',
        width: 210,
        cell: ({ row }) => <span className="font-mono text-xs text-fg-muted">{row.memory}</span>
      },
      {
        id: 'storage',
        header: 'Storage',
        width: 210,
        cell: ({ row }) => <span className="font-mono text-xs text-fg-muted">{row.storage}</span>
      },
      {
        id: 'workload',
        header: 'Workload',
        width: 170,
        cell: ({ row }) => <span className="font-mono text-xs text-fg-muted">{row.workload}</span>
      },
      {
        id: 'usage',
        header: 'Pressure',
        width: 120,
        align: 'end',
        cell: ({ row }) => (
          <Badge tone={capacityTone(row.usage)}>
            {row.usage}%
          </Badge>
        )
      },
      {
        id: 'maintenance',
        header: 'Maintenance',
        width: 150,
        align: 'end',
        cell: ({ row }) => (
          row.id === 'local' ? (
            <Badge tone="neutral">Local only</Badge>
          ) : (
            <Button
              size="sm"
              variant={row.maintenanceMode ? 'primary' : 'secondary'}
              disabled={maintenanceUpdating || !canEditNodes}
              onClick={() => {
                if (row.maintenanceMode) {
                  // Resuming is non-destructive — apply directly.
                  applyMaintenance(row, false);
                } else {
                  // Entering maintenance drains the node — confirm first.
                  setMaintenanceTarget(row);
                }
              }}
            >
              {row.maintenanceMode ? 'Resume' : 'Maintain'}
            </Button>
          )
        )
      },
      {
        id: 'updatedAt',
        header: 'Last report',
        width: 190,
        cell: ({ row }) => <span className="text-xs text-fg-muted">{row.updatedAt}</span>
      }
    ],
    [maintenanceUpdating, applyMaintenance, canEditNodes]
  );

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PageHeader
          title="Infrastructure"
          count={nodeSummary?.totalNodes > 0 ? `${nodeSummary.totalNodes} nodes` : 'local node'}
          description="Host capacity and registered node inventory for this Infinibay instance."
          secondary={
            <Button
              variant="secondary"
              onClick={() => {
                refetch().catch(() => {});
                refetchNodes().catch(() => {});
              }}
              disabled={(loading && !resources) || (nodesLoading && !nodeData?.nodes)}
            >
              <RefreshCw size={14} />
              Refresh
            </Button>
          }
        />

        <PendingNodesSection />

        {nodesError ? (
          <Alert
            tone="warning"
            title="Node inventory unavailable"
            actions={
              <Button
                size="sm"
                variant="secondary"
                onClick={() => refetchNodes().catch(() => {})}
              >
                Retry
              </Button>
            }
          >
            The registered node inventory could not be loaded — showing local host
            telemetry only. Maintenance controls and per-node health are unavailable
            until this recovers.
          </Alert>
        ) : null}

        {error && !resources ? (
          <EmptyState
            icon={<Server size={22} />}
            title="Infrastructure data unavailable"
            description="The backend could not read host resources."
            actions={
              <Button variant="primary" onClick={() => refetch().catch(() => {})}>
                Retry
              </Button>
            }
          />
        ) : null}

        {loading && !resources ? (
          <ResponsiveStack direction="col" gap={3}>
            <Skeleton height={108} />
            <Skeleton height={180} />
          </ResponsiveStack>
        ) : null}

        {resources ? (
          <>
            <ResponsiveStack
              direction={{ base: 'col', lg: 'row' }}
              gap={4}
              align="stretch"
            >
              <div className="flex-1 min-w-0 rounded-md border border-border-subtle bg-surface-raised p-4">
                <ResponsiveStack direction="col" gap={3}>
                  <ResponsiveStack direction="row" gap={2} align="center" justify="between">
                    <ResponsiveStack direction="row" gap={2} align="center">
                      <Server size={16} className="text-fg-muted" />
                      <span className="text-sm font-medium">Local node capacity</span>
                    </ResponsiveStack>
                    <Badge tone={error ? 'warning' : 'success'}>
                      {error ? 'Stale' : 'Live'}
                    </Badge>
                  </ResponsiveStack>
                  <ResourceMeter resources={meters} />
                </ResponsiveStack>
              </div>

              <div className="w-full lg:w-72 rounded-md border border-border-subtle bg-surface-raised p-4">
                <ResponsiveStack direction="col" gap={3}>
                  <ResponsiveStack direction="row" gap={2} align="center">
                    <Database size={16} className="text-fg-muted" />
                    <span className="text-sm font-medium">Node inventory</span>
                  </ResponsiveStack>
                  <ResponsiveStack direction="col" gap={1}>
                    <span className="text-2xl font-semibold">
                      {formatNumber(nodeSummary?.totalNodes > 0 ? nodeSummary.onlineNodes : (nodesError ? 0 : 1))}
                    </span>
                    <span className="text-sm text-fg-muted">
                      online nodes · {formatNumber(nodeSummary?.totalCores ?? resources.cpu?.total)} total cores
                    </span>
                  </ResponsiveStack>
                </ResponsiveStack>
              </div>
            </ResponsiveStack>

            <DataTable
              rows={nodeRows}
              columns={columns}
              rowId={(row) => row.id}
              defaultDensity="compact"
            />
          </>
        ) : null}
      </ResponsiveStack>

      <Dialog
        open={!!maintenanceTarget}
        onClose={maintenanceUpdating ? () => {} : () => setMaintenanceTarget(null)}
        size="sm"
      >
        <DialogTitle>
          <ResponsiveStack direction="row" gap={2} align="center">
            <Server size={16} />
            Enter maintenance mode
          </ResponsiveStack>
        </DialogTitle>
        <DialogDescription>
          {maintenanceTarget
            ? `Put “${maintenanceTarget.name}” into maintenance mode?`
            : 'Put this node into maintenance mode?'}
        </DialogDescription>
        <DialogBody>
          <p className="text-sm text-fg-muted">
            The scheduler will stop placing new workloads on this node. Running
            machines are not stopped automatically. You can resume the node at any
            time.
          </p>
        </DialogBody>
        <DialogButtons align="end">
          <Button
            variant="secondary"
            onClick={() => setMaintenanceTarget(null)}
            disabled={maintenanceUpdating}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            loading={maintenanceUpdating}
            onClick={confirmMaintenance}
          >
            Enter maintenance
          </Button>
        </DialogButtons>
      </Dialog>
    </Page>
  );
}
