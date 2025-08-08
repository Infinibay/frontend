import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { CurrentUserDocument, LoginDocument } from '@/gql/hooks';
import { createDebugger } from '@/utils/debug';

// GraphQL API endpoint (use environment variable)
const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:4000/graphql';

// Create Apollo Client instance
const httpLink = createHttpLink({
  uri: API_URL,
});

const authLink = setContext((_, { headers }) => {
  // Only access localStorage in browser environment
  let token = '';
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }

  return {
    headers: {
      ...headers,
      authorization: token || '',
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  ssrMode: typeof window === 'undefined', // Enable SSR mode when running on server
});

// Create debug instance for auth
const debug = createDebugger('frontend:auth');

// Authentication functions
export const auth = {
  login: async (email, password) => {
    try {
      const { data } = (await client.query({
        query: LoginDocument,
        variables: { password, email },
      }));
      debug.success('login', 'Login successful:', { email, hasToken: !!data.login?.token });

      if (data.login && data.login.token) {
        // Only access localStorage in browser environment
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.login.token);
        }
        return data.login.token;
      }
      throw new Error('401'); // Unauthorized
    } catch (error) {
      debug.error('login', 'Login error:', error);
      if (error.message.includes('401') || error.message.includes('403')) {
        throw error; // Re-throw authentication errors
      }
      throw new Error('An unexpected error occurred');
    }
  },
  fetchCurrentUser: async () => {
    const data = (await client.query({
      query: CurrentUserDocument,
    })).data;
    return data.currentUser;
  },

  logout: () => {
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  isLoggedIn: () => {
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  },

  getToken: () => {
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  // Optionally, add a method to check if the token is still valid
  validateToken: async () => {
    const token = auth.getToken();
    if (!token) return false;

    // Here you would typically make a request to your server to validate the token
    // For this example, we'll just check if it exists
    return true;
  }
};

export default auth;
