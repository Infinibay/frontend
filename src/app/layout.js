"use client";
import { useEffect, useState } from 'react';
import { Montserrat } from "next/font/google";
import "../styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { ApolloProvider } from '@apollo/client';
import client from '../apollo-client';
import { usePrefetchData } from '../hooks/usePrefetchData';

const monst = Montserrat({ subsets: ["latin"] });

function AppContent({ children }) {
  const { isLoading, errors } = usePrefetchData();

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  if (errors.length > 0) {
    console.error('Errors while prefetching:', errors);
    // You might want to show an error message to the user here
  }

  return <div>{children}</div>;
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={monst.className}>
        <NextUIProvider>
          <ApolloProvider client={client}>
            <AppContent>{children}</AppContent>
          </ApolloProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
