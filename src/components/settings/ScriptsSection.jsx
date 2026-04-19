"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FileCode,
  Plus,
  Upload,
  ArrowRight,
  Trash2,
  Monitor,
  Server,
  Clock,
} from "lucide-react";
import {
  Button,
  Badge,
  TextField,
  Dialog,
  EmptyState,
  Spinner,
  Alert,
} from "@infinibay/harbor";

import {
  useScriptsQuery,
  useDeleteScriptMutation,
  useCreateScriptMutation,
} from "@/gql/hooks";

const OS_ICON = {
  windows: Monitor,
  linux: Server,
};

function relativeTime(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
}

export default function ScriptsSection({ embedded = false, className = "" }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  const { data, loading, refetch } = useScriptsQuery();
  const [deleteScript, { loading: deleting }] = useDeleteScriptMutation();
  const [createScript] = useCreateScriptMutation();

  const scripts = data?.scripts || [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return scripts;
    return scripts.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
    );
  }, [scripts, search]);

  const visible = embedded ? filtered.slice(0, 6) : filtered;

  const handleImport = async (files) => {
    if (!files?.length) return;
    setImporting(true);
    let ok = 0;
    let failed = 0;
    for (const file of files) {
      try {
        const content = await file.text();
        const format = file.name.endsWith(".json") ? "json" : "yaml";
        await createScript({
          variables: {
            input: {
              content,
              format,
              name: file.name.replace(/\.(yaml|yml|json)$/, ""),
            },
          },
        });
        ok++;
      } catch (err) {
        console.error("Import failed", err);
        failed++;
      }
    }
    if (ok) toast.success(`Imported ${ok} script${ok > 1 ? "s" : ""}`);
    if (failed) toast.error(`Failed to import ${failed} script${failed > 1 ? "s" : ""}`);
    setImporting(false);
    if (ok) refetch();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteScript({ variables: { id: deleteTarget.id, force: true } });
      toast.success("Script deleted");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".yaml,.yml,.json"
        multiple
        className="hidden"
        onChange={(e) => {
          handleImport(Array.from(e.target.files || []));
          e.target.value = "";
        }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <FileCode className="h-4 w-4 text-accent-2" />
          <span className="text-sm text-fg-muted">
            {scripts.length} script{scripts.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!embedded && (
            <div className="max-w-xs">
              <TextField
                placeholder="Search scripts…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
          <Button
            size="sm"
            variant="secondary"
            icon={<Upload className="h-3.5 w-3.5" />}
            onClick={() => fileInputRef.current?.click()}
            loading={importing}
            disabled={importing}
          >
            Import
          </Button>
          <Button
            size="sm"
            icon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => router.push("/scripts/new")}
          >
            New script
          </Button>
        </div>
      </div>

      {loading && scripts.length === 0 ? (
        <div className="py-10 flex items-center justify-center gap-3 text-fg-muted">
          <Spinner /> Loading scripts…
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<FileCode className="h-10 w-10 text-fg-subtle" />}
          title={scripts.length ? "No matches" : "No scripts yet"}
          description={
            scripts.length
              ? "No scripts match your search."
              : "Create your first script to see it here."
          }
          actions={
            <Button
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => router.push("/scripts/new")}
            >
              New script
            </Button>
          }
        />
      ) : (
        <div className="space-y-1.5">
          {visible.map((script) => {
            const os = (script.os || []).map((o) => String(o).toLowerCase());
            return (
              <div
                key={script.id}
                className="group flex items-center gap-3 rounded-lg border border-white/8 bg-surface-1 p-3 hover:border-white/20 hover:bg-white/[0.04] transition-colors cursor-pointer"
                onClick={() => router.push(`/scripts/${script.id}`)}
              >
                <span className="h-8 w-8 rounded-md bg-accent-2/15 text-accent-2 grid place-items-center shrink-0">
                  <FileCode className="h-4 w-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-fg truncate">
                      {script.name}
                    </div>
                    {os.map((o) => {
                      const Icon = OS_ICON[o] || Server;
                      return (
                        <Badge
                          key={o}
                          tone={o === "windows" ? "info" : "success"}
                          className="text-[10px] gap-0.5"
                        >
                          <Icon className="h-2.5 w-2.5" />
                          {o}
                        </Badge>
                      );
                    })}
                    {script.category && (
                      <Badge tone="neutral" className="text-[10px]">
                        {script.category}
                      </Badge>
                    )}
                  </div>
                  {script.description && (
                    <div className="text-xs text-fg-muted truncate mt-0.5">
                      {script.description}
                    </div>
                  )}
                </div>
                {script.updatedAt && (
                  <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-fg-subtle shrink-0">
                    <Clock className="h-3 w-3" />
                    {relativeTime(script.updatedAt)}
                  </span>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  icon={<Trash2 className="h-3.5 w-3.5" />}
                  aria-label="Delete script"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget({ id: script.id, name: script.name });
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {""}
                </Button>
              </div>
            );
          })}

          {embedded && filtered.length > 6 && (
            <div className="pt-2 flex justify-end">
              <Button
                size="sm"
                variant="ghost"
                icon={<ArrowRight className="h-3.5 w-3.5" />}
                onClick={() => router.push("/scripts")}
              >
                View all {filtered.length}
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        size="sm"
        title="Delete script?"
        footer={
          <>
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
          </>
        }
      >
        <Alert tone="danger" className="mb-3">
          This will permanently remove <strong>{deleteTarget?.name}</strong> and
          cancel any active schedules attached to it.
        </Alert>
        <p className="text-sm text-fg-muted">
          Execution logs and audit trail for this script will also be deleted.
          This cannot be undone.
        </p>
      </Dialog>
    </div>
  );
}
