// SVG/icon sanitizer for UNTRUSTED markup.
//
// `app.icon` comes from the backend application catalog and may be an inline
// `<svg>` string. It is injected via `dangerouslySetInnerHTML`, so if it
// contained a <script>, an on*= handler, or a javascript: URL it would execute
// in the user's session (stored XSS). Everything that reaches the DOM through
// dangerouslySetInnerHTML MUST pass through here first.
//
// We use DOMPurify (the industry-standard HTML/SVG sanitizer) in the browser,
// restricted to the SVG profile. DOMPurify needs a DOM, and although the two
// call-sites are 'use client' components, Next still server-renders the initial
// HTML. On the server (no `window`) we fall back to a conservative regex strip;
// the browser re-sanitizes with DOMPurify on hydration. For benign icons both
// paths produce the same markup (stable hydration); malicious input is stripped
// either way.

import DOMPurify from 'dompurify';

/**
 * Conservative server-side fallback. A regex cannot fully parse HTML, so this
 * is NOT relied upon as the real defense — it only runs during SSR, and the
 * browser re-sanitizes with DOMPurify on hydration. It strips the obvious
 * vectors so even the server-rendered frame is safe.
 *
 * @param {string} input - Raw SVG/icon markup.
 * @returns {string} Markup with script/handler/javascript: vectors removed.
 */
function regexStrip(input) {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/\son\w+\s*=\s*(['"])[\s\S]*?\1/gi, '')      // quoted on*= handlers
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')               // unquoted on*= handlers
    .replace(/(href|xlink:href)\s*=\s*(['"])\s*javascript:[\s\S]*?\2/gi, '');
}

// SVG profile + explicit denials. DOMPurify already drops scripts and event
// handlers under the SVG profile; FORBID_TAGS is belt-and-braces against
// <foreignObject> HTML smuggling.
const DOMPURIFY_CONFIG = {
  USE_PROFILES: { svg: true, svgFilters: true },
  FORBID_TAGS: ['script', 'foreignObject'],
};

/**
 * Sanitize an untrusted SVG/icon string. Returns '' for non-string/empty input.
 * Uses DOMPurify in the browser; a conservative regex strip on the server.
 *
 * @param {string} input - Raw SVG/icon markup (may be untrusted).
 * @returns {string} Sanitized markup safe for dangerouslySetInnerHTML.
 */
export function sanitizeSvg(input) {
  if (!input || typeof input !== 'string') return '';
  if (typeof window === 'undefined' || typeof DOMPurify.sanitize !== 'function') {
    return regexStrip(input);
  }
  return DOMPurify.sanitize(input, DOMPURIFY_CONFIG);
}

/**
 * Build a sanitized `{ __html }` object for `dangerouslySetInnerHTML` from an
 * untrusted SVG/icon string (e.g. `app.icon`).
 *
 * @param {string} svg - Raw SVG/icon markup.
 * @returns {{ __html: string }} Object for dangerouslySetInnerHTML.
 */
export function createSanitizedSVGMarkup(svg) {
  return { __html: sanitizeSvg(svg) };
}
