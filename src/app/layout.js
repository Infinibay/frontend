'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ApolloProvider, useQuery } from '@apollo/client/react';
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
import { SETUP_STATUS } from '@/lib/setupOps';
import { createThemeScript } from '@/utils/theme';
import { ThemeProvider, useAppTheme, useResolvedTheme } from '@/contexts/ThemeProvider';
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

  // First-run setup gate. Public query (works pre-login). While setup is OPEN,
  // every route funnels to /setup; once completed, /setup bounces back to the app.
  const { data: setupStatusData } = useQuery(SETUP_STATUS, { fetchPolicy: 'cache-and-network' });
  const setupOpen = setupStatusData?.setupStatus?.completed === false;
  React.useEffect(() => {
    const s = setupStatusData?.setupStatus;
    if (s == null) return;
    if (!s.completed) {
      if (pathname !== '/setup' && !pathname?.startsWith('/auth/')) router.replace('/setup');
    } else if (pathname === '/setup') {
      router.replace('/');
    }
  }, [setupStatusData, pathname, router]);
  // Memoise on the user object so AppSidebar's React.memo actually holds: without this the
  // literal would be a fresh object every layout render, defeating the memo and re-rendering
  // the sidebar on every unrelated layout state change. `user` (from Redux) only changes
  // identity when the account/profile changes, so this recomputes exactly when it should.
  const sidebarUser = React.useMemo(
    () =>
      user?.firstName
        ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          }
        : null,
    [user],
  );
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
    if (setupOpen || pathname === '/setup') return;
    if (pathname?.startsWith('/auth/')) return;
    if (!allowedResources) return;
    if (isPathAllowed(pathname, allowedResources)) return;

    const fallback = firstAllowedRoute(
      allowedResources,
      isEndUserView(user, allowedResources) ? '/workspace' : '/overview',
    );
    debug.warn('routing', 'Redirecting user away from denied route', { pathname, fallback });
    router.replace(fallback);
  }, [allowedResources, isAuthenticated, pathname, router, user, setupOpen]);

  // Auth gate: send unauthenticated users to sign-in. This is the SINGLE
  // redirect for unauthenticated access and covers EVERY route (e.g. /identity,
  // /policies, /settings). Wait for the async token check to finish
  // (authChecked) so a valid session is never bounced during initial verification.
  React.useEffect(() => {
    if (!authChecked) return;
    if (isAuthenticated) return;
    // /setup is reachable pre-login (it signs the admin in itself); and while setup
    // is open the setup gate above owns routing, so don't bounce to sign-in here.
    if (pathname === '/setup' || setupOpen) return;
    if (pathname?.startsWith('/auth/')) return;
    debug.warn('auth', 'Unauthenticated access — redirecting to sign-in', { pathname });
    router.replace('/auth/sign-in');
  }, [authChecked, isAuthenticated, pathname, router, setupOpen]);

  const handleLogout = React.useCallback(() => {
    debug.info('auth', 'Logout initiated');
    auth.logout();
    window.location.href = '/auth/sign-in';
  }, []);

  // Auth pages (sign-in, forgot-password, …) and the first-run /setup flow render
  // without the app shell (chrome-free, reachable pre-login).
  if (pathname?.startsWith('/auth/') || pathname === '/setup') {
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

// Toasts follow the app theme instead of being hardcoded. Defined here so it
// renders as a descendant of ThemeProviderWrapper and can read the resolved
// 'light'/'dark' theme via context (the old theme="dark" ignored light mode).
function ThemedToaster() {
  const resolvedTheme = useResolvedTheme();
  return (
    <SonnerToaster
      theme={resolvedTheme}
      position="bottom-right"
      richColors
    />
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
        {/* Default document title so browser tabs show the product name
            instead of the bare URL. This is a client component ('use client'),
            so it cannot export Next.js metadata; a static <title> in <head> is
            the honest stopgap. Individual pages may still override it. */}
        <title>Infinibay</title>
        <meta name="description" content="Infinibay virtualization management console" />
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
                        <ThemedToaster />
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
