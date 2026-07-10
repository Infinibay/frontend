import { createSlice } from '@reduxjs/toolkit';

/**
 * backgroundTasks — an ephemeral, app-wide registry of long-running server tasks
 * (currently cross-node VM migrations) so the header can show a live dropdown of
 * what's happening in the background, with progress + status, regardless of which
 * page you're on. Fed by RealTimeReduxService from the Socket.IO lifecycle events;
 * NOT persisted (a page reload legitimately forgets in-flight background work — the
 * server keeps driving it and re-emits, and finished toasts shouldn't resurrect).
 *
 * A task:
 *   { id, kind, title, detail, status: 'running'|'success'|'error',
 *     phase?, progress?: 0..100, error?, startedAt, updatedAt }
 * `id` is a stable key per unit of work (e.g. `migration:<vmId>`) so repeated
 * progress events UPDATE one row instead of stacking duplicates.
 */

// Keep only the most recent N FINISHED tasks (running tasks are never evicted), so a
// long session doesn't accumulate unbounded success/error rows.
const MAX_FINISHED = 12;

const initialState = {
  byId: {},
  order: [], // ids, most-recently-created first
};

function evictFinished(state) {
  const finishedIds = state.order.filter((id) => state.byId[id] && state.byId[id].status !== 'running');
  if (finishedIds.length <= MAX_FINISHED) return;
  // order is most-recent-first, so the tail of the finished list is the oldest.
  for (const id of finishedIds.slice(MAX_FINISHED)) delete state.byId[id];
  state.order = state.order.filter((id) => state.byId[id]);
}

const slice = createSlice({
  name: 'backgroundTasks',
  initialState,
  reducers: {
    // Create-or-update a task (start / progress). Preserves startedAt across updates.
    taskUpserted(state, action) {
      const t = action.payload;
      if (!t || !t.id) return;
      const existing = state.byId[t.id];
      if (existing) {
        state.byId[t.id] = { ...existing, ...t, startedAt: existing.startedAt };
      } else {
        state.byId[t.id] = { startedAt: t.updatedAt, progress: 0, ...t };
        state.order.unshift(t.id);
      }
      evictFinished(state);
    },
    // Seed a task from a query on load (page reload / login) — create-only. Unlike
    // taskUpserted it NEVER touches an existing entry, so re-hydrating in-flight work
    // after an F5 can't clobber a fresher live progress/terminal state that a socket
    // event may have already produced (e.g. seed arrives at 0% after a 63% event).
    taskSeeded(state, action) {
      const t = action.payload;
      if (!t || !t.id || state.byId[t.id]) return;
      state.byId[t.id] = { startedAt: t.updatedAt, progress: 0, ...t };
      state.order.unshift(t.id);
      evictFinished(state);
    },
    // Terminal transition (success / error). Records even if we never saw a start.
    taskFinished(state, action) {
      const t = action.payload;
      if (!t || !t.id) return;
      const existing = state.byId[t.id];
      if (existing) {
        state.byId[t.id] = { ...existing, ...t, startedAt: existing.startedAt };
      } else {
        state.byId[t.id] = { startedAt: t.updatedAt, ...t };
        state.order.unshift(t.id);
      }
      evictFinished(state);
    },
    taskDismissed(state, action) {
      const id = action.payload;
      delete state.byId[id];
      state.order = state.order.filter((x) => x !== id);
    },
    clearFinishedTasks(state) {
      state.order = state.order.filter((id) => {
        if (state.byId[id] && state.byId[id].status !== 'running') {
          delete state.byId[id];
          return false;
        }
        return true;
      });
    },
  },
});

export const { taskUpserted, taskSeeded, taskFinished, taskDismissed, clearFinishedTasks } = slice.actions;

// Tasks in display order: running first, then most-recently-updated.
export const selectBackgroundTasks = (state) => {
  const s = state.backgroundTasks;
  return s.order
    .map((id) => s.byId[id])
    .filter(Boolean)
    .sort((a, b) => {
      const ar = a.status === 'running' ? 0 : 1;
      const br = b.status === 'running' ? 0 : 1;
      if (ar !== br) return ar - br;
      return (b.updatedAt || 0) - (a.updatedAt || 0);
    });
};

export const selectRunningTaskCount = (state) =>
  state.backgroundTasks.order.reduce(
    (n, id) => n + (state.backgroundTasks.byId[id]?.status === 'running' ? 1 : 0),
    0,
  );

export default slice.reducer;
