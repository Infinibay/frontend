import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

// Redux actions
import {
  fetchDepartments,
  createDepartment
} from "@/state/slices/departments";
import { fetchVms } from "@/state/slices/vms";
import { fetchInitialData } from "@/init";

// Mock data for development fallback
import { mockDepartments, mockVMs } from "../mock/mockData";

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';


/**
 * Custom hook for managing departments page state and logic
 */
export const useDepartmentsPage = () => {
  // For debugging only
  
  const dispatch = useDispatch();
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDeptDialogOpen, setIsCreateDeptDialogOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState({});
  const [useMockData, setUseMockData] = useState(false);
  const [localDepartments, setLocalDepartments] = useState([]);
  const [localVMs, setLocalVMs] = useState([]);
  
  
  // Redux state selectors
  const reduxDepartments = useSelector((state) => state.departments.items || []);
  const reduxVMs = useSelector((state) => state.vms.items || []);
  const departmentsLoading = useSelector((state) => state.departments.loading?.fetch || false);
  const vmsLoading = useSelector((state) => state.vms.loading?.fetch || false);
  
  // Use either mock data or redux data based on the useMockData flag
  const departments = useMockData ? localDepartments : reduxDepartments;
  const vms = useMockData ? localVMs : reduxVMs;
  
  // Switch from mock data to Redux data when Redux data becomes available
  useEffect(() => {
    if (useMockData && reduxDepartments.length > 0) {
      setUseMockData(false);
    }
  }, [useMockData, reduxDepartments.length]);

  // Check if we should use mock data (when Redux store is empty and in dev mode)
  // Add small delay to avoid races at mount
  useEffect(() => {
    if (isDev && reduxDepartments.length === 0 && !departmentsLoading && !useMockData) {
      const timer = setTimeout(() => {
        // Double-check conditions after delay
        if (reduxDepartments.length === 0 && !departmentsLoading) {
          setLocalDepartments(mockDepartments);
          setLocalVMs(mockVMs);
          setUseMockData(true);

          setToastProps({
            variant: "warning",
            title: "Using Mock Data",
            description: "No data available from Redux store. Using mock data for development."
          });
          setShowToast(true);
        }
      }, 500); // 500ms delay to avoid races

      return () => clearTimeout(timer);
    }
  }, [reduxDepartments.length, departmentsLoading, useMockData, isDev]);
  
  const retryLoading = useCallback(() => {
    setUseMockData(false);
    dispatch(fetchInitialData());
  }, [dispatch]);
  
  // Handle creating a new department
  const handleCreateDepartment = useCallback(async (e) => {
    e.preventDefault();
    const trimmedName = newDepartmentName.trim();
    
    if (!trimmedName) {
      setIsCreateDeptDialogOpen(false);
      return;
    }
    
    // If using mock data, handle creation locally
    if (useMockData) {
      const newDept = {
        id: `dept-${localDepartments.length + 1}`,
        name: trimmedName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setLocalDepartments([...localDepartments, newDept]);
      
      setToastProps({
        variant: "success",
        title: "Department Created",
        description: `Department "${trimmedName}" has been successfully created.`
      });
      setShowToast(true);
      
      setNewDepartmentName("");
      setIsCreateDeptDialogOpen(false);
      return;
    }
    
    // Otherwise use the API
    try {
      await dispatch(createDepartment({ name: trimmedName })).unwrap();
      
      try {
        await dispatch(fetchDepartments()).unwrap();
      } catch (fetchError) {
        // Continue anyway since the creation was successful
      }
      
      setToastProps({
        variant: "success",
        title: "Department Created",
        description: `Department "${trimmedName}" has been successfully created.`
      });
      setShowToast(true);
    } catch (error) {
      setToastProps({
        variant: "destructive",
        title: "Error",
        description: "Failed to create department. Please try again."
      });
      setShowToast(true);
    }
    
    setNewDepartmentName("");
    setIsCreateDeptDialogOpen(false);
  }, [dispatch, newDepartmentName, useMockData, localDepartments]);
  
  // Filter departments based on search query
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Count machines in each department
  const getMachineCount = useCallback((departmentName) => {
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
    useMockData,

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
