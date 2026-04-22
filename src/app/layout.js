'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
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
import { createThemeScript } from '@/utils/theme';
import { ThemeProvider, useAppTheme } from '@/contexts/ThemeProvider';
import { HelpProvider } from '@/contexts/HelpProvider';
import { HeaderActionProvider } from '@/contexts/HeaderActionContext';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { GlobalCommandPalette } from '@/components/layout/GlobalCommandPalette';
import '@/utils/debugInit';
import '@/utils/debugPanelStatus';

const debug = createDebugger('frontend:layout:root');

const monst = Montserrat({
  subsets: ['latin'],
  display: 'swap',
});

function AppContent({ children, isAuthenticated }) {
  const pathname = usePathname();
  const user = useSelector((state) => state.auth.user);
  const interfaceSize = useSelector(selectInterfaceSize);
  const appSettingsInitialized = useSelector(selectAppSettingsInitialized);
  React.useEffect(() => {
    debug.info('layout', 'AppContent rendered:', {
      isAuthenticated,
      pathname,
      hasUser: !!user,
      interfaceSize,
      appSettingsInitialized,
    });
  }, [isAuthenticated, pathname, user, interfaceSize, appSettingsInitialized]);

  const handleLogout = () => {
    debug.info('auth', 'Logout initiated');
    auth.clearToken();
    window.location.href = '/auth/sign-in';
  };

  if (!isAuthenticated || pathname?.startsWith('/auth/')) {
    return children;
  }

  return (
    <AppShell
      sidebar={
        <AppSidebar
          user={
            user?.firstName
              ? {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  role: user.role,
                  avatar: user.avatar,
                }
              : null
          }
          onLogOut={handleLogout}
        />
      }
      header={<GlobalHeader />}
      contentPadding="none"
    >
      {children}
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
  const currentTheme = 'dark';
  void theme;
  void appSettingsInitialized;

  return (
    <ThemeProvider defaultTheme={currentTheme} enableSystem={false}>
      <ThemeApplier desiredTheme={currentTheme} />
      {children}
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
