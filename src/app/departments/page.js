"use client";

import React from "react";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastViewport
} from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, AlertTriangle } from "lucide-react";
import { useSizeContext, sizeVariants, getTypographyClass, getGridClasses, getLayoutSpacing } from "@/components/ui/size-provider";

// Custom hooks
import { useDepartmentsPage } from "./hooks/useDepartmentsPage";

// Components
import DepartmentCard from "./components/DepartmentCard";
import EmptyState from "./components/EmptyState";
import LoadingState from "./components/LoadingState";
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

    // Actions
    retryLoading,
    setSearchQuery,
    setIsCreateDeptDialogOpen,
    setNewDepartmentName,
    setShowToast,
    handleCreateDepartment,
    getMachineCount,
    getDepartmentColor
  } = useDepartmentsPage();
  
  // Loading state
  if (isLoading) {
    return <LoadingState />;
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
          <div className={`bg-amber-50 border border-amber-200 rounded-md flex items-center ${sizeVariants[size].layout.container} ${sizeVariants[size].layout.sectionSpacing}`}>
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
        
        {/* Header */}
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center ${sizeVariants[size].layout.sectionSpacing} ${sizeVariants[size].gap}`}>
          <div>
            <h1 className={`mainheading ${getTypographyClass('mainheading', size)}`}>Departments</h1>
            <p className={`text-muted-foreground mt-1 ${sizeVariants[size].typography.text}`}>
              Manage your organization's departments and their resources
            </p>
          </div>

          <Button onClick={() => setIsCreateDeptDialogOpen(true)}>
            <Plus className={`${sizeVariants[size].icon.size} ${sizeVariants[size].spacing.marginSm}`} />
            New Department
          </Button>
        </div>
        
        {/* Search */}
        <div className={`relative ${sizeVariants[size].layout.sectionSpacing} ${sizeVariants[size].layout.maxWidth}`}>
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
        
        {/* Departments Grid */}
        {filteredDepartments.length > 0 ? (
          <div className={getGridClasses('departments', size)}>
            {filteredDepartments.map((dept) => (
              <DepartmentCard
                key={dept.id}
                department={dept}
                machineCount={getMachineCount(dept.name)}
                colorClass={getDepartmentColor(dept.name)}
                size={size}
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
