"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Monitor, Activity, Package, Server, Shield, Network, Zap, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

// Components
import VMHeader from './components/VMHeader';
import OverviewTab from './components/tabs/OverviewTab';
import PerformanceTab from './components/tabs/PerformanceTab';
import ApplicationsTab from './components/tabs/ApplicationsTab';
import ServicesTab from './components/tabs/ServicesTab';
import SecurityTab from './components/tabs/SecurityTab';
import NetworkTab from './components/tabs/NetworkTab';
import AutomationTab from './components/tabs/AutomationTab';
import LogsTab from './components/tabs/LogsTab';

// Hooks
import useVMDetail from './hooks/useVMDetail';

const VMDetailPage = () => {
  const { name: departmentName, id: vmId } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Applications</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="network" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              <span className="hidden sm:inline">Network</span>
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Automation</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Logs</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="mt-6">
            <TabsContent value="overview" className="space-y-4">
              <OverviewTab vm={vm} />
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-4">
              <PerformanceTab vm={vm} />
            </TabsContent>
            
            <TabsContent value="applications" className="space-y-4">
              <ApplicationsTab vm={vm} />
            </TabsContent>
            
            <TabsContent value="services" className="space-y-4">
              <ServicesTab vm={vm} />
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <SecurityTab vm={vm} />
            </TabsContent>
            
            <TabsContent value="network" className="space-y-4">
              <NetworkTab vm={vm} />
            </TabsContent>
            
            <TabsContent value="automation" className="space-y-4">
              <AutomationTab vm={vm} />
            </TabsContent>
            
            <TabsContent value="logs" className="space-y-4">
              <LogsTab vm={vm} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default VMDetailPage;