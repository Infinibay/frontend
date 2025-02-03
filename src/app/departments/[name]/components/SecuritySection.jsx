"use client";

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Alert } from "@/components/ui/alert";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { mockDetectedServices, knownServices } from '@/config/securityServices';
import AdvancedFirewall from './AdvancedFirewall';
import { 
  AlertCircle,
  Shield,
  ShieldCheck,
  Globe,
  Monitor,
  Lock,
  Terminal,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const icons = {
  desktop: Monitor,
  globe: Globe,
  lock: Lock,
  terminal: Terminal,
  server: Terminal
};

const SecuritySection = () => {
  const [activeTab, setActiveTab] = useState("simple");
  const [globalServices, setGlobalServices] = useState({
    "3389/tcp": false,
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    service: null,
    serviceKey: null,
    applyToPast: false
  });
  const [openVMs, setOpenVMs] = useState({});

  const toggleVM = (vmId) => {
    setOpenVMs(prev => ({
      ...prev,
      [vmId]: !prev[vmId]
    }));
  };

  const handleGlobalServiceToggle = (serviceKey, service) => {
    if (!globalServices[serviceKey]) {
      setConfirmDialog({
        open: true,
        service,
        serviceKey,
        applyToPast: false
      });
    } else {
      setGlobalServices(prev => ({
        ...prev,
        [serviceKey]: false
      }));
    }
  };

  const handleConfirmServiceEnable = () => {
    setGlobalServices(prev => ({
      ...prev,
      [confirmDialog.serviceKey]: true
    }));
    // Here you would handle the actual enabling of the service
    // based on the confirmDialog.applyToPast value
    setConfirmDialog({ open: false, service: null, serviceKey: null, applyToPast: false });
  };

  const getServiceInfo = (port, protocol) => {
    const key = `${port}/${protocol}`;
    return knownServices[key] || {
      name: `Unknown Service (${port}/${protocol})`,
      description: "An unrecognized service was detected running on this computer",
      riskLevel: "high",
      riskDescription: "This service is not recognized. Enable only if you know what this service is for.",
      icon: "alertCircle"
    };
  };

  const getEnabledServicesForType = (port, protocol) => {
    const enabledVMs = mockDetectedServices.filter(vm => 
      vm.services.some(service => 
        service.port === port && 
        service.protocol === protocol && 
        service.enabled
      )
    );
    return enabledVMs;
  };

  const renderEnabledServicesSummary = (port, protocol) => {
    const enabledVMs = getEnabledServicesForType(port, protocol);
    if (enabledVMs.length === 0) return null;

    return (
      <div className="mt-2 pl-6 border-l-2 border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Currently enabled on:</p>
        <div className="flex flex-wrap gap-2">
          {enabledVMs.map(vm => (
            <div 
              key={vm.vmId}
              className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-sm"
            >
              <Monitor className="w-3 h-3 mr-1" />
              {vm.vmName}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="w-5 h-5" />
        <h2 className="text-2xl font-semibold">Security Settings</h2>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <p className="ml-2">
          These settings help protect your computers while allowing necessary services to work.
          If you're unsure about any setting, leave it in its default secure state.
        </p>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="simple">Simple View</TabsTrigger>
          <TabsTrigger value="advanced">Advanced View</TabsTrigger>
        </TabsList>

        <TabsContent value="simple" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Detected Services</h3>
            <div className="space-y-4">
              {mockDetectedServices.map((vm) => (
                <Collapsible
                  key={vm.vmId}
                  open={openVMs[vm.vmId]}
                  onOpenChange={() => toggleVM(vm.vmId)}
                  className="border rounded-lg"
                >
                  <CollapsibleTrigger className="flex items-center w-full p-4 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 flex-1">
                      <Monitor className="w-4 h-4 text-gray-500" />
                      <h4 className="font-medium text-lg">{vm.vmName}</h4>
                      <div className="flex items-center space-x-2 ml-2">
                        {vm.services.some(s => s.enabled) && (
                          <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                            {vm.services.filter(s => s.enabled).length} Active
                          </span>
                        )}
                        {vm.services.some(s => !s.enabled) && (
                          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                            {vm.services.filter(s => !s.enabled).length} Inactive
                          </span>
                        )}
                      </div>
                    </div>
                    {openVMs[vm.vmId] ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-4 p-4 pt-0">
                      {vm.services.map((service) => {
                        const serviceInfo = getServiceInfo(service.port, service.protocol);
                        const IconComponent = icons[serviceInfo.icon] || AlertCircle;
                        
                        return (
                          <div key={`${service.port}/${service.protocol}`} 
                               className="flex items-start space-x-4 p-4 border rounded-lg">
                            <div className="flex-shrink-0">
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium">
                                  {serviceInfo.name}
                                  {service.unknown && (
                                    <span className="ml-2 text-sm text-gray-500">
                                      Port {service.port}/{service.protocol}
                                    </span>
                                  )}
                                </h5>
                                <Switch 
                                  checked={service.enabled}
                                  onCheckedChange={() => {}}
                                />
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {serviceInfo.description}
                              </p>
                              <div className="mt-2 text-sm">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs
                                  ${serviceInfo.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                                    serviceInfo.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'}`}>
                                  Risk Level: {serviceInfo.riskLevel}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Department-wide Settings</h3>
            <div className="space-y-6">
              {Object.entries(knownServices).map(([key, service]) => {
                const [port, protocol] = key.split('/');
                return (
                  <div key={key} className="flex flex-col space-y-4 p-4 border rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {React.createElement(icons[service.icon] || AlertCircle, { className: "w-6 h-6" })}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">Allow {service.name}</h5>
                          <Switch 
                            checked={globalServices[key] || false}
                            onCheckedChange={() => handleGlobalServiceToggle(key, service)}
                          />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Enable {service.name} for all computers in this department
                        </p>
                        {renderEnabledServicesSummary(parseInt(port), protocol)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <AdvancedFirewall />
        </TabsContent>
      </Tabs>

      <Dialog 
        open={confirmDialog.open} 
        onOpenChange={(open) => !open && setConfirmDialog({ open: false, service: null, serviceKey: null, applyToPast: false })}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enable {confirmDialog.service?.name}</DialogTitle>
            <DialogDescription className="pt-3">
              Do you want to enable this service for existing computers as well?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm font-medium">Future only</span>
              <Switch
                checked={confirmDialog.applyToPast}
                onCheckedChange={(checked) => setConfirmDialog(prev => ({ ...prev, applyToPast: checked }))}
              />
              <span className="text-sm font-medium">Past and future</span>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleConfirmServiceEnable}>
              Enable service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecuritySection;
