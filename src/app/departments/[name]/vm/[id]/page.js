"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import dynamic from 'next/dynamic';
import { createDebugger } from '@/utils/debug';

// Custom hooks
import { useVMDetail } from "./hooks/useVMDetail";

// Components
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import VMHeader from "./components/VMHeader";
import VMTabControls from "./components/VMTabControls";
import ToastNotification from "../../components/ToastNotification";

const debug = createDebugger('frontend:pages:vm-detail');

// Lazy-loaded components

const VMRecommendationsTab = dynamic(() => import('./components/VMRecommendationsTab'), {
  ssr: false,
  loading: () => <div className="p-4">Loading recommendations...</div>
});

const VMFirewallTab = dynamic(() => import('./components/VMFirewallTab'), {
  ssr: false,
  loading: () => <div className="p-4">Loading firewall configuration...</div>
});

/**
 * VM Detail Page Component
 * Displays VM information, dashboard, recommendations, and firewall settings
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

    // Actions
    setActiveTab,
    setShowToast,
    refreshVM,
    handlePowerAction,

    // Admin actions
    handleHardwareUpdate,
    handleNameUpdate
  } = useVMDetail(vmId);

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
      <div className="size-container size-padding glass-medium">
        <VMHeader
          vm={vm}
          departmentName={departmentName}
          onPowerAction={handlePowerAction}
          onRefresh={refreshVM}
          isAdmin={isAdmin}
          onHardwareUpdate={handleHardwareUpdate}
          onNameUpdate={handleNameUpdate}
          hardwareUpdateLoading={hardwareUpdateLoading}
          nameUpdateLoading={nameUpdateLoading}
        />

        <div className="size-margin-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <VMTabControls
              onRefresh={refreshVM}
            />

            <TabsContent value="recommendations" className="mt-2">
              <VMRecommendationsTab vmId={vmId} vm={vm} />
            </TabsContent>

            <TabsContent value="firewall" className="mt-2">
              <VMFirewallTab vmId={vmId} vm={vm} onPowerAction={handlePowerAction} />
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
