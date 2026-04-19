"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Monitor,
  Building2,
  LayoutGrid,
  Users,
  FileCode,
  Settings,
  LogOut,
} from "lucide-react";
import { Sidebar, Avatar, Button } from "@infinibay/harbor";

import { selectAppSettings } from "@/state/slices/appSettings";

const NAV_ITEMS = [
  { id: "computers", href: "/computers", icon: <Monitor className="h-4 w-4" />, label: "Computers" },
  { id: "departments", href: "/departments", icon: <Building2 className="h-4 w-4" />, label: "Departments" },
  { id: "templates", href: "/templates", icon: <LayoutGrid className="h-4 w-4" />, label: "Templates" },
  { id: "users", href: "/users", icon: <Users className="h-4 w-4" />, label: "Users" },
  { id: "scripts", href: "/scripts", icon: <FileCode className="h-4 w-4" />, label: "Scripts" },
  { id: "settings", href: "/settings", icon: <Settings className="h-4 w-4" />, label: "Settings" },
];

function routeForId(id) {
  return NAV_ITEMS.find((i) => i.id === id)?.href || "/";
}

function activeId(pathname) {
  for (const item of NAV_ITEMS) {
    if (pathname === item.href) return item.id;
    if (item.id === "settings") {
      if (pathname.startsWith("/settings/")) return item.id;
      continue;
    }
    if (pathname.startsWith(item.href + "/")) return item.id;
  }
  return null;
}

const AppSidebar = React.forwardRef(function AppSidebar({ user, onLogOut }, _ref) {
  const pathname = usePathname();
  const router = useRouter();
  const appSettings = useSelector(selectAppSettings);

  const logoSrc = appSettings?.logoUrl || "/images/logo.png";
  const isExternalLogo = !!appSettings?.logoUrl && /^(https?:)?\/\//.test(appSettings.logoUrl);

  const sections = useMemo(
    () => [
      {
        label: "Navigation",
        items: NAV_ITEMS.map((it) => ({
          id: it.id,
          label: it.label,
          icon: it.icon,
          href: it.href,
        })),
      },
    ],
    []
  );

  const selected = activeId(pathname);

  const header = (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src={logoSrc}
        alt="Infinibay"
        width={120}
        height={32}
        className="h-8 w-auto"
        unoptimized={isExternalLogo}
        priority
      />
    </Link>
  );

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
    : "";

  const footer = (
    <div className="space-y-2">
      {user ? (
        <Link
          href="/profile"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors min-w-0"
        >
          <Avatar
            name={displayName}
            size="sm"
          />
          <div className="min-w-0 text-left">
            <div className="text-sm font-medium text-fg truncate">{displayName}</div>
            {user.role ? (
              <div className="text-[10px] uppercase tracking-wider text-fg-subtle truncate">
                {user.role}
              </div>
            ) : null}
          </div>
        </Link>
      ) : null}
      <Button
        variant="ghost"
        size="sm"
        icon={<LogOut className="h-4 w-4" />}
        onClick={() => onLogOut?.()}
        className="w-full justify-start"
      >
        Logout
      </Button>
    </div>
  );

  return (
    <div className="shrink-0 h-screen sticky top-0 p-3">
      <Sidebar
        sections={sections}
        selected={selected || undefined}
        onSelect={(id) => router.push(routeForId(id))}
        header={header}
        footer={footer}
        className="h-full"
      />
    </div>
  );
});

export { AppSidebar };
