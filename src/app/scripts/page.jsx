"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FileCode,
  Search,
  Plus,
  Trash2,
  Pencil,
  Download,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  Button,
  ButtonGroup,
  Badge,
  TextField,
  Select,
  Alert,
  EmptyState,
  Spinner,
  Dialog,
  DataTable,
  Stat,
  SegmentedControl,
} from "@infinibay/harbor";

import { useScriptsQuery, useDeleteScriptMutation } from "@/gql/hooks";
import { usePageHeader } from "@/hooks/usePageHeader";

const OS_FILTER_OPTIONS = [
  { value: "all", label: "All OS" },
  { value: "windows", label: "Windows" },
  { value: "linux", label: "Linux" },
];

const CATEGORY_FILTER_OPTIONS = [
  { value: "all", label: "All categories" },
  { value: "maintenance", label: "Maintenance" },
  { value: "security", label: "Security" },
  { value: "configuration", label: "Configuration" },
  { value: "monitoring", label: "Monitoring" },
];

export default function ScriptsPage() {
  const router = useRouter();

  const { data, loading, error, refetch } = useScriptsQuery();
  const [deleteScript, { loading: deleting }] = useDeleteScriptMutation();

  const [search, setSearch] = useState("");
  const [osFilter, setOsFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const scripts = data?.scripts || [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return scripts.filter((s) => {
      if (
        q &&
        !(
          s.name?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.tags?.some((t) => t.toLowerCase().includes(q))
        )
      )
        return false;
      if (osFilter !== "all" && !s.os?.includes(osFilter)) return false;
      if (categoryFilter !== "all" && s.category !== categoryFilter) return false;
      return true;
    });
  }, [scripts, search, osFilter, categoryFilter]);

  const stats = useMemo(
    () => ({
      total: scripts.length,
      windows: scripts.filter((s) => s.os?.includes("windows")).length,
      linux: scripts.filter((s) => s.os?.includes("linux")).length,
      scheduled: scripts.filter((s) => (s.scheduleCount || 0) > 0).length,
    }),
    [scripts]
  );

  const helpConfig = useMemo(
    () => ({
      title: "Scripts library",
      description: "Automation scripts that can run on any VM or be scheduled.",
      icon: <FileCode className="h-5 w-5 text-accent-2" />,
      sections: [
        {
          id: "create",
          title: "Creating scripts",
          icon: <FileCode className="h-4 w-4" />,
          content: (
            <p>
              Click <strong>New script</strong> to open the editor where you
              define metadata, inputs and the script body. Content is validated
              before saving.
            </p>
          ),
        },
        {
          id: "filter",
          title: "Filtering",
          icon: <Search className="h-4 w-4" />,
          content: (
            <p>
              Search by name / description / tags. The chip filters narrow by
              OS and category. Everything updates live as you type.
            </p>
          ),
        },
      ],
      quickTips: [
        "Click any row to open the editor",
        "Schedules cancel automatically when a script is deleted",
        "Tags help group related scripts across categories",
      ],
    }),
    []
  );

  usePageHeader(
    {
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Scripts", isCurrent: true },
      ],
      title: "Scripts",
      actions: [],
      helpConfig,
      helpTooltip: "Scripts help",
    },
    []
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteScript({ variables: { id: deleteTarget.id, force: false } });
      toast.success(`Deleted "${deleteTarget.name}"`);
      setDeleteTarget(null);
      await refetch();
    } catch (err) {
      // If there are active schedules, surface a force retry
      if (/schedule/i.test(err.message || "")) {
        const confirmForce = window.confirm(
          `"${deleteTarget.name}" has active schedules. Delete anyway and cancel them?`
        );
        if (confirmForce) {
          try {
            await deleteScript({
              variables: { id: deleteTarget.id, force: true },
            });
            toast.success("Script deleted and schedules cancelled");
            setDeleteTarget(null);
            await refetch();
          } catch (e2) {
            toast.error(`Could not delete: ${e2.message}`);
          }
          return;
        }
      }
      toast.error(`Could not delete: ${err.message}`);
    }
  };

  const handleBulkDelete = async () => {
    if (!selected.length) return;
    const names = selected
      .map((id) => scripts.find((s) => s.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3)
      .join(", ");
    if (
      !window.confirm(
        `Delete ${selected.length} script${selected.length !== 1 ? "s" : ""}${
          names ? ` (${names}${selected.length > 3 ? ", …" : ""})` : ""
        }? Active schedules will be cancelled.`
      )
    )
      return;
    try {
      await Promise.all(
        selected.map((id) =>
          deleteScript({ variables: { id, force: true } })
        )
      );
      toast.success(`Deleted ${selected.length} scripts`);
      setSelected([]);
      await refetch();
    } catch (err) {
      toast.error(`Bulk delete failed: ${err.message}`);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Script",
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-3 min-w-0">
            <span className="h-8 w-8 rounded-md bg-accent-2/15 text-accent-2 grid place-items-center shrink-0">
              <FileCode className="h-4 w-4" />
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
        key: "category",
        label: "Category",
        width: 130,
        sortable: true,
        render: (row) =>
          row.category ? (
            <Badge tone="neutral" className="capitalize">
              {row.category.toLowerCase()}
            </Badge>
          ) : (
            <span className="text-fg-subtle text-xs">—</span>
          ),
      },
      {
        key: "os",
        label: "OS",
        width: 150,
        render: (row) =>
          (row.os || []).length ? (
            <div className="flex items-center gap-1 flex-wrap">
              {row.os.map((o) => (
                <Badge
                  key={o}
                  tone={o === "windows" ? "info" : o === "linux" ? "success" : "neutral"}
                  className="text-[10px]"
                >
                  {o}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-fg-subtle text-xs">—</span>
          ),
      },
      {
        key: "tags",
        label: "Tags",
        render: (row) =>
          (row.tags || []).length ? (
            <div className="flex items-center gap-1 flex-wrap">
              {(row.tags || []).slice(0, 3).map((t) => (
                <Badge
                  key={t}
                  tone="purple"
                  className="text-[10px]"
                >
                  {t}
                </Badge>
              ))}
              {(row.tags || []).length > 3 ? (
                <span className="text-[10px] text-fg-subtle">
                  +{row.tags.length - 3}
                </span>
              ) : null}
            </div>
          ) : (
            <span className="text-fg-subtle text-xs">—</span>
          ),
      },
      {
        key: "actions",
        label: "",
        width: 110,
        align: "right",
        render: (row) => (
          <div
            className="flex items-center justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="sm"
              variant="ghost"
              icon={<Pencil className="h-3.5 w-3.5" />}
              onClick={() => router.push(`/scripts/${row.id}`)}
              aria-label="Edit"
            >
              {""}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              icon={<Trash2 className="h-3.5 w-3.5" />}
              onClick={() => setDeleteTarget(row)}
              aria-label="Delete"
            >
              {""}
            </Button>
          </div>
        ),
      },
    ],
    [router]
  );

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card variant="glass" className="relative">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-accent-2/15 grid place-items-center shrink-0">
              <FileCode className="h-5 w-5 text-accent-2" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-fg">Scripts</h1>
              <p className="text-sm text-fg-muted mt-1">
                Reusable automation that can run on any VM, department-wide
                or on a schedule.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />}
              onClick={refetch}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Download className="h-4 w-4" />}
              disabled
              title="Import coming soon"
            >
              Import
            </Button>
            <Button
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => router.push("/scripts/new")}
            >
              New script
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <Stat label="Total" value={stats.total} icon={<FileCode className="h-3.5 w-3.5" />} />
          <Stat label="Windows" value={stats.windows} />
          <Stat label="Linux" value={stats.linux} />
          <Stat label="Scheduled" value={stats.scheduled} />
        </div>
      </Card>

      {error && (
        <Alert
          tone="danger"
          title="Couldn't load scripts"
          actions={
            <Button size="sm" onClick={refetch} icon={<RefreshCw className="h-4 w-4" />}>
              Retry
            </Button>
          }
        >
          {String(error.message || error)}
        </Alert>
      )}

      {/* Filters */}
      <Card variant="default" className="!p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="md:w-80">
            <TextField
              placeholder="Search name, description, tags…"
              icon={<Search className="h-4 w-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <SegmentedControl
            items={OS_FILTER_OPTIONS}
            value={osFilter}
            onChange={setOsFilter}
            size="sm"
          />
          <div className="md:w-56">
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={CATEGORY_FILTER_OPTIONS}
            />
          </div>

          <div className="md:ml-auto flex items-center gap-2">
            {selected.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                icon={<Trash2 className="h-4 w-4" />}
                onClick={handleBulkDelete}
              >
                Delete {selected.length}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* List */}
      {loading && scripts.length === 0 ? (
        <div className="py-10 flex items-center justify-center gap-3 text-fg-muted">
          <Spinner /> Loading scripts…
        </div>
      ) : filtered.length === 0 ? (
        <Card variant="default" className="!p-0">
          <EmptyState
            icon={<FileCode className="h-10 w-10 text-fg-subtle" />}
            title={scripts.length ? "No matches" : "No scripts yet"}
            description={
              scripts.length
                ? "No scripts match the current search or filters."
                : "Create your first automation script to see it here."
            }
            actions={
              scripts.length === 0 ? (
                <Button
                  size="sm"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => router.push("/scripts/new")}
                >
                  New script
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
            selectable
            selected={selected}
            onSelectionChange={setSelected}
            onRowClick={(row) => router.push(`/scripts/${row.id}`)}
          />
        </Card>
      )}

      {/* Single delete confirmation */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        size="sm"
        title={
          <span className="flex items-center gap-2 text-danger">
            <AlertCircle className="h-4 w-4" />
            Delete script
          </span>
        }
        description={
          deleteTarget
            ? `Remove "${deleteTarget.name}"? Any active schedules will be cancelled.`
            : ""
        }
        footer={
          <ButtonGroup className="justify-end">
            <Button
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              loading={deleting}
              disabled={deleting}
            >
              Delete
            </Button>
          </ButtonGroup>
        }
      >
        <p className="text-sm text-fg-muted">
          Existing execution history is kept. The script body and its
          schedules are removed for good.
        </p>
      </Dialog>
    </div>
  );
}
