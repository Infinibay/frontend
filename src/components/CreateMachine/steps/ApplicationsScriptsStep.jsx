'use client';

import React, { useState } from 'react';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import { AppStoreInstaller } from '@/components/ui/app-store-installer';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { fetchApplications } from '@/state/slices/applications';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { createDebugger } from '@/utils/debug';
import { useGetDepartmentFirewallRulesQuery, useDepartmentScriptsQuery, RuleAction, RuleDirection } from '@/gql/hooks';
import { AlertTriangle, FileCode, Play } from 'lucide-react';
import { ScriptInputRenderer } from '@/components/ScriptInput/ScriptInputRenderer';
import { cn } from '@/lib/utils';

const debug = createDebugger('frontend:components:applications-scripts-step');

export function ApplicationsScriptsStep({ id }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};

  // Get departmentId from basicInfo step
  const departmentId = values.basicInfo?.departmentId;

  // Script selection state
  const [selectedScripts, setSelectedScripts] = useState(stepValues.scripts || []);
  const [configureDialogOpen, setConfigureDialogOpen] = useState(false);
  const [currentScript, setCurrentScript] = useState(null);
  const [currentInputValues, setCurrentInputValues] = useState({});

  // Use optimized data loading for applications
  const {
    data: applications,
    isLoading: loading,
    error,
    hasData
  } = useEnsureData('applications', fetchApplications, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch department firewall rules to check if ports 443 and 80 are enabled
  const { data: firewallData, loading: firewallLoading } = useGetDepartmentFirewallRulesQuery({
    variables: { departmentId: departmentId || '' },
    skip: !departmentId,
  });

  // Fetch department scripts
  const { data: scriptsData, loading: scriptsLoading } = useDepartmentScriptsQuery({
    variables: { departmentId: departmentId || '' },
    skip: !departmentId
  });

  const selectedAppIds = stepValues.applications || [];

  // Check if department has outbound HTTPS (443) and HTTP (80) enabled
  const checkPortEnabled = (port) => {
    if (!firewallData?.getDepartmentFirewallRules?.rules) return false;

    return firewallData.getDepartmentFirewallRules.rules.some(rule => {
      // Check if rule allows outbound traffic on the specified port
      const isOutbound = rule.direction === RuleDirection.Out || rule.direction === RuleDirection.Inout;
      const isAccept = rule.action === RuleAction.Accept;

      // Check protocol: TCP, all, or no protocol specified
      const protocol = rule.protocol?.toLowerCase();
      const protocolMatches = !protocol || protocol === 'all' || protocol === 'tcp';

      // Check port coverage:
      // 1. If both dstPortStart and dstPortEnd are null, rule allows all ports
      // 2. If ports are specified, check if the requested port is in range
      let portMatches = false;
      if (rule.dstPortStart === null && rule.dstPortEnd === null) {
        // Rule allows all destination ports (no port restriction)
        portMatches = true;
      } else if (rule.dstPortStart !== null && rule.dstPortEnd !== null) {
        // Rule has specific port range, check if port is within range
        portMatches = rule.dstPortStart <= port && rule.dstPortEnd >= port;
      }

      return isOutbound && isAccept && protocolMatches && portMatches;
    });
  };

  const hasHttpsEnabled = checkPortEnabled(443);
  const hasHttpEnabled = checkPortEnabled(80);
  const canInstallApps = hasHttpsEnabled && hasHttpEnabled;

  debug.info('ApplicationsStep state:', {
    applicationsCount: applications?.length || 0,
    selectedCount: selectedAppIds.length,
    loading,
    hasError: !!error,
    hasData,
    departmentId,
    firewallLoading,
    hasHttpsEnabled,
    hasHttpEnabled,
    canInstallApps
  });

  const allApps = (applications || []).map(app => ({
    id: app.id,
    name: app.name,
    description: app.description || `Add ${app.name} to your machine`,
    icon: app.icon || null,
    iconType: app.iconType || (app.icon && app.icon.startsWith('<svg') ? 'svg' : 'image'),
    fallbackIcon: 'https://cdn.simpleicons.org/package'
  }));

  const handleSelectionChange = async (appId, isSelected) => {
    debug.info('Application selection changed:', { appId, isSelected });
    const currentApps = stepValues.applications || [];
    if (isSelected) {
      if (!currentApps.includes(appId)) {
        setValue(`${id}.applications`, [...currentApps, appId]);
      }
    } else {
      setValue(`${id}.applications`, currentApps.filter(id => id !== appId));
    }
  };

  // Script handler functions
  const handleAddScript = (script) => {
    const newScript = {
      scriptId: script.id,
      inputValues: {}
    };
    const updated = [...selectedScripts, newScript];
    setSelectedScripts(updated);
    setValue(`${id}.scripts`, updated);

    // If script has inputs, open configure dialog
    if (script.hasInputs) {
      handleConfigureScript(script);
    }
  };

  const handleRemoveScript = (scriptId) => {
    const updated = selectedScripts.filter(s => s.scriptId !== scriptId);
    setSelectedScripts(updated);
    setValue(`${id}.scripts`, updated);
  };

  const handleConfigureScript = (script) => {
    setCurrentScript(script);
    const existing = selectedScripts.find(s => s.scriptId === script.id);
    setCurrentInputValues(existing?.inputValues || {});
    setConfigureDialogOpen(true);
  };

  const handleSaveConfiguration = () => {
    const updated = selectedScripts.map(s =>
      s.scriptId === currentScript.id
        ? { ...s, inputValues: currentInputValues }
        : s
    );
    setSelectedScripts(updated);
    setValue(`${id}.scripts`, updated);
    setConfigureDialogOpen(false);
    setCurrentScript(null);
    setCurrentInputValues({});
  };

  const renderLoadingSkeleton = () => (
    <div className="min-h-[400px] mt-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex items-center justify-center min-h-[400px] mt-4">
      <div className="text-center space-y-2">
        <div className="text-red-500">Error loading applications</div>
        <div className="text-sm text-muted-foreground">
          {error?.message || 'Failed to load available applications'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Select Applications</h2>
        <p className="text-sm text-muted-foreground">
          Choose the applications you want to add to your machine.
        </p>
      </div>

      {!firewallLoading && !canInstallApps && departmentId && (
        <Card glass="subtle" className="p-4 border-amber-500/50 bg-amber-500/10">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-amber-500">Application Installation Not Available</h3>
              <p className="text-sm text-muted-foreground">
                Due to the department's firewall configuration, applications cannot be automatically installed.
                The selected department does not allow outbound traffic on ports 443 (HTTPS) and 80 (HTTP),
                which are required for downloading and installing applications.
              </p>
              <p className="text-sm text-muted-foreground">
                To enable application installation, please configure the department's firewall rules to allow
                outbound traffic on ports 443 and 80 before creating this VM.
              </p>
              {!hasHttpsEnabled && !hasHttpEnabled && (
                <p className="text-sm font-medium text-amber-500">
                  Missing ports: 443 (HTTPS) and 80 (HTTP)
                </p>
              )}
              {!hasHttpsEnabled && hasHttpEnabled && (
                <p className="text-sm font-medium text-amber-500">
                  Missing port: 443 (HTTPS)
                </p>
              )}
              {hasHttpsEnabled && !hasHttpEnabled && (
                <p className="text-sm font-medium text-amber-500">
                  Missing port: 80 (HTTP)
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

        <Card glass="subtle" className="p-6">
          <Label
            moreInformation="Applications will be automatically added to the installation list during machine creation. You can browse and select applications from the App Store interface. Additional applications can be added later through the machine's management interface."
          >
            Applications to Add
          </Label>
          {loading ? (
            renderLoadingSkeleton()
          ) : error ? (
            renderErrorState()
          ) : (
            <AppStoreInstaller
              apps={allApps}
              selectedAppIds={selectedAppIds}
              onSelectionChange={handleSelectionChange}
              size="md"
              className="min-h-[400px] mt-4"
            />
          )}
        </Card>

      <Card glass="subtle" className="p-6">
        <Label
          moreInformation="Scripts will be executed on first boot after the operating system is installed and InfiniService is running. You can configure input parameters for each script."
        >
          Scripts to Run on First Boot
        </Label>

        {scriptsLoading ? (
          <div>Loading scripts...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {scriptsData?.departmentScripts?.map(script => {
              const isSelected = selectedScripts.some(s => s.scriptId === script.id);
              return (
                <Card key={script.id} className={cn(
                  "p-4 cursor-pointer transition-all",
                  isSelected && "border-primary bg-primary/5"
                )}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileCode className="h-5 w-5" />
                        <h3 className="font-medium">{script.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {script.description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {script.os?.map(os => (
                          <Badge key={os} variant="secondary" className="text-xs">{os}</Badge>
                        ))}
                        {script.hasInputs && (
                          <Badge variant="outline" className="text-xs">{script.inputCount} inputs</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {isSelected ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveScript(script.id)}
                        >
                          Remove
                        </Button>
                        {script.hasInputs && (
                          <Button
                            size="sm"
                            onClick={() => handleConfigureScript(script)}
                          >
                            Configure
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleAddScript(script)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>

      <Dialog open={configureDialogOpen} onOpenChange={setConfigureDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure Script: {currentScript?.name}</DialogTitle>
          </DialogHeader>
          {currentScript && (
            <div className="space-y-4 py-4">
              {currentScript.parsedInputs?.map(input => (
                <ScriptInputRenderer
                  key={input.name}
                  input={input}
                  value={currentInputValues[input.name]}
                  onChange={(value) => setCurrentInputValues(prev => ({
                    ...prev,
                    [input.name]: value
                  }))}
                />
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigureDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfiguration}>
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {getError('applications') && (
        <p className="mt-2 text-sm text-red-500">{getError('applications')}</p>
      )}
    </div>
  );
}
