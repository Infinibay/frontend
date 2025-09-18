"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Shield, AlertCircle, RefreshCcw, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Alert, AlertDescription } from '@components/ui/alert';
import { useVmDetailedInfoQuery } from '@/gql/hooks';
import useVMFirewall from '@/hooks/useVMFirewall';
import VMStatusWarning from './VMStatusWarning';
import FirewallTemplateSection from './FirewallTemplateSection';
import FirewallRulesSection from './FirewallRulesSection';
import { getFirewallConcepts } from '@/utils/firewallHelpers';

export default function VMFirewallTab({ vmId, vmName }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Get VM details to check status
  const {
    data: vmData,
    loading: vmLoading,
    error: vmError,
    refetch: refetchVM
  } = useVmDetailedInfoQuery({
    variables: { id: vmId },
    skip: !vmId,
    fetchPolicy: 'cache-and-network'
  });

  // Get firewall data
  const {
    firewallState,
    availableTemplates,
    appliedTemplates,
    customRules,
    effectiveRules,
    rulesSummary,
    checkRuleConflicts,
    lastSync,
    isLoading: firewallLoading,
    error: firewallError,
    refreshData: refreshFirewallData
  } = useVMFirewall(vmId);

  const vmStatus = vmData?.machine?.status;
  const isVMRunning = vmStatus === 'running';
  const isLoading = vmLoading || firewallLoading;
  const hasError = vmError || firewallError;

  // Refresh all data
  const handleRefreshData = async () => {
    try {
      await Promise.all([
        refetchVM(),
        refreshFirewallData()
      ]);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Handle VM stopped event
  const handleVMStopped = () => {
    // Refresh VM data to update status
    refetchVM();
  };

  // Handle firewall changes
  const handleFirewallChange = () => {
    refreshFirewallData();
  };

  const concepts = getFirewallConcepts();

  if (hasError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error al cargar la configuración del firewall: {firewallError?.message || vmError?.message}
          </AlertDescription>
        </Alert>
        <Button onClick={handleRefreshData} variant="outline">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold">Configuración de Firewall</h2>
            <p className="text-sm text-gray-600">
              Gestione las reglas de seguridad de red para {vmName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastSync && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              Última sincronización: {lastSync.toLocaleTimeString()}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshData}
            disabled={isLoading}
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* VM Status Warning */}
      {isVMRunning && (
        <VMStatusWarning
          vmStatus={vmStatus}
          vmId={vmId}
          vmName={vmName}
          onVMStopped={handleVMStopped}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <RefreshCcw className="h-5 w-5 animate-spin" />
            <span>Cargando configuración del firewall...</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Plantillas Aplicadas</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {appliedTemplates?.length || 0}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Reglas Personalizadas</p>
                    <p className="text-2xl font-bold text-green-600">
                      {customRules?.length || 0}
                    </p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Reglas Activas</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {rulesSummary?.enabled || 0}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Conflictos</p>
                    <p className={`text-2xl font-bold ${
                      checkRuleConflicts?.length > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {checkRuleConflicts?.length || 0}
                    </p>
                  </div>
                  <AlertCircle className={`h-8 w-8 ${
                    checkRuleConflicts?.length > 0 ? 'text-red-500' : 'text-green-500'
                  }`} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Conflicts Alert */}
          {checkRuleConflicts && checkRuleConflicts.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Se detectaron {checkRuleConflicts.length} conflicto(s) en las reglas:</strong>
                <ul className="mt-2 text-sm">
                  {checkRuleConflicts.slice(0, 3).map((conflict, index) => (
                    <li key={index} className="ml-4">• {conflict.issue}</li>
                  ))}
                  {checkRuleConflicts.length > 3 && (
                    <li className="ml-4">• Y {checkRuleConflicts.length - 3} conflicto(s) más...</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="templates">Plantillas</TabsTrigger>
              <TabsTrigger value="rules">Reglas</TabsTrigger>
              <TabsTrigger value="help">Ayuda</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Estado del Firewall
                    </CardTitle>
                    <CardDescription>
                      Resumen rápido de la configuración actual
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Tráfico Entrante</p>
                        <p className="font-medium">{rulesSummary?.inbound || 0} reglas</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tráfico Saliente</p>
                        <p className="font-medium">{rulesSummary?.outbound || 0} reglas</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Permitir</p>
                        <p className="font-medium text-green-600">{rulesSummary?.allow || 0} reglas</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Denegar</p>
                        <p className="font-medium text-red-600">{rulesSummary?.deny || 0} reglas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Applied Templates Preview */}
                {appliedTemplates && appliedTemplates.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Plantillas Aplicadas</CardTitle>
                      <CardDescription>
                        Plantillas de firewall actualmente activas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {appliedTemplates.map((templateName) => (
                          <Badge key={templateName} variant="secondary" className="bg-green-100 text-green-800">
                            {availableTemplates?.find(t => t.template === templateName)?.name || templateName}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Información del Sistema</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Estado de la VM:</span>
                      <Badge variant={isVMRunning ? "default" : "secondary"}>
                        {isVMRunning ? 'Ejecutándose' : 'Detenida'}
                      </Badge>
                    </div>
                    {lastSync && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Última sincronización:</span>
                        <span>{lastSync.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Plantillas disponibles:</span>
                      <span>{availableTemplates?.length || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              <FirewallTemplateSection
                availableTemplates={availableTemplates}
                appliedTemplates={appliedTemplates}
                onTemplateChange={handleFirewallChange}
                disabled={isVMRunning}
                vmId={vmId}
              />
            </TabsContent>

            {/* Rules Tab */}
            <TabsContent value="rules" className="space-y-6">
              <FirewallRulesSection
                customRules={customRules}
                effectiveRules={effectiveRules}
                vmId={vmId}
                onRuleChange={handleFirewallChange}
                disabled={isVMRunning}
              />
            </TabsContent>

            {/* Help Tab */}
            <TabsContent value="help" className="space-y-6">
              <div className="grid gap-6">
                {Object.entries(concepts).map(([key, concept]) => (
                  <Card key={key}>
                    <CardHeader>
                      <CardTitle className="text-base">{concept.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">{concept.content}</p>
                    </CardContent>
                  </Card>
                ))}

                {/* Quick Tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Consejos Importantes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• Las reglas más específicas tienen prioridad sobre las generales</li>
                      <li>• Las reglas de "Denegar" se procesan antes que las de "Permitir"</li>
                      <li>• Siempre pruebe los cambios en horarios de menor actividad</li>
                      <li>• Mantenga un backup de las reglas antes de hacer cambios importantes</li>
                      <li>• Use plantillas para configuraciones comunes</li>
                      <li>• Revise periódicamente las reglas para eliminar las innecesarias</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Contact Support */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">¿Necesita ayuda adicional?</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Si tiene dudas sobre la configuración del firewall o necesita
                          asistencia técnica, contacte al equipo de soporte de TI.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Last Update Info */}
      <div className="flex items-center justify-center text-xs text-gray-500 pt-4 border-t">
        <Clock className="h-3 w-3 mr-1" />
        Última actualización: {lastRefresh.toLocaleTimeString()}
      </div>
    </div>
  );
}
