"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import dynamic from 'next/dynamic';

// Custom hooks
import { useVMDetail } from "./hooks/useVMDetail";

// Components
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import VMHeader from "./components/VMHeader";
import VMTabControls from "./components/VMTabControls";
import ToastNotification from "../../components/ToastNotification";

// Lazy-loaded components

const VMRecommendationsTab = dynamic(() => import('./components/VMRecommendationsTab'), {
  ssr: false,
  loading: () => <div className="p-4">Cargando recomendaciones...</div>
});

const VMFirewallTab = dynamic(() => import('./components/VMFirewallTab'), {
  ssr: false,
  loading: () => <div className="p-4">Cargando configuración de firewall...</div>
});

/**
 * VM Detail Page Component
 * Displays VM information, dashboard, recommendations, and firewall settings
 */
const VMDetailPage = () => {
  const params = useParams();
  const departmentName = params.name;
  const vmId = params.id;

  const {
    // State
    isLoading,
    vm,
    error,
    showToast,
    toastProps,
    activeTab,

    // Actions
    setActiveTab,
    setShowToast,
    refreshVM,
    handlePowerAction
  } = useVMDetail(vmId);

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error || !vm) {
    return <ErrorState error={error} vmId={vmId} onRetry={refreshVM} />;
  }

  return (
    <ToastProvider>
      <div className="p-6">
        <VMHeader
          vm={vm}
          departmentName={departmentName}
          onPowerAction={handlePowerAction}
          onRefresh={refreshVM}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <VMTabControls
            onRefresh={refreshVM}
          />

          <TabsContent value="recommendations" className="mt-0">
            <VMRecommendationsTab vmId={vmId} vm={vm} />
          </TabsContent>

          <TabsContent value="firewall" className="mt-0">
            <VMFirewallTab vmId={vmId} vm={vm} onPowerAction={handlePowerAction} />
          </TabsContent>
        </Tabs>
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
