'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import {
  User as UserIcon,
  Sun,
  Moon,
  Monitor,
  Rows3,
  Rows2,
  Check,
  LogOut,
} from 'lucide-react';
import {
  Avatar,
  Menu,
  MenuItem,
  MenuLabel,
  MenuSeparator,
} from '@infinibay/harbor';

import { useAppTheme } from '@/contexts/ThemeProvider';
import {
  selectInterfaceSize,
  setSizePreference,
} from '@/state/slices/appSettings';
import { selectUser } from '@/state/slices/auth';
import auth from '@/utils/auth';

const THEME_ITEMS = [
  { value: 'light', label: 'Light', icon: <Sun size={14} /> },
  { value: 'dark', label: 'Dark', icon: <Moon size={14} /> },
  { value: 'system', label: 'System', icon: <Monitor size={14} /> },
];

const DENSITY_ITEMS = [
  { value: 'sm', label: 'Compact', icon: <Rows3 size={14} /> },
  { value: 'md', label: 'Comfortable', icon: <Rows2 size={14} /> },
];

/**
 * Global user menu surfaced at the right end of the topbar.
 * Collapses low-frequency controls (theme, density) into the user's own menu,
 * keeping the topbar tight with only breadcrumbs + action buttons.
 */
export function UserMenu() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const interfaceSize = useSelector(selectInterfaceSize);
  const { theme, setTheme } = useAppTheme();

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
    : 'Account';

  const handleLogout = useCallback(() => {
    auth.logout();
    window.location.href = '/auth/sign-in';
  }, []);

  const handleDensity = useCallback(
    (value) => {
      dispatch(setSizePreference(value));
    },
    [dispatch],
  );

  const densitySubmenu = (
    <>
      {DENSITY_ITEMS.map((d) => (
        <MenuItem
          key={d.value}
          icon={d.icon}
          onClick={() => handleDensity(d.value)}
        >
          <span className="flex items-center justify-between gap-3 w-full">
            <span>{d.label}</span>
            {interfaceSize === d.value ? (
              <Check size={14} className="opacity-70" />
            ) : null}
          </span>
        </MenuItem>
      ))}
    </>
  );

  const themeSubmenu = (
    <>
      {THEME_ITEMS.map((t) => (
        <MenuItem
          key={t.value}
          icon={t.icon}
          onClick={() => setTheme(t.value)}
        >
          <span className="flex items-center justify-between gap-3 w-full">
            <span>{t.label}</span>
            {theme === t.value ? (
              <Check size={14} className="opacity-70" />
            ) : null}
          </span>
        </MenuItem>
      ))}
    </>
  );

  const trigger = (
    <button
      type="button"
      aria-label="Open user menu"
      className="inline-flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <Avatar name={displayName} size="sm" />
    </button>
  );

  return (
    <Menu trigger={trigger} side="bottom" align="end">
      <MenuLabel>{displayName}</MenuLabel>
      {user?.email ? (
        <div className="px-3 pb-2 text-fg-muted text-xs truncate max-w-[220px]">
          {user.email}
        </div>
      ) : null}
      <MenuSeparator />
      <Link href="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
        <MenuItem icon={<UserIcon size={14} />}>Profile</MenuItem>
      </Link>
      <MenuSeparator />
      <MenuItem
        icon={interfaceSize === 'sm' ? <Rows3 size={14} /> : <Rows2 size={14} />}
        submenu={densitySubmenu}
      >
        Density
      </MenuItem>
      <MenuItem
        icon={
          theme === 'light' ? <Sun size={14} /> :
          theme === 'dark' ? <Moon size={14} /> :
          <Monitor size={14} />
        }
        submenu={themeSubmenu}
      >
        Theme
      </MenuItem>
      <MenuSeparator />
      <MenuItem
        icon={<LogOut size={14} />}
        onClick={handleLogout}
        danger
      >
        Sign out
      </MenuItem>
    </Menu>
  );
}
