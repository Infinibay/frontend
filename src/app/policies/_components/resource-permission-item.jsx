import { Lock } from 'lucide-react';

import { NONE, humanizeVerb } from './policy-helpers';
import { ScopeSegmented } from './scope-segmented';

// Per-resource permission editor (the "Manage all" row + one row per verb).
// Extracted verbatim from the page's renderResourceItem — no behaviour change.
// State stays owned by the page; everything it needs arrives as props.
export const ResourcePermissionItem = ({
  resource,
  selectedRole,
  effectiveGrants,
  pendingGrants = {},
  roleEditLocked,
  roleReadOnly,
  changeGrant
}) => {
  // The resource-level "manage" grant value (direct grant only). While a change
  // is in flight, render the optimistic pending scope instead of the stale one.
  const managePermission = `${resource.key}:manage`;
  const manageGrant = (selectedRole?.permissions || []).find(
    (g) => g.permission === managePermission
  );
  const managePending = pendingGrants[managePermission] !== undefined;
  const manageValue = managePending
    ? pendingGrants[managePermission]
    : manageGrant
      ? manageGrant.scope
      : NONE;

  return (
    <div className="overflow-hidden rounded-sm border border-[color:var(--harbor-border-subtle)] bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-[color:var(--harbor-border-subtle)] bg-surface-1 px-3.5 py-2.5">
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

      <div className="divide-y divide-[color:var(--harbor-border-subtle)]">
        {(resource.verbs || []).map((verb) => {
          const permission = `${resource.key}:${verb}`;
          const directGrant = (selectedRole?.permissions || []).find(
            (g) => g.permission === permission
          );
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
              className="flex items-center justify-between gap-3 px-3.5 py-2 transition-colors hover:bg-surface-2">
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
};
