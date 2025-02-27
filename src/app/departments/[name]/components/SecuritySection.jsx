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
import { Badge } from "@/components/ui/badge";
import { knownServices, serviceCategories, findServiceByPort, getRiskLevelDescription } from '@/config/securityServices';
import AdvancedFirewall from './AdvancedFirewall';
import { 
  AlertCircle,
  Shield,
  Globe,
  MonitorController,
  FolderNetwork,
  Network,
  Gamepad2,
  Database,
  MessageSquare,
  ActivitySquare,
  Lock,
  LockOpen,
  Building2,
  Laptop,
  ChevronDown,
  Settings,
  Cpu
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVmPorts, selectVmPortsState } from '@/state/slices/vmPorts';

const icons = {
  MonitorController,
  FolderNetwork,
  Network,
  Globe,
  Gamepad2,
  Database,
  MessageSquare,
  ActivitySquare,
  Settings,
  Cpu
};

const SecuritySection = () => {
  const dispatch = useDispatch();
  const { items: vmPorts, loading: vmPortsLoading } = useSelector(selectVmPortsState);
  const [activeTab, setActiveTab] = useState("incoming");
  const [globalServices, setGlobalServices] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    service: null,
    serviceKey: null,
    scope: null,
    vmId: null,
  });

  useEffect(() => {
    dispatch(fetchVmPorts());
  }, [dispatch]);

  const getRiskBadge = (riskLevel) => {
    const color = riskLevel >= 4 ? 'destructive' : riskLevel >= 3 ? 'warning' : 'secondary';
    const text = getRiskLevelDescription(riskLevel);
    return <Badge variant={color}>{text}</Badge>;
  };

  const handleServiceToggle = (serviceKey, service, scope, vmId = null) => {
    setConfirmDialog({
      open: true,
      service,
      serviceKey,
      scope,
      vmId,
    });
  };

  // Group services by category
  const servicesByCategory = knownServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  const CategorySection = ({ categoryKey, services, scope = 'department', vmId = null }) => {
    const category = serviceCategories[categoryKey];
    if (!category) return null;

    let Icon = icons[category.icon];
    if (!Icon) {
      Icon = Globe;
    }

    return (
      <div className="mb-8 border rounded-lg overflow-hidden">
        <div className="bg-muted p-4 border-b">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
            <h4 className="font-medium text-lg">{category.name}</h4>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
        </div>
        <div className="p-4 space-y-4 bg-card">
          {services.map(service => (
            <ServiceCard 
              key={service.name} 
              service={service}
              scope={scope}
              vmId={vmId}
            />
          ))}
        </div>
      </div>
    );
  };

  const ServiceCard = ({ service, scope = 'department', vmId = null }) => {
    const isEnabled = scope === 'department' 
      ? globalServices[service.ports[0]?.start]
      : vmPorts[vmId]?.includes(service.ports[0]?.start);

    return (
      <Card className="border shadow-sm">
        <Collapsible>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isEnabled ? <LockOpen className="h-5 w-5 text-warning" /> : <Lock className="h-5 w-5 text-muted-foreground" />}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{service.name}</span>
                  {getRiskBadge(service.riskLevel)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {isEnabled ? "Service Active" : "Protected (Blocked)"}
              </span>
              <Switch
                checked={isEnabled}
                onCheckedChange={() => handleServiceToggle(
                  service.ports[0]?.start,
                  service,
                  scope,
                  vmId
                )}
              />
            </div>
          </div>
          <CollapsibleTrigger className="w-full text-left border-t">
            <Button variant="ghost" size="sm" className="w-full flex justify-between p-2 h-8">
              <span className="text-xs">Show details</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4 border-t bg-muted/50 space-y-3">
              <Alert variant="warning" className="border-warning/20">
                <AlertCircle className="h-4 w-4" />
                <p className="ml-2 text-sm">{service.riskReason}</p>
              </Alert>
              {scope === 'department' && (
                <div>
                  <p className="text-sm font-medium mb-2">Recommended Security Measures:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
                      Enable only for specific IP ranges
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
                      Set up enhanced monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
                      Configure automatic blocking for suspicious activity
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="incoming">
            <Shield className="w-4 h-4 mr-2" />
            Service Provide (Incoming)
          </TabsTrigger>
          <TabsTrigger value="outgoing">
            <Globe className="w-4 h-4 mr-2" />
            Service Usage (Outgoing)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5" />
            <h3 className="text-lg font-medium">Department-wide Services</h3>
          </div>

          {Object.entries(servicesByCategory).map(([category, services]) => (
            <CategorySection 
              key={category}
              categoryKey={category}
              services={services}
              scope="department"
            />
          ))}

          <div className="flex items-center gap-2 mb-4 mt-8">
            <Laptop className="h-5 w-5" />
            <h3 className="text-lg font-medium">VM-Specific Services</h3>
          </div>
          {/* VM-specific service controls would go here */}
        </TabsContent>

        <TabsContent value="outgoing">
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Outgoing Service Access</h3>
            {/* Outgoing service controls would go here */}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && setConfirmDialog({ open: false })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable {confirmDialog.service?.name}</DialogTitle>
            <DialogDescription>
              <div className="space-y-4">
                <Alert variant="warning">
                  <AlertCircle className="h-4 w-4" />
                  <p className="ml-2">
                    {confirmDialog.scope === 'department' 
                      ? 'This will enable the service for all VMs in the department'
                      : 'This will enable the service for this specific VM'}
                  </p>
                </Alert>
                <p>{confirmDialog.service?.riskReason}</p>
                <p>Are you sure you want to proceed?</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {
              if (confirmDialog.scope === 'department') {
                setGlobalServices(prev => ({
                  ...prev,
                  [confirmDialog.serviceKey]: true
                }));
              }
              // Handle VM-specific enable here
              setConfirmDialog({ open: false });
            }}>
              Enable Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Make sure we're properly exporting the component
export { SecuritySection };
export default SecuritySection;
