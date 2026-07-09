'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Page,
  Button,
  Alert,
  Dialog,
  DialogBody,
  DialogTitle,
  EmptyState,
  ResponsiveStack,
  Skeleton } from
'@infinibay/harbor';
import {
  Fingerprint,
  ArrowLeft } from
'lucide-react';

import {
  useDeleteIdentityGroupRoleMappingMutation,
  useDeleteIdentityProviderMutation,
  useIdentityGroupRoleMappingsQuery,
  useIdentityProviderQuery,
  useIdentitySyncRunsQuery,
  useSyncIdentityProviderMutation,
  useTestIdentityProviderMutation,
  useUpdateIdentityProviderMutation,
  useUpsertIdentityGroupRoleMappingMutation
} from '@/gql/hooks';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';

import { ProviderDetailHeader } from './_components/ProviderDetailHeader';
import { ProviderOverviewCards } from './_components/ProviderOverviewCards';
import { ConnectionDetailsTable } from './_components/ConnectionDetailsTable';
import { GroupRoleMappingsSection } from './_components/GroupRoleMappingsSection';
import { SyncRunsSection } from './_components/SyncRunsSection';
import { EditDirectoryDialog } from './_components/EditDirectoryDialog';

const EMPTY_EDIT_FORM = {
  providerType: 'ACTIVE_DIRECTORY',
  name: '',
  domain: '',
  host: '',
  port: '389',
  enabled: true,
  useTls: false,
  tlsCa: '',
  tlsInsecureSkipVerify: false,
  baseDn: '',
  bindDn: '',
  bindPassword: '',
  userFilter: '',
  groupFilter: ''
};

function parsePort(value, useTls) {
  const raw = String(value ?? '').trim();
  if (raw === '') return useTls ? 636 : 389;
  if (!/^\d+$/.test(raw)) return null;
  const port = Number(raw);
  if (!Number.isInteger(port) || port < 1 || port > 65535) return null;
  return port;
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
    loading: syncRunsLoading,
    error: syncRunsError,
    refetch: refetchSyncRuns
  } = useIdentitySyncRunsQuery({
    variables: { providerId: connectorId },
    skip: connectorId === 'local',
    fetchPolicy: 'cache-and-network'
  });
  const {
    data: mappingData,
    loading: mappingLoading,
    error: mappingError,
    refetch: refetchMappings
  } = useIdentityGroupRoleMappingsQuery({
    variables: { providerId: connectorId },
    skip: connectorId === 'local',
    fetchPolicy: 'cache-and-network'
  });

  // No polling: the backend emits 'identity' events for this provider (config
  // changes, sync started/completed/failed) — refetch on them instead of every 30s.
  // Filter to events for THIS provider so another provider's activity is ignored.
  const isThisProvider = (_action, event) => {
    const d = event?.data;
    return d?.id === connectorId || d?.providerId === connectorId;
  };
  const skipIdentityRealtime = connectorId === 'local';
  useRealtimeRefetch('identity', refetchProvider, {
    actions: ['update', 'completed', 'failed'], predicate: isThisProvider, skip: skipIdentityRealtime
  });
  useRealtimeRefetch('identity', refetchSyncRuns, {
    actions: ['started', 'completed', 'failed'], predicate: isThisProvider, skip: skipIdentityRealtime
  });
  useRealtimeRefetch('identity', refetchMappings, {
    actions: ['update'], predicate: isThisProvider, skip: skipIdentityRealtime
  });
  const [testIdentityProvider, { loading: providerTesting }] = useTestIdentityProviderMutation();
  const [syncIdentityProvider, { loading: providerSyncing }] = useSyncIdentityProviderMutation();
  const [updateIdentityProvider, { loading: providerUpdating }] = useUpdateIdentityProviderMutation();
  const [upsertGroupRoleMapping, { loading: mappingSaving }] = useUpsertIdentityGroupRoleMappingMutation();
  const [deleteGroupRoleMapping, { loading: mappingDeleting }] = useDeleteIdentityGroupRoleMappingMutation();
  const [deleteIdentityProvider, { loading: providerDeleting }] = useDeleteIdentityProviderMutation();
  const provider = providerData?.identityProvider;

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [groupDn, setGroupDn] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupRole, setGroupRole] = useState('USER');

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);

  const updateEditForm = (key, value) => {
    setEditForm((current) => ({ ...current, [key]: value }));
  };

  // Pre-populate the edit form from the loaded provider. The bind password is
  // never returned by the server, so it stays blank (blank = keep existing).
  const openEdit = () => {
    if (!provider) return;
    setEditForm({
      providerType: provider.providerType || 'ACTIVE_DIRECTORY',
      name: provider.name || '',
      domain: provider.domain || '',
      host: provider.host || '',
      port: provider.port != null ? String(provider.port) : '',
      enabled: provider.enabled !== false,
      useTls: !!provider.useTls,
      tlsCa: provider.tlsCa || '',
      tlsInsecureSkipVerify: !!provider.tlsInsecureSkipVerify,
      baseDn: provider.baseDn || '',
      bindDn: provider.bindDn || '',
      bindPassword: '',
      userFilter: provider.userFilter || '',
      groupFilter: provider.groupFilter || ''
    });
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditForm(EMPTY_EDIT_FORM);
  };

  const saveEdit = async () => {
    if (!provider?.id) return;
    const name = editForm.name.trim();
    const host = editForm.host.trim();
    const baseDn = editForm.baseDn.trim();
    if (!name || !host || !baseDn) {
      toast.error('Name, host, and base DN are required');
      return;
    }
    const port = parsePort(editForm.port, editForm.useTls);
    if (port === null) {
      toast.error('Port must be an integer between 1 and 65535');
      return;
    }
    const input = {
      providerType: editForm.providerType,
      name,
      domain: editForm.domain.trim() || null,
      host,
      port,
      enabled: editForm.enabled,
      useTls: editForm.useTls,
      tlsCa: editForm.tlsCa.trim() || null,
      tlsInsecureSkipVerify: editForm.tlsInsecureSkipVerify,
      baseDn,
      bindDn: editForm.bindDn.trim() || null,
      userFilter: editForm.userFilter.trim() || null,
      groupFilter: editForm.groupFilter.trim() || null,
      // Only send a password when the user typed a new one; blank keeps existing.
      ...(editForm.bindPassword ? { bindPassword: editForm.bindPassword } : {})
    };
    try {
      await updateIdentityProvider({ variables: { id: provider.id, input } });
      toast.success('Identity provider updated');
      closeEdit();
      await refetchProvider();
    } catch (err) {
      toast.error(err?.message || 'Could not update identity provider');
    }
  };

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

  const deleteGroupMapping = async (mapping) => {
    if (!mapping?.id) return;
    try {
      const result = await deleteGroupRoleMapping({ variables: { id: mapping.id } });
      // The mutation resolves to Boolean!; a false result is a soft failure
      // (no exception thrown) and must not be surfaced as success.
      if (result?.data?.deleteIdentityGroupRoleMapping !== true) {
        throw new Error('The server did not confirm the removal.');
      }
      await refetchMappings();
      toast.success('Group mapping removed');
    } catch (err) {
      toast.error(err?.message || 'Could not remove group mapping');
      throw err;
    }
  };

  const confirmDeleteProvider = async () => {
    if (!provider?.id) return;
    try {
      const result = await deleteIdentityProvider({ variables: { id: provider.id } });
      // deleteIdentityProvider resolves to Boolean!; treat a false result as a
      // failure instead of navigating away as though it succeeded.
      if (result?.data?.deleteIdentityProvider !== true) {
        throw new Error('The server did not confirm the deletion.');
      }
      toast.success('Directory provider deleted');
      setDeleteConfirmOpen(false);
      router.push('/identity');
    } catch (err) {
      toast.error(err?.message || 'Could not delete directory provider');
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

  // A failed fetch with no cached provider is an error, not a "not found".
  // Show a retryable error surface so a transient network/server failure is
  // never mislabelled as a missing directory.
  if (providerError && !provider) {
    return (
      <Page>
        <ResponsiveStack direction="col" gap={4}>
          <EmptyState
            icon={<Fingerprint size={18} />}
            title="Could not load this directory"
            description={providerError.message || 'Something went wrong while loading this identity provider.'}
            actions={
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                icon={<ArrowLeft size={14} />}
                onClick={() => router.push('/identity')}>
                Back to identity
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => refetchProvider()}>
                Retry
              </Button>
            </div>
            } />
        </ResponsiveStack>
      </Page>);
  }

  if (!provider) {
    return (
      <Page>
        <ResponsiveStack direction="col" gap={4}>
          <EmptyState
            icon={<Fingerprint size={18} />}
            title="Provider not found"
            description="This identity provider does not exist or was removed."
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

  const providerRuns = syncRunsData?.identitySyncRuns || [];
  const providerMappings = mappingData?.identityGroupRoleMappings || [];

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        {providerError ? (
          <Alert
            tone="warning"
            title="Could not refresh this directory"
            actions={
              <Button size="sm" variant="secondary" onClick={() => refetchProvider()}>
                Retry
              </Button>
            }
          >
            {providerError.message || 'Showing the last loaded details. The latest data may be out of date.'}
          </Alert>
        ) : null}

        <ProviderDetailHeader
          provider={provider}
          onBack={() => router.push('/identity')}
          onEdit={openEdit}
          onTest={runProviderTest}
          onSync={runProviderSync}
          onDelete={() => setDeleteConfirmOpen(true)}
          testing={providerTesting}
          syncing={providerSyncing}
        />

        <ProviderOverviewCards provider={provider} />

        <ConnectionDetailsTable provider={provider} />

        <GroupRoleMappingsSection
          mappings={providerMappings}
          loading={mappingLoading}
          error={mappingError}
          onRetry={() => refetchMappings()}
          groupDn={groupDn}
          setGroupDn={setGroupDn}
          groupName={groupName}
          setGroupName={setGroupName}
          groupRole={groupRole}
          setGroupRole={setGroupRole}
          saving={mappingSaving}
          onSave={saveGroupRoleMapping}
          onDeleteMapping={deleteGroupMapping}
          mappingDeleting={mappingDeleting}
        />

        <SyncRunsSection
          runs={providerRuns}
          loading={syncRunsLoading}
          error={syncRunsError}
          onRetry={() => refetchSyncRuns()}
        />
      </ResponsiveStack>

      {editOpen ? (
        <EditDirectoryDialog
          form={editForm}
          onChange={updateEditForm}
          onClose={closeEdit}
          onSave={saveEdit}
          saving={providerUpdating}
          hasBindPassword={provider?.hasBindPassword}
        />
      ) : null}

      {deleteConfirmOpen ? (
        <Dialog
          open
          size="sm"
          onClose={() => {
            if (!providerDeleting) setDeleteConfirmOpen(false);
          }}
        >
          <DialogTitle>Delete this directory?</DialogTitle>
          <DialogBody>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-fg-muted m-0">
                Removing <span className="font-medium text-fg">{provider.name}</span> deletes this
                connector. Users already imported from it stay in Infinibay but will no longer be
                synced or able to sign in through this directory. This cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setDeleteConfirmOpen(false)}
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
