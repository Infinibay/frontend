'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Page,
  Badge,
  DataTable,
  ResponsiveStack,
  Select,
  StatusDot,
} from '@infinibay/harbor';
import { PageHeader } from '@/components/common/PageHeader';
import { PreviewBanner } from '@/components/common/PreviewBanner';
import { STORAGE_MOUNTS, TYPE_META } from '@/lib/mockData/storage';

export default function StorageListPage() {
  const router = useRouter();
  const [familyFilter, setFamilyFilter] = useState('all');

  const filtered = useMemo(() => {
    if (familyFilter === 'all') return STORAGE_MOUNTS;
    return STORAGE_MOUNTS.filter((m) => TYPE_META[m.type].family === familyFilter);
  }, [familyFilter]);

  const familyOptions = [
    { value: 'all',         label: 'All types' },
    { value: 'internal',    label: 'Internal' },
    { value: 'network',     label: 'Network' },
    { value: 'cloud',       label: 'Cloud' },
    { value: 'third-party', label: 'Third-party' },
  ];

  const columns = useMemo(
    () => [
      {
        key: 'name',
        label: 'Name',
        render: (row) => (
          <ResponsiveStack direction="row" gap={2} align="center">
            <StatusDot
              status={row.status === 'ok' ? 'online' : row.status === 'degraded' ? 'degraded' : 'offline'}
              size={8}
            />
            <span className="font-medium">{row.name}</span>
          </ResponsiveStack>
        ),
      },
      {
        key: 'type',
        label: 'Type',
        width: 170,
        render: (row) => {
          const m = TYPE_META[row.type];
          return (
            <ResponsiveStack direction="row" gap={2} align="center">
              <Badge tone="neutral">{m.label}</Badge>
              {m.family === 'third-party' ? (
                <span className="text-fg-subtle text-xs">3rd-party</span>
              ) : null}
            </ResponsiveStack>
          );
        },
      },
      {
        key: 'endpoint',
        label: 'Endpoint',
        render: (row) => (
          <span className="font-mono text-xs text-fg-muted">{row.endpoint}</span>
        ),
      },
      {
        key: 'usage',
        label: 'Usage',
        width: 180,
        render: (row) => {
          const pct = Math.round((row.usedGB / row.totalGB) * 100);
          return (
            <ResponsiveStack direction="col" gap={0}>
              <span className="text-xs text-fg-muted">
                {row.usedGB} / {row.totalGB} GB · {pct}%
              </span>
              <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={[
                    'h-full',
                    pct >= 90 ? 'bg-danger' : pct >= 70 ? 'bg-warning' : 'bg-accent',
                  ].join(' ')}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </ResponsiveStack>
          );
        },
      },
      {
        key: 'latencyMs',
        label: 'Latency',
        width: 90,
        align: 'right',
        render: (row) => (
          <span className="font-mono text-xs">
            {row.latencyMs === 0 ? '—' : `${row.latencyMs} ms`}
          </span>
        ),
      },
      {
        key: 'bindings',
        label: 'Bound to',
        width: 180,
        render: (row) => (
          <span className="text-sm text-fg-muted">
            {row.bindings.includes('*')
              ? 'All departments'
              : row.bindings.join(', ')}
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
          title="Storage"
          count={`${STORAGE_MOUNTS.length} mount${STORAGE_MOUNTS.length !== 1 ? 's' : ''}`}
          filters={
            <Select
              value={familyFilter}
              onChange={setFamilyFilter}
              options={familyOptions}
            />
          }
        />
        {filtered.length === 0 ? (
          <span className="text-fg-muted text-sm py-4">
            No storage matches this filter.
          </span>
        ) : (
          <DataTable
            rows={filtered}
            columns={columns}
            rowKey={(r) => r.id}
            dense
            onRowClick={(r) => router.push(`/storage/${r.id}`)}
          />
        )}
      </ResponsiveStack>
    </Page>
  );
}
