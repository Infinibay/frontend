// ---------------------------------------------------------------------------
// Pure presentation helpers shared by the pools list page and its columns.
// Extracted verbatim from the page — no behaviour change.
// ---------------------------------------------------------------------------

export const IDLE_STATUSES = ['off', 'stopped', 'paused', 'suspended'];

// Human-facing label for the pool persistence model.
export function typeLabel(type) {
  return type === 'persistent' ? 'Persistent' : 'Non-persistent';
}

// One-line health summary used for the status dot tooltip + a11y label.
export function healthLabel(pool) {
  if (pool.draining) return 'Draining — existing sessions keep running, no new connections handed out';
  if (pool.currentSize < pool.sizeMin) return `Below minimum (${pool.currentSize}/${pool.sizeMin}) — refilling`;
  return 'Healthy — at or above the warm minimum';
}

export function healthDot(pool) {
  if (pool.draining) return 'warning';
  if (pool.currentSize < pool.sizeMin) return 'degraded';
  return 'online';
}
