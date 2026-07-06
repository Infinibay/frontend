'use client';

import { useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  DataTable,
  Dialog,
  DialogBody,
  DialogTitle,
  EmptyState,
  FormField,
  ResponsiveStack,
  Select,
  Skeleton,
  TextField } from
'@infinibay/harbor';
import { Fingerprint } from 'lucide-react';

// Friendly labels for the role enum, mirroring roleLabel() on the identity list
// page so the mapping form and table read consistently across the route.
const ROLE_OPTIONS = [
  { value: 'USER', label: 'User' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SUPER_ADMIN', label: 'Super admin' }
];

const roleLabel = (role) =>
  ROLE_OPTIONS.find((option) => option.value === role)?.label || role;

export function GroupRoleMappingsSection({
  mappings,
  loading,
  error,
  onRetry,
  groupDn,
  setGroupDn,
  groupName,
  setGroupName,
  groupRole,
  setGroupRole,
  saving,
  onSave,
  onDeleteMapping,
  mappingDeleting
}) {
  const [confirmTarget, setConfirmTarget] = useState(null);

  const closeConfirm = () => {
    if (!mappingDeleting) setConfirmTarget(null);
  };

  const confirmDelete = async () => {
    if (!confirmTarget) return;
    try {
      await onDeleteMapping(confirmTarget);
      setConfirmTarget(null);
    } catch {
      // The handler surfaces the error toast; keep the dialog open so the
      // user can retry or cancel the destructive action.
    }
  };

  const providerMappingColumns = useMemo(() => [
  { id: 'groupName', header: 'Group', cell: ({ row: r }) => <span className="text-sm font-medium">{r.groupName || '—'}</span> },
  { id: 'groupDn', header: 'DN', cell: ({ row: r }) => <span className="font-mono text-xs text-fg-muted break-all">{r.groupDn}</span> },
  { id: 'role', header: 'Role', width: 140, cell: ({ row: r }) => <Badge tone={r.role === 'USER' ? 'neutral' : 'info'}>{roleLabel(r.role)}</Badge> },
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
          onClick={() => setConfirmTarget(r)}>
          Delete
        </Button>

  }],
  [mappingDeleting]);

  const renderMappings = () => {
    if (loading && mappings.length === 0) {
      return (
        <ResponsiveStack direction="col" gap={2}>
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
        </ResponsiveStack>
      );
    }
    // Block with the error Alert only when there is nothing to show. A transient
    // poll error over already-loaded mappings surfaces inline (below) instead of
    // unmounting the table.
    if (error && mappings.length === 0) {
      return (
        <Alert
          tone="danger"
          title="Could not load group mappings"
          actions={
            onRetry ? (
              <Button size="sm" variant="secondary" onClick={onRetry}>
                Retry
              </Button>
            ) : null
          }
        >
          {error.message || 'Something went wrong while loading group role mappings.'}
        </Alert>
      );
    }
    if (mappings.length > 0) {
      return (
        <ResponsiveStack direction="col" gap={2}>
          {error ? (
            <Alert
              tone="danger"
              title="Couldn't refresh group mappings"
              actions={
                onRetry ? (
                  <Button size="sm" variant="secondary" onClick={onRetry}>
                    Retry
                  </Button>
                ) : null
              }
            >
              Showing the last-known mappings.
            </Alert>
          ) : null}
          <DataTable
            rows={mappings}
            columns={providerMappingColumns}
            rowId={(r) => r.id}
            defaultDensity="compact"
          />
        </ResponsiveStack>
      );
    }
    return (
      <EmptyState
        icon={<Fingerprint size={18} />}
        title="No group mappings"
        description="Users sync as USER until a directory group is mapped to an Infinibay role."
      />
    );
  };

  return (
    <section className="flex flex-col gap-3">
      <div className="pb-2 border-b border-border-subtle">
        <h2 className="text-base font-semibold m-0">
          Group role mappings <span className="text-fg-muted text-xs font-normal">· {mappings.length}</span>
        </h2>
      </div>
      <div className="rounded-md border border-border-subtle bg-surface-raised p-3">
        <ResponsiveStack direction={{ base: 'col', lg: 'row' }} gap={2} align="end">
          <div className="flex-[2] min-w-0 w-full">
            <FormField label="Group DN">
              <TextField
                value={groupDn}
                onChange={(event) => setGroupDn(event.target.value)}
                placeholder="CN=VDI Admins,OU=Groups,DC=example,DC=com"
              />
            </FormField>
          </div>
          <div className="flex-1 min-w-0 w-full">
            <FormField label="Display name">
              <TextField
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
                placeholder="VDI Admins"
              />
            </FormField>
          </div>
          <div className="w-full lg:w-40">
            <FormField label="Role">
              <Select
                aria-label="Role"
                value={groupRole}
                onChange={(value) => setGroupRole(value)}
                options={ROLE_OPTIONS}
              />
            </FormField>
          </div>
          <Button
            size="sm"
            variant="primary"
            loading={saving}
            disabled={!groupDn.trim()}
            onClick={onSave}
          >
            Save
          </Button>
        </ResponsiveStack>
      </div>
      {renderMappings()}

      {confirmTarget ? (
        <Dialog open size="sm" onClose={closeConfirm}>
          <DialogTitle>Remove group mapping?</DialogTitle>
          <DialogBody>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-fg-muted m-0">
                Remove the mapping for{' '}
                <span className="font-medium text-fg">
                  {confirmTarget.groupName || confirmTarget.groupDn}
                </span>
                ? Members of this group will sync as USER until it is mapped again.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={closeConfirm} disabled={mappingDeleting}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete} loading={mappingDeleting}>
                  Remove mapping
                </Button>
              </div>
            </div>
          </DialogBody>
        </Dialog>
      ) : null}
    </section>
  );
}
