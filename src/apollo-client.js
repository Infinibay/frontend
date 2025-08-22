import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:4000/graphql',
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
        }
      }
    }
  }
});

// Initialize ApolloClient
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
  ssrMode: typeof window === 'undefined', // Enable SSR mode when running on server
});

// Utility function to clear Apollo cache
export const clearApolloCache = async () => {
  await client.clearStore();
  console.log('Apollo cache cleared');
};

// Utility function to reset Apollo cache (more aggressive)
export const resetApolloCache = async () => {
  await client.resetStore();
  console.log('Apollo cache reset');
};

export default client;
