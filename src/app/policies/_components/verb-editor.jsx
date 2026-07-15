import { memo } from 'react';
import { Badge } from '@infinibay/harbor';
import { Lock } from 'lucide-react';

import { NONE, humanizeVerb, verbMatches } from './policy-helpers';
import { ScopeSegmented } from './scope-segmented';

// Detail pane — the verbs of the ONE resource selected in the navigator.
// Replaces the old bordered ResourcePermissionItem card: flat rows, subtle
// dividers, no box outline. A "Manage all" summary sits on top, then one row
// per verb with its scope control and an inline "inherited via …" marker.
// memo'd so it re-renders only when its resource or grant state changes, not on
// every parent render.
export const VerbEditor = memo(function VerbEditor({
  resource,
  selectedRole,
  effectiveGrants,
  pendingGrants = {},
  roleEditLocked,
  roleReadOnly,
  changeGrant,
  query
}) {
  if (!resource) return null;

  // Resource-level "manage" grant (direct only). Optimistic while in flight.
  const managePermission = `${resource.key}:manage`;
  const manageGrant = (selectedRole?.permissions || []).find((g) => g.permission === managePermission);
  const managePending = pendingGrants[managePermission] !== undefined;
  const manageValue = managePending
    ? pendingGrants[managePermission]
    : manageGrant
      ? manageGrant.scope
      : NONE;

  // Search narrows the verbs shown; if nothing matches (the resource was picked
  // by its label, not a verb) fall back to all so the pane is never blank.
  const allVerbs = resource.verbs || [];
  const matched = query ? allVerbs.filter((v) => verbMatches(v, query)) : allVerbs;
  const verbs = matched.length ? matched : allVerbs;
  const narrowed = query && matched.length && matched.length < allVerbs.length;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 pb-3">
        <h3 className="text-sm font-semibold">{resource.label}</h3>
        <Badge tone="neutral">{resource.scoped ? 'scoped' : 'global'}</Badge>
        {narrowed ? (
          <span className="ml-auto text-xs text-fg-muted">matching “{query}”</span>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 rounded-md bg-surface-2/50 px-3 py-2.5">
        <div className="flex min-w-0 flex-col">
          <span className="text-sm font-medium">Manage all</span>
          <span className="text-xs text-fg-muted">Grant every action on this resource at once</span>
        </div>
        <ScopeSegmented
          ariaLabel={`Scope for Manage all — ${resource.label}`}
          value={manageValue}
          scoped={resource.scoped}
          disabled={roleEditLocked || managePending}
          onChange={(v) => changeGrant(managePermission, v)} />
      </div>

      <div className="mt-1 divide-y divide-[color:var(--harbor-border-subtle)]">
        {verbs.map((verb) => {
          const permission = `${resource.key}:${verb}`;
          const directGrant = (selectedRole?.permissions || []).find((g) => g.permission === permission);
          const eff = effectiveGrants.get(permission);
          const derived = eff && eff.source !== 'direct';
          const pending = pendingGrants[permission] !== undefined;
          const value = pending
            ? pendingGrants[permission]
            : directGrant
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
              className="flex items-center justify-between gap-3 px-3 py-2 transition-colors hover:bg-surface-2/50">
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate text-sm">{humanizeVerb(verb)}</span>
                {!roleReadOnly && derived && derivedLabel ? (
                  <span
                    className="inline-flex shrink-0 items-center gap-1 text-[10px] text-fg-subtle"
                    title={`Inherited ${derivedLabel} — edit the source grant to change it`}>
                    <Lock size={10} /> {derivedLabel}
                  </span>
                ) : null}
              </div>
              <ScopeSegmented
                ariaLabel={`Scope for ${humanizeVerb(verb)} — ${resource.label}`}
                value={value}
                scoped={resource.scoped}
                disabled={roleEditLocked || derived || pending}
                onChange={(v) => changeGrant(permission, v)} />
            </div>
          );
        })}
      </div>
    </div>
  );
});
