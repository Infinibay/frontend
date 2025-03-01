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
      <div className="p-6">
        {/* Mock Data Banner */}
        {useMockData && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-6 flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
            <div>
              <p className="text-amber-800 font-medium">Using Mock Data</p>
              <p className="text-amber-700 text-sm">
                Could not connect to the API. Displaying mock data for development.
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-amber-800 underline ml-1"
                  onClick={retryLoading}
                >
                  Try again
                </Button>
              </p>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Departments</h1>
            <p className="text-gray-500 mt-1">
              Manage your organization's departments and their resources
            </p>
          </div>
          
          <Button onClick={() => setIsCreateDeptDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Department
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search departments..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Departments Grid */}
        {filteredDepartments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredDepartments.map((dept) => (
              <DepartmentCard
                key={dept.id}
                department={dept}
                machineCount={getMachineCount(dept.name)}
                colorClass={getDepartmentColor(dept.name)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            searchQuery={searchQuery}
            onCreateDepartment={() => setIsCreateDeptDialogOpen(true)}
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
