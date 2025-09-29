'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VmFirewallWizard } from '@/components/VmFirewall';
import { useVmDetailedInfoQuery } from '@/gql/hooks';
import useVMFirewall from '@/hooks/useVMFirewall';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:pages:VMFirewallCreate');

export default function VMFirewallCreatePage() {
  const router = useRouter();
  const params = useParams();
  const { name: departmentName, id: vmId } = params;

  const [isWizardMounted, setIsWizardMounted] = useState(false);

  // Get VM data
  const {
    data: vmData,
    loading: vmLoading,
    error: vmError,
    refetch: refetchVm
  } = useVmDetailedInfoQuery({
    variables: { id: vmId },
    skip: !vmId,
    onCompleted: (data) => {
      debug.success('VM data loaded:', data?.machine?.name);
    },
    onError: (error) => {
      debug.error('Failed to load VM data:', error);
    }
  });

  // Get VM firewall data and refresh function
  const {
    firewallState: firewallData,
    isLoading: firewallLoading,
    error: firewallError,
    refreshData: refreshFirewallData
  } = useVMFirewall(vmId);

  useEffect(() => {
    debug.log('VM Firewall Create page mounted', { departmentName, vmId });
    setIsWizardMounted(true);

    return () => {
      debug.log('VM Firewall Create page unmounted');
    };
  }, [departmentName, vmId]);

  const handleWizardComplete = () => {
    debug.info('Firewall rule wizard completed, navigating back');
    router.push(`/departments/${departmentName}/vm/${vmId}?tab=firewall`);
  };

  const handleRuleChange = async () => {
    debug.info('Firewall rule changed, refreshing data');
    try {
      await refreshFirewallData();
      debug.success('Firewall data refreshed successfully');
    } catch (error) {
      debug.error('Failed to refresh firewall data:', error);
    }
  };

  const handleBackClick = () => {
    debug.info('Back button clicked, navigating to VM firewall tab');
    router.push(`/departments/${departmentName}/vm/${vmId}?tab=firewall`);
  };

  // Loading state
  if (vmLoading || firewallLoading) {
    return (
      <div className="min-h-screen glass-medium p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>

          {/* Content skeleton */}
          <Card className="glass-subtle">
            <CardContent className="p-8">
              <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                </div>
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (vmError || firewallError) {
    const error = vmError || firewallError;
    return (
      <div className="min-h-screen glass-medium p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="text-glass-text-primary hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>

          <Alert className="glass-subtle border-red-500/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error al cargar los datos: {error?.message || 'Error desconocido'}
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button onClick={() => refetchVm()} variant="outline">
              Reintentar
            </Button>
            <Button onClick={handleBackClick} variant="ghost">
              Volver al Firewall
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // VM not found
  if (!vmData?.machine) {
    return (
      <div className="min-h-screen glass-medium p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="text-glass-text-primary hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>

          <Alert className="glass-subtle border-orange-500/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              La máquina virtual no fue encontrada o no tienes permisos para acceder a ella.
            </AlertDescription>
          </Alert>

          <Button onClick={handleBackClick} variant="outline">
            Volver al Listado
          </Button>
        </div>
      </div>
    );
  }

  const vm = vmData.machine;

  return (
    <div className="min-h-screen glass-medium">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="text-glass-text-primary hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-center gap-3">
            <div className="p-2 glass-subtle rounded-lg">
              <Shield className="h-6 w-6 text-glass-text-primary" />
            </div>
            <div>
              <h1 className="size-mainheading text-glass-text-primary">
                Crear Regla de Firewall
              </h1>
              <div className="flex items-center gap-2 text-glass-text-secondary size-text">
                <span>Inicio</span>
                <span>/</span>
                <span>Departamentos</span>
                <span>/</span>
                <span className="capitalize">{departmentName}</span>
                <span>/</span>
                <span>VM</span>
                <span>/</span>
                <span className="font-medium">{vm.name}</span>
                <span>/</span>
                <span>Crear Regla</span>
              </div>
            </div>
          </div>
        </div>

        {/* VM Status Warning */}
        {vm.status === 'running' && (
          <Alert className="glass-subtle border-orange-500/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              La máquina virtual está en ejecución. Las reglas se aplicarán inmediatamente.
            </AlertDescription>
          </Alert>
        )}

        {/* Wizard Container */}
        <Card className="glass-subtle border border-white/10">
          <CardContent className="p-8">
            {isWizardMounted ? (
              <VmFirewallWizard
                vmId={vmId}
                vmName={vm.name}
                onRuleChange={handleRuleChange}
                onComplete={handleWizardComplete}
              />
            ) : (
              <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                </div>
                <Skeleton className="h-16 w-full" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}