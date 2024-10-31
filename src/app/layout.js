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

const monst = Montserrat({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={monst.className}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ApolloProvider client={client}>
              <NextUIProvider>
                <InitialDataLoader>
                  {children}
                </InitialDataLoader>
              </NextUIProvider>
            </ApolloProvider>
          </PersistGate>
        </Provider> 
      </body>
    </html>
  );
}
