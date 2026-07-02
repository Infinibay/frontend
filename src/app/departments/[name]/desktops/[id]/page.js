'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  IconTile,
  ResponsiveStack,
  Select,
  StatusDot,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@infinibay/harbor';
import dynamic from 'next/dynamic';
import { createDebugger } from '@/utils/debug';
import {
  Cpu,
  Database,
  FileCode,
  LayoutDashboard,
  Lightbulb,
  Monitor,
  MoveRight,
  Network,
  Power,
  PowerOff,
  RefreshCw,
  Server,
  Shield,
  Terminal,
} from 'lucide-react';
import { useVMDetail } from './hooks/useVMDetail';
import {
  useGetNodeInventoryQuery,
  useMigrateMachineToNodeMutation,
} from '@/gql/hooks';
import { useOpenConsole } from '@/hooks/useOpenConsole';
import { usePageHeader } from '@/hooks/usePageHeader';
import { toast } from 'sonner';

import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

const debug = createDebugger('frontend:pages:vm-detail');

const VMOverviewTab = dynamic(() => import('./components/VMOverviewTab'), {
  ssr: false,
  loading: () => <TabLoading label="Loading overview…" />,
});
const VMRecommendationsTab = dynamic(
  () => import('./components/VMRecommendationsTab'),
  { ssr: false, loading: () => <TabLoading label="Loading recommendations…" /> },
);
const VMSecurityTab = dynamic(
  () => import('./components/security/VMSecurityTab'),
  { ssr: false, loading: () => <TabLoading label="Loading security…" /> },
);
const VMScriptsTab = dynamic(() => import('./components/VMScriptsTab'), {
  ssr: false,
  loading: () => <TabLoading label="Loading scripts…" />,
});
const VMBackupsTab = dynamic(() => import('./components/VMBackupsTab'), {
  ssr: false,
  loading: () => <TabLoading label="Loading backups…" />,
});
const VMDomainTab = dynamic(() => import('./components/VMDomainTab'), {
  ssr: false,
  loading: () => <TabLoading label="Loading domain…" />,
});

function TabLoading({ label }) {
  return <Container size="md" padded>{label}</Container>;
}

function toHarborStatus(state, setupComplete) {
  switch ((state || '').toLowerCase()) {
    case 'running':
      return setupComplete ? 'online' : 'provisioning';
    case 'paused':
    case 'suspended':
    case 'error':
      return 'degraded';
    case 'starting':
    case 'provisioning':
      return 'provisioning';
    case 'stopping':
    case 'updating_hardware':
    case 'powering_off_update':
      return 'maintenance';
    case 'powered_off':
    case 'off':
    default:
      return 'offline';
  }
}

function statusLabel(status, isInstalling) {
  switch (status) {
    case 'online': return 'Running';
    case 'degraded': return 'Degraded';
    case 'provisioning': return isInstalling ? 'Installing…' : 'Starting';
    case 'maintenance': return 'Updating';
    case 'offline': return 'Off';
    default: return 'Unknown';
  }
}

function statusTone(status) {
  switch (status) {
    case 'online': return 'success';
    case 'degraded': return 'warning';
    case 'provisioning': return 'info';
    case 'maintenance': return 'info';
    case 'offline': return 'neutral';
    default: return 'neutral';
  }
}

function canColdMigrateStatus(status) {
  return ['off', 'powered_off', 'stopped', 'error'].includes((status || '').toLowerCase());
}

const VMDetailPage = () => {
  const params = useParams();
  const departmentName = params.name;
  const vmId = params.id;
  const [targetNodeId, setTargetNodeId] = useState('');

  debug.log('VM Detail Page mounted', { departmentName, vmId });

  const {
    isLoading,
    vm,
    error,
    showToast,
    toastProps,
    activeTab,
    setActiveTab,
    setShowToast,
    refreshVM,
    reloadVM,
    handlePowerAction,
    powerActionLoading,
    isAdmin,
  } = useVMDetail(vmId);

  // Bridge the legacy show/toastProps state exposed by useVMDetail to Sonner so
  // power-action feedback is surfaced through the same toaster as the rest of
  // the app (no bespoke ToastNotification component).
  useEffect(() => {
    if (!showToast) return;
    const { variant, title, description } = toastProps || {};
    const message = title || description || '';
    const opts = title && description ? { description } : undefined;
    if (variant === 'destructive' || variant === 'error') {
      toast.error(message, opts);
    } else if (variant === 'success') {
      toast.success(message, opts);
    } else if (variant === 'warning') {
      toast.warning(message, opts);
    } else {
      toast(message, opts);
    }
    setShowToast(false);
  }, [showToast, toastProps, setShowToast]);

  const {
    data: nodeData,
    loading: nodesLoading,
    error: nodesError,
    refetch: refetchNodes,
  } = useGetNodeInventoryQuery({
    fetchPolicy: 'cache-and-network',
    pollInterval: 30_000,
  });
  const [migrateMachineToNode, { loading: migrationLoading }] = useMigrateMachineToNodeMutation();
  const openConsole = useOpenConsole();

  const helpConfig = useMemo(
    () => ({
      title: 'Desktop Help',
      description: 'Learn how to manage and control this desktop',
      icon: <Server size={14} />,
      sections: [
        {
          id: 'power-management',
          title: 'Power Management',
          icon: <Power size={14} />,
          content: (
            <ResponsiveStack direction="col" gap={2}>
              <span>Starting a desktop</span>
              <span>
                Click the &quot;Start&quot; button when the desktop is stopped. The
                system will initiate the boot process.
              </span>
              <span>Stopping a desktop</span>
              <span>
                Click the &quot;Stop&quot; button when the desktop is running to
                trigger a graceful shutdown.
              </span>
            </ResponsiveStack>
          ),
        },
        {
          id: 'hardware',
          title: 'Hardware Configuration',
          icon: <Cpu size={14} />,
          content: 'The Overview tab shows the CPU, RAM, disk and GPU assigned to this desktop. Hardware is defined by the desktop blueprint at creation time.',
        },
        {
          id: 'tabs',
          title: 'Tabs',
          icon: <Terminal size={14} />,
          content: (
            <ResponsiveStack direction="col" gap={2}>
              <span>Overview — health, hardware, network, and detected problems.</span>
              <span>Recommendations — suggestions to keep this desktop optimal.</span>
              <span>Firewall — desktop-specific firewall rules layered on top of department rules.</span>
              <span>Scripts — run automation scripts on this desktop.</span>
              <span>Backups — snapshots and backup schedule.</span>
            </ResponsiveStack>
          ),
        },
      ],
      quickTips: [
        'Stop the desktop before migrating it to another node',
        'Click IP addresses to copy them to clipboard',
        'Check the Overview tab for detected problems and health',
      ],
    }),
    [],
  );

  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Departments', href: '/departments' },
        {
          label: departmentName || 'Department',
          href: `/departments/${departmentName}`,
        },
        { label: vm?.name || 'Desktop', isCurrent: true },
      ],
      title: vm?.name || 'Desktop',
      backButton: {
        href: `/departments/${departmentName}`,
        label: 'Back',
      },
      actions: [],
      helpConfig,
      helpTooltip: 'Desktop detail help',
    },
    [vm?.name, departmentName],
  );

  if (isLoading) {
    debug.log('Showing loading state');
    return <LoadingState />;
  }

  if (error || !vm) {
    debug.error('VM detail error:', error);
    return <ErrorState error={error} vmId={vmId} onRetry={refreshVM} />;
  }

  debug.success('VM detail loaded successfully', { vmName: vm?.name });

  const setupComplete = vm?.setupComplete ?? false;
  const rawStatus = (vm?.status || '').toLowerCase();
  const status = toHarborStatus(vm.status, setupComplete);
  const isInstalling = vm.status === 'running' && !setupComplete;
  const isRunning = status === 'online';
  const isBusy = status === 'provisioning' || status === 'maintenance';
  const os = vm?.configuration?.os;
  // Surface a recorded failure reason whenever the VM is NOT actively running.
  // Keys off raw status + lastError, NOT the mapped harbor status: raw 'error'
  // maps to 'degraded', and a failed install can get reconciled back to 'off'
  // (setupComplete never flipped) — both must still show the banner. Only an
  // actively-running/installing VM (rawStatus === 'running') hides it.
  const lastError = vm?.configuration?.lastError;
  const showFailure = Boolean(lastError) && rawStatus !== 'running';
  const failedInstall = showFailure && !setupComplete;
  const graphicUrl = typeof vm?.configuration?.graphic === 'string' ? vm.configuration.graphic : null;
  // The SPICE console is available whenever QEMU is up — that includes the
  // INSTALL phase (status 'provisioning' / setupComplete=false), where being able
  // to watch the installer is exactly what you want. Gate on a live display, not
  // on setupComplete.
  const canConnect = (isRunning || isInstalling) && graphicUrl?.startsWith('spice://');
  const nodes = nodeData?.nodes || [];
  const currentNode = nodes.find((node) => node.id === vm.nodeId);
  const migrationTargets = nodes.filter((node) => node.id !== vm.nodeId && !node.maintenanceMode);
  const migrationOptions = [
    { value: '', label: migrationTargets.length > 0 ? 'Select target node' : 'No eligible target nodes' },
    ...migrationTargets.map((node) => ({
      value: node.id,
      label: `${node.name} · ${node.cores} cores · ${Math.round((node.ram || 0) / 1024)} GB RAM`,
    })),
  ];
  const canMigrate = canColdMigrateStatus(vm.status) && !isBusy && !migrationLoading;
  const migrationDisabled = !canMigrate || !targetNodeId;

  const handleConnect = () => openConsole(vm, graphicUrl);

  const handleMigrate = async () => {
    if (!targetNodeId) return;

    const target = nodes.find((node) => node.id === targetNodeId);

    try {
      const result = await migrateMachineToNode({
        variables: { id: vmId, targetNodeId },
      });
      const migration = result?.data?.migrateMachineToNode;

      if (!migration?.success) {
        toast.error('Migration blocked', {
          description: migration?.error || 'The desktop could not be moved to the selected node.',
        });
        return;
      }

      toast.success('Desktop reassigned', {
        description: target?.name ? `${vm.name} was moved to ${target.name}.` : `${vm.name} was moved to the selected node.`,
      });
      setTargetNodeId('');
      await Promise.all([reloadVM(), refetchNodes()]);
    } catch (err) {
      toast.error('Migration failed', {
        description: err?.message || 'The desktop could not be moved to the selected node.',
      });
    }
  };

  return (
    <>
      <Container size="xl" padded>
        <ResponsiveStack direction="col" gap={6}>
          <Card variant="default" spotlight={false} glow={false}>
            <ResponsiveStack
              direction={{ base: 'col', lg: 'row' }}
              gap={5}
              justify="between"
              align="center"
            >
              <ResponsiveStack direction="row" gap={4} align="center">
                <IconTile icon={<Server size={22} />} tone="purple" size="lg" />
                <ResponsiveStack direction="col" gap={2}>
                  <ResponsiveStack direction="row" gap={3} align="center" wrap>
                    <h1 className="text-xl font-semibold leading-tight m-0">{vm.name}</h1>
                    <Badge tone={statusTone(status)} pulse={isRunning}>
                      <StatusDot status={status} label={null} />
                      {statusLabel(status, isInstalling)}
                    </Badge>
                    {vm.template?.name ? (
                      <Badge tone="purple">{vm.template.name}</Badge>
                    ) : null}
                  </ResponsiveStack>
                  <ResponsiveStack direction="row" gap={3} align="center" wrap>
                    {os ? <span>{os}</span> : null}
                    {vm?.cpuCores ? <span>· {vm.cpuCores} vCPU</span> : null}
                    {vm?.ramGB ? <span>· {vm.ramGB} GB RAM</span> : null}
                    {vm?.localIP ? <span>· {vm.localIP}</span> : null}
                  </ResponsiveStack>
                  {showFailure ? (
                    <div
                      role="alert"
                      className="mt-1 rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger max-w-2xl"
                    >
                      <span className="font-medium">
                        {failedInstall ? 'Installation failed: ' : 'Error: '}
                      </span>
                      {lastError}
                      {failedInstall ? (
                        <span className="mt-1 block text-danger/80">
                          The installation did not complete, so this VM has no bootable OS. Delete it and create a new one to retry.
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </ResponsiveStack>
              </ResponsiveStack>

              <ResponsiveStack direction="row" gap={2} align="center">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<RefreshCw size={14} />}
                  onClick={refreshVM}
                  disabled={isBusy}
                >
                  Refresh
                </Button>
                {canConnect ? (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Monitor size={14} />}
                    onClick={handleConnect}
                  >
                    {isInstalling ? 'View install' : 'Connect'}
                  </Button>
                ) : null}
                {isRunning ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    icon={<PowerOff size={14} />}
                    onClick={() => handlePowerAction('stop')}
                    loading={isBusy || powerActionLoading}
                    disabled={isBusy || powerActionLoading}
                  >
                    Stop
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Power size={14} />}
                    onClick={() => handlePowerAction('start')}
                    loading={isBusy || powerActionLoading}
                    disabled={isBusy || powerActionLoading}
                  >
                    Start
                  </Button>
                )}
              </ResponsiveStack>
            </ResponsiveStack>
          </Card>

          {isAdmin ? (
            <Card variant="default" spotlight={false} glow={false}>
              <ResponsiveStack
                direction={{ base: 'col', lg: 'row' }}
                gap={4}
                justify="between"
                align="center"
              >
                <ResponsiveStack direction="row" gap={3} align="center">
                  <IconTile icon={<MoveRight size={18} />} tone="blue" size="md" />
                  <ResponsiveStack direction="col" gap={1}>
                    <span>Node placement</span>
                    <span>
                      {currentNode?.name
                        ? `Current node: ${currentNode.name}`
                        : vm.nodeId
                          ? `Current node: ${vm.nodeId}`
                          : 'Current node: unassigned'}
                    </span>
                    <span className="text-xs text-fg-muted">
                      Cold migration requires shared VM storage across nodes.
                    </span>
                  </ResponsiveStack>
                </ResponsiveStack>

                {nodesError ? (
                  <Alert
                    tone="danger"
                    icon={<MoveRight size={14} />}
                    title="Could not load target nodes"
                    actions={
                      <Button
                        size="sm"
                        variant="primary"
                        icon={<RefreshCw size={14} />}
                        onClick={() => refetchNodes()}
                      >
                        Retry
                      </Button>
                    }
                  >
                    {nodesError.message}
                  </Alert>
                ) : (
                  <ResponsiveStack direction={{ base: 'col', sm: 'row' }} gap={2} align="center">
                    <div style={{ minWidth: 260 }}>
                      <Select
                        value={targetNodeId}
                        onChange={setTargetNodeId}
                        options={migrationOptions}
                        disabled={nodesLoading || migrationTargets.length === 0 || !canMigrate}
                      />
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<MoveRight size={14} />}
                      onClick={handleMigrate}
                      loading={migrationLoading}
                      disabled={migrationDisabled}
                    >
                      Migrate stopped desktop
                    </Button>
                  </ResponsiveStack>
                )}
              </ResponsiveStack>
            </Card>
          ) : null}

          <Tabs
            value={activeTab || 'overview'}
            onValueChange={setActiveTab}
            variant="pill"
          >
            <TabList>
              <Tab value="overview" icon={<LayoutDashboard size={14} />}>
                Overview
              </Tab>
              <Tab value="recommendations" icon={<Lightbulb size={14} />}>
                Recommendations
              </Tab>
              <Tab value="firewall" icon={<Shield size={14} />}>
                Firewall
              </Tab>
              <Tab value="scripts" icon={<FileCode size={14} />}>
                Scripts
              </Tab>
              <Tab value="backups" icon={<Database size={14} />}>
                Backups
              </Tab>
              {isAdmin ? (
                <Tab value="domain" icon={<Network size={14} />}>
                  Domain
                </Tab>
              ) : null}
            </TabList>

            <TabPanel value="overview">
              <VMOverviewTab vmId={vmId} vm={vm} />
            </TabPanel>
            <TabPanel value="recommendations">
              <VMRecommendationsTab
                vmId={vmId}
                vm={vm}
                vmStatus={vm?.status}
                vmSetupComplete={setupComplete}
              />
            </TabPanel>
            <TabPanel value="firewall">
              <VMSecurityTab
                vmId={vmId}
                vmName={vm?.name}
                vmStatus={vm?.status}
                vmSetupComplete={setupComplete}
                vmOs={vm?.configuration?.os}
                departmentId={vm?.department?.id}
                onVMStopped={reloadVM}
              />
            </TabPanel>
            <TabPanel value="scripts">
              <VMScriptsTab
                vmId={vmId}
                vmStatus={vm?.status}
                vmSetupComplete={setupComplete}
                departmentId={vm?.department?.id}
              />
            </TabPanel>
            <TabPanel value="backups">
              <VMBackupsTab vmId={vmId} vmStatus={vm?.status} vmSetupComplete={setupComplete} />
            </TabPanel>
            {isAdmin ? (
              <TabPanel value="domain">
                <VMDomainTab
                  vmId={vmId}
                  vm={vm}
                  vmStatus={vm?.status}
                  vmSetupComplete={setupComplete}
                  onJoined={reloadVM}
                />
              </TabPanel>
            ) : null}
          </Tabs>
        </ResponsiveStack>
      </Container>
    </>
  );
};

export default VMDetailPage;
