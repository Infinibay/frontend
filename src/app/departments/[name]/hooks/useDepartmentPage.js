import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:hooks:useDepartmentPage');

// Redux actions
import { 
  selectMachine, 
  deselectMachine,
} from "@/state/slices/vms";
import {
  fetchDepartmentByName,
  createDepartment,
  fetchDepartments,
  updateDepartmentName
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

  // Get current user and check admin status
  const currentUser = useSelector((state) => state.auth.user);
  const isAdmin = currentUser?.role === 'ADMIN';

  // UI State
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState({});
  const [activeTab, setActiveTab] = useState("computers");
  const [viewMode, setViewMode] = useState("grid"); // grid or table
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isCreateDeptDialogOpen, setIsCreateDeptDialogOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [selectedPc, setSelectedPc] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    vm: null,
  });
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);

  // Redux state
  const departments = useSelector((state) => state.departments.items);
  const vms = useSelector((state) => state.vms.items);
  const departmentsLoading = useSelector((state) =>
    state.departments.loading.fetch ||
    state.departments.loading.fetchByName ||
    state.departments.loading.create
  );
  const nameUpdateLoading = useSelector((state) => state.departments.loading.updateName);
  
  // Derived state
  const department = departments.find(d => d.name.toLowerCase() === departmentName?.toLowerCase());
  const machines = filterMachinesByDepartment(vms, departmentName);
  const sortedMachines = getSortedMachines(machines, sortBy, sortDirection);

  // Fetch all departments if not loaded
  useEffect(() => {
    if (departments.length === 0 && !departmentsLoading) {
      dispatch(fetchDepartments());
    }
  }, [dispatch, departments.length, departmentsLoading]);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Fetch specific department data
      if (departmentName) {
        try {
          const result = await dispatch(fetchDepartmentByName(departmentName)).unwrap();
          // If the department wasn't found, we'll get null
          if (!result) {
            debug.warn('fetch', `Department ${departmentName} not found`);
          }
        } catch (error) {
          debug.error('fetch', `Error fetching department ${departmentName}:`, error);
        }
      }

      setIsLoading(false);
    };

    loadData();
  }, [dispatch, departmentName]);

  // Handle Escape key - now just deselects machine since we navigate to new page
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && selectedPc) {
        dispatch(deselectMachine());
        setSelectedPc(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, selectedPc]);

  // Handle PC selection - Navigate to VM view
  const handlePcSelect = (machine) => {
    if (!machine) return;
    
    // Navigate to VM view instead of opening the deprecated panel
    router.push(`/departments/${encodeURIComponent(departmentName)}/vm/${machine.id}`);
  };

  // Handle details sheet close - kept for compatibility but simplified
  const handleDetailsClose = (open) => {
    if (!open) {
      dispatch(deselectMachine());
      setSelectedPc(null);
    }
  };

  // VM action handlers with toast notifications
  const handlePlayAction = async (pc) => {
    await handlePlay(dispatch, pc || selectedPc);
  };

  const handlePauseAction = async (pc) => {
    await handlePause(dispatch, pc || selectedPc);
  };

  const handleStopAction = async (pc) => {
    await handleStop(dispatch, pc || selectedPc);
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

    await handleDelete(
      dispatch,
      vm.id,
      () => {
        setSelectedPc(null);
        setToastProps({
          variant: "success",
          title: "VM Deleted",
          description: "The virtual machine has been successfully deleted."
        });
        setShowToast(true);
      },
      (errorMessage) => {
        setToastProps({
          variant: "destructive",
          title: "Error",
          description: errorMessage
        });
        setShowToast(true);
      }
    );

    setDeleteConfirmation({ isOpen: false, vm: null });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, vm: null });
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(prev => prev === "grid" ? "table" : "grid");
  };

  // Sort machines
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    const trimmedName = newDepartmentName.trim();
    
    if (!trimmedName) {
      setIsCreateDeptDialogOpen(false);
      return;
    }

    try {
      await dispatch(createDepartment({ name: trimmedName })).unwrap();
      dispatch(fetchDepartments());
      setToastProps({
        variant: "success",
        title: "Department Created",
        description: `Department "${trimmedName}" has been successfully created.`
      });
      setShowToast(true);
    } catch (error) {
      debug.error('create', 'Failed to create department:', error);
      setToastProps({
        variant: "destructive",
        title: "Error",
        description: "Failed to create the department. Please try again."
      });
      setShowToast(true);
    }
    
    setNewDepartmentName("");
    setIsCreateDeptDialogOpen(false);
  };

  const handleNewComputer = () => {
    router.push(`/departments/${departmentName}/new`);
  };

  const handleDepartmentNameUpdate = async (newName) => {
    if (!department || !isAdmin) return;

    // Validate name is not empty
    if (!newName || newName.trim() === '') {
      setToastProps({
        variant: "destructive",
        title: "Error",
        description: "Department name cannot be empty."
      });
      setShowToast(true);
      return;
    }

    // Don't update if name hasn't changed
    if (newName.trim() === department.name) {
      return;
    }

    try {
      setToastProps({
        variant: "default",
        title: "Processing",
        description: "Updating department name..."
      });
      setShowToast(true);

      const input = {
        id: department.id,
        name: newName.trim()
      };

      await dispatch(updateDepartmentName(input)).unwrap();

      // Refresh departments list
      await dispatch(fetchDepartments());

      setToastProps({
        variant: "success",
        title: "Success",
        description: "Department name has been updated successfully."
      });
      setShowToast(true);

      // Navigate to the new department URL
      router.push(`/departments/${encodeURIComponent(newName.trim())}`);

    } catch (error) {
      debug.error('updateName', 'Failed to update department name:', error);
      const errorMessage = error?.message || "Could not update department name.";
      setToastProps({
        variant: "destructive",
        title: "Error",
        description: errorMessage
      });
      setShowToast(true);
    }
  };

  return {
    // State
    isLoading,
    department,
    departments,
    departmentsLoading,
    machines: sortedMachines,
    showToast,
    toastProps,
    activeTab,
    viewMode,
    sortBy,
    sortDirection,
    isCreateDeptDialogOpen,
    newDepartmentName,
    selectedPc,
    isAdmin,
    nameUpdateLoading,
    deleteConfirmation,

    // Actions
    setActiveTab,
    setShowToast,
    setToastProps,
    setIsCreateDeptDialogOpen,
    setNewDepartmentName,
    handlePcSelect,
    handleDetailsClose,
    handlePlayAction,
    handlePauseAction,
    handleStopAction,
    handleDeleteAction,
    toggleViewMode,
    handleSort,
    handleCreateDepartment,
    handleNewComputer,
    handleDepartmentNameUpdate,
    confirmDelete,
    cancelDelete,
  };
};
