'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ApolloProvider } from '@apollo/client/react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useSelector } from 'react-redux';
import '../styles/globals.css';
import '@infinibay/harbor/index.css';
import client from '../apollo-client';
import { store, persistor } from '../state/store';
import { createDebugger } from '@/utils/debug';
import { InitialDataLoader } from '@/components/InitialDataLoader';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppBackground } from '@/components/AppBackground';
import auth from '@/utils/auth';
import { CursorProvider } from '@infinibay/harbor/lib/cursor';
import { AppShell } from '@infinibay/harbor';
import { Toaster as SonnerToaster } from 'sonner';
import {
  selectInterfaceSize,
  selectAppSettingsInitialized,
  selectTheme,
} from '@/state/slices/appSettings';
import { RealTimeProvider } from '@/components/RealTimeProvider';
import { SocketNamespaceGuard } from '@/components/SocketNamespaceGuard';
import { isEndUserView } from '@/lib/roles';
import { useMyPermissionsQuery } from '@/gql/hooks';
import { firstAllowedRoute, isPathAllowed } from '@/lib/permissions';
import { createThemeScript } from '@/utils/theme';
import { ThemeProvider, useAppTheme } from '@/contexts/ThemeProvider';
import { HarborThemeBridge } from '@/components/layout/HarborThemeBridge';
import { HelpProvider } from '@/contexts/HelpProvider';
import { HeaderActionProvider } from '@/contexts/HeaderActionContext';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { GlobalCommandPalette } from '@/components/layout/GlobalCommandPalette';
import { BrandingApplier } from '@/components/layout/BrandingApplier';
import { NavigationProgress } from '@/components/layout/NavigationProgress';
import { RouteFade } from '@/components/layout/RouteFade';
import '@/utils/debugInit';
import '@/utils/debugPanelStatus';

const debug = createDebugger('frontend:layout:root');

function AppContent({ children, isAuthenticated, authChecked }) {
  const pathname = usePathname();
  const router = useRouter();
  // Responsive shell: below lg the sidebar collapses into a drawer opened from
  // the header hamburger. State lives here (the shell owner) and is handed to
  // both GlobalHeader (opens it) and AppSidebar (renders + closes it).
  const [navOpen, setNavOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const interfaceSize = useSelector(selectInterfaceSize);
  const appSettingsInitialized = useSelector(selectAppSettingsInitialized);
  const { data: permissionsData, loading: permissionsLoading } = useMyPermissionsQuery({
    skip: !isAuthenticated || pathname?.startsWith('/auth/'),
    fetchPolicy: 'cache-and-network',
  });
  const allowedResources = permissionsData?.myPermissions?.allowedResources;
  // React Compiler auto-memoises pure derivations, so just let it see the
  // shape; AppSidebar is React.memo'd and will skip re-render when the
  // user identity is stable.
  const sidebarUser = user?.firstName
    ? {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      }
    : null;
  React.useEffect(() => {
    debug.info('layout', 'AppContent rendered:', {
      isAuthenticated,
      pathname,
      hasUser: !!user,
      interfaceSize,
      appSettingsInitialized,
    });
  }, [isAuthenticated, pathname, user, interfaceSize, appSettingsInitialized]);

  // Permission route guard: backend still enforces access, this keeps direct
  // URL entry aligned with the operator navigation.
  React.useEffect(() => {
    if (!isAuthenticated) return;
    if (pathname?.startsWith('/auth/')) return;
    if (!allowedResources) return;
    if (isPathAllowed(pathname, allowedResources)) return;

    const fallback = firstAllowedRoute(
      allowedResources,
      isEndUserView(user, allowedResources) ? '/workspace' : '/overview',
    );
    debug.warn('routing', 'Redirecting user away from denied route', { pathname, fallback });
    router.replace(fallback);
  }, [allowedResources, isAuthenticated, pathname, router, user]);

  // Auth gate: send unauthenticated users to sign-in. Covers EVERY route,
  // including those not wrapped in <ProtectedRoute> (e.g. /identity, /policies,
  // /settings). Wait for the async token check to finish (authChecked) so a
  // valid session is never bounced during the initial verification.
  React.useEffect(() => {
    if (!authChecked) return;
    if (isAuthenticated) return;
    if (pathname?.startsWith('/auth/')) return;
    debug.warn('auth', 'Unauthenticated access — redirecting to sign-in', { pathname });
    router.replace('/auth/sign-in');
  }, [authChecked, isAuthenticated, pathname, router]);

  const handleLogout = React.useCallback(() => {
    debug.info('auth', 'Logout initiated');
    auth.logout();
    window.location.href = '/auth/sign-in';
  }, []);

  // Auth pages (sign-in, sign-up, forgot-password, …) render without the app shell.
  if (pathname?.startsWith('/auth/')) {
    return (
      <>
        <BrandingApplier />
        <NavigationProgress />
        <RouteFade>{children}</RouteFade>
      </>
    );
  }

  // Still verifying the session, or unauthenticated and being redirected to
  // sign-in: render a bare frame instead of flashing protected content.
  if (!authChecked || !isAuthenticated) {
    return (
      <>
        <BrandingApplier />
        <NavigationProgress />
      </>
    );
  }

  if (permissionsLoading && !allowedResources) {
    return (
      <>
        <BrandingApplier />
        <NavigationProgress />
      </>
    );
  }

  return (
    <AppShell
      sidebar={
        <AppSidebar
          user={sidebarUser}
          onLogOut={handleLogout}
          mobileOpen={navOpen}
          onMobileClose={() => setNavOpen(false)}
        />
      }
      header={<GlobalHeader onMenuClick={() => setNavOpen(true)} />}
      contentPadding="none"
    >
      <BrandingApplier />
      <NavigationProgress />
      <RouteFade>{children}</RouteFade>
      <GlobalCommandPalette />
    </AppShell>
  );
}

function ThemeApplier({ desiredTheme }) {
  const { theme, setTheme } = useAppTheme();
  useEffect(() => {
    if (desiredTheme && theme !== desiredTheme) {
      setTheme(desiredTheme);
    }
  }, [desiredTheme, theme, setTheme]);
  return null;
}

function ThemeProviderWrapper({ children }) {
  const theme = useSelector(selectTheme);
  const appSettingsInitialized = useSelector(selectAppSettingsInitialized);
  const desired = appSettingsInitialized && theme ? theme : 'system';

  return (
    <ThemeProvider defaultTheme={desired} enableSystem>
      <ThemeApplier desiredTheme={desired} />
      <HarborThemeBridge>{children}</HarborThemeBridge>
    </ThemeProvider>
  );
}

export default function RootLayout({ children }) {
  // null = auth check still in progress; true/false = check completed.
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      debug.info('auth', 'Checking authentication status in root layout');
      const isValid = await auth.validateToken();
      debug.log('auth', 'Authentication check result:', isValid);
      // Drop a stale/invalid token so redux state and the next check stay
      // consistent before AppContent redirects to sign-in.
      if (!isValid && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresAt');
      }
      setIsAuthenticated(isValid);
    };
    checkAuth();
  }, []);

  React.useEffect(() => {
    debug.success('init', 'Root layout initialized:', { isAuthenticated });
  }, [isAuthenticated]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Harbor's design system is built on Inter (tokens.css sets
            --harbor-font-sans: "Inter"). Load it so the type scale, weights
            and metrics match Harbor instead of falling back to a system font
            (which made the whole app look off). rsms.me serves InterVariable;
            swap for a self-hosted copy if this app must run offline. */}
        <link rel="preconnect" href="https://rsms.me" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <script dangerouslySetInnerHTML={{ __html: createThemeScript() }} />
      </head>
      <body>
        <AppBackground />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProviderWrapper>
              <HelpProvider>
                <HeaderActionProvider>
                    <ApolloProvider client={client}>
                      <CursorProvider>
                        <InitialDataLoader>
                          <SocketNamespaceGuard>
                            <RealTimeProvider>
                              <AppContent
                                authChecked={isAuthenticated !== null}
                                isAuthenticated={isAuthenticated === true}
                              >
                                {children}
                              </AppContent>
                            </RealTimeProvider>
                          </SocketNamespaceGuard>
                        </InitialDataLoader>
                        {/* Toasts standardize on Sonner. The harbor ToastProvider
                            is removed; its consumers are migrated by group STATES. */}
                        <SonnerToaster
                          theme="dark"
                          position="bottom-right"
                          richColors
                        />
                      </CursorProvider>
                    </ApolloProvider>
                </HeaderActionProvider>
              </HelpProvider>
            </ThemeProviderWrapper>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
