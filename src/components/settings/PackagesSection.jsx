"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Package,
  Puzzle,
  ChevronDown,
  ChevronRight,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Shield,
  Clock,
  Database,
  Globe,
  Wrench,
} from "lucide-react";
import {
  Card,
  Button,
  Badge,
  Dialog,
  Alert,
  EmptyState,
  Skeleton,
} from "@infinibay/harbor";

import {
  usePackagesQuery,
  useEnablePackageMutation,
  useDisablePackageMutation,
  useUninstallPackageMutation,
} from "@/gql/hooks";

const CAPABILITY_ICON = {
  network: Globe,
  storage: Database,
  cron: Clock,
  remediation: Wrench,
};

function formatCapabilities(caps) {
  if (!caps) return [];
  const out = [];
  if (caps.network?.length) {
    out.push({ key: "network", label: "Network", value: caps.network.join(", ") });
  }
  if (caps.storage) {
    out.push({ key: "storage", label: "Storage", value: "Enabled" });
  }
  if (caps.cron) {
    out.push({ key: "cron", label: "Schedule", value: caps.cron });
  }
  if (caps.remediation) {
    out.push({ key: "remediation", label: "Remediation", value: "Enabled" });
  }
  return out;
}

export default function PackagesSection({ embedded = false, className = "" }) {
  const [expanded, setExpanded] = useState(new Set());
  const [uninstallTarget, setUninstallTarget] = useState(null);

  const { data, loading, error, refetch } = usePackagesQuery({
    fetchPolicy: "cache-and-network",
  });

  const [enablePackage, { loading: enabling }] = useEnablePackageMutation({
    onError: (e) => toast.error(e.message),
    refetchQueries: ["Packages"],
  });
  const [disablePackage, { loading: disabling }] = useDisablePackageMutation({
    onError: (e) => toast.error(e.message),
    refetchQueries: ["Packages"],
  });
  const [uninstallPackage, { loading: uninstalling }] = useUninstallPackageMutation({
    onCompleted: () => {
      toast.success(`${uninstallTarget?.displayName} uninstalled`);
      setUninstallTarget(null);
    },
    onError: (e) => {
      toast.error(e.message);
      setUninstallTarget(null);
    },
    refetchQueries: ["Packages"],
  });

  const toggleExpand = (name) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const handleToggle = async (pkg) => {
    if (pkg.isBuiltin) {
      toast.info("Built-in packages cannot be disabled");
      return;
    }
    if (pkg.isEnabled) {
      await disablePackage({ variables: { name: pkg.name } });
      toast.success(`${pkg.displayName} disabled`);
    } else {
      await enablePackage({ variables: { name: pkg.name } });
      toast.success(`${pkg.displayName} enabled`);
    }
  };

  const packages = data?.packages || [];

  if (loading && !data) {
    return (
      <div className={className}>
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <Alert
          tone="danger"
          title="Couldn't load packages"
          actions={
            <Button
              size="sm"
              icon={<RefreshCw className="h-4 w-4" />}
              onClick={() => refetch()}
            >
              Retry
            </Button>
          }
        >
          {error.message}
        </Alert>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-accent-2" />
          <span className="text-sm text-fg-muted">
            {packages.length} package{packages.length !== 1 ? "s" : ""} —{" "}
            {packages.filter((p) => p.isBuiltin).length} built-in,{" "}
            {packages.filter((p) => !p.isBuiltin).length} external
          </span>
        </div>
        <Button
          size="sm"
          variant="secondary"
          icon={
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
          }
          onClick={() => refetch()}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {packages.length === 0 ? (
        <EmptyState
          icon={<Package className="h-10 w-10 text-fg-subtle" />}
          title="No packages installed"
          description="Install packages using the CLI to extend health diagnostics."
        />
      ) : (
        <div className="space-y-2">
          {packages.map((pkg) => {
            const isOpen = expanded.has(pkg.name);
            const capabilities = formatCapabilities(pkg.capabilities);
            const BusyMutation = enabling || disabling;
            return (
              <div
                key={pkg.id}
                className={`rounded-lg border ${
                  pkg.isEnabled
                    ? "border-white/8 bg-surface-1"
                    : "border-white/4 bg-surface-1/40"
                }`}
              >
                <div className="flex items-center gap-3 p-3">
                  <button
                    type="button"
                    onClick={() => toggleExpand(pkg.name)}
                    className="h-7 w-7 rounded-md grid place-items-center text-fg-muted hover:text-fg hover:bg-white/5 transition"
                    aria-label={isOpen ? "Collapse" : "Expand"}
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  <span
                    className={`h-9 w-9 rounded-lg grid place-items-center shrink-0 ${
                      pkg.isBuiltin
                        ? "bg-accent/15 text-accent"
                        : "bg-accent-2/15 text-accent-2"
                    }`}
                  >
                    {pkg.isBuiltin ? (
                      <Puzzle className="h-4 w-4" />
                    ) : (
                      <Package className="h-4 w-4" />
                    )}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-fg truncate">
                        {pkg.displayName}
                      </span>
                      <Badge tone={pkg.isBuiltin ? "info" : "purple"} className="text-[10px]">
                        {pkg.isBuiltin ? "Built-in" : "External"}
                      </Badge>
                      <Badge tone="neutral" className="text-[10px]">
                        v{pkg.version}
                      </Badge>
                    </div>
                    <div className="text-xs text-fg-muted truncate mt-0.5">
                      {pkg.description ||
                        `${pkg.checkers?.length || 0} checker${
                          (pkg.checkers?.length || 0) !== 1 ? "s" : ""
                        } • ${pkg.author}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs ${
                        pkg.isEnabled ? "text-success" : "text-fg-subtle"
                      }`}
                    >
                      {pkg.isEnabled ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <AlertCircle className="h-3.5 w-3.5" />
                      )}
                      {pkg.isEnabled ? "Enabled" : "Disabled"}
                    </span>
                    {!pkg.isBuiltin && (
                      <>
                        <Button
                          size="sm"
                          variant={pkg.isEnabled ? "secondary" : "primary"}
                          onClick={() => handleToggle(pkg)}
                          disabled={BusyMutation}
                        >
                          {pkg.isEnabled ? "Disable" : "Enable"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<Trash2 className="h-3.5 w-3.5" />}
                          onClick={() => setUninstallTarget(pkg)}
                          aria-label="Uninstall"
                        >
                          {""}
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-white/8 p-4 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <h4 className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-2">
                        Health checkers ({pkg.checkers?.length || 0})
                      </h4>
                      <div className="space-y-1.5">
                        {pkg.checkers?.map((checker) => (
                          <div
                            key={checker.id}
                            className={`flex items-center justify-between gap-2 p-2 rounded-md bg-surface-2 ${
                              !checker.isEnabled ? "opacity-50" : ""
                            }`}
                          >
                            <div className="min-w-0">
                              <span className="text-sm text-fg">
                                {checker.name}
                              </span>
                              <span className="text-xs text-fg-subtle ml-1.5">
                                ({checker.type})
                              </span>
                            </div>
                            {checker.dataNeeds?.length > 0 && (
                              <div className="flex gap-1 flex-wrap justify-end">
                                {checker.dataNeeds.slice(0, 3).map((need) => (
                                  <Badge key={need} tone="neutral" className="text-[10px]">
                                    {need}
                                  </Badge>
                                ))}
                                {checker.dataNeeds.length > 3 && (
                                  <Badge tone="neutral" className="text-[10px]">
                                    +{checker.dataNeeds.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-2">
                        Info
                      </h4>
                      <div className="space-y-1.5 text-sm">
                        <Row label="Author" value={pkg.author} />
                        <Row
                          label="License"
                          value={
                            <Badge
                              tone={pkg.license === "open-source" ? "success" : "neutral"}
                              className="text-[10px]"
                            >
                              {pkg.license}
                            </Badge>
                          }
                        />
                        <Row
                          label="Installed"
                          value={
                            pkg.installedAt
                              ? new Date(pkg.installedAt).toLocaleDateString()
                              : "—"
                          }
                        />
                      </div>

                      {capabilities.length > 0 && (
                        <>
                          <h4 className="text-xs font-semibold text-fg-muted uppercase tracking-wide mt-4 mb-2">
                            Capabilities
                          </h4>
                          <div className="space-y-1.5">
                            {capabilities.map((cap) => {
                              const Icon = CAPABILITY_ICON[cap.key] || Shield;
                              return (
                                <div
                                  key={cap.key}
                                  className="flex items-center gap-2 p-2 rounded-md bg-surface-2 text-sm"
                                >
                                  <Icon className="h-3.5 w-3.5 text-fg-muted shrink-0" />
                                  <span className="text-fg">{cap.label}</span>
                                  <span className="text-fg-muted text-xs ml-auto truncate">
                                    {cap.value}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!embedded && (
        <Card variant="default" className="mt-5">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-surface-2 text-fg-muted grid place-items-center shrink-0">
              <Wrench className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-fg">
                Install external packages
              </h4>
              <p className="text-xs text-fg-muted mt-0.5 mb-2">
                External packages are installed via the Infinibay CLI:
              </p>
              <code className="block text-xs font-mono text-fg bg-surface-2 px-3 py-2 rounded-md border border-white/8">
                infinibay package install ./my-package.tar.gz
              </code>
            </div>
          </div>
        </Card>
      )}

      <Dialog
        open={!!uninstallTarget}
        onClose={() => !uninstalling && setUninstallTarget(null)}
        size="sm"
        title="Uninstall package?"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setUninstallTarget(null)}
              disabled={uninstalling}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                uninstallPackage({ variables: { name: uninstallTarget.name } })
              }
              loading={uninstalling}
              disabled={uninstalling}
            >
              Uninstall
            </Button>
          </>
        }
      >
        <Alert tone="danger" className="mb-3">
          This will permanently remove{" "}
          <strong>{uninstallTarget?.displayName}</strong> and all of its
          checkers.
        </Alert>
        <p className="text-sm text-fg-muted">
          Historical data produced by this package stays in the database, but
          no new checks will run until it is reinstalled.
        </p>
      </Dialog>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-fg-muted text-xs">{label}</span>
      <span className="text-fg text-xs truncate">{value}</span>
    </div>
  );
}
