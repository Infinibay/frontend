'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CommandPalette } from '@infinibay/harbor';
import {
  Monitor,
  Building2,
  LayoutGrid,
  Users,
  FileCode,
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
    auth.clearToken();
    window.location.href = '/auth/sign-in';
  }, []);

  const handleReload = useCallback(() => {
    setOpen(false);
    if (typeof window !== 'undefined') window.location.reload();
  }, []);

  const commands = useMemo(
    () => [
      {
        id: 'nav-computers',
        label: 'Go to Computers',
        section: 'Navigate',
        icon: <Monitor size={14} />,
        keywords: ['vm', 'virtual', 'machines', 'computers', 'hosts'],
        action: () => go('/computers'),
      },
      {
        id: 'nav-departments',
        label: 'Go to Departments',
        section: 'Navigate',
        icon: <Building2 size={14} />,
        keywords: ['dept', 'organization', 'teams'],
        action: () => go('/departments'),
      },
      {
        id: 'nav-templates',
        label: 'Go to Templates',
        section: 'Navigate',
        icon: <LayoutGrid size={14} />,
        keywords: ['blueprint', 'os', 'category'],
        action: () => go('/templates'),
      },
      {
        id: 'nav-users',
        label: 'Go to Users',
        section: 'Navigate',
        icon: <Users size={14} />,
        keywords: ['members', 'admins', 'accounts'],
        action: () => go('/users'),
      },
      {
        id: 'nav-scripts',
        label: 'Go to Scripts',
        section: 'Navigate',
        icon: <FileCode size={14} />,
        keywords: ['automation', 'run'],
        action: () => go('/scripts'),
      },
      {
        id: 'nav-settings',
        label: 'Go to Settings',
        section: 'Navigate',
        icon: <Settings size={14} />,
        keywords: ['config', 'preferences', 'theme', 'isos'],
        action: () => go('/settings'),
      },
      {
        id: 'nav-notifications',
        label: 'Go to Notifications',
        section: 'Navigate',
        icon: <Bell size={14} />,
        keywords: ['alerts', 'recommendations'],
        action: () => go('/notification'),
      },
      {
        id: 'nav-profile',
        label: 'Go to Profile',
        section: 'Navigate',
        icon: <UserCircle size={14} />,
        keywords: ['me', 'account'],
        action: () => go('/profile'),
      },
      {
        id: 'action-new-vm',
        label: 'New virtual machine…',
        section: 'Create',
        icon: <Plus size={14} />,
        keywords: ['create', 'vm', 'computer', 'provision'],
        action: () => go('/computers/create'),
      },
      {
        id: 'action-new-department',
        label: 'New department',
        section: 'Create',
        icon: <Plus size={14} />,
        keywords: ['create', 'org', 'team'],
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
    [go, handleLogout, handleReload],
  );

  return (
    <CommandPalette
      open={open}
      onOpenChange={setOpen}
      commands={commands}
      placeholder="Jump to… or type a command"
    />
  );
}
