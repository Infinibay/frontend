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

const VMSecurityTab = dynamic(() => import('./components/security/VMSecurityTab'), {
  ssr: false,
  loading: () => <div className="p-4">Loading security...</div>
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
          onUserUpdate={handleUserUpdate}
          hardwareUpdateLoading={hardwareUpdateLoading}
          nameUpdateLoading={nameUpdateLoading}
          userUpdateLoading={userUpdateLoading}
          users={users}
          usersLoading={usersLoading}
          usersError={usersError}
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
              <VMSecurityTab
                vmId={vmId}
                vmStatus={vm?.status}
                vmOs={vm?.configuration?.os}
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
