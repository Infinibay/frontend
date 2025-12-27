"use client";

import React, { useMemo } from "react";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastViewport
} from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle, Building2 } from "lucide-react";
import { useSizeContext, sizeVariants, getTypographyClass, getGridClasses, getLayoutSpacing } from "@/components/ui/size-provider";
import { usePageHeader } from "@/hooks/usePageHeader";
import { getGlassClasses } from "@/utils/glass-effects";
import { cn } from "@/lib/utils";

// Custom hooks
import { useDepartmentsPage } from "./hooks/useDepartmentsPage";

// Components
import DepartmentCard from "./components/DepartmentCard";
import EmptyState from "./components/EmptyState";
import { DepartmentGridSkeleton } from "./components/DepartmentCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorState from "./components/ErrorState";
import CreateDepartmentDialog from "./components/CreateDepartmentDialog";

/**
 * Departments Page Component
 * Displays all departments and allows creating new ones
 */
const DepartmentsPage = () => {
  const { size } = useSizeContext();
  const {
    // State
    isLoading,
    hasError,
    searchQuery,
    isCreateDeptDialogOpen,
    newDepartmentName,
    showToast,
    toastProps,
    filteredDepartments,
    useMockData,
    isCreating,
    createError,

    // Actions
    retryLoading,
    setSearchQuery,
    setIsCreateDeptDialogOpen,
    setNewDepartmentName,
    setShowToast,
    handleCreateDepartment,
    handleDeleteDepartment,
    refreshDepartments,
    getMachineCount,
    getDepartmentColor
  } = useDepartmentsPage();

  // Help configuration
  const helpConfig = useMemo(() => ({
    title: "Departments Help",
    description: "Learn how to manage departments and organize your resources",
    icon: <Building2 className="h-5 w-5 text-primary" />,
    sections: [
      {
        id: "managing-departments",
        title: "Managing Departments",
        icon: <Building2 className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">Creating Departments</p>
              <p>Use the "New Department" button to create organizational units for grouping VMs.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Department Purpose</p>
              <p>Departments help organize VMs by team, project, or function for easier management.</p>
            </div>
          </div>
        ),
      },
    ],
    quickTips: [
      "Create departments to organize VMs by team or project",
      "Each department can have its own security policies",
      "Click on a department card to view its VMs",
    ],
  }), []);

  // Configure header using the global header system
  usePageHeader({
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Departments', isCurrent: true }
    ],
    title: 'Departments',
    actions: [
      {
        id: 'refresh',
        label: '',
        icon: 'RefreshCw',
        variant: 'outline',
        size: 'sm',
        onClick: refreshDepartments,
        loading: isLoading,
        disabled: isLoading,
        tooltip: isLoading ? 'Refreshing...' : 'Refresh departments',
        className: 'whitespace-nowrap'
      },
      {
        id: 'new-department',
        label: 'New Department',
        icon: 'Plus',
        variant: 'default',
        size: 'sm',
        onClick: () => setIsCreateDeptDialogOpen(true),
        disabled: isLoading,
        tooltip: 'Create a new department',
        className: 'whitespace-nowrap'
      }
    ],
    helpConfig: helpConfig,
    helpTooltip: 'Departments help'
  }, [isLoading, refreshDepartments, setIsCreateDeptDialogOpen]);

  // Loading state - maintains page structure with skeleton placeholders
  if (isLoading) {
    return (
      <div className="w-full">
        {/* Content container with glass effect */}
        <div className={cn(
          getGlassClasses({ glass: 'medium', elevation: 3, radius: 'lg' }),
          "size-container size-padding mt-4"
        )}>
          {/* Search skeleton */}
          <div className={`relative size-margin-sm ${sizeVariants[size].layout.maxWidth}`}>
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          <DepartmentGridSkeleton count={4} />
        </div>
      </div>
    );
  }
  
  // Error state
  if (hasError) {
    return <ErrorState onRetry={retryLoading} />;
  }
  
  return (
    <ToastProvider>
      <div className="w-full">
        {/* Mock Data Banner */}
        {useMockData && (
          <div className="bg-amber-50 border border-amber-200 rounded-md flex items-center size-container size-margin-sm">
            <AlertTriangle className={`${sizeVariants[size].icon.size} text-amber-500 ${sizeVariants[size].spacing.marginSm} flex-shrink-0`} />
            <div>
              <p className={`text-amber-800 font-medium ${sizeVariants[size].typography.text}`}>Using Mock Data</p>
              <p className={`text-amber-700 ${sizeVariants[size].text}`}>
                Could not connect to the API. Displaying mock data for development.
                <Button
                  variant="link"
                  className={`p-0 h-auto text-amber-800 underline ${sizeVariants[size].spacing.marginStartXs}`}
                  onClick={retryLoading}
                >
                  Try again
                </Button>
              </p>
            </div>
          </div>
        )}

        {/* Content container with glass effect */}
        <div className={cn(
          getGlassClasses({ glass: 'medium', elevation: 3, radius: 'lg' }),
          "size-container size-padding mt-4"
        )}>
          {/* Search */}
          <div className={`relative size-margin-sm ${sizeVariants[size].layout.maxWidth}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`${sizeVariants[size].icon.size} text-muted-foreground`} />
            </div>
            <Input
              type="text"
              placeholder="Search departments..."
              className={sizeVariants[size].input.withIconLeftPadding}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Departments List */}
          {filteredDepartments.length > 0 ? (
            <div className={cn(getGridClasses('departments', size), "mt-6")}>
              {filteredDepartments.map((dept) => (
                <DepartmentCard
                  key={dept.id}
                  department={dept}
                  machineCount={getMachineCount(dept.name)}
                  colorClass={getDepartmentColor(dept.name)}
                  size={size}
                  onDelete={handleDeleteDepartment}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              searchQuery={searchQuery}
              onCreateDepartment={() => setIsCreateDeptDialogOpen(true)}
              size={size}
            />
          )}
        </div>
      </div>
      
      {/* Create Department Dialog */}
      <CreateDepartmentDialog
        isOpen={isCreateDeptDialogOpen}
        onOpenChange={setIsCreateDeptDialogOpen}
        departmentName={newDepartmentName}
        onDepartmentNameChange={setNewDepartmentName}
        onSubmit={handleCreateDepartment}
        onCancel={() => {
          setNewDepartmentName("");
          setIsCreateDeptDialogOpen(false);
        }}
        isLoading={isCreating}
        error={createError}
      />
      
      {/* Toast Notification */}
      {showToast && (
        <Toast
          variant={toastProps.variant}
          onOpenChange={(open) => !open && setShowToast(false)}
        >
          <ToastTitle>{toastProps.title}</ToastTitle>
          <ToastDescription>{toastProps.description}</ToastDescription>
        </Toast>
      )}
      
      <ToastViewport />
    </ToastProvider>
  );
};

export default DepartmentsPage;
