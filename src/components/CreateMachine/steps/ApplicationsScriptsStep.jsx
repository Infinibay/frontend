'use client';

import { useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Dialog,
  EmptyState,
  FormField,
  IconTile,
  Page,
  ResponsiveGrid,
  ResponsiveStack,
  SearchField,
  Skeleton,
  ToggleGroup,
} from '@infinibay/harbor';
import { useWizardContext } from '../wizard/wizard';
import { useFormError } from '../wizard/form-error-provider';
import { fetchApplications } from '@/state/slices/applications';
import useEnsureData, { LOADING_STRATEGIES } from '@/hooks/useEnsureData';
import { createDebugger } from '@/utils/debug';
import {
  useGetDepartmentFirewallRulesQuery,
  useDepartmentScriptsQuery,
  RuleAction,
  RuleDirection,
} from '@/gql/hooks';
import {
  AlertTriangle,
  Check,
  FileCode,
  Package,
  Play,
} from 'lucide-react';
import { ScriptInputRenderer } from '@/components/ScriptInput/ScriptInputRenderer';

const debug = createDebugger('frontend:components:applications-scripts-step');

export function ApplicationsScriptsStep({ id }) {
  const { setValue, values } = useWizardContext();
  const { getError } = useFormError();
  const stepValues = values[id] || {};

  const departmentId = values.basicInfo?.departmentId;

  const [selectedScripts, setSelectedScripts] = useState(stepValues.scripts || []);
  const [configureDialogOpen, setConfigureDialogOpen] = useState(false);
  const [currentScript, setCurrentScript] = useState(null);
  const [currentInputValues, setCurrentInputValues] = useState({});
  const [appSearch, setAppSearch] = useState('');
  const [appCategory, setAppCategory] = useState('all');

  const {
    data: applications,
    isLoading: loading,
    error,
    hasData,
  } = useEnsureData('applications', fetchApplications, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 5 * 60 * 1000,
  });

  const { data: firewallData, loading: firewallLoading } =
    useGetDepartmentFirewallRulesQuery({
      variables: { departmentId: departmentId || '' },
      skip: !departmentId,
    });

  const { data: scriptsData, loading: scriptsLoading } = useDepartmentScriptsQuery({
    variables: { departmentId: departmentId || '' },
    skip: !departmentId,
  });

  const selectedAppIds = stepValues.applications || [];

  const checkPortEnabled = (port) => {
    if (!firewallData?.getDepartmentFirewallRules?.rules) return false;
    return firewallData.getDepartmentFirewallRules.rules.some((rule) => {
      const isOutbound =
        rule.direction === RuleDirection.Out ||
        rule.direction === RuleDirection.Inout;
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

  const allApps = useMemo(
    () =>
      (applications || []).map((app) => ({
        id: app.id,
        name: app.name,
        description: app.description || `Add ${app.name} to your machine`,
        category: app.category || 'Other',
        icon: app.icon || null,
        iconType:
          app.iconType ||
          (app.icon && app.icon.startsWith('<svg') ? 'svg' : 'image'),
      })),
    [applications],
  );

  const appCategoryItems = useMemo(() => {
    const counts = allApps.reduce((acc, app) => {
      acc[app.category] = (acc[app.category] || 0) + 1;
      return acc;
    }, {});
    const base = [
      { value: 'all', label: `All (${allApps.length})` },
    ];
    return base.concat(
      Object.entries(counts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([cat, count]) => ({ value: cat, label: `${cat} (${count})` })),
    );
  }, [allApps]);

  const filteredApps = useMemo(() => {
    const term = appSearch.trim().toLowerCase();
    return allApps.filter((app) => {
      const matchesCat = appCategory === 'all' || app.category === appCategory;
      if (!matchesCat) return false;
      if (!term) return true;
      return (
        app.name.toLowerCase().includes(term) ||
        (app.description && app.description.toLowerCase().includes(term))
      );
    });
  }, [allApps, appSearch, appCategory]);

  const handleSelectionChange = (appId, isSelected) => {
    debug.info('Application selection changed:', { appId, isSelected });
    const currentApps = stepValues.applications || [];
    if (isSelected) {
      if (!currentApps.includes(appId)) {
        setValue(`${id}.applications`, [...currentApps, appId]);
      }
    } else {
      setValue(
        `${id}.applications`,
        currentApps.filter((existingId) => existingId !== appId),
      );
    }
  };

  const toggleApp = (appId) => {
    handleSelectionChange(appId, !selectedAppIds.includes(appId));
  };

  const handleAddScript = (script) => {
    const newScript = { scriptId: script.id, inputValues: {} };
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
        : s,
    );
    setSelectedScripts(updated);
    setValue(`${id}.scripts`, updated);
    setConfigureDialogOpen(false);
    setCurrentScript(null);
    setCurrentInputValues({});
  };

  const missingPortsMessage = !hasHttpsEnabled && !hasHttpEnabled
    ? 'Missing ports: 443 (HTTPS) and 80 (HTTP)'
    : !hasHttpsEnabled
      ? 'Missing port: 443 (HTTPS)'
      : !hasHttpEnabled
        ? 'Missing port: 80 (HTTP)'
        : null;

  const selectedApps = allApps.filter((app) => selectedAppIds.includes(app.id));

  const renderAppIcon = (app) => {
    if (!app.icon) {
      return <IconTile icon={<Package size={18} />} tone="purple" size="md" />;
    }
    if (app.iconType === 'svg') {
      return (
        <IconTile
          icon={<span dangerouslySetInnerHTML={{ __html: app.icon }} />}
          tone="purple"
          size="md"
        />
      );
    }
    return (
      <IconTile
        icon={<img src={app.icon} alt="" width={20} height={20} />}
        tone="purple"
        size="md"
      />
    );
  };

  return (
    <>
      <Page size="lg">
        {!firewallLoading && !canInstallApps && departmentId && (
          <Alert
            tone="warning"
            icon={<AlertTriangle size={14} />}
            title="Application installation not available"
          >
            <ResponsiveStack direction="col" gap={2}>
              <span>
                Due to the department&apos;s firewall configuration, applications
                cannot be automatically installed. The selected department does not
                allow outbound traffic on ports 443 (HTTPS) and 80 (HTTP), which are
                required for downloading and installing applications.
              </span>
              <span>
                To enable application installation, configure the department&apos;s
                firewall rules to allow outbound traffic on ports 443 and 80 before
                creating this desktop.
              </span>
              {missingPortsMessage && (
                <Badge tone="warning">{missingPortsMessage}</Badge>
              )}
            </ResponsiveStack>
          </Alert>
        )}

        <Card
          variant="default"
          spotlight={false}
          glow={false}
          title="Applications to add"
          description="Applications will be automatically added to the installation list during machine creation."
          leadingIcon={<Package size={18} />}
          leadingIconTone="purple"
        >
          {loading ? (
            <ResponsiveGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
              {[...Array(6)].map((_, index) => (
                <Card key={index} variant="default" spotlight={false} glow={false}>
                  <ResponsiveStack direction="row" gap={3} align="center">
                    <Skeleton />
                    <ResponsiveStack direction="col" gap={2}>
                      <Skeleton />
                      <Skeleton />
                    </ResponsiveStack>
                  </ResponsiveStack>
                </Card>
              ))}
            </ResponsiveGrid>
          ) : error ? (
            <Alert tone="danger" title="Error loading applications">
              {error?.message || 'Failed to load available applications'}
            </Alert>
          ) : allApps.length === 0 ? (
            <EmptyState
              variant="dashed"
              icon={<Package />}
              title="No apps available"
              description="There are no applications available to install."
            />
          ) : (
            <ResponsiveStack direction="col" gap={4}>
              <ResponsiveStack direction="col" gap={3}>
                <SearchField
                  value={appSearch}
                  onChange={setAppSearch}
                  placeholder="Search applications…"
                />
                {appCategoryItems.length > 1 && (
                  <ToggleGroup
                    value={appCategory}
                    onChange={setAppCategory}
                    items={appCategoryItems}
                  />
                )}
              </ResponsiveStack>

              {selectedApps.length > 0 && (
                <ResponsiveStack direction="row" gap={2} align="center" wrap>
                  <Badge tone="purple" icon={<Check size={12} />}>
                    {selectedApps.length} selected
                  </Badge>
                  {selectedApps.map((app) => (
                    <Badge
                      key={app.id}
                      tone="neutral"
                      onClick={() => handleSelectionChange(app.id, false)}
                    >
                      {app.name} ×
                    </Badge>
                  ))}
                </ResponsiveStack>
              )}

              {filteredApps.length === 0 ? (
                <EmptyState
                  variant="inline"
                  icon={<Package size={14} />}
                  title="No apps match your filters"
                />
              ) : (
                <ResponsiveGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                  {filteredApps.map((app) => {
                    const isSelected = selectedAppIds.includes(app.id);
                    return (
                      <Card
                        key={app.id}
                        variant="default"
                        spotlight={false}
                        glow={false}
                        interactive
                        selected={isSelected}
                        fullHeight
                        leadingIcon={renderAppIcon(app)}
                        title={app.name}
                        description={app.description}
                        onClick={() => toggleApp(app.id)}
                        footer={
                          <ResponsiveStack
                            direction="row"
                            gap={2}
                            align="center"
                            justify="between"
                          >
                            <Badge tone="neutral">{app.category}</Badge>
                            {isSelected ? (
                              <Badge tone="success" icon={<Check size={12} />}>
                                Selected
                              </Badge>
                            ) : null}
                          </ResponsiveStack>
                        }
                      />
                    );
                  })}
                </ResponsiveGrid>
              )}
            </ResponsiveStack>
          )}
        </Card>

        <Card
          variant="default"
          spotlight={false}
          glow={false}
          title="Scripts to run on first boot"
          description="Scripts will be executed on first boot after the operating system is installed and InfiniService is running."
          leadingIcon={<FileCode size={18} />}
          leadingIconTone="sky"
        >
          {scriptsLoading ? (
            <EmptyState variant="inline" title="Loading scripts…" />
          ) : scriptsData?.departmentScripts?.length ? (
            <ResponsiveGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
              {scriptsData.departmentScripts.map((script) => {
                const isSelected = selectedScripts.some(
                  (s) => s.scriptId === script.id,
                );
                return (
                  <Card
                    key={script.id}
                    variant="default"
                    spotlight={false}
                    glow={false}
                    selected={isSelected}
                    fullHeight
                    leadingIcon={<FileCode size={18} />}
                    leadingIconTone={isSelected ? 'green' : 'purple'}
                    title={script.name}
                    description={script.description}
                    footer={
                      isSelected ? (
                        <ResponsiveStack direction="row" gap={2}>
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
                        </ResponsiveStack>
                      ) : (
                        <Button
                          size="sm"
                          variant="primary"
                          icon={<Play size={14} />}
                          onClick={() => handleAddScript(script)}
                        >
                          Add
                        </Button>
                      )
                    }
                  >
                    <ResponsiveStack direction="row" gap={2} wrap>
                      {script.os?.map((os) => (
                        <Badge key={os} tone="neutral">
                          {os}
                        </Badge>
                      ))}
                      {script.hasInputs && (
                        <Badge tone="info">{script.inputCount} inputs</Badge>
                      )}
                    </ResponsiveStack>
                  </Card>
                );
              })}
            </ResponsiveGrid>
          ) : (
            <EmptyState
              variant="dashed"
              icon={<FileCode />}
              title="No scripts available"
              description="This department has no first-boot scripts configured."
            />
          )}
        </Card>

        {getError('applications') && (
          <FormField error={getError('applications')}>
            <span />
          </FormField>
        )}
      </Page>

      <Dialog
        open={configureDialogOpen}
        onClose={() => setConfigureDialogOpen(false)}
        size="lg"
        title={currentScript ? `Configure Script: ${currentScript.name}` : 'Configure Script'}
        footer={
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
              variant="secondary"
              onClick={() => setConfigureDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveConfiguration}>
              Save Configuration
            </Button>
          </ResponsiveStack>
        }
      >
        {currentScript && (
          <ResponsiveStack direction="col" gap={4}>
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
          </ResponsiveStack>
        )}
      </Dialog>
    </>
  );
}
