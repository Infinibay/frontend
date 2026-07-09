import { useEffect, useRef } from 'react';
import { getSocketService } from '@/services/socketService';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:hooks:useRealtimeRefetch');

/**
 * Refetch an Apollo query when the backend pushes a Socket.IO event for a
 * resource — the websocket replacement for `pollInterval`. We do NOT poll: the
 * query fetches once and then stays fresh by reacting to `${namespace}:${resource}:${action}`
 * events emitted by the backend EventManager.
 *
 * @param {string} resource  Backend resource name (e.g. 'nodes', 'vms', 'recommendations').
 * @param {Function} refetch The Apollo `refetch` from the query hook.
 * @param {Object} [options]
 * @param {string[]|null} [options.actions=null]  Actions to listen for. `null` uses
 *        socketService's per-resource defaults (create/update/delete, plus power_*
 *        for 'vms'). Pass explicitly for lifecycle actions like ['completed'].
 * @param {number} [options.minIntervalMs=0]  Coalesce bursts: fire immediately on the
 *        first event, then at most once per this interval (a leading-edge throttle).
 *        Use a few seconds for chatty streams (node heartbeats); 0 = every event.
 * @param {(action: string, event: any) => boolean} [options.predicate]  Optional filter;
 *        return false to ignore an event (e.g. wrong machineId).
 * @param {boolean} [options.skip=false]  Skip subscribing (mirrors the query's skip).
 */
export function useRealtimeRefetch(resource, refetch, options = {}) {
  const { actions = null, minIntervalMs = 0, predicate = null, skip = false } = options;

  // Keep the latest refetch/predicate/actions without re-subscribing on every
  // render. `actions` goes through a ref so an inline array literal (new identity
  // each render) doesn't tear down and rebuild the subscription; re-subscription
  // is keyed on its serialized value (`actionsKey`) instead.
  const refetchRef = useRef(refetch);
  refetchRef.current = refetch;
  const predicateRef = useRef(predicate);
  predicateRef.current = predicate;
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  const actionsKey = actions ? actions.join(',') : '';

  useEffect(() => {
    if (skip || !resource) return undefined;

    const socket = getSocketService();
    let lastFetch = 0;
    let timer = null;
    let cancelled = false;

    const run = () => {
      if (cancelled) return;
      lastFetch = Date.now();
      Promise.resolve(refetchRef.current?.()).catch((err) => {
        debug.warn('refetch', `${resource} refetch failed:`, err);
      });
    };

    const trigger = () => {
      if (minIntervalMs <= 0) {
        run();
        return;
      }
      const elapsed = Date.now() - lastFetch;
      if (elapsed >= minIntervalMs) {
        run();
      } else if (!timer) {
        // Trailing edge: coalesce the rest of the burst into one refetch.
        timer = setTimeout(() => {
          timer = null;
          run();
        }, minIntervalMs - elapsed);
      }
    };

    const unsubscribe = socket.subscribeToAllResourceEvents(
      resource,
      (action, event) => {
        if (event?.status === 'error') return;
        if (predicateRef.current && !predicateRef.current(action, event)) return;
        trigger();
      },
      actionsRef.current,
    );

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      unsubscribe?.();
    };
  }, [resource, actionsKey, minIntervalMs, skip]);
}

export default useRealtimeRefetch;
