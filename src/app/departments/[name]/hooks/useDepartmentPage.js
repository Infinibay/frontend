import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:hooks:useDepartmentPage');

// Redux actions
import {
  fetchDepartmentByName,
  fetchDepartments,
} from "@/state/slices/departments";

// Utils
import {
  handlePlay,
  handlePause,
  handleStop,
  handleDelete
} from "../utils/vm-actions";
import {
  getSortedMachines,
  filterMachinesByDepartment
} from "../utils/machine-utils";

/**
 * Custom hook for managing department page state and logic
 */
export const useDepartmentPage = (departmentName) => {
  const dispatch = useDispatch();
  const router = useRouter();

  // UI State
  const [activeTab, setActiveTab] = useState("overview");
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    vm: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Loading / error states for the specific department fetch
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Redux state
  const departments = useSelector((state) => state.departments.items);
  const vms = useSelector((state) => state.vms.items);
  const departmentsLoading = useSelector((state) =>
    state.departments.loading.fetch ||
    state.departments.loading.fetchByName ||
    state.departments.loading.create
  );
  const departmentsFetchError = useSelector(
    (state) => state.departments.error.fetch
  );

  // Derived state
  const department = departments.find(
    (d) => d.name?.toLowerCase() === departmentName?.toLowerCase()
  );
  const machines = filterMachinesByDepartment(vms, departmentName);
  const sortedMachines = getSortedMachines(machines, "name", "asc");

  // Fetch all departments once if not loaded. Guard with a ref so a failed
  // (or legitimately empty) fetch does not re-trigger the effect forever.
  const autoFetchedRef = useRef(false);
  useEffect(() => {
    if (autoFetchedRef.current) return;
    if (
      departments.length === 0 &&
      !departmentsLoading &&
      !departmentsFetchError
    ) {
      autoFetchedRef.current = true;
      dispatch(fetchDepartments());
    }
  }, [dispatch, departments.length, departmentsLoading, departmentsFetchError]);

  // Load the specific department by name (decoded upstream by the page).
  const loadDepartment = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    if (departmentName) {
      try {
        const result = await dispatch(
          fetchDepartmentByName(departmentName)
        ).unwrap();
        if (!result) {
          debug.warn('fetch', `Department ${departmentName} not found`);
        }
      } catch (error) {
        debug.error('fetch', `Error fetching department ${departmentName}:`, error);
        setFetchError(
          typeof error === 'string'
            ? error
            : error?.message || 'Failed to load this department.'
        );
      }
    }

    setIsLoading(false);
  }, [dispatch, departmentName]);

  useEffect(() => {
    loadDepartment();
  }, [loadDepartment]);

  // Handle PC selection - Navigate to VM view.
  // departmentName is already decoded, so encode exactly once for the href.
  const handlePcSelect = (machine) => {
    if (!machine) return;
    router.push(
      `/departments/${encodeURIComponent(departmentName)}/desktops/${machine.id}`
    );
  };

  // VM action handlers (each surfaces its own error toast on failure)
  const handlePlayAction = async (pc) => {
    if (pc) await handlePlay(dispatch, pc);
  };

  const handlePauseAction = async (pc) => {
    if (pc) await handlePause(dispatch, pc);
  };

  const handleStopAction = async (pc) => {
    if (pc) await handleStop(dispatch, pc);
  };

  const handleDeleteAction = (vm) => {
    // Open confirmation modal instead of deleting immediately
    setDeleteConfirmation({
      isOpen: true,
      vm: vm,
    });
  };

  const confirmDelete = async () => {
    const vm = deleteConfirmation.vm;
    if (!vm) return;

    setIsDeleting(true);

    let succeeded = false;
    await handleDelete(
      dispatch,
      vm.id,
      () => {
        succeeded = true;
        toast.success('Desktop deleted', {
          description: `"${vm.name}" has been successfully deleted.`,
        });
      },
      (message) => {
        toast.error('Could not delete desktop', {
          description: message,
        });
      }
    );

    setIsDeleting(false);

    // Only close the confirmation dialog when the delete actually succeeded;
    // keep it open on failure so the user can retry.
    if (succeeded) {
      setDeleteConfirmation({ isOpen: false, vm: null });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, vm: null });
  };

  return {
    // State
    isLoading,
    department,
    departments,
    departmentsLoading,
    fetchError,
    machines: sortedMachines,
    activeTab,
    deleteConfirmation,
    isDeleting,

    // Actions
    setActiveTab,
    retryLoadDepartment: loadDepartment,
    handlePcSelect,
    handlePlayAction,
    handlePauseAction,
    handleStopAction,
    handleDeleteAction,
    confirmDelete,
    cancelDelete,
  };
};
