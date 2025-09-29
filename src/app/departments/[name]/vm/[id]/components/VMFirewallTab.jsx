"use client";

import React, { useState } from 'react';
import { Shield, AlertCircle, RefreshCcw, Clock, Server } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Alert, AlertDescription } from '@components/ui/alert';
import { useVmDetailedInfoQuery } from '@/gql/hooks';
import useVMFirewall from '@/hooks/useVMFirewall';
import VMStatusWarning from './VMStatusWarning';
import VMSecurityTabs from './VMSecurityTabs';
import FirewallTemplateSection from './FirewallTemplateSection';
import FirewallRulesSection from './FirewallRulesSection';
import { getFirewallConcepts } from '@/utils/firewallHelpers';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:vm-firewall-tab');

export default function VMFirewallTab({ vmId, vm, onPowerAction }) {
  const [activeTab, setActiveTab] = useState('firewall');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  debug.log('VM Firewall Tab mounted', { vmId, vmName: vm?.name });

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
      debug.log('Refreshing VM firewall data');
      await Promise.all([
        refetchVM(),
        refreshFirewallData()
      ]);
      setLastRefresh(new Date());
      debug.success('VM firewall data refreshed successfully');
    } catch (error) {
      debug.error('Error refreshing VM firewall data:', error);
    }
  };

  // Handle VM stopped event
  const handleVMStopped = () => {
    debug.log('VM stopped, refreshing VM data');
    refetchVM();
  };

  // Handle firewall changes
  const handleFirewallChange = () => {
    debug.log('Firewall changed, refreshing data');
    refreshFirewallData();
  };

  const concepts = getFirewallConcepts();

  if (hasError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading VM firewall configuration: {firewallError?.message || vmError?.message}
          </AlertDescription>
        </Alert>
        <Button onClick={handleRefreshData} variant="outline">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Security Tabs Navigation */}
      <VMSecurityTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="size-margin-md">
        {/* Render the appropriate tab content based on activeTab */}
        {activeTab === "firewall" ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Shield className="h-6 w-6 text-blue-600" />
                <div className="space-y-2">
                  <h2 className="size-heading">VM Firewall</h2>
                  <p className="size-text text-muted-foreground">
                    Manage network security rules for <strong>{vm?.name}</strong>
                  </p>
                  <p className="size-small text-muted-foreground">
                    VM rules can be overridden by department-level rules
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {lastSync && (
                  <div className="flex items-center gap-1 size-small text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Last sync: {lastSync.toLocaleTimeString()}
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshData}
                  disabled={isLoading}
                >
                  <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* VM Priority Notice */}
            <Alert>
              <Server className="h-4 w-4" />
              <AlertDescription>
                <strong>Important note:</strong> Firewall rules configured at the department level
                will automatically be applied to this VM and will take priority over
                rules configured individually on this VM.
              </AlertDescription>
            </Alert>

            {/* VM Status Warning */}
            {isVMRunning && (
              <VMStatusWarning
                vmStatus={vmStatus}
                vmId={vmId}
                vmName={vm?.name}
                onVMStopped={handleVMStopped}
              />
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                  <RefreshCcw className="h-5 w-5 animate-spin" />
                  <span>Loading VM firewall configuration...</span>
                </div>
              </div>
            )}

            {/* Conflicts Alert */}
            {!isLoading && checkRuleConflicts && checkRuleConflicts.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{checkRuleConflicts.length} conflict(s) detected in VM rules:</strong>
                  <ul className="mt-2 text-sm">
                    {checkRuleConflicts.slice(0, 3).map((conflict, index) => (
                      <li key={index} className="ml-4">• {conflict.issue}</li>
                    ))}
                    {checkRuleConflicts.length > 3 && (
                      <li className="ml-4">• And {checkRuleConflicts.length - 3} more conflict(s)...</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Main Content - Rules Section */}
            {!isLoading && (
              <div className="space-y-8">
                <FirewallTemplateSection
                  availableTemplates={availableTemplates}
                  appliedTemplates={appliedTemplates}
                  onTemplateChange={handleFirewallChange}
                  disabled={isVMRunning}
                  vmId={vmId}
                />

                <FirewallRulesSection
                  customRules={customRules}
                  effectiveRules={effectiveRules}
                  vmId={vmId}
                  onRuleChange={handleFirewallChange}
                  disabled={isVMRunning}
                />
              </div>
            )}

            {/* Last Update Info */}
            <div className="flex items-center justify-center size-small text-muted-foreground pt-6 mt-8 border-t">
              <Clock className="h-3 w-3 mr-1" />
              Last update: {lastRefresh.toLocaleTimeString()}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Security Overview Tab */}
            <div className="flex items-center gap-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <div className="space-y-2">
                <h2 className="size-heading">Security Overview</h2>
                <p className="size-text text-muted-foreground">
                  General security information for <strong>{vm?.name}</strong>
                </p>
              </div>
            </div>

            <Card glass="medium" elevation="2">
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
                <CardDescription>
                  Overview of security settings and status for this VM
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 size-text">
                  <div>
                    <p className="text-muted-foreground">VM Status:</p>
                    <p className="font-medium">{isVMRunning ? 'Running' : 'Stopped'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Firewall Rules:</p>
                    <p className="font-medium">{(appliedTemplates?.length || 0) + (customRules?.length || 0)} active</p>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    For detailed firewall configuration, switch to the <strong>Firewall</strong> tab.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
