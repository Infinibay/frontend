"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Search,
  Settings,
  Plus,
  RefreshCw,
  AppWindow,
} from "lucide-react";
import {
  Card,
  Button,
  Badge,
  TextField,
  Alert,
  EmptyState,
  Spinner,
  DataTable,
  Stat,
} from "@infinibay/harbor";

import { fetchApplications } from "@/state/slices/applications";
import useEnsureData, { LOADING_STRATEGIES } from "@/hooks/useEnsureData";
import { usePageHeader } from "@/hooks/usePageHeader";
import { createDebugger } from "@/utils/debug";

const debug = createDebugger("frontend:pages:applications");

const ApplicationsPage = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const {
    data: applications,
    isLoading,
    error,
    refresh,
  } = useEnsureData("applications", fetchApplications, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 5 * 60 * 1000,
  });

  debug.info("Applications list state:", {
    count: applications?.length || 0,
    loading: isLoading,
    hasError: !!error,
  });

  const filtered = useMemo(() => {
    const list = applications || [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (a) =>
        a.name?.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q)
    );
  }, [applications, search]);

  const helpConfig = useMemo(
    () => ({
      title: "Applications",
      description: "Per-OS install scripts that VMs can pull on demand.",
      icon: <Package className="h-5 w-5 text-accent-2" />,
      sections: [
        {
          id: "creating",
          title: "Creating applications",
          icon: <Package className="h-4 w-4" />,
          content: (
            <p>
              Click <strong>New application</strong> to register one. Each
              app defines a name, description, parameter schema and a
              Windows / Ubuntu / Fedora install script.
            </p>
          ),
        },
        {
          id: "details",
          title: "Editing",
          icon: <Settings className="h-4 w-4" />,
          content: (
            <p>
              Click a row to open its detail view where the scripts and
              parameter list can be updated.
            </p>
          ),
        },
        {
          id: "search",
          title: "Searching",
          icon: <Search className="h-4 w-4" />,
          content: <p>Search matches name and description live.</p>,
        },
      ],
      quickTips: [
        "Click any row to edit the application",
        "Use the refresh button after creating via CLI",
      ],
    }),
    []
  );

  usePageHeader(
    {
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Applications", isCurrent: true },
      ],
      title: "Applications",
      actions: [],
      helpConfig,
      helpTooltip: "Applications help",
    },
    []
  );

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Application",
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-3 min-w-0">
            <span className="h-8 w-8 rounded-md bg-accent/15 text-accent grid place-items-center shrink-0">
              <AppWindow className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="text-sm font-medium text-fg truncate">
                {row.name}
              </div>
              {row.description ? (
                <div className="text-xs text-fg-muted truncate">
                  {row.description}
                </div>
              ) : null}
            </div>
          </div>
        ),
      },
      {
        key: "os",
        label: "OS",
        width: 220,
        render: (row) => {
          const oss = row.os || [];
          if (!oss.length)
            return <span className="text-fg-subtle text-xs">—</span>;
          return (
            <div className="flex items-center gap-1 flex-wrap">
              {oss.map((o) => (
                <Badge
                  key={o}
                  tone={
                    o === "windows"
                      ? "info"
                      : o === "ubuntu" || o === "fedora"
                        ? "success"
                        : "neutral"
                  }
                  className="text-[10px]"
                >
                  {o}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        key: "params",
        label: "Params",
        width: 100,
        align: "right",
        render: (row) => {
          const n = Object.keys(row.parameters || {}).length;
          return (
            <span className="font-mono text-xs tabular-nums text-fg-muted">
              {n}
            </span>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <Card variant="glass" className="relative">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-accent/15 grid place-items-center shrink-0">
              <Package className="h-5 w-5 text-accent" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-fg">Applications</h1>
              <p className="text-sm text-fg-muted mt-1">
                Install-script catalogue that VMs can pull from when
                provisioning or updating.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              icon={
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
              }
              onClick={refresh}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => router.push("/applications/new")}
            >
              New application
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <Stat
            label="Total"
            value={applications?.length || 0}
            icon={<Package className="h-3.5 w-3.5" />}
          />
          <Stat
            label="Cross-OS"
            value={
              (applications || []).filter((a) => (a.os || []).length > 1)
                .length
            }
          />
          <Stat
            label="Parametrised"
            value={
              (applications || []).filter(
                (a) => Object.keys(a.parameters || {}).length > 0
              ).length
            }
          />
        </div>
      </Card>

      {error && (
        <Alert
          tone="danger"
          title="Couldn't load applications"
          actions={
            <Button
              size="sm"
              onClick={refresh}
              icon={<RefreshCw className="h-4 w-4" />}
            >
              Retry
            </Button>
          }
        >
          {String(error.message || error)}
        </Alert>
      )}

      <Card variant="default" className="!p-4">
        <div className="max-w-md">
          <TextField
            placeholder="Search applications…"
            icon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      {isLoading && !(applications || []).length ? (
        <div className="py-10 flex items-center justify-center gap-3 text-fg-muted">
          <Spinner /> Loading applications…
        </div>
      ) : filtered.length === 0 ? (
        <Card variant="default" className="!p-0">
          <EmptyState
            icon={<Package className="h-10 w-10 text-fg-subtle" />}
            title={
              (applications || []).length ? "No matches" : "No applications yet"
            }
            description={
              (applications || []).length
                ? "No applications match your search."
                : "Register your first application to see it here."
            }
            actions={
              !(applications || []).length ? (
                <Button
                  size="sm"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => router.push("/applications/new")}
                >
                  New application
                </Button>
              ) : null
            }
          />
        </Card>
      ) : (
        <Card variant="default" className="!p-2">
          <DataTable
            rows={filtered}
            columns={columns}
            rowKey={(r) => r.id}
            onRowClick={(row) => router.push(`/applications/${row.id}`)}
          />
        </Card>
      )}
    </div>
  );
};

export default ApplicationsPage;
