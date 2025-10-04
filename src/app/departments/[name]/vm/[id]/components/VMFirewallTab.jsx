"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Shield, AlertCircle, RefreshCcw, Clock, Server, Edit, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVmDetailedInfoQuery } from '@/gql/hooks';
import useVMFirewall from '@/hooks/useVMFirewall';
import VMStatusWarning from './VMStatusWarning';
import FirewallRulesSection from './FirewallRulesSection';
import EffectiveRulesView from './EffectiveRulesView';
import GenericFilterLibrary from '@/components/GenericFilterLibrary';
import ErrorBoundary from '@/components/ui/error-boundary';
import { getSocketService } from '@/services/socketService';
import { getFirewallConcepts } from '@/utils/firewallHelpers';
import { createDebugger } from '@/utils/debug';

const debug = createDebugger('frontend:components:vm-firewall-tab');

export default function VMFirewallTab({ vmId, vm, onPowerAction }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize tab from URL or default to 'servicios'
  const initialTab = searchParams?.get('tab') || 'servicios';
  const validTabs = ['servicios', 'personalizadas', 'efectivas'];
  const [activeTab, setActiveTab] = useState(
    validTabs.includes(initialTab) ? initialTab : 'servicios'
  );
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Refs for tab components
  const serviciosLibraryRef = useRef(null);

  debug.log('VM Firewall Tab mounted', { vmId, vmName: vm?.name, initialTab });

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
  const handleFirewallChange = useCallback(() => {
    debug.log('Firewall changed, refreshing data');
    refreshFirewallData();
  }, [refreshFirewallData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Guard: Don't interfere with typing in inputs
      const activeElement = document.activeElement;
      const isTyping = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.tagName === 'SELECT' ||
        activeElement.isContentEditable
      );

      const isButton = activeElement && activeElement.tagName === 'BUTTON';

      // Focus search on '/' key (unless already typing)
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !isTyping) {
        event.preventDefault();
        const searchInput = document.querySelector('input[type="text"], input[placeholder*="Buscar"]');
        if (searchInput) {
          searchInput.focus();
          debug.log('Keyboard shortcut: focused search input');
        }
      }

      // Tab switching with number keys (only when not typing)
      if (!isTyping && !event.ctrlKey && !event.metaKey && !event.altKey) {
        if (event.key === '1') {
          event.preventDefault();
          setActiveTab('servicios');
          debug.log('Keyboard shortcut: switched to tab 1 (servicios)');
        }
        if (event.key === '2') {
          event.preventDefault();
          setActiveTab('personalizadas');
          debug.log('Keyboard shortcut: switched to tab 2 (personalizadas)');
        }
        if (event.key === '3') {
          event.preventDefault();
          setActiveTab('efectivas');
          debug.log('Keyboard shortcut: switched to tab 3 (efectivas)');
        }
      }

      // Space: toggle focused row (prevent page scroll, unless button is focused)
      if (event.key === ' ' || event.key === 'Spacebar') {
        if (!isTyping && !isButton) {
          event.preventDefault();
          const focusedRow = document.activeElement;
          if (focusedRow?.hasAttribute('data-row')) {
            if (activeTab === 'servicios' && serviciosLibraryRef.current) {
              serviciosLibraryRef.current.toggleFocusedRow();
              debug.log('Keyboard shortcut: toggled focused row with Space');
            }
          }
        }
      }

      // ArrowDown: navigate to next row
      if (event.key === 'ArrowDown' && !isTyping) {
        event.preventDefault();
        if (activeTab === 'servicios' && serviciosLibraryRef.current) {
          serviciosLibraryRef.current.focusNextRow();
          debug.log('Keyboard shortcut: focused next row');
        }
      }

      // ArrowUp: navigate to previous row
      if (event.key === 'ArrowUp' && !isTyping) {
        event.preventDefault();
        if (activeTab === 'servicios' && serviciosLibraryRef.current) {
          serviciosLibraryRef.current.focusPrevRow();
          debug.log('Keyboard shortcut: focused previous row');
        }
      }

      // Enter: activate focused element (toggle/expand)
      if (event.key === 'Enter' && !isTyping) {
        const focusedRow = document.activeElement;
        if (focusedRow?.hasAttribute('data-row') && activeTab === 'servicios') {
          // Let the row's own Enter handler take over
          debug.log('Keyboard shortcut: activated focused row with Enter');
        }
      }

      // Escape: close dialogs via controlled state
      if (event.key === 'Escape') {
        let dialogClosed = false;

        // Check servicios tab for open dialogs
        if (activeTab === 'servicios' && serviciosLibraryRef.current) {
          if (serviciosLibraryRef.current.hasOpenDialogs()) {
            serviciosLibraryRef.current.closeAllDialogs();
            dialogClosed = true;
            debug.log('Keyboard shortcut: closed servicios dialog with Escape');
          }
        }

        if (dialogClosed) {
          event.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // WebSocket real-time updates via Redux
  // Note: RealTimeReduxService handles firewall events and dispatches 'firewall/realTimeGenericFilterChanged'
  // We listen to that action to trigger refresh
  useEffect(() => {
    const handleStorageEvent = () => {
      // This will be triggered by Redux state changes
      // Check if we need to refresh based on Redux action
      debug.log('Redux: checking for firewall update flag');
    };

    // Subscribe to Redux store changes for firewall updates
    // The RealTimeReduxService will dispatch the action, we just need to refresh
    const unsubscribe = () => {
      debug.log('Unsubscribed from firewall Redux updates');
    };

    debug.log('Subscribed to firewall Redux updates (via RealTimeReduxService)');

    return unsubscribe;
  }, [refreshFirewallData]);

  // Update URL when tab changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    router.replace(url.pathname + url.search, { scroll: false });
    debug.log('Tab changed', { activeTab });
  }, [activeTab, router]);

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
    <div className="space-y-6">
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

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass-medium size-padding mb-6">
          <TabsTrigger value="servicios" className="size-text flex items-center gap-2">
            <Shield className="size-icon" />
            Servicios Predefinidos
          </TabsTrigger>
          <TabsTrigger value="personalizadas" className="size-text flex items-center gap-2">
            <Edit className="size-icon" />
            Reglas Personalizadas
          </TabsTrigger>
          <TabsTrigger value="efectivas" className="size-text flex items-center gap-2">
            <Eye className="size-icon" />
            Reglas Efectivas
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Servicios Predefinidos */}
        <TabsContent value="servicios" className="space-y-4">
          <ErrorBoundary onReset={handleRefreshData}>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <GenericFilterLibrary
                ref={serviciosLibraryRef}
                vmId={vmId}
                onFilterChange={handleFirewallChange}
                disabled={isVMRunning}
              />
            )}
          </ErrorBoundary>
        </TabsContent>

        {/* Tab 2: Reglas Personalizadas */}
        <TabsContent value="personalizadas" className="space-y-4">
          <ErrorBoundary onReset={handleRefreshData}>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <FirewallRulesSection
                customRules={customRules}
                effectiveRules={effectiveRules}
                vmId={vmId}
                onRuleChange={handleFirewallChange}
                disabled={isVMRunning}
              />
            )}
          </ErrorBoundary>
        </TabsContent>

        {/* Tab 3: Reglas Efectivas */}
        <TabsContent value="efectivas" className="space-y-4">
          <ErrorBoundary onReset={handleRefreshData}>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <EffectiveRulesView
                effectiveRules={effectiveRules}
                vmId={vmId}
              />
            )}
          </ErrorBoundary>
        </TabsContent>
      </Tabs>

      {/* Last Update Info */}
      <div className="flex items-center justify-center size-small text-muted-foreground pt-6 mt-8 border-t">
        <Clock className="h-3 w-3 mr-1" />
        Last update: {lastRefresh.toLocaleTimeString()}
      </div>
    </div>
  );
}
