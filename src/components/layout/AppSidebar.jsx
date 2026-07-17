'use client';

import React, { useEffect, useMemo } from 'react';
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
  Image as ImageIcon,
} from 'lucide-react';
import { Avatar, Button, Drawer, ResponsiveStack, Sidebar } from '@infinibay/harbor';

import { selectAppSettings } from '@/state/slices/appSettings';
import { selectFeatureFlags } from '@/state/slices/featureFlags';
import { isEndUserView } from '@/lib/roles';
import { useMyPermissionsQuery } from '@/gql/hooks';
import { resourceForNavId } from '@/lib/permissions';

/**
 * Ordered, labelled sections for the operator sidebar (harbor Sidebar renders
 * one labelled block per section). Items declare their `section` below.
 */
const SECTION_ORDER = ['Compute', 'Catalog', 'Access', 'System'];

/**
 * Operator sidebar — see docs/design/harbor_design_guidelines.md §3.1.
 * Entries with `preview: true` render with a "Preview" badge: these are real,
 * wired routes shipped as early-access surfaces while their feature set is
 * still being filled out — the badge sets expectations, it does not mark a
 * mock.
 */
const OPERATOR_NAV_ITEMS = [
  { id: 'overview',       section: 'Compute', href: '/overview',       icon: <LayoutDashboard size={14} />, label: 'Overview' },
  { id: 'departments',    section: 'Compute', href: '/departments',    icon: <Building2 size={14} />,       label: 'Departments' },
  { id: 'desktops',       section: 'Compute', href: '/desktops',       icon: <Monitor size={14} />,         label: 'Desktops' },
  { id: 'pools',          section: 'Compute', href: '/pools',          icon: <Layers size={14} />,          label: 'Pools' },
  { id: 'sessions',       section: 'Compute', href: '/sessions',       icon: <PlayCircle size={14} />,      label: 'Sessions' },
  { id: 'blueprints',     section: 'Catalog', href: '/blueprints',     icon: <Blocks size={14} />,          label: 'Blueprints' },
  { id: 'images',         section: 'Catalog', href: '/images',         icon: <ImageIcon size={14} />,       label: 'Golden Images' },
  { id: 'applications',   section: 'Catalog', href: '/applications',   icon: <Package size={14} />,         label: 'Applications' },
  { id: 'scripts',        section: 'Catalog', href: '/scripts',        icon: <FileCode size={14} />,        label: 'Scripts' },
  { id: 'users',          section: 'Access',  href: '/users',          icon: <Users size={14} />,           label: 'Users' },
  { id: 'identity',       section: 'Access',  href: '/identity',       icon: <Fingerprint size={14} />,     label: 'Identity',    preview: true },
  { id: 'policies',       section: 'Access',  href: '/policies',       icon: <ShieldCheck size={14} />,     label: 'Policies',    preview: true },
  { id: 'storage',        section: 'System',  href: '/storage',        icon: <HardDrive size={14} />,       label: 'Storage',     preview: true, featureFlag: 'storage' },
  { id: 'events',         section: 'System',  href: '/events',         icon: <Activity size={14} />,        label: 'Events' },
  { id: 'infrastructure', section: 'System',  href: '/infrastructure', icon: <Server size={14} />,          label: 'Infrastructure' },
  { id: 'settings',       section: 'System',  href: '/settings',       icon: <Settings size={14} />,        label: 'Settings' },
];

/**
 * End-user (role USER) sidebar — see guideline §3.2.
 * Reduced to the two places a desktop user actually needs.
 */
const END_USER_NAV_ITEMS = [
  { id: 'workspace', href: '/workspace', icon: <Monitor size={14} />,      label: 'Workspace' },
  { id: 'profile',   href: '/profile',   icon: <UserCircle size={14} />,   label: 'Profile' },
];

function navFor(user, allowedResources) {
  return isEndUserView(user, allowedResources) ? END_USER_NAV_ITEMS : OPERATOR_NAV_ITEMS;
}

function filterAllowedNav(items, allowedResources) {
  // `allowedResources` is undefined only while the permissions query is still
  // resolving its first response (or has errored before any data/cache exists).
  // In that unknown state we intentionally keep the full role-based nav visible
  // rather than fail closed: the operator/end-user split (isEndUserView) is
  // already decided by the role enum, the server remains the real authorization
  // boundary and bounces disallowed routes, and hiding an admin's whole nav on a
  // transient permissions-fetch blip is a far worse regression than a brief
  // over-show for a restricted custom role. With cache-and-network the resolved
  // set is served instantly on every subsequent mount, so the over-show is a
  // one-time first-paint flash, not persistent.
  if (!allowedResources) return items;

  const allowed = new Set(allowedResources);
  return items.filter((item) => {
    const resource = resourceForNavId(item.id);
    return allowed.has(resource);
  });
}

function filterEnabledFlags(items, flags) {
  return items.filter((item) => {
    if (!item.featureFlag) return true;
    return !!flags?.[item.featureFlag];
  });
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

function toSidebarItem(it) {
  return {
    id: it.id,
    label: it.label,
    icon: it.icon,
    href: it.href,
    badge: it.preview ? (
      <span className="text-[9px] uppercase tracking-wider font-semibold text-fg-muted bg-white/5 border border-white/10 rounded px-1 py-px">
        Preview
      </span>
    ) : undefined,
  };
}

/**
 * Group the (already filtered) nav items into the labelled sections harbor's
 * Sidebar renders. Items without a `section` (the end-user nav) collapse into
 * a single unlabelled block, preserving the prior flat appearance.
 */
function buildSections(items) {
  const bySection = new Map();
  for (const it of items) {
    const key = it.section || '';
    if (!bySection.has(key)) bySection.set(key, []);
    bySection.get(key).push(it);
  }

  const sections = [];
  for (const key of ['', ...SECTION_ORDER]) {
    const group = bySection.get(key);
    if (!group?.length) continue;
    sections.push({ label: key || undefined, items: group.map(toSidebarItem) });
  }
  return sections;
}

const AppSidebarInner = React.forwardRef(function AppSidebar(
  { user, onLogOut, mobileOpen = false, onMobileClose },
  _ref,
) {
  const pathname = usePathname();
  const router = useRouter();
  const appSettings = useSelector(selectAppSettings);
  const featureFlags = useSelector(selectFeatureFlags);
  const { data: permissionsData } = useMyPermissionsQuery({
    skip: !user,
    fetchPolicy: 'cache-and-network',
  });
  // A query error is deliberately not surfaced here: on failure Apollo retains
  // the last cached value in `permissionsData`, so an established session keeps
  // its resolved nav, and a first-ever load that errors leaves `allowedResources`
  // undefined — which filterAllowedNav intentionally treats as fail-open-visible
  // (the server still enforces access; hiding an admin's nav on a transient blip
  // would be the worse regression).
  const allowedResources = permissionsData?.myPermissions?.allowedResources;

  // Close the mobile drawer whenever the route changes (selecting an item,
  // the profile/logout footer buttons, or any in-app navigation).
  useEffect(() => {
    if (mobileOpen) onMobileClose?.();
    // Intentionally keyed on pathname only — fire on navigation, not on the
    // open/close toggle itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close the mobile drawer when the viewport grows to lg+, where the static
  // sidebar column takes over — otherwise a drawer opened on a narrow screen
  // lingers after a resize until the next navigation.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(min-width: 1024px)');
    const handleChange = (e) => {
      if (e.matches) onMobileClose?.();
    };
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [onMobileClose]);

  const logoSrc = appSettings?.logoUrl || '/images/logo.png';
  const isExternalLogo =
    !!appSettings?.logoUrl && /^(https?:)?\/\//.test(appSettings.logoUrl);

  const navItems = useMemo(
    () =>
      filterEnabledFlags(
        filterAllowedNav(navFor(user, allowedResources), allowedResources),
        featureFlags,
      ),
    [allowedResources, user, featureFlags],
  );

  const sections = useMemo(() => buildSections(navItems), [navItems]);

  const selected = activeId(navItems, pathname);

  const handleSelect = (id) => router.push(routeForId(navItems, id));

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
    <>
      {/* lg+ : the static sidebar column. Hidden below lg, where it would eat
          the viewport — the hamburger in GlobalHeader opens the Drawer below. */}
      <div className="hidden lg:flex">
        <Sidebar
          sticky
          sections={sections}
          selected={selected || undefined}
          onSelect={handleSelect}
          header={header}
          footer={footer}
        />
      </div>

      {/* below lg : the same nav as an overlay drawer (state lifted to layout). */}
      <Drawer
        open={!!mobileOpen}
        onClose={() => onMobileClose?.()}
        side="left"
        size={288}
      >
        <Sidebar
          sticky={false}
          sections={sections}
          selected={selected || undefined}
          onSelect={handleSelect}
          header={header}
          footer={footer}
        />
      </Drawer>
    </>
  );
});

const AppSidebar = React.memo(AppSidebarInner);
export { AppSidebar };
