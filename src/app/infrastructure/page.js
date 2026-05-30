'use client';

import { useMemo } from 'react';
import {
  Page,
  Badge,
  Button,
  DataTable,
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
import { PageHeader } from '@/components/common/PageHeader';

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
    pollInterval: 30_000
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

    return [
      {
        id: 'local',
        name: 'Local node',
        role: 'Primary',
        status: error ? 'degraded' : 'online',
        cpu: `${formatNumber(resources.cpu?.available)} free / ${formatNumber(resources.cpu?.total)} vCPU`,
        memory: `${formatNumber(resources.memory?.available, ' GB')} free / ${formatNumber(resources.memory?.total, ' GB')}`,
        storage: `${formatNumber(resources.disk?.available, ' GB')} free / ${formatNumber(resources.disk?.total, ' GB')}`,
        workload: 'Local telemetry',
        usage: highestUse,
        maintenanceMode: false,
        updatedAt: error ? 'Stale local sample' : 'Live local sample'
      }
    ];
  }, [nodes, resources, error]);

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
        align: 'right',
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
        align: 'right',
        cell: ({ row }) => (
          row.id === 'local' ? (
            <Badge tone="neutral">Local only</Badge>
          ) : (
            <Button
              size="sm"
              variant={row.maintenanceMode ? 'primary' : 'secondary'}
              disabled={maintenanceUpdating}
              onClick={() => {
                setNodeMaintenanceMode({
                  variables: {
                    id: row.id,
                    enabled: !row.maintenanceMode
                  },
                  onCompleted: () => refetchNodes()
                });
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
    [maintenanceUpdating, refetchNodes, setNodeMaintenanceMode]
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
                refetch();
                refetchNodes();
              }}
              disabled={loading || nodesLoading}
            >
              <RefreshCw size={14} />
              Refresh
            </Button>
          }
        />

        {error && !resources ? (
          <EmptyState
            icon={<Server size={22} />}
            title="Infrastructure data unavailable"
            description="The backend could not read host resources."
            actions={
              <Button variant="primary" onClick={() => refetch()}>
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
    </Page>
  );
}
