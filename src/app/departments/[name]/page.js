"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useSizeContext } from "@/components/ui/size-provider";
import { 
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import dynamic from 'next/dynamic';

// Custom hooks
import { useDepartmentPage } from "./hooks/useDepartmentPage";

// Components
import { PcDetails } from "@/components/ui/pc-details";
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
    machines,
    detailsOpen,
    showToast,
    toastProps,
    activeTab,
    viewMode,
    sortBy,
    sortDirection,
    isCreateDeptDialogOpen,
    newDepartmentName,
    selectedPc,
    
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
    handleNewComputer
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
      <div className="p-6">
        <DepartmentHeader departmentName={department?.name} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabControls 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            viewMode={viewMode}
            onViewModeToggle={toggleViewMode}
            onNewComputer={handleNewComputer}
          />

          <TabsContent value="computers" className="mt-0">
            {machines.length > 0 ? (
              <>
                {viewMode === "grid" ? (
                  <MachineGrid 
                    machines={machines}
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
              <EmptyState onNewComputer={handleNewComputer} />
            )}
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <SecuritySection departmentId={department?.id} />
          </TabsContent>
        </Tabs>
      </div>

      <PcDetails
        open={detailsOpen}
        onOpenChange={handleDetailsClose}
        pc={selectedPc}
        onPlay={selectedPc ? () => handlePlayAction(selectedPc) : undefined}
        onPause={selectedPc ? () => handlePauseAction(selectedPc) : undefined}
        onStop={selectedPc ? () => handleStopAction(selectedPc) : undefined}
        onDelete={selectedPc ? () => handleDeleteAction(selectedPc.id) : undefined}
      />

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
      
      <ToastViewport />
    </ToastProvider>
  );
};

export default DepartmentPage;