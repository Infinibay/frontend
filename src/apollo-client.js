import { ApolloClient, InMemoryCache, createHttpLink, from, CombinedGraphQLErrors } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { createDebugger } from '@/utils/debug';
import { refreshAccessToken } from '@/utils/auth';
import { timeoutForRequestBody } from '@/utils/requestTimeout';
import { clearSessionCookie } from '@/utils/sessionCookie';

const debug = createDebugger('frontend:utils:apollo-client');

// Real per-request timeout. Apollo Client 4's HttpOptions has no `timeout` key,
// so we enforce it ourselves: a custom fetch that aborts via AbortController,
// otherwise a stalled-but-open connection would hang the loading state
// indefinitely. The timeout is OPERATION-AWARE: mutations (slow VM lifecycle
// ops) get a generous bound so a legitimately long-running delete/create/migrate
// is not aborted mid-flight (see requestTimeout.js).
const fetchWithTimeout = (input, init = {}) => {
  const controller = new AbortController();
  const timeoutMs = timeoutForRequestBody(init.body);
  // Abort WITH A REASON so the resulting error is "request timed out" rather than
  // the opaque "signal is aborted without reason" that surfaced as a raw crash.
  const timeoutId = setTimeout(
    () => controller.abort(new DOMException(`Request timed out after ${timeoutMs}ms`, 'TimeoutError')),
    timeoutMs
  );
  // Compose, don't clobber: HttpLink passes its own signal to cancel the request
  // on unsubscribe/unmount. Honour both that signal and our timeout signal.
  const signal = init.signal
    ? AbortSignal.any([init.signal, controller.signal])
    : controller.signal;
  return fetch(input, { ...init, signal }).finally(() => {
    clearTimeout(timeoutId);
  });
};

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:4000/graphql',
  fetch: fetchWithTimeout,
});

// Retry transient failures. Apollo Client 4 surfaces network/HTTP errors as a
// single `error` (e.g. a ServerError carrying a numeric `statusCode`) — the old
// `.networkError`/`.graphQLErrors` shape no longer exists. Retry ONLY genuine
// network/5xx failures, and ONLY for queries — replaying a mutation could
// duplicate a non-idempotent write.
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true
  },
  attempts: {
    max: 3,
    retryIf: (error, operation) => {
      if (!error) return false;

      // Our own timeout (TimeoutError) or an unmount/unsubscribe cancel
      // (AbortError) must not be retried — don't multiply the wait or replay a
      // deliberately-cancelled request.
      if (error.name === 'AbortError' || error.name === 'TimeoutError') return false;

      // Never replay mutations/subscriptions; only queries are safe to retry.
      const definition = operation.query?.definitions?.find(
        (d) => d.kind === 'OperationDefinition'
      );
      if (definition?.operation !== 'query') return false;

      // HTTP errors arrive as ServerError with a numeric statusCode: retry 5xx,
      // never 4xx. No statusCode means a real transport failure (fetch rejected).
      if (typeof error.statusCode === 'number') {
        return error.statusCode >= 500;
      }
      return true;
    }
  }
});

// Auth operations that must never trigger a proactive refresh or reactive
// session-clearing here. (These actually run on the dedicated client in
// utils/auth.js, so this is a defensive guard for anything routed through the
// main client.) The logout op is named `logout` (lowercase) in utils/auth.js —
// match that exactly so the guard isn't dead.
const AUTH_OPERATION_NAMES = ['refreshToken', 'login', 'logout'];

// Detect an AUTHENTICATION failure (not logged in / token expired-revoked-invalid).
// Deliberately does NOT match AUTHORIZATION/permission denials such as
// "Not authorized: requires vm:edit" (those carry code FORBIDDEN) — a missing
// permission must never log the user out.
const isAuthError = ({ message, extensions }) => {
  if (extensions?.code === 'UNAUTHENTICATED') {
    return true;
  }
  return typeof message === 'string' &&
    /authentication required|not authenticated|token (has )?(expired|been revoked|is invalid)|invalid token/i.test(message);
};

const clearSessionAndRedirect = async () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiresAt');
  localStorage.removeItem('socketNamespace');
  // Clear the server-readable session cookie too. src/middleware.ts gates routes
  // solely on this cookie's presence; without clearing it a reactive
  // UNAUTHENTICATED logout (revoked/expired-beyond-refresh token) would leave the
  // middleware gate open until the cookie's original max-age. Mirrors auth.logout.
  clearSessionCookie();
  // Purge the redux-persist 'auth' snapshot too, so prior-user PII and the dead
  // token don't rehydrate after the redirect-triggered reload. The store is
  // imported LAZILY here (never statically): store.js consumes every slice
  // reducer at module-init and the slices import this service, so a static
  // `@/state/store` import would close that cycle and crash app boot with a
  // reducer TDZ ("Cannot access '__WEBPACK_DEFAULT_EXPORT__' before
  // initialization"). This runs only at runtime, so a call-time import is fine.
  try {
    const { persistor } = await import('@/state/store');
    await persistor.purge();
  } catch (e) {
    debug.warn('auth', 'persistor.purge() during reactive logout failed (ignored)', e);
  }
  // Guard against redirect loops when the failing request originated on sign-in.
  if (!window.location.pathname.startsWith('/auth/sign-in')) {
    window.location.href = '/auth/sign-in';
  }
};

// Error link for logging + reactive auth handling. The common expiry case is
// handled proactively in authLink (below); a reactive UNAUTHENTICATED here means
// the refresh token is also dead (or auth failed for another reason), so we end
// the session rather than retry. Apollo Client 4 removed `fromPromise`, so we do
// not attempt an in-link async retry.
const errorLink = onError(({ error, operation }) => {
  if (!error) return;

  // Apollo Client 4 delivers GraphQL errors wrapped in a CombinedGraphQLErrors
  // instance; the individual errors live on `error.errors`. Anything else
  // (ServerError / transport failure) is the network-error branch.
  if (CombinedGraphQLErrors.is(error)) {
    const graphQLErrors = error.errors || [];
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      debug.warn('graphql', `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`, { extensions });
    });

    const operationName = operation.operationName;
    if (
      !AUTH_OPERATION_NAMES.includes(operationName) &&
      graphQLErrors.some(isAuthError)
    ) {
      debug.warn('auth', `Authentication error on "${operationName}", clearing session`);
      clearSessionAndRedirect();
    }
    return;
  }

  debug.error('network', `Network error: ${error.message}`, {
    operation: operation.operationName,
    networkError: error
  });

  // Don't retry if it's a timeout or connection refused
  if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
    debug.warn('network', 'Network connectivity issue detected');
  }
});

// Refresh the access token this many ms before it actually expires, so requests
// never go out with an already-expired token.
const REFRESH_SKEW_MS = 30000;

const authLink = setContext(async (operation, { headers }) => {
  // Only touch localStorage in the browser.
  if (typeof window === 'undefined') {
    return { headers };
  }

  let token = localStorage.getItem('token') || '';

  // Proactively rotate the access token when it is at/near expiry. Skip the auth
  // operations themselves as a defensive guard. (refreshAccessToken() itself runs
  // on the dedicated client in utils/auth.js, not this link.) It is single-flight.
  if (token && !AUTH_OPERATION_NAMES.includes(operation.operationName)) {
    const expiresAt = Number(localStorage.getItem('tokenExpiresAt') || 0);
    if (expiresAt && Date.now() > expiresAt - REFRESH_SKEW_MS) {
      const refreshed = await refreshAccessToken();
      token = refreshed || '';
    }
  }

  return {
    headers: {
      ...headers,
      // RAW token, no 'Bearer ' prefix (matches the backend's extractToken).
      authorization: token ? `${token}` : '',
    },
  };
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        users: {
          merge(_existing, incoming) {
            return incoming;
          }
        },
        machineTemplates: {
          merge(_existing, incoming) {
            return incoming;
          }
        },
        machines: {
          merge(_existing, incoming) {
            return incoming;
          }
        },
        listFilters: {
          merge(_existing, incoming) {
            return incoming;
          }
        },
        getAvailableFirewallTemplates: {
          merge(_existing, incoming) {
            return incoming;
          }
        }
      }
    }
  }
});

// Combine all links
const link = from([
  errorLink,
  retryLink,
  authLink,
  httpLink
]);

// Initialize ApolloClient
const client = new ApolloClient({
  link,
  cache: cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      // Deliberately NOT setting notifyOnNetworkStatusChange: true here. As a
      // GLOBAL default it made every useQuery in the app re-emit loading:true on
      // every background refetch, every pollInterval tick, and every warm-cache
      // mount — which, combined with the ubiquitous `if (loading) return
      // <Skeleton/>` guard, unmounted/remounted whole subtrees on each realtime
      // update (the "parpadea todo el tiempo" flicker). Leaving it at the default
      // (false) keeps rendered content mounted and updates it in place on
      // background refresh. Components that genuinely need the refresh signal opt
      // in PER-QUERY (e.g. useVMRecommendations, VMBackupsTab) and guard it with a
      // first-load-only check, so they are unaffected.
      // Match client.query()'s policy: keep any partial data on a GraphQL error
      // (errorPolicy 'none' — the default — would discard the whole result), so
      // useQuery/watchQuery hooks surface both data and error instead of blanking.
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
  },
  ssrMode: typeof window === 'undefined', // Enable SSR mode when running on server
  devtools: {
    enabled: process.env.NODE_ENV === 'development',
  },
});

// Utility function to clear Apollo cache
export const clearApolloCache = async () => {
  await client.clearStore();
  debug.info('cache', 'Apollo cache cleared');
};

// Utility function to reset Apollo cache (more aggressive)
export const resetApolloCache = async () => {
  await client.resetStore();
  debug.info('cache', 'Apollo cache reset');
};

export default client;
