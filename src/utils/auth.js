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
      refreshToken
      expiresIn
    }
  }
`;

const RefreshDocument = gql`
  mutation refreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
      expiresIn
    }
  }
`;

const LogoutDocument = gql`
  mutation logout {
    logout
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
      avatar
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
      brandName
      themePreset
      accentColor
      accent2Color
      accent3Color
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
      brandName
      themePreset
      accentColor
      accent2Color
      accent3Color
      createdAt
      updatedAt
    }
  }
`;

const FeatureFlagsDocument = gql`
  query featureFlags {
    featureFlags {
      key
      label
      description
      enabled
    }
  }
`;

const SetFeatureFlagDocument = gql`
  mutation setFeatureFlag($key: String!, $enabled: Boolean!) {
    setFeatureFlag(key: $key, enabled: $enabled) {
      key
      label
      description
      enabled
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

// Module-level single-flight promise so concurrent callers share one network refresh
let refreshInFlight = null;

/**
 * Refresh the access token using the stored refresh token.
 * Single-flight: concurrent callers share one in-flight network request.
 * @returns {Promise<string|null>} the new access token, or null if refresh failed/unavailable
 */
export const refreshAccessToken = async () => {
  // Only access localStorage in browser environment
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
  if (!refreshToken) {
    return null;
  }

  // If a refresh is already in flight, share it
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    try {
      const { data } = await client.mutate({
        mutation: RefreshDocument,
        variables: { refreshToken },
      });

      const result = data?.refreshToken;
      if (result && result.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', result.token);
          localStorage.setItem('refreshToken', result.refreshToken);
          localStorage.setItem('tokenExpiresAt', String(Date.now() + (result.expiresIn || 3600) * 1000));
        }
        debug.success('refresh', 'Access token refreshed successfully');
        return result.token;
      }

      // No token returned: treat as failure and clear state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresAt');
      }
      return null;
    } catch (error) {
      debug.error('refresh', 'Token refresh failed:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresAt');
      }
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
};

// Authentication functions
export const auth = {
  login: async (email, password) => {
    try {
      const { data } = await client.mutate({
        mutation: LoginDocument,
        variables: { password, email },
      });
      debug.success('login', 'Login successful:', { email, hasToken: !!data.login?.token });

      if (data.login && data.login.token) {
        // Only access localStorage in browser environment
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.login.token);
          localStorage.setItem('refreshToken', data.login.refreshToken);
          localStorage.setItem('tokenExpiresAt', String(Date.now() + (data.login.expiresIn || 3600) * 1000));
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

  logout: async () => {
    // Best-effort backend logout; ignore any errors so client-side cleanup always runs
    try {
      await client.mutate({
        mutation: LogoutDocument,
      });
    } catch (error) {
      debug.warn('logout', 'Backend logout failed (ignored):', error);
    }

    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiresAt');
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

  // Validate token by fetching current user
  validateToken: async () => {
    const token = auth.getToken();
    if (!token) return false;

    try {
      const { data } = await client.query({
        query: CurrentUserDocument,
        fetchPolicy: 'network-only', // Always fetch from network to validate
      });
      debug.success('validateToken', 'Token is valid, user:', data.currentUser?.email);
      return !!data.currentUser;
    } catch (error) {
      debug.error('validateToken', 'Token validation failed:', error);
      return false;
    }
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
  },

  // Feature Flag functions
  fetchFeatureFlags: async () => {
    try {
      const { data } = await client.query({
        query: FeatureFlagsDocument,
        fetchPolicy: 'network-only',
        errorPolicy: 'all'
      });
      debug.success('fetchFeatureFlags', 'Feature flags fetched successfully');
      return data?.featureFlags || [];
    } catch (error) {
      debug.error('fetchFeatureFlags', 'Failed to fetch feature flags:', error);
      // Return empty array on failure; the Redux slice falls back to defaults
      return [];
    }
  },

  setFeatureFlag: async (key, enabled) => {
    try {
      const { data } = await client.mutate({
        mutation: SetFeatureFlagDocument,
        variables: { key, enabled }
      });
      debug.success('setFeatureFlag', 'Feature flag updated successfully:', { key, enabled });
      return data.setFeatureFlag;
    } catch (error) {
      debug.error('setFeatureFlag', 'Failed to set feature flag:', error);
      throw new Error('Failed to set feature flag');
    }
  }
};

export default auth;
