import React from 'react';
import { Card } from "@/components/ui/card";
import { Shield, Info } from 'lucide-react';
import ServiceSelector from './ServiceSelector';
import ServiceInfo from './ServiceInfo';
import VmConfigTable from './VmConfigTable';

/**
 * GeneralTab Component
 * Displays the general security service configuration tab
 * Allows enabling services to use or provide for each VM
 */
const GeneralTab = ({
  selectedService,
  setSelectedService,
  mockServices,
  getSelectedService,
  getRiskBadge,
  enableAllToUse,
  setEnableAllToUse,
  enableAllToProvide,
  setEnableAllToProvide,
  mockVms,
  isVmEnabledToUse,
  isVmEnabledToProvide,
  handleToggleUse,
  handleToggleProvide
}) => {
  return (
    <Card className="p-6 border-2 border-muted shadow-md">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Security Service Configuration</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          A description of what this page does and how to enable and disable services
          on this page here.
        </p>
      </div>
      
      {/* Service Selection Dropdown */}
      <ServiceSelector 
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        mockServices={mockServices}
        getRiskBadge={getRiskBadge}
      />
      
      {/* Service Information Section */}
      <ServiceInfo 
        getSelectedService={getSelectedService}
        getRiskBadge={getRiskBadge}
      />
      
      {/* Info Box */}
      <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-900/10 mb-4 border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <Info className="h-4 w-4 inline-block mr-2" />
          For each service, you can decide if a VM can use the service or provide it to others.
          'Use' enables the VM to connect to the service, while 'Provide' allows the VM to host the service.
        </p>
      </div>
      
      {/* VM Configuration Table */}
      <VmConfigTable 
        enableAllToUse={enableAllToUse}
        setEnableAllToUse={setEnableAllToUse}
        enableAllToProvide={enableAllToProvide}
        setEnableAllToProvide={setEnableAllToProvide}
        mockVms={mockVms}
        selectedService={selectedService}
        isVmEnabledToUse={isVmEnabledToUse}
        isVmEnabledToProvide={isVmEnabledToProvide}
        handleToggleUse={handleToggleUse}
        handleToggleProvide={handleToggleProvide}
      />
    </Card>
  );
};

export default GeneralTab;
