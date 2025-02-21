"use client";

import React, { useState, useEffect } from 'react';
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
import { knownServices, findServiceByPort, getRiskLevelDescription } from '@/config/securityServices';
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
import { useDispatch, useSelector } from 'react-redux';
import { fetchVmPorts, selectVmPortsState } from '@/state/slices/vmPorts';

const icons = {
  desktop: Monitor,
  globe: Globe,
  lock: Lock,
  terminal: Terminal,
  server: Terminal
};

const SecuritySection = () => {
  const dispatch = useDispatch();
  const { items: vmPorts, loading: vmPortsLoading } = useSelector(selectVmPortsState);
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

  useEffect(() => {
    dispatch(fetchVmPorts());
  }, [dispatch]);

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
    const service = findServiceByPort(port, protocol);
    if (service) {
      return {
        name: service.name,
        description: service.description,
        riskLevel: service.riskLevel,
        riskReason: service.riskReason,
        icon: service.icon || 'globe'
      };
    }
    return {
      name: `Port ${port}/${protocol}`,
      description: 'Unknown service',
      riskLevel: 3,
      riskReason: 'Unknown service running on this port. Potential security risk.',
      icon: 'globe'
    };
  };

  const renderServiceRisk = (riskLevel, riskReason) => {
    const riskColors = {
      5: 'text-red-500',
      4: 'text-orange-500',
      3: 'text-yellow-500',
      2: 'text-blue-500',
      1: 'text-green-500',
      0: 'text-green-600'
    };

    return (
      <div className="mt-2">
        <div className={`flex items-center gap-2 ${riskColors[riskLevel] || 'text-gray-500'}`}>
          <AlertCircle className="h-4 w-4" />
          <span className="font-medium">Risk Level: {riskLevel} - {getRiskLevelDescription(riskLevel)}</span>
        </div>
        <p className="mt-1 text-sm text-gray-600">{riskReason}</p>
      </div>
    );
  };

  const getRunningVmPorts = () => {
    return vmPorts.filter(port => port.running).map(port => ({
      port: port.portStart,
      protocol: port.protocol,
      ...getServiceInfo(port.portStart, port.protocol)
    }));
  };

  const renderServicesList = () => {
    const runningServices = getRunningVmPorts();
    
    return (
      <div className="space-y-4">
        {vmPortsLoading ? (
          <div className="text-sm text-muted-foreground">Loading VM services...</div>
        ) : (
          runningServices.map((service, index) => {
            const serviceInfo = getServiceInfo(service.port, service.protocol);
            return (
              <div key={`${service.port}-${service.protocol}-${index}`} 
                   className="flex items-center justify-between p-4 border rounded hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  {React.createElement(icons[serviceInfo.icon] || AlertCircle, { 
                    className: "h-5 w-5 text-gray-600" 
                  })}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{serviceInfo.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ({service.port}/{service.protocol})
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {serviceInfo.description}
                    </p>
                    {renderServiceRisk(serviceInfo.riskLevel, serviceInfo.riskReason)}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    serviceInfo.riskLevel >= 4 ? 'bg-red-100 text-red-800' :
                    serviceInfo.riskLevel >= 3 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {serviceInfo.riskDescription}
                  </span>
                  <span className="text-sm text-green-600">Allowed (Service Provider)</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Security Settings</h2>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="simple">Basic</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="simple" className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Services</h3>
            {renderServicesList()}
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedFirewall />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default SecuritySection;
