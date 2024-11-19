"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Image } from "@nextui-org/react";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "./button";
import { Separator } from "./separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "./sidebar";

// Icons
import { RiDashboardLine, RiSettings4Line } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";

const sizeStyles = {
  sm: {
    logo: "h-6",
    text: "text-sm",
    icon: "h-4 w-4",
    spacing: {
      container: "p-3",
      item: "px-4 py-2",
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
      item: "px-5 py-2.5",
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
      item: "px-6 py-3",
      gap: "gap-3"
    },
    avatar: "w-12 h-12"
  }
};

const AppSidebar = ({ user, size = "lg" }) => {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  const styles = sizeStyles[size];

  const navItems = [
    { href: "/dashboard", icon: RiDashboardLine, label: "Dashboard" },
    { href: "/users", icon: FiUsers, label: "Users" },
    { href: "/settings", icon: RiSettings4Line, label: "Settings" },
  ];

  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="bg-blue-700 overflow-hidden shadow-[4px_0_10px_rgba(0,0,0,0.15)] z-50">
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

        <SidebarHeader className={cn("border-b border-blue-700 relative", styles.spacing.container)}>
          <Link href="/">
            <Image
              src="/images/sidebarLogo.png"
              alt="Logo"
              className={cn("w-auto rounded-none", styles.logo)}
              radius="none"
            />
          </Link>
        </SidebarHeader>
        <SidebarContent className="relative">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem 
                key={item.href} 
                asChild
                className={cn(
                  "text-gray-300 hover:text-white hover:bg-blue-600",
                  styles.text,
                  isActive(item.href) && "bg-blue-600 text-white"
                )}
              >
                <Link href={item.href} className={cn("flex items-center", styles.spacing.item, styles.spacing.gap)}>
                  <item.icon className={styles.icon} />
                  {item.label}
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className={cn("border-t border-blue-700 relative", styles.spacing.container)}>
          {user && (
            <div className={cn("flex items-center px-2 mb-4", styles.spacing.gap)}>
              <img
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}'s avatar`}
                className={cn("rounded-full bg-blue-800 p-1", styles.avatar)}
              />
              <div className="flex-1 min-w-0">
                <h3 className={cn("text-white font-medium truncate", styles.text)}>
                  {user.firstName} {user.lastName}
                </h3>
                <p className={cn("text-blue-200 truncate", styles.text)}>
                  {user.role}
                </p>
              </div>
            </div>
          )}
          <Button 
            variant="ghost" 
            className={cn(
              "w-full justify-start text-gray-300 hover:text-white hover:bg-blue-600",
              styles.text,
              styles.spacing.item,
              styles.spacing.gap
            )}
          >
            <BiLogOut className={styles.icon} />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
};

export default AppSidebar;
