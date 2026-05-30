'use client';

import { useMemo } from 'react';
import {
  Page,
  Badge,
  Button,
  DataTable,
  ResourceMeter,
  ResponsiveStack,
  Skeleton,
  StatusDot } from
'@infinibay/harbor';
import { Database, HardDrive, RefreshCw } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { useGetSystemResourcesQuery } from '@/gql/hooks';

function pctUsed(total, used) {
  if (!total || total <= 0) return 0;
  return Math.round((used / total) * 100);
}

function formatGB(value) {
  if (value == null || Number.isNaN(Number(value))) return '-';
  return `${Number(value).toLocaleString()} GB`;
}

export default function StorageListPage() {
  const {
    data,
    loading,
    error,
    refetch
  } = useGetSystemResourcesQuery({
    fetchPolicy: 'cache-and-network',
    pollInterval: 30_000
  });

  const disk = data?.getSystemResources?.disk;
  const usedPct = pctUsed(disk?.total, disk?.used);

  const rows = useMemo(
    () =>
      disk
        ? [
            {
              id: 'local',
              name: 'Local Infinibay storage',
              type: 'Local host',
              endpoint: 'INFINIBAY_BASE_DIR',
              status: error ? 'degraded' : 'online',
              used: disk.used,
              available: disk.available,
              total: disk.total,
              usage: pctUsed(disk.total, disk.used)
            }
          ]
        : [],
    [disk, error]
  );


  const columns = useMemo(
    () => [
    {
      id: 'name',
      header: 'Name',
      cell: ({ row }) =>
      <ResponsiveStack direction="row" gap={2} align="center">
            <StatusDot
          status={row.status}
          size={8} />
        
            <span className="font-medium">{row.name}</span>
          </ResponsiveStack>

    },
    {
      id: 'type',
      header: 'Type',
      width: 170,
      cell: ({ row }) => <Badge tone="neutral">{row.type}</Badge>
    },
    {
      id: 'endpoint',
      header: 'Endpoint',
      cell: ({ row }) =>
      <span className="font-mono text-xs text-fg-muted">{row.endpoint}</span>

    },
    {
      id: 'usage',
      header: 'Usage',
      width: 180,
      cell: ({ row }) => {
        return (
          <ResponsiveStack direction="col" gap={0}>
              <span className="text-xs text-fg-muted">
                {formatGB(row.used)} / {formatGB(row.total)} · {row.usage}%
              </span>
              <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                className={[
                'h-full',
                row.usage >= 90 ? 'bg-danger' : row.usage >= 70 ? 'bg-warning' : 'bg-accent'].
                join(' ')}
                style={{ width: `${row.usage}%` }} />
              
              </div>
            </ResponsiveStack>);

      }
    },
    {
      id: 'available',
      header: 'Available',
      width: 120,
      align: 'right',
      cell: ({ row }) =>
      <span className="font-mono text-xs">
            {formatGB(row.available)}
          </span>

    },
    {
      id: 'scope',
      header: 'Scope',
      width: 160,
      cell: ({ row }) =>
      <span className="text-sm text-fg-muted">
            Shared by this node
          </span>

    }],

    []
  );

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PageHeader
          title="Storage"
          count={disk ? `${formatGB(disk.available)} available` : 'local capacity'}
          description="Local host storage capacity reported by the backend."
          secondary={
          <Button variant="secondary" onClick={() => refetch()} disabled={loading}>
              <RefreshCw size={14} />
              Refresh
            </Button>
          } />

        {loading && !disk ?
        <ResponsiveStack direction="col" gap={3}>
            <Skeleton height={130} />
            <Skeleton height={180} />
          </ResponsiveStack> :
        null}

        {disk ?
        <>
            <ResponsiveStack
            direction={{ base: 'col', lg: 'row' }}
            gap={4}
            align="stretch">
              <div className="flex-1 min-w-0 rounded-md border border-border-subtle bg-surface-raised p-4">
                <ResponsiveStack direction="col" gap={3}>
                  <ResponsiveStack direction="row" gap={2} align="center" justify="between">
                    <ResponsiveStack direction="row" gap={2} align="center">
                      <HardDrive size={16} className="text-fg-muted" />
                      <span className="text-sm font-medium">Capacity</span>
                    </ResponsiveStack>
                    <Badge tone={error ? 'warning' : 'success'}>
                      {error ? 'Stale' : 'Live'}
                    </Badge>
                  </ResponsiveStack>
                  <ResourceMeter
                  resources={[
                  {
                    label: 'Used',
                    value: usedPct,
                    detail: `${formatGB(disk.used)} / ${formatGB(disk.total)}`
                  }]} />
                
                </ResponsiveStack>
              </div>

              <div className="w-full lg:w-72 rounded-md border border-border-subtle bg-surface-raised p-4">
                <ResponsiveStack direction="col" gap={3}>
                  <ResponsiveStack direction="row" gap={2} align="center">
                    <Database size={16} className="text-fg-muted" />
                    <span className="text-sm font-medium">Storage backend</span>
                  </ResponsiveStack>
                  <span className="text-sm text-fg-muted">
                    External mounts, cloud buckets, quotas, and per-department storage policies are not implemented yet.
                  </span>
                </ResponsiveStack>
              </div>
            </ResponsiveStack>

            <DataTable
            rows={rows}
            columns={columns}
            rowId={(r) => r.id}
            defaultDensity="compact" />
          </> :
        null}

      </ResponsiveStack>
    </Page>);

}
