"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Activity, AlertTriangle, Wrench, History, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Components
import VMHeader from './components/VMHeader';
import PerformanceTab from './components/tabs/PerformanceTab';
import MaintenanceTab from './components/tabs/MaintenanceTab';
import HistoryTab from './components/tabs/HistoryTab';

// Health Dashboard
import { VMDashboardTab } from '@/components/vm/dashboard';

// Problems Management
import { ProblemsTab } from '../../../../../components/vm/problems/ProblemsTab';

// Hooks
import useVMDetail from './hooks/useVMDetail';

const VMDetailPage = () => {
  const { name: departmentName, id: vmId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial tab from URL parameter, default to 'dashboard'
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update active tab when URL parameter changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams, activeTab]);

  // Handle tab change with URL update
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('tab', newTab);
    router.replace(currentUrl.pathname + currentUrl.search);
  };

  // Fetch VM details
  const { vm, loading, error, refetch } = useVMDetail(vmId);

  // Handle back navigation
  const handleBack = () => {
    router.push(`/departments/${departmentName}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-6">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-10 w-10 rounded" />
            <div className="flex-1">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>

          {/* Tabs Skeleton */}
          <Skeleton className="h-12 w-full mb-6" />

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Error loading VM details</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleBack} variant="outline">
              Go Back
            </Button>
            <Button onClick={refetch}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // VM not found
  if (!vm) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">VM not found</h2>
          <p className="text-muted-foreground mb-4">The virtual machine you're looking for doesn't exist.</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Department
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {departmentName}
        </Button>

        {/* VM Header */}
        <VMHeader vm={vm} onRefresh={refetch} />

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="problems" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Problemas</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Rendimiento</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Mantenimiento</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Historial</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="mt-6">
            <TabsContent value="dashboard" className="space-y-4">
              <VMDashboardTab vmId={vmId} vmName={vm?.name} onRefresh={refetch} />
            </TabsContent>

            <TabsContent value="problems" className="space-y-4">
              <ProblemsTab vmId={vmId} vmName={vm?.name} />
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <PerformanceTab vm={vm} />
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <MaintenanceTab vm={vm} />
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <HistoryTab vm={vm} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default VMDetailPage;