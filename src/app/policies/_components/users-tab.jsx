import { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Combobox,
  DataTable,
  EmptyState,
  ResponsiveStack,
  Select,
  TextField } from
'@infinibay/harbor';
import { Plus, RefreshCw, ShieldCheck, UserPlus } from 'lucide-react';

import { PermissionScope, GrantEffect } from '@/gql/graphql';
import { SectionCard } from './section-card';

// User-role assignment + per-user overrides (the "User access" tab body).
// State stays owned by the page and arrives as props (except the local list
// filter, which is pure view state).
export const UsersTab = ({
  roleableUsers,
  usersLoading,
  usersError,
  refreshUsers,
  overridesError,
  refetchOverrides,
  userNameById,
  canAssignRole,
  changingRoleFor,
  handleChangeUserRole,
  roleOptions,
  systemRoleIdByKey,
  overrideUserId,
  setOverrideUserId,
  userList,
  overrideResource,
  setOverrideResource,
  overrideVerb,
  setOverrideVerb,
  overrideScope,
  setOverrideScope,
  overrideEffect,
  setOverrideEffect,
  overrideResourceOptions,
  overrideVerbOptions,
  settingOverride,
  overridePermission,
  canGrantUser,
  handleAddOverride,
  overridesLoading,
  overrides,
  overrideColumns
}) => {
  const [userQuery, setUserQuery] = useState('');
  const filteredUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase();
    if (!q) return roleableUsers;
    return roleableUsers.filter((u) => {
      const name = (userNameById.get(u.id) || '').toLowerCase();
      return name.includes(q) || (u.email || '').toLowerCase().includes(q);
    });
  }, [roleableUsers, userNameById, userQuery]);

  // The override user picker is a typeahead so a large directory stays usable.
  const overrideUserOptions = useMemo(
    () =>
      userList.map((u) => ({
        value: u.id,
        label: `${userNameById.get(u.id)} · ${u.email}`
      })),
    [userList, userNameById]
  );

  return (
    <>
      <SectionCard icon={<UserPlus size={16} className="text-fg-muted" />} title="User roles">
        <ResponsiveStack direction="col" gap={2}>
          <span className="text-fg-muted text-xs">
            Every user has exactly one role — change it inline. Fine-grained per-user tweaks live in “Per-user overrides” below.
          </span>
          {usersError ? (
            <Alert
              tone="danger"
              title="Couldn't load users"
              actions={
                refreshUsers ? (
                  <Button size="sm" variant="secondary" icon={<RefreshCw size={14} />} onClick={refreshUsers}>
                    Retry
                  </Button>
                ) : null
              }>
              {typeof usersError === 'string' ? usersError : usersError?.message || 'Please try again.'}
            </Alert>
          ) : usersLoading && !roleableUsers.length ? (
            <span className="text-fg-muted text-sm">Loading users…</span>
          ) : !roleableUsers.length ? (
            <EmptyState
              icon={<UserPlus size={18} />}
              title="No users"
              description="There are no users to manage yet." />
          ) : (
            <>
              <TextField
                label="Search users by name or email"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)} />
              {filteredUsers.length ? (
                <div className="divide-y divide-[color:var(--harbor-border-subtle)] rounded-sm border border-[color:var(--harbor-border-subtle)]">
                  {filteredUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between gap-3 px-3.5 py-2">
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium">{userNameById.get(u.id)}</span>
                        <span className="truncate text-xs text-fg-muted">{u.email}</span>
                      </div>
                      <div className="w-56 shrink-0">
                        <Select
                          size="sm"
                          value={u.roleId || systemRoleIdByKey.get(u.role)}
                          disabled={changingRoleFor === u.id || !canAssignRole}
                          onChange={(roleId) => handleChangeUserRole(u.id, roleId)}
                          options={roleOptions} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-fg-muted text-sm">No users match “{userQuery}”.</span>
              )}
            </>
          )}
        </ResponsiveStack>
      </SectionCard>

      {/* ---------------------------------------------------------------- */}
      {/* Per-user overrides                                               */}
      {/* ---------------------------------------------------------------- */}
      <SectionCard icon={<ShieldCheck size={16} className="text-fg-muted" />} title="Per-user overrides">
        <div className="w-full lg:w-96">
          <Combobox
            label="User"
            placeholder="Search for a user…"
            value={overrideUserId}
            onChange={setOverrideUserId}
            options={overrideUserOptions} />
        </div>

        {!overrideUserId ? (
          <EmptyState
            icon={<ShieldCheck size={18} />}
            title="Pick a user"
            description="Choose a user to view and manage their permission overrides." />
        ) : (
          <ResponsiveStack direction="col" gap={3}>
            <ResponsiveStack direction={{ base: 'col', lg: 'row' }} gap={2} align="end">
              <div className="flex-1 min-w-0">
                <Select
                  label="Resource"
                  value={overrideResource}
                  onChange={(v) => { setOverrideResource(v); setOverrideVerb(''); }}
                  options={[{ value: '', label: '— resource —' }, ...overrideResourceOptions]} />
              </div>
              <div className="flex-1 min-w-0">
                <Select
                  label="Action"
                  value={overrideVerb}
                  onChange={setOverrideVerb}
                  disabled={!overrideResource}
                  options={[{ value: '', label: '— action —' }, ...overrideVerbOptions]} />
              </div>
              <div className="w-full lg:w-44">
                <Select
                  label="Scope"
                  value={overrideScope}
                  onChange={setOverrideScope}
                  options={[
                  { value: PermissionScope.Own, label: 'Own' },
                  { value: PermissionScope.Department, label: 'Department' },
                  { value: PermissionScope.Any, label: 'Any' }]
                  } />
              </div>
              <div className="w-full lg:w-36">
                <Select
                  label="Effect"
                  value={overrideEffect}
                  onChange={setOverrideEffect}
                  options={[
                  { value: GrantEffect.Allow, label: 'Allow' },
                  { value: GrantEffect.Deny, label: 'Deny' }]
                  } />
              </div>
              <Button
                variant="primary"
                icon={<Plus size={14} />}
                loading={settingOverride}
                disabled={!overridePermission || !canGrantUser}
                onClick={handleAddOverride}>
                Add
              </Button>
            </ResponsiveStack>

            {overridesError ? (
              <Alert
                tone="danger"
                title="Couldn't load overrides"
                actions={
                  refetchOverrides ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<RefreshCw size={14} />}
                      onClick={() => refetchOverrides().catch(() => {})}>
                      Retry
                    </Button>
                  ) : null
                }>
                {overridesError?.message || 'Please try again.'}
              </Alert>
            ) : overridesLoading && !overrides.length ? (
              <span className="text-fg-muted text-sm">Loading overrides…</span>
            ) : overrides.length ? (
              <DataTable rows={overrides} columns={overrideColumns} rowId={(r) => r.id} defaultDensity="compact" />
            ) : (
              <EmptyState
                icon={<ShieldCheck size={18} />}
                title="No overrides"
                description="This user inherits everything from their role(s). Add an override above to allow or deny a specific permission." />
            )}
          </ResponsiveStack>
        )}
      </SectionCard>
    </>
  );
};
