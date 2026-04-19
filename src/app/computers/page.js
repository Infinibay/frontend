"use client";

import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Card,
  Button,
  Dialog,
  ButtonGroup,
  Alert,
  EmptyState,
  Stat,
  ClusterView,
  Spinner,
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
      <span className="inline-flex items-center gap-1 text-xs text-fg-muted">
        <Spinner /> …
      </span>
    );
  }

  if (status === "running") {
    return (
      <ButtonGroup className="gap-1" onClick={stop}>
        <Button
          variant="ghost"
          size="sm"
          icon={<Pause className="h-3.5 w-3.5" />}
          onClick={(e) => {
            stop(e);
            onPause?.(vm);
          }}
          aria-label="Pause"
        >
          {""}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon={<Square className="h-3.5 w-3.5" />}
          onClick={(e) => {
            stop(e);
            onStop?.(vm);
          }}
          aria-label="Stop"
        >
          {""}
        </Button>
      </ButtonGroup>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      icon={<Play className="h-3.5 w-3.5" />}
      onClick={(e) => {
        stop(e);
        onPlay?.(vm);
      }}
      aria-label="Start"
    >
      {""}
    </Button>
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
    deleteConfirmation,
    confirmDelete,
    cancelDelete,
  } = useComputerActions();

  // Map machines → ClusterHost. Department name doubles as a region so
  // the ClusterView's region filter chips act as department filters for
  // free.
  const hosts = useMemo(
    () =>
      (machines || []).map((vm) => ({
        id: vm.id,
        name: vm.name,
        status: vmStatusToHarbor(vm.status),
        subtitle: vmSubtitle(vm),
        tags: vm.department?.name ? [vm.department.name] : [],
        region: vm.department?.name || undefined,
        _raw: vm,
      })),
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
      icon: <Monitor className="h-5 w-5 text-accent-2" />,
      sections: [
        {
          id: "managing",
          title: "Managing VMs",
          icon: <Monitor className="h-4 w-4" />,
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
          icon: <Cpu className="h-4 w-4" />,
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
          icon: <Plus className="h-4 w-4" />,
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

  // ---- Render ------------------------------------------------------

  if (loading && !machines?.length) {
    return (
      <div className="flex items-center justify-center py-20 gap-3 text-fg-muted">
        <Spinner /> Loading computers…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero strip — fleet stats + primary actions. */}
      <Card variant="glass" className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-fg flex items-center gap-2">
              <Monitor className="h-5 w-5 text-accent-2" />
              Computers
            </h1>
            <p className="text-sm text-fg-muted mt-1">
              {hosts.length} virtual machine{hosts.length !== 1 ? "s" : ""} across{" "}
              {departments?.length || 0} department
              {(departments?.length || 0) !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className={`h-4 w-4 ${vmsLoading ? "animate-spin" : ""}`} />}
              onClick={refreshVms}
              disabled={vmsLoading}
            >
              Refresh
            </Button>
            {hasISOs ? (
              <Button
                size="sm"
                icon={<Plus className="h-4 w-4" />}
                onClick={handleNewVM}
              >
                New VM
              </Button>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                icon={<AlertCircle className="h-4 w-4" />}
                disabled
                title="Upload an ISO image first"
              >
                New VM
              </Button>
            )}
          </div>
        </div>

        {/* Status mini-board */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <Stat
            label="Running"
            value={statusCounts.online}
            icon={<Power className="h-3.5 w-3.5" />}
          />
          <Stat
            label="Paused"
            value={statusCounts.degraded}
          />
          <Stat
            label="Stopped"
            value={statusCounts.offline}
          />
          <Stat
            label="Provisioning"
            value={statusCounts.provisioning}
          />
        </div>
      </Card>

      {error && (
        <Alert
          tone="danger"
          title="Couldn't load VMs"
          actions={
            <Button size="sm" onClick={refreshVms} icon={<RefreshCw className="h-4 w-4" />}>
              Retry
            </Button>
          }
        >
          {String(error?.message || error)}
        </Alert>
      )}

      {/* Fleet grid — Harbor's ClusterView does status/region/tag filter chips,
          FluidGrid responsive columns, and density toggle out of the box. */}
      {hosts.length === 0 ? (
        <Card variant="default" className="p-2">
          <EmptyState
            icon={<Monitor className="h-10 w-10 text-fg-subtle" />}
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
                  icon={<Plus className="h-4 w-4" />}
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
        />
      )}

      {/* Delete confirmation */}
      <Dialog
        open={!!deleteConfirmation?.isOpen}
        onClose={cancelDelete}
        size="sm"
        title={
          <span className="flex items-center gap-2 text-danger">
            <AlertCircle className="h-4 w-4" />
            Delete virtual machine
          </span>
        }
        description={
          deleteConfirmation?.machine
            ? `This permanently removes ${deleteConfirmation.machine.name} and all its data.`
            : "This action cannot be undone."
        }
        footer={
          <ButtonGroup className="justify-end">
            <Button variant="secondary" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </ButtonGroup>
        }
      >
        <p className="text-sm text-fg-muted">
          All snapshots, volumes and attached configuration will be lost.
        </p>
      </Dialog>
    </div>
  );
}
