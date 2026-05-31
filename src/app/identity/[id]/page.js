'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Page,
  Alert,
  Badge,
  Button,
  DataTable,
  EmptyState,
  ResponsiveStack,
  Skeleton,
  StatusDot } from
'@infinibay/harbor';
import {
  Fingerprint,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  RefreshCw } from
'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import {
  useDeleteIdentityGroupRoleMappingMutation,
  useIdentityGroupRoleMappingsQuery,
  useIdentityProviderQuery,
  useIdentitySyncRunsQuery,
  useSyncIdentityProviderMutation,
  useTestIdentityProviderMutation,
  useUpsertIdentityGroupRoleMappingMutation
} from '@/gql/hooks';

const TYPE_LABEL = {
  ACTIVE_DIRECTORY: 'Active Directory',
  AD: 'Active Directory',
  LDAP: 'LDAP'
};

function providerStatusMeta(status) {
  switch (status) {
    case 'CONNECTED':
      return { dot: 'online', tone: 'success', label: 'Connected' };
    case 'SYNCING':
      return { dot: 'provisioning', tone: 'info', label: 'Syncing' };
    case 'ERROR':
      return { dot: 'degraded', tone: 'warning', label: 'Error' };
    case 'DISCONNECTED':
    default:
      return { dot: 'offline', tone: 'neutral', label: 'Disconnected' };
  }
}

function timeAgo(iso) {
  if (!iso) return '-';
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.round(ms / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

function KV({ label, value, mono }) {
  return (
    <div className="flex gap-3 items-baseline">
      <span className="text-fg-muted text-sm w-28 shrink-0">{label}</span>
      <span className={mono ? 'font-mono text-sm' : 'text-sm'}>{value}</span>
    </div>);

}

export default function IdentityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const connectorId = String(params.id || '');

  // The local directory is managed on the Users page, not here.
  useEffect(() => {
    if (connectorId === 'local') {
      router.replace('/users');
    }
  }, [connectorId, router]);

  const {
    data: providerData,
    loading: providerLoading,
    error: providerError,
    refetch: refetchProvider
  } = useIdentityProviderQuery({
    variables: { id: connectorId },
    skip: connectorId === 'local',
    fetchPolicy: 'cache-and-network'
  });
  const {
    data: syncRunsData,
    refetch: refetchSyncRuns
  } = useIdentitySyncRunsQuery({
    variables: { providerId: connectorId },
    skip: connectorId === 'local',
    fetchPolicy: 'cache-and-network'
  });
  const {
    data: mappingData,
    refetch: refetchMappings
  } = useIdentityGroupRoleMappingsQuery({
    variables: { providerId: connectorId },
    skip: connectorId === 'local',
    fetchPolicy: 'cache-and-network'
  });
  const [testIdentityProvider, { loading: providerTesting }] = useTestIdentityProviderMutation();
  const [syncIdentityProvider, { loading: providerSyncing }] = useSyncIdentityProviderMutation();
  const [upsertGroupRoleMapping, { loading: mappingSaving }] = useUpsertIdentityGroupRoleMappingMutation();
  const [deleteGroupRoleMapping, { loading: mappingDeleting }] = useDeleteIdentityGroupRoleMappingMutation();
  const provider = providerData?.identityProvider;

  const [groupDn, setGroupDn] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupRole, setGroupRole] = useState('USER');

  const providerRunColumns = useMemo(() => [
  {
    id: 'status',
    header: 'Status',
    width: 120,
    cell: ({ row: r }) =>
    <ResponsiveStack direction="row" gap={2} align="center">
          <StatusDot status={r.status === 'SUCCESS' ? 'online' : r.status === 'ERROR' ? 'degraded' : 'provisioning'} size={8} />
          <span className="text-sm">{r.status}</span>
        </ResponsiveStack>

  },
  { id: 'startedAt', header: 'Started', width: 150, cell: ({ row: r }) => <span className="text-sm">{timeAgo(r.startedAt)}</span> },
  { id: 'usersCreated', header: '+ Users', width: 80, align: 'right', cell: ({ row: r }) => <span className="font-mono text-xs">{r.usersCreated}</span> },
  { id: 'usersUpdated', header: '~ Users', width: 80, align: 'right', cell: ({ row: r }) => <span className="font-mono text-xs">{r.usersUpdated}</span> },
  { id: 'groupsSeen', header: 'Groups', width: 80, align: 'right', cell: ({ row: r }) => <span className="font-mono text-xs">{r.groupsSeen}</span> },
  { id: 'message', header: 'Message', cell: ({ row: r }) => <span className={r.error ? 'text-sm text-danger' : 'text-sm text-fg-muted'}>{r.error || r.message || '—'}</span> }],
  []);

  const providerMappingColumns = useMemo(() => [
  { id: 'groupName', header: 'Group', cell: ({ row: r }) => <span className="text-sm font-medium">{r.groupName}</span> },
  { id: 'groupDn', header: 'DN', cell: ({ row: r }) => <span className="font-mono text-xs text-fg-muted break-all">{r.groupDn}</span> },
  { id: 'role', header: 'Role', width: 140, cell: ({ row: r }) => <Badge tone={r.role === 'USER' ? 'neutral' : 'info'}>{r.role}</Badge> },
  {
    id: 'actions',
    header: '',
    width: 100,
    align: 'right',
    cell: ({ row: r }) =>
    <Button
          size="sm"
          variant="secondary"
          disabled={mappingDeleting}
          onClick={async () => {
            await deleteGroupRoleMapping({ variables: { id: r.id } });
            await refetchMappings();
          }}>
          Delete
        </Button>

  }],
  [deleteGroupRoleMapping, mappingDeleting, refetchMappings]);

  const runProviderTest = async () => {
    if (!provider?.id) return;
    try {
      const result = await testIdentityProvider({ variables: { id: provider.id } });
      const test = result?.data?.testIdentityProvider;
      toast[test?.success ? 'success' : 'error'](test?.message || 'Connection test finished');
      await refetchProvider();
    } catch (err) {
      toast.error(err?.message || 'Connection test failed');
    }
  };

  const runProviderSync = async () => {
    if (!provider?.id) return;
    try {
      const result = await syncIdentityProvider({ variables: { id: provider.id } });
      const sync = result?.data?.syncIdentityProvider;
      toast[sync?.success ? 'success' : 'error'](sync?.message || 'Directory sync finished');
      await refetchProvider();
      await refetchSyncRuns();
    } catch (err) {
      toast.error(err?.message || 'Directory sync failed');
    }
  };

  const saveGroupRoleMapping = async () => {
    if (!provider?.id || !groupDn.trim()) return;
    try {
      await upsertGroupRoleMapping({
        variables: {
          input: {
            providerId: provider.id,
            groupDn: groupDn.trim(),
            groupName: groupName.trim() || undefined,
            role: groupRole
          }
        }
      });
      setGroupDn('');
      setGroupName('');
      setGroupRole('USER');
      await refetchMappings();
      toast.success('Group mapping saved');
    } catch (err) {
      toast.error(err?.message || 'Could not save group mapping');
    }
  };

  if (connectorId === 'local') {
    return null;
  }

  if (providerLoading && !provider) {
    return (
      <Page>
        <ResponsiveStack direction="col" gap={3}>
          <Skeleton height={88} />
          <Skeleton height={240} />
        </ResponsiveStack>
      </Page>
    );
  }

  if (!provider || providerError) {
    return (
      <Page>
        <ResponsiveStack direction="col" gap={4}>
          <EmptyState
            icon={<Fingerprint size={18} />}
            title="Provider not found"
            description={providerError?.message || 'This identity provider does not exist or was removed.'}
            actions={
            <Button
              size="sm"
              variant="secondary"
              icon={<ArrowLeft size={14} />}
              onClick={() => router.push('/identity')}>
                Back to identity
              </Button>
            } />
        </ResponsiveStack>
      </Page>);
  }

  const meta = providerStatusMeta(provider.status);
  const connectionRows = [
    { id: 'host', label: 'Host', value: provider.host },
    { id: 'port', label: 'Port', value: String(provider.port), mono: true },
    { id: 'tls', label: 'TLS', value: provider.useTls ? 'Enabled' : 'Disabled' },
    { id: 'domain', label: 'Domain', value: provider.domain },
    { id: 'baseDn', label: 'Base DN', value: provider.baseDn, mono: true },
    { id: 'bindDn', label: 'Bind DN', value: provider.bindDn, mono: true },
    { id: 'password', label: 'Bind password', value: provider.hasBindPassword ? 'Stored' : 'Not configured' },
    { id: 'userFilter', label: 'User filter', value: provider.userFilter, mono: true },
    { id: 'groupFilter', label: 'Group filter', value: provider.groupFilter, mono: true }
  ];
  const providerColumns = [
    {
      id: 'label',
      header: 'Setting',
      width: 180,
      cell: ({ row }) => <span className="text-sm text-fg-muted">{row.label}</span>
    },
    {
      id: 'value',
      header: 'Value',
      cell: ({ row }) => (
        <span className={row.mono ? 'font-mono text-xs break-all' : 'text-sm'}>
          {row.value || '—'}
        </span>
      )
    }
  ];
  const providerRuns = syncRunsData?.identitySyncRuns || [];
  const providerMappings = mappingData?.identityGroupRoleMappings || [];

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PageHeader
          title={provider.name}
          count={TYPE_LABEL[provider.providerType] || provider.providerType}
          description={`${provider.host}:${provider.port}`}
          secondary={
            <Button
              size="sm"
              variant="secondary"
              icon={<ArrowLeft size={14} />}
              onClick={() => router.push('/identity')}
            >
              Back
            </Button>
          }
          primary={
            <ResponsiveStack direction="row" gap={2} align="center">
              <Button
                size="sm"
                variant="secondary"
                icon={<RefreshCw size={14} />}
                onClick={runProviderTest}
                loading={providerTesting}
              >
                Test connection
              </Button>
              <Button
                size="sm"
                variant="primary"
                icon={<RefreshCw size={14} />}
                onClick={runProviderSync}
                loading={providerSyncing}
                disabled={!provider.enabled}
              >
                Sync now
              </Button>
            </ResponsiveStack>
          }
        />

        <ResponsiveStack direction={{ base: 'col', lg: 'row' }} gap={4} align="stretch">
          <div className="flex-1 min-w-0 rounded-md border border-border-subtle bg-surface-raised p-4">
            <ResponsiveStack direction="col" gap={3}>
              <ResponsiveStack direction="row" gap={2} align="center" justify="between">
                <ResponsiveStack direction="row" gap={2} align="center">
                  <StatusDot status={meta.dot} size={8} />
                  <span className="text-sm font-medium">Connection</span>
                </ResponsiveStack>
                <Badge tone={meta.tone}>{meta.label}</Badge>
              </ResponsiveStack>
              <KV label="Last test" value={timeAgo(provider.lastTestAt)} />
              <KV label="Last sync" value={timeAgo(provider.lastSyncAt)} />
              <KV label="Enabled" value={provider.enabled ? 'Yes' : 'No'} />
              {provider.lastError ? (
                <Alert tone="warning" icon={<AlertCircle size={14} />} title="Last connection error">
                  {provider.lastError}
                </Alert>
              ) : null}
            </ResponsiveStack>
          </div>

          <div className="w-full lg:w-80 rounded-md border border-border-subtle bg-surface-raised p-4">
            <ResponsiveStack direction="col" gap={3}>
              <ResponsiveStack direction="row" gap={2} align="center">
                <CheckCircle2 size={16} className="text-fg-muted" />
                <span className="text-sm font-medium">Sync readiness</span>
              </ResponsiveStack>
              <span className="text-sm text-fg-muted">
                Sync imports directory users into Infinibay as standard users and links them to this connector for future updates.
              </span>
              <KV label="Users" value="Created and updated during manual sync" />
              <KV label="Groups" value={provider.groupFilter ? 'Counted during sync' : 'No group filter configured'} />
            </ResponsiveStack>
          </div>
        </ResponsiveStack>

        <DataTable
          rows={connectionRows}
          columns={providerColumns}
          rowId={(r) => r.id}
          defaultDensity="compact"
        />

        <section className="flex flex-col gap-3">
          <div className="pb-2 border-b border-white/5">
            <h2 className="text-base font-semibold m-0">
              Group role mappings <span className="text-fg-muted text-xs font-normal">· {providerMappings.length}</span>
            </h2>
          </div>
          <div className="rounded-md border border-border-subtle bg-surface-raised p-3">
            <ResponsiveStack direction={{ base: 'col', lg: 'row' }} gap={2} align="end">
              <label className="flex flex-col gap-1 flex-[2] min-w-0">
                <span className="text-xs text-fg-muted">Group DN</span>
                <input
                  className="h-9 rounded-md border border-border-subtle bg-surface px-3 text-sm outline-none"
                  value={groupDn}
                  onChange={(event) => setGroupDn(event.target.value)}
                  placeholder="CN=VDI Admins,OU=Groups,DC=example,DC=com"
                />
              </label>
              <label className="flex flex-col gap-1 flex-1 min-w-0">
                <span className="text-xs text-fg-muted">Display name</span>
                <input
                  className="h-9 rounded-md border border-border-subtle bg-surface px-3 text-sm outline-none"
                  value={groupName}
                  onChange={(event) => setGroupName(event.target.value)}
                  placeholder="VDI Admins"
                />
              </label>
              <label className="flex flex-col gap-1 w-full lg:w-40">
                <span className="text-xs text-fg-muted">Role</span>
                <select
                  className="h-9 rounded-md border border-border-subtle bg-surface px-3 text-sm outline-none"
                  value={groupRole}
                  onChange={(event) => setGroupRole(event.target.value)}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>
              </label>
              <Button
                size="sm"
                variant="primary"
                loading={mappingSaving}
                disabled={!groupDn.trim()}
                onClick={saveGroupRoleMapping}
              >
                Save
              </Button>
            </ResponsiveStack>
          </div>
          {providerMappings.length > 0 ? (
            <DataTable
              rows={providerMappings}
              columns={providerMappingColumns}
              rowId={(r) => r.id}
              defaultDensity="compact"
            />
          ) : (
            <EmptyState
              icon={<Fingerprint size={18} />}
              title="No group mappings"
              description="Users sync as USER until a directory group is mapped to an Infinibay role."
            />
          )}
        </section>

        {providerRuns.length > 0 ? (
          <section className="flex flex-col gap-2">
            <div className="pb-2 border-b border-white/5">
              <h2 className="text-base font-semibold m-0">
                Recent sync runs <span className="text-fg-muted text-xs font-normal">· {providerRuns.length}</span>
              </h2>
            </div>
            <DataTable
              rows={providerRuns}
              columns={providerRunColumns}
              rowId={(r) => r.id}
              defaultDensity="compact"
            />
          </section>
        ) : (
          <EmptyState
            icon={<RefreshCw size={18} />}
            title="No sync runs yet"
            description="Run a manual sync to import directory users and record the first sync result."
          />
        )}
      </ResponsiveStack>
    </Page>);

}
