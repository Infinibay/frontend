'use client';

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sun, Moon, Monitor, Rows3, Rows2 } from 'lucide-react';
import { IconButton } from '@infinibay/harbor';

import { useAppTheme } from '@/contexts/ThemeProvider';
import {
  selectInterfaceSize,
  setSizePreference,
} from '@/state/slices/appSettings';

const THEME_CYCLE = ['system', 'light', 'dark'];

function themeIcon(theme) {
  if (theme === 'light') return <Sun size={14} />;
  if (theme === 'dark') return <Moon size={14} />;
  return <Monitor size={14} />;
}

function nextTheme(current) {
  const idx = THEME_CYCLE.indexOf(current);
  return THEME_CYCLE[(idx + 1) % THEME_CYCLE.length] ?? 'system';
}

/**
 * Global topbar quick-access controls: density + theme.
 * Full settings (including lg/xl density) live in /settings.
 */
export function TopbarControls() {
  const dispatch = useDispatch();
  const interfaceSize = useSelector(selectInterfaceSize);
  const { theme, setTheme } = useAppTheme();

  // Binary density for topbar: sm = compact, md = comfortable.
  // Advanced sizes (lg, xl) only changeable via Settings.
  const isCompact = interfaceSize === 'sm';
  const toggleDensity = useCallback(() => {
    dispatch(setSizePreference(isCompact ? 'md' : 'sm'));
  }, [dispatch, isCompact]);

  const cycleTheme = useCallback(() => {
    setTheme(nextTheme(theme));
  }, [theme, setTheme]);

  const densityLabel = isCompact
    ? 'Switch to comfortable density'
    : 'Switch to compact density';
  const themeLabel = `Theme: ${theme}. Click to cycle.`;

  return (
    <>
      <IconButton
        variant="ghost"
        size="sm"
        label={densityLabel}
        title={densityLabel}
        icon={isCompact ? <Rows3 size={14} /> : <Rows2 size={14} />}
        onClick={toggleDensity}
      />
      <IconButton
        variant="ghost"
        size="sm"
        label={themeLabel}
        title={themeLabel}
        icon={themeIcon(theme)}
        onClick={cycleTheme}
      />
    </>
  );
}
