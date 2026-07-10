'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { useActiveMigrationsQuery } from '@/gql/hooks';
import { taskSeeded, taskDismissed } from '@/state/slices/backgroundTasks';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:realtime:migration-rehydrator');

const migrationTaskId = (vmId) => `migration:${vmId}`;
const MIGRATION_ID_PREFIX = 'migration:';

/**
 * MigrationRehydrator — keeps the header's background-tasks dropdown in sync with the
 * cross-node migrations that are ALREADY in flight, across page reloads and socket drops.
 *
 * The migration worker streams progress only over Socket.IO ('migrations'), and the
 * backgroundTasks slice is intentionally not persisted — so a page reload mid-move starts
 * with an empty dropdown and the user loses sight of the move. This queries `activeMigrations`
 * (VMs the caller can see whose status is the backend 'moving' lock) and:
 *   - SEEDS an indeterminate "Moving…" entry for each in-flight move (taskSeeded is
 *     create-only, so it can never regress a row a live socket event already advanced);
 *   - RECONCILES: drops any locally-tracked migration still marked 'running' that the server
 *     no longer reports as moving. That covers the move that finished while this client was
 *     disconnected (or in the brief window before the socket subscribed on load), whose
 *     terminal 'completed'/'failed' event was never delivered — otherwise its "Moving…" row
 *     and the running-task badge would stay stuck until a full reload.
 *
 * It re-queries whenever the realtime socket (re)connects (passed in as `isConnected` by the
 * RealTimeProvider that renders it), which is exactly when a terminal event could have been
 * missed. Renders nothing.
 *
 * @param {{ isConnected: boolean }} props - live Socket.IO connection state
 */
export default function MigrationRehydrator({ isConnected }) {
  const dispatch = useDispatch();
  const store = useStore();
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);

  const { data, refetch } = useActiveMigrationsQuery({
    skip: !isLoggedIn,
    // Re-check on every mount/login rather than trusting a stale cache — the set of
    // in-flight moves is small and short-lived.
    fetchPolicy: 'network-only',
  });

  // Seed the in-flight moves + reconcile away any stale "Moving…" seeds, from a fresh
  // activeMigrations snapshot. Reads the current tasks imperatively (store.getState) so
  // this doesn't re-run on every live progress dispatch.
  const seedAndReconcile = useCallback((list) => {
    if (!Array.isArray(list)) return;
    const now = Date.now();
    const activeIds = new Set(list.map((vm) => vm?.id).filter(Boolean));

    for (const vm of list) {
      if (!vm?.id) continue;
      dispatch(taskSeeded({
        id: migrationTaskId(vm.id),
        kind: 'migration',
        title: `Moving ${vm.name || 'Desktop'}`,
        status: 'running',
        detail: 'Moving to another node…',
        progress: 0,
        updatedAt: now,
      }));
    }

    // Any migration task still 'running' but no longer reported as moving finished while we
    // weren't listening — drop it so it can't get stuck. Leaves finished (success/error)
    // rows alone so their terminal state still shows briefly.
    const bt = store.getState()?.backgroundTasks;
    for (const id of bt?.order || []) {
      const t = bt.byId[id];
      if (!t || t.kind !== 'migration' || t.status !== 'running' || !id.startsWith(MIGRATION_ID_PREFIX)) continue;
      const vmId = id.slice(MIGRATION_ID_PREFIX.length);
      if (!activeIds.has(vmId)) dispatch(taskDismissed(id));
    }
  }, [dispatch, store]);

  // Initial load + any cache-driven refresh.
  useEffect(() => {
    if (data?.activeMigrations) {
      seedAndReconcile(data.activeMigrations);
      debug.info('seed', `Re-hydrated ${data.activeMigrations.length} in-flight migration(s)`);
    }
  }, [data, seedAndReconcile]);

  // On every (re)connect, force a fresh reconcile — a terminal event may have been missed
  // while the socket was down. refetch resolves with the latest snapshot regardless of
  // whether the cached `data` object identity changed. Guarded to the rising edge of
  // isConnected so we don't refetch on every render (Apollo's refetch identity may churn).
  const wasConnectedRef = useRef(false);
  useEffect(() => {
    if (!isLoggedIn) { wasConnectedRef.current = false; return; }
    if (!isConnected) { wasConnectedRef.current = false; return; }
    if (wasConnectedRef.current) return;
    wasConnectedRef.current = true;
    refetch?.()
      .then((r) => seedAndReconcile(r?.data?.activeMigrations))
      .catch(() => {});
  }, [isConnected, isLoggedIn, refetch, seedAndReconcile]);

  return null;
}
