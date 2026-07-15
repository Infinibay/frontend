import { useState } from 'react';
import { Alert, Badge, Button, EmptyState, IconButton, ResponsiveStack } from '@infinibay/harbor';
import { Lock, Pencil, Plus, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';

import { SectionCard } from './section-card';
import { PermissionsWorkspace } from './permissions-workspace';
import { RoleFormDrawer } from './role-form-drawer';

// Roles list + permission editor (the "Roles & permissions" tab body).
// Layout is master-detail: roles (left) → PermissionsWorkspace (right), which
// owns all navigation view-state so selecting a resource never re-renders this
// roles list or the drawer. Data + mutations stay owned by the page.
export const RolesTab = ({
  canCreateRole,
  canDeleteRole,
  canEditRole,
  rolesLoading,
  roles,
  selectedRoleId,
  setSelectedRoleId,
  newRoleName,
  setNewRoleName,
  newRoleDescription,
  setNewRoleDescription,
  creatingRole,
  handleCreateRole,
  selectedRole,
  roleReadOnly,
  roleEditLocked,
  editName,
  setEditName,
  editDescription,
  setEditDescription,
  updatingRole,
  handleSaveRole,
  handleDeleteRole,
  resettingRole,
  handleResetRole,
  registryLoading,
  registry,
  resourcesByGroup,
  effectiveGrants,
  pendingGrants,
  changeGrant
}) => {
  const [drawer, setDrawer] = useState(null); // null | 'create' | 'edit'

  // Open the edit drawer with fields freshly synced from the role — never rely
  // on the page's selectedRoleId effect (a no-op when re-editing the same role),
  // which would leave stale/abandoned input in the form.
  const openEdit = (role) => {
    setSelectedRoleId(role.id);
    setEditName(role.name || '');
    setEditDescription(role.description || '');
    setDrawer('edit');
  };

  const openCreate = () => {
    setNewRoleName('');
    setNewRoleDescription('');
    setDrawer('create');
  };

  return (
    <>
      <Alert tone="info" icon={<ShieldCheck size={14} />} title="SUPER_ADMIN is protected; changes are audited">
        The SUPER_ADMIN role is read-only and always retains full control. Every role, override, and
        department-role change is recorded in the Audit log tab.
      </Alert>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[17rem_1fr]">
        {/* LEFT — roles */}
        <SectionCard
          icon={<ShieldCheck size={16} className="text-fg-muted" />}
          title="Roles"
          action={
            canCreateRole ? (
              <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={openCreate}>
                New
              </Button>
            ) : null
          }>
          <ResponsiveStack direction="col" gap={1}>
            {rolesLoading && !roles.length ? (
              <span className="text-fg-muted text-sm">Loading roles…</span>
            ) : roles.length ? (
              roles.map((role) => {
                const active = role.id === selectedRoleId;
                const editable = canEditRole && role.key !== 'SUPER_ADMIN';
                return (
                  // Selectable area + row actions are siblings so we never nest
                  // an interactive control inside another one.
                  <div
                    key={role.id}
                    className={`group flex items-center gap-1 rounded-md pr-1 transition-colors ${
                      active ? 'bg-surface-2' : 'hover:bg-surface-2/60'
                    }`}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedRoleId(role.id)}
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left focus:outline-none focus-visible:shadow-[var(--harbor-focus-shadow)]">
                      <span
                        className={`h-4 w-0.5 shrink-0 rounded-full ${active ? 'bg-accent' : 'bg-transparent'}`} />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="flex items-center gap-1.5 truncate text-sm font-medium">
                          {role.name}
                          {role.key === 'SUPER_ADMIN' ? (
                            <Lock size={11} className="text-fg-muted" />
                          ) : null}
                        </span>
                        {role.description ? (
                          <span className="text-fg-muted truncate text-xs">{role.description}</span>
                        ) : null}
                      </div>
                      {role.isSystem ? <Badge tone="info">system</Badge> : null}
                      <Badge tone="neutral">{role.userCount ?? 0}</Badge>
                    </button>
                    {editable || (!role.isSystem && canDeleteRole) ? (
                      <span className="flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                        {editable ? (
                          <IconButton
                            size="sm"
                            variant="ghost"
                            label={`Edit role ${role.name}`}
                            icon={<Pencil size={12} />}
                            onClick={() => openEdit(role)} />
                        ) : null}
                        {!role.isSystem && canDeleteRole ? (
                          <IconButton
                            size="sm"
                            variant="ghost"
                            label={`Delete role ${role.name}`}
                            icon={<Trash2 size={12} />}
                            onClick={() => handleDeleteRole(role)} />
                        ) : null}
                      </span>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <EmptyState
                icon={<ShieldCheck size={18} />}
                title="No roles yet"
                description="Create a role to start granting permissions." />
            )}
          </ResponsiveStack>
        </SectionCard>

        {/* RIGHT — permissions workspace */}
        <SectionCard
          icon={<ShieldCheck size={16} className="text-fg-muted" />}
          title={selectedRole ? `Permissions · ${selectedRole.name}` : 'Permissions'}
          action={
            <div className="flex items-center gap-2">
              {selectedRole?.isSystem && selectedRole?.key !== 'SUPER_ADMIN' && canEditRole ? (
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<RefreshCw size={14} />}
                  loading={resettingRole}
                  onClick={() => handleResetRole(selectedRole)}>
                  Reset to default
                </Button>
              ) : null}
              {roleEditLocked ? (
                <Badge tone="warning" icon={<Lock size={12} />}>
                  read-only
                </Badge>
              ) : null}
            </div>
          }>
          {!selectedRole ? (
            <EmptyState
              icon={<ShieldCheck size={18} />}
              title="Select a role"
              description="Pick a role on the left to edit its permissions." />
          ) : registryLoading && !registry ? (
            <span className="text-fg-muted text-sm">Loading permission registry…</span>
          ) : !resourcesByGroup.length ? (
            <EmptyState
              icon={<ShieldCheck size={18} />}
              title="No permissions registered"
              description="The permission registry returned no resources." />
          ) : (
            <PermissionsWorkspace
              resourcesByGroup={resourcesByGroup}
              selectedRole={selectedRole}
              effectiveGrants={effectiveGrants}
              pendingGrants={pendingGrants}
              roleEditLocked={roleEditLocked}
              roleReadOnly={roleReadOnly}
              changeGrant={changeGrant} />
          )}
        </SectionCard>
      </div>

      <RoleFormDrawer
        mode={drawer}
        onClose={() => setDrawer(null)}
        selectedRole={selectedRole}
        newRoleName={newRoleName}
        setNewRoleName={setNewRoleName}
        newRoleDescription={newRoleDescription}
        setNewRoleDescription={setNewRoleDescription}
        creatingRole={creatingRole}
        handleCreateRole={handleCreateRole}
        editName={editName}
        setEditName={setEditName}
        editDescription={editDescription}
        setEditDescription={setEditDescription}
        updatingRole={updatingRole}
        handleSaveRole={handleSaveRole} />
    </>
  );
};
