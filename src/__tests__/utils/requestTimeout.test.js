// Unit tests for timeoutForRequestBody (utils/requestTimeout.js).
//
// Regression: a blanket 30s fetch timeout aborted legitimately-slow VM lifecycle
// MUTATIONS (destroy/create/migrate routinely take >30s), surfacing as a raw
// "signal is aborted without reason" crash even though the write had succeeded.
// Mutations must get the generous timeout; queries keep the short one.

import { describe, it, expect } from 'vitest';
import {
  timeoutForRequestBody,
  QUERY_TIMEOUT_MS,
  MUTATION_TIMEOUT_MS,
} from '@/utils/requestTimeout';

const bodyFor = (query) => JSON.stringify({ operationName: 'x', query, variables: {} });

describe('timeoutForRequestBody', () => {
  it('gives a mutation the generous timeout (the destroyMachine case)', () => {
    expect(timeoutForRequestBody(bodyFor('mutation destroyMachine($id: String!) { destroyMachine(id: $id) { success } }')))
      .toBe(MUTATION_TIMEOUT_MS);
  });

  it('gives a query the short timeout', () => {
    expect(timeoutForRequestBody(bodyFor('query machines { machines { id } }')))
      .toBe(QUERY_TIMEOUT_MS);
  });

  it('handles a mutation with leading whitespace/newlines', () => {
    expect(timeoutForRequestBody(bodyFor('\n\n   mutation Foo { foo }'))).toBe(MUTATION_TIMEOUT_MS);
  });

  it('does NOT treat a query with a field merely NAMED "mutation" as a mutation', () => {
    expect(timeoutForRequestBody(bodyFor('query { mutationLog { id } }'))).toBe(QUERY_TIMEOUT_MS);
  });

  it('uses the mutation timeout when ANY op in a batch is a mutation', () => {
    const batch = JSON.stringify([
      { query: 'query A { a }' },
      { query: 'mutation B { b }' },
    ]);
    expect(timeoutForRequestBody(batch)).toBe(MUTATION_TIMEOUT_MS);
  });

  it('accepts an already-parsed object body', () => {
    expect(timeoutForRequestBody({ query: 'mutation M { m }' })).toBe(MUTATION_TIMEOUT_MS);
  });

  it('falls back to the query timeout for an unparseable / empty body', () => {
    expect(timeoutForRequestBody(undefined)).toBe(QUERY_TIMEOUT_MS);
    expect(timeoutForRequestBody('not json')).toBe(QUERY_TIMEOUT_MS);
    expect(timeoutForRequestBody('')).toBe(QUERY_TIMEOUT_MS);
  });

  it('mutation timeout is meaningfully longer than the old blanket 30s', () => {
    expect(MUTATION_TIMEOUT_MS).toBeGreaterThan(QUERY_TIMEOUT_MS);
    expect(QUERY_TIMEOUT_MS).toBe(30_000);
  });
});
