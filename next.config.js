const path = require('path');

/**
 * Returns the http(s)/ws(s) origin of a URL string, or null if it can't be
 * parsed. Used to build the CSP connect-src allow-list from env-configured
 * backend hosts. Kept as a plain function (no arrow try/catch) for clarity.
 *
 * @param {string} url - A candidate URL string (may be invalid/empty).
 * @returns {string|null} The normalized origin, or null on parse failure.
 */
function safeOrigin (url) {
  try {
    return new URL(url).origin
  } catch {
    return null
  }
}

/**
 * Returns the WebSocket-scheme counterpart of an http(s) origin (http→ws,
 * https→wss), or null. A CSP connect-src entry for `http://host:port` does NOT
 * authorize `ws://host:port`, so Socket.IO — which upgrades to a WS connection on
 * the SAME backend host — is blocked unless the ws(s) origin is listed too.
 *
 * @param {string|null} origin - An origin like `http://192.168.0.8:4000`.
 * @returns {string|null} The ws(s) origin, or null.
 */
function wsOrigin (origin) {
  if (!origin) return null
  if (origin.startsWith('http://')) return 'ws://' + origin.slice(7)
  if (origin.startsWith('https://')) return 'wss://' + origin.slice(8)
  return null
}

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
  /**
   * Security headers applied to every response (`/:path*`). Complements the
   * Edge middleware route gate and the backend's own auth — standard
   * hardening that cheaply defeats clickjacking, MIME-sniffing, and
   * cross-origin leaks. Returns the Next.js `headers()` result.
   *
   * @returns {Promise<Array<{source: string, headers: Array<{key: string, value: string}>}>>}
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Block the app from being embedded in an <iframe> anywhere (defeats
          // clickjacking). The app is never legitimately framed.
          { key: 'X-Frame-Options', value: 'DENY' },
          // Stop browsers from MIME-sniffing a response away from its declared
          // Content-Type (prevents executing an uploaded file as a script).
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Only send the Origin/Referer to same-origin (or none) — limits PII
          // leakage when following external links.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Lock down powerful APIs: none of these are used by the app today,
          // so deny them outright so a future dependency can't quietly enable
          // camera/mic/geolocation without an explicit change here.
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Content Security Policy. Trusted origins the app actually uses:
          //  - rsms.me serves the Inter font CSS (<link> in layout.js head)
          //  - the image CDN hostnames mirrored from remotePatterns (avatars)
          //  - the GraphQL backend, reached via the /api rewrite (same-origin)
          //    or the configured host (connect-src below)
          //
          // HONEST CAVEAT (do not "tidy" this away): script-src and style-src
          // carry 'unsafe-inline' because the app ships an inline theme-bootstrap
          // <script> (layout.js) and Next/Harbor inject runtime <style>/inline
          // style attributes. That weakens XSS protection compared with a
          // nonce-based policy — the durable follow-up is per-request nonces via
          // middleware. We still gain real value here: object-src 'none',
          // frame-ancestors 'none', and a closed allow-list of script/connect
          // origins. 'unsafe-eval' is granted ONLY in dev (HMR / React Refresh).
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              // Belt-and-braces with the X-Frame-Options: DENY header above.
              "frame-ancestors 'none'",
              // Inline theme-bootstrap script + Next runtime scripts need
              // 'unsafe-inline'; dev also needs 'unsafe-eval' for HMR.
              "script-src 'self' 'unsafe-inline'" +
                (process.env.NODE_ENV !== 'production' ? " 'unsafe-eval'" : ''),
              // Runtime injected styles (Next/Harbor) + the Inter font stylesheet.
              "style-src 'self' 'unsafe-inline' https://rsms.me",
              "font-src 'self' https://rsms.me data:",
              // Avatar / icon CDNs (mirror remotePatterns) + inline data/blob URIs
              // used for generated SVGs and previews.
              "img-src 'self' data: blob: https://api.dicebear.com https://cdn.simpleicons.org https://i.pravatar.cc https://www.gravatar.com",
              'connect-src ' + [
                "'self'",
                'http://localhost:4000',
                'https://localhost:4000',
                'ws://localhost:4000',
                'wss://localhost:4000',
                process.env.NEXT_PUBLIC_BACKEND_HOST,
                process.env.NEXT_PUBLIC_BACKEND_HOST
                  ? safeOrigin(process.env.NEXT_PUBLIC_BACKEND_HOST)
                  : null,
                process.env.NEXT_PUBLIC_GRAPHQL_API_URL
                  ? safeOrigin(process.env.NEXT_PUBLIC_GRAPHQL_API_URL)
                  : null,
                // WebSocket (Socket.IO) counterparts of the configured backend
                // origins. Without these a LAN backend host (e.g. 192.168.0.8)
                // authorizes only http:// and the browser blocks the ws:// upgrade.
                wsOrigin(safeOrigin(process.env.NEXT_PUBLIC_BACKEND_HOST)),
                wsOrigin(safeOrigin(process.env.NEXT_PUBLIC_GRAPHQL_API_URL)),
              ].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(' '),
              "manifest-src 'self'",
            ].join('; '),
          },
          // HSTS: once a host has been seen over HTTPS, always use HTTPS for it.
          // Only meaningful when the app is served over HTTPS in production.
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
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
      '@infinibay/harbor/a11y$': path.resolve(__dirname, 'harbor/src/lib/a11y/index.ts'),
      '@infinibay/harbor/lib/cursor$': path.resolve(__dirname, 'harbor/src/lib/cursor.tsx'),
      '@infinibay/harbor/index.css$': path.resolve(__dirname, 'harbor/src/index.css'),
    };
    return config;
  },
};

module.exports = nextConfig;
