import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

// Redux actions
import { 
  fetchVms, 
  selectMachine, 
  deselectMachine,
} from "@/state/slices/vms";
import { 
  fetchDepartmentByName, 
  fetchDepartments, 
  createDepartment 
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
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState({});
  const [activeTab, setActiveTab] = useState("computers");
  const [viewMode, setViewMode] = useState("grid"); // grid or table
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isCreateDeptDialogOpen, setIsCreateDeptDialogOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [selectedPc, setSelectedPc] = useState(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);

  // Redux state
  const departments = useSelector((state) => state.departments.items);
  const vms = useSelector((state) => state.vms.items);
  const departmentsLoading = useSelector((state) => state.departments.loading);
  const vmsLoading = useSelector((state) => state.vms.loading);
  
  // Derived state
  const department = departments.find(d => d.name.toLowerCase() === departmentName?.toLowerCase());
  const machines = filterMachinesByDepartment(vms, departmentName);
  const sortedMachines = getSortedMachines(machines, sortBy, sortDirection);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Fetch all departments if not already loaded
      if (departments.length === 0 && !departmentsLoading.fetch) {
        await dispatch(fetchDepartments());
      }
      
      // Fetch specific department data
      if (departmentName) {
        try {
          const result = await dispatch(fetchDepartmentByName(departmentName)).unwrap();
          // If the department wasn't found, we'll get null
          if (!result) {
            console.log(`Department ${departmentName} not found`);
          }
        } catch (error) {
          console.error(`Error fetching department ${departmentName}:`, error);
        }
      }
      
      // Fetch VMs if not already loaded
      if (vms.length === 0 && !vmsLoading.fetch) {
        await dispatch(fetchVms());
      }
      
      setIsLoading(false);
    };
    
    loadData();
  }, [dispatch, departmentName, departments.length, vms.length, departmentsLoading.fetch, vmsLoading.fetch]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && selectedPc) {
        dispatch(deselectMachine());
        setDetailsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, selectedPc]);

  // Handle PC selection
  const handlePcSelect = (machine) => {
    if (!machine) return;
    
    dispatch(selectMachine(machine));
    setDetailsOpen(true);
    setSelectedPc(machine);
  };

  // Handle details sheet close
  const handleDetailsClose = (open) => {
    setDetailsOpen(open);
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

  const handleDeleteAction = async (vmId) => {
    await handleDelete(
      dispatch, 
      vmId, 
      () => {
        setDetailsOpen(false);
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
      console.error("Failed to create department:", error);
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

  return {
    // State
    isLoading,
    department,
    machines: sortedMachines,
    detailsOpen,
    showToast,
    toastProps,
    activeTab,
    viewMode,
    sortBy,
    sortDirection,
    isCreateDeptDialogOpen,
    newDepartmentName,
    selectedPc,
    
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
    handleNewComputer
  };
};
