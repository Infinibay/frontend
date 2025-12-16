"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import dynamic from 'next/dynamic';
import { createDebugger } from '@/utils/debug';
import { Server, Power, Cpu, Shield, Terminal } from 'lucide-react';
import { getGlassClasses } from '@/utils/glass-effects';
import { cn } from '@/lib/utils';

// Custom hooks
import { useVMDetail } from "./hooks/useVMDetail";
import { usePageHeader } from '@/hooks/usePageHeader';

// Components
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import VMTabControls from "./components/VMTabControls";
import ToastNotification from "../../components/ToastNotification";

const debug = createDebugger('frontend:pages:vm-detail');

// Lazy-loaded components

const VMRecommendationsTab = dynamic(() => import('./components/VMRecommendationsTab'), {
  ssr: false,
  loading: () => <div className="size-padding">Loading recommendations...</div>
});

const VMSecurityTab = dynamic(() => import('./components/security/VMSecurityTab'), {
  ssr: false,
  loading: () => <div className="size-padding">Loading security...</div>
});

const VMScriptsTab = dynamic(() => import('./components/VMScriptsTab'), {
  ssr: false,
  loading: () => <div className="size-padding">Loading scripts...</div>
});

/**
 * VM Detail Page Component
 * Displays VM information, dashboard, and recommendations
 */
const VMDetailPage = () => {
  const params = useParams();
  const departmentName = params.name;
  const vmId = params.id;

  debug.log('VM Detail Page mounted', { departmentName, vmId });

  const {
    // State
    isLoading,
    vm,
    error,
    showToast,
    toastProps,
    activeTab,

    // Admin state
    isAdmin,
    hardwareUpdateLoading,
    nameUpdateLoading,
    userUpdateLoading,
    users,
    usersLoading,
    usersError,

    // Actions
    setActiveTab,
    setShowToast,
    refreshVM,
    handlePowerAction,

    // Admin actions
    handleHardwareUpdate,
    handleNameUpdate,
    handleUserUpdate
  } = useVMDetail(vmId);

  // Help configuration
  const helpConfig = useMemo(() => ({
    title: "Virtual Machine Help",
    description: "Learn how to manage and control your virtual machine",
    icon: <Server className="h-5 w-5 text-primary" />,
    sections: [
      {
        id: "power-management",
        title: "Power Management",
        icon: <Power className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <p className="font-medium text-foreground mb-1">Starting VMs</p>
            <p>Click the "Start" button when the VM is stopped. The system will initiate the boot process and the status badge will update to "Running" when ready.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Stopping VMs</p>
            <p>Click the "Stop" button when the VM is running. A graceful shutdown will be initiated to safely stop the virtual machine.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Status Indicators</p>
            <p>The status badge shows the current state: Running (green), Stopped (gray), Paused (yellow outline). Monitor this to understand the VM's current state.</p>
          </div>
        )
      },
      {
        id: "hardware",
        title: "Hardware Configuration",
        icon: <Cpu className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <p className="font-medium text-foreground mb-1">Editing Hardware</p>
            <p>Admins can click on CPU or RAM values to edit them, but only when the VM is stopped. This ensures safe configuration changes.</p>

            <p className="font-medium text-foreground mb-1 mt-3">CPU Cores</p>
            <p>Adjust processing power by setting the number of CPU cores (1-128). More cores provide better performance for multi-threaded applications.</p>

            <p className="font-medium text-foreground mb-1 mt-3">RAM</p>
            <p>Modify memory allocation (1-512 GB) to match your application requirements. More RAM helps with memory-intensive workloads.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Storage</p>
            <p>Storage is read-only and defined by the template. Contact your administrator if you need storage changes.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Restrictions</p>
            <p>Hardware changes are only allowed when the VM is stopped to prevent data corruption and ensure stability.</p>
          </div>
        )
      },
      {
        id: "vm-info",
        title: "VM Information",
        icon: <Server className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <p className="font-medium text-foreground mb-1">VM Name</p>
            <p>Admins can click the VM name to rename it using inline editing. Press Enter to save or Escape to cancel changes.</p>

            <p className="font-medium text-foreground mb-1 mt-3">User Assignment</p>
            <p>Assign the VM to a specific user for access control. This helps track who is responsible for the VM and manage permissions.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Network Info</p>
            <p>View local and public IP addresses. Click any IP address to copy it to your clipboard for easy access.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Template</p>
            <p>Shows the base template used when creating this VM. The template defines the OS, initial storage, and default configuration.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Creation Date</p>
            <p>Displays when the VM was provisioned, helping track the age and lifecycle of your virtual machines.</p>
          </div>
        )
      },
      {
        id: "tabs",
        title: "Tabs Overview",
        icon: <Terminal className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <p className="font-medium text-foreground mb-1">Recommendations</p>
            <p>AI-powered suggestions for VM optimization based on usage patterns, performance metrics, and best practices.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Firewall</p>
            <p>Configure VM-specific firewall rules and security settings. These rules work alongside department-level rules for granular control.</p>

            <p className="font-medium text-foreground mb-1 mt-3">Scripts</p>
            <p>Run automation scripts on this VM for maintenance, configuration, or monitoring tasks. Scripts can be scheduled or run on-demand.</p>
          </div>
        )
      }
    ],
    quickTips: [
      "Stop the VM before modifying CPU or RAM settings",
      "Click IP addresses to copy them to clipboard",
      "Assign users to VMs for access control and organization",
      "Check the Recommendations tab for optimization suggestions"
    ]
  }), []);

  // Configure header
  usePageHeader({
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Departments', href: '/departments' },
      { label: departmentName || 'Department', href: `/departments/${departmentName}` },
      { label: vm?.name || 'VM', isCurrent: true }
    ],
    title: vm?.name || 'Virtual Machine',
    backButton: { href: `/departments/${departmentName}`, label: 'Back' },
    actions: [],
    helpConfig: helpConfig,
    helpTooltip: 'VM detail help'
  }, [vm?.name, departmentName]);

  // Loading state
  if (isLoading) {
    debug.log('Showing loading state');
    return <LoadingState />;
  }

  // Error state
  if (error || !vm) {
    debug.error('VM detail error:', error);
    return <ErrorState error={error} vmId={vmId} onRetry={refreshVM} />;
  }

  debug.success('VM detail loaded successfully', { vmName: vm?.name });

  return (
    <ToastProvider>
      <div className={cn(
        getGlassClasses({ glass: 'medium', elevation: 3, radius: 'lg' }),
        "size-container size-padding"
      )}>

        <div className="size-margin-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <VMTabControls
              onRefresh={refreshVM}
            />

            <TabsContent value="recommendations" className="mt-2">
              <VMRecommendationsTab vmId={vmId} vm={vm} />
            </TabsContent>

            <TabsContent value="firewall" className="mt-2">
              <VMSecurityTab
                vmId={vmId}
                vmStatus={vm?.status}
                vmOs={vm?.configuration?.os}
                departmentId={vm?.department?.id}
              />
            </TabsContent>

            <TabsContent value="scripts" className="mt-2">
              <VMScriptsTab
                vmId={vmId}
                vmStatus={vm?.status}
                departmentId={vm?.department?.id}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ToastNotification
        show={showToast}
        variant={toastProps.variant}
        title={toastProps.title}
        description={toastProps.description}
        onOpenChange={(open) => !open && setShowToast(false)}
      />

      <ToastViewport />
    </ToastProvider>
  );
};

export default VMDetailPage;
