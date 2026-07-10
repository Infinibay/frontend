'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Badge,
  Button,
  Card,
  Container,
  Dialog,
  DialogBody,
  DialogButtons,
  DialogDescription,
  DialogTitle,
  IconButton,
  IconTile,
  Menu,
  MenuItem,
  MenuSeparator,
  ResponsiveStack,
  StatusDot,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '@infinibay/harbor';
import dynamic from 'next/dynamic';
import { createDebugger } from '@/utils/debug';
import {
  AlertCircle,
  Cpu,
  Database,
  FileCode,
  LayoutDashboard,
  Lightbulb,
  Monitor,
  MoreVertical,
  MoveRight,
  Network,
  Power,
  PowerOff,
  RefreshCw,
  RotateCcw,
  Server,
  Shield,
  Terminal,
  Trash2,
  Zap,
} from 'lucide-react';
import { useVMDetail } from './hooks/useVMDetail';
import {
  useGetNodeInventoryQuery,
  useMigrateMachineToNodeMutation,
} from '@/gql/hooks';
import { useOpenConsole } from '@/hooks/useOpenConsole';
import { usePageHeader } from '@/hooks/usePageHeader';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { deleteVm } from '@/state/slices/vms';
import { getSocketService } from '@/services/socketService';

import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import NodePlacementDialog from './components/NodePlacementDialog';

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
    case 'locked': return 'Building image';
    case 'moving': return 'Moving…';
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
    case 'locked': return 'warning';
    case 'moving': return 'info';
    default: return 'neutral';
  }
}

const VMDetailPage = () => {
  const params = useParams();
  const departmentName = params.name;
  const vmId = params.id;
  // Cold-migration is now a deliberate modal (admin + multi-node only) instead of
  // an always-on card above the tabs.
  const [placementOpen, setPlacementOpen] = useState(false);
  // Non-null while a background migration is running (holds the current coarse phase).
  // Driven by the mutation's `accepted` ack + live 'migrations' Socket.IO events.
  const [migrationPhase, setMigrationPhase] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

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
    refetch: refetchNodes,
  } = useGetNodeInventoryQuery({
    fetchPolicy: 'cache-and-network',
  });
  // Live node inventory (migration target list) over websocket instead of a 30s poll.
  useRealtimeRefetch('nodes', refetchNodes, { actions: ['update', 'delete'], minIntervalMs: 4000 });
  const [migrateMachineToNode, { loading: migrationLoading }] = useMigrateMachineToNodeMutation();
  const openConsole = useOpenConsole();

  // Live migration lifecycle from the backend MigrationEventManager. The mutation only
  // ACKs (accepted) and returns; the disk copy runs on a background worker that emits
  // started → progress(phase) → completed|failed. Progress + terminal status are reported
  // app-wide in the header's background-tasks dropdown (RealTimeReduxService →
  // backgroundTasks) — the single place migrations surface — so this page no longer raises
  // its own bottom-right toast, which duplicated that dropdown. We still track the coarse
  // phase here to drive the in-page placement UI, and refresh the VM + node inventory on the
  // terminal event. Subscribed before the loading/error guards so it stays an unconditional hook.
  useEffect(() => {
    if (!vmId) return undefined;
    const socketService = getSocketService();
    const unsub = socketService.subscribeToAllResourceEvents(
      'migrations',
      (action, event) => {
        const data = event?.data;
        if (!data || data.vmId !== vmId) return;
        if (action === 'started') {
          setMigrationPhase((prev) => prev || 'starting');
        } else if (action === 'progress') {
          setMigrationPhase(data.phase || 'copying');
        } else if (action === 'completed' || action === 'failed') {
          setMigrationPhase(null);
          Promise.all([reloadVM(), refetchNodes()]).catch(() => {});
        }
      },
      ['started', 'progress', 'completed', 'failed'],
    );
    return () => unsub?.();
  }, [vmId, reloadVM, refetchNodes]);

  const helpConfig = useMemo(
    () => {
      // Contextual help: when the user is on the Firewall tab, the top-right Help
      // drawer carries the firewall advisory content (moved out of the tab body so
      // the tab isn't a wall of info banners — see VMStatusWarning/VMSecurityTab).
      const isFirewall = activeTab === 'firewall';

      const tabsSection = {
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
      };

      if (isFirewall) {
        return {
          title: 'Firewall Help',
          description: 'How firewall rules are applied and inherited',
          icon: <Shield size={14} />,
          sections: [
            {
              id: 'firewall-applying',
              title: 'Applying firewall changes',
              icon: <Shield size={14} />,
              content: (
                <ResponsiveStack direction="col" gap={2}>
                  <span>
                    Rules are loaded when the desktop boots, so changes take effect
                    on the next start. For a clean apply:
                  </span>
                  <span>• Make changes during maintenance windows or off-peak hours</span>
                  <span>• Test new rules in a development environment first</span>
                  <span>• Document each change and keep a rollback plan ready</span>
                  <span>• Stop the desktop, edit the rules, then start it again</span>
                </ResponsiveStack>
              ),
            },
            {
              id: 'firewall-inheritance',
              title: 'Inherited & override rules',
              icon: <Shield size={14} />,
              content: (
                <ResponsiveStack direction="col" gap={2}>
                  <span>
                    Department rules are inherited by every desktop and shown as
                    &quot;Inherited&quot;. Desktop-specific rules you add apply on
                    top of them.
                  </span>
                  <span>
                    Use <em>Override</em> to weaken a department rule for this
                    desktop only, without changing the department policy.
                  </span>
                </ResponsiveStack>
              ),
            },
            tabsSection,
          ],
          quickTips: [
            'Stop the desktop before editing firewall rules so they apply on the next boot',
            'If the desktop has no rules, start with the Desktop Secure profile',
            'Inherited rules come from the department; custom rules are desktop-only',
          ],
        };
      }

      return {
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
                <span>
                  Use &quot;Reboot&quot; to restart the guest gracefully;
                  &quot;Force reset&quot; (in the ⋯ menu) power-cycles it instantly
                  when it stops responding.
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
          tabsSection,
        ],
        quickTips: [
          'Click IP addresses to copy them to clipboard',
          'Check the Overview tab for detected problems and health',
          'Use the Overview tab to reassign the desktop to another user',
        ],
      };
    },
    [activeTab],
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
    [vm?.name, departmentName, activeTab],
  );

  // Only block the WHOLE page on the first load (no VM yet). useVMDetail refetches
  // on every VM socket event (power_on/off, status_changed, telemetry); with a bare
  // `if (isLoading)` that flips true on each refetch and blanked the page to
  // LoadingState — remounting every dynamic() tab (each re-showing "Loading…").
  // Gating on `!vm` keeps the page mounted and updates it in place: seamless.
  if (isLoading && !vm) {
    debug.log('Showing loading state');
    return <LoadingState />;
  }

  // Blank to the error screen only when there is NO VM to show. A transient
  // background-refetch error while `vm` is already loaded must not tear down the
  // page (errorPolicy:'all' keeps the prior data), so guard on `!vm`, not
  // `error || !vm`.
  if (!vm) {
    debug.error('VM detail error:', error);
    return <ErrorState error={error} vmId={vmId} onRetry={refreshVM} />;
  }

  debug.success('VM detail loaded successfully', { vmName: vm?.name });

  const setupComplete = vm?.setupComplete ?? false;
  const rawStatus = (vm?.status || '').toLowerCase();
  const status = toHarborStatus(vm.status, setupComplete);
  const isInstalling = vm.status === 'running' && !setupComplete;
  const isRunning = status === 'online';
  // Frozen while a golden image is being built from this desktop. Orthogonal to the
  // QEMU status (the capture power-cycles the VM, so `status` can read 'running'), so
  // check the marker directly. Folded into isBusy so every power button disables, and
  // into canConnect so the console is refused (the backend refuses it too).
  const isLocked = !!vm?.goldenImageBuildId;
  // Cross-node migration in flight (Machine.status='moving', a backend status-as-lock).
  // Like isLocked it's a transient "hands off" state: folded into isBusy so every power
  // button disables (the backend refuses power-on while moving — isPowerActionLocked),
  // and surfaced as a "Moving…" badge instead of the default "Off".
  const isMoving = rawStatus === 'moving';
  const isBusy = status === 'provisioning' || status === 'maintenance' || isLocked || isMoving;
  const os = vm?.os;
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
  const canConnect = (isRunning || isInstalling) && graphicUrl?.startsWith('spice://') && !isLocked;
  const nodes = nodeData?.nodes || [];
  const totalNodes = nodeData?.nodeInventorySummary?.totalNodes ?? nodes.length;
  const isMultiNode = totalNodes > 1;
  const currentNode = nodes.find((node) => node.id === vm.nodeId);
  const migrationTargets = nodes.filter((node) => node.id !== vm.nodeId && !node.maintenanceMode);
  // Placement UI (host-node row + Move action) only makes sense on a real cluster;
  // hide it entirely on single-node installs so it stops cluttering every desktop.
  const canShowPlacement = isAdmin && isMultiNode;
  const hostNodeName = isMultiNode ? (currentNode?.name || null) : null;

  const handleConnect = () => openConsole(vm, graphicUrl);

  const handleMigrate = async (targetNodeId) => {
    if (!targetNodeId) return;

    try {
      const result = await migrateMachineToNode({
        variables: { id: vmId, targetNodeId },
      });
      const migration = result?.data?.migrateMachineToNode;

      // The mutation only ACKs now — it validates + claims the VM and returns. A
      // rejection (busy, not stopped, insufficient capacity) comes back as accepted=false
      // with an error; the real work (and its success/failure) arrives over Socket.IO.
      if (!migration?.accepted) {
        toast.error('Migration blocked', {
          description: migration?.error || 'The desktop could not be moved to the selected node.',
        });
        return;
      }

      setPlacementOpen(false);
      setMigrationPhase('starting');
      // No toast here: the move now surfaces in the header's background-tasks dropdown
      // (fed by the 'migrations' Socket.IO stream). A toast would duplicate it bottom-right.
    } catch (err) {
      toast.error('Migration failed', {
        description: err?.message || 'The desktop could not be moved to the selected node.',
      });
    }
  };

  // Delete the desktop. Mirrors the list view's flow (deleteVm thunk + confirm
  // dialog) — the detail page previously had no delete affordance at all, so a VM
  // reachable only from its detail view (e.g. one moved onto a compute node) could
  // not be removed from the UI. On success the row is gone, so we leave for the
  // department's desktop list; on failure we keep the dialog open with the toast.
  const handleDeleteDesktop = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteVm({ id: vmId })).unwrap();
      toast.success('Desktop deleted');
      router.push(`/departments/${encodeURIComponent(departmentName)}/desktops`);
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message;
      toast.error(msg || 'Failed to delete the desktop');
      setIsDeleting(false);
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
                    <Badge tone={statusTone(isLocked ? 'locked' : isMoving ? 'moving' : status)} pulse={isRunning || isLocked || isMoving}>
                      <StatusDot status={isLocked ? 'degraded' : isMoving ? 'provisioning' : status} label={null} />
                      {statusLabel(isLocked ? 'locked' : isMoving ? 'moving' : status, isInstalling)}
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
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<RotateCcw size={14} />}
                      onClick={() => handlePowerAction('restart')}
                      loading={isBusy || powerActionLoading}
                      disabled={isBusy || powerActionLoading}
                    >
                      Reboot
                    </Button>
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
                  </>
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
                <Menu
                  align="end"
                  trigger={
                    <IconButton
                      variant="ghost"
                      size="sm"
                      icon={<MoreVertical size={16} />}
                      label="More actions"
                    />
                  }
                >
                  {isRunning ? (
                    <MenuItem
                      icon={<Zap size={14} />}
                      danger
                      disabled={powerActionLoading}
                      onClick={() => handlePowerAction('reset')}
                    >
                      Force reset
                    </MenuItem>
                  ) : null}
                  {isRunning && canShowPlacement ? <MenuSeparator /> : null}
                  {canShowPlacement ? (
                    <MenuItem
                      icon={<MoveRight size={14} />}
                      onClick={() => setPlacementOpen(true)}
                    >
                      Move to another node…
                    </MenuItem>
                  ) : null}
                  {isRunning || canShowPlacement ? <MenuSeparator /> : null}
                  <MenuItem
                    icon={<Trash2 size={14} />}
                    danger
                    disabled={isLocked || isMoving}
                    onClick={() => setDeleteOpen(true)}
                  >
                    Delete desktop
                  </MenuItem>
                </Menu>
              </ResponsiveStack>
            </ResponsiveStack>
          </Card>

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
              <VMOverviewTab vmId={vmId} vm={vm} hostNodeName={hostNodeName} />
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

      {canShowPlacement ? (
        <NodePlacementDialog
          open={placementOpen}
          onClose={() => setPlacementOpen(false)}
          vm={vm}
          currentNodeName={currentNode?.name || null}
          targets={migrationTargets}
          onMigrate={handleMigrate}
          migrating={migrationLoading || migrationPhase !== null}
          onStopVM={() => handlePowerAction('stop')}
          stopping={powerActionLoading}
        />
      ) : null}

      <Dialog
        open={deleteOpen}
        onClose={() => { if (!isDeleting) setDeleteOpen(false); }}
        size="sm"
      >
        <DialogTitle>
          <ResponsiveStack direction="row" gap={2} align="center">
            <AlertCircle size={16} />
            Delete desktop
          </ResponsiveStack>
        </DialogTitle>
        <DialogDescription>
          {vm?.name
            ? `This permanently removes ${vm.name} and all its data.`
            : 'This action cannot be undone.'}
        </DialogDescription>
        <DialogBody>
          <p>All snapshots, volumes and attached configuration will be lost.</p>
        </DialogBody>
        <DialogButtons align="end">
          <Button variant="secondary" onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteDesktop}
            loading={isDeleting}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </DialogButtons>
      </Dialog>
    </>
  );
};

export default VMDetailPage;
