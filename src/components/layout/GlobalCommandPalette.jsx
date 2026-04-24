'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { CommandPalette } from '@infinibay/harbor';
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
  Bell,
  Plus,
  RefreshCw,
  LogOut,
  UserCircle,
} from 'lucide-react';

import auth from '@/utils/auth';

export function GlobalCommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Pull recent collections from Redux to power fuzzy search. Slices are
  // already persisted + populated by InitialDataLoader, so this is free.
  const desktops = useSelector((s) => s.vms?.items || []);
  const departments = useSelector((s) => s.departments?.items || []);
  const templates = useSelector((s) => s.templates?.items || []);
  const users = useSelector((s) => s.users?.items || []);

  useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setOpen((s) => !s);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = useCallback(
    (href) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  const handleLogout = useCallback(() => {
    setOpen(false);
    auth.logout();
    window.location.href = '/auth/sign-in';
  }, []);

  const handleReload = useCallback(() => {
    setOpen(false);
    if (typeof window !== 'undefined') window.location.reload();
  }, []);

  // Resource entries: live from Redux, kept first so fuzzy matches hit them
  // before generic "Go to…" entries.
  const resourceCommands = useMemo(() => {
    const out = [];
    for (const d of desktops) {
      const deptName = d.department?.name;
      const dest = deptName
        ? `/departments/${encodeURIComponent(deptName)}/desktops/${d.id}`
        : `/desktops`;
      out.push({
        id: `desktop-${d.id}`,
        label: d.name,
        description: deptName ? `Desktop · ${deptName}` : 'Desktop',
        section: 'Desktops',
        icon: <Monitor size={14} />,
        keywords: [deptName, d.localIP, d.publicIP].filter(Boolean),
        action: () => go(dest),
      });
    }
    for (const d of departments) {
      out.push({
        id: `department-${d.id}`,
        label: d.name,
        description: 'Department',
        section: 'Departments',
        icon: <Building2 size={14} />,
        action: () => go(`/departments/${encodeURIComponent(d.name)}`),
      });
    }
    for (const t of templates) {
      out.push({
        id: `blueprint-${t.id}`,
        label: t.name,
        description: `Blueprint · ${t.cores}c · ${t.ram} GB`,
        section: 'Blueprints',
        icon: <Blocks size={14} />,
        action: () => go('/blueprints'),
      });
    }
    for (const u of users) {
      const name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email;
      if (!name) continue;
      out.push({
        id: `user-${u.id}`,
        label: name,
        description: u.email ? `User · ${u.email}` : 'User',
        section: 'Users',
        icon: <Users size={14} />,
        keywords: [u.email, u.role].filter(Boolean),
        action: () => go('/users'),
      });
    }
    return out;
  }, [desktops, departments, templates, users, go]);

  const commands = useMemo(
    () => [
      ...resourceCommands,
      {
        id: 'nav-overview',
        label: 'Go to Overview',
        section: 'Navigate',
        icon: <LayoutDashboard size={14} />,
        keywords: ['home', 'dashboard', 'start'],
        action: () => go('/overview'),
      },
      {
        id: 'nav-departments',
        label: 'Go to Departments',
        section: 'Navigate',
        icon: <Building2 size={14} />,
        keywords: ['dept', 'teams', 'org', 'unit'],
        action: () => go('/departments'),
      },
      {
        id: 'nav-desktops',
        label: 'Go to Desktops',
        section: 'Navigate',
        icon: <Monitor size={14} />,
        keywords: ['vm', 'virtual', 'machines', 'computers', 'hosts'],
        action: () => go('/desktops'),
      },
      {
        id: 'nav-blueprints',
        label: 'Go to Blueprints',
        section: 'Navigate',
        icon: <Blocks size={14} />,
        keywords: ['template', 'config', 'preset', 'recipe', 'os'],
        action: () => go('/blueprints'),
      },
      {
        id: 'nav-applications',
        label: 'Go to Applications',
        section: 'Navigate',
        icon: <Package size={14} />,
        keywords: ['apps', 'catalog', 'software', 'install'],
        action: () => go('/applications'),
      },
      {
        id: 'nav-scripts',
        label: 'Go to Scripts',
        section: 'Navigate',
        icon: <FileCode size={14} />,
        keywords: ['automation', 'run', 'powershell', 'bash'],
        action: () => go('/scripts'),
      },
      {
        id: 'nav-users',
        label: 'Go to Users',
        section: 'Navigate',
        icon: <Users size={14} />,
        keywords: ['members', 'accounts', 'operators', 'admins'],
        action: () => go('/users'),
      },
      {
        id: 'nav-events',
        label: 'Go to Events',
        section: 'Navigate',
        icon: <Activity size={14} />,
        keywords: ['audit', 'log', 'history', 'alerts'],
        action: () => go('/events'),
      },
      {
        id: 'nav-infrastructure',
        label: 'Go to Infrastructure',
        section: 'Navigate',
        icon: <Server size={14} />,
        keywords: ['hosts', 'nodes', 'networks', 'physical'],
        action: () => go('/infrastructure'),
      },
      {
        id: 'nav-settings',
        label: 'Go to Settings',
        section: 'Navigate',
        icon: <Settings size={14} />,
        keywords: ['config', 'preferences', 'branding', 'api', 'license'],
        action: () => go('/settings'),
      },
      {
        id: 'nav-notifications',
        label: 'Go to Notifications',
        section: 'Navigate',
        icon: <Bell size={14} />,
        keywords: ['alerts', 'recommendations', 'inbox'],
        action: () => go('/notification'),
      },
      {
        id: 'nav-profile',
        label: 'Go to Profile',
        section: 'Navigate',
        icon: <UserCircle size={14} />,
        keywords: ['me', 'account', 'my profile'],
        action: () => go('/profile'),
      },
      {
        id: 'action-new-desktop',
        label: 'New Desktop…',
        section: 'Create',
        icon: <Plus size={14} />,
        keywords: ['create', 'vm', 'desktop', 'provision', 'computer'],
        action: () => go('/desktops/new'),
      },
      {
        id: 'action-new-department',
        label: 'New Department',
        section: 'Create',
        icon: <Plus size={14} />,
        keywords: ['create', 'dept', 'team', 'unit'],
        action: () => go('/departments'),
      },
      {
        id: 'system-reload',
        label: 'Reload the page',
        section: 'System',
        icon: <RefreshCw size={14} />,
        shortcut: 'Ctrl+R',
        keywords: ['refresh', 'reset'],
        action: handleReload,
      },
      {
        id: 'system-logout',
        label: 'Sign out',
        section: 'System',
        icon: <LogOut size={14} />,
        keywords: ['logout', 'exit', 'session'],
        action: handleLogout,
      },
    ],
    [resourceCommands, go, handleLogout, handleReload],
  );

  return (
    <CommandPalette
      open={open}
      onOpenChange={setOpen}
      commands={commands}
      placeholder="Search desktops, users, departments…"
    />
  );
}
