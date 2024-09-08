"use client";
import { useEffect, useState } from 'react';
import { Montserrat } from "next/font/google";
import "../styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { ApolloProvider } from '@apollo/client';
import client from '../apollo-client'; // Updated import

const monst = Montserrat({ subsets: ["latin"] });

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={monst.className}>
        <NextUIProvider>
          <ApolloProvider client={client}>
            <div>{children}</div>
          </ApolloProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
