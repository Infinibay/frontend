"use client";
import { Montserrat } from "next/font/google";
import "../styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { ApolloProvider } from '@apollo/client';
import client from '../apollo-client';
import { store, persistor } from "@/state/store";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { InitialDataLoader } from '@/components/InitialDataLoader';
import { AppSidebar } from "@/components/ui/navbar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import auth from '@/utils/auth';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { SizeProvider } from "@/components/ui/size-provider";

const monst = Montserrat({ subsets: ["latin"] });

// Separate component to use Redux hooks after Provider is initialized
function AppContent({ children, isAuthenticated }) {
  const pathname = usePathname();
  const user = useSelector((state) => state.auth.user);
  const departments = useSelector((state) => state.departments.items);

  if (!isAuthenticated || pathname === '/auth/sign-in' || pathname === '/auth/sign-up') {
    return <div className="flex-1">{children}</div>;
  }

  return (
      <AppSidebar 
        user={user?.firstName ? {
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`,
        } : null}
        departments={departments || []}
      >
        {children}
      </AppSidebar>
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
    <html lang="en">
      <body className={monst.className}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ApolloProvider client={client}>
              <NextUIProvider>
                <InitialDataLoader>
                  <SizeProvider size="md">
                    <AppContent isAuthenticated={isAuthenticated}>
                      {children}
                    </AppContent>
                  </SizeProvider>
                </InitialDataLoader>
                <Toaster position="top-right" />
              </NextUIProvider>
            </ApolloProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}