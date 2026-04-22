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
  Page,
  Card,
  Button,
  Badge,
  SearchField,
  Alert,
  EmptyState,
  Spinner,
  DataTable,
  Stat,
  IconTile,
  ResponsiveStack,
  ResponsiveGrid,
  Tooltip,
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
      icon: <Package size={20} />,
      sections: [
        {
          id: "creating",
          title: "Creating applications",
          icon: <Package size={16} />,
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
          icon: <Settings size={16} />,
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
          icon: <Search size={16} />,
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
          <ResponsiveStack direction="row" gap={3} align="center">
            <IconTile icon={<AppWindow size={16} />} tone="purple" size="sm" />
            <ResponsiveStack direction="col" gap={0}>
              <span>{row.name}</span>
              {row.description ? (
                <span style={{ fontSize: 12, opacity: 0.65 }}>
                  {row.description}
                </span>
              ) : null}
            </ResponsiveStack>
          </ResponsiveStack>
        ),
      },
      {
        key: "os",
        label: "OS",
        width: 220,
        render: (row) => {
          const oss = row.os || [];
          if (!oss.length) return <span style={{ opacity: 0.4 }}>—</span>;
          return (
            <ResponsiveStack direction="row" gap={1} wrap>
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
                >
                  {o}
                </Badge>
              ))}
            </ResponsiveStack>
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
          return <span style={{ fontFamily: "monospace" }}>{n}</span>;
        },
      },
    ],
    []
  );

  return (
    <Page gap="lg">
      <Card
        variant="default"
        leadingIcon={<Package size={20} />}
        leadingIconTone="purple"
        title="Applications"
        description="Install-script catalogue that VMs can pull from when provisioning or updating."
      >
        <ResponsiveStack
          direction={{ base: "col", lg: "row" }}
          gap={4}
          justify="between"
          align="stretch"
        >
          <ResponsiveGrid columns={3} gap={3}>
            <Stat
              label="Total"
              value={applications?.length || 0}
              icon={<Package size={14} />}
              variant="plain"
            />
            <Stat
              label="Cross-OS"
              value={
                (applications || []).filter((a) => (a.os || []).length > 1)
                  .length
              }
              variant="plain"
            />
            <Stat
              label="Parametrised"
              value={
                (applications || []).filter(
                  (a) => Object.keys(a.parameters || {}).length > 0
                ).length
              }
              variant="plain"
            />
          </ResponsiveGrid>

          <ResponsiveStack direction="row" gap={2} align="center">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw size={16} />}
              onClick={refresh}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Tooltip content="New application">
              <span>
                <Button
                  size="sm"
                  variant="primary"
                  icon={<Plus size={14} />}
                  onClick={() => router.push("/applications/new")}
                >
                  New
                </Button>
              </span>
            </Tooltip>
          </ResponsiveStack>
        </ResponsiveStack>
      </Card>

      {error && (
        <Alert
          tone="danger"
          title="Couldn't load applications"
          actions={
            <Button
              size="sm"
              onClick={refresh}
              icon={<RefreshCw size={16} />}
            >
              Retry
            </Button>
          }
        >
          {String(error.message || error)}
        </Alert>
      )}

      <Card variant="default">
        <SearchField
          placeholder="Search applications…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {isLoading && !(applications || []).length ? (
        <Card variant="default">
          <ResponsiveStack direction="row" gap={3} justify="center" align="center">
            <Spinner /> Loading applications…
          </ResponsiveStack>
        </Card>
      ) : filtered.length === 0 ? (
        <Card variant="default">
          <EmptyState
            icon={<Package size={40} />}
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
                <Tooltip content="New application">
                  <span>
                    <Button
                      size="sm"
                      variant="primary"
                      icon={<Plus size={14} />}
                      onClick={() => router.push("/applications/new")}
                    >
                      New
                    </Button>
                  </span>
                </Tooltip>
              ) : null
            }
          />
        </Card>
      ) : (
        <Card variant="default">
          <DataTable
            rows={filtered}
            columns={columns}
            rowKey={(r) => r.id}
            onRowClick={(row) => router.push(`/applications/${row.id}`)}
          />
        </Card>
      )}
    </Page>
  );
};

export default ApplicationsPage;
