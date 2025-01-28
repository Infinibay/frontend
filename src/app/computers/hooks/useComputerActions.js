"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
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
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState({});

  const handlePcSelect = (machine) => {
    dispatch(selectMachine(machine));
    setDetailsOpen(true);
  };

  const handleDetailsClose = (open) => {
    setDetailsOpen(open);
    if (!open) {
      dispatch(deselectMachine());
    }
  };

  const handlePlay = async (machine) => {
    try {
      await dispatch(playVm({ id: machine.id })).unwrap();
      await dispatch(fetchVms());
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
      await dispatch(fetchVms());
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
      console.log("Stopping machine:", machine);
      await dispatch(stopVm({ id: machine.id })).unwrap();
      await dispatch(fetchVms());
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

  const handleDelete = async (machine) => {
    try {
      await dispatch(deleteVm({ id: machine.id })).unwrap();
      await dispatch(fetchVms());
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
  };

  return {
    detailsOpen,
    showToast,
    toastProps,
    setShowToast,
    handlePcSelect,
    handleDetailsClose,
    handlePlay,
    handlePause,
    handleStop,
    handleDelete,
  };
}
