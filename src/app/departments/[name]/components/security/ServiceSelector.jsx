import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield } from 'lucide-react';

/**
 * ServiceSelector Component
 * Renders a dropdown for selecting security services
 */
const ServiceSelector = ({ selectedService, setSelectedService, mockServices, getRiskBadge, isLoading = false }) => {
  if (isLoading && mockServices.length === 0) {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Service</label>
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Service</label>
      <Select value={selectedService} onValueChange={setSelectedService} disabled={isLoading}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a service" />
        </SelectTrigger>
        <SelectContent>
          {mockServices.map(service => (
            <SelectItem key={service.id} value={service.id}>
              <div className="flex items-center">
                {service.icon || <Shield className="h-4 w-4" />}
                <span className="ml-2">{service.displayName || service.name}</span>
                {getRiskBadge(service.riskLevel)}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ServiceSelector;
