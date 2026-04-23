"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  ButtonGroup,
  Dialog,
  EmptyState,
  IconButton,
  Page,
  ResponsiveStack,
  SegmentedControl,
  Select,
  Spinner,
  Tooltip,
} from "@infinibay/harbor";
import {
  AlertCircle,
  Cpu,
  LayoutGrid,
  Monitor,
  Plus,
  RefreshCw,
  Rows3,
} from "lucide-react";
import { createDebugger } from "@/utils/debug";

import { useComputerActions } from "./hooks/useComputerActions";
import { fetchVms } from "@/state/slices/vms";
import { fetchDepartments } from "@/state/slices/departments";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import useEnsureData, { LOADING_STRATEGIES } from "@/hooks/useEnsureData";
import { usePageHeader } from "@/hooks/usePageHeader";
import {
  selectDesktopsView,
  setDesktopsView,
} from "@/state/slices/appSettings";
import { PageHeader } from "@/components/common/PageHeader";
import { DesktopListView } from "@/components/common/DesktopListView";

const debug = createDebugger("frontend:pages:computers");

/** Map QEMU-style status string → Harbor HostStatus. */
const vmStatusToHarbor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "running":
      return "online";
    case "paused":
    case "suspended":
      return "degraded";
    case "starting":
    case "provisioning":
    case "building":
      return "provisioning";
    case "stopped":
    case "shutoff":
    case "off":
    case "powered_off":
    case "error":
    default:
      return "offline";
  }
};

/** Map an OS string → simple-icons CDN slug + brand color. */
const OS_ICON_MAP = [
  { match: /windows|win\b|win10|win11|server/i, slug: "windows", color: "0078D6" },
  { match: /ubuntu/i, slug: "ubuntu", color: "E95420" },
  { match: /debian/i, slug: "debian", color: "A81D33" },
  { match: /fedora/i, slug: "fedora", color: "51A2DA" },
  { match: /centos/i, slug: "centos", color: "262577" },
  { match: /rhel|red\s?hat/i, slug: "redhat", color: "EE0000" },
  { match: /arch/i, slug: "archlinux", color: "1793D1" },
  { match: /alpine/i, slug: "alpinelinux", color: "0D597F" },
  { match: /macos|osx|darwin|apple/i, slug: "apple", color: "FFFFFF" },
  { match: /freebsd|bsd/i, slug: "freebsd", color: "AB2B28" },
  { match: /linux|gnu/i, slug: "linux", color: "FCC624" },
];

const osIconFor = (os) => {
  if (!os) return null;
  const hit = OS_ICON_MAP.find((m) => m.match.test(os));
  if (!hit) return null;
  return (
    <img
      src={`https://cdn.simpleicons.org/${hit.slug}/${hit.color}`}
      alt={os}
      title={os}
      width={16}
      height={16}
    />
  );
};

/** Compose a HostCard subtitle line from VM metadata. */
const vmSubtitle = (vm) => {
  const bits = [];
  const os = vm?.configuration?.os || vm?.os;
  if (os) bits.push(os);
  if (vm?.cpuCores) bits.push(`${vm.cpuCores} vCPU`);
  if (vm?.ramGB) bits.push(`${vm.ramGB} GB`);
  return bits.join(" · ");
};

export default function ComputersPage() {
  const router = useRouter();
  const pendingActions = useSelector((state) => state.vms.pendingActions);

  const {
    data: machines,
    isLoading: vmsLoading,
    error: vmsError,
    refresh: refreshVms,
  } = useEnsureData("vms", fetchVms, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 2 * 60 * 1000,
  });

  const {
    data: departments,
    isLoading: departmentsLoading,
    error: departmentsError,
  } = useEnsureData("departments", fetchDepartments, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 10 * 60 * 1000,
  });

  const loading = vmsLoading || departmentsLoading;
  const error = vmsError || departmentsError;

  const { isReady: hasISOs } = useSystemStatus({ checkOnMount: true });

  const {
    handlePcSelect,
    handlePlay,
    handlePause,
    handleStop,
    handleDelete,
    deleteConfirmation,
    confirmDelete,
    cancelDelete,
  } = useComputerActions();

  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");

  const dispatch = useDispatch();
  const view = useSelector(selectDesktopsView);
  const onViewChange = (v) => dispatch(setDesktopsView(v));

  const hosts = useMemo(
    () =>
      (machines || []).map((vm) => {
        const os = vm?.configuration?.os || vm?.os;
        return {
          id: vm.id,
          name: vm.name,
          status: vmStatusToHarbor(vm.status),
          subtitle: vmSubtitle(vm),
          tags: vm.department?.name ? [vm.department.name] : [],
          region: vm.department?.name || undefined,
          osIcon: osIconFor(os),
          _raw: vm,
        };
      }),
    [machines]
  );

  const filteredHosts = useMemo(
    () =>
      hosts.filter((h) => {
        if (statusFilter !== "all" && h.status !== statusFilter) return false;
        if (deptFilter !== "all" && h._raw?.department?.id !== deptFilter) return false;
        return true;
      }),
    [hosts, statusFilter, deptFilter]
  );

  const statusOptions = useMemo(
    () => [
      { value: "all", label: "All statuses" },
      { value: "online", label: "Running" },
      { value: "degraded", label: "Paused" },
      { value: "offline", label: "Stopped" },
      { value: "provisioning", label: "Provisioning" },
    ],
    []
  );

  const deptOptions = useMemo(
    () => [
      { value: "all", label: "All departments" },
      ...(departments || []).map((d) => ({ value: d.id, label: d.name })),
    ],
    [departments]
  );

  const statusCounts = useMemo(() => {
    const counts = { online: 0, degraded: 0, offline: 0, provisioning: 0 };
    hosts.forEach((h) => {
      counts[h.status] = (counts[h.status] || 0) + 1;
    });
    return counts;
  }, [hosts]);

  useEffect(() => {
    debug.log("render", "ComputersPage rendered:", {
      machineCount: machines?.length || 0,
      departmentCount: departments?.length || 0,
      loading,
      hasError: !!error,
      hasISOs,
    });
  }, [machines?.length, departments?.length, loading, error, hasISOs]);

  const handleNewVM = () => router.push("/desktops/new");

  const helpConfig = useMemo(
    () => ({
      title: "Desktops",
      description: "Manage every desktop across all departments.",
      icon: <Monitor size={20} />,
      sections: [
        {
          id: "managing",
          title: "Managing desktops",
          icon: <Monitor size={16} />,
          content: (
            <p>
              Click a desktop card to open its detail view. Use the inline Play /
              Pause / Stop buttons for quick power control without leaving the
              list.
            </p>
          ),
        },
        {
          id: "filters",
          title: "Filters",
          icon: <Cpu size={16} />,
          content: (
            <p>
              Filter chips at the top of the grid narrow by status, department
              or tag. The density toggle on the right switches between
              comfortable and compact card sizes.
            </p>
          ),
        },
        {
          id: "new",
          title: "Creating desktops",
          icon: <Plus size={16} />,
          content: (
            <p>
              Upload at least one ISO in Settings before creating your first
              desktop. The New button is disabled until that&apos;s done.
            </p>
          ),
        },
      ],
      quickTips: [
        "Click a card to open the desktop detail view",
        "Use filter chips to narrow by status or department",
        "Toggle density for a denser view of many desktops",
      ],
    }),
    []
  );

  usePageHeader(
    {
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Desktops", isCurrent: true },
      ],
      title: "Desktops",
      actions: [],
      helpConfig,
      helpTooltip: "Desktops help",
    },
    []
  );

  if (loading && !machines?.length) {
    return (
      <Page gap="lg">
        <ResponsiveStack direction="row" gap={3} justify="center" align="center">
          <Spinner /> Loading desktops…
        </ResponsiveStack>
      </Page>
    );
  }

  const countText = hosts.length === 0
    ? null
    : [
        `${hosts.length} ${hosts.length === 1 ? "desktop" : "desktops"}`,
        statusCounts.online > 0 ? `${statusCounts.online} running` : null,
        statusCounts.degraded > 0 ? `${statusCounts.degraded} paused` : null,
      ].filter(Boolean).join(" · ");

  const viewToggle = (
    <SegmentedControl
      size="sm"
      items={[
        { value: "table", label: <Rows3 size={14} /> },
        { value: "grid", label: <LayoutGrid size={14} /> },
      ]}
      value={view}
      onChange={onViewChange}
    />
  );

  return (
    <Page gap="lg">
      <PageHeader
        title="Desktops"
        count={countText}
        secondary={
          <ResponsiveStack direction="row" gap={1} align="center">
            {viewToggle}
            <IconButton
              size="sm"
              variant="ghost"
              label="Refresh"
              icon={<RefreshCw size={14} />}
              onClick={refreshVms}
              disabled={vmsLoading}
            />
          </ResponsiveStack>
        }
        primary={
          <Tooltip content={hasISOs ? "New Desktop" : "Upload an ISO image first"}>
            <span>
              <Button
                size="sm"
                variant="primary"
                icon={hasISOs ? <Plus size={14} /> : <AlertCircle size={14} />}
                onClick={hasISOs ? handleNewVM : undefined}
                disabled={!hasISOs}
              >
                New Desktop
              </Button>
            </span>
          </Tooltip>
        }
        filters={
          hosts.length > 0 ? (
            <>
              <div className="w-[160px]">
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={statusOptions}
                />
              </div>
              <div className="w-[180px]">
                <Select
                  value={deptFilter}
                  onChange={setDeptFilter}
                  options={deptOptions}
                />
              </div>
              {(statusFilter !== "all" || deptFilter !== "all") ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setStatusFilter("all");
                    setDeptFilter("all");
                  }}
                >
                  Clear
                </Button>
              ) : null}
              {filteredHosts.length !== hosts.length ? (
                <span className="text-fg-muted text-xs ml-auto">
                  {filteredHosts.length} of {hosts.length}
                </span>
              ) : null}
            </>
          ) : null
        }
      />

      {error && (
        <Alert
          tone="danger"
          title="Couldn't load desktops"
          actions={
            <Button size="sm" onClick={refreshVms} icon={<RefreshCw size={16} />}>
              Retry
            </Button>
          }
        >
          {String(error?.message || error)}
        </Alert>
      )}

      {hosts.length === 0 ? (
        <EmptyState
          icon={<Monitor size={18} />}
          title="No desktops yet"
          description={
            hasISOs
              ? "Create your first desktop to see it here."
              : "Upload an ISO in Settings, then create your first desktop."
          }
          actions={
            hasISOs ? (
              <Tooltip content="New Desktop">
                <span>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={<Plus size={14} />}
                    onClick={handleNewVM}
                  >
                    New Desktop
                  </Button>
                </span>
              </Tooltip>
            ) : null
          }
        />
      ) : filteredHosts.length === 0 ? (
        <EmptyState
          icon={<Monitor size={18} />}
          title={
            statusFilter !== "all" && deptFilter !== "all"
              ? `No ${statusFilter === "online" ? "running" : statusFilter === "offline" ? "stopped" : statusFilter} desktops in the selected department`
              : statusFilter !== "all"
                ? `No ${statusFilter === "online" ? "running" : statusFilter === "offline" ? "stopped" : statusFilter} desktops right now`
                : "No desktops in the selected department"
          }
          description={`${hosts.length} total desktop${hosts.length !== 1 ? 's' : ''} don't match the current filters.`}
          actions={
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setStatusFilter("all");
                setDeptFilter("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <DesktopListView
          hosts={filteredHosts}
          pendingActions={pendingActions}
          view={view}
          showDepartment
          onOpen={handlePcSelect}
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          onDelete={handleDelete}
        />
      )}

      <Dialog
        open={!!deleteConfirmation?.isOpen}
        onClose={cancelDelete}
        size="sm"
        title={
          <ResponsiveStack direction="row" gap={2} align="center">
            <AlertCircle size={16} />
            Delete desktop
          </ResponsiveStack>
        }
        description={
          deleteConfirmation?.machine
            ? `This permanently removes ${deleteConfirmation.machine.name} and all its data.`
            : "This action cannot be undone."
        }
        footer={
          <ButtonGroup>
            <Button variant="secondary" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </ButtonGroup>
        }
      >
        <p>All snapshots, volumes and attached configuration will be lost.</p>
      </Dialog>
    </Page>
  );
}
