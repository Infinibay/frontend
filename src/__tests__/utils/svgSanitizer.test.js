// Tests for the untrusted-SVG sanitizer. Under vitest's jsdom environment
// `window` exists, so these exercise the real DOMPurify path (not the SSR
// regex fallback) — i.e. exactly what runs in the browser.

import { sanitizeSvg, createSanitizedSVGMarkup } from '@/utils/svg-sanitizer';

describe('sanitizeSvg', () => {
  it('returns an empty string for non-string / empty input', () => {
    expect(sanitizeSvg(null)).toBe('');
    expect(sanitizeSvg(undefined)).toBe('');
    expect(sanitizeSvg('')).toBe('');
    expect(sanitizeSvg(42)).toBe('');
  });

  it('strips <script> tags', () => {
    const out = sanitizeSvg('<svg><script>alert(1)</script><circle r="5"/></svg>');
    expect(out).not.toMatch(/<script/i);
    expect(out).toContain('circle');
  });

  it('strips inline event handlers (onload/onerror)', () => {
    const out = sanitizeSvg('<svg onload="alert(1)"><image href="x" onerror="alert(2)"/></svg>');
    expect(out).not.toMatch(/onload/i);
    expect(out).not.toMatch(/onerror/i);
  });

  it('strips foreignObject (HTML smuggling vector)', () => {
    const out = sanitizeSvg('<svg><foreignObject><img src=x onerror="alert(1)"></foreignObject></svg>');
    expect(out).not.toMatch(/foreignObject/i);
    expect(out).not.toMatch(/onerror/i);
  });

  it('drops javascript: URLs in href', () => {
    const out = sanitizeSvg('<svg><a href="javascript:alert(1)"><circle r="5"/></a></svg>');
    expect(out).not.toMatch(/javascript:/i);
  });

  it('preserves benign SVG markup', () => {
    const out = sanitizeSvg('<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/></svg>');
    expect(out).toContain('path');
    expect(out).toContain('M4 4h16v16H4z');
  });
});

describe('createSanitizedSVGMarkup', () => {
  it('returns a { __html } object with sanitized content', () => {
    const markup = createSanitizedSVGMarkup('<svg><script>alert(1)</script><rect/></svg>');
    expect(markup).toHaveProperty('__html');
    expect(markup.__html).not.toMatch(/<script/i);
    expect(markup.__html).toContain('rect');
  });

  it('yields { __html: "" } for invalid input', () => {
    expect(createSanitizedSVGMarkup(null)).toEqual({ __html: '' });
  });
});
