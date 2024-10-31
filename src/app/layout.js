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
import Sidebar from "@/components/dashboard/Sidebar";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import auth from '@/utils/auth';
import { Toaster } from 'react-hot-toast';

const monst = Montserrat({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [userSideBar, setUserSidebar] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await auth.validateToken();
      setIsAuthenticated(isValid);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setUserSidebar(false);
      } else {
        setUserSidebar(true);
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [pathname]);

  return (
    <html lang="en">
      <body className={monst.className}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ApolloProvider client={client}>
              <NextUIProvider>
                <InitialDataLoader>
                  <div className="flex">
                    {isAuthenticated && pathname !== '/auth/sign-in' && pathname !== '/auth/sign-up' && (
                      <div
                        className={`h-screen left-0 top-0 max-w-[260px] lg:max-w-[300px] 4xl:max-w-[500px] bottom-0 fixed lg:sticky z-20 transition-all duration-500 ease-out w-full
                        ${userSideBar ? "translate-x-0" : "translate-x-[-310px] "}`}
                      >
                        <Sidebar userSideBar={userSideBar} setUserSidebar={setUserSidebar} />
                      </div>
                    )}
                    <div className={`${isAuthenticated && pathname !== '/auth/sign-in' && pathname !== '/auth/sign-up' ? "ml-auto w-full" : "w-full"}`}>
                      {children}
                    </div>
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