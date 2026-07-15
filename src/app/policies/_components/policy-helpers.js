import { History, ShieldCheck, UserPlus, Users } from 'lucide-react';
import { PermissionScope } from '@/gql/graphql';

// ---------------------------------------------------------------------------
// Scope helpers + effective-grant logic shared by the policies page and its
// sub-components. Extracted verbatim from the page — no behaviour change.
// ---------------------------------------------------------------------------

export const SCOPE_RANK = {
  [PermissionScope.Own]: 1,
  [PermissionScope.Department]: 2,
  [PermissionScope.Any]: 3
};

export const SCOPE_LABEL = {
  [PermissionScope.Own]: 'Own',
  [PermissionScope.Department]: 'Department',
  [PermissionScope.Any]: 'Any'
};

export const NONE = '__none__';

export function formatWhen(value) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return '—';
  }
}

export function roleLabel(role) {
  if (role === 'SUPER_ADMIN') return 'Super admin';
  if (role === 'ADMIN') return 'Admin';
  return 'User';
}

// "joinDomain" -> "Join Domain", "manageExecutions" -> "Manage Executions".
export function humanizeVerb(verb) {
  const spaced = String(verb).replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

// How many of a resource's verbs the current role effectively holds (any
// source — direct, via manage, via *). Drives the navigator's "granted/total"
// meter so an admin can see a role's reach at a glance without expanding it.
export function grantedCount(resource, effectiveGrants) {
  const verbs = resource?.verbs || [];
  let granted = 0;
  for (const v of verbs) {
    if (effectiveGrants?.get(`${resource.key}:${v}`)) granted += 1;
  }
  return { granted, total: verbs.length };
}

// Does a resource match the search box? Matches its label, key, or any verb
// (human or raw) so "restore", "snap", or "vm" all surface the right rows.
export function resourceMatches(resource, query) {
  const needle = (query || '').trim().toLowerCase();
  if (!needle) return true;
  if (resource.label.toLowerCase().includes(needle)) return true;
  if (resource.key.toLowerCase().includes(needle)) return true;
  return (resource.verbs || []).some(
    (v) => humanizeVerb(v).toLowerCase().includes(needle) || v.toLowerCase().includes(needle)
  );
}

// Does a single verb match the search box? Used to narrow the detail pane.
export function verbMatches(verb, query) {
  const needle = (query || '').trim().toLowerCase();
  if (!needle) return true;
  return humanizeVerb(verb).toLowerCase().includes(needle) || verb.toLowerCase().includes(needle);
}

// Top-level sections, split into tabs so the page isn't one endless scroll.
export const POLICY_TABS = [
  { id: 'roles', label: 'Roles & permissions', icon: ShieldCheck },
  { id: 'users', label: 'User access', icon: UserPlus },
  { id: 'departments', label: 'Departments', icon: Users },
  { id: 'audit', label: 'Audit log', icon: History }
];

// ---------------------------------------------------------------------------
// Effective-grant lookup
// ---------------------------------------------------------------------------
// Build a map of `${resource}:${verb}` -> { scope, source } that expands:
//   - `*`                     (all permissions)
//   - `${resource}:manage`    (every verb of that resource)
//   - cross-resource groups   (a grant on a group key fans out to its members)
// `source` is 'direct' | 'manage' | 'group' | 'wildcard' so the UI can show
// derived grants as disabled ("via *", "via manage", "via group").
export function buildEffectiveGrants(role, registry) {
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
