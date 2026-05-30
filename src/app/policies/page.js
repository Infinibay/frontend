'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Page,
  Alert,
  Badge,
  Button,
  DataTable,
  PermissionMatrix,
  ResponsiveStack } from
'@infinibay/harbor';
import { RefreshCw, ShieldCheck, Users } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { fetchUsers } from '@/state/slices/users';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import {
  PermissionEffect,
  useRolePermissionMatrixQuery,
  useSetRolePermissionMutation
} from '@/gql/hooks';
import { toast } from 'sonner';

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
  'SUPER_ADMIN:overview': 'allow',
  'SUPER_ADMIN:desktops': 'allow',
  'SUPER_ADMIN:workspace': 'allow',
  'SUPER_ADMIN:infrastructure': 'allow',
  'SUPER_ADMIN:departments': 'allow',
  'SUPER_ADMIN:blueprints': 'allow',
  'SUPER_ADMIN:applications': 'allow',
  'SUPER_ADMIN:firewall': 'allow',
  'SUPER_ADMIN:scripts': 'allow',
  'SUPER_ADMIN:users': 'allow',
  'SUPER_ADMIN:identity': 'allow',
  'SUPER_ADMIN:policies': 'allow',
  'SUPER_ADMIN:settings': 'allow',
  'ADMIN:overview': 'allow',
  'ADMIN:desktops': 'allow',
  'ADMIN:workspace': 'allow',
  'ADMIN:infrastructure': 'allow',
  'ADMIN:departments': 'allow',
  'ADMIN:blueprints': 'allow',
  'ADMIN:applications': 'allow',
  'ADMIN:firewall': 'allow',
  'ADMIN:scripts': 'allow',
  'ADMIN:users': 'allow',
  'ADMIN:identity': 'allow',
  'ADMIN:policies': 'allow',
  'ADMIN:settings': 'allow',
  'USER:overview': 'deny',
  'USER:desktops': 'deny',
  'USER:workspace': 'allow',
  'USER:infrastructure': 'deny',
  'USER:departments': 'deny',
  'USER:blueprints': 'deny',
  'USER:applications': 'deny',
  'USER:firewall': 'deny',
  'USER:scripts': 'deny',
  'USER:users': 'deny',
  'USER:identity': 'deny',
  'USER:policies': 'deny',
  'USER:settings': 'deny'
};

function roleLabel(role) {
  if (role === 'SUPER_ADMIN') return 'Super admin';
  if (role === 'ADMIN') return 'Admin';
  return 'User';
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

  const persistPermission = async (principalId, resourceId, next) => {
    const effect =
      next === 'allow'
        ? PermissionEffect.Allow
        : next === 'deny'
          ? PermissionEffect.Deny
          : PermissionEffect.Inherit;

    try {
      await setRolePermission({
        variables: {
          input: {
            role: principalId,
            resource: resourceId,
            effect
          }
        }
      });
      await refetchPolicies();
    } catch (err) {
      toast.error(err?.message || 'Could not update permission');
    }
  };

  const persistBulkPermissions = async (changes) => {
    for (const change of changes) {
      await persistPermission(change.principalId, change.resourceId, change.value);
    }
  };

  const roleRows = useMemo(() => {
    const list = users || [];
    const counts = new Map();
    for (const user of list) {
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
  }, [principals, users]);

  const columns = useMemo(
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
      cell: ({ row }) =>
      <Badge tone="neutral">
            {row.access}
          </Badge>

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

  return (
    <Page>
      <ResponsiveStack direction="col" gap={4}>
        <PageHeader
          title="Policies"
          count="role-based access"
          description="Backend-backed role access matrix for this Infinibay instance."
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
            SUPER_ADMIN remains protected. Department-scoped roles, approval flows, and audit-backed policy changes are the next enterprise layer.
          </Alert>
        )}

        <section className="rounded-md border border-border-subtle bg-surface-raised p-4">
          <ResponsiveStack direction="col" gap={3}>
            <ResponsiveStack direction="row" gap={2} align="center">
              <ShieldCheck size={16} className="text-fg-muted" />
              <span className="text-sm font-medium">Effective role matrix</span>
            </ResponsiveStack>
            <PermissionMatrix
              principals={principals}
              resources={resources}
              value={permissions}
              onChange={persistPermission}
              onBulkChange={persistBulkPermissions}
              density="compact" />
          </ResponsiveStack>
        </section>

        <DataTable
          rows={roleRows}
          columns={columns}
          rowId={(r) => r.id}
          defaultDensity="compact" />
        
      </ResponsiveStack>
    </Page>);

}
