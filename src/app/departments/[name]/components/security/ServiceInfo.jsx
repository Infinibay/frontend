import React from 'react';
import { Info, Shield } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

/**
 * ServiceInfo Component
 * Displays information about the selected security service
 */
const ServiceInfo = ({ getSelectedService, getRiskBadge, isLoading = false }) => {
  const selectedService = getSelectedService();
  
  if (isLoading || !selectedService) {
    return (
      <div className="mb-6">
        <Skeleton className="h-6 w-full mb-4" />
        <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-900/20 mb-4 border-l-4 border-blue-500">
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        {selectedService.icon || <Shield className="h-5 w-5" />}
        <h3 className="text-base font-medium">
          {selectedService.displayName || selectedService.name} - {selectedService.description}
        </h3>
        {getRiskBadge(selectedService.riskLevel)}
      </div>
      
      <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-900/20 mb-4 border-l-4 border-blue-500">
        <div className="flex gap-2 mb-2">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h4 className="font-medium">Risk Information</h4>
        </div>
        <div className="text-sm space-y-1 ml-7">
          <p>
            <span className="font-medium">Risk level:</span> {
              selectedService.riskLevel === 'HIGH' ? 'High' :
              selectedService.riskLevel === 'MEDIUM' ? 'Medium' :
              selectedService.riskLevel === 'LOW' ? 'Low' : 
              selectedService.riskLevel
            }
          </p>
          <p><span className="font-medium">Why risk level:</span> {selectedService.riskDescription || "This service can expose your system to potential attacks"}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfo;
