"use client"

// React and hooks
import React, { useState, useEffect, useRef, useMemo } from "react"
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
import { AlertCircle, Monitor, Power, HardDrive, Network, Filter } from "lucide-react";

// Local components and hooks
import { ComputersList } from "./components/ComputersList";
import { useComputerActions } from "./hooks/useComputerActions";
import { groupMachinesByDepartment } from "./utils/groupMachines";

// Redux actions
import { fetchVms } from "@/state/slices/vms";
import { fetchDepartments } from "@/state/slices/departments";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import useEnsureData, { LOADING_STRATEGIES } from "@/hooks/useEnsureData";
import { usePageHeader } from '@/hooks/usePageHeader';
import { useRouter } from "next/navigation";

/**
 * ComputersPage component for managing virtual machines
 * Features data fetching, error handling, and machine operations
 */
export default function ComputersPage() {
  // Context and size
  const { size } = useSizeContext();
  const router = useRouter();

  // UI State
  const [grid, setGrid] = useState(false);
  const [byDepartment, setByDepartment] = useState(true);

  // Redux state
  const dispatch = useDispatch();
  const selectedPc = useSelector((state) => state.vms.selectedMachine);
  const pendingActions = useSelector((state) => state.vms.pendingActions);

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

  const handleNewVM = () => {
    debug.info('navigation', 'Create VM navigation triggered');
    router.push('/computers/create');
  };

  // Help configuration
  const helpConfig = useMemo(() => ({
    title: "Computers Help",
    description: "Learn how to manage virtual machines and computer resources",
    icon: <Monitor className="h-5 w-5 text-primary" />,
    sections: [
      {
        id: "managing-vms",
        title: "Managing Virtual Machines",
        icon: <Monitor className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">Creating VMs</p>
              <p>The "New" button creates VMs. Note that at least one ISO must be uploaded before creating VMs.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Viewing VMs</p>
              <p>VMs are displayed in grid or table view, grouped by department for easier management.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">VM Operations</p>
              <p>Control VMs using power buttons (play to start, pause to suspend, stop to shut down), edit settings, or delete VMs.</p>
            </div>
          </div>
        ),
      },
      {
        id: "power-management",
        title: "Power Management",
        icon: <Power className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">Starting VMs</p>
              <p>Click the play button to boot a stopped VM.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Pausing VMs</p>
              <p>Temporarily suspend VM execution to free resources.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Stopping VMs</p>
              <p>Gracefully shut down running VMs.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Status Indicators</p>
              <p>Color-coded badges show VM state: running (green), stopped (red), or paused (yellow).</p>
            </div>
          </div>
        ),
      },
      {
        id: "organization",
        title: "Organization",
        icon: <HardDrive className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">Department Grouping</p>
              <p>VMs are organized by department for easier management and access control.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">View Modes</p>
              <p>Toggle between grid (visual cards) and table (detailed list) views.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Filtering</p>
              <p>Filter VMs by status, department, or user assignment to quickly find what you need.</p>
            </div>
          </div>
        ),
      },
      {
        id: "requirements",
        title: "System Requirements",
        icon: <Network className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <div>
              <p className="font-medium text-foreground mb-1">ISO Images</p>
              <p>At least one ISO must be uploaded before creating VMs. Upload ISOs in Settings.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Templates</p>
              <p>VMs are created from templates that define the base configuration.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Resources</p>
              <p>Ensure sufficient host resources (CPU, RAM, storage) are available for VM allocation.</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Network</p>
              <p>VMs require network configuration for connectivity to other systems.</p>
            </div>
          </div>
        ),
      },
    ],
    quickTips: [
      "Upload an ISO in Settings before creating your first VM",
      "Use department grouping to organize VMs by team or project",
      "Click on a VM card to view detailed information and controls",
      "The refresh button reloads the VM list to show latest changes",
    ],
  }), []);

  // Configure header
  usePageHeader({
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Computers', isCurrent: true }
    ],
    title: 'Computers',
    actions: [
      {
        id: 'refresh',
        label: '',
        icon: 'RefreshCw',
        variant: 'outline',
        size: 'sm',
        onClick: handleEnhancedRefresh,
        loading: vmsLoading,
        disabled: vmsLoading,
        tooltip: vmsLoading ? 'Refreshing...' : vmsError ? 'Retry loading machines' : 'Refresh machines',
        className: vmsError ? 'border-destructive text-destructive hover:bg-destructive/10 whitespace-nowrap' : 'whitespace-nowrap'
      },
      ...(hasISOs ? [{
        id: 'new-vm',
        label: 'New',
        icon: 'Plus',
        variant: 'default',
        size: 'sm',
        onClick: handleNewVM,
        tooltip: 'Create new VM',
        className: 'whitespace-nowrap'
      }] : [{
        id: 'new-vm-disabled',
        label: 'New',
        icon: 'AlertCircle',
        variant: 'secondary',
        size: 'sm',
        onClick: () => {}, // No action when disabled
        disabled: true,
        tooltip: 'Upload an ISO image first to create VMs',
        className: 'whitespace-nowrap'
      }])
    ],
    helpConfig: helpConfig,
    helpTooltip: 'Computers help'
  }, [vmsLoading, vmsError, hasISOs]);

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
            pendingActions={pendingActions}
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
