import { Badge, IconButton, Select } from '@infinibay/harbor';
import { Trash2 } from 'lucide-react';

import { GrantEffect } from '@/gql/graphql';
import { SCOPE_LABEL, formatWhen, roleLabel } from './policy-helpers';

// ---------------------------------------------------------------------------
// DataTable column definitions for the policies page. Extracted as pure
// factories so the page can keep memoising them (same useMemo, same deps) with
// no behaviour change. Callbacks/flags are supplied by the page.
// ---------------------------------------------------------------------------

export function createMemberColumns({
  changeMemberRole,
  removeMember,
  changingMemberRoleFor,
  pendingMemberRole = {}
}) {
  return [
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
      value={pendingMemberRole[row.userId] ?? row.role}
      disabled={changingMemberRoleFor === row.userId}
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
    align: 'end',
    cell: ({ row }) =>
    <IconButton
      size="sm"
      variant="ghost"
      label={`Remove ${row.userName || row.userEmail || 'member'}`}
      icon={<Trash2 size={12} />}
      onClick={() => removeMember(row)} />
  }];
}

export function createAuditColumns() {
  return [
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
  }];
}

export function createOverrideColumns({ canGrantUser, handleClearOverride }) {
  return [
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
    align: 'end',
    cell: ({ row }) =>
    canGrantUser ?
      <IconButton
        size="sm"
        variant="ghost"
        label={`Clear override ${row.permission}`}
        icon={<Trash2 size={12} />}
        onClick={() => handleClearOverride(row)} /> :
      null
  }];
}
