'use client';

import React, { useState } from 'react';
import { useWizardContext } from '@/components/ui/wizard';
import { useFormError } from '@/components/ui/form-error-provider';
import { AppStoreInstaller } from '@/components/ui/app-store-installer';
import { Badge, Button, Card, Skeleton } from '@infinibay/harbor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { fetchApplications } from '@/state/slices/applications';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { createDebugger } from '@/utils/debug';
import { useGetDepartmentFirewallRulesQuery, useDepartmentScriptsQuery, RuleAction, RuleDirection } from '@/gql/hooks';
import { AlertTriangle, FileCode, Play, CheckCircle2 } from 'lucide-react';
import { ScriptInputRenderer } from '@/components/ScriptInput/ScriptInputRenderer';
import { cn } from '@/lib/utils';

const debug = createDebugger('frontend:components:applications-scripts-step');

export function ApplicationsScriptsStep({ id, className }) {
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
    hasData,
  } = useEnsureData('applications', fetchApplications, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch department firewall rules
  const { data: firewallData, loading: firewallLoading } = useGetDepartmentFirewallRulesQuery({
    variables: { departmentId: departmentId || '' },
    skip: !departmentId,
  });

  // Fetch department scripts
  const { data: scriptsData, loading: scriptsLoading } = useDepartmentScriptsQuery({
    variables: { departmentId: departmentId || '' },
    skip: !departmentId,
  });

  const selectedAppIds = stepValues.applications || [];

  const checkPortEnabled = (port) => {
    if (!firewallData?.getDepartmentFirewallRules?.rules) return false;

    return firewallData.getDepartmentFirewallRules.rules.some((rule) => {
      const isOutbound = rule.direction === RuleDirection.Out || rule.direction === RuleDirection.Inout;
      const isAccept = rule.action === RuleAction.Accept;

      const protocol = rule.protocol?.toLowerCase();
      const protocolMatches = !protocol || protocol === 'all' || protocol === 'tcp';

      let portMatches = false;
      if (rule.dstPortStart === null && rule.dstPortEnd === null) {
        portMatches = true;
      } else if (rule.dstPortStart !== null && rule.dstPortEnd !== null) {
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
    canInstallApps,
  });

  const allApps = (applications || []).map((app) => ({
    id: app.id,
    name: app.name,
    description: app.description || `Add ${app.name} to your machine`,
    icon: app.icon || null,
    iconType: app.iconType || (app.icon && app.icon.startsWith('<svg') ? 'svg' : 'image'),
    fallbackIcon: 'https://cdn.simpleicons.org/package',
  }));

  const handleSelectionChange = async (appId, isSelected) => {
    debug.info('Application selection changed:', { appId, isSelected });
    const currentApps = stepValues.applications || [];
    if (isSelected) {
      if (!currentApps.includes(appId)) {
        setValue(`${id}.applications`, [...currentApps, appId]);
      }
    } else {
      setValue(`${id}.applications`, currentApps.filter((existingId) => existingId !== appId));
    }
  };

  // Script handlers
  const handleAddScript = (script) => {
    const newScript = {
      scriptId: script.id,
      inputValues: {},
    };
    const updated = [...selectedScripts, newScript];
    setSelectedScripts(updated);
    setValue(`${id}.scripts`, updated);

    if (script.hasInputs) {
      handleConfigureScript(script);
    }
  };

  const handleRemoveScript = (scriptId) => {
    const updated = selectedScripts.filter((s) => s.scriptId !== scriptId);
    setSelectedScripts(updated);
    setValue(`${id}.scripts`, updated);
  };

  const handleConfigureScript = (script) => {
    setCurrentScript(script);
    const existing = selectedScripts.find((s) => s.scriptId === script.id);
    setCurrentInputValues(existing?.inputValues || {});
    setConfigureDialogOpen(true);
  };

  const handleSaveConfiguration = () => {
    const updated = selectedScripts.map((s) =>
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
          <div key={index} className="p-4 rounded-xl border border-white/8 space-y-3">
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
        <div className="text-danger">Error loading applications</div>
        <div className="text-sm text-fg-muted">
          {error?.message || 'Failed to load available applications'}
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {!firewallLoading && !canInstallApps && departmentId && (
        <Card variant="default" spotlight={false} glow={false} className="border-warning/40 bg-warning/10">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/20 border border-warning/30 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-warning">Application Installation Not Available</h3>
              <p className="text-sm text-fg-muted">
                Due to the department&apos;s firewall configuration, applications cannot be automatically installed.
                The selected department does not allow outbound traffic on ports 443 (HTTPS) and 80 (HTTP),
                which are required for downloading and installing applications.
              </p>
              <p className="text-sm text-fg-muted">
                To enable application installation, please configure the department&apos;s firewall rules to allow
                outbound traffic on ports 443 and 80 before creating this VM.
              </p>
              {!hasHttpsEnabled && !hasHttpEnabled && (
                <p className="text-sm font-medium text-warning">
                  Missing ports: 443 (HTTPS) and 80 (HTTP)
                </p>
              )}
              {!hasHttpsEnabled && hasHttpEnabled && (
                <p className="text-sm font-medium text-warning">
                  Missing port: 443 (HTTPS)
                </p>
              )}
              {hasHttpsEnabled && !hasHttpEnabled && (
                <p className="text-sm font-medium text-warning">
                  Missing port: 80 (HTTP)
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Applications */}
      <Card variant="default" spotlight={false} glow={false}>
        <div>
          <label className="text-base font-semibold text-fg">Applications to Add</label>
          <p className="text-xs text-fg-muted mt-0.5">
            Applications will be automatically added to the installation list during machine creation.
          </p>
        </div>
        {loading ? (
          renderLoadingSkeleton()
        ) : error ? (
          renderErrorState()
        ) : (
          <div className="max-h-[400px] overflow-y-auto overflow-x-hidden mt-4">
            <AppStoreInstaller
              apps={allApps}
              selectedAppIds={selectedAppIds}
              onSelectionChange={handleSelectionChange}
              size="md"
              className="min-h-[200px]"
            />
          </div>
        )}
      </Card>

      {/* Scripts */}
      <Card variant="default" spotlight={false} glow={false}>
        <div>
          <label className="text-base font-semibold text-fg">Scripts to Run on First Boot</label>
          <p className="text-xs text-fg-muted mt-0.5">
            Scripts will be executed on first boot after the operating system is installed and InfiniService is running.
          </p>
        </div>

        {scriptsLoading ? (
          <div className="mt-4 text-fg-muted text-sm">Loading scripts...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {scriptsData?.departmentScripts?.map((script) => {
              const isSelected = selectedScripts.some((s) => s.scriptId === script.id);
              return (
                <Card
                  key={script.id}
                  variant="default"
                  spotlight={false}
                  glow={false}
                  className={cn(
                    'relative transition-all',
                    isSelected
                      ? 'border-success/50 bg-success/10 ring-2 ring-success/20'
                      : 'hover:border-accent/40'
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-2 mb-2">
                        <FileCode
                          className={cn(
                            'h-5 w-5',
                            isSelected ? 'text-success' : 'text-fg'
                          )}
                        />
                        <h3
                          className={cn(
                            'font-medium',
                            isSelected ? 'text-success' : 'text-fg'
                          )}
                        >
                          {script.name}
                        </h3>
                      </div>
                      <p className="text-sm text-fg-muted line-clamp-2">
                        {script.description}
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {script.os?.map((os) => (
                          <Badge key={os} tone="neutral">
                            {os}
                          </Badge>
                        ))}
                        {script.hasInputs && (
                          <Badge tone="info">{script.inputCount} inputs</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {isSelected ? (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleRemoveScript(script.id)}
                        >
                          Remove
                        </Button>
                        {script.hasInputs && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleConfigureScript(script)}
                          >
                            Configure
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="primary"
                        icon={<Play className="h-4 w-4" />}
                        onClick={() => handleAddScript(script)}
                      >
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
              {currentScript.parsedInputs?.map((input) => (
                <ScriptInputRenderer
                  key={input.name}
                  input={input}
                  value={currentInputValues[input.name]}
                  onChange={(value) =>
                    setCurrentInputValues((prev) => ({
                      ...prev,
                      [input.name]: value,
                    }))
                  }
                />
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfigureDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveConfiguration}>
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {getError('applications') && (
        <p className="mt-2 text-sm text-danger">{getError('applications')}</p>
      )}
    </div>
  );
}
