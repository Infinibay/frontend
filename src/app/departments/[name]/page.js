'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  FileCode,
  LayoutDashboard,
  Monitor,
  Network,
  Plus,
  Shield,
  Trash2,
} from 'lucide-react';
import {
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
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
import { PageHeader } from '@/components/common/PageHeader';
import { DesktopListView } from '@/components/common/DesktopListView';
import { StatusChip } from '@/components/common/StatusChip';

import { useDepartmentPage } from './hooks/useDepartmentPage';
import { usePageHeader } from '@/hooks/usePageHeader';
import { useRealtimeRefetch } from '@/hooks/useRealtimeRefetch';
import { useGetNodeInventoryQuery } from '@/gql/hooks';

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

const vmStatusToHarbor = (status, setupComplete) => {
  switch ((status || '').toLowerCase()) {
    case 'running':
      return setupComplete ? 'online' : 'provisioning';
    case 'paused':
    case 'suspended':
      return 'degraded';
    case 'starting':
    case 'provisioning':
      return 'provisioning';
    case 'stopping':
    case 'updating_hardware':
    case 'powering_off_update':
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

const decodeSegment = (segment) => {
  if (!segment) return undefined;
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
};

const DepartmentPage = () => {
  const params = useParams();
  const router = useRouter();
  // App Router keeps the segment percent-encoded; decode once at the boundary.
  const decodedName = decodeSegment(params.name);
  const departmentName = decodedName?.toLowerCase();

  const {
    isLoading,
    department,
    fetchError,
    machines = [],
    activeTab,
    setActiveTab,
    retryLoadDepartment,
    handlePcSelect,
    handlePlayAction,
    handlePauseAction,
    handleStopAction,
    handleDeleteAction,
    deleteConfirmation,
    confirmDelete,
    cancelDelete,
    isDeleting,
  } = useDepartmentPage(departmentName);

  const pendingActions = useSelector((state) => state.vms?.pendingActions || {});
  const { data: nodeData, refetch: refetchNodes } = useGetNodeInventoryQuery({
    fetchPolicy: 'cache-and-network',
  });
  // Live node inventory over websocket instead of a 30s poll (see useRealtimeRefetch).
  useRealtimeRefetch('nodes', refetchNodes, { actions: ['update', 'delete'], minIntervalMs: 4000 });

  const helpConfig = useMemo(
    () => ({
      title: 'Department',
      description:
        'Manage desktops, firewall, scripts and network for this department.',
      icon: <Building2 size={14} />,
      sections: [
        {
          id: 'desktops',
          title: 'Desktops',
          icon: <Monitor size={14} />,
          content:
            'The Desktops tab lists every desktop in this department. Click a card to open its detail view; use the inline controls for quick power actions.',
        },
        {
          id: 'firewall',
          title: 'Firewall',
          icon: <Shield size={14} />,
          content:
            'Firewall policy + department-wide rules that every desktop inherits. Individual desktops can add their own rules on top.',
        },
        {
          id: 'scripts',
          title: 'Scripts',
          icon: <FileCode size={14} />,
          content:
            'Automation scripts scoped to this department. Run them on individual desktops or on demand for the whole set.',
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
        'Click any desktop card to open its detail page',
        'Firewall rules here apply to every desktop in the department',
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

  const nodeNameById = useMemo(
    () => Object.fromEntries((nodeData?.nodes || []).map((node) => [node.id, node.name])),
    [nodeData?.nodes],
  );

  const hosts = useMemo(
    () => {
      return machines.map((vm) => {
        const nodeName = vm.nodeId ? nodeNameById[vm.nodeId] || vm.nodeId : null;
        const userName = vm.user
          ? `${vm.user.firstName || ''} ${vm.user.lastName || ''}`.trim() ||
            vm.user.email
          : null;

        return {
          id: vm.id,
          name: vm.name,
          status: vmStatusToHarbor(vm.status, vm.setupComplete),
          subtitle: vmSubtitle(vm),
          tags: [userName, nodeName].filter(Boolean),
          _raw: vm,
        };
      });
    },
    [machines, nodeNameById],
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

  // Distinguish a genuine backend failure from a successful "not found".
  if (fetchError && !department) {
    return (
      <Page size="md">
        <Alert
          tone="danger"
          title="Couldn't load this department"
          actions={
            <ResponsiveStack direction="row" gap={2}>
              <Button
                size="sm"
                variant="primary"
                onClick={() => retryLoadDepartment?.()}
              >
                Retry
              </Button>
              <Button
                size="sm"
                variant="secondary"
                icon={<ArrowLeft size={14} />}
                onClick={() => router.push('/departments')}
              >
                Back to departments
              </Button>
            </ResponsiveStack>
          }
        >
          {fetchError}
        </Alert>
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
          <strong>{decodedName}</strong>.
        </Alert>
      </Page>
    );
  }

  const newComputerHref = `/departments/${encodeURIComponent(departmentName)}/desktops/new`;

  const countText = stats.total === 0
    ? null
    : [
        `${stats.total} ${stats.total === 1 ? 'desktop' : 'desktops'}`,
        stats.running > 0 ? `${stats.running} running` : null,
        stats.busy > 0 ? `${stats.busy} busy` : null,
      ].filter(Boolean).join(' · ');

  return (
    <>
      <Page>
        <PageHeader
          title={department?.name || 'Department'}
          count={countText}
          primary={
            <Tooltip content="New Desktop">
              <span>
                <Button
                  size="sm"
                  variant="primary"
                  icon={<Plus size={14} />}
                  onClick={() => router.push(newComputerHref)}
                >
                  New Desktop
                </Button>
              </span>
            </Tooltip>
          }
        />

        <Tabs
          value={activeTab || 'overview'}
          onValueChange={setActiveTab}
          variant="pill"
        >
          <TabList>
            <Tab value="overview" icon={<LayoutDashboard size={14} />}>
              Overview
            </Tab>
            <Tab value="computers" icon={<Monitor size={14} />}>
              Desktops
            </Tab>
            <Tab value="security" icon={<Shield size={14} />}>
              Firewall
            </Tab>
            <Tab value="scripts" icon={<FileCode size={14} />}>
              Scripts
            </Tab>
            <Tab value="network" icon={<Network size={14} />}>
              Network
            </Tab>
          </TabList>

          <TabPanel value="overview">
            <ResponsiveStack direction="col" gap={5}>
              {stats.total > 0 ? (
                <ResponsiveStack direction="row" gap={2} wrap>
                  {stats.running > 0 ? (
                    <StatusChip status="online" label={`${stats.running} running`} />
                  ) : null}
                  {stats.busy > 0 ? (
                    <StatusChip status="provisioning" label={`${stats.busy} busy`} />
                  ) : null}
                  {stats.stopped > 0 ? (
                    <StatusChip status="offline" label={`${stats.stopped} stopped`} />
                  ) : null}
                </ResponsiveStack>
              ) : null}

              {department?.ipSubnet || department?.gatewayIP || department?.dnsServers ? (
                <section className="flex flex-col gap-2">
                  <div className="pb-2 border-b border-[color:var(--harbor-border-subtle)]">
                    <h2 className="text-base font-semibold m-0">Network</h2>
                  </div>
                  <div className="flex flex-col gap-1 py-2">
                    {department?.ipSubnet ? (
                      <div className="flex gap-3">
                        <span className="text-fg-muted text-sm w-24">Subnet</span>
                        <span className="font-mono text-sm">{department.ipSubnet}</span>
                      </div>
                    ) : null}
                    {department?.gatewayIP ? (
                      <div className="flex gap-3">
                        <span className="text-fg-muted text-sm w-24">Gateway</span>
                        <span className="font-mono text-sm">{department.gatewayIP}</span>
                      </div>
                    ) : null}
                    {department?.dnsServers?.length ? (
                      <div className="flex gap-3">
                        <span className="text-fg-muted text-sm w-24">DNS</span>
                        <span className="font-mono text-sm">
                          {Array.isArray(department.dnsServers)
                            ? department.dnsServers.join(', ')
                            : department.dnsServers}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </section>
              ) : null}

              {stats.total === 0 ? (
                <EmptyState
                  icon={<Monitor size={18} />}
                  title={`${department?.name || 'This department'} has no desktops yet`}
                  description="Create one with a blueprint to start populating it."
                  actions={
                    <Tooltip content="New Desktop">
                      <span>
                        <Button
                          size="sm"
                          variant="primary"
                          icon={<Plus size={14} />}
                          onClick={() => router.push(newComputerHref)}
                        >
                          New Desktop
                        </Button>
                      </span>
                    </Tooltip>
                  }
                />
              ) : (
                <section className="flex flex-col gap-2">
                  <div className="pb-2 border-b border-[color:var(--harbor-border-subtle)]">
                    <h2 className="text-base font-semibold m-0">
                      Recent desktops
                      <span className="text-fg-muted text-xs font-normal ml-2">
                        · {Math.min(5, hosts.length)} of {hosts.length}
                      </span>
                    </h2>
                  </div>
                  <DesktopListView
                    hosts={hosts.slice(0, 5)}
                    pendingActions={pendingActions}
                    view="table"
                    showDepartment={false}
                    nodeNameById={nodeNameById}
                    onOpen={handlePcSelect}
                    onPlay={handlePlayAction}
                    onPause={handlePauseAction}
                    onStop={handleStopAction}
                    onDelete={handleDeleteAction}
                  />
                </section>
              )}
            </ResponsiveStack>
          </TabPanel>

          <TabPanel value="computers">
            {hosts.length === 0 ? (
              <EmptyState
                icon={<Monitor size={18} />}
                title="No desktops in this department yet"
                description="Create your first desktop to start populating this department."
                actions={
                  <Tooltip content="New Desktop">
                    <span>
                      <Button
                        size="sm"
                        variant="primary"
                        icon={<Plus size={14} />}
                        onClick={() => router.push(newComputerHref)}
                      >
                        New Desktop
                      </Button>
                    </span>
                  </Tooltip>
                }
              />
            ) : (
              <DesktopListView
                hosts={hosts}
                pendingActions={pendingActions}
                view="table"
                showDepartment={false}
                nodeNameById={nodeNameById}
                onOpen={handlePcSelect}
                onPlay={handlePlayAction}
                onPause={handlePauseAction}
                onStop={handleStopAction}
                onDelete={handleDeleteAction}
              />
            )}
          </TabPanel>

          <TabPanel value="security">
            <SecuritySection departmentId={department?.id} />
          </TabPanel>

          <TabPanel value="scripts">
            {/* embedded: render the scripts content WITHOUT its own <Page>
                wrapper/header, since this tab already lives inside this page's
                <Page> and PageHeader. */}
            <DepartmentScriptsPage embedded />
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
      >
        <DialogTitle>Delete desktop</DialogTitle>
        <DialogDescription>
          {deleteConfirmation?.vm
            ? `Remove "${deleteConfirmation.vm.name}"? This cannot be undone.`
            : 'This action cannot be undone.'}
        </DialogDescription>
        <DialogBody>
          <Alert
            tone="danger"
            size="sm"
            icon={<AlertCircle size={14} />}
          >
            All snapshots, volumes and configuration for this desktop will be
            permanently removed.
          </Alert>
        </DialogBody>
        <DialogButtons align="end">
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
        </DialogButtons>
      </Dialog>
    </>
  );
};

export default DepartmentPage;
