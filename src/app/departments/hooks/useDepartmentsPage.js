import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";

// Redux actions
import {
  fetchDepartments,
  createDepartment
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
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState({});

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
    error: vmsError
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
  
  // Retry mechanism for failed data loading
  const retryLoading = useCallback(() => {
    debug.info('Retrying data loading...');
    refreshDepartments();
  }, [refreshDepartments]);
  
  // Handle creating a new department
  const handleCreateDepartment = useCallback(async (e) => {
    e.preventDefault();
    const trimmedName = newDepartmentName.trim();

    if (!trimmedName) {
      setIsCreateDeptDialogOpen(false);
      return;
    }

    debug.info('Creating department:', trimmedName);

    try {
      await dispatch(createDepartment({ name: trimmedName })).unwrap();

      // Refresh departments to get the updated list
      refreshDepartments();

      setToastProps({
        variant: "success",
        title: "Department Created",
        description: `Department "${trimmedName}" has been successfully created.`
      });
      setShowToast(true);

      debug.info('Department created successfully:', trimmedName);
    } catch (error) {
      debug.error('Failed to create department:', error);
      setToastProps({
        variant: "destructive",
        title: "Error",
        description: "Failed to create department. Please try again."
      });
      setShowToast(true);
    }

    setNewDepartmentName("");
    setIsCreateDeptDialogOpen(false);
  }, [dispatch, newDepartmentName, refreshDepartments]);
  
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

  // Get a color based on department name (for visual variety)
  const getDepartmentColor = useCallback((name) => {
    const colors = [
      "bg-blue-100 text-blue-800 border-blue-300",
      "bg-green-100 text-green-800 border-green-300",
      "bg-purple-100 text-purple-800 border-purple-300",
      "bg-amber-100 text-amber-800 border-amber-300",
      "bg-rose-100 text-rose-800 border-rose-300",
      "bg-indigo-100 text-indigo-800 border-indigo-300",
      "bg-cyan-100 text-cyan-800 border-cyan-300",
    ];

    // Use the sum of char codes to determine a consistent color for each name
    const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  }, []);

  return {
    // State
    isLoading: departmentsLoading,
    vmsLoading,
    searchQuery,
    isCreateDeptDialogOpen,
    newDepartmentName,
    showToast,
    toastProps,
    filteredDepartments,
    hasError: !!(departmentsError || vmsError),
    error: departmentsError || vmsError,

    // Actions
    retryLoading,
    setSearchQuery,
    setIsCreateDeptDialogOpen,
    setNewDepartmentName,
    setShowToast,
    handleCreateDepartment,
    getMachineCount,
    getDepartmentColor
  };
};
