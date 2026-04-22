'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  FileCode,
  Monitor,
  Network,
  Pause,
  Play,
  Plus,
  Power,
  Shield,
  Square,
  Trash2,
} from 'lucide-react';
import {
  Alert,
  Badge,
  Button,
  ClusterView,
  Dialog,
  EmptyState,
  LoadingOverlay,
  Page,
  ResponsiveGrid,
  ResponsiveStack,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tooltip,
} from '@infinibay/harbor';

import { useDepartmentPage } from './hooks/useDepartmentPage';
import { usePageHeader } from '@/hooks/usePageHeader';

const SecuritySection = dynamic(() => import('./components/SecuritySection.jsx'), {
  ssr: false,
  loading: () => <LoadingOverlay label="Loading security…" />,
});
const DepartmentScriptsPage = dynamic(() => import('./scripts/page.jsx'), {
  ssr: false,
  loading: () => <LoadingOverlay label="Loading scripts…" />,
});
const DepartmentNetworkTab = dynamic(
  () => import('./components/DepartmentNetworkTab.jsx'),
  {
    ssr: false,
    loading: () => <LoadingOverlay label="Loading network diagnostics…" />,
  },
);

const vmStatusToHarbor = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'running':
      return 'online';
    case 'paused':
    case 'suspended':
      return 'degraded';
    case 'starting':
    case 'provisioning':
    case 'building':
      return 'provisioning';
    case 'stopping':
      return 'maintenance';
    default:
      return 'offline';
  }
};

const vmSubtitle = (vm) => {
  const bits = [];
  const os = vm?.configuration?.os || vm?.os;
  if (os) bits.push(os);
  if (vm?.cpuCores) bits.push(`${vm.cpuCores} vCPU`);
  if (vm?.ramGB) bits.push(`${vm.ramGB} GB`);
  return bits.join(' · ');
};

function VmActions({ vm, onPlay, onPause, onStop }) {
  const stop = (e) => e.stopPropagation();
  const status = (vm.status || '').toLowerCase();

  if (status === 'running') {
    return (
      <ResponsiveStack direction="row" gap={1} onClick={stop}>
        <Button
          size="sm"
          variant="ghost"
          icon={<Pause size={12} />}
          onClick={(e) => {
            stop(e);
            onPause?.(vm);
          }}
          aria-label="Pause"
        >
          {''}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          icon={<Square size={12} />}
          onClick={(e) => {
            stop(e);
            onStop?.(vm);
          }}
          aria-label="Stop"
        >
          {''}
        </Button>
      </ResponsiveStack>
    );
  }
  return (
    <Button
      size="sm"
      variant="ghost"
      icon={<Play size={12} />}
      onClick={(e) => {
        stop(e);
        onPlay?.(vm);
      }}
      aria-label="Start"
    >
      {''}
    </Button>
  );
}

const DepartmentPage = () => {
  const params = useParams();
  const router = useRouter();
  const departmentName = params.name?.toLowerCase();

  const {
    isLoading,
    department,
    machines = [],
    activeTab,
    setActiveTab,
    handlePcSelect,
    handlePlayAction,
    handlePauseAction,
    handleStopAction,
    deleteConfirmation,
    confirmDelete,
    cancelDelete,
    isDeleting,
  } = useDepartmentPage(departmentName);

  const helpConfig = useMemo(
    () => ({
      title: 'Department',
      description:
        'Manage VMs, firewall, scripts and network for this department.',
      icon: <Building2 size={14} />,
      sections: [
        {
          id: 'vms',
          title: 'Virtual machines',
          icon: <Monitor size={14} />,
          content:
            'The Computers tab lists every VM that belongs here. Click a card to open its detail view; use the inline controls for quick power actions.',
        },
        {
          id: 'security',
          title: 'Security',
          icon: <Shield size={14} />,
          content:
            'Firewall policy + department-wide rules that every VM inherits. VMs can still add their own rules on top.',
        },
        {
          id: 'scripts',
          title: 'Scripts',
          icon: <FileCode size={14} />,
          content:
            'Automation scripts scoped to this department. Run them on individual VMs or on demand for the whole set.',
        },
        {
          id: 'network',
          title: 'Network',
          icon: <Network size={14} />,
          content:
            'Bridge / DHCP / NAT diagnostics for the subnet this department lives on.',
        },
      ],
      quickTips: [
        'Click any VM card to open its detail page',
        'Security rules here apply to every VM in the department',
        'Use the Scripts tab for department-wide automation',
      ],
    }),
    [],
  );

  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Departments', href: '/departments' },
        { label: department?.name || 'Department', isCurrent: true },
      ],
      title: department?.name || 'Department',
      backButton: { href: '/departments', label: 'Back' },
      actions: [],
      helpConfig,
      helpTooltip: 'Department help',
    },
    [department?.name],
  );

  const hosts = useMemo(
    () =>
      machines.map((vm) => ({
        id: vm.id,
        name: vm.name,
        status: vmStatusToHarbor(vm.status),
        subtitle: vmSubtitle(vm),
        tags: vm.user
          ? [
              `${vm.user.firstName || ''} ${vm.user.lastName || ''}`.trim() ||
                vm.user.email,
            ]
          : [],
        _raw: vm,
        actions: (
          <VmActions
            vm={vm}
            onPlay={handlePlayAction}
            onPause={handlePauseAction}
            onStop={handleStopAction}
          />
        ),
      })),
    [machines, handlePlayAction, handlePauseAction, handleStopAction],
  );

  const stats = useMemo(() => {
    const total = machines.length;
    const running = machines.filter(
      (m) => (m.status || '').toLowerCase() === 'running',
    ).length;
    const stopped = machines.filter(
      (m) =>
        !['running', 'paused', 'suspended', 'starting', 'provisioning'].includes(
          (m.status || '').toLowerCase(),
        ),
    ).length;
    const busy = total - running - stopped;
    return { total, running, stopped, busy };
  }, [machines]);

  if (isLoading) {
    return (
      <Page>
        <Skeleton />
        <Skeleton />
        <ResponsiveGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} />
          ))}
        </ResponsiveGrid>
      </Page>
    );
  }

  if (departmentName && !department) {
    return (
      <Page size="md">
        <Alert
          tone="warning"
          title="Department not found"
          actions={
            <Button
              size="sm"
              variant="secondary"
              icon={<ArrowLeft size={14} />}
              onClick={() => router.push('/departments')}
            >
              Back to departments
            </Button>
          }
        >
          We couldn&apos;t find a department named{' '}
          <strong>{params.name}</strong>.
        </Alert>
      </Page>
    );
  }

  const newComputerHref = `/departments/${departmentName}/computers/create`;

  return (
    <>
      <Page>
        <ResponsiveStack
          direction={{ base: 'col', md: 'row' }}
          gap={3}
          align={{ base: 'stretch', md: 'center' }}
          justify="between"
          wrap
        >
          <ResponsiveStack direction="row" gap={3} align="center" wrap>
            <Badge tone="purple" icon={<Monitor size={12} />}>
              {stats.total} {stats.total === 1 ? 'VM' : 'VMs'}
            </Badge>
            <Badge tone="success" icon={<Play size={12} />}>
              {stats.running} running
            </Badge>
            {stats.stopped > 0 ? (
              <Badge tone="neutral" icon={<Power size={12} />}>
                {stats.stopped} stopped
              </Badge>
            ) : null}
            {stats.busy > 0 ? (
              <Badge tone="warning">{stats.busy} busy</Badge>
            ) : null}
          </ResponsiveStack>
          <Tooltip content="New VM">
            <span>
              <Button
                size="sm"
                variant="primary"
                icon={<Plus size={14} />}
                onClick={() => router.push(newComputerHref)}
              >
                New
              </Button>
            </span>
          </Tooltip>
        </ResponsiveStack>

        <Tabs
          value={activeTab || 'computers'}
          onValueChange={setActiveTab}
          variant="pill"
        >
          <TabList>
            <Tab value="computers" icon={<Monitor size={14} />}>
              Computers
            </Tab>
            <Tab value="security" icon={<Shield size={14} />}>
              Security
            </Tab>
            <Tab value="scripts" icon={<FileCode size={14} />}>
              Scripts
            </Tab>
            <Tab value="network" icon={<Network size={14} />}>
              Network
            </Tab>
          </TabList>

          <TabPanel value="computers">
            {hosts.length === 0 ? (
              <EmptyState
                variant="dashed"
                icon={<Monitor size={18} />}
                title="No VMs in this department yet"
                description="Create your first VM to start populating this department."
                actions={
                  <Tooltip content="New VM">
                    <span>
                      <Button
                        size="sm"
                        variant="primary"
                        icon={<Plus size={14} />}
                        onClick={() => router.push(newComputerHref)}
                      >
                        New
                      </Button>
                    </span>
                  </Tooltip>
                }
              />
            ) : (
              <ClusterView
                hosts={hosts}
                onHostClick={(host) => {
                  const raw = hosts.find((h) => h.id === host.id)?._raw;
                  if (raw) handlePcSelect(raw);
                }}
              />
            )}
          </TabPanel>

          <TabPanel value="security">
            <SecuritySection departmentId={department?.id} />
          </TabPanel>

          <TabPanel value="scripts">
            <DepartmentScriptsPage />
          </TabPanel>

          <TabPanel value="network">
            <DepartmentNetworkTab departmentId={department?.id} />
          </TabPanel>
        </Tabs>
      </Page>

      <Dialog
        open={!!deleteConfirmation?.isOpen}
        onClose={cancelDelete}
        size="sm"
        title="Delete virtual machine"
        description={
          deleteConfirmation?.vm
            ? `Remove "${deleteConfirmation.vm.name}"? This cannot be undone.`
            : 'This action cannot be undone.'
        }
        footer={
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
              variant="secondary"
              onClick={cancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              icon={<Trash2 size={14} />}
              onClick={confirmDelete}
              loading={isDeleting}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </Button>
          </ResponsiveStack>
        }
      >
        <Alert
          tone="danger"
          size="sm"
          icon={<AlertCircle size={14} />}
        >
          All snapshots, volumes and configuration for this VM will be
          permanently removed.
        </Alert>
      </Dialog>
    </>
  );
};

export default DepartmentPage;
