"use client";

import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, RefreshCcw, Clock, Building } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Alert, AlertDescription } from '@components/ui/alert';
import useDepartmentFirewall from '@/hooks/useDepartmentFirewall';
import DepartmentFirewallTemplateSection from './DepartmentFirewallTemplateSection';
import DepartmentFirewallRulesSection from './DepartmentFirewallRulesSection';
import { getFirewallConcepts } from '@/utils/firewallHelpers';

export default function DepartmentFirewallTab({ departmentId, departmentName }) {
  const [activeTab, setActiveTab] = useState('overview');
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

  const concepts = getFirewallConcepts();

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

      {/* Main Content */}
      {!isLoading && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Applied Templates</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {rulesSummary?.appliedTemplatesCount || 0}
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
                    <p className="text-sm text-gray-600">Custom Filters</p>
                    <p className="text-2xl font-bold text-green-600">
                      {rulesSummary?.filtersCount - rulesSummary?.appliedTemplatesCount || 0}
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
                    <p className="text-sm text-gray-600">Active Rules</p>
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
                    <p className="text-sm text-gray-600">Conflicts</p>
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

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="help">Help</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Department Firewall Status
                    </CardTitle>
                    <CardDescription>
                      Current configuration summary for {departmentName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Inbound Traffic</p>
                        <p className="font-medium">{rulesSummary?.inbound || 0} rules</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Outbound Traffic</p>
                        <p className="font-medium">{rulesSummary?.outbound || 0} rules</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Allow</p>
                        <p className="font-medium text-green-600">{rulesSummary?.allow || 0} rules</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Deny</p>
                        <p className="font-medium text-red-600">{rulesSummary?.deny || 0} rules</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Applied Templates Preview */}
                {appliedTemplates && appliedTemplates.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Department Applied Templates</CardTitle>
                      <CardDescription>
                        Active firewall templates for all VMs in the department
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

                {/* Department Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Department Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Department:</span>
                      <Badge variant="outline">
                        {departmentName}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total filters:</span>
                      <span>{rulesSummary?.filtersCount || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total rules:</span>
                      <span>{rulesSummary?.total || 0}</span>
                    </div>
                    {lastSync && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Last synchronization:</span>
                        <span>{lastSync.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Available templates:</span>
                      <span>{availableTemplates?.length || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-6">
              <DepartmentFirewallTemplateSection
                availableTemplates={availableTemplates}
                appliedTemplates={appliedTemplates}
                departmentFilters={departmentFilters}
                onTemplateChange={handleFirewallChange}
                departmentId={departmentId}
                departmentName={departmentName}
              />
            </TabsContent>

            {/* Rules Tab */}
            <TabsContent value="rules" className="space-y-6">
              <DepartmentFirewallRulesSection
                customRules={customRules}
                effectiveRules={effectiveRules}
                departmentFilters={departmentFilters}
                departmentId={departmentId}
                departmentName={departmentName}
                onRuleChange={handleFirewallChange}
              />
            </TabsContent>

            {/* Help Tab */}
            <TabsContent value="help" className="space-y-6">
              <div className="grid gap-6">
                {/* Department-specific concepts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Department-Level Firewall</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700">
                      Firewall rules configured at the department level are automatically applied
                      to all virtual machines that belong to the department. These rules take
                      priority over rules configured individually on each VM, allowing
                      unified security policies to be established for the entire department.
                    </p>
                  </CardContent>
                </Card>

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

                {/* Department-specific tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Department Firewall Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• Department rules apply to ALL VMs in the department</li>
                      <li>• Department rules take priority over VM rules</li>
                      <li>• Use templates to apply standard configurations to the entire department</li>
                      <li>• Be careful when applying restrictive rules that may affect multiple VMs</li>
                      <li>• Coordinate with VM administrators before making important changes</li>
                      <li>• Document department rules to facilitate maintenance</li>
                      <li>• Periodically review rules to ensure they are still necessary</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Contact Support */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Need additional help?</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          If you have questions about department firewall configuration or need
                          technical assistance, contact the IT support team.
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
        Last update: {lastRefresh.toLocaleTimeString()}
      </div>
    </div>
  );
}