import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createDebugger } from '@/utils/debug';

// Define GraphQL documents
const LoginDocument = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        email
        firstName
        lastName
        role
      }
      token
    }
  }
`;

const CurrentUserDocument = gql`
  query currentUser {
    currentUser {
      id
      email
      firstName
      lastName
      role
    }
  }
`;

const GetAppSettingsDocument = gql`
  query getAppSettings {
    getAppSettings {
      id
      theme
      wallpaper
      logoUrl
      interfaceSize
      createdAt
      updatedAt
    }
  }
`;

const UpdateAppSettingsDocument = gql`
  mutation updateAppSettings($input: AppSettingsInput!) {
    updateAppSettings(input: $input) {
      id
      theme
      wallpaper
      logoUrl
      interfaceSize
      createdAt
      updatedAt
    }
  }
`;

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
  },

  // App Settings functions
  fetchAppSettings: async () => {
    try {
      const { data } = await client.query({
        query: GetAppSettingsDocument,
        errorPolicy: 'all'
      });
      debug.success('fetchAppSettings', 'App settings fetched successfully');
      return data?.getAppSettings || {};
    } catch (error) {
      debug.error('fetchAppSettings', 'Failed to fetch app settings:', error);
      // Return empty object if settings don't exist or error occurs
      // The Redux slice will handle this gracefully with defaults
      return {};
    }
  },

  updateAppSettings: async (input) => {
    try {
      const { data } = await client.mutate({
        mutation: UpdateAppSettingsDocument,
        variables: { input }
      });
      debug.success('updateAppSettings', 'App settings updated successfully:', input);
      return data.updateAppSettings;
    } catch (error) {
      debug.error('updateAppSettings', 'Failed to update app settings:', error);
      throw new Error('Failed to update app settings');
    }
  }
};

export default auth;
