import React from 'react';
import { Info } from 'lucide-react';

/**
 * ServiceInfo Component
 * Displays information about the selected security service
 */
const ServiceInfo = ({ getSelectedService, getRiskBadge }) => {
  const selectedService = getSelectedService();
  
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-4">
        {selectedService?.icon}
        <h3 className="text-base font-medium">
          {selectedService?.name} - {selectedService?.description}
        </h3>
        {getRiskBadge(selectedService?.riskLevel)}
      </div>
      
      <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-900/20 mb-4 border-l-4 border-blue-500">
        <div className="flex gap-2 mb-2">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h4 className="font-medium">Risk Information</h4>
        </div>
        <div className="text-sm space-y-1 ml-7">
          <p><span className="font-medium">Risk level:</span> {selectedService?.riskLevel}</p>
          <p><span className="font-medium">Why risk level:</span> This service can expose your system to potential attacks</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceInfo;
