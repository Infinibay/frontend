// Root vitest configuration for the infinibay frontend.
//
// This config mirrors the tsconfig path aliases so that `@/...`,
// `@components/...`, and the Harbor package aliases resolve identically in tests
// and in the running app. It uses jsdom (already a dependency) so component
// tests have a DOM, and enables `globals: true` because the existing test
// suite (and Jest migrations in general) rely on `describe`/`it`/`expect` as
// globals rather than explicit imports.
//
// The `harbor/` workspace package has its OWN vitest.config.ts and is excluded
// here to avoid double-running its tests.

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Must match tsconfig.compilerOptions.paths exactly.
      '@': r('./src'),
      '@components': r('./src/components'),
      '@infinibay/harbor': r('./harbor/src/components/index.ts'),
      '@infinibay/harbor/theme': r('./harbor/src/lib/theme/index.ts'),
      '@infinibay/harbor/lib/cursor': r('./harbor/src/lib/cursor.tsx'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.js'],
    css: false,
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'dist', '.next', 'harbor'],
  },
});
