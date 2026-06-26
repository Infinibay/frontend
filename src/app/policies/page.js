'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  Select,
  Tabs,
  TabList,
  Tab,
  TabPanel } from
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

// "joinDomain" -> "Join Domain", "manageExecutions" -> "Manage Executions".
function humanizeVerb(verb) {
  const spaced = String(verb).replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

// Top-level sections, split into tabs so the page isn't one endless scroll.
const POLICY_TABS = [
  { id: 'roles', label: 'Roles & permissions', icon: ShieldCheck },
  { id: 'users', label: 'User access', icon: UserPlus },
  { id: 'departments', label: 'Departments', icon: Users },
  { id: 'audit', label: 'Audit log', icon: History }
];

const SectionCard = ({ icon, title, action, children }) => (
  <section className="rounded-sm border border-white/10 bg-surface-1 p-4 shadow-harbor-md">
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

// Compact segmented scope picker — replaces the bulky per-verb dropdowns. Reads
// left→right as widening reach (— ⊂ Own ⊂ Dept ⊂ Any). Global (unscoped)
// resources collapse to Off / On.
const ScopeSegmented = ({ value, scoped, disabled = false, onChange }) => {
  const segments = scoped
    ? [
        { value: NONE, label: '—', hint: 'No access' },
        { value: PermissionScope.Own, label: 'Own', hint: 'Own resources only' },
        { value: PermissionScope.Department, label: 'Dept', hint: 'Whole department' },
        { value: PermissionScope.Any, label: 'Any', hint: 'Anywhere' }]
    : [
        { value: NONE, label: 'Off', hint: 'No access' },
        { value: PermissionScope.Any, label: 'On', hint: 'Granted' }];

  return (
    <div
      role="group"
      className={`inline-flex shrink-0 select-none rounded border border-white/10 bg-surface-1 p-0.5 ${
        disabled ? 'opacity-60' : ''
      }`}>
      {segments.map((seg) => {
        const active = value === seg.value;
        return (
          <button
            key={seg.value}
            type="button"
            title={seg.hint}
            disabled={disabled}
            onClick={() => onChange?.(seg.value)}
            className={`min-w-[2.25rem] rounded-[3px] px-2.5 py-1 text-xs font-medium transition-colors ${
              active ? 'bg-accent text-white shadow-sm' : 'text-fg-muted hover:bg-white/5 hover:text-fg'
            } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            {seg.label}
          </button>
        );
      })}
    </div>
  );
};

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

  // Pre-fill the edit fields from the selected role; selecting a role also
  // leaves "create" mode so the bottom panel always reflects the current intent.
  useEffect(() => {
    if (selectedRole) {
      setEditName(selectedRole.name || '');
      setEditDescription(selectedRole.description || '');
    }
    setCreating(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoleId]);

  const handleSaveRole = async () => {
    if (!selectedRole || roleEditLocked) return;
    const name = editName.trim();
    if (!name) {
      toast.error('Give the role a name');
      return;
    }
    try {
      await updateRole({
        variables: { input: { id: selectedRole.id, name, description: editDescription.trim() || null } }
      });
      toast.success('Role updated');
      await refetchRoles();
    } catch (err) {
      toast.error(err?.message || 'Could not update role');
    }
  };

  const handleCreateRole = async () => {
    if (!canCreateRole) return;
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
      setCreating(false);
      const { data: fresh } = await refetchRoles();
      const created = data?.createRole;
      const id = created?.id || fresh?.roles?.find((r) => r.name === name)?.id;
      if (id) setSelectedRoleId(id);
    } catch (err) {
      toast.error(err?.message || 'Could not create role');
    }
  };

  const handleDeleteRole = async (role) => {
    if (!canDeleteRole) return;
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
    if (!role || !role.isSystem || role.key === 'SUPER_ADMIN' || !canEditRole) return;
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
    if (!selectedRole || roleEditLocked) return;
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

  // Loaders are cache-first by default (instant on revisit); pass force=true to
  // pull fresh from the network — after a mutation, a socket event, or Refresh.
  const loadDepartments = useCallback(async (force = false) => {
    try {
      const { data } = await client.query({
        query: DEPARTMENTS_Q,
        fetchPolicy: force ? 'network-only' : 'cache-first'
      });
      const list = data?.departments ?? [];
      setDepartments(list);
      setSelectedDept((cur) => cur || (list[0]?.id ?? ''));
    } catch {
      // Department-scoped roles need the departments query; degrade quietly.
    }
  }, []);

  const loadMembers = useCallback(async (departmentId, force = false) => {
    if (!departmentId) {
      setMembers([]);
      return;
    }
    setMembersLoading(true);
    try {
      const { data } = await client.query({
        query: MEMBERS_Q,
        variables: { departmentId },
        fetchPolicy: force ? 'network-only' : 'cache-first'
      });
      setMembers(data?.departmentMembers ?? []);
    } catch (err) {
      toast.error(err?.message || 'Could not load department members');
    } finally {
      setMembersLoading(false);
    }
  }, []);

  const loadAudit = useCallback(async (force = false) => {
    try {
      const { data } = await client.query({
        query: AUDIT_Q,
        variables: { input: { limit: 100 } },
        fetchPolicy: force ? 'network-only' : 'cache-first'
      });
      setAudit(data?.policyAuditLog ?? []);
    } catch {
      // Audit log is best-effort UI; ignore if unavailable.
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
      await loadMembers(selectedDept, true);
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
      await loadMembers(selectedDept, true);
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
      await loadMembers(selectedDept, true);
    } catch (err) {
      toast.error(err?.message || 'Could not remove member');
    }
  };

  // -------------------------------------------------------------------------
  // Assign role to user
  // -------------------------------------------------------------------------
  const [changingRoleFor, setChangingRoleFor] = useState('');

  // Inline "user → role" management. Every user has exactly one role, so we show
  // the current one and let it be changed in place (no separate assign step).
  const roleableUsers = useMemo(() => userList.filter((u) => !u.deleted), [userList]);
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
        // Every governance change writes the audit log; refresh it if it's open.
        if (L.activeTab === 'audit') L.loadAudit?.(true);
      },
      ['create', 'update', 'delete']
    );
    return () => {
      try { unsubscribe?.(); } catch { /* noop */ }
    };
  }, []);

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
      canGrantUser ?
        <Button size="sm" variant="ghost" icon={<Trash2 size={12} />} onClick={() => handleClearOverride(row)} /> :
        null
    }],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canGrantUser]
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
      <div className="overflow-hidden rounded-sm border border-white/10 bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-surface-1 px-3.5 py-2.5">
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-medium">Manage all</span>
            <span className="text-xs text-fg-muted">Grant every action on this resource at once</span>
          </div>
          <ScopeSegmented
            value={manageValue}
            scoped={resource.scoped}
            disabled={roleEditLocked}
            onChange={(v) => changeGrant(`${resource.key}:manage`, v)} />
        </div>

        <div className="divide-y divide-[color:var(--harbor-border-subtle)]">
          {(resource.verbs || []).map((verb) => {
            const permission = `${resource.key}:${verb}`;
            const directGrant = (selectedRole?.permissions || []).find(
              (g) => g.permission === permission
            );
            const eff = effectiveGrants.get(permission);
            const derived = eff && eff.source !== 'direct';
            const value = directGrant ? directGrant.scope : derived ? eff.scope : NONE;

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
                className="flex items-center justify-between gap-3 px-3.5 py-2 transition-colors hover:bg-white/[0.03]">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-sm" title={humanizeVerb(verb)}>
                    {humanizeVerb(verb)}
                  </span>
                  {!roleReadOnly && derived && derivedLabel ? (
                    <span title={`Inherited ${derivedLabel}`} className="shrink-0 text-fg-muted">
                      <Lock size={11} />
                    </span>
                  ) : null}
                </div>
                <ScopeSegmented
                  value={value}
                  scoped={resource.scoped}
                  disabled={roleEditLocked || derived}
                  onChange={(v) => changeGrant(permission, v)} />
              </div>
            );
          })}
        </div>
      </div>
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
                loadDepartments(true);
                loadMembers(selectedDept, true);
                loadAudit(true);
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
        <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline">
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
            {activeTab === 'roles' && (
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
                    <div
                      key={role.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedRoleId(role.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedRoleId(role.id);
                        }
                      }}
                      className={`flex cursor-pointer items-center gap-2 rounded-sm border px-3 py-2 text-left transition-colors ${
                        active
                          ? 'border-white/20 bg-surface-2'
                          : 'border-white/10 hover:bg-surface-2'
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
                      {!role.isSystem && canDeleteRole ? (
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
                    </div>
                  );
                })
              ) : (
                <EmptyState
                  icon={<ShieldCheck size={18} />}
                  title="No roles yet"
                  description="Create a role below to start granting permissions." />
              )}

              <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
                {creating ? (
                  <>
                    <span className="text-xs font-medium text-fg-muted">Create a new role</span>
                    <input
                      className="rounded-sm border border-white/10 bg-surface px-3 py-2 text-sm outline-none focus:border-white/20"
                      placeholder="Role name"
                      aria-label="New role name"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)} />
                    <input
                      className="rounded-sm border border-white/10 bg-surface px-3 py-2 text-sm outline-none focus:border-white/20"
                      placeholder="Description (optional)"
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
                      <input
                        className="rounded-sm border border-white/10 bg-surface px-3 py-2 text-sm outline-none focus:border-white/20"
                        placeholder="Role name"
                        aria-label="Role name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)} />
                      <input
                        className="rounded-sm border border-white/10 bg-surface px-3 py-2 text-sm outline-none focus:border-white/20"
                        placeholder="Description (optional)"
                        aria-label="Role description"
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
                        {renderResourceItem(resource)}
                      </AccordionItem>
                    ))}
                  </div>
                ))}
              </Accordion>
            )}
          </SectionCard>
        </div>
              </>
            )}
          </TabPanel>

          {/* User access */}
          <TabPanel value="users" className="flex flex-col gap-4">
        <SectionCard icon={<UserPlus size={16} className="text-fg-muted" />} title="User roles">
          <ResponsiveStack direction="col" gap={2}>
            <span className="text-fg-muted text-xs">
              Every user has exactly one role — change it inline. Fine-grained per-user tweaks live in “Per-user overrides” below.
            </span>
            {!roleableUsers.length ? (
              <EmptyState
                icon={<UserPlus size={18} />}
                title="No users"
                description="There are no users to manage yet." />
            ) : (
              <div className="divide-y divide-[color:var(--harbor-border-subtle)] rounded-sm border border-white/10">
                {roleableUsers.map((u) => (
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
            )}
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
          </TabPanel>

          {/* Departments */}
          <TabPanel value="departments" className="flex flex-col gap-4">
        <SectionCard icon={<Users size={16} className="text-fg-muted" />} title="Department members">
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
          </TabPanel>

          {/* Audit log */}
          <TabPanel value="audit" className="flex flex-col gap-4">
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
          </TabPanel>
        </Tabs>
      </ResponsiveStack>
    </Page>);

}
