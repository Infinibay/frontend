'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Page,
  Alert,
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
  Textarea,
  TextField } from
'@infinibay/harbor';
import {
  AlertCircle,
  ExternalLink,
  Fingerprint,
  PlugZap,
  RefreshCw,
  Shield,
  Trash2,
  UserRoundCog,
  Users } from
'lucide-react';
import { toast } from 'sonner';

import { PageHeader } from '@/components/common/PageHeader';
import { RowContextMenu } from '@/components/common/RowContextMenu';
import { fetchUsers } from '@/state/slices/users';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';
import {
  useCreateIdentityProviderMutation,
  useDeleteIdentityProviderMutation,
  useIdentityProvidersQuery,
  useSyncIdentityProviderMutation,
  useTestIdentityProviderConfigMutation,
  useTestIdentityProviderMutation
} from '@/gql/hooks';
// Shared identity helper — single source of truth lives with the detail page.
import { timeAgo } from './[id]/_components/utils';

const TYPE_LABEL = {
  local: 'Local directory',
  ACTIVE_DIRECTORY: 'Active Directory',
  LDAP: 'LDAP'
};

// Initial state for the "Add directory" form. Reused to reset the form whenever
// the dialog closes so a previous connector's values (including the bind
// password secret) never leak into the next open.
const EMPTY_CONNECTOR_FORM = {
  providerType: 'ACTIVE_DIRECTORY',
  name: 'Active Directory',
  domain: '',
  host: '',
  port: '389',
  useTls: false,
  tlsCa: '',
  tlsInsecureSkipVerify: false,
  baseDn: '',
  bindDn: '',
  bindPassword: '',
  userFilter: '(objectClass=user)',
  groupFilter: '(objectClass=group)'
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

function roleLabel(role) {
  if (role === 'SUPER_ADMIN') return 'Super admin';
  if (role === 'ADMIN') return 'Admin';
  return 'User';
}

export default function IdentityListPage() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectorForm, setConnectorForm] = useState(EMPTY_CONNECTOR_FORM);
  // Tracks whether the user has manually edited name/port so the Type/TLS
  // helpers don't clobber values the user typed themselves.
  const [touched, setTouched] = useState({ name: false, port: false });
  const [formErrors, setFormErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

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
    fetchPolicy: 'cache-and-network'
  });
  // No polling: the backend emits 'identity' events on provider create/update/delete
  // and sync completion — refetch the list on those instead of every 30s.
  useRealtimeRefetch('identity', refetchProviders, {
    actions: ['create', 'update', 'delete', 'completed', 'failed']
  });
  const [createIdentityProvider, { loading: creatingProvider }] = useCreateIdentityProviderMutation();
  const [testIdentityProviderConfig, { loading: testingProviderConfig }] = useTestIdentityProviderConfigMutation();
  const [testIdentityProvider, { loading: providerTesting }] = useTestIdentityProviderMutation();
  const [syncIdentityProvider, { loading: providerSyncing }] = useSyncIdentityProviderMutation();
  const [deleteIdentityProvider, { loading: providerDeleting }] = useDeleteIdentityProviderMutation();

  const updateConnectorForm = (key, value) => {
    setConnectorForm((current) => ({ ...current, [key]: value }));
  };

  const clearFieldError = (key) => {
    setFormErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setConnectorForm(EMPTY_CONNECTOR_FORM);
    setTouched({ name: false, port: false });
    setFormErrors({});
  };

  // Builds the create/test input, validating required fields and the port.
  // Returns null when the form is invalid (and highlights the offending fields
  // inline via FormField `error`) so callers can bail.
  const connectorInput = () => {
    const name = connectorForm.name.trim();
    const host = connectorForm.host.trim();
    const baseDn = connectorForm.baseDn.trim();
    const port = parsePort(connectorForm.port, connectorForm.useTls);

    const nextErrors = {};
    if (!name) nextErrors.name = 'Name is required';
    if (!host) nextErrors.host = 'Host is required';
    if (!baseDn) nextErrors.baseDn = 'Base DN is required';
    if (port === null) nextErrors.port = 'Port must be an integer between 1 and 65535';
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return null;

    return {
      providerType: connectorForm.providerType,
      name,
      domain: connectorForm.domain.trim() || null,
      host,
      port,
      useTls: connectorForm.useTls,
      tlsCa: connectorForm.tlsCa.trim() || null,
      tlsInsecureSkipVerify: connectorForm.tlsInsecureSkipVerify,
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
      closeDialog();
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

  // Row action: test the saved provider by id.
  const handleRowTest = async (provider) => {
    if (!provider?.id) return;
    try {
      const result = await testIdentityProvider({ variables: { id: provider.id } });
      const test = result?.data?.testIdentityProvider;
      toast[test?.success ? 'success' : 'error'](test?.message || 'Connection test finished');
      await refetchProviders();
    } catch (err) {
      toast.error(err?.message || 'Connection test failed');
    }
  };

  // Row action: sync the saved provider by id.
  const handleRowSync = async (provider) => {
    if (!provider?.id) return;
    try {
      const result = await syncIdentityProvider({ variables: { id: provider.id } });
      const sync = result?.data?.syncIdentityProvider;
      toast[sync?.success ? 'success' : 'error'](sync?.message || 'Directory sync finished');
      await refetchProviders();
    } catch (err) {
      toast.error(err?.message || 'Directory sync failed');
    }
  };

  const confirmDeleteProvider = async () => {
    if (!deleteTarget?.id) return;
    try {
      await deleteIdentityProvider({ variables: { id: deleteTarget.id } });
      toast.success('Directory provider deleted');
      setDeleteTarget(null);
      await refetchProviders();
    } catch (err) {
      toast.error(err?.message || 'Could not delete directory provider');
    }
  };

  // Refresh/Retry: never leave the promise rejection unhandled when the backend
  // is unreachable (the exact scenario these buttons exist for).
  const handleRefresh = async () => {
    await Promise.allSettled([refresh(), refetchProviders()]);
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
        // Show the real sync time only; a connection test is not a sync. timeAgo
        // renders "-" when the directory has never synced.
        lastSyncAt: provider.lastSyncAt,
        // The provider type carries no synced counts and we don't fetch per-row
        // sync runs on the list, so render "unknown" (—) rather than a false 0.
        usersSynced: null,
        groupsSynced: null,
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
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.usersSynced == null ? '—' : row.usersSynced}</span>
      )
    },
    {
      id: 'groupsSynced',
      header: 'Groups',
      width: 80,
      align: 'right',
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.groupsSynced == null ? '—' : row.groupsSynced}</span>
      )
    },
    {
      id: 'actions',
      header: '',
      width: 100,
      align: 'right',
      cell: ({ row }) => row._external ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={(event) => {
            event.stopPropagation();
            router.push(`/identity/${row.id}`);
          }}
        >
          Open
        </Button>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          onClick={(event) => {
            event.stopPropagation();
            router.push('/users');
          }}
        >
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

  // Exclusive page states: loading → skeleton; else fatal (users unavailable) →
  // EmptyState; else content. A providers-only failure keeps the page and is
  // surfaced inline in the sign-in-sources section (never as a full EmptyState).
  const initialLoading = (isLoading && !users) || (providersLoading && !providerData && !providersError);
  const fatalError = !users && Boolean(error);
  const providersFailed = Boolean(providersError && !providerData);
  const providerCount = providerData?.identityProviders?.length || 0;

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
                onClick={handleRefresh}
                disabled={isLoading || providersLoading}
              >
                <RefreshCw size={14} />
                Refresh
              </Button>
            </ResponsiveStack>
          }
        />

        {initialLoading ? (
          <ResponsiveStack direction="col" gap={3}>
            <Skeleton height={160} />
            <Skeleton height={180} />
          </ResponsiveStack>
        ) : fatalError ? (
          <EmptyState
            icon={<Fingerprint size={22} />}
            title="Identity data unavailable"
            description="The backend identity directory could not be loaded."
            actions={
              <Button variant="primary" onClick={handleRefresh}>
                Retry
              </Button>
            }
          />
        ) : users ? (
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
                    {providersFailed ? (
                      <>
                        <Badge tone="warning">Unavailable</Badge>
                        <span className="text-sm text-fg-muted">
                          External directory connectors could not be loaded. Retry from the sign-in sources below.
                        </span>
                      </>
                    ) : (
                      <>
                        <Badge tone={providerCount ? 'success' : 'warning'}>
                          {providerCount} configured
                        </Badge>
                        <span className="text-sm text-fg-muted">
                          Active Directory and LDAP connector profiles are stored in the backend. User/group sync is the next integration step.
                        </span>
                      </>
                    )}
                  </ResponsiveStack>
                </ResponsiveStack>
              </div>
            </ResponsiveStack>

            <section className="flex flex-col gap-2">
              <h2 className="text-base font-semibold m-0">
                Sign-in sources{' '}
                <span className="text-fg-muted text-xs font-normal">· {providerRows.length}</span>
              </h2>
              {providersError ? (
                <Alert
                  tone="warning"
                  title="Could not load external directories"
                  actions={
                    <Button size="sm" variant="secondary" onClick={() => refetchProviders()}>
                      Retry
                    </Button>
                  }
                >
                  {providersError.message ||
                    'The local directory is shown. External connectors may be missing or out of date.'}
                </Alert>
              ) : null}
              <RowContextMenu
                rows={providerRows}
                rowId={(r) => r.id}
                labelFor={(r) => r.name}
                buildItems={(r) =>
                  r._external
                    ? [
                        {
                          label: 'Open',
                          icon: <ExternalLink size={14} />,
                          onSelect: () => router.push(`/identity/${r.id}`)
                        },
                        {
                          label: 'Test connection',
                          icon: <PlugZap size={14} />,
                          disabled: providerTesting,
                          onSelect: () => handleRowTest(r)
                        },
                        {
                          label: 'Sync now',
                          icon: <RefreshCw size={14} />,
                          disabled: providerSyncing,
                          onSelect: () => handleRowSync(r)
                        },
                        { separator: true },
                        {
                          label: 'Delete',
                          icon: <Trash2 size={14} />,
                          danger: true,
                          onSelect: () => setDeleteTarget(r)
                        }
                      ]
                    : [
                        {
                          label: 'Manage users',
                          icon: <Users size={14} />,
                          onSelect: () => router.push('/users')
                        }
                      ]
                }
              >
                <DataTable
                  rows={providerRows}
                  columns={columns}
                  rowId={(r) => r.id}
                  onRowClick={(row) => router.push(row._external ? `/identity/${row.id}` : '/users')}
                  defaultDensity="compact" />
              </RowContextMenu>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base font-semibold m-0">
                Role coverage{' '}
                <span className="text-fg-muted text-xs font-normal">· {roleRows.length}</span>
              </h2>
              <DataTable
                rows={roleRows}
                columns={roleColumns}
                rowId={(r) => r.id}
                defaultDensity="compact" />
            </section>
          </>
        ) : null}

      </ResponsiveStack>

      {dialogOpen ? (
        <Dialog
          open
          size="lg"
          onClose={() => {
            if (!creatingProvider && !testingProviderConfig) closeDialog();
          }}
        >
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
                      // Only auto-fill fields the user hasn't touched.
                      if (!touched.name) {
                        updateConnectorForm('name', value === 'LDAP' ? 'LDAP Directory' : 'Active Directory');
                      }
                      if (!touched.port) {
                        updateConnectorForm('port', connectorForm.useTls ? '636' : '389');
                      }
                    }}
                    options={[
                      { value: 'ACTIVE_DIRECTORY', label: 'Active Directory' },
                      { value: 'LDAP', label: 'LDAP' }
                    ]}
                  />
                </FormField>
                <FormField label="Name" required error={formErrors.name}>
                  <TextField
                    value={connectorForm.name}
                    onChange={(event) => {
                      updateConnectorForm('name', event.target.value);
                      setTouched((current) => ({ ...current, name: true }));
                      clearFieldError('name');
                    }}
                    placeholder="Corporate AD"
                  />
                </FormField>
              </FieldRow>

              <FieldRow>
                <FormField label="Host" required error={formErrors.host}>
                  <TextField
                    value={connectorForm.host}
                    onChange={(event) => {
                      updateConnectorForm('host', event.target.value);
                      clearFieldError('host');
                    }}
                    placeholder="dc01.example.com"
                  />
                </FormField>
                <FormField label="Port" required error={formErrors.port}>
                  <TextField
                    value={connectorForm.port}
                    onChange={(event) => {
                      updateConnectorForm('port', event.target.value);
                      setTouched((current) => ({ ...current, port: true }));
                      clearFieldError('port');
                    }}
                    placeholder={connectorForm.useTls ? '636' : '389'}
                  />
                </FormField>
              </FieldRow>

              <Checkbox
                label="Use TLS"
                checked={connectorForm.useTls}
                onChange={(event) => {
                  updateConnectorForm('useTls', event.target.checked);
                  if (!touched.port) {
                    updateConnectorForm('port', event.target.checked ? '636' : '389');
                  }
                }}
              />

              {connectorForm.useTls ? (
                <>
                  <FormField label="TLS CA certificate (PEM)">
                    <Textarea
                      rows={4}
                      value={connectorForm.tlsCa}
                      onChange={(event) => updateConnectorForm('tlsCa', event.target.value)}
                      placeholder="-----BEGIN CERTIFICATE-----"
                    />
                  </FormField>
                  <Checkbox
                    label="Skip TLS certificate validation (insecure — disables cert validation; ignored in production)"
                    checked={connectorForm.tlsInsecureSkipVerify}
                    onChange={(event) => updateConnectorForm('tlsInsecureSkipVerify', event.target.checked)}
                  />
                </>
              ) : null}

              <FormField label="Domain">
                <TextField
                  value={connectorForm.domain}
                  onChange={(event) => updateConnectorForm('domain', event.target.value)}
                  placeholder="example.com"
                />
              </FormField>
              <FormField label="Base DN" required error={formErrors.baseDn}>
                <TextField
                  value={connectorForm.baseDn}
                  onChange={(event) => {
                    updateConnectorForm('baseDn', event.target.value);
                    clearFieldError('baseDn');
                  }}
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
                  onClick={closeDialog}
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

      {deleteTarget ? (
        <Dialog
          open
          size="sm"
          onClose={() => {
            if (!providerDeleting) setDeleteTarget(null);
          }}
        >
          <DialogTitle>Delete this directory?</DialogTitle>
          <DialogBody>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-fg-muted m-0">
                Removing <span className="font-medium text-fg">{deleteTarget.name}</span> deletes this
                connector. Users already imported from it stay in Infinibay but will no longer be
                synced or able to sign in through this directory. This cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setDeleteTarget(null)}
                  disabled={providerDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={confirmDeleteProvider}
                  loading={providerDeleting}
                >
                  Delete directory
                </Button>
              </div>
            </div>
          </DialogBody>
        </Dialog>
      ) : null}
    </Page>);

}
