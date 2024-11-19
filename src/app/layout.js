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
import AppSidebar from "@/components/AppSidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import auth from '@/utils/auth';
import { Toaster } from 'react-hot-toast';
import { SidebarProvider } from "@/components/ui/sidebar";

const monst = Montserrat({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

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
                  <div className="flex">
                    <SidebarProvider>
                      {isAuthenticated && pathname !== '/auth/sign-in' && pathname !== '/auth/sign-up' && (
                        <AppSidebar />
                      )}
                      <div className="flex-1">
                        {children}
                      </div>
                    </SidebarProvider>
                  </div>
                </InitialDataLoader>
              </NextUIProvider>
            </ApolloProvider>
          </PersistGate>
          <Toaster position="top-right" />
        </Provider>
      </body>
    </html>
  );
}