import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

// Redux actions
import {
  fetchDepartments,
  createDepartment,
  deleteDepartment
} from "@/state/slices/departments";
import { fetchVms } from "@/state/slices/vms";

// Optimized data loading
import useEnsureData, { LOADING_STRATEGIES } from "@/hooks/useEnsureData";
import { createDebugger } from "@/utils/debug";

const debug = createDebugger('frontend:hooks:departments-page');


/**
 * Custom hook for managing departments page state and logic
 */
export const useDepartmentsPage = () => {
  const dispatch = useDispatch();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDeptDialogOpen, setIsCreateDeptDialogOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  // Use optimized data loading for departments and VMs
  const {
    data: departments,
    isLoading: departmentsLoading,
    error: departmentsError,
    refresh: refreshDepartments
  } = useEnsureData('departments', fetchDepartments, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 10 * 60 * 1000, // 10 minutes
  });

  const {
    data: vms,
    isLoading: vmsLoading,
    error: vmsError,
    refresh: refreshVms
  } = useEnsureData('vms', fetchVms, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 2 * 60 * 1000, // 2 minutes
  });

  debug.info('Data state:', {
    departmentsCount: departments?.length || 0,
    vmsCount: vms?.length || 0,
    departmentsLoading,
    vmsLoading,
    hasErrors: !!(departmentsError || vmsError)
  });
  
  // Retry mechanism for failed data loading. Refresh BOTH resources: the
  // Retry button is shared by the fatal (departments) error state and the
  // non-fatal (vms) warning banner, so it must recover whichever failed.
  const retryLoading = useCallback(async () => {
    debug.info('Retrying data loading...');
    // Fire both refreshes in parallel and swallow rejections individually: a
    // still-failing resource keeps its own error UI, and one failure must not
    // prevent the other from recovering (nor cause an unhandled rejection).
    await Promise.allSettled([
      Promise.resolve(refreshDepartments()).catch((retryError) => {
        debug.error('Departments retry failed:', retryError);
      }),
      Promise.resolve(refreshVms()).catch((retryError) => {
        debug.error('VMs retry failed:', retryError);
      })
    ]);
  }, [refreshDepartments, refreshVms]);
  
  // Handle creating a new department
  const handleCreateDepartment = useCallback(async (e, formData) => {
    e.preventDefault();
    const trimmedName = formData?.name || newDepartmentName.trim();

    if (!trimmedName) {
      setIsCreateDeptDialogOpen(false);
      return;
    }

    debug.info('Creating department:', trimmedName, 'with firewall config:', formData);
    setIsCreating(true);
    setCreateError(null); // Clear previous error

    try {
      // Build the input object with optional firewall configuration
      const input = {
        name: trimmedName,
        firewallConfig: formData?.firewallPolicy ? {
          firewallPolicy: formData.firewallPolicy,
          firewallDefaultConfig: formData.firewallDefaultConfig
        } : null
      };

      await dispatch(createDepartment(input)).unwrap();

      // Refresh departments to get the updated list (best-effort; the create
      // already succeeded, so don't surface a refresh failure as a create error)
      Promise.resolve(refreshDepartments()).catch(() => {});

      toast.success("Department Created", {
        description: `Department "${trimmedName}" has been successfully created.`
      });

      debug.info('Department created successfully:', trimmedName);

      // Only close dialog and reset on success
      setNewDepartmentName("");
      setIsCreateDeptDialogOpen(false);
    } catch (error) {
      debug.error('Failed to create department:', error);
      // Show error inline in the modal instead of toast (avoids z-index issues)
      setCreateError(error.message || "Failed to create department. Please try again.");
    } finally {
      setIsCreating(false);
    }
  }, [dispatch, newDepartmentName, refreshDepartments]);

  // Handle deleting a department
  const handleDeleteDepartment = useCallback(async (departmentId, departmentName, error) => {
    debug.info('Deleting department:', { departmentId, departmentName });

    // If error is provided (from resource fetch), show error toast
    if (error) {
      debug.error('Failed to fetch department resources:', error);
      toast.error("Error", {
        description: "Failed to load department information. Please try again."
      });
      return;
    }

    try {
      await dispatch(deleteDepartment({ id: departmentId })).unwrap();

      // Refresh departments to get the updated list (best-effort)
      Promise.resolve(refreshDepartments()).catch(() => {});

      toast.success("Department Deleted", {
        description: `Department "${departmentName}" has been successfully deleted.`
      });

      debug.info('Department deleted successfully:', departmentName);
    } catch (deleteError) {
      debug.error('Failed to delete department:', deleteError);
      toast.error("Error", {
        description: deleteError.message || "Failed to delete department. Please try again."
      });
      // Re-throw so the caller can handle dialog state
      throw deleteError;
    }
  }, [dispatch, refreshDepartments]);

  // Filter departments based on search query
  const filteredDepartments = (departments || []).filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count machines in each department
  const getMachineCount = useCallback((departmentName) => {
    if (!vms) return 0;
    return vms.filter(vm =>
      vm.department?.name?.toLowerCase() === departmentName.toLowerCase()
    ).length;
  }, [vms]);

  // Wrapper to clear error when dialog is closed
  const handleSetIsCreateDeptDialogOpen = useCallback((open) => {
    setIsCreateDeptDialogOpen(open);
    if (!open) {
      setCreateError(null); // Clear error when closing dialog
    }
  }, []);

  return {
    // State
    isLoading: departmentsLoading,
    vmsLoading,
    searchQuery,
    isCreateDeptDialogOpen,
    newDepartmentName,
    filteredDepartments,
    // Legacy combined flags kept for backward compatibility. Prefer the split
    // fatal/non-fatal flags below — a VMs-only failure must NOT blank the page.
    hasError: !!(departmentsError || vmsError),
    error: departmentsError || vmsError,
    // FATAL: departments failed to load, so the page cannot render its list —
    // show the full-page error state. Derived from departmentsError ONLY.
    hasFatalError: !!departmentsError,
    fatalError: departmentsError || null,
    // NON-FATAL: the desktop inventory (vms) failed but departments loaded, so
    // render the page normally plus a dismissible warning. Machine counts and
    // running badges just degrade to their empty/zero fallbacks meanwhile.
    vmsError: vmsError || null,
    isCreating,
    createError,

    // Actions
    retryLoading,
    setSearchQuery,
    setIsCreateDeptDialogOpen: handleSetIsCreateDeptDialogOpen,
    setNewDepartmentName,
    handleCreateDepartment,
    handleDeleteDepartment,
    refreshDepartments,
    getMachineCount
  };
};
