const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow an alternate build dir via env (e.g. when a prior root-owned
  // `.next` from a container build blocks a local rebuild). Defaults to `.next`.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  // Origins allowed to reach dev-server resources (HMR/WebSocket). localhost +
  // 127.0.0.1 cover local and Docker-published access; add LAN device IPs as
  // needed, or via NEXT_ALLOWED_DEV_ORIGINS (comma-separated).
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '192.168.0.199',
    ...(process.env.NEXT_ALLOWED_DEV_ORIGINS
      ? process.env.NEXT_ALLOWED_DEV_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
      : []),
  ],
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_BACKEND_HOST: process.env.NEXT_PUBLIC_BACKEND_HOST,
    NEXT_PUBLIC_GRAPHQL_API_URL: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "www.gravatar.com" },
    ],
  },
  transpilePackages: [
    "@nextui-org/react",
    "@nextui-org/theme",
    "@nextui-org/system",
    "@nextui-org/shared-utils",
    "@infinibay/harbor"
  ],
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Empty turbopack config silences the Next 16 warning when migrating from
  // a legacy webpack config. Turbopack is used by default for dev+build.
  turbopack: {
    resolveAlias: {
      '@components': './src/components',
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_HOST || 'http://localhost:4000'}/api/:path*`,
      },
    ];
  },
  // Kept for legacy fallbacks; the Turbopack-equivalent is in `turbopack` above.
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, 'src/components'),
      // Harbor 0.3.x ships an `exports` map that prefers its built `./dist`
      // output (which isn't present — the package can't build standalone
      // outside its own monorepo). Pin the specifiers the app actually uses
      // back to Harbor's source (the `source` export condition), which is how
      // this app has always consumed it: SWC transpiles it via
      // `transpilePackages` and Tailwind scans `../harbor/src`. The trailing
      // `$` makes each alias an exact match so the root one doesn't shadow the
      // subpaths.
      '@infinibay/harbor$': path.resolve(__dirname, 'harbor/src/components/index.ts'),
      '@infinibay/harbor/theme$': path.resolve(__dirname, 'harbor/src/lib/theme/index.ts'),
      '@infinibay/harbor/lib/cursor$': path.resolve(__dirname, 'harbor/src/lib/cursor.tsx'),
      '@infinibay/harbor/index.css$': path.resolve(__dirname, 'harbor/src/index.css'),
    };
    return config;
  },
};

module.exports = nextConfig;
