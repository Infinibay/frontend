import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { createDebugger } from '@/utils/debug';
import { refreshAccessToken } from '@/utils/auth';

const debug = createDebugger('frontend:utils:apollo-client');

// Create HTTP link with timeout configuration
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:4000/graphql',
  timeout: 30000, // 30 second timeout
  fetchOptions: {
    keepalive: true,
  },
});

// Create retry link for handling network errors
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => {
      // Retry on network errors and server errors (5xx)
      return !!error && (
        error.networkError ||
        (error.graphQLErrors && error.graphQLErrors.some(e => e.extensions?.code >= 500))
      );
    }
  }
});

// Operations that must never trigger a proactive refresh (avoid recursion: the
// refresh mutation goes through this same client/link chain).
const AUTH_OPERATION_NAMES = ['refreshToken', 'login', 'Logout'];

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

const clearSessionAndRedirect = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiresAt');
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
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
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
  }

  if (networkError) {
    debug.error('network', `Network error: ${networkError.message}`, {
      operation: operation.operationName,
      networkError
    });

    // Don't retry if it's a timeout or connection refused
    if (networkError.code === 'NETWORK_ERROR' || networkError.code === 'TIMEOUT') {
      debug.warn('network', 'Network connectivity issue detected');
    }
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
  // operations themselves (the refresh mutation runs through this link too —
  // refreshing here would recurse). refreshAccessToken() is single-flight.
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
      timeout: 30000,
      notifyOnNetworkStatusChange: true,
    },
    query: {
      timeout: 30000,
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
