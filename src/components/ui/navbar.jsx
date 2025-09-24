"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { selectAppSettings } from "@/state/slices/appSettings";
import { useIsMobile } from "@/hooks/use-mobile";

// UI Components
import { Button } from "./button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  useSidebar,
} from "./sidebar";
import { useSizeContext } from "./size-provider";
import {
  getGlassNavContainer,
  getGlassNavItem,
  getAccessibleNavContrast,
  getFocusRingForGlass
} from "@/utils/navigation-glass";

// Custom Components

// Icons
import { RiDashboardLine, RiSettings4Line } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { BiLogOut, BiBuildings } from "react-icons/bi";
import { ImInsertTemplate } from "react-icons/im";

// Helper component to handle sidebar collapsed state
function SidebarWidthContainer({ children }) {
  const { isMobile, open } = useSidebar();
  const width = isMobile ? 0 : (open ? 'var(--sidebar-width)' : 0);
  return (
    <div className="relative flex-shrink-0" style={{ width, height: 'calc(100vh - 2rem)' }}>
      {children}
    </div>
  );
}

const AppSidebar = React.forwardRef(({
  user,
  onLogOut,
  reducedTransparency = false,
  ...props
}, ref) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  const { size: contextSize } = useSizeContext();
  const isMobile = useIsMobile();
  const sidebarWidth = "var(--size-navbar-width)";
  const sidebarWidthMobile = "var(--size-navbar-mobile-width)";
  const sidebarWidthIcon = "var(--size-icon-button)";

  const appSettings = useSelector(selectAppSettings);

  // Logo state management
  const defaultLogo = '/images/logo.png';
  const [logoSrc, setLogoSrc] = useState(appSettings.logoUrl || defaultLogo);

  useEffect(() => {
    setLogoSrc(appSettings.logoUrl || defaultLogo);
  }, [appSettings.logoUrl]);

  // Detect external URLs
  const isExternal = !!appSettings.logoUrl && /^(https?:)?\/\//.test(appSettings.logoUrl);

  // Menu item styles based on size
  const menuStyles = {
    text: "size-text",
    icon: "size-icon-nav",
    spacing: {
      item: "size-spacing-item",
      container: "size-spacing-container"
    },
    gap: "size-gap",
    avatar: "size-avatar",
    logo: "size-logo",
  };

  const navItems = [
    { id: "computers", href: "/computers", icon: RiDashboardLine, label: "Computers" },
    { id: "departments", href: "/departments", icon: BiBuildings, label: "Departments" },
    { id: "templates", href: "/templates", icon: ImInsertTemplate, label: "Templates" },
    { id: "users", href: "/users", icon: FiUsers, label: "Users" },
    { id: "settings", href: "/settings", icon: RiSettings4Line, label: "Settings" }
  ];

  const renderMainMenuItems = () => {
    return navItems.map((item) => (
      <SidebarMenuItem key={item.id}>
        <SidebarMenuButton
          className={cn(
            "text-sidebar-foreground/80 hover:text-sidebar-foreground w-full",
            menuStyles.text,
            menuStyles.spacing.item,
            isActive(item.href) && getGlassNavItem({ active: true, theme: 'light', size: contextSize }),
            getAccessibleNavContrast('bg-sidebar', 'light'),
            getFocusRingForGlass('light')
          )}
          onClick={() => {
            router.push(item.href);
          }}
        >
          <div className={cn("flex items-center", menuStyles.gap)}>
            {item.icon && <item.icon className={menuStyles.icon} />}
            <span>{item.label}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));
  };



  return (
      <div className="flex-shrink-0">
        <SidebarProvider
          defaultOpen
          sidebarWidth={sidebarWidth}
          sidebarWidthMobile={sidebarWidthMobile}
          sidebarWidthIcon={sidebarWidthIcon}
        >
          <SidebarWidthContainer>
            <Sidebar
              variant="sidebar"
              collapsible="none"
              className={cn(
                "overflow-hidden border-r border-sidebar-border",
                "h-full",
                getGlassNavContainer({ variant: 'main', theme: 'light', size: contextSize })
              )}
              data-collapsible="sidebar"
              data-reduced-transparency={reducedTransparency ? 'true' : undefined}
            >
              <SidebarHeader
                className={cn("border-b border-sidebar-border relative", menuStyles.spacing.container)}
              >
                <Link href="/">
                  <Image
                    src={logoSrc}
                    alt="Logo"
                    width={120}
                    height={40}
                    className={cn("w-auto rounded-none", menuStyles.logo)}
                    unoptimized={isExternal}
                    onError={() => setLogoSrc(defaultLogo)}
                  />
                </Link>
              </SidebarHeader>
              <SidebarContent className="relative">
                <SidebarMenu>
                  {renderMainMenuItems()}
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter
                className={cn("border-t border-sidebar-border relative", menuStyles.spacing.container)}
              >
                {user && (
                  <div className={cn("flex items-center px-2 mb-4", menuStyles.gap)}>
                    <Image
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}'s avatar`}
                      width={40}
                      height={40}
                      className={cn("rounded-full bg-sidebar-accent p-1", menuStyles.avatar)}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className={cn("text-sidebar-foreground font-medium truncate", menuStyles.text)}>
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className={cn("text-sidebar-foreground/70 truncate", menuStyles.text)}>
                        {user.role}
                      </p>
                    </div>
                  </div>
                )}
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                    menuStyles.text,
                    menuStyles.spacing.item,
                    menuStyles.gap
                  )}
                  onClick={() => onLogOut?.()}
                >
                  <BiLogOut className={menuStyles.icon} />
                  Logout
                </Button>
              </SidebarFooter>
            </Sidebar>
          </SidebarWidthContainer>
        </SidebarProvider>
      </div>
  );
});

AppSidebar.displayName = "AppSidebar";

export { AppSidebar };
