'use client';

import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useMyPermissionsQuery } from '@/gql/hooks';
import { selectIsLoggedIn } from '@/state/slices/auth';

/**
 * Action-level RBAC for the UI.
 *
 * Reads `myPermissions.grants` — the same query the sidebar and route guard
 * already issue, so Apollo serves it straight from the cache — and exposes a
 * stable `can()` predicate keyed by the backend's `resource:verb` permission
 * strings (e.g. `can('vm:delete')`, `can('role:edit')`).
 *
 * The backend returns grants already expanded to concrete leaf permissions
 * (a `*` / `<resource>:manage` role grant is flattened into its leaves before
 * it reaches us), so an exact membership test is sufficient and complete.
 *
 * Use this to gate WRITE controls — disable + tooltip is preferred over hiding.
 * The server remains the real authorization boundary; this only keeps the UI
 * from offering actions that would fail with a raw FORBIDDEN toast.
 *
 * While grants are still loading we answer optimistically (`can` → true) so
 * controls don't flash disabled→enabled on first paint.
 *
 * On query failure `grants` is empty and `can()` returns false for everything,
 * so consumers get an `error` (and `refetch`) to surface a "couldn't verify
 * permissions — retry" affordance instead of silently-disabled controls.
 *
 * @returns {{ can: (permission: string) => boolean, isLoading: boolean, error: object|undefined, refetch: Function, grants: Array<{permission: string, scope: string}> }}
 */
export function usePermissions() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { data, loading, error, refetch } = useMyPermissionsQuery({
    skip: !isLoggedIn,
    fetchPolicy: 'cache-and-network',
  });

  const grants = data?.myPermissions?.grants;
  const isLoading = loading && !grants;

  const grantSet = useMemo(
    () => new Set((grants || []).map((g) => g.permission)),
    [grants],
  );

  const can = useCallback(
    (permission) => {
      if (!permission) return false;
      // Optimistic until grants arrive, to avoid a disabled→enabled flicker.
      if (isLoading) return true;
      // `*` is the SUPER_ADMIN wildcard; otherwise grants are concrete leaves.
      return grantSet.has('*') || grantSet.has(permission);
    },
    [grantSet, isLoading],
  );

  return { can, isLoading, error, refetch, grants: grants || [] };
}
