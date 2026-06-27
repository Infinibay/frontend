// Server-visible session presence cookie.
//
// PROBLEM this solves (part of the production-readiness safety-net work):
// The app stores its JWT access token in `localStorage`, which the Next.js
// Edge middleware CANNOT read (middleware has no DOM/localStorage). That meant
// there was no server-side route gate at all — a direct hit to any protected
// route returned the full client bundle, and only client-side code decided
// whether to redirect to /auth/sign-in.
//
// DESIGN (defense-in-depth, NOT a new security boundary):
// We mirror the presence of an authenticated session into a cookie the
// middleware CAN read. The cookie's VALUE is just `1` (a presence flag); the
// token's public `exp` claim (read from the base64url JWT payload — no secret
// needed) is used only to set the cookie's `max-age` so it expires in lockstep
// with the token. The cookie never carries the token itself. Spoofing it gains
// nothing: the backend's
// `@Can` / authChecker remains the real authorisation boundary (mirroring the
// existing comment in layout.js: "backend still enforces access"), and the
// client layout already renders a bare frame until validateToken() succeeds.
// The gate's only job is to stop serving protected UI to obviously-anonymous
// traffic and to keep deep links from flashing content before the redirect.
//
// LONG-TERM: the durable fix for the XSS-accessible-localStorage issue is to
// move token storage to an httpOnly cookie issued by the backend. This helper
// is intentionally minimal so that migration can replace these few call-sites
// without touching the rest of the codebase.

const SESSION_COOKIE = 'infinibay-session';

/**
 * Decode the `exp` (seconds since epoch) claim from a JWT without verifying
 * its signature. Returns null for malformed/truncated tokens. This is purely
 * public information — a JWT's payload is base64url, not encrypted.
 *
 * Exported for direct unit testing of malformed-input handling.
 * @param {string} token - A JWT access token.
 * @returns {number|null} The `exp` claim (seconds since epoch) or null.
 */
export function readExpFromToken(token) {
  if (typeof token !== 'string' || token.length === 0) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    // atob handles base64; JWT uses base64url, so translate the alphabet.
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(b64));
    const exp = typeof payload?.exp === 'number' ? payload.exp : null;
    return exp;
  } catch {
    return null;
  }
}

/**
 * Common cookie attributes appended to every Set-Cookie string.
 * `samesite=lax` limits cross-site transmission to top-level navigations,
 * mitigating CSRF-style information leakage.
 *
 * Exported for direct unit testing.
 * @returns {string} The `; path=/; samesite=lax` suffix.
 */
export function cookiePath() {
  return '; path=/; samesite=lax';
}

/**
 * Convert a token expiry (seconds since epoch) into a cookie max-age.
 *
 * Adds a small SKEW (60s) grace window so the client-side refresh — which runs
 * ~30s before true expiry — always wins the race against cookie deletion.
 * Returns 0 (cookie deleted) for a missing/zero/already-past expiry.
 *
 * Exported for direct unit testing of boundary cases (past/zero expiry, skew).
 *
 * @param {number|null} expSeconds - Token `exp` claim (seconds since epoch), or null.
 * @returns {number} max-age in seconds (≥ 0).
 */
export function maxAgeFromExp(expSeconds) {
  // Give a small grace window so the client-side refresh (which runs ~30s
  // before true expiry) always wins the race against cookie deletion.
  const SKEW = 60;
  const remaining = expSeconds ? expSeconds * 1000 - Date.now() : 0;
  return Math.max(0, Math.floor((remaining + SKEW * 1000) / 1000));
}

/**
 * Set the session cookie after a successful login or token refresh.
 * Idempotent and safe to call on the server (no-op) or with a missing token.
 */
export function setSessionCookie(token, expSeconds) {
  if (typeof document === 'undefined') return; // browser only
  const exp = expSeconds ?? readExpFromToken(token);
  const maxAge = maxAgeFromExp(exp);
  if (maxAge <= 0) {
    clearSessionCookie();
    return;
  }
  const secure = window.location.protocol === 'https:' ? '; secure' : '';
  document.cookie = `${SESSION_COOKIE}=1; max-age=${maxAge}${cookiePath()}${secure}`;
}

/**
 * Remove the session cookie (logout / token rejected).
 */
export function clearSessionCookie() {
  if (typeof document === 'undefined') return;
  document.cookie = `${SESSION_COOKIE}=; max-age=0${cookiePath()}`;
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
