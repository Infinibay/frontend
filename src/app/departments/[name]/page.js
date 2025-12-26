"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSizeContext, sizeVariants } from "@/components/ui/size-provider";
import {
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Building2, Monitor, Shield, Plus, Search, Settings, Network } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import dynamic from 'next/dynamic';
import { getGlassClasses } from '@/utils/glass-effects';
import { cn } from '@/lib/utils';

// Custom hooks
import { useDepartmentPage } from "./hooks/useDepartmentPage";
import { usePageHeader } from '@/hooks/usePageHeader';

// Components
import NotFound from "./components/NotFound";
import TabControls from "./components/TabControls";
import MachineGrid from "./components/MachineGrid";
import MachineTable from "./components/MachineTable";
import EmptyState from "./components/EmptyState";
import ToastNotification from "./components/ToastNotification";
import CreateDepartmentDialog from "./components/CreateDepartmentDialog";
import { MachineGridSkeleton, MachineTableSkeleton } from "./components/UserPcSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy-loaded components
const SecuritySection = dynamic(() => import('./components/SecuritySection.jsx'), {
  ssr: false,
  loading: () => <div className="size-padding">Loading security settings...</div>
});

const DepartmentScriptsPage = dynamic(() => import('./scripts/page.jsx'), {
  ssr: false,
  loading: () => <div className="size-padding">Loading scripts...</div>
});

const DepartmentNetworkTab = dynamic(() => import('./components/DepartmentNetworkTab.jsx'), {
  ssr: false,
  loading: () => <div className="size-padding">Loading network diagnostics...</div>
});

/**
 * Department Page Component
 * Displays department information, computers, and security settings
 */
const DepartmentPage = () => {
  const params = useParams();
  const router = useRouter();
  const departmentName = params.name?.toLowerCase();
  const { size } = useSizeContext();
  
  const {
    // State
    isLoading,
    department,
    departments,
    departmentsLoading,
    machines,
    showToast,
    toastProps,
    activeTab,
    viewMode,
    sortBy,
    sortDirection,
    isCreateDeptDialogOpen,
    newDepartmentName,
    selectedPc,
    isAdmin,
    nameUpdateLoading,
    deleteConfirmation,
    isCreating,
    isDeleting,

    // Actions
    setActiveTab,
    setShowToast,
    setIsCreateDeptDialogOpen,
    setNewDepartmentName,
    handlePcSelect,
    handleDetailsClose,
    handlePlayAction,
    handlePauseAction,
    handleStopAction,
    handleDeleteAction,
    toggleViewMode,
    handleSort,
    handleCreateDepartment,
    handleNewComputer,
    handleDepartmentNameUpdate,
    confirmDelete,
    cancelDelete,
  } = useDepartmentPage(departmentName);

  // Help configuration
  const helpConfig = useMemo(() => ({
    title: "Department Management Help",
    description: "Learn how to manage virtual machines and security settings for your department",
    icon: <Building2 className="h-5 w-5 text-primary" />,
    sections: [
      {
        id: "managing-vms",
        title: "Managing Virtual Machines",
        icon: <Monitor className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <p className="font-medium text-foreground mb-1">Creating VMs</p>
            <p>Click the "New Computer" button to create a new virtual machine. You'll need to select a template and the VM will be automatically assigned to this department.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Viewing VMs</p>
            <p>Switch between grid and table views using the toggle button. Grid view shows VM cards with status and quick actions, while table view provides a sortable list with detailed information.</p>

            <p className="font-medium text-foreground mb-1 mt-3">VM Actions</p>
            <p>Control VMs with power buttons (start/stop), edit hardware settings, or delete VMs. All destructive actions require confirmation.</p>
          </div>
        )
      },
      {
        id: "view-modes",
        title: "View Modes",
        icon: <Search className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <p className="font-medium text-foreground mb-1">Grid View</p>
            <p>Visual card layout showing VM status, specifications, and quick actions. Best for getting an overview of your virtual machines.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Table View</p>
            <p>Compact list with sortable columns including name, status, assigned user, and creation date. Ideal for detailed sorting and filtering.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Switching Views</p>
            <p>Use the toggle button in the tab controls to switch between grid and table views. Your preference is saved automatically.</p>
          </div>
        )
      },
      {
        id: "security",
        title: "Security Settings",
        icon: <Shield className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <p className="font-medium text-foreground mb-1">Firewall Rules</p>
            <p>Configure department-level firewall rules that affect all VMs in this department. These rules provide a baseline security configuration.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Templates</p>
            <p>Apply predefined security templates for common scenarios, such as web servers, database servers, or development environments.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Custom Rules</p>
            <p>Create specific rules for ports, protocols, and IP ranges to match your security requirements.</p>
          </div>
        )
      },
      {
        id: "department-settings",
        title: "Department Settings",
        icon: <Settings className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <p className="font-medium text-foreground mb-1">Rename Department</p>
            <p>Admins can click the department name in the header to rename it using inline editing. Press Enter to save or Escape to cancel.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Scripts Tab</p>
            <p>Access department-specific automation scripts that can be run on VMs within this department.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Organization</p>
            <p>Use departments to organize VMs by team, project, or function. This helps maintain clear boundaries and access control.</p>
          </div>
        )
      },
      {
        id: "network-diagnostics",
        title: "Network Diagnostics",
        icon: <Network className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <p className="font-medium text-foreground mb-1">Network Status</p>
            <p>View comprehensive diagnostics of the department's network infrastructure including bridge status, DHCP server, and NAT configuration.</p>

            <p className="font-medium text-foreground mb-1 mt-3">DHCP Traffic Capture</p>
            <p>Capture and analyze DHCP traffic to troubleshoot connectivity issues. Useful when VMs are not obtaining IP addresses.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Recommendations</p>
            <p>The system automatically detects common issues and provides actionable recommendations to fix them.</p>
          </div>
        )
      }
    ],
    quickTips: [
      "Use grid view for visual overview, table view for detailed sorting",
      "Click the department name in the header to rename it (admin only)",
      "Security settings apply to all VMs in the department",
      "Each VM can be assigned to a specific user for access control"
    ]
  }), []);

  // Configure header
  usePageHeader({
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Departments', href: '/departments' },
      { label: departmentName || 'Department', isCurrent: true }
    ],
    title: departmentName || 'Department',
    actions: [
      {
        id: 'new-computer',
        label: 'New Computer',
        icon: 'Plus',
        variant: 'default',
        size: 'sm',
        onClick: () => router.push(`/departments/${departmentName}/computers/create`),
        tooltip: 'Create new computer in this department'
      }
    ],
    helpConfig: helpConfig,
    helpTooltip: 'Department help'
  }, [departmentName]);

  // Loading state - maintains page structure with skeleton placeholders
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="size-padding space-y-6">
          {/* Department header skeleton */}
          <div className={cn(
            getGlassClasses({ glass: 'subtle', elevation: 1, radius: 'md' }),
            "size-padding"
          )}>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-32 rounded" />
                <Skeleton className="h-4 w-56 rounded" />
              </div>
            </div>
          </div>

          {/* Tab controls skeleton */}
          <div className={cn(
            getGlassClasses({ glass: 'subtle', elevation: 1, radius: 'md' }),
            "size-padding flex items-center justify-between"
          )}>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24 rounded" />
              <Skeleton className="h-10 w-20 rounded" />
              <Skeleton className="h-10 w-20 rounded" />
            </div>
            <Skeleton className="h-10 w-10 rounded" />
          </div>

          {/* Content skeleton - matches current view mode */}
          <div className={cn(
            getGlassClasses({ glass: 'medium', elevation: 3, radius: 'lg' }),
            "size-container size-padding"
          )}>
            {viewMode === "table" ? (
              <MachineTableSkeleton count={6} />
            ) : (
              <MachineGridSkeleton count={6} size={size} />
            )}
          </div>
        </div>
      </div>
    );
  }

  // If department not found
  if (departmentName && !department) {
    return <NotFound departmentName={params.name} />;
  }

  return (
    <ToastProvider>
      <div className="w-full">

        {/* Main content container with consistent spacing */}
        <div className="size-padding space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
            <TabControls
              activeTab={activeTab}
              onTabChange={setActiveTab}
              viewMode={viewMode}
              onViewModeToggle={toggleViewMode}
            />

            <TabsContent value="computers" className={cn(
              getGlassClasses({ glass: 'medium', elevation: 3, radius: 'lg' }),
              "size-container size-padding mt-0"
            )}>
              {machines.length > 0 ? (
                <>
                  {viewMode === "grid" ? (
                    <MachineGrid
                      machines={machines}
                      departmentName={department?.name}
                      onSelect={handlePcSelect}
                      onPlay={handlePlayAction}
                      onPause={handlePauseAction}
                      onStop={handleStopAction}
                      onDelete={handleDeleteAction}
                      size={size}
                    />
                  ) : (
                    <MachineTable
                      machines={machines}
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      handleSort={handleSort}
                      handlePcSelect={handlePcSelect}
                      handlePlay={handlePlayAction}
                      handlePause={handlePauseAction}
                      handleStop={handleStopAction}
                      handleDelete={handleDeleteAction}
                    />
                  )}
                </>
              ) : (
                <EmptyState />
              )}
            </TabsContent>

            <TabsContent value="security" className={cn(
              getGlassClasses({ glass: 'medium', elevation: 3, radius: 'lg' }),
              "size-container size-padding mt-0"
            )}>
              <SecuritySection departmentId={department?.id} />
            </TabsContent>

            <TabsContent value="scripts" className={cn(
              getGlassClasses({ glass: 'medium', elevation: 3, radius: 'lg' }),
              "size-container size-padding mt-0"
            )}>
              <DepartmentScriptsPage />
            </TabsContent>

            <TabsContent value="network" className={cn(
              getGlassClasses({ glass: 'medium', elevation: 3, radius: 'lg' }),
              "size-container size-padding mt-0"
            )}>
              <DepartmentNetworkTab departmentId={department?.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreateDepartmentDialog
        open={isCreateDeptDialogOpen}
        onOpenChange={setIsCreateDeptDialogOpen}
        departmentName={newDepartmentName}
        onDepartmentNameChange={setNewDepartmentName}
        onSubmit={handleCreateDepartment}
        onCancel={() => {
          setNewDepartmentName("");
          setIsCreateDeptDialogOpen(false);
        }}
        isLoading={isCreating}
      />

      <ToastNotification
        show={showToast}
        variant={toastProps.variant}
        title={toastProps.title}
        description={toastProps.description}
        onOpenChange={(open) => !open && setShowToast(false)}
      />

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={(open) => { if (!open) cancelDelete(); }}>
        <AlertDialogContent glass="strong" className="shadow-elevation-5">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Delete Virtual Machine?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteConfirmation.vm?.name}</strong>?
              This action cannot be undone and all data associated with this virtual machine will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="size-gap">
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ToastViewport />
    </ToastProvider>
  );
};

export default DepartmentPage;