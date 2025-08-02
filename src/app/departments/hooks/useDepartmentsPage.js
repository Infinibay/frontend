import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

// Redux actions
import { 
  fetchDepartments, 
  createDepartment 
} from "@/state/slices/departments";
import { fetchVms } from "@/state/slices/vms";

// Mock data for development fallback
import { mockDepartments, mockVMs } from "../mock/mockData";

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

// Create a singleton object outside the hook to store persistent data
const persistentData = {
  isInitialized: false,
  isFetchingDepartments: false,
  isFetchingVMs: false
};

/**
 * Custom hook for managing departments page state and logic
 */
export const useDepartmentsPage = () => {
  // For debugging only
  
  const dispatch = useDispatch();
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDeptDialogOpen, setIsCreateDeptDialogOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState({});
  const [useMockData, setUseMockData] = useState(false);
  const [localDepartments, setLocalDepartments] = useState([]);
  const [localVMs, setLocalVMs] = useState([]);
  
  // Mounting ref to track the first mount
  const isMounted = useRef(false);
  
  // Redux state selectors using memorization to prevent unnecessary renders
  const reduxDepartments = useSelector((state) => state.departments.items || []);
  const reduxVMs = useSelector((state) => state.vms.items || []);
  const vmsLoading = useSelector((state) => state.vms.loading || {});
  
  // Use either mock data or redux data based on the useMockData flag
  const departments = useMockData ? localDepartments : reduxDepartments;
  const vms = useMockData ? localVMs : reduxVMs;
  
  // Fetch departments data but only on first mount
  useEffect(() => {
    // On first render, check if we need to initialize our data
    if (!isMounted.current) {
      isMounted.current = true;
      
      // If we've already initialized the data via the persistent object, don't fetch again
      if (persistentData.isInitialized) {
        setIsLoading(false);
        return;
      }
      
      // Start loading data
      const fetchData = async () => {
        // Prevent concurrent fetches
        if (persistentData.isFetchingDepartments) {
          return;
        }
        
        persistentData.isFetchingDepartments = true;
        setIsLoading(true);
        
        try {
          const result = await dispatch(fetchDepartments()).unwrap();
          
          // Mark as initialized to prevent future fetches
          persistentData.isInitialized = true;
          setUseMockData(false);
          
          // Now fetch VMs if we've got departments
          if (result && result.length > 0 && !persistentData.isFetchingVMs) {
            try {
              persistentData.isFetchingVMs = true;
              await dispatch(fetchVms()).unwrap();
            } catch (vmError) {
              // Continue anyway, we can at least show departments
            } finally {
              persistentData.isFetchingVMs = false;
            }
          }
        } catch (error) {
          
          // If in development, use mock data
          if (isDev) {
            setLocalDepartments(mockDepartments);
            setLocalVMs(mockVMs);
            setUseMockData(true);
            
            // Show toast
            setToastProps({
              variant: "warning",
              title: "Using Mock Data",
              description: "Could not connect to the API. Using mock data for development."
            });
            setShowToast(true);
          } else {
            // In production, show error
            setHasError(true);
            setToastProps({
              variant: "destructive",
              title: "Connection Error",
              description: "Failed to load data. Please check your connection and try again."
            });
            setShowToast(true);
          }
        } finally {
          persistentData.isFetchingDepartments = false;
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [dispatch]); // Include dispatch in dependency array
  
  // Memoize retry function to avoid recreating it on every render
  const retryLoading = useCallback(() => {
    
    // Reset flags to allow fetching again
    persistentData.isInitialized = false;
    persistentData.isFetchingDepartments = false;
    persistentData.isFetchingVMs = false;
    
    setIsLoading(true);
    setHasError(false);
    setUseMockData(false);
    
    // Fetch data again
    const fetchData = async () => {
      try {
        const result = await dispatch(fetchDepartments()).unwrap();
        
        // Mark as initialized
        persistentData.isInitialized = true;
        
        // Fetch VMs if we have departments
        if (result && result.length > 0) {
          try {
            await dispatch(fetchVms()).unwrap();
          } catch (vmError) {
            // Continue anyway
          }
        }
        
        setHasError(false);
      } catch (error) {
        
        // If in development, use mock data
        if (isDev) {
          setLocalDepartments(mockDepartments);
          setLocalVMs(mockVMs);
          setUseMockData(true);
          
          // Show toast
          setToastProps({
            variant: "warning",
            title: "Using Mock Data",
            description: "Could not connect to the API. Using mock data for development."
          });
          setShowToast(true);
        } else {
          // In production, show error
          setHasError(true);
          setToastProps({
            variant: "destructive",
            title: "Connection Error",
            description: "Failed to load data. Please check your connection and try again."
          });
          setShowToast(true);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
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
    isLoading,
    hasError,
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
