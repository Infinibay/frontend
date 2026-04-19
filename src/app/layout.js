"use client"

import React, { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Montserrat } from "next/font/google"
import { NextUIProvider } from "@nextui-org/react"
import { ApolloProvider } from "@apollo/client"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { useSelector, useDispatch } from "react-redux"
import "../styles/globals.css"
// Harbor UI library — full CSS (tokens + effect utilities:
// .spotlight, .glow-border, .mesh-bg, .glass, etc.). Must load after
// Tailwind base so `bg-surface`, `text-fg`, `bg-accent-2` resolve to
// harbor vars and Harbor components' cursor-reactive effects render.
import "@infinibay/harbor/index.css"
import client from "../apollo-client"
import { store, persistor } from "../state/store"
import { createDebugger } from "@/utils/debug"
import { InitialDataLoader } from "@/components/InitialDataLoader"
import { AppSidebar } from "@/components/ui/navbar"
import auth from "@/utils/auth"
import { CursorProvider } from "@infinibay/harbor/lib/cursor"
import { ToastProvider as HarborToastProvider } from "@infinibay/harbor"
import { selectInterfaceSize, selectAppSettingsInitialized, selectTheme } from "@/state/slices/appSettings"
import { Toaster } from "@/components/ui/toaster"
import { RealTimeProvider } from "@/components/RealTimeProvider"
import { SocketNamespaceGuard } from "@/components/SocketNamespaceGuard"
import { createThemeScript } from "@/utils/theme"
import { ThemeProvider, useAppTheme } from "@/contexts/ThemeProvider"
import { HelpProvider } from "@/contexts/HelpProvider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { HeaderActionProvider } from "@/contexts/HeaderActionContext"
import { GlobalHeader } from "@/components/layout/GlobalHeader"
import "@/utils/debugInit" // Initialize debug panel
import "@/utils/debugPanelStatus" // Debug panel utilities

const debug = createDebugger('frontend:layout:root')

const monst = Montserrat({
  subsets: ["latin"],
  display: 'swap'
});

/**
 * AppContent component with provider management and authentication logic
 * Handles theme, sizing, real-time updates, and layout state
 */
function AppContent({ children, isAuthenticated }) {
  const dispatch = useDispatch();
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
      appSettingsInitialized
    })
  }, [isAuthenticated, pathname, user, interfaceSize, appSettingsInitialized])

  const handleLogout = () => {
    debug.info('auth', 'Logout initiated')
    auth.clearToken();
    window.location.href = '/auth/sign-in';
  };

  if (!isAuthenticated || pathname?.startsWith('/auth/')) {
    return children;
  }

  return (
    <div className="flex min-h-screen w-full bg-surface text-fg">
      <AppSidebar
        user={user?.firstName ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        } : null}
        onLogOut={handleLogout}
      />
      <main className="flex-1 min-w-0 flex flex-col">
        <GlobalHeader />
        <div className="flex-1 px-6 md:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

// Component to apply theme after provider is initialized
function ThemeApplier({ desiredTheme }) {
  const { theme, setTheme } = useAppTheme();
  useEffect(() => {
    if (desiredTheme && theme !== desiredTheme) {
      setTheme(desiredTheme);
    }
  }, [desiredTheme, theme, setTheme]);
  return null;
}

// Component to handle theme provider with Redux integration
function ThemeProviderWrapper({ children }) {
  const theme = useSelector(selectTheme);
  const appSettingsInitialized = useSelector(selectAppSettingsInitialized);

  // Harbor migration: forced dark-only during the Harbor redesign.
  // Harbor's tokens.css only defines dark values at :root, so mixing light
  // mode with harbor components would break visuals. Once harbor ships
  // light tokens (tracked separately), revert to the commented line below.
  // const currentTheme = (appSettingsInitialized && theme) ? theme : 'system';
  const currentTheme = 'dark';
  // Silence unused-var warnings while we keep the Redux selectors wired.
  void theme; void appSettingsInitialized;

  return (
    <ThemeProvider defaultTheme={currentTheme} enableSystem={false}>
      <ThemeApplier desiredTheme={currentTheme} />
      {children}
    </ThemeProvider>
  );
}


/**
 * RootLayout component that provides the application root structure
 * Includes provider hierarchy, authentication, and theme initialization
 */
export default function RootLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      debug.info('auth', 'Checking authentication status in root layout')
      const isValid = await auth.validateToken();
      debug.log('auth', 'Authentication check result:', isValid)
      setIsAuthenticated(isValid);
    };
    checkAuth();
  }, []);

  React.useEffect(() => {
    debug.success('init', 'Root layout initialized:', { isAuthenticated })
  }, [isAuthenticated])

  return (
    <html lang="en" className={`${monst.className} dark`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: createThemeScript() }} />
      </head>
      <body>
        <div className="app-container w-full flex min-h-screen overflow-hidden">
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ThemeProviderWrapper>
                  <TooltipProvider delayDuration={300}>
                    <HelpProvider>
                      <HeaderActionProvider>
                        <ApolloProvider client={client}>
                          <NextUIProvider className="w-full">
                            <CursorProvider>
                              <HarborToastProvider>
                                <InitialDataLoader className="w-full">
                                  <SocketNamespaceGuard className="w-full">
                                    <RealTimeProvider className="w-full">
                                      <AppContent isAuthenticated={isAuthenticated}>
                                        {children}
                                      </AppContent>
                                    </RealTimeProvider>
                                  </SocketNamespaceGuard>
                                </InitialDataLoader>
                                <Toaster />
                              </HarborToastProvider>
                            </CursorProvider>
                          </NextUIProvider>
                        </ApolloProvider>
                      </HeaderActionProvider>
                    </HelpProvider>
                  </TooltipProvider>
                </ThemeProviderWrapper>
            </PersistGate>
          </Provider>
        </div>
      </body>
    </html>
  );
}

