'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Page,
  Badge,
  DataTable,
  ResponsiveStack } from
'@infinibay/harbor';
import { Globe, Network } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { PreviewBanner } from '@/components/common/PreviewBanner';
import { POLICIES } from '@/lib/mockData/policies';

function timeAgo(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const d = Math.round(ms / 86400000);
  if (d < 1) return 'today';
  if (d < 30) return `${d}d ago`;
  return `${Math.round(d / 30)}mo ago`;
}

export default function PoliciesListPage() {
  const router = useRouter();

  const columns = useMemo(
    () => [
    {
      id: 'name',
      header: 'Policy',
      cell: ({ row }) =>
      <ResponsiveStack direction="row" gap={2} align="center">
            {row.kind === 'web' ?
        <Globe size={14} className="text-fg-muted" /> :

        <Network size={14} className="text-fg-muted" />
        }
            <span className="font-medium">{row.name}</span>
          </ResponsiveStack>

    },
    {
      id: 'kind',
      header: 'Kind',
      width: 120,
      cell: ({ row }) =>
      <Badge tone="neutral">
            {row.kind === 'web' ? 'Web filter' : 'Network'}
          </Badge>

    },
    {
      id: 'description',
      header: 'Description',
      cell: ({ row }) => <span className="text-fg-muted text-sm">{row.description}</span>
    },
    {
      id: 'appliedTo',
      header: 'Applied to',
      width: 110,
      align: 'right',
      cell: ({ row }) =>
      row.appliedTo === 0 ?
      <span className="text-fg-subtle text-sm">—</span> :

      <span className="text-sm">
              {row.appliedTo} department{row.appliedTo !== 1 ? 's' : ''}
            </span>

    },
    {
      id: 'lastModifiedAt',
      header: 'Modified',
      width: 100,
      cell: ({ row }) => <span className="text-sm">{timeAgo(row.lastModifiedAt)}</span>
    }],

    []
  );

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PreviewBanner />
        <PageHeader
          title="Policies"
          count={`${POLICIES.length} templates`} />
        
        <DataTable
          rows={POLICIES}
          columns={columns}
          rowId={(r) => r.id}
          defaultDensity="compact"
          onRowClick={(r) => router.push(`/policies/${r.id}`)} />
        
      </ResponsiveStack>
    </Page>);

}