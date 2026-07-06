/**
 * Utility functions for VM actions in the department page
 */
import {
  playVm,
  pauseVm,
  stopVm,
  deleteVm,
  deselectMachine
} from "@/state/slices/vms";
import { toast } from "sonner";
import { createDebugger } from "@/utils/debug";

const debug = createDebugger('frontend:utils:vm-actions');

const errorMessage = (error, fallback) => {
  if (typeof error === 'string') return error;
  return error?.message || fallback;
};

/**
 * Handles playing a VM
 * @param {Object} dispatch - Redux dispatch function
 * @param {Object} pc - The PC/VM to play
 * @returns {Promise<void>}
 */
export const handlePlay = async (dispatch, pc) => {
  if (!pc) return;
  try {
    // playVm.fulfilled already sets this row's status to "running", and the
    // realtime power_on event reconciles it — no fetchVms() needed. A full
    // fetchVms() here replaced the ENTIRE items array, reflowing every desktop
    // card in the grid on a single VM's action (visible flicker).
    await dispatch(playVm({ id: pc.id })).unwrap();
  } catch (error) {
    debug.error('play', 'Failed to start VM:', error);
    toast.error(
      `Could not start ${pc.name || 'desktop'}: ${errorMessage(error, 'Please try again.')}`
    );
  }
};

/**
 * Handles pausing a VM
 * @param {Object} dispatch - Redux dispatch function
 * @param {Object} pc - The PC/VM to pause
 * @returns {Promise<void>}
 */
export const handlePause = async (dispatch, pc) => {
  if (!pc) return;
  try {
    // pauseVm.fulfilled sets this row to "suspended" and the realtime event
    // reconciles it — no full-grid fetchVms() reflow.
    await dispatch(pauseVm({ id: pc.id })).unwrap();
  } catch (error) {
    debug.error('pause', 'Failed to pause VM:', error);
    toast.error(
      `Could not pause ${pc.name || 'desktop'}: ${errorMessage(error, 'Please try again.')}`
    );
  }
};

/**
 * Handles stopping a VM
 * @param {Object} dispatch - Redux dispatch function
 * @param {Object} pc - The PC/VM to stop
 * @returns {Promise<void>}
 */
export const handleStop = async (dispatch, pc) => {
  if (!pc) return;
  try {
    // stopVm.fulfilled sets this row to "off" and the realtime event reconciles
    // it — no full-grid fetchVms() reflow.
    await dispatch(stopVm({ id: pc.id })).unwrap();
  } catch (error) {
    debug.error('stop', 'Failed to stop VM:', error);
    toast.error(
      `Could not stop ${pc.name || 'desktop'}: ${errorMessage(error, 'Please try again.')}`
    );
  }
};

/**
 * Handles deleting a VM
 * @param {Object} dispatch - Redux dispatch function
 * @param {string} vmId - The VM ID to delete
 * @param {Function} onSuccess - Callback function on successful deletion
 * @param {Function} onError - Callback function on error, receives the message
 * @returns {Promise<void>}
 */
export const handleDelete = async (dispatch, vmId, onSuccess, onError) => {
  if (!vmId) {
    debug.error('delete', 'Cannot delete VM: No VM ID provided');
    onError?.("Failed to delete the desktop: No VM ID provided.");
    return;
  }

  try {
    // deleteVm.fulfilled already removes this row from the grid (and the realtime
    // delete event reconciles it) — no full-grid fetchVms() reflow.
    await dispatch(deleteVm({ id: vmId })).unwrap();
    dispatch(deselectMachine());
    onSuccess?.();
  } catch (error) {
    debug.error('delete', 'Failed to delete VM:', error);
    onError?.(errorMessage(error, 'Failed to delete the desktop. Please try again.'));
  }
};
