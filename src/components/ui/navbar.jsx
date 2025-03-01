"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { InputSelector } from "./input-selector";

// Icons
import { RiDashboardLine, RiSettings4Line } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { BiLogOut, BiBuildings } from "react-icons/bi";
import { ImInsertTemplate } from "react-icons/im";
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
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
  const router = useRouter();
  const isActive = (path) => pathname === path;
  const [isDeptsOpen, setIsDeptsOpen] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newDepartmentName, setNewDepartmentName] = React.useState("");
  const [activeSidebarSection, setActiveSidebarSection] = React.useState(null);
  const [selectedDepartment, setSelectedDepartment] = React.useState("");
  const [subSidebarVisible, setSubSidebarVisible] = React.useState(false);

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

  const handleDepartmentChange = (value) => {
    // Only update and navigate if the value actually changed
    if (value && value !== selectedDepartment) {
      console.log(`Selecting department: ${value}`);
      setSelectedDepartment(value);
      
      // Use toLowerCase for URL but keep original case for display
      const departmentUrlValue = value.toLowerCase();
      
      // Update sidebar state
      setIsDeptsOpen(true);
      setActiveSidebarSection('departments');
      setSubSidebarVisible(true);
      
      // Navigate to the department page
      router.push(`/departments/${departmentUrlValue}`);
    }
  };

  const openSubSidebar = (section) => {
    setActiveSidebarSection(section);
    setSubSidebarVisible(true);
  };

  const closeSubSidebar = () => {
    setSubSidebarVisible(false);
  };

  // Initialize department selection and sidebar state based on the current path
  React.useEffect(() => {
    // Check if we're on a department page
    if (pathname.startsWith('/departments/')) {
      // Extract department name from the path
      const pathParts = pathname.split('/');
      const departmentIndex = pathParts.findIndex(part => part === 'departments');
      
      if (departmentIndex !== -1 && pathParts.length > departmentIndex + 1) {
        // Get the department name from the URL
        const departmentName = pathParts[departmentIndex + 1];
        
        if (departmentName) {
          // Find the matching department with proper case from the departments array
          const matchingDept = departments.find(
            dept => dept.name.toLowerCase() === departmentName.toLowerCase()
          );
          
          if (matchingDept) {
            // Set the selected department with proper case
            setSelectedDepartment(matchingDept.name);
          } else {
            // If no match found, use the URL value (fallback)
            setSelectedDepartment(departmentName);
          }
          
          // Open the departments section in the sidebar
          setIsDeptsOpen(true);
          setActiveSidebarSection('departments');
          setSubSidebarVisible(true);
        }
      }
    }
  }, [pathname, departments]);

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
    { id: "computers", href: "/computers", icon: RiDashboardLine, label: "Computers", hasSubmenu: false },
    { id: "departments", href: "/departments", icon: BiBuildings, label: "Departments", hasSubmenu: true },
    { id: "templates", href: "/templates", icon: ImInsertTemplate, label: "Templates", hasSubmenu: false },
    { id: "users", href: "/users", icon: FiUsers, label: "Users", hasSubmenu: false },
    { id: "settings", href: "/settings", icon: RiSettings4Line, label: "Settings", hasSubmenu: false }
  ];

  const renderMainMenuItems = () => {
    return navItems.map((item) => (
      <SidebarMenuItem key={item.id}>
        <SidebarMenuButton
          className={cn(
            "text-gray-300 hover:text-white w-full",
            menuStyles.text,
            menuStyles.spacing.item,
            isActive(item.href) && "bg-blue-600 text-white"
          )}
          onClick={() => item.hasSubmenu ? openSubSidebar(item.id) : router.push(item.href)}
        >
          <div className={cn("flex items-center", menuStyles.gap)}>
            {item.icon && <item.icon className={menuStyles.icon} />}
            <span>{item.label}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));
  };

  const renderDepartmentsSubMenu = () => {
    return (
      <>
        <SidebarHeader className={cn("relative flex items-center justify-between", menuStyles.spacing.container)}>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={closeSubSidebar}
              className="text-white hover:text-white hover:bg-indigo-500/30 mr-2 rounded-full transition-all transform hover:scale-105"
            >
              <ChevronLeft className={menuStyles.icon} />
            </Button>
            <span className="text-white font-medium tracking-wide text-lg">Departments</span>
          </div>
        </SidebarHeader>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-indigo-700 to-purple-800 opacity-90 z-[-1]"></div>
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5 z-[-1]"></div>
        <SidebarContent className="relative">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="p-4">
                <label className="block text-sm text-blue-100 mb-2 font-medium">Department</label>
                <div className="bg-white/10 rounded-lg overflow-hidden backdrop-blur-md border border-white/20 shadow-lg">
                  <InputSelector
                    items={departments}
                    selectedItem={departments.find(dept => dept.name.toLowerCase() === selectedDepartment.toLowerCase())}
                    onSelectItem={(department) => handleDepartmentChange(department.name)}
                    placeholder="Select department"
                    searchPlaceholder="Search departments..."
                    itemLabelKey="name"
                    itemValueKey="id"
                    className="!bg-transparent text-white border-transparent hover:!bg-white/10 transition-colors"
                  />
                </div>
              </div>
            </SidebarMenuItem>

            <div className="px-4 pt-2 pb-4">
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/departments"}
                    className={cn(
                      "text-white/80 hover:text-white w-full transition-all hover:bg-white/10 rounded-lg",
                      pathname === "/departments" ? "bg-indigo-500/30 text-white" : "",
                      menuStyles.text,
                      menuStyles.spacing.item
                    )}
                  >
                    <Link href="/departments" className={cn("flex items-center", menuStyles.gap)}>
                      <span>All Departments</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleCreateDepartmentClick}
                    className={cn(
                      "text-white/80 hover:text-white w-full transition-all hover:bg-white/10 rounded-lg mt-1",
                      menuStyles.text,
                      menuStyles.spacing.item
                    )}
                  >
                    <div className={cn("flex items-center", menuStyles.gap)}>
                      <div className="bg-gradient-to-r from-indigo-400 to-purple-400 p-1 rounded-md">
                        <HiPlus className="w-3 h-3 text-indigo-900" />
                      </div>
                      <span>Create Department</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </div>
            
            {/* Computers section */}
            <div className="px-4 pt-2 pb-4">
              <div className="flex items-center mb-3">
                <div className="h-px flex-grow bg-gradient-to-r from-transparent via-indigo-300/30 to-transparent"></div>
                <h3 className="px-3 text-sm font-semibold text-indigo-200">Computers</h3>
                <div className="h-px flex-grow bg-gradient-to-r from-transparent via-indigo-300/30 to-transparent"></div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "text-white/80 hover:text-white w-full transition-all hover:bg-white/10 rounded-lg",
                      menuStyles.text,
                      menuStyles.spacing.item
                    )}
                  >
                    <Link href={selectedDepartment ? `/departments/${selectedDepartment}` : "/departments"} className={cn("flex items-center justify-between", menuStyles.gap)}>
                      <span>All computers</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </div>

            {/* Security section */}
            <div className="px-4 pt-2 pb-4">
              <div className="flex items-center mb-3">
                <div className="h-px flex-grow bg-gradient-to-r from-transparent via-indigo-300/30 to-transparent"></div>
                <h3 className="px-3 text-sm font-semibold text-indigo-200">Security</h3>
                <div className="h-px flex-grow bg-gradient-to-r from-transparent via-indigo-300/30 to-transparent"></div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "text-white/80 hover:text-white w-full transition-all hover:bg-white/10 rounded-lg",
                      menuStyles.text,
                      menuStyles.spacing.item
                    )}
                  >
                    <Link href={selectedDepartment ? `/departments/${selectedDepartment}/security` : "/departments"} className={cn("flex items-center", menuStyles.gap)}>
                      <span>Security Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </div>
            </div>
          </SidebarMenu>
        </SidebarContent>
      </>
    );
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
          {/* Main Sidebar */}
          <Sidebar
            className={cn(
              "bg-blue-700 overflow-hidden shadow-[4px_0_10px_rgba(0,0,0,0.15)] border-r border-gray-200/10 z-50 transition-all duration-300",
              subSidebarVisible && "transform -translate-x-full"
            )}
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
              <SidebarMenu>{renderMainMenuItems()}</SidebarMenu>
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

          {/* Sub-Sidebar */}
          <Sidebar
            className={cn(
              "bg-blue-800 overflow-hidden shadow-[4px_0_10px_rgba(0,0,0,0.15)] border-r border-gray-200/10 z-50 absolute top-0 left-0 h-full transition-all duration-300",
              subSidebarVisible ? "transform translate-x-0" : "transform -translate-x-full"
            )}
            data-collapsible="sidebar"
          >
            {activeSidebarSection === "departments" && renderDepartmentsSubMenu()}
          </Sidebar>

          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
});

AppSidebar.displayName = "AppSidebar";

export { AppSidebar };
