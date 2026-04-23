'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAccentColor } from '@/state/slices/appSettings';

/**
 * Converts a hex string like "#fb923c" into the "R G B" triplet that Harbor
 * tokens.css expects for the `--harbor-accent` CSS var.
 */
function hexToRgbTriplet(hex) {
  if (!hex || typeof hex !== 'string') return null;
  const m = hex.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  return `${r} ${g} ${b}`;
}

/**
 * Applies instance-level whitelabel overrides as CSS custom properties on
 * the document root. Reverts to Harbor defaults when the accent color is
 * cleared.
 *
 * Renders nothing — lives inside AppContent so it sees Redux state.
 */
export function BrandingApplier() {
  const accent = useSelector(selectAccentColor);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const triplet = hexToRgbTriplet(accent);
    if (triplet) {
      root.style.setProperty('--harbor-accent', triplet);
    } else {
      root.style.removeProperty('--harbor-accent');
    }
  }, [accent]);

  return null;
}
