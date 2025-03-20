import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Shield, Monitor, Lock, LockOpen } from 'lucide-react';
import SecurityTabs from './security/SecurityTabs';
import GeneralTab from './security/GeneralTab';
import OthersTab from './security/OthersTab';

/**
 * Security Section Component
 * Allows users to enable or disable services on VMs in a department
 */
const SecuritySection = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [selectedService, setSelectedService] = useState("SSH");
  const [enableForAll, setEnableForAll] = useState(false);
  
  // Mock data for VMs in the department
  const mockVms = [
    { id: 1, name: "Computer", enabled: false },
    { id: 2, name: "Arnold", enabled: false },
    { id: 3, name: "Daniel", enabled: false },
    { id: 4, name: "Emily", enabled: false }
  ];
  
  // Mock data for services
  const mockServices = [
    { id: "SSH", name: "SSH", description: "Secure Shell for remote access", riskLevel: "high", icon: <Lock className="h-5 w-5" /> },
    { id: "HTTP", name: "HTTP", description: "Web server protocol", riskLevel: "medium", icon: <Monitor className="h-5 w-5" /> },
    { id: "FTP", name: "FTP", description: "File Transfer Protocol", riskLevel: "medium", icon: <Monitor className="h-5 w-5" /> },
    { id: "SMTP", name: "SMTP", description: "Email server protocol", riskLevel: "low", icon: <Monitor className="h-5 w-5" /> }
  ];
  
  // State for services that VMs are enabled to use
  const [enabledVmsToUse, setEnabledVmsToUse] = useState({});
  
  // State for services that VMs are enabled to provide
  const [enabledVmsToProvide, setEnabledVmsToProvide] = useState({});
  
  // State for enabling all VMs to use a service
  const [enableAllToUse, setEnableAllToUse] = useState(false);
  
  // State for enabling all VMs to provide a service
  const [enableAllToProvide, setEnableAllToProvide] = useState(false);
  
  // Handle toggle for VM to use a service
  const handleToggleUse = (vmId) => {
    setEnabledVmsToUse(prev => ({
      ...prev,
      [vmId]: {
        ...prev[vmId],
        [selectedService]: !prev[vmId]?.[selectedService]
      }
    }));
  };
  
  // Handle toggle for VM to provide a service
  const handleToggleProvide = (vmId) => {
    setEnabledVmsToProvide(prev => ({
      ...prev,
      [vmId]: {
        ...prev[vmId],
        [selectedService]: !prev[vmId]?.[selectedService]
      }
    }));
  };
  
  // Handle "enable all to use" toggle
  const handleEnableAllToUse = (checked) => {
    setEnableAllToUse(checked);
    
    // If checked, enable all VMs to use the service
    if (checked) {
      const updatedVms = {};
      mockVms.forEach(vm => {
        updatedVms[vm.id] = {
          ...enabledVmsToUse[vm.id],
          [selectedService]: true
        };
      });
      setEnabledVmsToUse(updatedVms);
    }
  };
  
  // Handle "enable all to provide" toggle
  const handleEnableAllToProvide = (checked) => {
    setEnableAllToProvide(checked);
    
    // If checked, enable all VMs to provide the service
    if (checked) {
      const updatedVms = {};
      mockVms.forEach(vm => {
        updatedVms[vm.id] = {
          ...enabledVmsToProvide[vm.id],
          [selectedService]: true
        };
      });
      setEnabledVmsToProvide(updatedVms);
    }
  };
  
  // Check if a VM is enabled to use a service
  const isVmEnabledToUse = (vmId) => {
    return enableAllToUse || enabledVmsToUse[vmId]?.[selectedService] || false;
  };
  
  // Check if a VM is enabled to provide a service
  const isVmEnabledToProvide = (vmId) => {
    return enableAllToProvide || enabledVmsToProvide[vmId]?.[selectedService] || false;
  };
  
  // Get the selected service details
  const getSelectedService = () => {
    return mockServices.find(service => service.id === selectedService);
  };
  
  // Get risk level badge
  const getRiskBadge = (level) => {
    switch(level) {
      case 'high':
        return <Badge variant="destructive" className="ml-2">High Risk</Badge>;
      case 'medium':
        return <Badge variant="warning" className="ml-2 bg-amber-500 hover:bg-amber-600">Medium Risk</Badge>;
      case 'low':
        return <Badge variant="secondary" className="ml-2">Low Risk</Badge>;
      default:
        return null;
    }
  };
  
  // Reset service selection when tab changes
  useEffect(() => {
    setEnableAllToUse(false);
    setEnableAllToProvide(false);
  }, [selectedService]);
  
  return (
    <div className="space-y-6">
      {/* Security Tabs Navigation */}
      <SecurityTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="mt-6">
        {/* Render the appropriate tab content based on activeTab */}
        {activeTab === "general" ? (
          <GeneralTab 
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            mockServices={mockServices}
            getSelectedService={getSelectedService}
            getRiskBadge={getRiskBadge}
            enableAllToUse={enableAllToUse}
            setEnableAllToUse={handleEnableAllToUse}
            enableAllToProvide={enableAllToProvide}
            setEnableAllToProvide={handleEnableAllToProvide}
            mockVms={mockVms}
            isVmEnabledToUse={isVmEnabledToUse}
            isVmEnabledToProvide={isVmEnabledToProvide}
            handleToggleUse={handleToggleUse}
            handleToggleProvide={handleToggleProvide}
          />
        ) : (
          <OthersTab />
        )}
      </div>
    </div>
  );
};

export default SecuritySection;
