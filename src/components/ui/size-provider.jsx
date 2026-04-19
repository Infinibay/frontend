"use client";

/**
 * Legacy SizeProvider shim.
 *
 * The old app used a tiered interface-size system (sm / md / lg) with
 * tailwind classes like `size-text`, `size-icon`, `size-padding` etc.
 * That entire surface is retired in the Harbor redesign. This file
 * exists only to keep still-unmigrated shadcn components importing
 * `{ useSizeContext, sizeVariants, ... }` from crashing the build
 * while they're rewritten out of existence.
 *
 * Every export here is a no-op that returns sensible defaults.
 */

import React from "react";

const NOOP_CTX = { size: "md", setSize: () => {} };

export function SizeProvider({ children }) {
  return children;
}

export function useSizeContext() {
  return NOOP_CTX;
}

export function useOptionalSizeContext() {
  return NOOP_CTX;
}

export const sizeVariants = new Proxy(
  {},
  {
    get: () =>
      new Proxy(
        {},
        {
          get: () => new Proxy({}, { get: () => "" }),
        }
      ),
  }
);

export function getTypographyClass() {
  return "";
}
export function getGridClasses() {
  return "";
}
export function getLayoutSpacing() {
  return "";
}
