"use client";

import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Page,
  Card,
  Button,
  IconButton,
  Dialog,
  ButtonGroup,
  Alert,
  EmptyState,
  Stat,
  ClusterView,
  Spinner,
  ResponsiveStack,
  ResponsiveGrid,
  ContextMenu,
  MenuItem,
  MenuLabel,
  MenuSeparator,
} from "@infinibay/harbor";
import {
  AlertCircle,
  Monitor,
  Plus,
  RefreshCw,
  Play,
  Pause,
  Square,
  Cpu,
  Power,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { createDebugger } from "@/utils/debug";

import { useComputerActions } from "./hooks/useComputerActions";
import { fetchVms } from "@/state/slices/vms";
import { fetchDepartments } from "@/state/slices/departments";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import useEnsureData, { LOADING_STRATEGIES } from "@/hooks/useEnsureData";
import { usePageHeader } from "@/hooks/usePageHeader";

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

const InlinePowerButtons = ({ vm, pending, onPlay, onPause, onStop }) => {
  const status = (vm.status || "").toLowerCase();
  const stop = (e) => {
    e.stopPropagation();
  };
  const isPending = pending?.[vm.id];

  if (isPending) {
    return (
      <ResponsiveStack direction="row" gap={1} align="center">
        <Spinner />
      </ResponsiveStack>
    );
  }

  if (status === "running") {
    return (
      <ButtonGroup onClick={stop}>
        <IconButton
          variant="ghost"
          size="sm"
          icon={<Pause size={14} />}
          onClick={(e) => {
            stop(e);
            onPause?.(vm);
          }}
          aria-label="Pause"
        />
        <IconButton
          variant="ghost"
          size="sm"
          icon={<Square size={14} />}
          onClick={(e) => {
            stop(e);
            onStop?.(vm);
          }}
          aria-label="Stop"
        />
      </ButtonGroup>
    );
  }

  return (
    <IconButton
      variant="ghost"
      size="sm"
      icon={<Play size={14} />}
      onClick={(e) => {
        stop(e);
        onPlay?.(vm);
      }}
      aria-label="Start"
    />
  );
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

  const handleNewVM = () => router.push("/computers/create");

  const helpConfig = useMemo(
    () => ({
      title: "Computers",
      description: "Manage your fleet of virtual machines.",
      icon: <Monitor size={20} />,
      sections: [
        {
          id: "managing",
          title: "Managing VMs",
          icon: <Monitor size={16} />,
          content: (
            <p>
              Click a VM card to open its detail view. Use the inline Play /
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
              Filter chips at the top of the grid narrow by status, region
              (department) or tag. The density toggle on the right switches
              between comfortable and compact card sizes.
            </p>
          ),
        },
        {
          id: "new",
          title: "Creating VMs",
          icon: <Plus size={16} />,
          content: (
            <p>
              Upload at least one ISO in Settings before creating your first
              VM. The New button is disabled until that&apos;s done.
            </p>
          ),
        },
      ],
      quickTips: [
        "Click a card to open the VM detail view",
        "Use filter chips to narrow by status or department",
        "Toggle density for a denser view of many hosts",
      ],
    }),
    []
  );

  usePageHeader(
    {
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Computers", isCurrent: true },
      ],
      title: "Computers",
      actions: [],
      helpConfig,
      helpTooltip: "Computers help",
    },
    []
  );

  if (loading && !machines?.length) {
    return (
      <Page gap="lg">
        <Card variant="default">
          <ResponsiveStack direction="row" gap={3} justify="center" align="center">
            <Spinner /> Loading computers…
          </ResponsiveStack>
        </Card>
      </Page>
    );
  }

  return (
    <Page gap="lg">
      <Card
        variant="default"
        leadingIcon={<Monitor size={20} />}
        leadingIconTone="sky"
        title="Computers"
        description={`${hosts.length} virtual machine${hosts.length !== 1 ? "s" : ""} across ${departments?.length || 0} department${(departments?.length || 0) !== 1 ? "s" : ""}`}
      >
        <ResponsiveStack
          direction={{ base: "col", lg: "row" }}
          gap={4}
          justify="between"
          align="stretch"
        >
          <ResponsiveGrid columns={{ base: 2, md: 4 }} gap={3}>
            <Stat
              label="Running"
              value={statusCounts.online}
              icon={<Power size={14} />}
              variant="plain"
            />
            <Stat label="Paused" value={statusCounts.degraded} variant="plain" />
            <Stat label="Stopped" value={statusCounts.offline} variant="plain" />
            <Stat
              label="Provisioning"
              value={statusCounts.provisioning}
              variant="plain"
            />
          </ResponsiveGrid>

          <ResponsiveStack direction="row" gap={2} align="center">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw size={16} />}
              onClick={refreshVms}
              disabled={vmsLoading}
            >
              Refresh
            </Button>
            {hasISOs ? (
              <Button
                size="sm"
                icon={<Plus size={16} />}
                onClick={handleNewVM}
              >
                New VM
              </Button>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                icon={<AlertCircle size={16} />}
                disabled
                title="Upload an ISO image first"
              >
                New VM
              </Button>
            )}
          </ResponsiveStack>
        </ResponsiveStack>
      </Card>

      {error && (
        <Alert
          tone="danger"
          title="Couldn't load VMs"
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
        <Card variant="default">
          <EmptyState
            icon={<Monitor size={40} />}
            title="No virtual machines yet"
            description={
              hasISOs
                ? "Create your first VM to see it here."
                : "Upload an ISO in Settings, then create your first VM."
            }
            actions={
              hasISOs ? (
                <Button
                  size="sm"
                  icon={<Plus size={16} />}
                  onClick={handleNewVM}
                >
                  New VM
                </Button>
              ) : null
            }
          />
        </Card>
      ) : (
        <ClusterView
          hosts={hosts.map((h) => ({
            ...h,
            actions: (
              <InlinePowerButtons
                vm={h._raw}
                pending={pendingActions}
                onPlay={handlePlay}
                onPause={handlePause}
                onStop={handleStop}
              />
            ),
          }))}
          onHostClick={(host) => {
            const raw = hosts.find((h) => h.id === host.id)?._raw;
            if (raw) handlePcSelect(raw);
          }}
          renderHost={(host, card) => {
            const raw = hosts.find((h) => h.id === host.id)?._raw;
            if (!raw) return card;
            const status = (raw.status || "").toLowerCase();
            const isRunning = status === "running";
            const isPaused = status === "paused" || status === "suspended";
            const isStopped = !isRunning && !isPaused;
            const isPending = !!pendingActions?.[raw.id];
            return (
              <ContextMenu
                menu={
                  <>
                    <MenuLabel>{raw.name}</MenuLabel>
                    <MenuSeparator />
                    <MenuItem
                      icon={<Play size={14} />}
                      disabled={isPending || isRunning}
                      onClick={() => handlePlay(raw)}
                    >
                      Start
                    </MenuItem>
                    <MenuItem
                      icon={<Pause size={14} />}
                      disabled={isPending || !isRunning}
                      onClick={() => handlePause(raw)}
                    >
                      Pause
                    </MenuItem>
                    <MenuItem
                      icon={<Square size={14} />}
                      disabled={isPending || isStopped}
                      onClick={() => handleStop(raw)}
                    >
                      Stop
                    </MenuItem>
                    <MenuSeparator />
                    <MenuItem
                      icon={<ExternalLink size={14} />}
                      onClick={() => handlePcSelect(raw)}
                    >
                      Open
                    </MenuItem>
                    <MenuSeparator />
                    <MenuItem
                      icon={<Trash2 size={14} />}
                      danger
                      onClick={() => handleDelete(raw)}
                    >
                      Delete
                    </MenuItem>
                  </>
                }
              >
                {card}
              </ContextMenu>
            );
          }}
        />
      )}

      <Dialog
        open={!!deleteConfirmation?.isOpen}
        onClose={cancelDelete}
        size="sm"
        title={
          <ResponsiveStack direction="row" gap={2} align="center">
            <AlertCircle size={16} />
            Delete virtual machine
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
