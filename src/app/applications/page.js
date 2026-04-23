"use client";

import { useMemo, useState } from "react";
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
  Button,
  IconButton,
  SearchField,
  Alert,
  EmptyState,
  Spinner,
  DataTable,
  IconTile,
  ResponsiveStack,
  Tooltip,
} from "@infinibay/harbor";
import { PageHeader } from "@/components/common/PageHeader";
import { OsBadge } from "@/components/common/OsBadge";

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
      description: "Per-OS install scripts that desktops can pull on demand.",
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
            {row.icon ? (
              <span className="inline-flex w-7 h-7 rounded-md bg-white/5 border border-white/10 items-center justify-center overflow-hidden shrink-0">
                <img
                  src={row.icon}
                  alt=""
                  width={20}
                  height={20}
                  style={{ display: "block", objectFit: "contain" }}
                />
              </span>
            ) : (
              <IconTile icon={<AppWindow size={16} />} tone="purple" size="sm" />
            )}
            <ResponsiveStack direction="col" gap={0}>
              <span className="font-medium">{row.name}</span>
              {row.description ? (
                <span className="text-fg-muted text-xs truncate">
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
        width: 260,
        render: (row) => {
          const oss = row.os || [];
          if (!oss.length)
            return <span className="text-fg-subtle">—</span>;
          return (
            <ResponsiveStack direction="row" gap={1} wrap>
              {oss.map((o) => (
                <OsBadge key={o} os={o} />
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

  const total = applications?.length || 0;
  const crossOs = (applications || []).filter((a) => (a.os || []).length > 1).length;
  const parametrised = (applications || []).filter(
    (a) => Object.keys(a.parameters || {}).length > 0
  ).length;

  const countText = total === 0
    ? null
    : [
        `${total}`,
        crossOs > 0 ? `${crossOs} cross-OS` : null,
        parametrised > 0 ? `${parametrised} parameterised` : null,
      ].filter(Boolean).join(" · ");

  return (
    <Page gap="lg">
      <PageHeader
        title="Applications"
        count={countText}
        secondary={
          <IconButton
            size="sm"
            variant="ghost"
            label="Refresh"
            icon={<RefreshCw size={14} />}
            onClick={refresh}
            disabled={isLoading}
          />
        }
        primary={
          <Tooltip content="New Application">
            <span>
              <Button
                size="sm"
                variant="primary"
                icon={<Plus size={14} />}
                onClick={() => router.push("/applications/new")}
              >
                New Application
              </Button>
            </span>
          </Tooltip>
        }
        filters={
          <SearchField
            placeholder="Search applications…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
      />

      {error && (
        <Alert
          tone="danger"
          title="Couldn't load applications"
          actions={
            <Button size="sm" onClick={refresh} icon={<RefreshCw size={16} />}>
              Retry
            </Button>
          }
        >
          {String(error.message || error)}
        </Alert>
      )}

      {isLoading && !(applications || []).length ? (
        <ResponsiveStack direction="row" gap={3} justify="center" align="center">
          <Spinner /> Loading applications…
        </ResponsiveStack>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Package size={18} />}
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
              <Tooltip content="New Application">
                <span>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={<Plus size={14} />}
                    onClick={() => router.push("/applications/new")}
                  >
                    New Application
                  </Button>
                </span>
              </Tooltip>
            ) : null
          }
        />
      ) : (
        <DataTable
          rows={filtered}
          columns={columns}
          rowKey={(r) => r.id}
          onRowClick={(row) => router.push(`/applications/${row.id}`)}
        />
      )}
    </Page>
  );
};

export default ApplicationsPage;
