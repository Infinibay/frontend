'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Page,
  Badge,
  DataTable,
  ResponsiveStack,
  StatusDot,
} from '@infinibay/harbor';

import { PageHeader } from '@/components/common/PageHeader';
import { PreviewBanner } from '@/components/common/PreviewBanner';
import { POOLS } from '@/lib/mockData/pools';

export default function PoolsListPage() {
  const router = useRouter();

  const columns = useMemo(
    () => [
      {
        key: 'name',
        label: 'Pool',
        render: (row) => (
          <ResponsiveStack direction="row" gap={2} align="center">
            <StatusDot status={row.health === 'ok' ? 'online' : 'degraded'} size={8} />
            <span className="font-medium">{row.name}</span>
          </ResponsiveStack>
        ),
      },
      {
        key: 'department',
        label: 'Department',
        width: 180,
        render: (row) => <span className="text-sm">{row.department}</span>,
      },
      {
        key: 'blueprint',
        label: 'Blueprint',
        width: 200,
        render: (row) => (
          <ResponsiveStack direction="col" gap={0}>
            <span className="text-sm">{row.blueprint}</span>
            <span className="text-fg-muted text-xs font-mono">{row.imageVersion}</span>
          </ResponsiveStack>
        ),
      },
      {
        key: 'type',
        label: 'Type',
        width: 130,
        render: (row) => (
          <Badge tone={row.type === 'persistent' ? 'info' : 'neutral'}>
            {row.type === 'persistent' ? 'Persistent' : 'Non-persistent'}
          </Badge>
        ),
      },
      {
        key: 'size',
        label: 'Size',
        width: 90,
        align: 'right',
        render: (row) => (
          <span className="font-mono text-xs">
            {row.minSize}–{row.maxSize}
          </span>
        ),
      },
      {
        key: 'active',
        label: 'Active',
        width: 110,
        align: 'right',
        render: (row) => (
          <span className="font-mono text-xs">
            {row.activeSessions} sess · {row.idleDesktops} idle
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PreviewBanner />
        <PageHeader
          title="Pools"
          count={`${POOLS.length} pool${POOLS.length !== 1 ? 's' : ''}`}
        />
        <DataTable
          rows={POOLS}
          columns={columns}
          rowKey={(r) => r.id}
          dense
          onRowClick={(r) =>
            router.push(`/departments/${encodeURIComponent(r.department)}/pools/${r.id}`)
          }
        />
      </ResponsiveStack>
    </Page>
  );
}
