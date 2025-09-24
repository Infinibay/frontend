"use client";

import React, { useState } from 'react';
import { Shield, AlertCircle, RefreshCcw, Clock, Building } from 'lucide-react';
import { Alert, AlertDescription } from '@components/ui/alert';
import { Button } from '@components/ui/button';
import useDepartmentFirewall from '@/hooks/useDepartmentFirewall';
import DepartmentFirewallRulesSection from './DepartmentFirewallRulesSection';

export default function DepartmentFirewallTab({ departmentId, departmentName }) {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Get department firewall data
  const {
    departmentFilters,
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
  } = useDepartmentFirewall(departmentId);

  const isLoading = firewallLoading;
  const hasError = firewallError;

  // Refresh all data
  const handleRefreshData = async () => {
    try {
      await refreshFirewallData();
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Handle firewall changes
  const handleFirewallChange = () => {
    refreshFirewallData();
  };

  if (hasError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading department firewall configuration: {firewallError?.message}
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
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold">Department Firewall</h2>
            <p className="text-sm text-gray-600">
              Manage network security rules for the <strong>{departmentName}</strong> department
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Department rules take priority over individual VM rules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastSync && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
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

      {/* Department Priority Notice */}
      <Alert>
        <Building className="h-4 w-4" />
        <AlertDescription>
          <strong>Important note:</strong> Firewall rules configured at the department level
          will be automatically applied to all VMs in the department and will take priority over
          rules configured individually on each VM.
        </AlertDescription>
      </Alert>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <RefreshCcw className="h-5 w-5 animate-spin" />
            <span>Loading department firewall configuration...</span>
          </div>
        </div>
      )}

      {/* Conflicts Alert */}
      {!isLoading && checkRuleConflicts && checkRuleConflicts.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>{checkRuleConflicts.length} conflict(s) detected in department rules:</strong>
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
        <DepartmentFirewallRulesSection
          customRules={customRules}
          effectiveRules={effectiveRules}
          departmentFilters={departmentFilters}
          departmentId={departmentId}
          departmentName={departmentName}
          onRuleChange={handleFirewallChange}
          availableTemplates={availableTemplates}
          appliedTemplates={appliedTemplates}
        />
      )}

      {/* Last Update Info */}
      <div className="flex items-center justify-center text-xs text-gray-500 pt-4 border-t">
        <Clock className="h-3 w-3 mr-1" />
        Last update: {lastRefresh.toLocaleTimeString()}
      </div>
    </div>
  );
}