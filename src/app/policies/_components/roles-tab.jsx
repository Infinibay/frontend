import {
  Accordion,
  AccordionItem,
  Alert,
  Badge,
  Button,
  EmptyState,
  IconButton,
  ResponsiveStack,
  TextField } from
'@infinibay/harbor';
import { Lock, Plus, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';

import { SectionCard } from './section-card';
import { ResourcePermissionItem } from './resource-permission-item';

// Roles list + permission editor (the "Roles & permissions" tab body).
// Extracted verbatim from the page — state stays owned by the page and arrives
// as props, so there is no behaviour change.
export const RolesTab = ({
  canCreateRole,
  canDeleteRole,
  canEditRole,
  rolesLoading,
  roles,
  selectedRoleId,
  setSelectedRoleId,
  creating,
  setCreating,
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
  return (
    <>
      <Alert tone="info" icon={<ShieldCheck size={14} />} title="SUPER_ADMIN is protected; changes are audited">
        The SUPER_ADMIN role is read-only and always retains full control. Every role, override, and
        department-role change is recorded in the Audit log tab.
      </Alert>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[20rem_1fr]">
        <SectionCard
          icon={<ShieldCheck size={16} className="text-fg-muted" />}
          title="Roles"
          action={
            canCreateRole ? (
              <Button
                variant="ghost"
                size="sm"
                icon={<Plus size={14} />}
                onClick={() => {
                  setNewRoleName('');
                  setNewRoleDescription('');
                  setCreating(true);
                }}>
                New
              </Button>
            ) : null
          }>
          <ResponsiveStack direction="col" gap={2}>
            {rolesLoading && !roles.length ? (
              <span className="text-fg-muted text-sm">Loading roles…</span>
            ) : roles.length ? (
              roles.map((role) => {
                const active = role.id === selectedRoleId;
                return (
                  // The selectable area and the delete action are siblings so we
                  // never nest an interactive control inside another one.
                  <div
                    key={role.id}
                    className={`flex items-center gap-1 rounded-sm border pr-1 transition-colors ${
                      active
                        ? 'border-[color:var(--harbor-border-strong)] bg-surface-2'
                        : 'border-[color:var(--harbor-border-subtle)] hover:bg-surface-2'
                    }`}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedRoleId(role.id)}
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-left focus:outline-none focus-visible:shadow-[var(--harbor-focus-shadow)]">
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="flex items-center gap-2 truncate text-sm font-medium">
                          {role.name}
                          {role.key === 'SUPER_ADMIN' ? (
                            <Lock size={12} className="text-fg-muted" />
                          ) : null}
                        </span>
                        {role.description ? (
                          <span className="text-fg-muted truncate text-xs">{role.description}</span>
                        ) : null}
                      </div>
                      {role.isSystem ? <Badge tone="info">system</Badge> : null}
                      <Badge tone="neutral">{role.userCount ?? 0}</Badge>
                    </button>
                    {!role.isSystem && canDeleteRole ? (
                      <IconButton
                        size="sm"
                        variant="ghost"
                        label={`Delete role ${role.name}`}
                        icon={<Trash2 size={12} />}
                        onClick={() => handleDeleteRole(role)} />
                    ) : null}
                  </div>
                );
              })
            ) : (
              <EmptyState
                icon={<ShieldCheck size={18} />}
                title="No roles yet"
                description="Create a role below to start granting permissions." />
            )}

            <div className="mt-2 flex flex-col gap-2 border-t border-[color:var(--harbor-border-subtle)] pt-3">
              {creating ? (
                <>
                  <span className="text-xs font-medium text-fg-muted">Create a new role</span>
                  <TextField
                    label="Role name"
                    aria-label="New role name"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)} />
                  <TextField
                    label="Description (optional)"
                    aria-label="New role description"
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)} />
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Plus size={14} />}
                      loading={creatingRole}
                      onClick={handleCreateRole}>
                      Create role
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setCreating(false)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : selectedRole ? (
                roleReadOnly ? (
                  <span className="text-xs text-fg-muted">
                    This system role is locked — its name and permissions can’t be changed.
                  </span>
                ) : !canEditRole ? (
                  <span className="text-xs text-fg-muted">
                    You don’t have permission to edit roles — this view is read-only.
                  </span>
                ) : (
                  <>
                    <span className="text-xs font-medium text-fg-muted">
                      Edit details{selectedRole.isSystem ? ' · system preset' : ''}
                    </span>
                    <TextField
                      label="Role name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)} />
                    <TextField
                      label="Description (optional)"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)} />
                    <Button
                      variant="secondary"
                      size="sm"
                      loading={updatingRole}
                      disabled={
                        !editName.trim() ||
                        (editName.trim() === selectedRole.name &&
                          editDescription.trim() === (selectedRole.description || ''))
                      }
                      onClick={handleSaveRole}>
                      Save changes
                    </Button>
                  </>
                )
              ) : (
                <span className="text-xs text-fg-muted">Select a role to edit, or “New” to create one.</span>
              )}
            </div>
          </ResponsiveStack>
        </SectionCard>

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
            <Accordion multiple defaultValue={resourcesByGroup[0]?.[1]?.[0]?.key}>
              {resourcesByGroup.map(([group, groupResources]) => (
                <div key={group} className="space-y-2">
                  <span className="text-fg-muted text-xs font-semibold uppercase tracking-wide">
                    {group}
                  </span>
                  {groupResources.map((resource) => (
                    <AccordionItem
                      key={resource.key}
                      value={resource.key}
                      title={
                        <span className="flex items-center gap-2">
                          {resource.label}
                          {!resource.scoped ? (
                            <Badge tone="neutral">global</Badge>
                          ) : null}
                        </span>
                      }>
                      <ResourcePermissionItem
                        resource={resource}
                        selectedRole={selectedRole}
                        effectiveGrants={effectiveGrants}
                        pendingGrants={pendingGrants}
                        roleEditLocked={roleEditLocked}
                        roleReadOnly={roleReadOnly}
                        changeGrant={changeGrant} />
                    </AccordionItem>
                  ))}
                </div>
              ))}
            </Accordion>
          )}
        </SectionCard>
      </div>
    </>
  );
};
