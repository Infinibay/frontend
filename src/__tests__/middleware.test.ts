// Unit tests for the Edge route gate (src/middleware.ts).
//
// Coverage targets (called out by the production-readiness review):
//   - isPublicRoute: /auth/* prefix pass-through, explicit PUBLIC_ROUTES match,
//     nested public routes, and protected routes returning false.
//   - middleware: public-route passthrough (next), Next internals/static assets
//     passthrough, protected route WITH session cookie (next), protected route
//     WITHOUT cookie (redirect to /auth/sign-in), spoofed/wrong cookie value
//     (still redirected), and that the redirect target is exactly /auth/sign-in
//     with no query string.
//
// APPROACH: we import the real middleware + isPublicRoute and construct real
// `NextRequest` objects from `next/server` (which is runnable under Node in the
// test environment). We then assert on the returned `NextResponse`:
//   - NextResponse.next()  → status 200, no `location` header.
//   - NextResponse.redirect(url) → status 307, `location` header set to the URL.
// This avoids fragile mocking and exercises the actual route-matching logic.

import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware, isPublicRoute } from '@/middleware';

/** Build a NextRequest aimed at `pathname` with optional cookie state. */
function buildRequest(pathname: string, cookie?: string) {
  const url = `http://localhost${pathname}`;
  const headers: Record<string, string> = {};
  if (cookie !== undefined) headers.cookie = cookie;
  return new NextRequest(url, { headers });
}

// ---------------------------------------------------------------------------
// isPublicRoute
// ---------------------------------------------------------------------------

describe('isPublicRoute', () => {
  it('returns true for all explicit PUBLIC_ROUTES', () => {
    expect(isPublicRoute('/auth/sign-in')).toBe(true);
    expect(isPublicRoute('/auth/sign-up')).toBe(true);
    expect(isPublicRoute('/auth/forgot-password')).toBe(true);
    expect(isPublicRoute('/auth/create-new-password')).toBe(true);
    expect(isPublicRoute('/auth/email-verification')).toBe(true);
    expect(isPublicRoute('/auth/admin')).toBe(true);
  });

  it('returns true for any nested path under /auth/ (future auth screens)', () => {
    expect(isPublicRoute('/auth/some-new-screen')).toBe(true);
    expect(isPublicRoute('/auth/sign-in/sub-step')).toBe(true);
    expect(isPublicRoute('/auth/admin/setup')).toBe(true);
  });

  it('returns false for protected app routes', () => {
    expect(isPublicRoute('/')).toBe(false);
    expect(isPublicRoute('/desktops')).toBe(false);
    expect(isPublicRoute('/dashboard')).toBe(false);
    expect(isPublicRoute('/admin/users')).toBe(false);
  });

  it('returns false for bare /auth (no trailing path segment)', () => {
    // /auth without a trailing slash does not match the /auth/ prefix and is
    // not in the explicit list — treated as protected. (In practice the app
    // router serves /auth → /auth/sign-in, but the gate is conservative.)
    expect(isPublicRoute('/auth')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// middleware — public routes
// ---------------------------------------------------------------------------

describe('middleware — public routes', () => {
  it('passes through to /auth/sign-in (no cookie needed)', () => {
    const res = middleware(buildRequest('/auth/sign-in'));
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  it('passes through to nested /auth/* paths', () => {
    const res = middleware(buildRequest('/auth/email-verification/confirm'));
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// middleware — Next.js internals & static assets
// ---------------------------------------------------------------------------

describe('middleware — internals & static assets', () => {
  it('passes through /_next/* requests', () => {
    const res = middleware(buildRequest('/_next/static/chunk.js'));
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  it('passes through /api/* requests', () => {
    const res = middleware(buildRequest('/api/graphql'));
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  it('passes through /favicon.ico', () => {
    const res = middleware(buildRequest('/favicon.ico'));
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// middleware — protected routes
// ---------------------------------------------------------------------------

describe('middleware — protected routes', () => {
  it('passes through when a valid session presence cookie is set', () => {
    const res = middleware(
      buildRequest('/desktops', 'infinibay-session=1'),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  it('redirects an anonymous visitor (no cookie) to /auth/sign-in', () => {
    const res = middleware(buildRequest('/desktops'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/auth/sign-in');
  });

  it('redirects when the cookie is present but not the value "1" (spoofed)', () => {
    // The gate checks value === '1', not just presence. A fake cookie that
    // doesn't match the expected value is treated as anonymous.
    const res = middleware(
      buildRequest('/desktops', 'infinibay-session=bogus'),
    );
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/auth/sign-in');
  });

  it('redirects when an unrelated cookie is present but the session cookie is absent', () => {
    const res = middleware(buildRequest('/desktops', 'other-cookie=abc'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/auth/sign-in');
  });

  it('redirects the root path for an anonymous visitor', () => {
    const res = middleware(buildRequest('/'));
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/auth/sign-in');
  });

  it('does not carry a query string into the redirect target', () => {
    const res = middleware(buildRequest('/desktops?foo=bar'));
    // search is cleared — no ?foo=bar appended to sign-in.
    expect(res.headers.get('location')).toBe('http://localhost/auth/sign-in');
  });

  it('sets x-middleware-cache: no-cache on the redirect', () => {
    const res = middleware(buildRequest('/desktops'));
    expect(res.headers.get('x-middleware-cache')).toBe('no-cache');
  });
});
