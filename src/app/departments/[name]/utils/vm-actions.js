/**
 * Utility functions for VM actions in the department page
 */
import { 
  playVm,
  pauseVm,
  stopVm,
  deleteVm,
  fetchVms,
  deselectMachine
} from "@/state/slices/vms";

/**
 * Handles playing a VM
 * @param {Object} dispatch - Redux dispatch function
 * @param {Object} pc - The PC/VM to play
 * @returns {Promise<void>}
 */
export const handlePlay = async (dispatch, pc) => {
  if (pc) {
    await dispatch(playVm({ id: pc.id }));
    dispatch(fetchVms());
  }
};

/**
 * Handles pausing a VM
 * @param {Object} dispatch - Redux dispatch function
 * @param {Object} pc - The PC/VM to pause
 * @returns {Promise<void>}
 */
export const handlePause = async (dispatch, pc) => {
  if (pc) {
    await dispatch(pauseVm({ id: pc.id }));
    dispatch(fetchVms());
  }
};

/**
 * Handles stopping a VM
 * @param {Object} dispatch - Redux dispatch function
 * @param {Object} pc - The PC/VM to stop
 * @returns {Promise<void>}
 */
export const handleStop = async (dispatch, pc) => {
  if (pc) {
    await dispatch(stopVm({ id: pc.id }));
    dispatch(fetchVms());
  }
};

/**
 * Handles deleting a VM
 * @param {Object} dispatch - Redux dispatch function
 * @param {string} vmId - The VM ID to delete
 * @param {Function} onSuccess - Callback function on successful deletion
 * @param {Function} onError - Callback function on error
 * @returns {Promise<void>}
 */
export const handleDelete = async (dispatch, vmId, onSuccess, onError) => {
  if (!vmId) {
    console.error("Cannot delete VM: No VM ID provided");
    onError?.("Failed to delete the virtual machine: No VM ID provided.");
    return;
  }
  
  try {
    await dispatch(deleteVm({ id: vmId })).unwrap();
    dispatch(fetchVms());
    dispatch(deselectMachine());
    onSuccess?.();
  } catch (error) {
    console.error("Failed to delete VM:", error);
    onError?.("Failed to delete the virtual machine. Please try again.");
  }
};
