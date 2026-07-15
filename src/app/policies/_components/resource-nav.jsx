import { memo } from 'react';

import { resourceMatches } from './policy-helpers';

// "granted/total" meter for a resource. Muted at 0, accent-tinted when partial,
// solid accent when the whole resource is granted — a role's reach at a glance.
const Meter = ({ granted, total }) => {
  const tone =
    granted === 0
      ? 'text-fg-subtle bg-white/[0.04]'
      : granted >= total
        ? 'text-accent bg-accent/15'
        : 'text-fg bg-white/[0.07]';
  return (
    <span
      className={`ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums ${tone}`}
      title={`${granted} of ${total} actions granted`}>
      {granted}/{total}
    </span>
  );
};

// One navigator row. memo'd on primitive props so that switching resources only
// re-renders the two rows whose `active` flips — NOT all 28. This is the fix for
// the "changing resources is slow" lag: the old code re-rendered the whole list
// on every click just to move one highlight.
const NavRow = memo(function NavRow({ resourceKey, label, scoped, granted, total, active, onSelect }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => onSelect(resourceKey)}
      className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors focus:outline-none focus-visible:shadow-[var(--harbor-focus-shadow)] ${
        active ? 'bg-surface-2 text-fg' : 'text-fg-muted hover:bg-surface-2/60 hover:text-fg'
      }`}>
      <span className={`h-4 w-0.5 shrink-0 rounded-full ${active ? 'bg-accent' : 'bg-transparent'}`} />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {!scoped ? (
        <span className="shrink-0 text-[9px] uppercase tracking-wide text-fg-subtle">global</span>
      ) : null}
      <Meter granted={granted} total={total} />
    </button>
  );
});

// Grouped resource navigator — the middle pane of the permissions editor.
// Replaces the old single long accordion: pick a resource here, edit only its
// verbs on the right. Filtered live by the search box and the "granted" view
// filter; empty groups disappear so the list stays short. Meter counts arrive
// precomputed (grantedByResource) so navigation never recomputes them; a native
// scroll container (no framer-motion) keeps the hot path cheap.
export const ResourceNav = memo(function ResourceNav({
  groups,
  grantedByResource,
  selectedResourceKey,
  onSelect,
  query,
  viewFilter
}) {
  const visibleGroups = groups
    .map(([group, resources]) => [
      group,
      resources.filter((r) => {
        if (!resourceMatches(r, query)) return false;
        if (viewFilter === 'granted') return (grantedByResource.get(r.key)?.granted || 0) > 0;
        return true;
      })
    ])
    .filter(([, resources]) => resources.length);

  if (!visibleGroups.length) {
    // Three distinct empty causes so the copy never misleads: pure no-match,
    // "granted" filter with nothing granted, and "granted" filter + a query
    // that matches resources the role simply has no grants on.
    const message =
      viewFilter === 'granted'
        ? query
          ? `No granted permissions match “${query}”.`
          : 'This role has no granted permissions yet.'
        : `Nothing matches “${query}”.`;
    return <p className="px-2 py-8 text-center text-xs text-fg-muted">{message}</p>;
  }

  return (
    <div className="max-h-[60vh] overflow-y-auto pr-1">
      <nav className="flex flex-col gap-4" aria-label="Permission resources">
        {visibleGroups.map(([group, resources]) => (
          <div key={group} className="flex flex-col gap-0.5">
            <span className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
              {group}
            </span>
            {resources.map((r) => {
              const counts = grantedByResource.get(r.key) || { granted: 0, total: (r.verbs || []).length };
              return (
                <NavRow
                  key={r.key}
                  resourceKey={r.key}
                  label={r.label}
                  scoped={r.scoped}
                  granted={counts.granted}
                  total={counts.total}
                  active={r.key === selectedResourceKey}
                  onSelect={onSelect} />
              );
            })}
          </div>
        ))}
      </nav>
    </div>
  );
});
