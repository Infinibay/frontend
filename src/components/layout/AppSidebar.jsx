'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
  Monitor,
  Building2,
  LayoutGrid,
  Users,
  FileCode,
  Settings,
  LogOut,
} from 'lucide-react';
import { Avatar, Button, ResponsiveStack, Sidebar } from '@infinibay/harbor';

import { selectAppSettings } from '@/state/slices/appSettings';

const NAV_ITEMS = [
  { id: 'computers', href: '/computers', icon: <Monitor size={14} />, label: 'Computers' },
  { id: 'departments', href: '/departments', icon: <Building2 size={14} />, label: 'Departments' },
  { id: 'templates', href: '/templates', icon: <LayoutGrid size={14} />, label: 'Templates' },
  { id: 'users', href: '/users', icon: <Users size={14} />, label: 'Users' },
  { id: 'scripts', href: '/scripts', icon: <FileCode size={14} />, label: 'Scripts' },
  { id: 'settings', href: '/settings', icon: <Settings size={14} />, label: 'Settings' },
];

function routeForId(id) {
  return NAV_ITEMS.find((i) => i.id === id)?.href || '/';
}

function activeId(pathname) {
  for (const item of NAV_ITEMS) {
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

  const sections = useMemo(
    () => [
      {
        label: 'Navigation',
        items: NAV_ITEMS.map((it) => ({
          id: it.id,
          label: it.label,
          icon: it.icon,
          href: it.href,
        })),
      },
    ],
    [],
  );

  const selected = activeId(pathname);

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
      onSelect={(id) => router.push(routeForId(id))}
      header={header}
      footer={footer}
    />
  );
});

export { AppSidebar };
