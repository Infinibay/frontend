"use client";
import { Montserrat } from "next/font/google";
import "../styles/globals.css";
import "../styles/auth.css";
import { NextUIProvider } from "@nextui-org/react";
import { ApolloProvider } from '@apollo/client';
import client from '../apollo-client';
import { store, persistor } from "../state/store";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { InitialDataLoader } from '@/components/InitialDataLoader';
import { AppSidebar } from "@/components/ui/navbar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import auth from '@/utils/auth';
import { Toast, ToastTitle, ToastDescription, ToastProvider, ToastViewport } from '@/components/ui/toast';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { selectInterfaceSize, selectAppSettingsInitialized, selectTheme, selectAppSettings } from '@/state/slices/appSettings';
import { SizeProvider } from "@/components/ui/size-provider";
import { Toaster } from "@/components/ui/toaster";
import { RealTimeProvider } from '@/components/RealTimeProvider';
import { SocketNamespaceGuard } from '@/components/SocketNamespaceGuard';
import { createThemeScript } from '@/utils/theme';
import { ThemeProvider, useAppTheme, useResolvedTheme } from '@/contexts/ThemeProvider';
import { updateWallpaperCSS } from '@/utils/wallpaper';
import '@/utils/debugInit'; // Initialize debug panel
import '@/utils/debugPanelStatus'; // Debug panel utilities

const monst = Montserrat({
  subsets: ["latin"],
  display: 'swap'
});

// Separate component to use Redux hooks after Provider is initialized
function AppContent({ children, isAuthenticated }) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const user = useSelector((state) => state.auth.user);
  const interfaceSize = useSelector(selectInterfaceSize);
  const appSettingsInitialized = useSelector(selectAppSettingsInitialized);
  const [open, setOpen] = useState(false);
  const [toastData, setToastData] = useState({ title: '', description: '', variant: 'default' });

  const handleLogout = () => {
    auth.clearToken();
    window.location.href = '/auth/sign-in';
  };

  if (!isAuthenticated || pathname === '/auth/sign-in' || pathname === '/auth/sign-up') {
    return children;
  }

  const isSettingsPage = pathname?.startsWith('/settings');

  return (
    <>
      <div className={`flex min-h-screen w-full mt-[1rem] ml-[0.5rem] mr-[0.5rem] max-w-full ${isSettingsPage ? 'settings-container' : ''}`}>
        <AppSidebar
          user={user?.firstName ? {
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`,
          } : null}
          onLogOut={handleLogout}
        />
        <main className="flex-1 px-6 md:px-8 main-content relative z-10">
          {children}
        </main>
      </div>
      <ToastProvider>
        <Toast open={open} onOpenChange={setOpen} variant={toastData.variant} className="z-1100">
          <ToastTitle>{toastData.title}</ToastTitle>
          <ToastDescription>{toastData.description}</ToastDescription>
        </Toast>
        <ToastViewport className="z-1100" />
      </ToastProvider>
    </>
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

  // Use fallback theme when settings aren't loaded yet
  const currentTheme = (appSettingsInitialized && theme) ? theme : 'system';

  return (
    <ThemeProvider defaultTheme={currentTheme} enableSystem={true}>
      <ThemeApplier desiredTheme={currentTheme} />
      {children}
    </ThemeProvider>
  );
}

// Component to apply wallpaper from Redux state
function WallpaperApplier({ children }) {
  const appSettings = useSelector(selectAppSettings);
  const initialized = useSelector(selectAppSettingsInitialized);
  const resolvedTheme = useResolvedTheme(); // 'light' | 'dark'

  useEffect(() => {
    if (!initialized) return;

    if (appSettings.wallpaper) {
      const url = `/api/wallpapers/image/${appSettings.wallpaper}`;
      updateWallpaperCSS(url, resolvedTheme);
    } else {
      updateWallpaperCSS('', resolvedTheme);
    }
  }, [initialized, appSettings.wallpaper, resolvedTheme]);

  return children;
}

// Component to handle size provider with Redux integration
function SizeProviderWrapper({ children }) {
  const interfaceSize = useSelector(selectInterfaceSize);
  const appSettingsInitialized = useSelector(selectAppSettingsInitialized);

  // Use fallback size when settings aren't loaded yet
  // Add extra safety checks for hydration
  const currentSize = (appSettingsInitialized && interfaceSize) ? interfaceSize : 'md';

  return (
    <SizeProvider size={currentSize}>
      {children}
    </SizeProvider>
  );
}

export default function RootLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await auth.validateToken();
      setIsAuthenticated(isValid);
    };
    checkAuth();
  }, []);

  return (
    <html lang="en" className={monst.className} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: createThemeScript() }} />
      </head>
      <body>
        <div className="app-container w-full flex min-h-screen overflow-hidden">
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <SizeProviderWrapper>
                <ThemeProviderWrapper>
                  <WallpaperApplier>
                    <ApolloProvider client={client}>
                    <NextUIProvider className="w-full">
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
                    </NextUIProvider>
                    </ApolloProvider>
                  </WallpaperApplier>
                </ThemeProviderWrapper>
              </SizeProviderWrapper>
            </PersistGate>
          </Provider>
        </div>
      </body>
    </html>
  );
}

