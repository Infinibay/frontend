import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * ServiceSelector Component
 * Renders a dropdown for selecting security services
 */
const ServiceSelector = ({ selectedService, setSelectedService, mockServices, getRiskBadge }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Service</label>
      <Select value={selectedService} onValueChange={setSelectedService}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a service" />
        </SelectTrigger>
        <SelectContent>
          {mockServices.map(service => (
            <SelectItem key={service.id} value={service.id}>
              <div className="flex items-center">
                {service.icon}
                <span className="ml-2">{service.name}</span>
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
