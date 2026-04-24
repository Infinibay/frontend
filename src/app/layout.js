'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Montserrat } from 'next/font/google';
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
import { AppShell, ToastProvider as HarborToastProvider } from '@infinibay/harbor';
import { Toaster as SonnerToaster } from 'sonner';
import {
  selectInterfaceSize,
  selectAppSettingsInitialized,
  selectTheme,
} from '@/state/slices/appSettings';
import { RealTimeProvider } from '@/components/RealTimeProvider';
import { SocketNamespaceGuard } from '@/components/SocketNamespaceGuard';
import { isEndUser } from '@/lib/roles';
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

const monst = Montserrat({
  subsets: ['latin'],
  display: 'swap',
});

/**
 * Paths that an end-user (role USER) is allowed to reach directly. Everything
 * else gets kicked back to /workspace. Operator routes aren't meant to be
 * visible to end users, so the guard is both a security signal and UX.
 */
const END_USER_ALLOWED_PREFIXES = ['/workspace', '/profile', '/auth/'];

function isAllowedForEndUser(pathname) {
  if (!pathname || pathname === '/') return true; // home redirects by role
  return END_USER_ALLOWED_PREFIXES.some(
    (p) => pathname === p.replace(/\/$/, '') || pathname.startsWith(p),
  );
}

function AppContent({ children, isAuthenticated }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const interfaceSize = useSelector(selectInterfaceSize);
  const appSettingsInitialized = useSelector(selectAppSettingsInitialized);
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

  // End-user route guard: bounce USERs off operator surfaces.
  React.useEffect(() => {
    if (!isAuthenticated) return;
    if (!isEndUser(user)) return;
    if (isAllowedForEndUser(pathname)) return;
    debug.warn('routing', 'Redirecting end-user away from operator route', { pathname });
    router.replace('/workspace');
  }, [isAuthenticated, user, pathname, router]);

  const handleLogout = React.useCallback(() => {
    debug.info('auth', 'Logout initiated');
    auth.logout();
    window.location.href = '/auth/sign-in';
  }, []);

  if (!isAuthenticated || pathname?.startsWith('/auth/')) {
    return (
      <>
        <BrandingApplier />
        <NavigationProgress />
        <RouteFade>{children}</RouteFade>
      </>
    );
  }

  return (
    <AppShell
      sidebar={<AppSidebar user={sidebarUser} onLogOut={handleLogout} />}
      header={<GlobalHeader />}
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      debug.info('auth', 'Checking authentication status in root layout');
      const isValid = await auth.validateToken();
      debug.log('auth', 'Authentication check result:', isValid);
      setIsAuthenticated(isValid);
    };
    checkAuth();
  }, []);

  React.useEffect(() => {
    debug.success('init', 'Root layout initialized:', { isAuthenticated });
  }, [isAuthenticated]);

  return (
    <html lang="en" style={monst.style} suppressHydrationWarning>
      <head>
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
                        <HarborToastProvider>
                          <InitialDataLoader>
                            <SocketNamespaceGuard>
                              <RealTimeProvider>
                                <AppContent isAuthenticated={isAuthenticated}>
                                  {children}
                                </AppContent>
                              </RealTimeProvider>
                            </SocketNamespaceGuard>
                          </InitialDataLoader>
                          <SonnerToaster
                            theme="dark"
                            position="bottom-right"
                            richColors
                          />
                        </HarborToastProvider>
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
