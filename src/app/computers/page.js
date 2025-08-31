"use client";

// React and hooks
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";

// UI Components
import { useSizeContext, sizeVariants } from "@/components/ui/size-provider";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";

// Local components and hooks
import { ComputersHeader } from "./components/ComputersHeader";
import { ComputersList } from "./components/ComputersList";
import { useComputerActions } from "./hooks/useComputerActions";
import { groupMachinesByDepartment } from "./utils/groupMachines";

// Redux actions
import { fetchVms } from "@/state/slices/vms";
import { useSystemStatus } from "@/hooks/useSystemStatus";

export default function ComputersPage() {
  // Context and size
  const { size } = useSizeContext();

  // UI State
  const [grid, setGrid] = useState(false);
  const [byDepartment, setByDepartment] = useState(true);

  // Redux state
  const dispatch = useDispatch();
  const machines = useSelector((state) => state.vms.items);
  const departments = useSelector((state) => state.departments.items);
  const selectedPc = useSelector((state) => state.vms.selectedMachine);
  const loading = useSelector((state) => state.vms.loading?.fetch);
  const error = useSelector((state) => state.vms.error?.fetch);
  
  // Check ISO availability
  const { isReady: hasISOs } = useSystemStatus({ checkOnMount: true });

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
  } = useComputerActions();

  // Group machines by department
  const groupedMachines = groupMachinesByDepartment(byDepartment, machines || [], departments);

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

      <ComputersHeader hasISOs={hasISOs} />

      <section className="flex-1 p-4 md:p-8">
        <div className="space-y-4">
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
    </ToastProvider>
  );
}
