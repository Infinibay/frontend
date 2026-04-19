"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Button,
  Badge,
  StatusDot,
} from "@infinibay/harbor";
import dynamic from 'next/dynamic';
import { createDebugger } from '@/utils/debug';
import {
  Server,
  Power,
  Cpu,
  Shield,
  Terminal,
  Lightbulb,
  FileCode,
  RefreshCw,
  LayoutDashboard,
  PowerOff,
} from 'lucide-react';
import { useVMDetail } from "./hooks/useVMDetail";
import { usePageHeader } from '@/hooks/usePageHeader';

import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import ToastNotification from "../../components/ToastNotification";

const debug = createDebugger('frontend:pages:vm-detail');

// Lazy-loaded tab content — loaded only when the user activates the tab.
const VMOverviewTab = dynamic(() => import('./components/VMOverviewTab'), {
  ssr: false,
  loading: () => <TabLoading label="Loading overview…" />
});
const VMRecommendationsTab = dynamic(() => import('./components/VMRecommendationsTab'), {
  ssr: false,
  loading: () => <TabLoading label="Loading recommendations…" />
});
const VMSecurityTab = dynamic(() => import('./components/security/VMSecurityTab'), {
  ssr: false,
  loading: () => <TabLoading label="Loading security…" />
});
const VMScriptsTab = dynamic(() => import('./components/VMScriptsTab'), {
  ssr: false,
  loading: () => <TabLoading label="Loading scripts…" />
});

function TabLoading({ label }) {
  return <div className="py-12 text-center text-fg-muted text-sm">{label}</div>;
}

/** Map a VM state string to Harbor's StatusDot status vocabulary. */
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

/** Compose a human subtitle from VM metadata. */
function vmSubtitle(vm) {
  const bits = [];
  const os = vm?.configuration?.os;
  if (os) bits.push(os);
  if (vm?.cpuCores) bits.push(`${vm.cpuCores} vCPU`);
  if (vm?.ramGB) bits.push(`${vm.ramGB} GB RAM`);
  if (vm?.localIP) bits.push(vm.localIP);
  return bits.join(' · ');
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

  const helpConfig = useMemo(() => ({
    title: "Virtual Machine Help",
    description: "Learn how to manage and control your virtual machine",
    icon: <Server className="h-5 w-5 text-accent-2" />,
    sections: [
      {
        id: "power-management",
        title: "Power Management",
        icon: <Power className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <p className="font-medium text-fg mb-1">Starting VMs</p>
            <p>Click the &quot;Start&quot; button when the VM is stopped. The system will initiate the boot process and the status badge will update to &quot;Running&quot; when ready.</p>

            <p className="font-medium text-fg mb-1 mt-3">Stopping VMs</p>
            <p>Click the &quot;Stop&quot; button when the VM is running. A graceful shutdown will be initiated to safely stop the virtual machine.</p>
          </div>
        )
      },
      {
        id: "hardware",
        title: "Hardware Configuration",
        icon: <Cpu className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <p>Admins can edit CPU and RAM from the Overview tab, but only when the VM is stopped.</p>
          </div>
        )
      },
      {
        id: "tabs",
        title: "Tabs",
        icon: <Terminal className="h-4 w-4" />,
        content: (
          <div className="space-y-3">
            <p className="font-medium text-fg mb-1">Overview</p>
            <p>Live metrics, hardware, network, snapshots, and critical alerts.</p>
            <p className="font-medium text-fg mb-1 mt-3">Recommendations</p>
            <p>AI-powered suggestions for VM optimization.</p>
            <p className="font-medium text-fg mb-1 mt-3">Security</p>
            <p>VM-specific firewall rules layered on top of department rules.</p>
            <p className="font-medium text-fg mb-1 mt-3">Scripts</p>
            <p>Run automation scripts on this VM.</p>
          </div>
        )
      }
    ],
    quickTips: [
      "Stop the VM before modifying CPU or RAM settings",
      "Click IP addresses to copy them to clipboard",
      "Check the Overview tab for live metrics",
    ]
  }), []);

  usePageHeader({
    breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Departments', href: '/departments' },
      { label: departmentName || 'Department', href: `/departments/${departmentName}` },
      { label: vm?.name || 'VM', isCurrent: true }
    ],
    title: vm?.name || 'Virtual Machine',
    backButton: { href: `/departments/${departmentName}`, label: 'Back' },
    actions: [],
    helpConfig: helpConfig,
    helpTooltip: 'VM detail help'
  }, [vm?.name, departmentName]);

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

  return (
    <ToastProvider>
      <div className="size-container size-padding space-y-6">
        {/* Hero — VM identity, status and power actions. */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface-1 p-6 spotlight-soft">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <StatusDot status={status} />
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold text-fg truncate">{vm.name}</h1>
                <p className="text-sm text-fg-muted mt-1">{vmSubtitle(vm) || 'Virtual machine'}</p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {vm.department?.name ? (
                    <Badge tone="neutral">{vm.department.name}</Badge>
                  ) : null}
                  {vm.template?.name ? (
                    <Badge tone="info">{vm.template.name}</Badge>
                  ) : null}
                  {vm.user ? (
                    <Badge tone="purple">{vm.user.firstName || vm.user.email}</Badge>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="secondary"
                size="sm"
                icon={<RefreshCw className="h-4 w-4" />}
                onClick={refreshVM}
                disabled={isBusy}
              >
                Refresh
              </Button>
              {isRunning ? (
                <Button
                  variant="destructive"
                  size="sm"
                  icon={<PowerOff className="h-4 w-4" />}
                  onClick={() => handlePowerAction('off')}
                  loading={isBusy}
                  disabled={isBusy}
                >
                  Stop
                </Button>
              ) : (
                <Button
                  size="sm"
                  icon={<Power className="h-4 w-4" />}
                  onClick={() => handlePowerAction('on')}
                  loading={isBusy}
                  disabled={isBusy}
                >
                  Start
                </Button>
              )}
            </div>
          </div>

        </section>

        {/* Tabs */}
        <Tabs value={activeTab || 'overview'} onValueChange={setActiveTab} variant="underline" className="w-full">
          <TabList className="w-full">
            <Tab value="overview" icon={<LayoutDashboard className="h-4 w-4" />}>Overview</Tab>
            <Tab value="recommendations" icon={<Lightbulb className="h-4 w-4" />}>Recommendations</Tab>
            <Tab value="firewall" icon={<Shield className="h-4 w-4" />}>Security</Tab>
            <Tab value="scripts" icon={<FileCode className="h-4 w-4" />}>Scripts</Tab>
          </TabList>

          <TabPanel value="overview" className="mt-2">
            <VMOverviewTab vmId={vmId} vm={vm} />
          </TabPanel>

          <TabPanel value="recommendations" className="mt-2">
            <VMRecommendationsTab vmId={vmId} vm={vm} vmStatus={vm?.status} />
          </TabPanel>

          <TabPanel value="firewall" className="mt-2">
            <VMSecurityTab
              vmId={vmId}
              vmStatus={vm?.status}
              vmOs={vm?.configuration?.os}
              departmentId={vm?.department?.id}
            />
          </TabPanel>

          <TabPanel value="scripts" className="mt-2">
            <VMScriptsTab
              vmId={vmId}
              vmStatus={vm?.status}
              departmentId={vm?.department?.id}
            />
          </TabPanel>
        </Tabs>
      </div>

      <ToastNotification
        show={showToast}
        variant={toastProps.variant}
        title={toastProps.title}
        description={toastProps.description}
        onOpenChange={(open) => !open && setShowToast(false)}
      />

      <ToastViewport />
    </ToastProvider>
  );
};

export default VMDetailPage;
