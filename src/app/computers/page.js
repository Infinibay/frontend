"use client"

// React and hooks
import React, { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { cn } from "@/lib/utils"
import { createDebugger } from "@/utils/debug"

const debug = createDebugger('frontend:pages:computers')

// UI Components
import { useSizeContext, sizeVariants } from "@/components/ui/size-provider";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
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

// Local components and hooks
import { ComputersHeader } from "./components/ComputersHeader";
import { ComputersList } from "./components/ComputersList";
import { useComputerActions } from "./hooks/useComputerActions";
import { groupMachinesByDepartment } from "./utils/groupMachines";

// Redux actions
import { fetchVms } from "@/state/slices/vms";
import { fetchDepartments } from "@/state/slices/departments";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import useEnsureData, { LOADING_STRATEGIES } from "@/hooks/useEnsureData";

/**
 * ComputersPage component for managing virtual machines
 * Features data fetching, error handling, and machine operations
 */
export default function ComputersPage() {
  // Context and size
  const { size } = useSizeContext();

  // UI State
  const [grid, setGrid] = useState(false);
  const [byDepartment, setByDepartment] = useState(true);

  // Redux state
  const dispatch = useDispatch();
  const selectedPc = useSelector((state) => state.vms.selectedMachine);

  // Use optimized data loading for VMs and departments
  const {
    data: machines,
    isLoading: vmsLoading,
    error: vmsError,
    refresh: refreshVms
  } = useEnsureData('vms', fetchVms, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 2 * 60 * 1000, // 2 minutes
  });

  const {
    data: departments,
    isLoading: departmentsLoading,
    error: departmentsError
  } = useEnsureData('departments', fetchDepartments, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 10 * 60 * 1000, // 10 minutes
  });

  // Combine loading and error states
  const loading = vmsLoading || departmentsLoading;
  const error = vmsError || departmentsError;

  // Check ISO availability
  const { isReady: hasISOs } = useSystemStatus({ checkOnMount: true });

  React.useEffect(() => {
    debug.log('render', 'ComputersPage rendered:', {
      machineCount: machines?.length || 0,
      departmentCount: departments?.length || 0,
      loading,
      hasError: !!error,
      hasISOs,
      viewMode: { grid, byDepartment }
    })
  }, [machines?.length, departments?.length, loading, error, hasISOs, grid, byDepartment])

  // Actions and handlers
  const {
    showToast,
    toastProps,
    setShowToast,
    handlePcSelect,
    handleDetailsClose,
    handlePlay,
    handlePause,
    handleStop,
    handleDelete,
    deleteConfirmation,
    confirmDelete,
    cancelDelete,
  } = useComputerActions();

  // Group machines by department
  const groupedMachines = groupMachinesByDepartment(byDepartment, machines || [], departments || []);

  // Enhanced refresh that uses the new data loading strategy
  const handleEnhancedRefresh = () => {
    debug.info('data', 'Refreshing VMs data via optimized loader');
    refreshVms();
  };

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && selectedPc) {
        handleDetailsClose(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPc, handleDetailsClose]);

  return (
    <ToastProvider>
      {showToast && (
        <Toast variant={toastProps.variant} onOpenChange={setShowToast}>
          <ToastTitle>{toastProps.title}</ToastTitle>
          <ToastDescription>{toastProps.description}</ToastDescription>
        </Toast>
      )}
      <ToastViewport />

      <ComputersHeader hasISOs={hasISOs} onRefresh={handleEnhancedRefresh} />

      <section className="flex-1 w-full">
        <div className={sizeVariants[size].layout.section}>
          <ComputersList
            loading={loading}
            error={error}
            groupedMachines={groupedMachines}
            byDepartment={byDepartment}
            grid={grid}
            selectedPc={selectedPc}
            onSelectMachine={handlePcSelect}
            size={size}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            onDelete={handleDelete}
          />
        </div>

      </section>

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
              Are you sure you want to delete <strong>{deleteConfirmation.machine?.name}</strong>?
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
    </ToastProvider>
  );
}
