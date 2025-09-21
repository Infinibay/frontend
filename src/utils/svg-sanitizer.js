export function createSanitizedSVGMarkup(svg) {
  const safe = sanitizeSvg(svg);
  return { __html: safe };
}

function sanitizeSvg(input) {
  if (!input || typeof input !== 'string') return '';
  let out = input;
  // Remove script tags
  out = out.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  // Remove event handler attributes like onload, onclick, etc.
  out = out.replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, '');
  // Optionally remove javascript: URLs
  out = out.replace(/(xlink:href|href)\s*=\s*(['"])\s*javascript:[^\2]*\2/gi, '');
  // Optionally whitelist only allowed tags/attrs for stricter control (future improvement)
  return out;
}