import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { createDebugger } from '@/utils/debug';

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

// Error link for logging and handling errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      debug.warn('graphql', `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`, { extensions });
    });
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

const authLink = setContext((_, { headers }) => {
  // Only access localStorage when in browser environment
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }
  
  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : "",
    }
  }
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
  connectToDevTools: process.env.NODE_ENV === 'development',
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
