"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import { fetchVms } from "@/state/slices/vms";
import { selectAppSettings } from "@/state/slices/appSettings";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

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
  useSidebar,
} from "./sidebar";
import { useSizeContext, sizeVariants } from "./size-provider";
import {
  getGlassNavContainer,
  getGlassNavItem,
  getMicaNavigation,
  getAcrylicOverlay,
  getFluentNavCard,
  getMinimalGlassContainer,
  getNavBrandGlow,
  getSunNavHighlight,
  debounceNavGlassTransition,
  getReducedTransparencyFallback,
  getAccessibleNavContrast,
  getFocusRingForGlass,
  getResponsiveBlur
} from "@/utils/navigation-glass";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { InputSelector } from "./input-selector";

// Custom Components
import SidebarVMList from "@/app/departments/[name]/components/SidebarVMList";

// Icons
import { RiDashboardLine, RiSettings4Line } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { BiLogOut, BiBuildings } from "react-icons/bi";
import { ImInsertTemplate } from "react-icons/im";
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { HiPlus } from "react-icons/hi";

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
  departments = [],
  onLogOut,
  onCreateDepartment,
  reducedTransparency = false,
  ...props
}, ref) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const isActive = (path) => pathname === path;
  const [isDeptsOpen, setIsDeptsOpen] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [newDepartmentName, setNewDepartmentName] = React.useState("");
  const [activeSidebarSection, setActiveSidebarSection] = React.useState(null);
  const [selectedDepartment, setSelectedDepartment] = React.useState("");
  const [subSidebarVisible, setSubSidebarVisible] = React.useState(false);

  const { size: contextSize } = useSizeContext();
  const sizes = sizeVariants[contextSize];
  const isMobile = useIsMobile();
  const sidebarWidth = sizes.navbar.width;
  const sidebarWidthMobile = sizes.navbar.mobileWidth;
  const sidebarWidthIcon = sizes.icon.button.replace("w-", "") + "rem";

  // Fetch VMs if they're not already loaded
  const vms = useSelector((state) => state.vms.items);
  const vmsLoading = useSelector((state) => state.vms.loading.fetch);
  const appSettings = useSelector(selectAppSettings);

  // Logo state management
  const defaultLogo = '/images/logo.png';
  const [logoSrc, setLogoSrc] = useState(appSettings.logoUrl || defaultLogo);

  useEffect(() => {
    setLogoSrc(appSettings.logoUrl || defaultLogo);
  }, [appSettings.logoUrl]);

  // Detect external URLs
  const isExternal = !!appSettings.logoUrl && /^(https?:)?\/\//.test(appSettings.logoUrl);

  // Filter VMs by the selected department
  const departmentVMs = React.useMemo(() => {
    return vms.filter(vm =>
      vm.department?.name?.toLowerCase() === selectedDepartment.toLowerCase()
    );
  }, [vms, selectedDepartment]);

  // React.useEffect(() => {
  //   // Only fetch VMs if we don't have any and we're not already fetching
  //   if (vms.length === 0 && !vmsLoading) {
  //     dispatch(fetchVms());
  //   }
  // }, [dispatch, vms.length, vmsLoading]);

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
    // Check if we're on a specific department page (not the general departments page)
    if (pathname.startsWith('/departments/') && pathname !== '/departments') {
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

  // Close sub-sidebar when navigating to routes without submenu
  React.useEffect(() => {
    // Only show submenu for specific department pages, not the general departments page
    const isDepartmentSpecificPage = pathname.startsWith('/departments/') && pathname !== '/departments';

    if (!isDepartmentSpecificPage) {
      setSubSidebarVisible(false);
      setActiveSidebarSection(null);
    }
  }, [pathname]);

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
            "text-sidebar-foreground/80 hover:text-sidebar-foreground w-full",
            menuStyles.text,
            menuStyles.spacing.item,
            isActive(item.href) && "glass-subtle text-sidebar-foreground",
            getAccessibleNavContrast('bg-sidebar', 'light'),
            getFocusRingForGlass('light')
          )}
          onClick={() => {
            if (item.hasSubmenu) {
              if (isMobile) {
                // On mobile, show submenu content within main sidebar
                setActiveSidebarSection(item.id);
              } else {
                // On desktop, open sub-sidebar
                openSubSidebar(item.id);
              }
            } else {
              setSubSidebarVisible(false);
              setActiveSidebarSection(null);
              router.push(item.href);
            }
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

  const renderDepartmentsSubMenu = (departmentVMs) => {
    return (
      <>
        <SidebarHeader className={cn("relative flex items-center justify-between", menuStyles.spacing.container)}>
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={closeSubSidebar}
              className={cn(
                "text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/30 mr-2 rounded-full transition-all transform hover:scale-105",
                getFocusRingForGlass('light')
              )}
            >
              <ChevronLeft className={menuStyles.icon} />
            </Button>
            <span className="text-sidebar-foreground font-medium tracking-wide text-lg">Departments</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="relative">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="p-4">
                <label className="block text-sm text-sidebar-foreground/80 mb-2 font-medium">Department</label>
                <div className={cn("glass-medium rounded-lg overflow-hidden border border-sidebar-border/20 shadow-lg", getFluentNavCard())}>
                  <InputSelector
                    items={departments}
                    selectedItem={departments.find(dept => dept.name.toLowerCase() === selectedDepartment.toLowerCase())}
                    onSelectItem={(department) => handleDepartmentChange(department.name)}
                    placeholder="Select department"
                    searchPlaceholder="Search departments..."
                    itemLabelKey="name"
                    itemValueKey="id"
                    className="!bg-transparent text-sidebar-foreground border-transparent hover:!bg-sidebar-accent/10 transition-colors"
                  />
                </div>
              </div>
            </SidebarMenuItem>

            <div className="px-4 pt-2 pb-4">
              <div className={cn("glass-subtle rounded-xl p-3", getFluentNavCard())}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/departments"}
                    className={cn(
                      "text-sidebar-foreground/80 hover:text-sidebar-foreground w-full transition-all hover:bg-sidebar-accent/10 rounded-lg",
                      pathname === "/departments" ? "glass-subtle text-sidebar-foreground" : "",
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
                      "text-sidebar-foreground/80 hover:text-sidebar-foreground w-full transition-all hover:bg-sidebar-accent/10 rounded-lg mt-1",
                      menuStyles.text,
                      menuStyles.spacing.item
                    )}
                  >
                    <div className={cn("flex items-center", menuStyles.gap)}>
                      <div className={cn("glass-subtle p-1 rounded-md")}>
                        <HiPlus className="w-3 h-3 text-sidebar-foreground" />
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
                <h3 className="px-3 text-sm font-semibold text-sidebar-foreground/70">Computers</h3>
              </div>

              <div className={cn("glass-subtle rounded-xl p-3", getFluentNavCard())}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "text-sidebar-foreground/80 hover:text-sidebar-foreground w-full transition-all hover:bg-sidebar-accent/10 rounded-lg",
                      menuStyles.text,
                      menuStyles.spacing.item
                    )}
                  >
                    <Link href={selectedDepartment ? `/departments/${selectedDepartment}` : "/departments"} className={cn("flex items-center justify-between", menuStyles.gap)}>
                      <span>All computers</span>
                      {departmentVMs.length > 0 && (
                        <span className="glass-subtle text-sidebar-foreground text-xs px-2 py-0.5 rounded-full">
                          {departmentVMs.length}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                {/* VM List */}
                {selectedDepartment && departmentVMs.length > 0 && (
                  <div className="mt-2 border-t border-sidebar-border/20 pt-2">
                    <div className="px-3 py-1">
                      <span className="text-xs font-medium text-sidebar-foreground/60">Virtual Machines</span>
                    </div>
                    <SidebarVMList
                      machines={departmentVMs}
                      menuStyles={menuStyles}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Security section */}
            <div className="px-4 pt-2 pb-4">
              <div className="flex items-center mb-3">
                <h3 className="px-3 text-sm font-semibold text-sidebar-foreground/70">Security</h3>
              </div>

              <div className={cn("glass-subtle rounded-xl p-3", getFluentNavCard())}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "text-sidebar-foreground/80 hover:text-sidebar-foreground w-full transition-all hover:bg-sidebar-accent/10 rounded-lg",
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

  // Animation variants for slide transitions
  const slideVariants = {
    main: {
      initial: { x: 0 },
      animate: { x: subSidebarVisible ? '-100%' : 0 },
      exit: { x: '-100%' }
    },
    sub: {
      initial: { x: '-100%' },
      animate: { x: subSidebarVisible ? 0 : '-100%' },
      exit: { x: '-100%' }
    }
  };

  const springTransition = {
    type: 'spring',
    stiffness: 260,
    damping: 30
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

      <div className="flex-shrink-0">
        <SidebarProvider
          defaultOpen
          sidebarWidth={sidebarWidth}
          sidebarWidthMobile={sidebarWidthMobile}
          sidebarWidthIcon={sidebarWidthIcon}
        >
          {/* Sidebar Animation Container */}
          <SidebarWidthContainer>
            <AnimatePresence mode="wait">
              {/* Main Sidebar */}
              {(!subSidebarVisible || isMobile) && (
                <motion.div
                  key="main-sidebar"
                  variants={slideVariants.main}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={springTransition}
                  className="h-full w-full"
                >
                  <Sidebar
                    variant="sidebar"
                    collapsible="none"
                    className={cn(
                      "overflow-hidden border-r border-sidebar-border",
                      "h-full",
                      getGlassNavContainer({ variant: 'minimal', theme: 'light', size: contextSize })
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
                        {isMobile && activeSidebarSection === "departments"
                          ? renderDepartmentsSubMenu(departmentVMs)
                          : renderMainMenuItems()
                        }
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
                        onClick={onLogOut}
                      >
                        <BiLogOut className={menuStyles.icon} />
                        Logout
                      </Button>
                    </SidebarFooter>
                  </Sidebar>
                </motion.div>
              )}

              {/* Sub-Sidebar - Only render on desktop when visible */}
              {!isMobile && subSidebarVisible && (
                <motion.div
                  key="sub-sidebar"
                  variants={slideVariants.sub}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={springTransition}
                  className="h-full w-full"
                >
                  <Sidebar
                    variant="sidebar"
                    collapsible="none"
                    className={cn(
                      "overflow-hidden border-r border-sidebar-border",
                      "h-full",
                      getGlassNavContainer({ variant: 'minimal', theme: 'light', size: contextSize })
                    )}
                    data-collapsible="sidebar"
                    data-reduced-transparency={reducedTransparency ? 'true' : undefined}
                  >
                    {activeSidebarSection === "departments" && renderDepartmentsSubMenu(departmentVMs)}
                  </Sidebar>
                </motion.div>
              )}
            </AnimatePresence>
          </SidebarWidthContainer>
        </SidebarProvider>
      </div>
    </>
  );
});

AppSidebar.displayName = "AppSidebar";

export { AppSidebar };
