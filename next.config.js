const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BACKEND_HOST: process.env.NEXT_PUBLIC_BACKEND_HOST,
    NEXT_PUBLIC_GRAPHQL_API_URL: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
  },
  images: {
    domains: ["i.pravatar.cc", "api.dicebear.com", "cdn.simpleicons.org"],
  },
  transpilePackages: [
    "@nextui-org/react",
    "@nextui-org/theme",
    "@nextui-org/system",
    "@nextui-org/shared-utils"
  ],
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@components': path.resolve(__dirname, 'src/components'),
    };
    return config;
  },
};

module.exports = nextConfig;
