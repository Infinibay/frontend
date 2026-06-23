'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import {
  Page,
  Alert,
  Badge,
  Button,
  IconButton,
  DataTable,
  EmptyState,
  Accordion,
  AccordionItem,
  ResponsiveStack,
  Select } from
'@infinibay/harbor';
import {
  History,
  Lock,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users } from
'lucide-react';

import client from '@/apollo-client';
import { PageHeader } from '@/components/common/PageHeader';
import { fetchUsers } from '@/state/slices/users';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import {
  usePermissionRegistryQuery,
  useRolesQuery,
  useUserPermissionOverridesQuery,
  useSetRolePermissionMutation,
  useRemoveRolePermissionMutation,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useResetRoleToDefaultMutation,
  useAssignUserRoleMutation,
  useSetUserPermissionOverrideMutation,
  useClearUserPermissionOverrideMutation
} from '@/gql/hooks';
import { PermissionScope, GrantEffect } from '@/gql/graphql';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// GraphQL (inline — department-role + audit operations are admin-only and
// not part of codegen). These are unchanged from the previous page.
// ---------------------------------------------------------------------------

const DEPARTMENTS_Q = gql`
  query PolicyDepartments {
    departments { id name }
  }
`;

const MEMBERS_Q = gql`
  query DepartmentMembers($departmentId: String!) {
    departmentMembers(departmentId: $departmentId) {
      id
      departmentId
      userId
      role
      userEmail
      userName
      userGlobalRole
    }
  }
`;

const SET_MEMBER_M = gql`
  mutation SetDepartmentMember($input: SetDepartmentMemberInput!) {
    setDepartmentMember(input: $input) {
      id
      userId
      role
      userEmail
      userName
      userGlobalRole
    }
  }
`;

const REMOVE_MEMBER_M = gql`
  mutation RemoveDepartmentMember($departmentId: String!, $userId: String!) {
    removeDepartmentMember(departmentId: $departmentId, userId: $userId)
  }
`;

const AUDIT_Q = gql`
  query PolicyAuditLog($input: PolicyAuditQueryInput) {
    policyAuditLog(input: $input) {
      id
      actorName
      action
      targetType
      summary
      createdAt
    }
  }
`;

// ---------------------------------------------------------------------------
// Scope helpers
// ---------------------------------------------------------------------------

const SCOPE_RANK = {
  [PermissionScope.Own]: 1,
  [PermissionScope.Department]: 2,
  [PermissionScope.Any]: 3
};

const SCOPE_LABEL = {
  [PermissionScope.Own]: 'Own',
  [PermissionScope.Department]: 'Department',
  [PermissionScope.Any]: 'Any'
};

const NONE = '__none__';

function scopeOptions(scoped) {
  const opts = [{ value: NONE, label: '—' }];
  if (scoped) {
    opts.push(
      { value: PermissionScope.Own, label: 'Own' },
      { value: PermissionScope.Department, label: 'Department' }
    );
  }
  opts.push({ value: PermissionScope.Any, label: 'Any' });
  return opts;
}

function formatWhen(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return '—';
  }
}

function roleLabel(role) {
  if (role === 'SUPER_ADMIN') return 'Super admin';
  if (role === 'ADMIN') return 'Admin';
  return 'User';
}

const SectionCard = ({ icon, title, action, children }) => (
  <section className="rounded-md border border-border-subtle bg-surface-raised p-4">
    <ResponsiveStack direction="col" gap={3}>
      <ResponsiveStack direction="row" gap={2} align="center">
        {icon}
        <span className="text-sm font-medium">{title}</span>
        {action ? <div className="ml-auto">{action}</div> : null}
      </ResponsiveStack>
      {children}
    </ResponsiveStack>
  </section>
);

// ---------------------------------------------------------------------------
// Effective-grant lookup
// ---------------------------------------------------------------------------
// Build a map of `${resource}:${verb}` -> { scope, source } that expands:
//   - `*`                     (all permissions)
//   - `${resource}:manage`    (every verb of that resource)
//   - cross-resource groups   (a grant on a group key fans out to its members)
// `source` is 'direct' | 'manage' | 'group' | 'wildcard' so the UI can show
// derived grants as disabled ("via *", "via manage", "via group").
function buildEffectiveGrants(role, registry) {
  const result = new Map();
  if (!role || !registry) return result;

  const resources = registry.resources || [];
  const groups = registry.groups || [];
  const groupMembers = new Map(groups.map((g) => [g.key, g.members || []]));

  // resourceKey -> verbs[]
  const verbsByResource = new Map(resources.map((r) => [r.key, r.verbs || []]));

  const stronger = (a, b) => ((SCOPE_RANK[a] || 0) >= (SCOPE_RANK[b] || 0) ? a : b);

  const apply = (resourceKey, verb, scope, source) => {
    const key = `${resourceKey}:${verb}`;
    const existing = result.get(key);
    if (!existing) {
      result.set(key, { scope, source });
      return;
    }
    // Keep the strongest scope; a direct grant always wins as the source.
    const nextScope = stronger(existing.scope, scope);
    const nextSource = source === 'direct' ? 'direct' : existing.source;
    result.set(key, { scope: nextScope, source: nextSource });
  };

  // Expand a single (permission, scope) grant into concrete resource:verb pairs.
  const expandGrant = (permission, scope) => {
    if (permission === '*') {
      for (const r of resources) {
        for (const v of r.verbs || []) apply(r.key, v, scope, 'wildcard');
      }
      return;
    }

    const [resourcePart, verbPart] = permission.split(':');

    // Cross-resource group grant (group key in the registry groups list).
    if (groupMembers.has(resourcePart) && verbPart === undefined) {
      for (const member of groupMembers.get(resourcePart)) {
        expandGrantMember(member, scope, 'group');
      }
      return;
    }
    if (groupMembers.has(permission)) {
      for (const member of groupMembers.get(permission)) {
        expandGrantMember(member, scope, 'group');
      }
      return;
    }

    if (verbPart === 'manage') {
      const verbs = verbsByResource.get(resourcePart) || [];
      for (const v of verbs) apply(resourcePart, v, scope, 'manage');
      return;
    }

    if (resourcePart && verbPart) {
      apply(resourcePart, verbPart, scope, 'direct');
    }
  };

  // A group member is itself a permission string (e.g. "firewall:read" or
  // "firewall:manage" or another group key); expand it with a 'group' source.
  const expandGrantMember = (member, scope, sourceTag) => {
    const [resourcePart, verbPart] = member.split(':');
    if (member === '*') {
      for (const r of resources) {
        for (const v of r.verbs || []) apply(r.key, v, scope, sourceTag);
      }
      return;
    }
    if (groupMembers.has(member)) {
      for (const m of groupMembers.get(member)) expandGrantMember(m, scope, sourceTag);
      return;
    }
    if (verbPart === 'manage') {
      const verbs = verbsByResource.get(resourcePart) || [];
      for (const v of verbs) apply(resourcePart, v, scope, sourceTag);
      return;
    }
    if (resourcePart && verbPart) apply(resourcePart, verbPart, scope, sourceTag);
  };

  for (const grant of role.permissions || []) {
    expandGrant(grant.permission, grant.scope);
  }

  return result;
}

export default function PoliciesListPage() {
  const router = useRouter();

  const {
    data: users,
    isLoading,
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

  const handleCreateRole = async () => {
    const name = newRoleName.trim();
    if (!name) {
      toast.error('Give the role a name');
      return;
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
      const { data: fresh } = await refetchRoles();
      const created = data?.createRole;
      const id = created?.id || fresh?.roles?.find((r) => r.name === name)?.id;
      if (id) setSelectedRoleId(id);
    } catch (err) {
      toast.error(err?.message || 'Could not create role');
    }
  };

  const handleDeleteRole = async (role) => {
    try {
      await deleteRole({ variables: { id: role.id } });
      toast.success('Role deleted');
      if (selectedRoleId === role.id) setSelectedRoleId(null);
      await refetchRoles();
    } catch (err) {
      toast.error(err?.message || 'Could not delete role');
    }
  };

  // System presets (except the locked SUPER_ADMIN) can be reset to their seeded
  // defaults, discarding any in-place customizations.
  const handleResetRole = async (role) => {
    if (!role || !role.isSystem || role.key === 'SUPER_ADMIN') return;
    if (
      typeof window !== 'undefined' &&
      !window.confirm(`Reset "${role.name}" to its default permissions? This discards any customizations.`)
    ) {
      return;
    }
    try {
      await resetRoleToDefault({ variables: { roleId: role.id } });
      toast.success(`"${role.name}" reset to defaults`);
      await refetchRoles();
    } catch (err) {
      toast.error(err?.message || 'Could not reset role');
    }
  };

  // -------------------------------------------------------------------------
  // Permission editing
  // -------------------------------------------------------------------------
  const changeGrant = async (permission, nextValue) => {
    if (!selectedRole || roleReadOnly) return;
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
      await refetchRoles();
    } catch (err) {
      toast.error(err?.message || 'Could not update permission');
    }
  };

  // -------------------------------------------------------------------------
  // Department roles + audit log (PRESERVED verbatim from the prior page)
  // -------------------------------------------------------------------------
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [newDeptRole, setNewDeptRole] = useState('MEMBER');
  const [savingMember, setSavingMember] = useState(false);
  const [audit, setAudit] = useState([]);

  const userList = users || [];
  const userNameById = useMemo(() => {
    const map = new Map();
    for (const u of userList) {
      map.set(u.id, `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email);
    }
    return map;
  }, [userList]);

  const loadDepartments = useCallback(async () => {
    try {
      const { data } = await client.query({ query: DEPARTMENTS_Q, fetchPolicy: 'network-only' });
      const list = data?.departments ?? [];
      setDepartments(list);
      setSelectedDept((cur) => cur || (list[0]?.id ?? ''));
    } catch {
      // Department-scoped roles need the departments query; degrade quietly.
    }
  }, []);

  const loadMembers = useCallback(async (departmentId) => {
    if (!departmentId) {
      setMembers([]);
      return;
    }
    setMembersLoading(true);
    try {
      const { data } = await client.query({
        query: MEMBERS_Q,
        variables: { departmentId },
        fetchPolicy: 'network-only'
      });
      setMembers(data?.departmentMembers ?? []);
    } catch (err) {
      toast.error(err?.message || 'Could not load department members');
    } finally {
      setMembersLoading(false);
    }
  }, []);

  const loadAudit = useCallback(async () => {
    try {
      const { data } = await client.query({
        query: AUDIT_Q,
        variables: { input: { limit: 100 } },
        fetchPolicy: 'network-only'
      });
      setAudit(data?.policyAuditLog ?? []);
    } catch {
      // Audit log is best-effort UI; ignore if unavailable.
    }
  }, []);

  useEffect(() => {
    loadDepartments();
    loadAudit();
  }, [loadDepartments, loadAudit]);

  useEffect(() => {
    loadMembers(selectedDept);
  }, [selectedDept, loadMembers]);

  const memberUserIds = useMemo(() => new Set(members.map((m) => m.userId)), [members]);
  const assignableUsers = useMemo(
    () => userList.filter((u) => !u.deleted && !memberUserIds.has(u.id)),
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
      await loadMembers(selectedDept);
      loadAudit();
    } catch (err) {
      toast.error(err?.message || 'Could not add member');
    } finally {
      setSavingMember(false);
    }
  };

  const changeMemberRole = async (member, role) => {
    try {
      await client.mutate({
        mutation: SET_MEMBER_M,
        variables: { input: { departmentId: selectedDept, userId: member.userId, role } }
      });
      await loadMembers(selectedDept);
      loadAudit();
    } catch (err) {
      toast.error(err?.message || 'Could not update role');
    }
  };

  const removeMember = async (member) => {
    try {
      await client.mutate({
        mutation: REMOVE_MEMBER_M,
        variables: { departmentId: selectedDept, userId: member.userId }
      });
      await loadMembers(selectedDept);
      loadAudit();
    } catch (err) {
      toast.error(err?.message || 'Could not remove member');
    }
  };

  // -------------------------------------------------------------------------
  // Assign role to user
  // -------------------------------------------------------------------------
  const [assignUserId, setAssignUserId] = useState('');
  const [assignRoleId, setAssignRoleId] = useState('');

  const handleAssignRole = async () => {
    if (!assignUserId || !assignRoleId) {
      toast.error('Pick a user and a role');
      return;
    }
    try {
      await assignUserRole({ variables: { input: { userId: assignUserId, roleId: assignRoleId } } });
      toast.success('Role assigned');
      setAssignUserId('');
      setAssignRoleId('');
      await refetchRoles();
      loadAudit();
    } catch (err) {
      toast.error(err?.message || 'Could not assign role');
    }
  };

  // -------------------------------------------------------------------------
  // Per-user overrides
  // -------------------------------------------------------------------------
  const [overrideUserId, setOverrideUserId] = useState('');
  const {
    data: overridesData,
    loading: overridesLoading,
    refetch: refetchOverrides
  } = useUserPermissionOverridesQuery({
    variables: { userId: overrideUserId },
    skip: !overrideUserId,
    fetchPolicy: 'cache-and-network'
  });
  const overrides = overridesData?.userPermissionOverrides || [];

  const [overridePermission, setOverridePermission] = useState('');
  const [overrideScope, setOverrideScope] = useState(PermissionScope.Any);
  const [overrideEffect, setOverrideEffect] = useState(GrantEffect.Allow);

  // All concrete `resource:verb` leaves from the registry, for the picker.
  const registryLeaves = useMemo(() => {
    const leaves = [];
    for (const r of registry?.resources || []) {
      for (const v of r.verbs || []) {
        leaves.push({ value: `${r.key}:${v}`, label: `${r.label} · ${v}` });
      }
    }
    return leaves;
  }, [registry]);

  const handleAddOverride = async () => {
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
      setOverridePermission('');
      await refetchOverrides();
      loadAudit();
    } catch (err) {
      toast.error(err?.message || 'Could not save override');
    }
  };

  const handleClearOverride = async (override) => {
    try {
      await clearUserPermissionOverride({
        variables: { userId: override.userId, permission: override.permission }
      });
      toast.success('Override cleared');
      await refetchOverrides();
      loadAudit();
    } catch (err) {
      toast.error(err?.message || 'Could not clear override');
    }
  };

  // -------------------------------------------------------------------------
  // Table column definitions
  // -------------------------------------------------------------------------
  const memberColumns = useMemo(
    () => [
    {
      id: 'user',
      header: 'User',
      cell: ({ row }) =>
      <div className="flex flex-col">
            <span className="font-medium">{row.userName || row.userEmail}</span>
            <span className="text-fg-muted text-xs">{row.userEmail}</span>
          </div>
    },
    {
      id: 'globalRole',
      header: 'Global role',
      width: 130,
      cell: ({ row }) => <Badge tone="neutral">{roleLabel(row.userGlobalRole)}</Badge>
    },
    {
      id: 'deptRole',
      header: 'Department role',
      width: 200,
      cell: ({ row }) =>
      <Select
        value={row.role}
        onChange={(v) => changeMemberRole(row, v)}
        options={[
        { value: 'MEMBER', label: 'Member' },
        { value: 'MANAGER', label: 'Manager' }]
        } />
    },
    {
      id: 'actions',
      header: '',
      width: 90,
      align: 'right',
      cell: ({ row }) =>
      <Button size="sm" variant="ghost" icon={<Trash2 size={12} />} onClick={() => removeMember(row)} />
    }],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedDept]
  );

  const auditColumns = useMemo(
    () => [
    {
      id: 'createdAt',
      header: 'When',
      width: 190,
      cell: ({ row }) => <span className="text-sm text-fg-muted">{formatWhen(row.createdAt)}</span>
    },
    {
      id: 'actorName',
      header: 'Actor',
      width: 170,
      cell: ({ row }) => <span className="text-sm">{row.actorName || 'system'}</span>
    },
    {
      id: 'summary',
      header: 'Change',
      cell: ({ row }) => <span className="text-sm">{row.summary}</span>
    }],
    []
  );

  const overrideColumns = useMemo(
    () => [
    {
      id: 'permission',
      header: 'Permission',
      cell: ({ row }) => <span className="font-mono text-xs">{row.permission}</span>
    },
    {
      id: 'scope',
      header: 'Scope',
      width: 130,
      cell: ({ row }) => <Badge tone="neutral">{SCOPE_LABEL[row.scope] || row.scope}</Badge>
    },
    {
      id: 'effect',
      header: 'Effect',
      width: 110,
      cell: ({ row }) =>
      <Badge tone={row.effect === GrantEffect.Allow ? 'success' : 'danger'}>
            {row.effect === GrantEffect.Allow ? 'Allow' : 'Deny'}
          </Badge>
    },
    {
      id: 'actions',
      header: '',
      width: 80,
      align: 'right',
      cell: ({ row }) =>
      <Button size="sm" variant="ghost" icon={<Trash2 size={12} />} onClick={() => handleClearOverride(row)} />
    }],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // -------------------------------------------------------------------------
  // Render helpers
  // -------------------------------------------------------------------------
  const renderResourceItem = (resource) => {
    // The resource-level "manage" grant value (direct grant only).
    const manageGrant = (selectedRole?.permissions || []).find(
      (g) => g.permission === `${resource.key}:manage`
    );
    const manageValue = manageGrant ? manageGrant.scope : NONE;

    return (
      <ResponsiveStack direction="col" gap={2}>
        <ResponsiveStack direction="row" gap={2} align="center">
          <span className="text-xs font-medium text-fg-muted">Grant all (manage)</span>
          <div className="w-40">
            <Select
              size="sm"
              value={manageValue}
              disabled={roleReadOnly}
              onChange={(v) => changeGrant(`${resource.key}:manage`, v)}
              options={scopeOptions(resource.scoped)} />
          </div>
        </ResponsiveStack>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {(resource.verbs || []).map((verb) => {
            const permission = `${resource.key}:${verb}`;
            const directGrant = (selectedRole?.permissions || []).find(
              (g) => g.permission === permission
            );
            const eff = effectiveGrants.get(permission);
            const derived = eff && eff.source !== 'direct';

            const value = directGrant
              ? directGrant.scope
              : derived
                ? eff.scope
                : NONE;

            const derivedLabel =
              eff?.source === 'wildcard'
                ? 'via *'
                : eff?.source === 'manage'
                  ? 'via manage'
                  : eff?.source === 'group'
                    ? 'via group'
                    : null;

            return (
              <div
                key={permission}
                className="flex items-center justify-between gap-2 rounded-md border border-border-subtle px-3 py-2">
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm">{verb}</span>
                  {derived && derivedLabel ? (
                    <span className="text-fg-muted text-xs">{derivedLabel}</span>
                  ) : null}
                </div>
                <div className="w-36 shrink-0">
                  <Select
                    size="sm"
                    value={value}
                    disabled={roleReadOnly || derived}
                    onChange={(v) => changeGrant(permission, v)}
                    options={scopeOptions(resource.scoped)} />
                </div>
              </div>
            );
          })}
        </div>
      </ResponsiveStack>
    );
  };

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
                refetchRoles();
                loadDepartments();
                loadMembers(selectedDept);
                loadAudit();
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
        ) : (
          <Alert tone="info" icon={<ShieldCheck size={14} />} title="SUPER_ADMIN is protected; changes are audited">
            The SUPER_ADMIN role is read-only and always retains full control. Every role, override, and
            department-role change is recorded in the access change log below.
          </Alert>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Roles list + permission editor                                   */}
        {/* ---------------------------------------------------------------- */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[20rem_1fr]">
          <SectionCard
            icon={<ShieldCheck size={16} className="text-fg-muted" />}
            title="Roles">
            <ResponsiveStack direction="col" gap={2}>
              {rolesLoading && !roles.length ? (
                <span className="text-fg-muted text-sm">Loading roles…</span>
              ) : roles.length ? (
                roles.map((role) => {
                  const active = role.id === selectedRoleId;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRoleId(role.id)}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left transition-colors ${
                        active
                          ? 'border-border-strong bg-surface-overlay'
                          : 'border-border-subtle hover:bg-surface-overlay'
                      }`}>
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
                      {!role.isSystem ? (
                        <IconButton
                          size="sm"
                          variant="ghost"
                          label="Delete role"
                          icon={<Trash2 size={12} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRole(role);
                          }} />
                      ) : null}
                    </button>
                  );
                })
              ) : (
                <EmptyState
                  icon={<ShieldCheck size={18} />}
                  title="No roles yet"
                  description="Create a role below to start granting permissions." />
              )}

              <div className="mt-2 flex flex-col gap-2 border-t border-border-subtle pt-3">
                <span className="text-xs font-medium text-fg-muted">New role</span>
                <input
                  className="rounded-md border border-border-subtle bg-surface-base px-3 py-2 text-sm outline-none focus:border-border-strong"
                  placeholder="Role name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)} />
                <input
                  className="rounded-md border border-border-subtle bg-surface-base px-3 py-2 text-sm outline-none focus:border-border-strong"
                  placeholder="Description (optional)"
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)} />
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus size={14} />}
                  loading={creatingRole}
                  onClick={handleCreateRole}>
                  Create role
                </Button>
              </div>
            </ResponsiveStack>
          </SectionCard>

          <SectionCard
            icon={<ShieldCheck size={16} className="text-fg-muted" />}
            title={selectedRole ? `Permissions · ${selectedRole.name}` : 'Permissions'}
            action={
              <div className="flex items-center gap-2">
                {selectedRole?.isSystem && selectedRole?.key !== 'SUPER_ADMIN' ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<RefreshCw size={14} />}
                    loading={resettingRole}
                    onClick={() => handleResetRole(selectedRole)}>
                    Reset to default
                  </Button>
                ) : null}
                {roleReadOnly ? (
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
                        {renderResourceItem(resource)}
                      </AccordionItem>
                    ))}
                  </div>
                ))}
              </Accordion>
            )}
          </SectionCard>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Assign role to user                                              */}
        {/* ---------------------------------------------------------------- */}
        <SectionCard icon={<UserPlus size={16} className="text-fg-muted" />} title="Assign role to user">
          <ResponsiveStack direction={{ base: 'col', lg: 'row' }} gap={2} align="end">
            <div className="flex-1 min-w-0">
              <Select
                label="User"
                value={assignUserId}
                onChange={setAssignUserId}
                options={[
                { value: '', label: '— pick a user —' },
                ...userList
                  .filter((u) => !u.deleted)
                  .map((u) => ({ value: u.id, label: `${userNameById.get(u.id)} · ${u.email}` }))]
                } />
            </div>
            <div className="w-full lg:w-72">
              <Select
                label="Role"
                value={assignRoleId}
                onChange={setAssignRoleId}
                options={[
                { value: '', label: '— pick a role —' },
                ...roles.map((r) => ({ value: r.id, label: r.name }))]
                } />
            </div>
            <Button
              variant="primary"
              icon={<UserPlus size={14} />}
              loading={assigning}
              disabled={!assignUserId || !assignRoleId}
              onClick={handleAssignRole}>
              Assign
            </Button>
          </ResponsiveStack>
        </SectionCard>

        {/* ---------------------------------------------------------------- */}
        {/* Per-user overrides                                               */}
        {/* ---------------------------------------------------------------- */}
        <SectionCard icon={<ShieldCheck size={16} className="text-fg-muted" />} title="Per-user overrides">
          <div className="w-full lg:w-96">
            <Select
              label="User"
              value={overrideUserId}
              onChange={setOverrideUserId}
              options={[
              { value: '', label: '— pick a user —' },
              ...userList
                .filter((u) => !u.deleted)
                .map((u) => ({ value: u.id, label: `${userNameById.get(u.id)} · ${u.email}` }))]
              } />
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
                    label="Permission"
                    value={overridePermission}
                    onChange={setOverridePermission}
                    options={[
                    { value: '', label: '— pick a permission —' },
                    ...registryLeaves]
                    } />
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
                  disabled={!overridePermission}
                  onClick={handleAddOverride}>
                  Add
                </Button>
              </ResponsiveStack>

              {overridesLoading && !overrides.length ? (
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

        {/* ---------------------------------------------------------------- */}
        {/* Department roles (PRESERVED)                                     */}
        {/* ---------------------------------------------------------------- */}
        <SectionCard icon={<Users size={16} className="text-fg-muted" />} title="Department roles">
          <ResponsiveStack direction={{ base: 'col', lg: 'row' }} gap={2} align="end">
            <div className="w-full lg:w-72">
              <Select
                label="Department"
                value={selectedDept}
                onChange={setSelectedDept}
                options={
                departments.length ?
                departments.map((d) => ({ value: d.id, label: d.name })) :
                [{ value: '', label: '— no departments —' }]
                } />
            </div>
            <div className="flex-1 min-w-0">
              <Select
                label="Add user"
                value={newUserId}
                onChange={setNewUserId}
                options={[
                { value: '', label: '— pick a user —' },
                ...assignableUsers.map((u) => ({
                  value: u.id,
                  label: `${userNameById.get(u.id)} · ${u.email}`
                }))]
                } />
            </div>
            <div className="w-full lg:w-40">
              <Select
                label="Role"
                value={newDeptRole}
                onChange={setNewDeptRole}
                options={[
                { value: 'MEMBER', label: 'Member' },
                { value: 'MANAGER', label: 'Manager' }]
                } />
            </div>
            <Button
              variant="primary"
              icon={<Plus size={14} />}
              loading={savingMember}
              disabled={!selectedDept || !newUserId}
              onClick={addMember}>
              Add
            </Button>
          </ResponsiveStack>

          {membersLoading ? (
            <span className="text-fg-muted text-sm">Loading members…</span>
          ) : members.length ? (
            <DataTable rows={members} columns={memberColumns} rowId={(r) => r.id} defaultDensity="compact" />
          ) : (
            <EmptyState
              icon={<Users size={18} />}
              title="No department members"
              description="Add a user above to grant them scoped access to this department (Manager can operate it; Member can view it)." />
          )}
        </SectionCard>

        {/* ---------------------------------------------------------------- */}
        {/* Access change log (PRESERVED)                                    */}
        {/* ---------------------------------------------------------------- */}
        <SectionCard icon={<History size={16} className="text-fg-muted" />} title="Access change log">
          {audit.length ? (
            <DataTable rows={audit} columns={auditColumns} rowId={(r) => r.id} defaultDensity="compact" />
          ) : (
            <EmptyState
              icon={<History size={18} />}
              title="No changes recorded yet"
              description="Permission and department-role changes will appear here as they happen." />
          )}
        </SectionCard>
      </ResponsiveStack>
    </Page>);

}
