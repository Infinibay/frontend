// Shared pure helpers for the identity provider detail page and its sections.
// Extracted verbatim from the page during a structural refactor — no behavior change.

/**
 * Render an ISO timestamp as a short relative string ("just now", "5m ago",
 * "2h ago", "3d ago"). Returns '-' for empty input.
 */
export function timeAgo(iso) {
  if (!iso) return '-';
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.round(ms / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}
