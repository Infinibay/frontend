"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  Monitor,
  Shield,
  FileCode,
  Network,
  Plus,
  AlertCircle,
  Play,
  Pause,
  Square,
  ArrowLeft,
} from "lucide-react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Button,
  ButtonGroup,
  Badge,
  Card,
  Dialog,
  Alert,
  Stat,
  ClusterView,
  EmptyState,
  Spinner,
  Skeleton,
} from "@infinibay/harbor";

import { useDepartmentPage } from "./hooks/useDepartmentPage";
import { usePageHeader } from "@/hooks/usePageHeader";

// Lazy tab content.
const SecuritySection = dynamic(() => import("./components/SecuritySection.jsx"), {
  ssr: false,
  loading: () => <TabLoading label="Loading security…" />,
});
const DepartmentScriptsPage = dynamic(() => import("./scripts/page.jsx"), {
  ssr: false,
  loading: () => <TabLoading label="Loading scripts…" />,
});
const DepartmentNetworkTab = dynamic(() => import("./components/DepartmentNetworkTab.jsx"), {
  ssr: false,
  loading: () => <TabLoading label="Loading network diagnostics…" />,
});

function TabLoading({ label }) {
  return (
    <div className="py-12 flex items-center justify-center gap-3 text-fg-muted text-sm">
      <Spinner /> {label}
    </div>
  );
}

/** Map VM state → Harbor HostStatus vocabulary. */
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
    case "stopping":
      return "maintenance";
    default:
      return "offline";
  }
};

const vmSubtitle = (vm) => {
  const bits = [];
  const os = vm?.configuration?.os || vm?.os;
  if (os) bits.push(os);
  if (vm?.cpuCores) bits.push(`${vm.cpuCores} vCPU`);
  if (vm?.ramGB) bits.push(`${vm.ramGB} GB`);
  return bits.join(" · ");
};

/**
 * Per-card inline power controls for a host in the ClusterView.
 * Click-propagation is stopped so pressing a button doesn't fire the
 * card's navigation-to-detail handler.
 */
function VmActions({ vm, onPlay, onPause, onStop }) {
  const stop = (e) => e.stopPropagation();
  const status = (vm.status || "").toLowerCase();

  if (status === "running") {
    return (
      <ButtonGroup className="gap-1" onClick={stop}>
        <Button
          size="sm"
          variant="ghost"
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
          size="sm"
          variant="ghost"
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
      size="sm"
      variant="ghost"
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
      title: "Department",
      description: "Manage VMs, firewall, scripts and network for this department.",
      icon: <Building2 className="h-5 w-5 text-accent-2" />,
      sections: [
        {
          id: "vms",
          title: "Virtual machines",
          icon: <Monitor className="h-4 w-4" />,
          content: (
            <p>
              The Computers tab lists every VM that belongs here. Click a card
              to open its detail view; use the inline controls for quick
              power actions.
            </p>
          ),
        },
        {
          id: "security",
          title: "Security",
          icon: <Shield className="h-4 w-4" />,
          content: (
            <p>
              Firewall policy + department-wide rules that every VM inherits.
              VMs can still add their own rules on top.
            </p>
          ),
        },
        {
          id: "scripts",
          title: "Scripts",
          icon: <FileCode className="h-4 w-4" />,
          content: (
            <p>
              Automation scripts scoped to this department. Run them on
              individual VMs or on demand for the whole set.
            </p>
          ),
        },
        {
          id: "network",
          title: "Network",
          icon: <Network className="h-4 w-4" />,
          content: (
            <p>
              Bridge / DHCP / NAT diagnostics for the subnet this department
              lives on.
            </p>
          ),
        },
      ],
      quickTips: [
        "Click any VM card to open its detail page",
        "Security rules here apply to every VM in the department",
        "Use the Scripts tab for department-wide automation",
      ],
    }),
    []
  );

  usePageHeader(
    {
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Departments", href: "/departments" },
        { label: department?.name || "Department", isCurrent: true },
      ],
      title: department?.name || "Department",
      backButton: { href: "/departments", label: "Back" },
      actions: [],
      helpConfig,
      helpTooltip: "Department help",
    },
    [department?.name]
  );

  // Map machines → ClusterHost once per render.
  const hosts = useMemo(
    () =>
      machines.map((vm) => ({
        id: vm.id,
        name: vm.name,
        status: vmStatusToHarbor(vm.status),
        subtitle: vmSubtitle(vm),
        tags: vm.user
          ? [
              `${vm.user.firstName || ""} ${vm.user.lastName || ""}`.trim() ||
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
    [machines, handlePlayAction, handlePauseAction, handleStopAction]
  );

  const stats = useMemo(() => {
    const total = machines.length;
    const running = machines.filter((m) => (m.status || "").toLowerCase() === "running").length;
    const stopped = machines.filter(
      (m) => !["running", "paused", "suspended", "starting", "provisioning"].includes(
        (m.status || "").toLowerCase()
      )
    ).length;
    const busy = total - running - stopped;
    return { total, running, stopped, busy };
  }, [machines]);

  // ─── Loading / not-found ────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (departmentName && !department) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert
          tone="warning"
          title="Department not found"
          actions={
            <Button
              size="sm"
              variant="secondary"
              icon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => router.push("/departments")}
            >
              Back to departments
            </Button>
          }
        >
          We couldn&apos;t find a department named <strong>{params.name}</strong>.
        </Alert>
      </div>
    );
  }

  const newComputerHref = `/departments/${departmentName}/computers/create`;

  return (
    <div className="space-y-6">
      {/* Hero — department identity + primary actions */}
      <Card variant="glass" className="relative">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className="h-14 w-14 rounded-2xl bg-accent/15 grid place-items-center shrink-0">
              <Building2 className="h-6 w-6 text-accent" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-widest text-fg-muted">
                Department
              </div>
              <h1 className="text-2xl font-semibold text-fg truncate">
                {department?.name || "Department"}
              </h1>
              <p className="text-sm text-fg-muted mt-1">
                {stats.total} {stats.total === 1 ? "virtual machine" : "virtual machines"}
                {department?.id ? (
                  <>
                    {" · "}
                    <Badge tone="neutral" className="font-mono text-[10px]">
                      {department.id.slice(0, 6)}
                    </Badge>
                  </>
                ) : null}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => router.push(newComputerHref)}
            >
              New computer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <Stat label="Total" value={stats.total} icon={<Monitor className="h-3.5 w-3.5" />} />
          <Stat label="Running" value={stats.running} />
          <Stat label="Stopped" value={stats.stopped} />
          <Stat label="Busy" value={stats.busy} />
        </div>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab || "computers"}
        onValueChange={setActiveTab}
        variant="underline"
        className="w-full"
      >
        <TabList className="w-full">
          <Tab value="computers" icon={<Monitor className="h-4 w-4" />}>
            Computers
          </Tab>
          <Tab value="security" icon={<Shield className="h-4 w-4" />}>
            Security
          </Tab>
          <Tab value="scripts" icon={<FileCode className="h-4 w-4" />}>
            Scripts
          </Tab>
          <Tab value="network" icon={<Network className="h-4 w-4" />}>
            Network
          </Tab>
        </TabList>

        <TabPanel value="computers" className="mt-2">
          {hosts.length === 0 ? (
            <Card variant="default" className="p-0">
              <EmptyState
                icon={<Monitor className="h-10 w-10 text-fg-subtle" />}
                title="No VMs in this department yet"
                description="Create your first VM to start populating this department."
                actions={
                  <Button
                    size="sm"
                    icon={<Plus className="h-4 w-4" />}
                    onClick={() => router.push(newComputerHref)}
                  >
                    New computer
                  </Button>
                }
              />
            </Card>
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

        <TabPanel value="security" className="mt-2">
          <SecuritySection departmentId={department?.id} />
        </TabPanel>

        <TabPanel value="scripts" className="mt-2">
          <DepartmentScriptsPage />
        </TabPanel>

        <TabPanel value="network" className="mt-2">
          <DepartmentNetworkTab departmentId={department?.id} />
        </TabPanel>
      </Tabs>

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
          deleteConfirmation?.vm
            ? `Remove ${deleteConfirmation.vm.name}? This cannot be undone.`
            : "This action cannot be undone."
        }
        footer={
          <ButtonGroup className="justify-end">
            <Button variant="secondary" onClick={cancelDelete} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              loading={isDeleting}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </ButtonGroup>
        }
      >
        <p className="text-sm text-fg-muted">
          All snapshots, volumes and configuration for this VM will be
          permanently removed.
        </p>
      </Dialog>
    </div>
  );
};

export default DepartmentPage;
