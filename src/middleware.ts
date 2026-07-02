import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Edge middleware: server-side route gate (defense-in-depth).
//
// ROLE & BOUNDARY (read before "tightening" this):
// The real authorisation boundary is the backend — every GraphQL resolver is
// guarded by @Can / the authChecker, and the client layout additionally hides
// protected UI until validateToken() passes. This middleware adds a SECOND,
// cheaper layer: it stops the server from ever serving a protected route's
// bundle/HTML to an obviously-anonymous visitor, and it prevents deep links
// from briefly flashing protected content before the client redirect fires.
//
// It deliberately does NOT verify the JWT signature (no secret on the Edge and
// no need — bypassing it only shows the already-gated client shell). The
// `infinibay-session` presence cookie (set/cleared from utils/auth.js) is the
// signal. Public routes (auth flows, the root redirect, static assets) are
// always allowed.
//
// If you later migrate tokens to an httpOnly cookie issued by the backend,
// replace `SESSION_COOKIE` reads with a real signature check here and drop the
// client-synced presence cookie.

const SESSION_COOKIE = 'infinibay-session';

// Routes that do not require an authenticated session.
//
// NOTE: everything under `/auth/*` is already treated as public by
// `isPublicRoute` (the prefix short-circuit below), so this explicit list only
// needs the live auth screens for documentation. Self-service sign-up /
// password-recovery flows were removed (no secure backend existed — accounts
// are administrator-managed), leaving only sign-in and the informational
// forgot-password page.
const PUBLIC_ROUTES = [
  '/auth/sign-in',
  '/auth/forgot-password',
];

/**
 * Determine whether a pathname may be served to an anonymous visitor.
 * Covers everything under `/auth/*` plus the explicit PUBLIC_ROUTES list
 * (exact match or nested). Next.js internals and static assets are handled
 * separately in `middleware()`.
 *
 * @param {string} pathname - The request pathname (no query string).
 * @returns {boolean} true if the route is public and skips the session gate.
 */
export function isPublicRoute(pathname: string): boolean {
  // Anything under /auth/* is public (covers the explicit list + future auth
  // screens). Next.js internal + static assets are always allowed.
  if (pathname.startsWith('/auth/')) return true;
  return PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

/**
 * Edge middleware gate (defense-in-depth, NOT the authorisation boundary).
 *
 * Public routes pass through. For all other routes, it checks for the PRESENCE
 * of the `infinibay-session` cookie (value `1`) — it does NOT verify the JWT
 * signature (no secret on the Edge and no need: spoofing the cookie only reveals
 * the already-gated client shell; the backend resolvers remain the real
 * authorisation check). An anonymous visitor (no cookie) is redirected to
 * `/auth/sign-in`.
 *
 * @param {NextRequest} request - The incoming edge request.
 * @returns {NextResponse} Either a passthrough (NextResponse.next) or a redirect.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Never gate Next.js internals or static files. (The matcher below already
  // excludes most, but this is a cheap belt-and-braces guard for edge cases
  // like trailing-slash variants.)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // PRESENCE CHECK ONLY (intentional, not a flaw): we verify the cookie exists
  // and equals '1', but we do NOT validate the JWT signature here. Bypassing
  // this gate only reveals the already-gated client shell — the backend resolvers
  // remain the real authorisation boundary. See the file header for the full
  // rationale. If tokens move to a backend-issued httpOnly cookie, replace this
  // with a real signature check and drop the client-synced presence cookie.
  const hasSession = request.cookies.get(SESSION_COOKIE)?.value === '1';

  if (!hasSession) {
    // Redirect to the sign-in page. We do NOT append a `?redirect=` param:
    // the sign-in flow always navigates to /desktops after a successful login
    // (hardcoded in auth.js loginUser, by design — see sign-in/page.jsx for the
    // token-revalidation race-condition rationale). Adding a redirect param
    // here would be dead, untested code.
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = '/auth/sign-in';
    signInUrl.search = '';
    const res = NextResponse.redirect(signInUrl);
    res.headers.set('x-middleware-cache', 'no-cache');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything EXCEPT Next internals, the API proxy, and static assets
  // (images live under /_next/static or the remotePatterns config). Keeping the
  // matcher tight avoids paying middleware cost on asset requests.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
