"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useSizeContext, sizeVariants } from "@/components/ui/size-provider";
import {
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import dynamic from 'next/dynamic';
import { getGlassClasses } from '@/utils/glass-effects';
import { cn } from '@/lib/utils';

// Custom hooks
import { useDepartmentPage } from "./hooks/useDepartmentPage";

// Components
import LoadingState from "./components/LoadingState";
import NotFound from "./components/NotFound";
import DepartmentHeader from "./components/DepartmentHeader";
import TabControls from "./components/TabControls";
import MachineGrid from "./components/MachineGrid";
import MachineTable from "./components/MachineTable";
import EmptyState from "./components/EmptyState";
import ToastNotification from "./components/ToastNotification";
import CreateDepartmentDialog from "./components/CreateDepartmentDialog";

// Lazy-loaded components
const SecuritySection = dynamic(() => import('./components/SecuritySection.jsx'), { 
  ssr: false,
  loading: () => <div className="p-4">Loading security settings...</div>
});

/**
 * Department Page Component
 * Displays department information, computers, and security settings
 */
const DepartmentPage = () => {
  const params = useParams();
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

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // If department not found
  if (departmentName && !department) {
    return <NotFound departmentName={params.name} />;
  }

  return (
    <ToastProvider>
      <div className="w-full">
        <DepartmentHeader
          departmentName={department?.name}
          isLoading={departmentsLoading}
          onNewComputer={handleNewComputer}
          isAdmin={isAdmin}
          onNameUpdate={handleDepartmentNameUpdate}
          nameUpdateLoading={nameUpdateLoading}
        />

        {/* Main content container with consistent spacing */}
        <div className="px-6 py-4 space-y-6">
          {/* Subtitle section */}
          <div className={cn(
            getGlassClasses({ glass: 'subtle', elevation: 1, radius: 'md' }),
            "size-padding"
          )}>
            <p className="text-glass-text-primary">
              Manage virtual machines and security settings for the {department?.name} department
            </p>
          </div>

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
      />

      <ToastNotification
        show={showToast}
        variant={toastProps.variant}
        title={toastProps.title}
        description={toastProps.description}
        onOpenChange={(open) => !open && setShowToast(false)}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmation.isOpen} onOpenChange={cancelDelete}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <DialogTitle>Delete Virtual Machine</DialogTitle>
            </div>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteConfirmation.vm?.name}</strong>?
              This action cannot be undone and all data associated with this virtual machine will be permanently removed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 mt-6">
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ToastViewport />
    </ToastProvider>
  );
};

export default DepartmentPage;