'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import {
  Page,
  Alert,
  Badge,
  Button,
  DataTable,
  EmptyState,
  PermissionMatrix,
  ResponsiveStack,
  Select } from
'@infinibay/harbor';
import { History, Plus, RefreshCw, ShieldCheck, Trash2, Users } from 'lucide-react';

import client from '@/apollo-client';
import { PageHeader } from '@/components/common/PageHeader';
import { fetchUsers } from '@/state/slices/users';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import {
  PermissionEffect,
  useRolePermissionMatrixQuery,
  useSetRolePermissionMutation
} from '@/gql/hooks';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// GraphQL (inline — these operations are admin-only and not part of codegen)
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

const ROLE_PRINCIPALS = [
  { id: 'SUPER_ADMIN', label: 'Super admin', kind: 'role', avatar: 'SA' },
  { id: 'ADMIN', label: 'Admin', kind: 'role', avatar: 'AD' },
  { id: 'USER', label: 'User', kind: 'role', avatar: 'US' }
];

const PERMISSION_RESOURCES = [
  { id: 'overview', label: 'Overview', group: 'Operate' },
  { id: 'desktops', label: 'Desktops', group: 'Operate' },
  { id: 'workspace', label: 'Workspace', group: 'Operate' },
  { id: 'infrastructure', label: 'Infrastructure', group: 'Operate' },
  { id: 'departments', label: 'Departments', group: 'Operate' },
  { id: 'blueprints', label: 'Blueprints', group: 'Operate' },
  { id: 'applications', label: 'Applications', group: 'Operate' },
  { id: 'firewall', label: 'Firewall', group: 'Operate' },
  { id: 'scripts', label: 'Scripts', group: 'Operate' },
  { id: 'users', label: 'Users', group: 'Admin' },
  { id: 'identity', label: 'Identity', group: 'Admin' },
  { id: 'policies', label: 'Policies', group: 'Admin' },
  { id: 'settings', label: 'Settings', group: 'Admin' }
];

const EFFECTIVE_PERMISSIONS = {
  'SUPER_ADMIN:overview': 'allow', 'SUPER_ADMIN:desktops': 'allow', 'SUPER_ADMIN:workspace': 'allow',
  'SUPER_ADMIN:infrastructure': 'allow', 'SUPER_ADMIN:departments': 'allow', 'SUPER_ADMIN:blueprints': 'allow',
  'SUPER_ADMIN:applications': 'allow', 'SUPER_ADMIN:firewall': 'allow', 'SUPER_ADMIN:scripts': 'allow',
  'SUPER_ADMIN:users': 'allow', 'SUPER_ADMIN:identity': 'allow', 'SUPER_ADMIN:policies': 'allow',
  'SUPER_ADMIN:settings': 'allow',
  'ADMIN:overview': 'allow', 'ADMIN:desktops': 'allow', 'ADMIN:workspace': 'allow',
  'ADMIN:infrastructure': 'allow', 'ADMIN:departments': 'allow', 'ADMIN:blueprints': 'allow',
  'ADMIN:applications': 'allow', 'ADMIN:firewall': 'allow', 'ADMIN:scripts': 'allow',
  'ADMIN:users': 'allow', 'ADMIN:identity': 'allow', 'ADMIN:policies': 'allow', 'ADMIN:settings': 'allow',
  'USER:overview': 'deny', 'USER:desktops': 'deny', 'USER:workspace': 'allow',
  'USER:infrastructure': 'deny', 'USER:departments': 'deny', 'USER:blueprints': 'deny',
  'USER:applications': 'deny', 'USER:firewall': 'deny', 'USER:scripts': 'deny',
  'USER:users': 'deny', 'USER:identity': 'deny', 'USER:policies': 'deny', 'USER:settings': 'deny'
};

function roleLabel(role) {
  if (role === 'SUPER_ADMIN') return 'Super admin';
  if (role === 'ADMIN') return 'Admin';
  return 'User';
}

function formatWhen(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return '—';
  }
}

const SectionCard = ({ icon, title, children }) => (
  <section className="rounded-md border border-border-subtle bg-surface-raised p-4">
    <ResponsiveStack direction="col" gap={3}>
      <ResponsiveStack direction="row" gap={2} align="center">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </ResponsiveStack>
      {children}
    </ResponsiveStack>
  </section>
);

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
  const {
    data: policyData,
    loading: policiesLoading,
    error: policiesError,
    refetch: refetchPolicies
  } = useRolePermissionMatrixQuery({
    fetchPolicy: 'cache-and-network'
  });
  const [setRolePermission, { loading: savingPolicy }] = useSetRolePermissionMutation();

  const matrix = policyData?.rolePermissionMatrix;
  const principals = matrix?.principals?.length ? matrix.principals : ROLE_PRINCIPALS;
  const resources = matrix?.resources?.length ? matrix.resources : PERMISSION_RESOURCES;
  const permissions = matrix?.permissions || EFFECTIVE_PERMISSIONS;

  // -------------------------------------------------------------------------
  // Department roles + audit log state
  // -------------------------------------------------------------------------
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [newRole, setNewRole] = useState('MEMBER');
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

  const persistPermission = async (principalId, resourceId, next) => {
    const effect =
      next === 'allow'
        ? PermissionEffect.Allow
        : next === 'deny'
          ? PermissionEffect.Deny
          : PermissionEffect.Inherit;

    try {
      await setRolePermission({
        variables: { input: { role: principalId, resource: resourceId, effect } }
      });
      await refetchPolicies();
      loadAudit();
    } catch (err) {
      toast.error(err?.message || 'Could not update permission');
    }
  };

  const persistBulkPermissions = async (changes) => {
    for (const change of changes) {
      await persistPermission(change.principalId, change.resourceId, change.value);
    }
  };

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
        variables: { input: { departmentId: selectedDept, userId: newUserId, role: newRole } }
      });
      toast.success('Member added');
      setNewUserId('');
      setNewRole('MEMBER');
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

  const roleRows = useMemo(() => {
    const counts = new Map();
    for (const user of userList) {
      const role = user.role || 'USER';
      counts.set(role, (counts.get(role) || 0) + 1);
    }
    return principals.map((principal) => ({
      id: principal.id,
      role: principal.id,
      users: counts.get(principal.id) || 0,
      access:
        principal.id === 'USER'
          ? 'Workspace only'
          : principal.id === 'ADMIN'
            ? 'Operator console'
            : 'Full control'
    }));
  }, [principals, userList]);

  const roleColumns = useMemo(
    () => [
    {
      id: 'role',
      header: 'Role',
      cell: ({ row }) =>
      <ResponsiveStack direction="row" gap={2} align="center">
            <ShieldCheck size={14} className="text-fg-muted" />
            <span className="font-medium">{roleLabel(row.role)}</span>
          </ResponsiveStack>
    },
    {
      id: 'access',
      header: 'Effective access',
      width: 180,
      cell: ({ row }) => <Badge tone="neutral">{row.access}</Badge>
    },
    {
      id: 'users',
      header: 'Users',
      width: 90,
      align: 'right',
      cell: ({ row }) => <span className="font-mono text-xs">{row.users}</span>
    }],
    []
  );

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

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PageHeader
          title="Policies"
          count="role-based access"
          description="Backend-backed role access matrix, department-scoped roles, and an audit trail for this Infinibay instance."
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
                refetchPolicies();
                loadDepartments();
                loadMembers(selectedDept);
                loadAudit();
              }}
              disabled={isLoading || policiesLoading || savingPolicy}
            >
              <RefreshCw size={14} />
              Refresh
            </Button>
          } />

        {policiesError ? (
          <Alert tone="warning" icon={<ShieldCheck size={14} />} title="Policy backend unavailable">
            Showing safe built-in role defaults. Persisted role permissions could not be loaded.
          </Alert>
        ) : (
          <Alert tone="info" icon={<ShieldCheck size={14} />} title="Role permissions are backend-backed">
            SUPER_ADMIN remains protected. Department roles below grant scoped access without making someone a global admin; every change is recorded in the audit trail.
          </Alert>
        )}

        <SectionCard icon={<ShieldCheck size={16} className="text-fg-muted" />} title="Effective role matrix">
          <PermissionMatrix
            principals={principals}
            resources={resources}
            value={permissions}
            onChange={persistPermission}
            onBulkChange={persistBulkPermissions}
            density="compact" />
        </SectionCard>

        <DataTable rows={roleRows} columns={roleColumns} rowId={(r) => r.id} defaultDensity="compact" />

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
                value={newRole}
                onChange={setNewRole}
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
