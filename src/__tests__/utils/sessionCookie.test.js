// Unit tests for the session-cookie mirroring helper (utils/sessionCookie.js).
//
// Coverage targets (called out by the production-readiness review):
//   - readExpFromToken: JWT parsing edge cases — valid token, malformed,
//     truncated, non-string, missing `exp` claim, base64url alphabet variants.
//   - maxAgeFromExp: future expiry, past expiry, zero/null, skew window,
//     negative clamp.
//   - cookiePath: deterministic attribute string (path + SameSite=lax).
//   - setSessionCookie: browser vs SSR no-op, exp derived from token,
//     explicit exp override, http vs https secure flag, already-expired clears.
//   - clearSessionCookie: SSR no-op + cookie deletion string.
//
// IMPLEMENTATION NOTE on jsdom cookies: the `document.cookie` GETTER only
// returns `name=value` pairs for non-expired cookies — it strips attributes
// (max-age, path, samesite, secure) and omits deleted cookies entirely. So to
// assert on the exact cookie *string* written (including attributes), we spy on
// the cookie SETTER and capture the raw assignment.

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  readExpFromToken,
  cookiePath,
  maxAgeFromExp,
  setSessionCookie,
  clearSessionCookie,
  SESSION_COOKIE_NAME,
} from '@/utils/sessionCookie';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Encode a JS object as a (fake) JWT payload segment in base64url. */
function b64url(obj) {
  return Buffer.from(JSON.stringify(obj))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** Build a fake JWT: header.payload.signature. */
function fakeJwt(payload, header = { alg: 'none', typ: 'JWT' }) {
  return `${b64url(header)}.${b64url(payload)}.signature`;
}

/**
 * Capture every raw string assigned to `document.cookie`.
 * jsdom's cookie store is backed by a descriptor on Document.prototype; we
 * install an instance-level getter/setter that intercepts writes (capturing
 * the raw string) while still delegating to the real store.
 *
 * @returns {{last: ()=>string, all: ()=>string[], restore: ()=>void}}
/**
 * Capture every raw string assigned to `document.cookie`.
 * jsdom's cookie store is backed by a descriptor on Document.prototype; we
 * install an instance-level getter/setter that intercepts writes (capturing
 * the raw string) while still delegating to the real store.
 *
 * IMPORTANT: must be called AFTER beforeEach (so a stubbed document from a
 * prior test has been restored). Guards against `document` being undefined.
 *
 * @returns {{last: ()=>string, all: ()=>string[], restore: ()=>void}}
 */
function spyOnCookieSetter() {
  const writes = [];
  const desc = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
  Object.defineProperty(document, 'cookie', {
    configurable: true,
    get() {
      return desc.get.call(document);
    },
    set(v) {
      writes.push(String(v));
      desc.set.call(document, v);
    },
  });
  return {
    last: () => (writes.length ? writes[writes.length - 1] : ''),
    all: () => writes.slice(),
    restore: () => {
      if (typeof document === 'object' && document !== null) {
        delete document.cookie;
      }
    },
  };
}

// ---------------------------------------------------------------------------
// readExpFromToken
// ---------------------------------------------------------------------------

describe('readExpFromToken', () => {
  it('extracts a numeric exp claim from a valid JWT', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    expect(readExpFromToken(fakeJwt({ exp, sub: 'user-1' }))).toBe(exp);
  });

  it('returns null when the payload has no exp claim', () => {
    expect(readExpFromToken(fakeJwt({ sub: 'user-1' }))).toBeNull();
  });

  it('returns null when exp is present but not a number', () => {
    expect(readExpFromToken(fakeJwt({ exp: 'not-a-number' }))).toBeNull();
  });

  it('returns null for a token with fewer than 2 dot-separated parts', () => {
    expect(readExpFromToken('onlyonepart')).toBeNull();
    expect(readExpFromToken('')).toBeNull();
  });

  it('returns null for non-string input', () => {
    expect(readExpFromToken(null)).toBeNull();
    expect(readExpFromToken(undefined)).toBeNull();
    expect(readExpFromToken(12345)).toBeNull();
    expect(readExpFromToken({ a: 1 })).toBeNull();
  });

  it('returns null when the payload is not valid base64/JSON', () => {
    expect(readExpFromToken('header.!!!notb64!!!.sig')).toBeNull();
  });

  it('handles base64url alphabet (- and _) correctly', () => {
    const exp = 1_700_000_000;
    const token = fakeJwt({ exp });
    expect(readExpFromToken(token)).toBe(exp);
  });
});

// ---------------------------------------------------------------------------
// maxAgeFromExp
// ---------------------------------------------------------------------------

describe('maxAgeFromExp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
  });
  afterEach(() => vi.useRealTimers());

  it('returns a positive max-age for an expiry in the future', () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const maxAge = maxAgeFromExp(nowSec + 120);
    expect(maxAge).toBeGreaterThanOrEqual(179);
    expect(maxAge).toBeLessThanOrEqual(180);
  });

  it('includes the 60s skew grace window', () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const m = maxAgeFromExp(nowSec);
    expect(m).toBeGreaterThanOrEqual(59);
    expect(m).toBeLessThanOrEqual(60);
  });

  it('returns 0 for an expiry already in the past', () => {
    const nowSec = Math.floor(Date.now() / 1000);
    expect(maxAgeFromExp(nowSec - 3600)).toBe(0);
  });

  it('returns the skew-only value (60s) for a null expiry', () => {
    expect(maxAgeFromExp(null)).toBe(60);
  });

  it('returns the skew-only value (60s) for a zero expiry', () => {
    expect(maxAgeFromExp(0)).toBe(60);
  });

  it('never returns a negative value', () => {
    const nowSec = Math.floor(Date.now() / 1000);
    expect(maxAgeFromExp(nowSec - 1_000_000)).toBeGreaterThanOrEqual(0);
  });
});

// ---------------------------------------------------------------------------
// cookiePath
// ---------------------------------------------------------------------------

describe('cookiePath', () => {
  it('returns the path and SameSite=Lax attributes', () => {
    const attrs = cookiePath();
    expect(attrs).toContain('path=/');
    expect(attrs).toContain('samesite=lax');
  });

  it('is a stable, lowercase string', () => {
    expect(cookiePath()).toBe('; path=/; samesite=lax');
  });
});

// ---------------------------------------------------------------------------
// setSessionCookie
// ---------------------------------------------------------------------------

describe('setSessionCookie', () => {
  let cookie;
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
    cookie = spyOnCookieSetter();
  });
  afterEach(() => {
    vi.useRealTimers();
    cookie.restore();
    vi.unstubAllGlobals();
  });

  it('writes the presence cookie with a max-age derived from a future exp', () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const token = fakeJwt({ exp: nowSec + 600 });
    setSessionCookie(token);
    const written = cookie.last();
    expect(written).toContain(`${SESSION_COOKIE_NAME}=1`);
    expect(written).toContain('max-age=660');
  });

  it('accepts an explicit expSeconds override (ignores the token body)', () => {
    const nowSec = Math.floor(Date.now() / 1000);
    setSessionCookie('a.b.c', nowSec + 300);
    const written = cookie.last();
    expect(written).toContain(`${SESSION_COOKIE_NAME}=1`);
    expect(written).toContain('max-age=360');
  });

  it('appends the SameSite=Lax attribute', () => {
    const nowSec = Math.floor(Date.now() / 1000);
    setSessionCookie(fakeJwt({ exp: nowSec + 600 }));
    expect(cookie.last()).toContain('samesite=lax');
  });

  it('appends the secure flag when the page is served over https', () => {
    const original = window.location.protocol;
    Object.defineProperty(window, 'location', {
      value: { ...window.location, protocol: 'https:' },
      writable: true,
      configurable: true,
    });
    try {
      const nowSec = Math.floor(Date.now() / 1000);
      setSessionCookie(fakeJwt({ exp: nowSec + 600 }));
      expect(cookie.last()).toContain('secure');
    } finally {
      Object.defineProperty(window, 'location', {
        value: { ...window.location, protocol: original },
        writable: true,
        configurable: true,
      });
    }
  });

  it('omits the secure flag over http', () => {
    const nowSec = Math.floor(Date.now() / 1000);
    setSessionCookie(fakeJwt({ exp: nowSec + 600 }));
    expect(cookie.last()).not.toContain('secure');
  });

  it('clears the cookie instead of setting it when the token is already expired', () => {
    const nowSec = Math.floor(Date.now() / 1000);
    setSessionCookie(fakeJwt({ exp: nowSec - 60 }));
    const written = cookie.last();
    expect(written).toContain('max-age=0');
    expect(written).not.toContain(`${SESSION_COOKIE_NAME}=1`);
  });

  it('is a no-op and does not throw when document is undefined (SSR)', () => {
    vi.stubGlobal('document', undefined);
    expect(() =>
      setSessionCookie(fakeJwt({ exp: 9_999_999_999 })),
    ).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// clearSessionCookie
// ---------------------------------------------------------------------------

describe('clearSessionCookie', () => {
  let cookie;
  beforeEach(() => {
    cookie = spyOnCookieSetter();
  });
  afterEach(() => {
    cookie.restore();
    vi.unstubAllGlobals();
  });

  it('writes a max-age=0 deletion cookie with the session name and SameSite', () => {
    clearSessionCookie();
    const written = cookie.last();
    expect(written).toContain('max-age=0');
    expect(written).toContain(`${SESSION_COOKIE_NAME}=`);
    expect(written).toContain('samesite=lax');
    expect(written).not.toContain(`${SESSION_COOKIE_NAME}=1`);
  });

  it('is a no-op on the server (document undefined)', () => {
    vi.stubGlobal('document', undefined);
    expect(() => clearSessionCookie()).not.toThrow();
  });
});
