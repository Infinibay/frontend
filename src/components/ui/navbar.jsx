"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
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
import { getAvatarUrl } from "@/utils/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "./dialog";
import { AvatarSelector } from "./avatar-selector";
import { Avatar } from "./avatar";
import { updateUser } from "@/state/slices/users";
import { fetchCurrentUser } from "@/state/slices/auth";
import { useToast } from "@/hooks/use-toast";

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
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Profile modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Handle avatar update
  const handleAvatarUpdate = async (avatarPath) => {
    try {
      setAvatarLoading(true);

      // Show optimistic UI feedback
      toast({
        title: "Updating Avatar",
        description: "Applying your new avatar...",
      });

      // Call updateUser mutation with new avatar
      await dispatch(updateUser({ id: user.id, input: { avatar: avatarPath }})).unwrap();

      // Refresh current user data
      await dispatch(fetchCurrentUser()).unwrap();

      toast({
        title: "Avatar Updated",
        description: "Your profile avatar has been updated successfully.",
        variant: "success",
      });

      // Close modal on success
      setIsProfileModalOpen(false);
    } catch (error) {
      console.error('Error updating avatar:', error);

      toast({
        title: "Error",
        description: "Failed to update avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAvatarLoading(false);
    }
  };
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
                  <Button
                    variant="ghost"
                    className={cn("flex items-center px-2 mb-4 w-full justify-start hover:bg-sidebar-accent/50 transition-colors", menuStyles.gap)}
                    onClick={() => setIsProfileModalOpen(true)}
                  >
                    <Avatar
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}'s avatar`}
                      fallback={`${user.firstName} ${user.lastName}`}
                      className={cn("w-10 h-10", menuStyles.avatar)}
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className={cn("text-sidebar-foreground font-medium truncate", menuStyles.text)}>
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className={cn("text-sidebar-foreground/70 truncate", menuStyles.text)}>
                        {user.role}
                      </p>
                    </div>
                  </Button>
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

        {/* User Profile Modal */}
        <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Profile Settings</DialogTitle>
              <DialogDescription>
                Update your profile information and avatar.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col space-y-6 py-4">
              {/* User Information */}
              <div className="flex items-center space-x-4">
                <Avatar
                  src={user?.avatar}
                  alt={`${user?.firstName} ${user?.lastName}'s avatar`}
                  fallback={`${user?.firstName} ${user?.lastName}`}
                  className="w-15 h-15"
                />
                <div>
                  <h3 className="text-lg font-medium">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">{user?.role}</p>
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Update Avatar</h4>
                <AvatarSelector
                  selectedAvatar={user?.avatar}
                  onAvatarSelect={handleAvatarUpdate}
                  loading={avatarLoading}
                  className="w-full"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsProfileModalOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
});

AppSidebar.displayName = "AppSidebar";

export { AppSidebar };
