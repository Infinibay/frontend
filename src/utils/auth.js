import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createDebugger } from '@/utils/debug';
import { store, persistor } from '@/state/store';
import { setTokens, logout as logoutAction } from '@/state/slices/auth';
import { clearApolloCache } from '@/apollo-client';
import { setSessionCookie, clearSessionCookie } from '@/utils/sessionCookie';

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
      roleId
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

// Real per-request timeout (mirrors the main client): Apollo Client 4 has no
// `timeout` option, so abort via AbortController so a stalled connection can't
// hang refresh/login/validation forever.
const REQUEST_TIMEOUT_MS = 30000;

/**
 * Per-request fetch wrapper that enforces a hard timeout via AbortController.
 *
 * Apollo Client 4 has no `timeout` option, so a stalled connection could hang
 * refresh/login/validation forever. This aborts the request after
 * REQUEST_TIMEOUT_MS. It composes — rather than clobbers — any signal the
 * HttpLink passes (used to cancel on unsubscribe/unmount) with the timeout
 * signal, so both are honoured.
 *
 * @param {RequestInfo|URL} input - The fetch target.
 * @param {RequestInit} [init] - Standard fetch options (may include its own signal).
 * @returns {Promise<Response>} The fetch promise, rejected if the timeout fires.
 */
const fetchWithTimeout = (input, init = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  // Compose, don't clobber: HttpLink passes its own signal to cancel the request
  // on unsubscribe/unmount. Honour both that signal and our timeout signal.
  const signal = init.signal
    ? AbortSignal.any([init.signal, controller.signal])
    : controller.signal;
  return fetch(input, { ...init, signal }).finally(() => {
    clearTimeout(timeoutId);
  });
};

// NOTE: This is a SECOND, dedicated Apollo client (separate cache) used only for
// the auth operations below (login/refresh/logout/currentUser/settings/flags).
// The main UI client lives in src/apollo-client.js; refreshAccessToken() runs on
// THIS client, which is why it carries no errorLink/retryLink.
const httpLink = createHttpLink({
  uri: API_URL,
  fetch: fetchWithTimeout,
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

// NOTE: This is a SECOND, dedicated Apollo client (separate cache) used only for
// the auth operations below (login/refresh/logout/currentUser/settings/flags).
// The main UI client lives in src/apollo-client.js; refreshAccessToken() runs on
// THIS client, which is why it carries no errorLink/retryLink.
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  ssrMode: typeof window === 'undefined', // Enable SSR mode when running on server
});

// Create debug instance for auth
const debug = createDebugger('frontend:auth');

/**
 * Detect an authentication failure across the various Apollo Client 4 error
 * shapes (combined GraphQL errors, link errors, nested causes) plus a
 * message-text fallback. Used to decide whether a silent token refresh is
 * worth attempting before giving up on the session.
 *
 * @param {Object} [error] - An Apollo Client error object.
 * @returns {boolean} true if the error indicates the access token was rejected.
 */
const isUnauthenticatedError = (error) => {
  if (!error) return false;
  const candidates = [
    ...(error.graphQLErrors || []),
    ...(error.errors || []),
    ...(error.cause?.errors || []),
  ];
  if (candidates.some((e) => e?.extensions?.code === 'UNAUTHENTICATED')) {
    return true;
  }
  const message = error.message || '';
  return /unauthenticated|not authenticated|token (has )?(expired|been revoked|is invalid)|invalid token/i.test(message);
};

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
        const expiresAt = Date.now() + (result.expiresIn || 3600) * 1000;
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', result.token);
          localStorage.setItem('refreshToken', result.refreshToken);
          localStorage.setItem('tokenExpiresAt', String(expiresAt));
          // Mirror session presence into a cookie the Edge middleware can read.
          // Passes the computed exp (seconds) directly — no need to re-decode.
          setSessionCookie(result.token, Math.floor(expiresAt / 1000));
        }
        // Keep redux state.auth.token current too — it is the credential the
        // socket connects with, so the change drives RealTimeProvider to
        // re-initialise the socket with the fresh token (instead of dying on
        // the next reconnect with the stale original token).
        try {
          store.dispatch(setTokens({
            token: result.token,
            refreshToken: result.refreshToken,
            expiresIn: expiresAt,
          }));
        } catch (dispatchError) {
          debug.warn('refresh', 'Failed to sync refreshed token into redux (ignored):', dispatchError);
        }
        debug.success('refresh', 'Access token refreshed successfully');
        return result.token;
      }

      // No token returned: treat as failure and clear state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresAt');
        clearSessionCookie();
      }
      return null;
    } catch (error) {
      debug.error('refresh', 'Token refresh failed:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresAt');
        clearSessionCookie();
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
      if (data.login && data.login.token) {
        // Only access localStorage in browser environment
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.login.token);
          localStorage.setItem('refreshToken', data.login.refreshToken);
          localStorage.setItem('tokenExpiresAt', String(Date.now() + (data.login.expiresIn || 3600) * 1000));
          // Mirror session presence into a cookie the Edge middleware can read.
          setSessionCookie(data.login.token, Math.floor((Date.now() + (data.login.expiresIn || 3600) * 1000) / 1000));
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
    // Await the backend logout so the server revokes the token before we tear
    // down the client session. Errors are ignored so cleanup always runs.
    try {
      await client.mutate({
        mutation: LogoutDocument,
      });
    } catch (error) {
      debug.warn('logout', 'Backend logout failed (ignored):', error);
    }

    // Clear raw localStorage credentials (incl. the socket namespace).
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiresAt');
      localStorage.removeItem('socketNamespace');
      // Clear the server-readable session cookie so the Edge middleware
      // route gate immediately treats the session as dead.
      clearSessionCookie();
    }

    // Clear in-memory redux auth state (the reducer also clears the same
    // localStorage keys, idempotently).
    try {
      store.dispatch(logoutAction());
    } catch (error) {
      debug.warn('logout', 'Redux logout dispatch failed (ignored):', error);
    }

    // Purge the persisted redux snapshot so prior-user PII and the dead token
    // don't survive on disk / rehydrate on next load.
    try {
      await persistor.purge();
      await persistor.flush();
    } catch (error) {
      debug.warn('logout', 'persistor purge/flush failed (ignored):', error);
    }

    // Drop both Apollo caches so no prior-user data lingers (the main UI client
    // holds the app data; this client holds currentUser/settings/flags).
    try {
      await clearApolloCache();
    } catch (error) {
      debug.warn('logout', 'Main Apollo cache clear failed (ignored):', error);
    }
    try {
      await client.clearStore();
    } catch (error) {
      debug.warn('logout', 'Auth Apollo cache clear failed (ignored):', error);
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

    // Inner helper that validates the current access token by asking the backend
    // for the current user. Uses network-only fetchPolicy so it never returns a
    // cached value — a stale cache would make an invalid token look valid.
    const runQuery = async () => {
      const { data } = await client.query({
        query: CurrentUserDocument,
        fetchPolicy: 'network-only', // Always fetch from network to validate
      });
      return !!data.currentUser;
    };

    try {
      const valid = await runQuery();
      debug.success('validateToken', 'Token is valid');
      return valid;
    } catch (error) {
      // A merely-expired access token surfaces as UNAUTHENTICATED. Before
      // declaring the session dead (and force-logging the user out on reload),
      // attempt a single silent refresh and retry — so a still-refreshable
      // session survives a page reload.
      if (isUnauthenticatedError(error)) {
        debug.warn('validateToken', 'Token rejected; attempting a single refresh before giving up');
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          try {
            const valid = await runQuery();
            debug.success('validateToken', 'Token refreshed and re-validated');
            return valid;
          } catch (retryError) {
            debug.error('validateToken', 'Validation failed after refresh:', retryError);
            return false;
          }
        }
      }
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
