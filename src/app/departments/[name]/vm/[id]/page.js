'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import {
  Badge,
  Button,
  Card,
  Container,
  IconTile,
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
  Cpu,
  Database,
  FileCode,
  LayoutDashboard,
  Lightbulb,
  Monitor,
  Power,
  PowerOff,
  RefreshCw,
  Server,
  Shield,
  Terminal,
} from 'lucide-react';
import { useVMDetail } from './hooks/useVMDetail';
import { usePageHeader } from '@/hooks/usePageHeader';
import { openSpiceClient } from '@/utils/spiceConnect';
import { toast } from '@/hooks/use-toast';

import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import ToastNotification from '../../components/ToastNotification';

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

function TabLoading({ label }) {
  return <Container size="md" padded>{label}</Container>;
}

function toHarborStatus(state) {
  switch ((state || '').toLowerCase()) {
    case 'running':
      return 'online';
    case 'paused':
    case 'suspended':
    case 'error':
      return 'degraded';
    case 'starting':
    case 'provisioning':
    case 'building':
      return 'provisioning';
    case 'stopping':
      return 'maintenance';
    case 'stopped':
    case 'shutoff':
    case 'powered_off':
    case 'off':
    default:
      return 'offline';
  }
}

function statusLabel(status) {
  switch (status) {
    case 'online': return 'Running';
    case 'degraded': return 'Degraded';
    case 'provisioning': return 'Starting';
    case 'maintenance': return 'Stopping';
    case 'offline': return 'Stopped';
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

const VMDetailPage = () => {
  const params = useParams();
  const departmentName = params.name;
  const vmId = params.id;

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
    handlePowerAction,
  } = useVMDetail(vmId);

  const helpConfig = useMemo(
    () => ({
      title: 'Virtual Machine Help',
      description: 'Learn how to manage and control your virtual machine',
      icon: <Server size={14} />,
      sections: [
        {
          id: 'power-management',
          title: 'Power Management',
          icon: <Power size={14} />,
          content: (
            <ResponsiveStack direction="col" gap={2}>
              <span>Starting VMs</span>
              <span>
                Click the &quot;Start&quot; button when the VM is stopped. The system
                will initiate the boot process.
              </span>
              <span>Stopping VMs</span>
              <span>
                Click the &quot;Stop&quot; button when the VM is running to trigger a
                graceful shutdown.
              </span>
            </ResponsiveStack>
          ),
        },
        {
          id: 'hardware',
          title: 'Hardware Configuration',
          icon: <Cpu size={14} />,
          content: 'Admins can edit CPU and RAM from the Overview tab, but only when the VM is stopped.',
        },
        {
          id: 'tabs',
          title: 'Tabs',
          icon: <Terminal size={14} />,
          content: (
            <ResponsiveStack direction="col" gap={2}>
              <span>Overview — live metrics, hardware, network, snapshots, critical alerts.</span>
              <span>Recommendations — AI-powered suggestions for VM optimization.</span>
              <span>Security — VM-specific firewall rules layered on top of department rules.</span>
              <span>Scripts — run automation scripts on this VM.</span>
            </ResponsiveStack>
          ),
        },
      ],
      quickTips: [
        'Stop the VM before modifying CPU or RAM settings',
        'Click IP addresses to copy them to clipboard',
        'Check the Overview tab for live metrics',
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
        { label: vm?.name || 'VM', isCurrent: true },
      ],
      title: vm?.name || 'Virtual Machine',
      backButton: {
        href: `/departments/${departmentName}`,
        label: 'Back',
      },
      actions: [],
      helpConfig,
      helpTooltip: 'VM detail help',
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

  const status = toHarborStatus(vm.status);
  const isRunning = status === 'online';
  const isBusy = status === 'provisioning' || status === 'maintenance';
  const os = vm?.configuration?.os;
  const graphicUrl = typeof vm?.configuration?.graphic === 'string' ? vm.configuration.graphic : null;
  const canConnect = isRunning && graphicUrl?.startsWith('spice://');

  const handleConnect = () => {
    try {
      openSpiceClient(graphicUrl, { vmName: vm?.name });
      toast({
        title: 'Opening SPICE client',
        description: 'A .vv file was downloaded. Your OS should open it with virt-viewer or the default SPICE client.',
        variant: 'default',
      });
    } catch (err) {
      toast({
        title: 'Could not open SPICE client',
        description: err?.message || 'Invalid connection info',
        variant: 'destructive',
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
              align={{ base: 'start', lg: 'center' }}
            >
              <ResponsiveStack direction="row" gap={4} align="center">
                <IconTile icon={<Server size={22} />} tone="purple" size="lg" />
                <ResponsiveStack direction="col" gap={2}>
                  <ResponsiveStack direction="row" gap={3} align="center" wrap>
                    <span>{vm.name}</span>
                    <Badge tone={statusTone(status)} pulse={isRunning}>
                      <StatusDot status={status} />
                      {statusLabel(status)}
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
                    Connect
                  </Button>
                ) : null}
                {isRunning ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    icon={<PowerOff size={14} />}
                    onClick={() => handlePowerAction('stop')}
                    loading={isBusy}
                    disabled={isBusy}
                  >
                    Stop
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Power size={14} />}
                    onClick={() => handlePowerAction('start')}
                    loading={isBusy}
                    disabled={isBusy}
                  >
                    Start
                  </Button>
                )}
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
                Security
              </Tab>
              <Tab value="scripts" icon={<FileCode size={14} />}>
                Scripts
              </Tab>
              <Tab value="backups" icon={<Database size={14} />}>
                Backups
              </Tab>
            </TabList>

            <TabPanel value="overview">
              <VMOverviewTab vmId={vmId} vm={vm} />
            </TabPanel>
            <TabPanel value="recommendations">
              <VMRecommendationsTab
                vmId={vmId}
                vm={vm}
                vmStatus={vm?.status}
              />
            </TabPanel>
            <TabPanel value="firewall">
              <VMSecurityTab
                vmId={vmId}
                vmStatus={vm?.status}
                vmOs={vm?.configuration?.os}
                departmentId={vm?.department?.id}
              />
            </TabPanel>
            <TabPanel value="scripts">
              <VMScriptsTab
                vmId={vmId}
                vmStatus={vm?.status}
                departmentId={vm?.department?.id}
              />
            </TabPanel>
            <TabPanel value="backups">
              <VMBackupsTab vmId={vmId} vmStatus={vm?.status} />
            </TabPanel>
          </Tabs>
        </ResponsiveStack>
      </Container>

      <ToastNotification
        show={showToast}
        variant={toastProps.variant}
        title={toastProps.title}
        description={toastProps.description}
        onOpenChange={(open) => !open && setShowToast(false)}
      />
    </>
  );
};

export default VMDetailPage;
