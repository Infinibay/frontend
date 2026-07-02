"use client";

import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Package,
  Search,
  Settings,
  Plus,
  RefreshCw,
  AppWindow,
  ExternalLink,
  Trash2 } from
"lucide-react";
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
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons } from
"@infinibay/harbor";
import { PageHeader } from "@/components/common/PageHeader";
import { OsBadge } from "@/components/common/OsBadge";
import { RowContextMenu } from "@/components/common/RowContextMenu";

import { fetchApplications, deleteApplication } from "@/state/slices/applications";
import useEnsureData, { LOADING_STRATEGIES } from "@/hooks/useEnsureData";
import { usePageHeader } from "@/hooks/usePageHeader";
import { toast } from "@/hooks/use-toast";
import { createDebugger } from "@/utils/debug";

const debug = createDebugger("frontend:pages:applications");

const ApplicationsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    data: applications,
    isLoading,
    error,
    refresh
  } = useEnsureData("applications", fetchApplications, {
    strategy: LOADING_STRATEGIES.BACKGROUND,
    ttl: 5 * 60 * 1000
  });

  // Row targeted for deletion (drives the confirm dialog); null when closed.
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await dispatch(deleteApplication({ id: pendingDelete.id })).unwrap();
      toast({
        variant: "success",
        title: "Application deleted",
        description: `"${pendingDelete.name}" was removed from the catalogue.`
      });
      setPendingDelete(null);
    } catch (err) {
      // Keep the dialog open so the user can retry or cancel.
      toast({
        variant: "error",
        title: "Could not delete application",
        description: String(err?.message || err)
      });
    } finally {
      setDeleting(false);
    }
  }, [dispatch, pendingDelete]);

  debug.info("Applications list state:", {
    count: applications?.length || 0,
    loading: isLoading,
    hasError: !!error
  });

  const handleSearch = useCallback(
    (query) => {
      const list = applications || [];
      const q = query.trim().toLowerCase();
      if (!q) return [];
      return list.
      filter(
        (a) =>
        a.name?.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q)
      ).
      map((a) => ({
        id: a.id,
        title: a.name,
        subtitle: a.description || undefined
      }));
    },
    [applications]
  );

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
        content:
        <p>
              Click <strong>New application</strong> to register one. Each
              app defines a name, description, parameter schema and a
              Windows / Ubuntu / Fedora install script.
            </p>

      },
      {
        id: "details",
        title: "Editing",
        icon: <Settings size={16} />,
        content:
        <p>
              Click a row to open its detail view where the scripts and
              parameter list can be updated.
            </p>

      },
      {
        id: "search",
        title: "Searching",
        icon: <Search size={16} />,
        content: <p>Search matches name and description live.</p>
      }],

      quickTips: [
      "Click any row to edit the application",
      "Use the refresh button after creating via CLI"]

    }),
    []
  );

  usePageHeader(
    {
      breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Applications", isCurrent: true }],

      title: "Applications",
      actions: [],
      helpConfig,
      helpTooltip: "Applications help"
    },
    []
  );

  const columns = useMemo(
    () => [
    {
      id: "name",
      header: "Application",
      sortable: true,
      cell: ({ row }) =>
      <div className="flex items-center gap-3 min-w-0">
            {row.icon ?
        <span className="inline-flex w-6 h-6 rounded bg-white/5 border border-white/10 items-center justify-center overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
            src={row.icon}
            alt=""
            width={16}
            height={16}
            style={{ display: "block", objectFit: "contain" }} />
          
              </span> :

        <IconTile icon={<AppWindow size={14} />} tone="purple" size="sm" />
        }
            <span className="font-medium truncate">{row.name}</span>
          </div>

    },
    {
      id: "description",
      header: "Description",
      cell: ({ row }) =>
      <span className="text-fg-muted text-xs line-clamp-1">
            {row.description || "—"}
          </span>

    },
    {
      id: "os",
      header: "OS",
      cell: ({ row }) => {
        const oss = row.os || [];
        if (!oss.length)
        return <span className="text-fg-subtle">—</span>;
        return (
          <div className="flex items-center gap-1 flex-nowrap">
              {oss.map((o) =>
            <OsBadge key={o} os={o} />
            )}
            </div>);

      }
    },
    {
      id: "params",
      header: "Params",
      width: 80,
      align: "right",
      cell: ({ row }) => {
        const n = Object.keys(row.parameters || {}).length;
        return <span style={{ fontFamily: "monospace" }}>{n}</span>;
      }
    }],

    []
  );

  const total = applications?.length || 0;
  const crossOs = (applications || []).filter((a) => (a.os || []).length > 1).length;
  const parametrised = (applications || []).filter(
    (a) => Object.keys(a.parameters || {}).length > 0
  ).length;

  const countText = total === 0 ?
  null :
  [
  `${total}`,
  crossOs > 0 ? `${crossOs} cross-OS` : null,
  parametrised > 0 ? `${parametrised} parameterised` : null].
  filter(Boolean).join(" · ");

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
          disabled={isLoading} />

        }
        primary={
        <Tooltip content="New Application">
            <span>
              <Button
              size="sm"
              variant="primary"
              icon={<Plus size={14} />}
              onClick={() => router.push("/applications/new")}>
              
                New Application
              </Button>
            </span>
          </Tooltip>
        }
        filters={
        <SearchField
          placeholder="Search applications…"
          onSearch={handleSearch}
          onPick={(r) => router.push(`/applications/${r.id}`)} />

        } />
      

      {error &&
      <Alert
        tone="danger"
        title="Couldn't load applications"
        actions={
        <Button size="sm" onClick={refresh} icon={<RefreshCw size={16} />}>
              Retry
            </Button>
        }>
        
          {String(error.message || error)}
        </Alert>
      }

      {isLoading && !(applications || []).length ?
      <ResponsiveStack direction="row" gap={3} justify="center" align="center">
          <Spinner /> Loading applications…
        </ResponsiveStack> :
      (applications || []).length === 0 ?
      <EmptyState
        icon={<Package size={18} />}
        title="No applications yet"
        description="Register your first application to see it here."
        actions={
        <Tooltip content="New Application">
                <span>
                  <Button
              size="sm"
              variant="primary"
              icon={<Plus size={14} />}
              onClick={() => router.push("/applications/new")}>

                    New Application
                  </Button>
                </span>
              </Tooltip>
        } /> :


      <RowContextMenu
        rows={applications || []}
        labelFor={(r) => r.name}
        buildItems={(r) => [
        {
          label: "Open",
          icon: <ExternalLink size={14} />,
          onSelect: () => router.push(`/applications/${r.id}`)
        },
        {
          label: "Delete",
          icon: <Trash2 size={14} />,
          danger: true,
          onSelect: () => setPendingDelete(r)
        }]
        }>

          <DataTable
          rows={applications || []}
          columns={columns}
          rowId={(r) => r.id}
          onRowClick={(row) => router.push(`/applications/${row.id}`)}
          defaultDensity="compact" />
        
        </RowContextMenu>
      }

      <Dialog
        open={!!pendingDelete}
        onClose={() => !deleting && setPendingDelete(null)}
        size="sm">

        <DialogTitle>
          <ResponsiveStack direction="row" gap={2} align="center">
            <Trash2 size={16} />
            Delete application
          </ResponsiveStack>
        </DialogTitle>
        <DialogDescription>
          Permanently delete “{pendingDelete?.name}”?
        </DialogDescription>
        <DialogBody>
          <p className="text-sm text-fg-muted">
            This removes the application catalogue entry and its install
            scripts. Desktops will no longer be able to pull it. This action
            cannot be undone.
          </p>
        </DialogBody>
        <DialogButtons align="end">
          <Button
            variant="secondary"
            type="button"
            onClick={() => setPendingDelete(null)}
            disabled={deleting}>

            Cancel
          </Button>
          <Button
            variant="destructive"
            type="button"
            icon={<Trash2 size={16} />}
            onClick={handleDelete}
            loading={deleting}
            disabled={deleting}>

            Delete
          </Button>
        </DialogButtons>
      </Dialog>
    </Page>);

};

export default ApplicationsPage;
