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
import { Ban, Cpu, Database, HardDrive, MemoryStick, RefreshCw, Server, Trash2, Wrench } from 'lucide-react';

import {
  useGetNodeInventoryQuery,
  useGetSystemResourcesQuery,
  useSetNodeMaintenanceModeMutation,
  useRejectNodeMutation,
  useDeleteNodeMutation
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
  const [rejectNode, { loading: rejecting }] = useRejectNodeMutation();
  const [deleteNode, { loading: deleting }] = useDeleteNodeMutation();
  const { can } = usePermissions();
  const canEditNodes = can('node:edit');

  // Nodes queued for a confirmation dialog (each action is destructive/draining).
  const [maintenanceTarget, setMaintenanceTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  // Decommission: first DRAIN the node (migrate every VM off it), then revoke its
  // mTLS cert (status → rejected). Confirming here authorizes powering off any
  // running VMs (stopRunningVms), which the dialog warns about. It must re-join to
  // come back. Reversible via re-enrollment; keeps the row.
  const confirmReject = useCallback(async () => {
    if (!rejectTarget) return;
    try {
      await rejectNode({ variables: { id: rejectTarget.id, stopRunningVms: true } });
      await refetchNodes();
      toast.success(`${rejectTarget.name} drained and decommissioned — its certificate was revoked`);
      setRejectTarget(null);
    } catch (err) {
      // Drain failures (a VM that could not be migrated) come back as a clear
      // message; keep the dialog open so the operator can read it and retry.
      toast.error(err?.message || 'Failed to decommission node');
    }
  }, [rejectTarget, rejectNode, refetchNodes]);

  // Delete: DRAIN the node (migrate every VM to another node) and then permanently
  // remove the row. Confirming authorizes powering off running VMs (stopRunningVms).
  // If any VM can't be migrated, the backend leaves the node in maintenance and the
  // delete fails with which VMs are stuck.
  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await deleteNode({ variables: { id: deleteTarget.id, stopRunningVms: true } });
      await refetchNodes();
      toast.success(`${deleteTarget.name} drained and removed from inventory`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.message || 'Failed to delete node');
    }
  }, [deleteTarget, deleteNode, refetchNodes]);

  // One-line summary of what removing a node will do to its VMs, for the confirm
  // dialogs. Returns null when the node has no VMs (nothing to warn about).
  const drainSummary = useCallback((t) => {
    const total = t?.machineCount ?? 0;
    if (total === 0) return null;
    const running = t?.runningMachineCount ?? 0;
    const vmWord = (n) => `${n} VM${n === 1 ? '' : 's'}`;
    return running > 0
      ? `${vmWord(running)} currently running will be POWERED OFF, and all ${vmWord(total)} will be migrated to another node (master preferred) before the node is removed.`
      : `${vmWord(total)} (stopped) will be migrated to another node (master preferred) before the node is removed.`;
  }, []);

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
          : `${node.healthyDiskCount}/${node.diskCount} healthy${degradedDisks > 0 ? ` · ${degradedDisks} degraded` : ''}`;
        const totalRamGB = Math.round(node.ram / 1024);
        const cpuPressure = pctUsed(node.cores, node.availableCores);
        const memoryPressure = pctUsed(totalRamGB, node.availableRamGB);
        const pressure = node.health === 'online'
          ? Math.max(cpuPressure, memoryPressure)
          : 100;
        const isMaster = node.role === 'master';
        const lastReport = formatUpdatedAt(node.updatedAt);

        return {
          id: node.id,
          name: node.name,
          isMaster,
          isLocal: false,
          // Subtitle carries the cluster role + last report — folds the old wide
          // "Last report" column into the Node cell so the table fits.
          subtitle: `${isMaster ? 'master' : 'compute'} · ${lastReport}`,
          status: node.health === 'online' ? 'online' : 'degraded',
          lifecycle: node.status,
          machineCount: node.machineCount,
          runningMachineCount: node.runningMachineCount,
          maintenanceMode: node.maintenanceMode,
          cpu: `${formatNumber(node.availableCores)}/${formatNumber(node.cores)}`,
          cpuTitle: `${formatNumber(node.availableCores)} free of ${formatNumber(node.cores)} cores`,
          memory: `${formatNumber(node.availableRamGB)}/${formatNumber(totalRamGB)} GB`,
          memoryTitle: `${formatNumber(node.availableRamGB, ' GB')} free of ${formatNumber(totalRamGB, ' GB')}`,
          storage: node.diskCount === 0 ? '—' : `${node.healthyDiskCount}/${node.diskCount}`,
          storageTitle: diskLabel,
          workload: `${formatNumber(node.runningMachineCount)}/${formatNumber(node.machineCount)}`,
          workloadTitle: `${formatNumber(node.runningMachineCount)} running of ${formatNumber(node.machineCount)} total VMs`,
          usage: pressure
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
        isMaster: true,
        isLocal: true,
        subtitle: inventoryFailed
          ? 'Inventory unavailable — showing local telemetry only'
          : (error ? 'Primary · stale local sample' : 'Primary · live local sample'),
        status: error ? 'degraded' : 'online',
        lifecycle: 'local',
        machineCount: 0,
        maintenanceMode: false,
        cpu: `${formatNumber(resources.cpu?.available)}/${formatNumber(resources.cpu?.total)}`,
        cpuTitle: `${formatNumber(resources.cpu?.available)} free of ${formatNumber(resources.cpu?.total)} vCPU`,
        memory: `${formatNumber(resources.memory?.available)}/${formatNumber(resources.memory?.total)} GB`,
        memoryTitle: `${formatNumber(resources.memory?.available, ' GB')} free of ${formatNumber(resources.memory?.total, ' GB')}`,
        storage: `${formatNumber(resources.disk?.available)}/${formatNumber(resources.disk?.total)} GB`,
        storageTitle: `${formatNumber(resources.disk?.available, ' GB')} free of ${formatNumber(resources.disk?.total, ' GB')}`,
        workload: '—',
        workloadTitle: 'Local telemetry only',
        usage: highestUse
      }
    ];
  }, [nodes, resources, error, nodesError]);

  const columns = useMemo(
    () => [
      {
        id: 'name',
        header: 'Node',
        minWidth: 200,
        cell: ({ row }) => (
          <ResponsiveStack direction="row" gap={2} align="center">
            <StatusDot status={row.status} size={8} />
            <ResponsiveStack direction="col" gap={0}>
              <span className="font-medium">{row.name}</span>
              <span className="text-xs text-fg-subtle">{row.subtitle}</span>
            </ResponsiveStack>
          </ResponsiveStack>
        )
      },
      {
        id: 'cpu',
        header: 'CPU',
        width: 96,
        cell: ({ row }) => (
          <span title={row.cpuTitle} className="font-mono text-xs text-fg-muted">{row.cpu}</span>
        )
      },
      {
        id: 'memory',
        header: 'Memory',
        width: 120,
        cell: ({ row }) => (
          <span title={row.memoryTitle} className="font-mono text-xs text-fg-muted">{row.memory}</span>
        )
      },
      {
        id: 'storage',
        header: 'Disks',
        width: 110,
        cell: ({ row }) => (
          <span title={row.storageTitle} className="font-mono text-xs text-fg-muted">{row.storage}</span>
        )
      },
      {
        id: 'workload',
        header: 'VMs',
        width: 84,
        cell: ({ row }) => (
          <span title={row.workloadTitle} className="font-mono text-xs text-fg-muted">{row.workload}</span>
        )
      },
      {
        id: 'usage',
        header: 'Pressure',
        width: 108,
        align: 'end',
        cell: ({ row }) => (
          (row.lifecycle === 'rejected' || row.lifecycle === 'decommissioned')
            ? <Badge tone="danger">{row.lifecycle}</Badge>
            : row.maintenanceMode
              ? <Badge tone="warning">Maintenance</Badge>
              : <Badge tone={capacityTone(row.usage)}>{row.usage}%</Badge>
        )
      }
    ],
    []
  );

  // Per-row kebab (pinned actions column) — keeps all node actions off the grid so
  // the table stays narrow. Empty for the synthetic local row / without permission;
  // destructive actions are hidden on the master (the backend refuses them anyway).
  const rowActions = useCallback((row) => {
    if (row.isLocal || !canEditNodes) return [];
    const items = [
      {
        label: row.maintenanceMode ? 'Resume from maintenance' : 'Enter maintenance',
        icon: <Wrench size={14} />,
        disabled: maintenanceUpdating,
        onClick: () => {
          if (row.maintenanceMode) applyMaintenance(row, false);
          else setMaintenanceTarget(row);
        }
      }
    ];
    if (!row.isMaster) {
      const alreadyDown = row.lifecycle === 'rejected' || row.lifecycle === 'decommissioned';
      if (!alreadyDown) {
        items.push({
          label: 'Decommission (revoke cert)',
          icon: <Ban size={14} />,
          danger: true,
          disabled: rejecting,
          onClick: () => setRejectTarget(row)
        });
      }
      // Deleting a node with VMs now DRAINS it first (migrates every VM to another
      // node), so it's allowed — the confirm dialog warns what will move / power off.
      const hasVMs = row.machineCount > 0;
      items.push({
        label: hasVMs
          ? `Delete (migrates ${row.machineCount} VM${row.machineCount > 1 ? 's' : ''} off first)`
          : 'Delete from inventory',
        icon: <Trash2 size={14} />,
        danger: true,
        disabled: deleting,
        onClick: () => setDeleteTarget(row)
      });
    }
    return items;
  }, [canEditNodes, maintenanceUpdating, rejecting, deleting, applyMaintenance]);

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

            <div className="overflow-x-auto">
              <DataTable
                rows={nodeRows}
                columns={columns}
                rowId={(row) => row.id}
                rowActions={canEditNodes ? rowActions : undefined}
                defaultDensity="compact"
              />
            </div>
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
            <Wrench size={16} />
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

      <Dialog
        open={!!rejectTarget}
        onClose={rejecting ? () => {} : () => setRejectTarget(null)}
        size="sm"
      >
        <DialogTitle>
          <ResponsiveStack direction="row" gap={2} align="center">
            <Ban size={16} />
            Decommission node
          </ResponsiveStack>
        </DialogTitle>
        <DialogDescription>
          {rejectTarget
            ? `Decommission “${rejectTarget.name}”?`
            : 'Decommission this node?'}
        </DialogDescription>
        <DialogBody>
          <p className="text-sm text-fg-muted">
            Its cluster certificate is revoked, so the node can no longer authenticate
            and stops participating. The entry stays in the list (marked rejected) and
            the host must re-join to come back.
          </p>
          {drainSummary(rejectTarget) && (
            <p className="mt-2 text-sm font-medium text-warning">
              {drainSummary(rejectTarget)}
            </p>
          )}
        </DialogBody>
        <DialogButtons align="end">
          <Button
            variant="secondary"
            onClick={() => setRejectTarget(null)}
            disabled={rejecting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            loading={rejecting}
            onClick={confirmReject}
          >
            Decommission
          </Button>
        </DialogButtons>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onClose={deleting ? () => {} : () => setDeleteTarget(null)}
        size="sm"
      >
        <DialogTitle>
          <ResponsiveStack direction="row" gap={2} align="center">
            <Trash2 size={16} />
            Delete node
          </ResponsiveStack>
        </DialogTitle>
        <DialogDescription>
          {deleteTarget
            ? `Permanently remove “${deleteTarget.name}” from the inventory?`
            : 'Permanently remove this node from the inventory?'}
        </DialogDescription>
        <DialogBody>
          <p className="text-sm text-fg-muted">
            The node row and its disk records are removed. If the node’s agent is still
            running it will re-register on its next heartbeat — decommission it or stop
            the agent first for a permanent removal.
          </p>
          {drainSummary(deleteTarget) && (
            <p className="mt-2 text-sm font-medium text-warning">
              {drainSummary(deleteTarget)}
            </p>
          )}
        </DialogBody>
        <DialogButtons align="end">
          <Button
            variant="secondary"
            onClick={() => setDeleteTarget(null)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            loading={deleting}
            onClick={confirmDelete}
          >
            Delete node
          </Button>
        </DialogButtons>
      </Dialog>
    </Page>
  );
}
