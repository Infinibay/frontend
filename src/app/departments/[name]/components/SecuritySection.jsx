import React, { useState, useEffect, useCallback } from 'react';
import { Badge } from "@/components/ui/badge";
import { Shield, Monitor, Lock, LockOpen } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from '@/hooks/use-toast';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:security-section');

// Import security components
import SecurityTabs from './security/SecurityTabs';
import OthersTab from './security/OthersTab';
import DepartmentFirewallTab from './DepartmentFirewallTab';

// Import security slice functions and selectors
import { 
  fetchServices, 
  fetchDepartmentByName,
  fetchDepartmentServiceStatus,
  fetchDepartmentVmsServiceStatus,
  toggleDepartmentService,
  toggleVmService,
  setSelectedService,
  selectServices,
  selectSelectedDepartment,
  selectDepartmentVmsServiceStatus,
  selectDepartmentServiceStatus,
  selectServiceLoading
} from '@/state/slices/security';

// Import departments slice selectors
import { selectDepartments } from '@/state/slices/departments';

const SecuritySection = () => {
  const dispatch = useDispatch();
  const { name } = useParams();
  
  // Local state
  const [selectedService, setSelectedService] = useState(null);
  const [activeTab, setActiveTab] = useState("firewall");
  const [enableAllToUse, setEnableAllToUse] = useState(false);
  const [enableAllToProvide, setEnableAllToProvide] = useState(false);
  
  // Get data from Redux
  const services = useSelector(selectServices);
  const selectedDepartment = useSelector(selectSelectedDepartment);
  
  // Get all departments from the departments slice as a fallback
  const allDepartments = useSelector(selectDepartments);
  
  // If selectedDepartment is null, try to find it in allDepartments
  const effectiveDepartment = selectedDepartment || 
    (name && allDepartments.find(d => d.name.toLowerCase() === name.toLowerCase()));
    
  // Get department service status
  const departmentServiceStatus = useSelector((state) => 
    selectedService ? selectDepartmentServiceStatus(state, selectedService) : null
  );
  
  // Get department-specific VM status from Redux
  const departmentVms = useSelector(state => {
    debug.log("selectors", "Selecting VM service status for service:", selectedService);
    debug.log("selectors", "Current state:", state.security);
    if (!selectedService) {
      debug.log("selectors", "No selected service, returning empty array");
      return [];
    }
    return selectDepartmentVmsServiceStatus(state, selectedService);
  });
  
  const loading = useSelector(selectServiceLoading);
  
  // Handle service selection - define this before any useEffects that depend on it
  const handleServiceSelection = useCallback((serviceId) => {
    console.log("Setting serviceId to ", serviceId, effectiveDepartment?.id, 'lll');
    setSelectedService(serviceId);
  }, [effectiveDepartment?.id]);
  
  // Fetch department ID by name
  useEffect(() => {
    console.log("Department name from URL:", name);
    if (name) {
      console.log("Dispatching fetchDepartmentByName for", name);
      dispatch(fetchDepartmentByName(name));
    } else {
      console.warn("No department name in URL params");
    }
  }, [dispatch, name]);
  
  // When department is loaded, fetch service status
  useEffect(() => {
    console.log("Department changed:", effectiveDepartment);
    if (effectiveDepartment?.id && selectedService) {
      console.log("Department loaded, fetching service status for", selectedService, effectiveDepartment.id);

      dispatch(fetchDepartmentServiceStatus({
        serviceId: selectedService,
        departmentId: effectiveDepartment.id
      }));

      dispatch(fetchDepartmentVmsServiceStatus({
        serviceId: selectedService,
        departmentId: effectiveDepartment.id
      }));
    }
  }, [effectiveDepartment?.id, selectedService, dispatch]);
  
  // Fetch available services from API
  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);
  
  // Set initial service selection when services are loaded
  useEffect(() => {
    console.log("Services changed:", services);
    // Don't override an existing selection
    if (services.length > 0 && !selectedService) {
      console.log("Setting initial service selection to:", services[0].id);
      setSelectedService(services[0].id);
    }
  }, [services, selectedService]);
  
  
  // Toggle service for VM
  const handleToggleVmService = (vmId, action) => {
    if (!selectedService || !vmId || !effectiveDepartment?.id) {
      console.error("Missing required parameters for toggling VM service", { 
        serviceId: selectedService, 
        vmId, 
        departmentId: effectiveDepartment?.id 
      });
      return;
    }
    
    const isEnabled = action === "USE" 
      ? isVmEnabledToUse(vmId) 
      : isVmEnabledToProvide(vmId);
    
    dispatch(toggleVmService({ 
      serviceId: selectedService, 
      vmId, 
      departmentId: effectiveDepartment.id, 
      enabled: !isEnabled,
      action
    }))
    .unwrap()
    .then(() => {
      toast({
        title: "Service Updated",
        description: "VM service settings have been updated successfully",
      });
      // Refetch department service status to update the UI
      if (effectiveDepartment?.id) {
        dispatch(fetchDepartmentServiceStatus({
          serviceId: selectedService,
          departmentId: effectiveDepartment.id
        })).catch(() => {
          // Already handled by rejected action
        });
        dispatch(fetchDepartmentVmsServiceStatus({
          serviceId: selectedService,
          departmentId: effectiveDepartment.id
        })).catch(() => {
          // Already handled by rejected action
        });
      }
    })
    .catch((error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update VM service settings",
        variant: "destructive",
      });
    });
  };

  // Toggle service for department
  const handleToggleDepartmentService = (action) => {
    if (!selectedService || !effectiveDepartment?.id) {
      console.error("Missing required parameters for toggling department service", { 
        serviceId: selectedService, 
        departmentId: effectiveDepartment?.id 
      });
      return;
    }
    
    const isEnabled = action === "USE" ? enableAllToUse : enableAllToProvide;
    
    dispatch(toggleDepartmentService({ 
      serviceId: selectedService, 
      departmentId: effectiveDepartment.id, 
      enabled: !isEnabled,
      action
    }))
    .unwrap()
    .then(() => {
      toast({
        title: "Service Updated",
        description: "Department service settings have been updated successfully",
      });
      // Refetch department service status to update the UI
      if (effectiveDepartment?.id) {
        dispatch(fetchDepartmentServiceStatus({
          serviceId: selectedService,
          departmentId: effectiveDepartment.id
        })).catch(() => {
          // Already handled by rejected action
        });
        dispatch(fetchDepartmentVmsServiceStatus({
          serviceId: selectedService,
          departmentId: effectiveDepartment.id
        })).catch(() => {
          // Already handled by rejected action
        });
      }
    })
    .catch((error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update department service settings",
        variant: "destructive",
      });
    });
  };
  
  // VM service toggle handler
  const handleToggleUse = (vmId) => {
    handleToggleVmService(vmId, "USE");
  };
  
  // Handle toggle for VM to provide a service
  const handleToggleProvide = (vmId) => {
    handleToggleVmService(vmId, "PROVIDE");
  };
  
  // Handle "enable all to use" toggle
  const handleToggleAllUse = (checked) => {
    setEnableAllToUse(checked);
    handleToggleDepartmentService("USE");
  };
  
  // Handle "enable all to provide" toggle
  const handleToggleAllProvide = (checked) => {
    setEnableAllToProvide(checked);
    handleToggleDepartmentService("PROVIDE");
  };
  
  // Get VMs from service status data
  const vms = departmentVms;
  
  // Utility functions for checking VM service status
  const isVmEnabledToUse = (vmId) => {
    if (!selectedService || !departmentVms || departmentVms.length === 0) return false;
    const vm = departmentVms.find(vm => vm.vmId === vmId);
    return vm ? vm.useEnabled : false;
  };
  
  const isVmEnabledToProvide = (vmId) => {
    if (!selectedService || !departmentVms || departmentVms.length === 0) return false;
    const vm = departmentVms.find(vm => vm.vmId === vmId);
    return vm ? vm.provideEnabled : false;
  };
  
  const isVmRunning = (vmId) => {
    if (!selectedService || !departmentVms || departmentVms.length === 0) return false;
    const vm = departmentVms.find(vm => vm.vmId === vmId);
    return vm ? vm.running : false;
  };
  
  // Get the selected service details
  const getSelectedService = () => {
    if (!services) return null;
    return services.find(service => service.id === selectedService);
  };
  
  // Get risk level badge
  const getRiskBadge = (level) => {
    switch(level) {
      case 'HIGH':
        return <Badge variant="destructive" className="ml-2">High Risk</Badge>;
      case 'MEDIUM':
        return <Badge variant="warning" className="ml-2 bg-amber-500 hover:bg-amber-600">Medium Risk</Badge>;
      case 'LOW':
        return <Badge variant="secondary" className="ml-2">Low Risk</Badge>;
      default:
        return null;
    }
  };
  
  // Reset enableAll toggles when service selection changes
  useEffect(() => {
    setEnableAllToUse(false);
    setEnableAllToProvide(false);
  }, [selectedService]);
  
  // Get formatted VM data for the table
  const formatVmData = () => {
    console.log("Formatting VM data from:", vms);
    if (!vms || !vms.length) {
      console.log("No VMs to format");
      return [];
    }
    
    const formattedVms = vms.map(vm => {
      console.log("Processing VM:", vm);
      // Use the correct property names from the API response
      // The API returns vmId, vmName, running as seen in the GraphQL query
      return {
        id: vm.vmId,        // Use vmId for the id (from API)
        name: vm.vmName,    // Use vmName for the name (from API)
        running: vm.running // Use running directly (from API)
      };
    });
    
    console.log("Formatted VMs:", formattedVms);
    return formattedVms;
  };
  
  const isLoading = loading.services || 
                    loading.departmentService ||
                    loading.departmentVmsService ||
                    loading.departmentByName || 
                    loading.toggleVm || 
                    loading.toggleDepartment;
  
  return (
    <div className="space-y-6">
      {/* Security Tabs Navigation */}
      <SecurityTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="mt-6">
        {/* Render the appropriate tab content based on activeTab */}
        {activeTab === "firewall" ? (
          <DepartmentFirewallTab
            departmentId={effectiveDepartment?.id}
            departmentName={effectiveDepartment?.name || name}
          />
        ) : (
          <OthersTab />
        )}
      </div>
    </div>
  );
};

export default SecuritySection;
