import { memo, useMemo, useState } from 'react';
import { EmptyState, SegmentedControl, TextField } from '@infinibay/harbor';
import { Lock, Search } from 'lucide-react';

import { ResourceNav } from './resource-nav';
import { VerbEditor } from './verb-editor';
import { grantedCount, resourceMatches } from './policy-helpers';

// Search + view-filter bar. Memoised and fed only query/viewFilter so it does
// NOT re-render (and re-run its framer-motion label/indicator) when you switch
// resources — only when the search text or filter actually change.
const Toolbar = memo(function Toolbar({ query, setQuery, viewFilter, setViewFilter }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="sm:max-w-xs sm:flex-1">
        <TextField
          label="Search permissions"
          icon={<Search size={14} />}
          value={query}
          onChange={(e) => setQuery(e.target.value)} />
      </div>
      {/* Harbor's SegmentedControl renders bare buttons with no group semantics,
          so name the group for assistive tech. */}
      <div className="sm:ml-auto" role="group" aria-label="Filter permissions view">
        <SegmentedControl
          size="sm"
          value={viewFilter}
          onChange={setViewFilter}
          items={[
            { value: 'all', label: 'All' },
            { value: 'granted', label: 'Granted' }
          ]} />
      </div>
    </div>
  );
});

// Static — memo with no props means it renders once and never re-renders.
const ScopeLegend = memo(function ScopeLegend() {
  return (
    <p className="text-[11px] leading-relaxed text-fg-subtle">
      Scope widens left→right: <span className="text-fg-muted">—</span> none ·{' '}
      <span className="text-fg-muted">Own</span> · <span className="text-fg-muted">Dept</span> ·{' '}
      <span className="text-fg-muted">Any</span>. A{' '}
      <Lock size={10} className="mx-0.5 inline align-[-1px]" /> marker means the grant is inherited
      (via <span className="text-fg-muted">manage</span> or <span className="text-fg-muted">*</span>) —
      change it at its source.
    </p>
  );
});

// The permissions editor's inner workspace: search/filter + resource navigator
// + verb detail. It owns the *navigation* view state (which resource, search,
// filter) so selecting a resource re-renders ONLY this subtree — never the
// roles list, the create/edit drawer, or the page. The per-resource meter
// counts are computed once per (registry, role), not on every click.
export const PermissionsWorkspace = ({
  resourcesByGroup,
  selectedRole,
  effectiveGrants,
  pendingGrants,
  roleEditLocked,
  roleReadOnly,
  changeGrant
}) => {
  const [selectedResourceKey, setSelectedResourceKey] = useState(null);
  const [query, setQuery] = useState('');
  const [viewFilter, setViewFilter] = useState('all'); // 'all' | 'granted'

  // key -> { granted, total }. Recomputed only when the registry or the role's
  // effective grants change — NOT on navigation, search, or filter.
  const grantedByResource = useMemo(() => {
    const m = new Map();
    for (const [, resources] of resourcesByGroup) {
      for (const r of resources) m.set(r.key, grantedCount(r, effectiveGrants));
    }
    return m;
  }, [resourcesByGroup, effectiveGrants]);

  const flatResources = useMemo(
    () => resourcesByGroup.flatMap(([, rs]) => rs),
    [resourcesByGroup]
  );

  // Resources visible in the navigator (mirrors ResourceNav's own filter) so the
  // detail selection can be kept valid as search / filter / role change.
  const visibleResources = useMemo(
    () =>
      flatResources.filter((r) => {
        if (!resourceMatches(r, query)) return false;
        if (viewFilter === 'granted') return (grantedByResource.get(r.key)?.granted || 0) > 0;
        return true;
      }),
    [flatResources, query, viewFilter, grantedByResource]
  );

  // Resolve the effective selection DURING render — never in a post-paint effect,
  // which would flash "Nothing to show" for a frame when a search/filter hides
  // the stored selection. If the stored key is still visible we keep it (so the
  // user's pick survives); otherwise we fall back to the first visible resource.
  const activeKey =
    selectedResourceKey && visibleResources.some((r) => r.key === selectedResourceKey)
      ? selectedResourceKey
      : visibleResources[0]?.key ?? null;
  const selectedResource = flatResources.find((r) => r.key === activeKey) || null;

  return (
    <div className="flex flex-col gap-3">
      <Toolbar query={query} setQuery={setQuery} viewFilter={viewFilter} setViewFilter={setViewFilter} />
      <ScopeLegend />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[14rem_1fr]">
        <div className="md:border-r md:border-[color:var(--harbor-border-subtle)] md:pr-3">
          <ResourceNav
            groups={resourcesByGroup}
            grantedByResource={grantedByResource}
            selectedResourceKey={activeKey}
            onSelect={setSelectedResourceKey}
            query={query}
            viewFilter={viewFilter} />
        </div>
        <div className="min-w-0">
          {selectedResource ? (
            <VerbEditor
              resource={selectedResource}
              selectedRole={selectedRole}
              effectiveGrants={effectiveGrants}
              pendingGrants={pendingGrants}
              roleEditLocked={roleEditLocked}
              roleReadOnly={roleReadOnly}
              changeGrant={changeGrant}
              query={query} />
          ) : (
            <EmptyState
              icon={<Search size={18} />}
              title="Nothing to show"
              description="No resource matches your search or filter." />
          )}
        </div>
      </div>
    </div>
  );
};
