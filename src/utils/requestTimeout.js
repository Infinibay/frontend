// Per-operation request timeouts for the GraphQL transport.
//
// Queries must be fast, so a short timeout protects the UI from a stalled-but-open
// connection hanging the loading state. MUTATIONS are different: VM lifecycle
// operations (create/destroy/migrate) legitimately take tens of seconds to
// minutes (disk copy, QEMU teardown, unattended install kickoff). Killing those
// at the query timeout aborts an in-flight — often already-succeeding — write and
// surfaces a raw "signal is aborted without reason" crash. So mutations get a
// generous bound instead.

export const QUERY_TIMEOUT_MS = 30_000;
export const MUTATION_TIMEOUT_MS = 300_000; // 5 min — covers slow VM lifecycle ops

/**
 * Decide the request timeout from the GraphQL request body. Handles a single
 * operation or an array (batched). Any mutation in the batch → the mutation
 * timeout. Falls back to the query timeout when the body can't be parsed.
 *
 * @param {string|object|Array} body - the fetch body (JSON string or parsed)
 * @returns {number} timeout in ms
 */
export function timeoutForRequestBody(body) {
  try {
    const parsed = typeof body === 'string' ? JSON.parse(body) : body;
    const ops = Array.isArray(parsed) ? parsed : [parsed];
    const anyMutation = ops.some((op) => {
      const q = op?.query;
      // A GraphQL document is a mutation when an operation definition starts with
      // the `mutation` keyword. Anchored per-line so a field or type merely NAMED
      // "mutation" doesn't match.
      return typeof q === 'string' && /^[^\S\n]*mutation[\s({]/m.test(q);
    });
    return anyMutation ? MUTATION_TIMEOUT_MS : QUERY_TIMEOUT_MS;
  } catch {
    return QUERY_TIMEOUT_MS;
  }
}
