const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    };
    return config;
  },
};

module.exports = nextConfig;
