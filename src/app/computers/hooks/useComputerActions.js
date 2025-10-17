"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:hooks:useComputerActions');
import {
  playVm,
  pauseVm,
  stopVm,
  deleteVm,
  selectMachine,
  deselectMachine,
  fetchVms,
} from "@/state/slices/vms";

export function useComputerActions() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState({});
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    machine: null,
  });

  const handlePcSelect = (machine) => {
    // Navigate to VM view instead of opening the deprecated panel
    const departmentName = machine.department?.name;
    if (!departmentName) {
      debug.error('navigation', 'Cannot navigate to VM: department name is missing', machine);
      return;
    }
    router.push(`/departments/${encodeURIComponent(departmentName)}/vm/${machine.id}`);
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
      setToastProps({
        title: "Success",
        description: "Machine started successfully",
        variant: "success",
      });
    } catch (error) {
      setToastProps({
        title: "Error",
        description: error.message || "Failed to start machine",
        variant: "destructive",
      });
    }
    setShowToast(true);
  };

  const handlePause = async (machine) => {
    try {
      await dispatch(pauseVm({ id: machine.id })).unwrap();
      setToastProps({
        title: "Success",
        description: "Machine paused successfully",
        variant: "success",
      });
    } catch (error) {
      setToastProps({
        title: "Error",
        description: error.message || "Failed to pause machine",
        variant: "destructive",
      });
    }
    setShowToast(true);
  };

  const handleStop = async (machine) => {
    try {
      debug.log('stop', 'Stopping machine:', machine);
      await dispatch(stopVm({ id: machine.id })).unwrap();
      setToastProps({
        title: "Success",
        description: "Machine stopped successfully",
        variant: "success",
      });
    } catch (error) {
      setToastProps({
        title: "Error",
        description: error.message || "Failed to stop machine",
        variant: "destructive",
      });
    }
    setShowToast(true);
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
    if (!machine) return;

    try {
      await dispatch(deleteVm({ id: machine.id })).unwrap();
      handleDetailsClose(false);
      setToastProps({
        title: "Success",
        description: "Machine deleted successfully",
        variant: "success",
      });
    } catch (error) {
      setToastProps({
        title: "Error",
        description: error.message || "Failed to delete machine",
        variant: "destructive",
      });
    }
    setShowToast(true);
    setDeleteConfirmation({ isOpen: false, machine: null });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, machine: null });
  };

  const handleRefresh = async () => {
    try {
      await dispatch(fetchVms()).unwrap();
      setToastProps({
        title: "Success",
        description: "Machines data refreshed successfully",
        variant: "success",
      });
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || '';
      const isNetworkError = /Network error|fetch|connection/i.test(msg);
      setToastProps({
        title: "Refresh Error",
        description: msg || "Failed to refresh machines data",
        variant: "destructive",
      });
    }
    setShowToast(true);
  };

  return {
    showToast,
    toastProps,
    setShowToast,
    handlePcSelect,
    handleDetailsClose,
    handlePlay,
    handlePause,
    handleStop,
    handleDelete,
    handleRefresh,
    deleteConfirmation,
    confirmDelete,
    cancelDelete,
  };
}
