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
import { Header, HeaderLeft, HeaderCenter, HeaderRight } from "@/components/ui/header";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
    handleDeleteDepartment,
    refreshDepartments,
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
        <Header
          variant="glass"
          elevated
          sticky={true}
          style={{ top: 0 }}
          className="z-30"
        >
          <HeaderLeft className="w-[200px]">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Departments</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </HeaderLeft>
          <HeaderCenter>
            <h1 className="text-lg sm:text-2xl font-medium text-foreground">
              Departments
            </h1>
          </HeaderCenter>
          <HeaderRight className="w-[200px] flex items-center justify-end space-x-2">
            <Button onClick={() => setIsCreateDeptDialogOpen(true)}>
              <Plus className={`${sizeVariants[size].icon.size} ${sizeVariants[size].spacing.marginSm}`} />
              New Department
            </Button>
          </HeaderRight>
        </Header>

        {/* Content container with glass effect */}
        <div className="glass-medium rounded-lg border border-white/20 mx-4 my-4 p-6">
          {/* Subtitle section */}
          <div className={`${sizeVariants[size].layout.container} pb-6`}>
            <p className={`text-glass-text-primary ${sizeVariants[size].typography.text} text-left`}>
              Manage your organization's departments and their resources
            </p>
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
