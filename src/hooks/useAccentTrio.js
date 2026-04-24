'use client';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  selectAccentColor,
  selectAccent2Color,
  selectAccent3Color,
  selectThemePreset,
} from '@/state/slices/appSettings';
import { getPreset, deriveAccentTrio, isValidHex } from '@/lib/themePresets';

const HARBOR_DEFAULT = {
  accent: '#A855F7',
  accent2: '#38BDF8',
  accent3: '#F472B6',
};

/**
 * The effective {accent, accent2, accent3} trio for the current user.
 * Mirrors HarborThemeBridge's resolution rules so any surface that needs
 * the actual hex values (Aurora at sign-in, charts, SVGs) stays in sync
 * with whatever the theme is serving.
 */
export function useAccentTrio() {
  const preset = useSelector(selectThemePreset);
  const accent = useSelector(selectAccentColor);
  const accent2 = useSelector(selectAccent2Color);
  const accent3 = useSelector(selectAccent3Color);

  return useMemo(() => {
    if (preset) {
      const p = getPreset(preset);
      if (p) return { accent: p.accent, accent2: p.accent2, accent3: p.accent3 };
    }
    if (isValidHex(accent)) {
      const d = deriveAccentTrio(accent);
      return {
        accent: d.accent,
        accent2: isValidHex(accent2) ? accent2 : d.accent2,
        accent3: isValidHex(accent3) ? accent3 : d.accent3,
      };
    }
    return HARBOR_DEFAULT;
  }, [preset, accent, accent2, accent3]);
}
