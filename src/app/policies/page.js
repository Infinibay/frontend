'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Page,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogButtons,
  ResponsiveStack,
  Tabs,
  TabList,
  Tab,
  TabPanel } from
'@infinibay/harbor';
import { RefreshCw, ShieldCheck, Users } from 'lucide-react';

import client from '@/apollo-client';
import { PageHeader } from '@/components/common/PageHeader';
import { fetchUsers } from '@/state/slices/users';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { usePermissions } from '@/hooks/usePermissions';
import { getSocketService } from '@/services/socketService';
import {
  usePermissionRegistryQuery,
  useRolesQuery,
  useUserPermissionOverridesQuery,
  useSetRolePermissionMutation,
  useRemoveRolePermissionMutation,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useResetRoleToDefaultMutation,
  useAssignUserRoleMutation,
  useSetUserPermissionOverrideMutation,
  useClearUserPermissionOverrideMutation
} from '@/gql/hooks';
import { PermissionScope, GrantEffect } from '@/gql/graphql';
import { toast } from 'sonner';

import {
  DEPARTMENTS_Q,
  MEMBERS_Q,
  SET_MEMBER_M,
  REMOVE_MEMBER_M,
  AUDIT_Q
} from './_components/policies-gql';
import {
  NONE,
  POLICY_TABS,
  buildEffectiveGrants,
  humanizeVerb
} from './_components/policy-helpers';
import {
  createMemberColumns,
  createAuditColumns,
  createOverrideColumns
} from './_components/policy-columns';
import { RolesTab } from './_components/roles-tab';
import { UsersTab } from './_components/users-tab';
import { DepartmentsTab } from './_components/departments-tab';
import { AuditTab } from './_components/audit-tab';

export default function PoliciesListPage() {
  const router = useRouter();

  const {
    data: users,
    isLoading,
    error: usersError,
    refresh
  } = useEnsureData('users', fetchUsers, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 3 * 60 * 1000
  });

  // -------------------------------------------------------------------------
  // RBAC data
  // -------------------------------------------------------------------------
  const {
    data: registryData,
    loading: registryLoading,
    error: registryError
  } = usePermissionRegistryQuery();
  const {
    data: rolesData,
    loading: rolesLoading,
    error: rolesError,
    refetch: refetchRoles
  } = useRolesQuery({ fetchPolicy: 'cache-and-network' });

  const [setRolePermission] = useSetRolePermissionMutation();
  const [removeRolePermission] = useRemoveRolePermissionMutation();
  const [createRole, { loading: creatingRole }] = useCreateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();
  const [updateRole, { loading: updatingRole }] = useUpdateRoleMutation();
  const [resetRoleToDefault, { loading: resettingRole }] = useResetRoleToDefaultMutation();
  const [assignUserRole, { loading: assigning }] = useAssignUserRoleMutation();
  const [setUserPermissionOverride, { loading: settingOverride }] = useSetUserPermissionOverrideMutation();
  const [clearUserPermissionOverride] = useClearUserPermissionOverrideMutation();

  const registry = registryData?.permissionRegistry;
  const roles = useMemo(() => rolesData?.roles || [], [rolesData]);

  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const selectedRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId) || null,
    [roles, selectedRoleId]
  );
  const roleReadOnly = selectedRole?.key === 'SUPER_ADMIN';

  // -------------------------------------------------------------------------
  // Capability gating — ADMINs reach this page via role:view/audit:view but
  // cannot perform the governance mutations (role:create/edit/delete/assign,
  // permission:grantUser). Disable the write controls so they get a read-only
  // page instead of raw FORBIDDEN toasts. While permissions are still loading
  // stay optimistic (treat as allowed) to avoid a flash of disabled controls.
  // -------------------------------------------------------------------------
  const { can, isLoading: permsLoading } = usePermissions();
  const canCreateRole = permsLoading || can('role:create');
  const canEditRole = permsLoading || can('role:edit');
  const canDeleteRole = permsLoading || can('role:delete');
  const canAssignRole = permsLoading || can('role:assign');
  const canGrantUser = permsLoading || can('permission:grantUser');
  // SUPER_ADMIN is always locked; editing any other role also needs role:edit.
  const roleEditLocked = roleReadOnly || !canEditRole;

  // Pick the first role when data lands.
  useEffect(() => {
    if (!selectedRoleId && roles.length) {
      setSelectedRoleId(roles[0].id);
    }
  }, [roles, selectedRoleId]);

  const effectiveGrants = useMemo(
    () => buildEffectiveGrants(selectedRole, registry),
    [selectedRole, registry]
  );

  // Group resources by registry group for the Accordion.
  const resourcesByGroup = useMemo(() => {
    const map = new Map();
    for (const r of registry?.resources || []) {
      if (!map.has(r.group)) map.set(r.group, []);
      map.get(r.group).push(r);
    }
    return Array.from(map.entries());
  }, [registry]);

  // -------------------------------------------------------------------------
  // New-role form
  // -------------------------------------------------------------------------
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [activeTab, setActiveTab] = useState('roles');

  // Shared confirm dialog (delete role / reset role / remove member). `action`
  // resolves to true on success (dialog closes) or false on failure (dialog
  // stays open, the action already surfaced its own error toast).
  const [confirmState, setConfirmState] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const runConfirm = async () => {
    if (!confirmState) return;
    setConfirmLoading(true);
    let ok = false;
    try {
      ok = await confirmState.action();
    } finally {
      setConfirmLoading(false);
    }
    if (ok) setConfirmState(null);
  };
  const closeConfirm = () => {
    if (!confirmLoading) setConfirmState(null);
  };

  // Per-permission in-flight scope changes → optimistic value + disabled group.
  const [pendingGrants, setPendingGrants] = useState({});

  // Pre-fill the edit fields from the selected role; selecting a role also
  // leaves "create" mode so the bottom panel always reflects the current intent.
  useEffect(() => {
    if (selectedRole) {
      setEditName(selectedRole.name || '');
      setEditDescription(selectedRole.description || '');
    }
    setCreating(false);
    setPendingGrants({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoleId]);

  // Returns true on success so the edit Drawer closes only when the save landed
  // (a failed save keeps the drawer open with the user's input intact).
  const handleSaveRole = async () => {
    if (!selectedRole || roleEditLocked) return false;
    const name = editName.trim();
    if (!name) {
      toast.error('Give the role a name');
      return false;
    }
    try {
      await updateRole({
        variables: { input: { id: selectedRole.id, name, description: editDescription.trim() || null } }
      });
      toast.success('Role updated');
      await refetchRoles();
      return true;
    } catch (err) {
      toast.error(err?.message || 'Could not update role');
      return false;
    }
  };

  // Returns true on success so the create Drawer closes only when the role was
  // created (mirrors handleSaveRole).
  const handleCreateRole = async () => {
    if (!canCreateRole) return false;
    const name = newRoleName.trim();
    if (!name) {
      toast.error('Give the role a name');
      return false;
    }
    try {
      const { data } = await createRole({
        variables: {
          input: { name, description: newRoleDescription.trim() || null, permissions: [] }
        }
      });
      toast.success('Role created');
      setNewRoleName('');
      setNewRoleDescription('');
      setCreating(false);
      const { data: fresh } = await refetchRoles();
      const created = data?.createRole;
      const id = created?.id || fresh?.roles?.find((r) => r.name === name)?.id;
      if (id) setSelectedRoleId(id);
      return true;
    } catch (err) {
      toast.error(err?.message || 'Could not create role');
      return false;
    }
  };

  const doDeleteRole = async (role) => {
    try {
      await deleteRole({ variables: { id: role.id } });
      toast.success('Role deleted');
      if (selectedRoleId === role.id) setSelectedRoleId(null);
      await refetchRoles();
      return true;
    } catch (err) {
      toast.error(err?.message || 'Could not delete role');
      return false;
    }
  };

  const handleDeleteRole = (role) => {
    if (!canDeleteRole) return;
    const count = role.userCount ?? 0;
    setConfirmState({
      title: `Delete role "${role.name}"?`,
      message:
        count > 0
          ? `${count} user${count === 1 ? '' : 's'} currently have this role and will lose it. This permanently deletes the role and its permission set and can't be undone.`
          : `This permanently deletes the role and its permission set and can't be undone.`,
      confirmLabel: 'Delete role',
      destructive: true,
      action: () => doDeleteRole(role)
    });
  };

  // System presets (except the locked SUPER_ADMIN) can be reset to their seeded
  // defaults, discarding any in-place customizations.
  const doResetRole = async (role) => {
    try {
      await resetRoleToDefault({ variables: { roleId: role.id } });
      toast.success(`"${role.name}" reset to defaults`);
      await refetchRoles();
      return true;
    } catch (err) {
      toast.error(err?.message || 'Could not reset role');
      return false;
    }
  };

  const handleResetRole = (role) => {
    if (!role || !role.isSystem || role.key === 'SUPER_ADMIN' || !canEditRole) return;
    setConfirmState({
      title: `Reset "${role.name}" to defaults?`,
      message: 'This discards any in-place customizations and restores the seeded default permissions for this system role.',
      confirmLabel: 'Reset to default',
      destructive: false,
      action: () => doResetRole(role)
    });
  };

  // -------------------------------------------------------------------------
  // Permission editing
  // -------------------------------------------------------------------------
  const changeGrant = async (permission, nextValue) => {
    if (!selectedRole || roleEditLocked) return;
    // Ignore racing clicks on a segment whose mutation is already in flight.
    if (pendingGrants[permission] !== undefined) return;
    // Optimistically render the chosen scope and lock the group until the
    // round-trip lands. The mutation returns the full RoleFields fragment, so
    // Apollo updates the cache itself — no extra refetchRoles() needed.
    setPendingGrants((p) => ({ ...p, [permission]: nextValue }));
    try {
      if (nextValue === NONE) {
        await removeRolePermission({
          variables: { input: { roleId: selectedRole.id, permission } }
        });
      } else {
        await setRolePermission({
          variables: { input: { roleId: selectedRole.id, permission, scope: nextValue } }
        });
      }
    } catch (err) {
      toast.error(err?.message || 'Could not update permission');
    } finally {
      setPendingGrants((p) => {
        const next = { ...p };
        delete next[permission];
        return next;
      });
    }
  };

  // -------------------------------------------------------------------------
  // Department roles + audit log (PRESERVED verbatim from the prior page)
  // -------------------------------------------------------------------------
  const [departments, setDepartments] = useState([]);
  const [deptError, setDeptError] = useState(null);
  const [selectedDept, setSelectedDept] = useState('');
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState(null);
  const [changingMemberRoleFor, setChangingMemberRoleFor] = useState('');
  const [pendingMemberRole, setPendingMemberRole] = useState({});
  const [newUserId, setNewUserId] = useState('');
  const [newDeptRole, setNewDeptRole] = useState('MEMBER');
  const [savingMember, setSavingMember] = useState(false);
  const [audit, setAudit] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState(null);

  const userList = useMemo(() => users || [], [users]);
  const userNameById = useMemo(() => {
    const map = new Map();
    for (const u of userList) {
      map.set(u.id, `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email);
    }
    return map;
  }, [userList]);

  // Loaders are cache-first by default (instant on revisit); pass force=true to
  // pull fresh from the network — after a mutation, a socket event, or Refresh.
  const loadDepartments = useCallback(async (force = false) => {
    setDeptError(null);
    try {
      const { data } = await client.query({
        query: DEPARTMENTS_Q,
        fetchPolicy: force ? 'network-only' : 'cache-first'
      });
      const list = data?.departments ?? [];
      setDepartments(list);
      setSelectedDept((cur) => cur || (list[0]?.id ?? ''));
    } catch (err) {
      // Surface the failure so an empty picker isn't mistaken for "no departments".
      setDeptError(err?.message || 'Could not load departments');
    }
  }, []);

  const membersReqRef = useRef(0);
  const loadMembers = useCallback(async (departmentId, force = false) => {
    if (!departmentId) {
      membersReqRef.current += 1;
      setMembers([]);
      setMembersError(null);
      setMembersLoading(false);
      return;
    }
    const reqId = ++membersReqRef.current;
    setMembersLoading(true);
    setMembersError(null);
    try {
      const { data } = await client.query({
        query: MEMBERS_Q,
        variables: { departmentId },
        fetchPolicy: force ? 'network-only' : 'cache-first'
      });
      // Ignore a stale response: a newer load (e.g. a fast department switch)
      // has superseded this one, so it must not overwrite the current list.
      if (reqId !== membersReqRef.current) return;
      setMembers(data?.departmentMembers ?? []);
    } catch (err) {
      if (reqId !== membersReqRef.current) return;
      // Surface the failure inline so a failed load isn't mistaken for
      // "no members" (and doesn't silently show the previous department's list).
      setMembersError(err?.message || 'Could not load department members');
    } finally {
      if (reqId === membersReqRef.current) setMembersLoading(false);
    }
  }, []);

  const loadAudit = useCallback(async (force = false) => {
    setAuditLoading(true);
    setAuditError(null);
    try {
      const { data } = await client.query({
        query: AUDIT_Q,
        variables: { input: { limit: 100 } },
        fetchPolicy: force ? 'network-only' : 'cache-first'
      });
      setAudit(data?.policyAuditLog ?? []);
    } catch (err) {
      // Distinguish a failed fetch from a genuinely empty log.
      setAuditError(err?.message || 'Could not load the audit log');
    } finally {
      setAuditLoading(false);
    }
  }, []);

  // Prefetch every tab's data once on mount (cache-first, non-blocking) so
  // switching tabs is instant — the slow API is only hit on the first load,
  // then served from cache (and kept fresh by the pub-sub events above).
  useEffect(() => {
    loadDepartments();
    loadAudit();
  }, [loadDepartments, loadAudit]);

  useEffect(() => {
    loadMembers(selectedDept);
  }, [selectedDept, loadMembers]);

  const memberUserIds = useMemo(() => new Set(members.map((m) => m.userId)), [members]);
  // The users query already excludes deleted users, so no !u.deleted filter here.
  const assignableUsers = useMemo(
    () => userList.filter((u) => !memberUserIds.has(u.id)),
    [userList, memberUserIds]
  );

  const addMember = async () => {
    if (!selectedDept || !newUserId) {
      toast.error('Pick a user to add');
      return;
    }
    setSavingMember(true);
    try {
      await client.mutate({
        mutation: SET_MEMBER_M,
        variables: { input: { departmentId: selectedDept, userId: newUserId, role: newDeptRole } }
      });
      toast.success('Member added');
      setNewUserId('');
      setNewDeptRole('MEMBER');
      await loadMembers(selectedDept, true);
    } catch (err) {
      toast.error(err?.message || 'Could not add member');
    } finally {
      setSavingMember(false);
    }
  };

  const changeMemberRole = async (member, role) => {
    // Optimistically reflect the pick and disable the row's Select until the
    // reload lands, so it doesn't visibly snap back to the old value.
    setChangingMemberRoleFor(member.userId);
    setPendingMemberRole((p) => ({ ...p, [member.userId]: role }));
    try {
      await client.mutate({
        mutation: SET_MEMBER_M,
        variables: { input: { departmentId: selectedDept, userId: member.userId, role } }
      });
      toast.success('Department role updated');
      await loadMembers(selectedDept, true);
    } catch (err) {
      toast.error(err?.message || 'Could not update role');
    } finally {
      setChangingMemberRoleFor('');
      setPendingMemberRole((p) => {
        const next = { ...p };
        delete next[member.userId];
        return next;
      });
    }
  };

  const doRemoveMember = async (member) => {
    const who = member.userName || userNameById.get(member.userId) || member.userEmail || 'this user';
    const deptName = departments.find((d) => d.id === selectedDept)?.name || 'the department';
    try {
      await client.mutate({
        mutation: REMOVE_MEMBER_M,
        variables: { departmentId: selectedDept, userId: member.userId }
      });
      toast.success(`Removed ${who} from ${deptName}`);
      await loadMembers(selectedDept, true);
      return true;
    } catch (err) {
      toast.error(err?.message || 'Could not remove member');
      return false;
    }
  };

  const removeMember = (member) => {
    const who = member.userName || userNameById.get(member.userId) || member.userEmail || 'this user';
    const deptName = departments.find((d) => d.id === selectedDept)?.name || 'the department';
    setConfirmState({
      title: 'Remove department member?',
      message: `Remove ${who} from ${deptName}? They will lose the department-scoped access this grants. This does not delete their account or global role.`,
      confirmLabel: 'Remove member',
      destructive: true,
      action: () => doRemoveMember(member)
    });
  };

  // -------------------------------------------------------------------------
  // Assign role to user
  // -------------------------------------------------------------------------
  const [changingRoleFor, setChangingRoleFor] = useState('');

  // Inline "user → role" management. Every user has exactly one role, so we show
  // the current one and let it be changed in place (no separate assign step).
  // The users query already excludes deleted users, so no !u.deleted filter here.
  const roleableUsers = useMemo(() => userList, [userList]);
  const roleOptions = useMemo(() => roles.map((r) => ({ value: r.id, label: r.name })), [roles]);
  const systemRoleIdByKey = useMemo(() => {
    const m = new Map();
    for (const r of roles) m.set(r.key, r.id);
    return m;
  }, [roles]);

  const handleChangeUserRole = async (userId, roleId) => {
    if (!roleId || !canAssignRole) return;
    setChangingRoleFor(userId);
    try {
      await assignUserRole({ variables: { input: { userId, roleId } } });
      toast.success('Role updated');
      await Promise.all([refresh(), refetchRoles()]);
    } catch (err) {
      toast.error(err?.message || 'Could not change role');
    } finally {
      setChangingRoleFor('');
    }
  };

  // -------------------------------------------------------------------------
  // Per-user overrides
  // -------------------------------------------------------------------------
  const [overrideUserId, setOverrideUserId] = useState('');
  const {
    data: overridesData,
    loading: overridesLoading,
    error: overridesError,
    refetch: refetchOverrides
  } = useUserPermissionOverridesQuery({
    variables: { userId: overrideUserId },
    skip: !overrideUserId,
    fetchPolicy: 'cache-first'
  });
  const overrides = overridesData?.userPermissionOverrides || [];

  const [overrideResource, setOverrideResource] = useState('');
  const [overrideVerb, setOverrideVerb] = useState('');
  const [overrideScope, setOverrideScope] = useState(PermissionScope.Any);
  const [overrideEffect, setOverrideEffect] = useState(GrantEffect.Allow);
  const overridePermission = overrideResource && overrideVerb ? `${overrideResource}:${overrideVerb}` : '';

  // Two-step permission picker (resource → action) keeps each dropdown small —
  // far snappier to open than a single ~130-entry list.
  const overrideResourceOptions = useMemo(
    () => (registry?.resources || []).map((r) => ({ value: r.key, label: r.label })),
    [registry]
  );
  const overrideVerbOptions = useMemo(() => {
    const res = (registry?.resources || []).find((r) => r.key === overrideResource);
    return (res?.verbs || []).map((v) => ({ value: v, label: humanizeVerb(v) }));
  }, [registry, overrideResource]);

  const handleAddOverride = async () => {
    if (!canGrantUser) return;
    const permission = overridePermission.trim();
    if (!overrideUserId || !permission) {
      toast.error('Pick a user and a permission');
      return;
    }
    try {
      await setUserPermissionOverride({
        variables: {
          input: {
            userId: overrideUserId,
            permission,
            scope: overrideScope,
            effect: overrideEffect
          }
        }
      });
      toast.success('Override saved');
      setOverrideResource('');
      setOverrideVerb('');
      await refetchOverrides();
    } catch (err) {
      toast.error(err?.message || 'Could not save override');
    }
  };

  const handleClearOverride = async (override) => {
    if (!canGrantUser) return;
    try {
      await clearUserPermissionOverride({
        variables: { userId: override.userId, permission: override.permission }
      });
      toast.success('Override cleared');
      await refetchOverrides();
    } catch (err) {
      toast.error(err?.message || 'Could not clear override');
    }
  };

  // -------------------------------------------------------------------------
  // Real-time sync via the websocket pub-sub. Governance changes (made here or
  // by another admin) broadcast on the 'policy' channel; we refetch only the
  // affected slice so the view stays live without manual refreshes.
  // -------------------------------------------------------------------------
  const liveRef = useRef({});
  liveRef.current = {
    activeTab,
    overrideUserId,
    selectedDept,
    refetchRoles,
    refetchOverrides,
    refreshUsers: refresh,
    loadMembers,
    loadAudit
  };

  useEffect(() => {
    const socket = getSocketService();
    const unsubscribe = socket.subscribeToAllResourceEvents(
      'policy',
      (action, evt) => {
        const d = evt?.data || {};
        const L = liveRef.current;
        if (d.kind === 'role' || d.kind === 'userRole') L.refetchRoles?.();
        if (d.kind === 'userRole') L.refreshUsers?.();
        if (d.kind === 'override' && d.userId === L.overrideUserId) L.refetchOverrides?.();
        if (d.kind === 'member' && d.departmentId === L.selectedDept) L.loadMembers?.(L.selectedDept, true);
        // Every governance change writes the audit log; it's a single cheap list,
        // so keep it fresh unconditionally (the tab may be opened right after).
        L.loadAudit?.(true);
      },
      ['create', 'update', 'delete']
    );
    return () => {
      try { unsubscribe?.(); } catch { /* noop */ }
    };
  }, []);

  // -------------------------------------------------------------------------
  // Table column definitions (pure factories live in ./_components/policy-columns;
  // memoised here with the same deps so behaviour is unchanged).
  // -------------------------------------------------------------------------
  const memberColumns = useMemo(
    () => createMemberColumns({ changeMemberRole, removeMember, changingMemberRoleFor, pendingMemberRole }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedDept, changingMemberRoleFor, pendingMemberRole]
  );

  const auditColumns = useMemo(() => createAuditColumns(), []);

  const overrideColumns = useMemo(
    () => createOverrideColumns({ canGrantUser, handleClearOverride }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canGrantUser]
  );

  const rbacError = registryError || rolesError;

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PageHeader
          title="Roles & Permissions"
          count="action-based access"
          description="Define roles from the permission registry, assign them to users, layer per-user overrides, and manage department-scoped roles — all audited."
          primary={
            <Button variant="primary" onClick={() => router.push('/users')}>
              <Users size={14} />
              Manage users
            </Button>
          }
          secondary={
            <Button
              variant="secondary"
              onClick={() => {
                refresh();
                refetchRoles().catch(() => {});
                loadDepartments(true);
                loadMembers(selectedDept, true);
                loadAudit(true);
                if (overrideUserId) refetchOverrides().catch(() => {});
              }}
              disabled={isLoading || rolesLoading || registryLoading}>
              <RefreshCw size={14} />
              Refresh
            </Button>
          } />

        {rbacError ? (
          <Alert tone="warning" icon={<ShieldCheck size={14} />} title="Permission backend unavailable">
            Roles or the permission registry could not be loaded. Some controls may be disabled.
          </Alert>
        ) : null}

        {/* Section tabs — Harbor underline tabs: animated sliding underline +
            per-panel content swap (fade-up), both built into Tabs/TabPanel. */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v);
            // The audit log must reflect changes just made on other tabs.
            if (v === 'audit') loadAudit(true);
          }}
          variant="underline">
          <TabList className="w-full overflow-x-auto">
            {POLICY_TABS.map((t) => {
              const Icon = t.icon;
              return (
                <Tab key={t.id} value={t.id} icon={<Icon size={15} />}>
                  {t.label}
                </Tab>
              );
            })}
          </TabList>

          {/* ---------------------------------------------------------------- */}
          {/* Roles list + permission editor                                   */}
          {/* ---------------------------------------------------------------- */}
          <TabPanel value="roles" className="flex flex-col gap-4">
            <RolesTab
              canCreateRole={canCreateRole}
              canDeleteRole={canDeleteRole}
              canEditRole={canEditRole}
              rolesLoading={rolesLoading}
              roles={roles}
              selectedRoleId={selectedRoleId}
              setSelectedRoleId={setSelectedRoleId}
              creating={creating}
              setCreating={setCreating}
              newRoleName={newRoleName}
              setNewRoleName={setNewRoleName}
              newRoleDescription={newRoleDescription}
              setNewRoleDescription={setNewRoleDescription}
              creatingRole={creatingRole}
              handleCreateRole={handleCreateRole}
              selectedRole={selectedRole}
              roleReadOnly={roleReadOnly}
              roleEditLocked={roleEditLocked}
              editName={editName}
              setEditName={setEditName}
              editDescription={editDescription}
              setEditDescription={setEditDescription}
              updatingRole={updatingRole}
              handleSaveRole={handleSaveRole}
              handleDeleteRole={handleDeleteRole}
              resettingRole={resettingRole}
              handleResetRole={handleResetRole}
              registryLoading={registryLoading}
              registry={registry}
              resourcesByGroup={resourcesByGroup}
              effectiveGrants={effectiveGrants}
              pendingGrants={pendingGrants}
              changeGrant={changeGrant} />
          </TabPanel>

          {/* User access */}
          <TabPanel value="users" className="flex flex-col gap-4">
            <UsersTab
              roleableUsers={roleableUsers}
              usersLoading={isLoading}
              usersError={usersError}
              refreshUsers={refresh}
              overridesError={overridesError}
              refetchOverrides={refetchOverrides}
              userNameById={userNameById}
              canAssignRole={canAssignRole}
              changingRoleFor={changingRoleFor}
              handleChangeUserRole={handleChangeUserRole}
              roleOptions={roleOptions}
              systemRoleIdByKey={systemRoleIdByKey}
              overrideUserId={overrideUserId}
              setOverrideUserId={setOverrideUserId}
              userList={userList}
              overrideResource={overrideResource}
              setOverrideResource={setOverrideResource}
              overrideVerb={overrideVerb}
              setOverrideVerb={setOverrideVerb}
              overrideScope={overrideScope}
              setOverrideScope={setOverrideScope}
              overrideEffect={overrideEffect}
              setOverrideEffect={setOverrideEffect}
              overrideResourceOptions={overrideResourceOptions}
              overrideVerbOptions={overrideVerbOptions}
              settingOverride={settingOverride}
              overridePermission={overridePermission}
              canGrantUser={canGrantUser}
              handleAddOverride={handleAddOverride}
              overridesLoading={overridesLoading}
              overrides={overrides}
              overrideColumns={overrideColumns} />
          </TabPanel>

          {/* Departments */}
          <TabPanel value="departments" className="flex flex-col gap-4">
            <DepartmentsTab
              selectedDept={selectedDept}
              setSelectedDept={setSelectedDept}
              departments={departments}
              deptError={deptError}
              reloadDepartments={() => loadDepartments(true)}
              newUserId={newUserId}
              setNewUserId={setNewUserId}
              assignableUsers={assignableUsers}
              userNameById={userNameById}
              newDeptRole={newDeptRole}
              setNewDeptRole={setNewDeptRole}
              savingMember={savingMember}
              addMember={addMember}
              membersLoading={membersLoading}
              membersError={membersError}
              reloadMembers={() => loadMembers(selectedDept, true)}
              members={members}
              memberColumns={memberColumns} />
          </TabPanel>

          {/* Audit log */}
          <TabPanel value="audit" className="flex flex-col gap-4">
            {audit.length >= 100 ? (
              <Alert tone="info">
                Showing the most recent 100 changes. Older history is not loaded.
              </Alert>
            ) : null}
            <AuditTab
              audit={audit}
              auditColumns={auditColumns}
              loading={auditLoading}
              error={auditError}
              onRetry={() => loadAudit(true)} />
          </TabPanel>
        </Tabs>
      </ResponsiveStack>

      <Dialog open={!!confirmState} onClose={closeConfirm} size="sm">
        <DialogTitle>{confirmState?.title}</DialogTitle>
        <DialogDescription>{confirmState?.message}</DialogDescription>
        <DialogButtons align="end">
          <Button variant="ghost" onClick={closeConfirm} disabled={confirmLoading}>
            Cancel
          </Button>
          <Button
            variant={confirmState?.destructive ? 'destructive' : 'primary'}
            loading={confirmLoading}
            onClick={runConfirm}>
            {confirmState?.confirmLabel || 'Confirm'}
          </Button>
        </DialogButtons>
      </Dialog>
    </Page>);

}
