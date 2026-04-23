'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Building2,
  Monitor,
  Blocks,
  Package,
  FileCode,
  Users,
  Activity,
  Server,
  Settings,
  LogOut,
  UserCircle,
  Layers,
  PlayCircle,
  Fingerprint,
  HardDrive,
  ShieldCheck,
} from 'lucide-react';
import { Avatar, Button, ResponsiveStack, Sidebar } from '@infinibay/harbor';

import { selectAppSettings } from '@/state/slices/appSettings';
import { isEndUser } from '@/lib/roles';

/**
 * Operator sidebar — see docs/design/harbor_design_guidelines.md §3.1.
 * Entries with `preview: true` render with a "Preview" badge and point to
 * mocked screens (no backend wiring).
 */
const OPERATOR_NAV_ITEMS = [
  { id: 'overview',       href: '/overview',       icon: <LayoutDashboard size={14} />, label: 'Overview' },
  { id: 'departments',    href: '/departments',    icon: <Building2 size={14} />,       label: 'Departments' },
  { id: 'desktops',       href: '/desktops',       icon: <Monitor size={14} />,         label: 'Desktops' },
  { id: 'pools',          href: '/pools',          icon: <Layers size={14} />,          label: 'Pools',       preview: true },
  { id: 'blueprints',     href: '/blueprints',     icon: <Blocks size={14} />,          label: 'Blueprints' },
  { id: 'images',         href: '/images',         icon: <Blocks size={14} />,          label: 'Golden Images', preview: true },
  { id: 'applications',   href: '/applications',   icon: <Package size={14} />,         label: 'Applications' },
  { id: 'scripts',        href: '/scripts',        icon: <FileCode size={14} />,        label: 'Scripts' },
  { id: 'sessions',       href: '/sessions',       icon: <PlayCircle size={14} />,      label: 'Sessions',    preview: true },
  { id: 'users',          href: '/users',          icon: <Users size={14} />,           label: 'Users' },
  { id: 'identity',       href: '/identity',       icon: <Fingerprint size={14} />,     label: 'Identity',    preview: true },
  { id: 'storage',        href: '/storage',        icon: <HardDrive size={14} />,       label: 'Storage',     preview: true },
  { id: 'policies',       href: '/policies',       icon: <ShieldCheck size={14} />,     label: 'Policies',    preview: true },
  { id: 'events',         href: '/events',         icon: <Activity size={14} />,        label: 'Events' },
  { id: 'infrastructure', href: '/infrastructure', icon: <Server size={14} />,          label: 'Infrastructure' },
  { id: 'settings',       href: '/settings',       icon: <Settings size={14} />,        label: 'Settings' },
];

/**
 * End-user (role USER) sidebar — see guideline §3.2.
 * Reduced to the two places a desktop user actually needs.
 */
const END_USER_NAV_ITEMS = [
  { id: 'workspace', href: '/workspace', icon: <Monitor size={14} />,      label: 'Workspace' },
  { id: 'profile',   href: '/profile',   icon: <UserCircle size={14} />,   label: 'Profile' },
];

function navFor(user) {
  return isEndUser(user) ? END_USER_NAV_ITEMS : OPERATOR_NAV_ITEMS;
}

function routeForId(items, id) {
  return items.find((i) => i.id === id)?.href || '/';
}

function activeId(items, pathname) {
  for (const item of items) {
    if (pathname === item.href) return item.id;
    if (item.id === 'settings') {
      if (pathname.startsWith('/settings/')) return item.id;
      continue;
    }
    if (pathname.startsWith(item.href + '/')) return item.id;
  }
  return null;
}

const AppSidebar = React.forwardRef(function AppSidebar({ user, onLogOut }, _ref) {
  const pathname = usePathname();
  const router = useRouter();
  const appSettings = useSelector(selectAppSettings);

  const logoSrc = appSettings?.logoUrl || '/images/logo.png';
  const isExternalLogo =
    !!appSettings?.logoUrl && /^(https?:)?\/\//.test(appSettings.logoUrl);

  const navItems = useMemo(() => navFor(user), [user]);

  const sections = useMemo(
    () => [
      {
        label: 'Navigation',
        items: navItems.map((it) => ({
          id: it.id,
          label: it.label,
          icon: it.icon,
          href: it.href,
          badge: it.preview ? (
            <span className="text-[9px] uppercase tracking-wider font-semibold text-fg-muted bg-white/5 border border-white/10 rounded px-1 py-px">
              Preview
            </span>
          ) : undefined,
        })),
      },
    ],
    [navItems],
  );

  const selected = activeId(navItems, pathname);

  const header = (
    <Link href="/">
      <Image
        src={logoSrc}
        alt="Infinibay"
        width={120}
        height={32}
        unoptimized={isExternalLogo}
        priority
      />
    </Link>
  );

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
    : '';

  const footer = (
    <ResponsiveStack direction="col" gap={2}>
      {user ? (
        <Button
          variant="ghost"
          size="md"
          fullWidth
          align="start"
          reactive={false}
          ripple={false}
          icon={<Avatar name={displayName} size="sm" />}
          onClick={() => router.push('/profile')}
        >
          <ResponsiveStack direction="col" gap={0} align="start">
            <span>{displayName}</span>
            {user.role ? <span>{user.role}</span> : null}
          </ResponsiveStack>
        </Button>
      ) : null}
      <Button
        variant="ghost"
        size="sm"
        fullWidth
        align="start"
        icon={<LogOut size={14} />}
        onClick={() => onLogOut?.()}
      >
        Logout
      </Button>
    </ResponsiveStack>
  );

  return (
    <Sidebar
      sticky
      sections={sections}
      selected={selected || undefined}
      onSelect={(id) => router.push(routeForId(navItems, id))}
      header={header}
      footer={footer}
    />
  );
});

export { AppSidebar };
