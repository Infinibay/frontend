/**
 * Theme presets — named palettes that set accent / accent2 / accent3 in
 * a single pick. Each one is a tuple of hex strings; Harbor normalises
 * hex → "r g b" triplets automatically.
 *
 * The presets were chosen to cover the most common "brand feel"
 * territories without overlapping: violet/fuchsia (default), sky/blue,
 * emerald, amber, rose, teal, crimson, slate (monochrome-friendly).
 *
 * accent3 is used sparsely (login aurora, rare decorative accents); it
 * is always a hue-adjacent complement so the three colors read as a
 * coherent palette rather than three separate brand colors.
 */

export const THEME_PRESETS = [
  {
    id: 'violet',
    label: 'Violet',
    description: 'Default — electric violet with sky complement',
    accent: '#A855F7',
    accent2: '#38BDF8',
    accent3: '#F472B6',
  },
  {
    id: 'sky',
    label: 'Sky',
    description: 'Cool blue, technical',
    accent: '#38BDF8',
    accent2: '#818CF8',
    accent3: '#34D399',
  },
  {
    id: 'emerald',
    label: 'Emerald',
    description: 'Calm green, clean',
    accent: '#10B981',
    accent2: '#14B8A6',
    accent3: '#84CC16',
  },
  {
    id: 'amber',
    label: 'Amber',
    description: 'Warm, attention-grabbing',
    accent: '#F59E0B',
    accent2: '#FB7185',
    accent3: '#EAB308',
  },
  {
    id: 'rose',
    label: 'Rose',
    description: 'Soft pink, friendly',
    accent: '#F43F5E',
    accent2: '#A855F7',
    accent3: '#FB923C',
  },
  {
    id: 'teal',
    label: 'Teal',
    description: 'Deep cyan, trustworthy',
    accent: '#14B8A6',
    accent2: '#06B6D4',
    accent3: '#22D3EE',
  },
  {
    id: 'crimson',
    label: 'Crimson',
    description: 'Bold red, high-stakes',
    accent: '#DC2626',
    accent2: '#E11D48',
    accent3: '#F97316',
  },
  {
    id: 'slate',
    label: 'Slate',
    description: 'Muted monochrome — lets content shine',
    accent: '#94A3B8',
    accent2: '#64748B',
    accent3: '#A78BFA',
  },
];

export function getPreset(id) {
  return THEME_PRESETS.find((p) => p.id === id) || null;
}

/* ---------- HSL helpers for custom accent derivation ---------- */

function hexToRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex({ r, g, b }) {
  const hex = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`.toUpperCase();
}

function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s, l };
}

function hslToRgb({ h, s, l }) {
  h /= 360;
  if (s === 0) {
    const v = l * 255;
    return { r: v, g: v, b: v };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2rgb = (t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return {
    r: hue2rgb(h + 1 / 3) * 255,
    g: hue2rgb(h) * 255,
    b: hue2rgb(h - 1 / 3) * 255,
  };
}

function rotateHue(hex, deg) {
  const hsl = rgbToHsl(hexToRgb(hex));
  hsl.h = (hsl.h + deg + 360) % 360;
  // Keep saturation/lightness; on very dark or very light accents lift
  // slightly so the companion color reads against dark backgrounds.
  if (hsl.l < 0.35) hsl.l = 0.55;
  if (hsl.s < 0.35) hsl.s = 0.6;
  return rgbToHex(hslToRgb(hsl));
}

/**
 * Given a user-picked accent hex, return a coherent {accent, accent2,
 * accent3} trio. accent2 is shifted +150° (near-complement), accent3 is
 * +30° (analogous). This matches the feel of the curated presets.
 */
export function deriveAccentTrio(accentHex) {
  return {
    accent: accentHex,
    accent2: rotateHue(accentHex, 150),
    accent3: rotateHue(accentHex, 30),
  };
}

export function isValidHex(s) {
  return typeof s === 'string' && /^#([a-f0-9]{3}|[a-f0-9]{6})$/i.test(s);
}
