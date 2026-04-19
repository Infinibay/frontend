"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CommandPalette } from "@infinibay/harbor";
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
} from "lucide-react";

import auth from "@/utils/auth";

/**
 * Global Ctrl/Cmd+K command palette. Mounted once at the app root.
 * Exposes navigation + a few common actions. Extend the `commands`
 * array below as new shortcuts become useful.
 */
export function GlobalCommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Open/close on Ctrl+K / Cmd+K. Also Escape handled by the palette itself.
  useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setOpen((s) => !s);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = useCallback(
    (href) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  const handleLogout = useCallback(() => {
    setOpen(false);
    auth.clearToken();
    window.location.href = "/auth/sign-in";
  }, []);

  const handleReload = useCallback(() => {
    setOpen(false);
    if (typeof window !== "undefined") window.location.reload();
  }, []);

  const commands = useMemo(
    () => [
      // Navigation -------------------------------------------------------
      {
        id: "nav-computers",
        label: "Go to Computers",
        section: "Navigate",
        icon: <Monitor className="h-4 w-4" />,
        keywords: ["vm", "virtual", "machines", "computers", "hosts"],
        action: () => go("/computers"),
      },
      {
        id: "nav-departments",
        label: "Go to Departments",
        section: "Navigate",
        icon: <Building2 className="h-4 w-4" />,
        keywords: ["dept", "organization", "teams"],
        action: () => go("/departments"),
      },
      {
        id: "nav-templates",
        label: "Go to Templates",
        section: "Navigate",
        icon: <LayoutGrid className="h-4 w-4" />,
        keywords: ["blueprint", "os", "category"],
        action: () => go("/templates"),
      },
      {
        id: "nav-users",
        label: "Go to Users",
        section: "Navigate",
        icon: <Users className="h-4 w-4" />,
        keywords: ["members", "admins", "accounts"],
        action: () => go("/users"),
      },
      {
        id: "nav-scripts",
        label: "Go to Scripts",
        section: "Navigate",
        icon: <FileCode className="h-4 w-4" />,
        keywords: ["automation", "run"],
        action: () => go("/scripts"),
      },
      {
        id: "nav-settings",
        label: "Go to Settings",
        section: "Navigate",
        icon: <Settings className="h-4 w-4" />,
        keywords: ["config", "preferences", "theme", "isos"],
        action: () => go("/settings"),
      },
      {
        id: "nav-notifications",
        label: "Go to Notifications",
        section: "Navigate",
        icon: <Bell className="h-4 w-4" />,
        keywords: ["alerts", "recommendations"],
        action: () => go("/notification"),
      },
      {
        id: "nav-profile",
        label: "Go to Profile",
        section: "Navigate",
        icon: <UserCircle className="h-4 w-4" />,
        keywords: ["me", "account"],
        action: () => go("/profile"),
      },

      // Quick actions ----------------------------------------------------
      {
        id: "action-new-vm",
        label: "New virtual machine…",
        section: "Create",
        icon: <Plus className="h-4 w-4" />,
        keywords: ["create", "vm", "computer", "provision"],
        action: () => go("/computers/create"),
      },
      {
        id: "action-new-department",
        label: "New department",
        section: "Create",
        icon: <Plus className="h-4 w-4" />,
        keywords: ["create", "org", "team"],
        action: () => go("/departments"),
      },

      // System -----------------------------------------------------------
      {
        id: "system-reload",
        label: "Reload the page",
        section: "System",
        icon: <RefreshCw className="h-4 w-4" />,
        shortcut: "Ctrl+R",
        keywords: ["refresh", "reset"],
        action: handleReload,
      },
      {
        id: "system-logout",
        label: "Sign out",
        section: "System",
        icon: <LogOut className="h-4 w-4" />,
        keywords: ["logout", "exit", "session"],
        action: handleLogout,
      },
    ],
    [go, handleLogout, handleReload]
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
