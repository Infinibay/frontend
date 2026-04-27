'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Page,
  Badge,
  DataTable,
  ResponsiveStack,
  StatusDot } from
'@infinibay/harbor';
import { Fingerprint } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { PreviewBanner } from '@/components/common/PreviewBanner';
import { IDENTITY_PROVIDERS } from '@/lib/mockData/identity';

const TYPE_LABEL = {
  AD: 'Active Directory',
  LDAP: 'LDAP',
  AzureAD: 'Azure AD',
  GoogleWorkspace: 'Google Workspace',
  Okta: 'Okta'
};

function timeAgo(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.round(ms / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export default function IdentityListPage() {
  const router = useRouter();

  const columns = useMemo(
    () => [
    {
      id: 'name',
      header: 'Name',
      cell: ({ row }) =>
      <ResponsiveStack direction="row" gap={2} align="center">
            <Fingerprint size={14} className="text-fg-muted" />
            <span className="font-medium">{row.name}</span>
          </ResponsiveStack>

    },
    {
      id: 'type',
      header: 'Type',
      width: 170,
      cell: ({ row }) =>
      <Badge tone="neutral">{TYPE_LABEL[row.type] || row.type}</Badge>

    },
    {
      id: 'status',
      header: 'Sync status',
      width: 130,
      cell: ({ row }) =>
      <ResponsiveStack direction="row" gap={2} align="center">
            <StatusDot
          status={row.status === 'ok' ? 'online' : row.status === 'error' ? 'degraded' : 'provisioning'}
          size={8} />
        
            <span className="capitalize text-sm">
              {row.status === 'ok' ? 'Healthy' : row.status}
            </span>
          </ResponsiveStack>

    },
    {
      id: 'lastSyncAt',
      header: 'Last sync',
      width: 120,
      cell: ({ row }) => <span className="text-sm">{timeAgo(row.lastSyncAt)}</span>
    },
    {
      id: 'usersSynced',
      header: 'Users',
      width: 80,
      align: 'right',
      cell: ({ row }) => <span className="font-mono text-xs">{row.usersSynced}</span>
    },
    {
      id: 'groupsSynced',
      header: 'Groups',
      width: 80,
      align: 'right',
      cell: ({ row }) => <span className="font-mono text-xs">{row.groupsSynced}</span>
    }],

    []
  );

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PreviewBanner />
        <PageHeader
          title="Identity"
          count={`${IDENTITY_PROVIDERS.length} provider${IDENTITY_PROVIDERS.length !== 1 ? 's' : ''}`} />
        
        <DataTable
          rows={IDENTITY_PROVIDERS}
          columns={columns}
          rowId={(r) => r.id}
          defaultDensity="compact"
          onRowClick={(r) => router.push(`/identity/${r.id}`)} />
        
      </ResponsiveStack>
    </Page>);

}