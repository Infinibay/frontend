"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:hooks:useComputerActions');

/**
 * The vms thunks reject via `rejectWithValue(error.message)` — a plain string.
 * `unwrap()` therefore throws that string, so `err.message` would be undefined
 * and every toast would collapse to its generic fallback. Normalize both the
 * string-reject and Error-object shapes back into a human-readable message.
 */
const errMessage = (err, fallback) =>
  (typeof err === 'string' ? err : err?.message) || fallback;
import {
  playVm,
  pauseVm,
  stopVm,
  deleteVm,
  deselectMachine,
} from "@/state/slices/vms";

export function useComputerActions() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    machine: null,
  });

  const handlePcSelect = (machine) => {
    // Navigate to VM view instead of opening the deprecated panel
    const departmentName = machine.department?.name;
    if (!departmentName) {
      debug.error('navigation', 'Cannot navigate to VM: department name is missing', machine);
      toast.error(
        `${machine?.name || 'This desktop'} has no department assigned, so its detail view can't be opened. Assign it to a department first.`
      );
      return;
    }
    router.push(`/departments/${encodeURIComponent(departmentName)}/desktops/${machine.id}`);
  };

  const handleDetailsClose = (open) => {
    // This function is kept for compatibility but doesn't need to do anything
    // since we're navigating to a new page instead of opening a panel
    if (!open) {
      dispatch(deselectMachine());
    }
  };

  const handlePlay = async (machine) => {
    try {
      await dispatch(playVm({ id: machine.id })).unwrap();
      toast.success("Machine started successfully");
    } catch (error) {
      toast.error(errMessage(error, "Failed to start machine"));
    }
  };

  const handlePause = async (machine) => {
    try {
      await dispatch(pauseVm({ id: machine.id })).unwrap();
      toast.success("Machine paused successfully");
    } catch (error) {
      toast.error(errMessage(error, "Failed to pause machine"));
    }
  };

  const handleStop = async (machine) => {
    try {
      debug.log('stop', 'Stopping machine:', machine);
      await dispatch(stopVm({ id: machine.id })).unwrap();
      toast.success("Machine stopped successfully");
    } catch (error) {
      toast.error(errMessage(error, "Failed to stop machine"));
    }
  };

  const handleDelete = (machine) => {
    // Open confirmation modal instead of deleting immediately
    setDeleteConfirmation({
      isOpen: true,
      machine: machine,
    });
  };

  const confirmDelete = async () => {
    const machine = deleteConfirmation.machine;
    if (!machine || isDeleting) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteVm({ id: machine.id })).unwrap();
      handleDetailsClose(false);
      toast.success("Machine deleted successfully");
      setDeleteConfirmation({ isOpen: false, machine: null });
    } catch (error) {
      toast.error(errMessage(error, "Failed to delete machine"));
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, machine: null });
  };

  return {
    handlePcSelect,
    handleDetailsClose,
    handlePlay,
    handlePause,
    handleStop,
    handleDelete,
    deleteConfirmation,
    confirmDelete,
    cancelDelete,
    isDeleting,
  };
}
