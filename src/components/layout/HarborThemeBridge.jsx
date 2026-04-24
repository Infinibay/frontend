'use client';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { HarborProvider, defineTheme } from '@infinibay/harbor/theme';
import { useResolvedTheme } from '@/contexts/ThemeProvider';
import {
  selectAccentColor,
  selectAccent2Color,
  selectAccent3Color,
  selectThemePreset,
} from '@/state/slices/appSettings';
import { getPreset, deriveAccentTrio, isValidHex } from '@/lib/themePresets';

/**
 * Resolves the effective accent trio in priority order:
 *   1. explicit accent2/accent3 stored alongside the custom accent
 *   2. preset by id (no custom accent overrides)
 *   3. derived from a single custom accent via HSL rotation
 *   4. Harbor built-in defaults (no override at all)
 */
function resolveTrio({ preset, accent, accent2, accent3 }) {
  if (preset) {
    const p = getPreset(preset);
    if (p) return { accent: p.accent, accent2: p.accent2, accent3: p.accent3 };
  }
  if (isValidHex(accent)) {
    const derived = deriveAccentTrio(accent);
    return {
      accent: derived.accent,
      accent2: isValidHex(accent2) ? accent2 : derived.accent2,
      accent3: isValidHex(accent3) ? accent3 : derived.accent3,
    };
  }
  return null;
}

export function HarborThemeBridge({ children }) {
  const resolved = useResolvedTheme();
  const preset = useSelector(selectThemePreset);
  const accent = useSelector(selectAccentColor);
  const accent2 = useSelector(selectAccent2Color);
  const accent3 = useSelector(selectAccent3Color);

  const trio = useMemo(
    () => resolveTrio({ preset, accent, accent2, accent3 }),
    [preset, accent, accent2, accent3],
  );

  const themes = useMemo(() => {
    if (!trio) return [];
    const colors = {
      accent: trio.accent,
      accent2: trio.accent2,
      accent3: trio.accent3,
    };
    return [
      defineTheme({
        name: 'infinibay-dark',
        label: 'Infinibay Dark',
        colorScheme: 'dark',
        extends: 'harbor-dark',
        tokens: { color: colors },
      }),
      defineTheme({
        name: 'infinibay-light',
        label: 'Infinibay Light',
        colorScheme: 'light',
        extends: 'harbor-light',
        tokens: { color: colors },
      }),
    ];
  }, [trio]);

  const themeName = trio
    ? resolved === 'light' ? 'infinibay-light' : 'infinibay-dark'
    : resolved === 'light' ? 'harbor-light' : 'harbor-dark';

  return (
    <HarborProvider themes={themes} theme={themeName} onThemeChange={() => {}}>
      {children}
    </HarborProvider>
  );
}
