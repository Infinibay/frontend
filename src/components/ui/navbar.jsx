"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Image } from "@nextui-org/react";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "./button";
import { Input } from "./input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

// Icons
import { RiDashboardLine, RiSettings4Line } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { BiLogOut, BiBuildings } from "react-icons/bi";
import { ChevronDown, ChevronRight } from "lucide-react";
import { HiPlus } from "react-icons/hi";

const AppSidebar = React.forwardRef(({ 
    user, 
    departments = [], 
    children,
    onLogOut,
    onCreateDepartment,
    ...props
  }, ref) => {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  const [isDeptsOpen, setIsDeptsOpen] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newDepartmentName, setNewDepartmentName] = React.useState("");

  const { size: contextSize } = useSizeContext();
  const sizes = sizeVariants[contextSize];
  const sidebarWidth = sizes.navbar.width;
  const sidebarWidthMobile = sizes.navbar.mobileWidth;
  const sidebarWidthIcon = sizes.icon.button.replace("w-", "") + "rem";

  const handleCreateDepartmentClick = () => {
    setIsDialogOpen(true);
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    const trimmedName = newDepartmentName.trim();
    
    if (!trimmedName) {
      setIsDialogOpen(false);
      return;
    }

    try {
      await onCreateDepartment(trimmedName);
    } catch (error) {
      console.error("Failed to create department:", error);
    }
    
    setNewDepartmentName("");
    setIsDialogOpen(false);
  };

  const handleCancel = () => {
    setNewDepartmentName("");
    setIsDialogOpen(false);
  };

  // Menu item styles based on size
  const menuStyles = {
    text: sizes.text,
    icon: sizes.icon.nav,
    spacing: sizes.spacing,
    gap: sizes.gap,
    avatar: sizes.avatar,
    logo: sizes.logo,
  };

  const navItems = [
    { href: "/computers", icon: RiDashboardLine, label: "Computers" },
    {
      label: "Departments",
      icon: BiBuildings,
      children: [
        ...departments.map((dept) => ({
          href: `/departments/${dept.name}`,
          label: dept.name,
          badge: dept.computersCount || 0,
        })),
        {
          label: (<><HiPlus className="w-4 h-4" /> Create Department</>),
          onClick: handleCreateDepartmentClick,
          className: "text-blue-200 hover:text-white"
        }
      ],
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
                menuStyles.text,
                menuStyles.spacing.item
              )}
            >
              <Link href={item.href} className={cn("flex items-center", menuStyles.gap)}>
                {item.icon && <item.icon className={menuStyles.icon} />}
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
                menuStyles.text,
                menuStyles.spacing.item
              )}
            >
              <div className={cn("flex items-center", menuStyles.gap)}>
                {item.icon && <item.icon className={menuStyles.icon} />}
                <span>{item.label}</span>
              </div>
              {isDeptsOpen ? (
                <ChevronDown className={menuStyles.icon} />
              ) : (
                <ChevronRight className={menuStyles.icon} />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          {isDeptsOpen &&
            item.children.map((child) => (
              <SidebarMenuItem key={child.href || child.label}>
                {child.href ? (
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(child.href)}
                    className={cn(
                      "text-gray-300 hover:text-white justify-between w-full",
                      menuStyles.text,
                      menuStyles.spacing.subItem
                    )}
                  >
                    <Link
                      href={child.href}
                      className={cn("flex items-center justify-between w-full", menuStyles.gap)}
                    >
                      <span>{child.label}</span>
                      {child.badge > 0 && (
                        <span
                          className={cn(
                            "bg-blue-500 text-white px-2 py-0.5 rounded-full",
                            sizes.badge.text
                          )}
                        >
                          {child.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton
                    onClick={child.onClick}
                    className={cn(
                      "w-full",
                      menuStyles.text,
                      menuStyles.spacing.subItem,
                      child.className
                    )}
                  >
                    <Button
                      type="button"
                      onClick={handleCreateDepartmentClick}
                      variant="ghost"
                      className="flex items-center gap-1 px-2 py-0.5"
                    >
                      <HiPlus className="w-4 h-4" /> Create Department
                    </Button>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleCreateDepartment}>
            <DialogHeader>
              <DialogTitle>Create Department</DialogTitle>
              <DialogDescription>
                Enter a name for the new department.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Input
                autoFocus
                type="text"
                placeholder="Department name"
                value={newDepartmentName}
                onChange={(e) => setNewDepartmentName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="error"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                onClick={handleCreateDepartment}
                variant="success"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1000 1000"
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

            <SidebarHeader
              className={cn("border-b border-blue-700 relative", menuStyles.spacing.container)}
            >
              <Link href="/">
                <Image
                  src="/images/sidebarLogo.png"
                  alt="Logo"
                  className={cn("w-auto rounded-none", menuStyles.logo)}
                  radius="none"
                />
              </Link>
            </SidebarHeader>
            <SidebarContent className="relative">
              <SidebarMenu>{renderMenuItems()}</SidebarMenu>
            </SidebarContent>
            <SidebarFooter
              className={cn("border-t border-blue-700 relative", menuStyles.spacing.container)}
            >
              {user && (
                <div className={cn("flex items-center px-2 mb-4", menuStyles.gap)}>
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}'s avatar`}
                    className={cn("rounded-full bg-blue-800 p-1", menuStyles.avatar)}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className={cn("text-white font-medium truncate", menuStyles.text)}>
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className={cn("text-blue-200 truncate", menuStyles.text)}>
                      {user.role}
                    </p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-gray-300 hover:text-white hover:bg-blue-600",
                  menuStyles.text,
                  menuStyles.spacing.item,
                  menuStyles.gap
                )}
                onClick={onLogOut}
              >
                <BiLogOut className={menuStyles.icon} />
                Logout
              </Button>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
});

AppSidebar.displayName = "AppSidebar";

export { AppSidebar };
