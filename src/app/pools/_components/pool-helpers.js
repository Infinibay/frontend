// ---------------------------------------------------------------------------
// Pure presentation helpers shared by the pools list page and its columns.
// Extracted verbatim from the page — no behaviour change.
// ---------------------------------------------------------------------------

export const IDLE_STATUSES = ['off', 'stopped', 'paused', 'suspended'];

// The GraphQL PoolType enum serialises as its UPPERCASE key on the wire
// (PERSISTENT | NON_PERSISTENT) even though the backend TS enum VALUES are
// lowercase ('persistent' | 'non-persistent'). Every pool.type that arrives over
// GraphQL — and every value we send back as CreatePoolInput.type — is the uppercase
// key, so compare against that. These are the canonical wire values.
export const POOL_TYPE = { PERSISTENT: 'PERSISTENT', NON_PERSISTENT: 'NON_PERSISTENT' };

// True when the pool keeps a per-user desktop across logoffs (vs. non-persistent,
// which hands out any idle desktop and resets it to the golden image on logoff).
export function isPersistentPool(type) {
  return String(type ?? '').toUpperCase() === POOL_TYPE.PERSISTENT;
}

// Human-facing label for the pool persistence model.
export function typeLabel(type) {
  return isPersistentPool(type) ? 'Persistent' : 'Non-persistent';
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
