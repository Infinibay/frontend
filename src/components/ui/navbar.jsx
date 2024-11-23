"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Image } from "@nextui-org/react";
import { cn } from "@/lib/utils";

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
  SidebarInset,
} from "./sidebar";
import { useSizeContext, sizeVariants } from "./size-provider";

// Icons
import { RiDashboardLine, RiSettings4Line } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { BiLogOut, BiBuildings } from "react-icons/bi";
import { ChevronDown, ChevronRight } from "lucide-react";

const sizeStyles = {
  sm: {
    logo: "h-6",
    text: "text-sm",
    icon: "h-4 w-4",
    spacing: {
      container: "p-3",
      item: "px-4 py-2",
      subItem: "pl-10 pr-4 py-2", // 10 = icon(16) + gap(8) + padding(16)
      gap: "gap-2"
    },
    avatar: "w-8 h-8"
  },
  md: {
    logo: "h-8",
    text: "text-base",
    icon: "h-4.5 w-4.5",
    spacing: {
      container: "p-4",
      item: "px-5 py-3.5",
      subItem: "pl-12 pr-5 py-3", // 12 = icon(18) + gap(10) + padding(20)
      gap: "gap-2.5"
    },
    avatar: "w-10 h-10"
  },
  lg: {
    logo: "h-10",
    text: "text-lg",
    icon: "h-5 w-5",
    spacing: {
      container: "p-6",
      item: "px-6 py-5",
      subItem: "pl-14 pr-6 py-4", // 14 = icon(20) + gap(12) + padding(24)
      gap: "gap-3"
    },
    avatar: "w-12 h-12"
  },
  xl: {
    logo: "h-12",
    text: "text-xl",
    icon: "h-6 w-6",
    spacing: {
      container: "p-8",
      item: "px-8 py-6",
      subItem: "pl-16 pr-8 py-5", // Using pl-16 (64px) which is a valid Tailwind class
      gap: "gap-4"
    },
    avatar: "w-14 h-14"
  }
};

const AppSidebar = React.forwardRef(({ user, departments=[], children }, ref) => {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  const [isDeptsOpen, setIsDeptsOpen] = React.useState(true);

  const navItems = [
    { href: "/computers", icon: RiDashboardLine, label: "Computers" },
    { 
      label: "Departments", 
      icon: BiBuildings,
      children: departments.map(dept => ({
        href: `/departments/${dept.name}`,
        label: dept.name,
        badge: dept.totalMachines
      }))
    },
    { href: "/users", icon: FiUsers, label: "Users" },
    { href: "/settings", icon: RiSettings4Line, label: "Settings" },
  ];

  const renderMenuItems = () => {
    return navItems.map((item) => {
      if (!item.children) {
        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive(item.href)}
              className={cn(
                "text-gray-300 hover:text-white w-full",
                sizeStyles.lg.text,
                sizeStyles.lg.spacing.item
              )}
            >
              <Link href={item.href} className={cn("flex items-center", sizeStyles.lg.spacing.gap)}>
                {item.icon && <item.icon className={sizeStyles.lg.icon} />}
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      }

      return (
        <React.Fragment key={item.label}>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setIsDeptsOpen(!isDeptsOpen)}
              className={cn(
                "text-gray-300 hover:text-white justify-between w-full",
                sizeStyles.lg.text,
                sizeStyles.lg.spacing.item
              )}
            >
              <div className={cn("flex items-center", sizeStyles.lg.spacing.gap)}>
                {item.icon && <item.icon className={sizeStyles.lg.icon} />}
                <span>{item.label}</span>
              </div>
              {isDeptsOpen ? (
                <ChevronDown className={sizeStyles.lg.icon} />
              ) : (
                <ChevronRight className={sizeStyles.lg.icon} />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          {isDeptsOpen && item.children.map((child) => (
            <SidebarMenuItem key={child.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(child.href)}
                className={cn(
                  "text-gray-300 hover:text-white justify-between w-full",
                  sizeStyles.lg.text,
                  sizeStyles.lg.spacing.subItem
                )}
              >
                <Link href={child.href} className={cn("flex items-center justify-between w-full", sizeStyles.lg.spacing.gap)}>
                  <span>{child.label}</span>
                  {child.badge > 0 && (
                    <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs">
                      {child.badge}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </React.Fragment>
      );
    });
  };

  // get sidebar widht, mobile widht and icon from size provider
  const { size: contextSize } = useSizeContext()
  const sizes = sizeVariants[contextSize]
  const sidebarWidth = sizes.navbar.width
  const sidebarWidthMobile = sizes.navbar.mobileWidth
  const sidebarWidthIcon = sizes.icon.button.replace('w-', '') + 'rem'

  return (
    <div className="flex h-screen">
      <SidebarProvider 
        defaultOpen 
        sidebarWidth={sidebarWidth}
        sidebarWidthMobile={sidebarWidthMobile}
        sidebarWidthIcon={sidebarWidthIcon}
      >
        <Sidebar 
          className="bg-blue-700 overflow-hidden shadow-[4px_0_10px_rgba(0,0,0,0.15)] border-r border-gray-200/10 z-50" 
          data-collapsible="sidebar"
        >
          {/* Decorative waves */}
          <div className="absolute inset-x-0 bottom-0 pointer-events-none opacity-20" style={{ height: '100%' }}>
            <svg
              className="absolute bottom-0 h-full"
              preserveAspectRatio="none"
              viewBox="0 0 1000 1000"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* First wave - slowest, biggest */}
              <path
                d="M0,350 
                   C200,300 300,400 500,350 
                   C700,300 800,400 1000,350 
                   C1200,300 1300,400 1500,350 
                   L1500,1000 L0,1000 Z"
                fill="rgb(30 64 175)"
                className="animate-[wave1_25s_linear_infinite]"
              />
              {/* Second wave - medium speed, different pattern */}
              <path
                d="M0,400 
                   C150,350 250,450 400,400 
                   C550,350 650,450 800,400 
                   C950,350 1050,450 1200,400 
                   L1200,1000 L0,1000 Z"
                fill="rgb(37 99 235)"
                className="animate-[wave2_18s_linear_infinite]"
              />
              {/* Third wave - fastest, most detailed */}
              <path
                d="M0,450 
                   C100,400 200,500 300,450 
                   C400,400 500,500 600,450 
                   C700,400 800,500 900,450 
                   C1000,400 1100,500 1200,450 
                   L1200,1000 L0,1000 Z"
                fill="rgb(59 130 246)"
                className="animate-[wave3_12s_linear_infinite]"
              />
            </svg>
          </div>

          <style jsx>{`
            @keyframes wave1 {
              0% { transform: translateX(0); }
              100% { transform: translateX(-500px); }
            }
            @keyframes wave2 {
              0% { transform: translateX(0); }
              100% { transform: translateX(-400px); }
            }
            @keyframes wave3 {
              0% { transform: translateX(0); }
              100% { transform: translateX(-300px); }
            }
          `}</style>

          <SidebarHeader className={cn("border-b border-blue-700 relative", sizeStyles.lg.spacing.container)}>
            <Link href="/">
              <Image
                src="/images/sidebarLogo.png"
                alt="Logo"
                className={cn("w-auto rounded-none", sizeStyles.lg.logo)}
                radius="none"
              />
            </Link>
          </SidebarHeader>
          <SidebarContent className="relative">
            <SidebarMenu>
              {renderMenuItems()}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className={cn("border-t border-blue-700 relative", sizeStyles.lg.spacing.container)}>
            {user && (
              <div className={cn("flex items-center px-2 mb-4", sizeStyles.lg.spacing.gap)}>
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}'s avatar`}
                  className={cn("rounded-full bg-blue-800 p-1", sizeStyles.lg.avatar)}
                />
                <div className="flex-1 min-w-0">
                  <h3 className={cn("text-white font-medium truncate", sizeStyles.lg.text)}>
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className={cn("text-blue-200 truncate", sizeStyles.lg.text)}>
                    {user.role}
                  </p>
                </div>
              </div>
            )}
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start text-gray-300 hover:text-white hover:bg-blue-600",
                sizeStyles.lg.text,
                sizeStyles.lg.spacing.item,
                sizeStyles.lg.spacing.gap
              )}
            >
              <BiLogOut className={sizeStyles.lg.icon} />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
});

AppSidebar.displayName = "AppSidebar";

export { AppSidebar };
