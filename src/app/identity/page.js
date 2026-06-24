'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Page,
  Badge,
  Button,
  Checkbox,
  DataTable,
  Dialog,
  DialogBody,
  DialogTitle,
  EmptyState,
  FieldRow,
  FormField,
  ResponsiveStack,
  Select,
  Skeleton,
  StatusDot,
  TextField } from
'@infinibay/harbor';
import { AlertCircle, Fingerprint, RefreshCw, Shield, UserRoundCog, Users } from 'lucide-react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/common/PageHeader';
import { fetchUsers } from '@/state/slices/users';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import {
  useCreateIdentityProviderMutation,
  useIdentityProvidersQuery,
  useTestIdentityProviderConfigMutation
} from '@/gql/hooks';

const TYPE_LABEL = {
  local: 'Local directory',
  ACTIVE_DIRECTORY: 'Active Directory',
  LDAP: 'LDAP'
};

function parsePort(value, useTls) {
  const raw = String(value ?? '').trim();
  if (raw === '') return useTls ? 636 : 389;
  if (!/^\d+$/.test(raw)) return null;
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) return null;
  return port;
}

function statusMeta(status) {
  switch (status) {
    case 'CONNECTED':
      return { dot: 'online', label: 'Connected' };
    case 'SYNCING':
      return { dot: 'provisioning', label: 'Syncing' };
    case 'ERROR':
      return { dot: 'degraded', label: 'Error' };
    case 'DISCONNECTED':
    default:
      return { dot: 'offline', label: 'Disconnected' };
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

function roleLabel(role) {
  if (role === 'SUPER_ADMIN') return 'Super admin';
  if (role === 'ADMIN') return 'Admin';
  return 'User';
}

export default function IdentityListPage() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectorForm, setConnectorForm] = useState({
    providerType: 'ACTIVE_DIRECTORY',
    name: 'Active Directory',
    domain: '',
    host: '',
    port: '389',
    useTls: false,
    baseDn: '',
    bindDn: '',
    bindPassword: '',
    userFilter: '(objectClass=user)',
    groupFilter: '(objectClass=group)'
  });

  const {
    data: users,
    isLoading,
    error,
    refresh
  } = useEnsureData('users', fetchUsers, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 3 * 60 * 1000
  });
  const {
    data: providerData,
    loading: providersLoading,
    error: providersError,
    refetch: refetchProviders
  } = useIdentityProvidersQuery({
    fetchPolicy: 'cache-and-network',
    pollInterval: 30_000
  });
  const [createIdentityProvider, { loading: creatingProvider }] = useCreateIdentityProviderMutation();
  const [testIdentityProviderConfig, { loading: testingProviderConfig }] = useTestIdentityProviderConfigMutation();

  const updateConnectorForm = (key, value) => {
    setConnectorForm((current) => ({ ...current, [key]: value }));
  };

  // Builds the create/test input, validating required fields and the port.
  // Returns null (and toasts) when the form is invalid so callers can bail.
  const connectorInput = () => {
    const name = connectorForm.name.trim();
    const host = connectorForm.host.trim();
    const baseDn = connectorForm.baseDn.trim();
    if (!name || !host || !baseDn) {
      toast.error('Name, host, and base DN are required');
      return null;
    }
    const port = parsePort(connectorForm.port, connectorForm.useTls);
    if (port === null) {
      toast.error('Port must be an integer between 1 and 65535');
      return null;
    }
    return {
      providerType: connectorForm.providerType,
      name,
      domain: connectorForm.domain.trim() || null,
      host,
      port,
      useTls: connectorForm.useTls,
      baseDn,
      bindDn: connectorForm.bindDn.trim() || null,
      bindPassword: connectorForm.bindPassword || null,
      userFilter: connectorForm.userFilter.trim() || null,
      groupFilter: connectorForm.groupFilter.trim() || null
    };
  };

  const handleCreateConnector = async () => {
    const input = connectorInput();
    if (!input) return;
    try {
      await createIdentityProvider({ variables: { input } });
      toast.success('Identity connector created');
      toast.info('Run Test or Sync to verify the directory connection');
      setDialogOpen(false);
      await refetchProviders();
    } catch (err) {
      toast.error(err?.message || 'Could not create identity connector');
    }
  };

  const handleTestConnectorConfig = async () => {
    const input = connectorInput();
    if (!input) return;
    try {
      const result = await testIdentityProviderConfig({ variables: { input } });
      const test = result?.data?.testIdentityProviderConfig;
      toast[test?.success ? 'success' : 'error'](test?.message || 'Connection test finished');
    } catch (err) {
      toast.error(err?.message || 'Connection test failed');
    }
  };

  const stats = useMemo(() => {
    const list = users || [];
    return {
      total: list.length,
      admins: list.filter((user) => user.role === 'ADMIN' || user.role === 'SUPER_ADMIN').length,
      endUsers: list.filter((user) => user.role === 'USER').length,
      lastCreatedAt: list
        .map((user) => user.createdAt)
        .filter(Boolean)
        .sort()
        .at(-1)
    };
  }, [users]);

  const providerRows = useMemo(() => {
    const externalProviders = providerData?.identityProviders || [];

    return [
      {
        id: 'local',
        name: 'Local Infinibay directory',
        type: 'local',
        status: error ? 'ERROR' : 'CONNECTED',
        lastSyncAt: stats.lastCreatedAt,
        usersSynced: stats.total,
        groupsSynced: 0,
        _external: false
      },
      ...externalProviders.map((provider) => ({
        id: provider.id,
        name: provider.name,
        type: provider.providerType,
        status: provider.status,
        lastSyncAt: provider.lastSyncAt || provider.lastTestAt,
        usersSynced: 0,
        groupsSynced: 0,
        host: provider.host,
        port: provider.port,
        enabled: provider.enabled,
        lastError: provider.lastError,
        _external: true
      }))
    ];
  }, [error, providerData?.identityProviders, stats]);

  const roleRows = useMemo(() => {
    const list = users || [];
    const byRole = new Map();
    for (const user of list) {
      const role = user.role || 'USER';
      byRole.set(role, (byRole.get(role) || 0) + 1);
    }
    return ['SUPER_ADMIN', 'ADMIN', 'USER'].map((role) => ({
      id: role,
      role,
      users: byRole.get(role) || 0,
      scope:
        role === 'SUPER_ADMIN'
          ? 'Full platform ownership'
          : role === 'ADMIN'
            ? 'Operator access'
            : 'Assigned desktops'
    }));
  }, [users]);

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
      width: 170,
      cell: ({ row }) => {
        const meta = statusMeta(row.status);
        return (
          <ResponsiveStack direction="col" gap={1} align="start">
            <ResponsiveStack direction="row" gap={2} align="center">
              <StatusDot status={meta.dot} size={8} />
              <span className="text-sm">{meta.label}</span>
            </ResponsiveStack>
            {row.lastError ? (
              <ResponsiveStack direction="row" gap={1} align="center">
                <AlertCircle size={12} className="text-warning shrink-0" />
                <span className="text-xs text-warning truncate max-w-[140px]" title={row.lastError}>
                  {row.lastError}
                </span>
              </ResponsiveStack>
            ) : null}
          </ResponsiveStack>
        );
      }

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
    },
    {
      id: 'actions',
      header: '',
      width: 100,
      align: 'right',
      cell: ({ row }) => row._external ? (
        <Button size="sm" variant="ghost" onClick={() => router.push(`/identity/${row.id}`)}>
          Open
        </Button>
      ) : (
        <Button size="sm" variant="ghost" onClick={() => router.push('/users')}>
          Users
        </Button>
      )
    }],

    [router]
  );

  const roleColumns = useMemo(
    () => [
      {
        id: 'role',
        header: 'Role',
        cell: ({ row }) => (
          <ResponsiveStack direction="row" gap={2} align="center">
            <Shield size={14} className="text-fg-muted" />
            <span className="font-medium">{roleLabel(row.role)}</span>
          </ResponsiveStack>
        )
      },
      {
        id: 'scope',
        header: 'Scope',
        cell: ({ row }) => <span className="text-sm text-fg-muted">{row.scope}</span>
      },
      {
        id: 'users',
        header: 'Users',
        width: 90,
        align: 'right',
        cell: ({ row }) => <span className="font-mono text-xs">{row.users}</span>
      }
    ],
    []
  );

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PageHeader
          title="Identity"
          count={`${stats.total} user${stats.total !== 1 ? 's' : ''}`}
          description="Sign-in sources and role coverage for this Infinibay instance."
          primary={
            <Button variant="primary" onClick={() => router.push('/users')}>
              <UserRoundCog size={14} />
              Manage users
            </Button>
          }
          secondary={
            <ResponsiveStack direction="row" gap={2}>
              <Button variant="secondary" onClick={() => setDialogOpen(true)}>
                <Fingerprint size={14} />
                Add directory
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  refresh();
                  refetchProviders();
                }}
                disabled={isLoading || providersLoading}
              >
                <RefreshCw size={14} />
                Refresh
              </Button>
            </ResponsiveStack>
          }
        />

        {(isLoading && !users) || (providersLoading && !providerData) ? (
          <ResponsiveStack direction="col" gap={3}>
            <Skeleton height={160} />
            <Skeleton height={180} />
          </ResponsiveStack>
        ) : null}

        {(error && !users) || (providersError && !providerData) ? (
          <EmptyState
            icon={<Fingerprint size={22} />}
            title="Identity data unavailable"
            description="The backend identity directory could not be loaded."
            actions={
              <Button
                variant="primary"
                onClick={() => {
                  refresh();
                  refetchProviders();
                }}
              >
                Retry
              </Button>
            }
          />
        ) : null}

        {users ? (
          <>
            <ResponsiveStack
              direction={{ base: 'col', lg: 'row' }}
              gap={4}
              align="stretch"
            >
              <div className="flex-1 min-w-0 rounded-sm border border-white/10 bg-surface-1 p-4">
                <ResponsiveStack direction="col" gap={3}>
                  <ResponsiveStack direction="row" gap={2} align="center">
                    <Users size={16} className="text-fg-muted" />
                    <span className="text-sm font-medium">Local directory</span>
                  </ResponsiveStack>
                  <ResponsiveStack direction="row" gap={6} wrap>
                    <ResponsiveStack direction="col" gap={0}>
                      <span className="text-2xl font-semibold">{stats.total}</span>
                      <span className="text-sm text-fg-muted">users</span>
                    </ResponsiveStack>
                    <ResponsiveStack direction="col" gap={0}>
                      <span className="text-2xl font-semibold">{stats.admins}</span>
                      <span className="text-sm text-fg-muted">operators</span>
                    </ResponsiveStack>
                    <ResponsiveStack direction="col" gap={0}>
                      <span className="text-2xl font-semibold">{stats.endUsers}</span>
                      <span className="text-sm text-fg-muted">workspace users</span>
                    </ResponsiveStack>
                  </ResponsiveStack>
                </ResponsiveStack>
              </div>

              <div className="w-full lg:w-72 rounded-sm border border-white/10 bg-surface-1 p-4">
                <ResponsiveStack direction="col" gap={3}>
                  <ResponsiveStack direction="row" gap={2} align="center">
                    <Fingerprint size={16} className="text-fg-muted" />
                    <span className="text-sm font-medium">External directories</span>
                  </ResponsiveStack>
                  <ResponsiveStack direction="col" gap={1}>
                    <Badge tone={providerData?.identityProviders?.length ? 'success' : 'warning'}>
                      {providerData?.identityProviders?.length || 0} configured
                    </Badge>
                    <span className="text-sm text-fg-muted">
                      Active Directory and LDAP connector profiles are stored in the backend. User/group sync is the next integration step.
                    </span>
                  </ResponsiveStack>
                </ResponsiveStack>
              </div>
            </ResponsiveStack>

            <DataTable
              rows={providerRows}
              columns={columns}
              rowId={(r) => r.id}
              defaultDensity="compact" />

            <DataTable
              rows={roleRows}
              columns={roleColumns}
              rowId={(r) => r.id}
              defaultDensity="compact" />
          </>
        ) : null}
        
      </ResponsiveStack>

      {dialogOpen ? (
        <Dialog open size="lg" onClose={() => setDialogOpen(false)}>
          <DialogTitle>Add Directory</DialogTitle>
          <DialogBody>
            <div className="flex flex-col gap-4 w-full">
              <FieldRow>
                <FormField label="Type">
                  <Select
                    aria-label="Type"
                    value={connectorForm.providerType}
                    onChange={(value) => {
                      updateConnectorForm('providerType', value);
                      updateConnectorForm('name', value === 'LDAP' ? 'LDAP Directory' : 'Active Directory');
                      updateConnectorForm('port', connectorForm.useTls ? '636' : '389');
                    }}
                    options={[
                      { value: 'ACTIVE_DIRECTORY', label: 'Active Directory' },
                      { value: 'LDAP', label: 'LDAP' }
                    ]}
                  />
                </FormField>
                <FormField label="Name" required>
                  <TextField
                    value={connectorForm.name}
                    onChange={(event) => updateConnectorForm('name', event.target.value)}
                    placeholder="Corporate AD"
                  />
                </FormField>
              </FieldRow>

              <FieldRow>
                <FormField label="Host" required>
                  <TextField
                    value={connectorForm.host}
                    onChange={(event) => updateConnectorForm('host', event.target.value)}
                    placeholder="dc01.example.com"
                  />
                </FormField>
                <FormField label="Port" required>
                  <TextField
                    value={connectorForm.port}
                    onChange={(event) => updateConnectorForm('port', event.target.value)}
                    placeholder={connectorForm.useTls ? '636' : '389'}
                  />
                </FormField>
              </FieldRow>

              <Checkbox
                label="Use TLS"
                checked={connectorForm.useTls}
                onChange={(event) => {
                  updateConnectorForm('useTls', event.target.checked);
                  updateConnectorForm('port', event.target.checked ? '636' : '389');
                }}
              />

              <FormField label="Domain">
                <TextField
                  value={connectorForm.domain}
                  onChange={(event) => updateConnectorForm('domain', event.target.value)}
                  placeholder="example.com"
                />
              </FormField>
              <FormField label="Base DN" required>
                <TextField
                  value={connectorForm.baseDn}
                  onChange={(event) => updateConnectorForm('baseDn', event.target.value)}
                  placeholder="DC=example,DC=com"
                />
              </FormField>
              <FormField label="Bind DN">
                <TextField
                  value={connectorForm.bindDn}
                  onChange={(event) => updateConnectorForm('bindDn', event.target.value)}
                  placeholder="CN=infinibay,OU=Service Accounts,DC=example,DC=com"
                />
              </FormField>
              <FormField label="Bind password">
                <TextField
                  type="password"
                  value={connectorForm.bindPassword}
                  onChange={(event) => updateConnectorForm('bindPassword', event.target.value)}
                  placeholder="Stored encrypted in the backend"
                />
              </FormField>

              <FieldRow>
                <FormField label="User filter">
                  <TextField
                    value={connectorForm.userFilter}
                    onChange={(event) => updateConnectorForm('userFilter', event.target.value)}
                  />
                </FormField>
                <FormField label="Group filter">
                  <TextField
                    value={connectorForm.groupFilter}
                    onChange={(event) => updateConnectorForm('groupFilter', event.target.value)}
                  />
                </FormField>
              </FieldRow>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => setDialogOpen(false)}
                  disabled={creatingProvider || testingProviderConfig}
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleTestConnectorConfig}
                  loading={testingProviderConfig}
                  disabled={creatingProvider}
                >
                  Test
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreateConnector}
                  loading={creatingProvider}
                  disabled={testingProviderConfig}
                >
                  Create
                </Button>
              </div>
            </div>
          </DialogBody>
        </Dialog>
      ) : null}
    </Page>);

}
