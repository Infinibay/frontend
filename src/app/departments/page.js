"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardGrid,
  Button,
  ButtonGroup,
  TextField,
  Dialog,
  Alert,
  EmptyState,
  Spinner,
  Stat,
  Badge,
} from "@infinibay/harbor";
import {
  Building2,
  Search,
  Plus,
  RefreshCw,
  AlertTriangle,
  Trash2,
  ArrowRight,
} from "lucide-react";

import { useDepartmentsPage } from "./hooks/useDepartmentsPage";
import { usePageHeader } from "@/hooks/usePageHeader";

const DepartmentsPage = () => {
  const router = useRouter();
  const {
    isLoading,
    hasError,
    searchQuery,
    isCreateDeptDialogOpen,
    newDepartmentName,
    filteredDepartments,
    useMockData,
    isCreating,
    createError,
    retryLoading,
    setSearchQuery,
    setIsCreateDeptDialogOpen,
    setNewDepartmentName,
    handleCreateDepartment,
    handleDeleteDepartment,
    refreshDepartments,
    getMachineCount,
  } = useDepartmentsPage();

  const [deleteTarget, setDeleteTarget] = useState(null);

  const helpConfig = useMemo(
    () => ({
      title: "Departments",
      description: "Organize your VMs by team, project or function.",
      icon: <Building2 className="h-5 w-5 text-accent-2" />,
      sections: [
        {
          id: "managing",
          title: "Managing departments",
          icon: <Building2 className="h-4 w-4" />,
          content: (
            <p>
              Use <strong>New department</strong> to create an organizational
              unit. Click any card to open its VMs, firewall rules and scripts.
            </p>
          ),
        },
      ],
      quickTips: [
        "Click a card to open a department",
        "Each department has its own firewall rules and scripts",
        "Use the search box to narrow a long list",
      ],
    }),
    []
  );

  usePageHeader(
    {
      breadcrumbs: [
        { label: "Home", href: "/" },
        { label: "Departments", isCurrent: true },
      ],
      title: "Departments",
      actions: [],
      helpConfig,
      helpTooltip: "Departments help",
    },
    []
  );

  const totalDepartments = filteredDepartments?.length || 0;
  const totalMachines = useMemo(
    () =>
      (filteredDepartments || []).reduce(
        (acc, d) => acc + (getMachineCount(d.name) || 0),
        0
      ),
    [filteredDepartments, getMachineCount]
  );

  const submitDelete = async () => {
    if (!deleteTarget) return;
    await handleDeleteDepartment(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (hasError) {
    return (
      <Alert
        tone="danger"
        title="Couldn't load departments"
        actions={
          <Button size="sm" onClick={retryLoading} icon={<RefreshCw className="h-4 w-4" />}>
            Retry
          </Button>
        }
      >
        The departments API is unreachable. Check the backend service or retry.
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {useMockData && (
        <Alert
          tone="warning"
          title="Using mock data"
          actions={
            <Button size="sm" onClick={retryLoading} icon={<RefreshCw className="h-4 w-4" />}>
              Retry
            </Button>
          }
        >
          Could not connect to the departments API. Showing mock data.
        </Alert>
      )}

      {/* Hero + actions */}
      <Card variant="glass" className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-fg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-accent-2" />
              Departments
            </h1>
            <p className="text-sm text-fg-muted mt-1">
              Organize VMs by team, project or function.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />}
              onClick={refreshDepartments}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setIsCreateDeptDialogOpen(true)}
            >
              New department
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <Stat label="Departments" value={totalDepartments} icon={<Building2 className="h-3.5 w-3.5" />} />
          <Stat label="Virtual machines" value={totalMachines} />
        </div>
      </Card>

      {/* Search */}
      <Card variant="default" className="p-4">
        <div className="max-w-md">
          <TextField
            placeholder="Search departments…"
            icon={<Search className="h-4 w-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {/* Grid */}
      {isLoading && filteredDepartments.length === 0 ? (
        <div className="py-10 flex items-center justify-center gap-3 text-fg-muted">
          <Spinner /> Loading departments…
        </div>
      ) : filteredDepartments.length === 0 ? (
        <Card variant="default" className="p-0">
          <EmptyState
            icon={<Building2 className="h-10 w-10 text-fg-subtle" />}
            title={searchQuery ? "No matches" : "No departments yet"}
            description={
              searchQuery
                ? "No departments match your search."
                : "Create a department to start organizing VMs."
            }
            actions={
              !searchQuery ? (
                <Button
                  size="sm"
                  icon={<Plus className="h-4 w-4" />}
                  onClick={() => setIsCreateDeptDialogOpen(true)}
                >
                  New department
                </Button>
              ) : null
            }
          />
        </Card>
      ) : (
        <CardGrid cols={3}>
          {filteredDepartments.map((dept) => {
            const count = getMachineCount(dept.name);
            return (
              <Card
                key={dept.id}
                variant="solid"
                interactive
                spotlight
                glow
                className="p-5 flex flex-col gap-3 cursor-pointer"
                onClick={() => router.push(`/departments/${encodeURIComponent(dept.name)}`)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-accent/15 grid place-items-center shrink-0">
                      <Building2 className="h-5 w-5 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-fg truncate">{dept.name}</h3>
                      <p className="text-xs text-fg-muted mt-0.5">
                        {count === 0 ? "No VMs" : count === 1 ? "1 VM" : `${count} VMs`}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(dept);
                    }}
                    className="p-1.5 rounded-lg text-fg-subtle hover:text-danger hover:bg-danger/10 transition-colors"
                    aria-label="Delete department"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/5">
                  <Badge tone="neutral">{dept.id?.slice(0, 6) || ""}</Badge>
                  <div className="ml-auto flex items-center text-xs text-accent-2 gap-1">
                    Open <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Card>
            );
          })}
        </CardGrid>
      )}

      {/* Create dialog */}
      <Dialog
        open={isCreateDeptDialogOpen}
        onClose={() => {
          setNewDepartmentName("");
          setIsCreateDeptDialogOpen(false);
        }}
        size="sm"
        title={
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-accent-2" />
            New department
          </span>
        }
        description="Create an organizational unit to group VMs, firewall rules and scripts."
        footer={
          <ButtonGroup className="justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setNewDepartmentName("");
                setIsCreateDeptDialogOpen(false);
              }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateDepartment}
              loading={isCreating}
              disabled={isCreating || !newDepartmentName.trim()}
            >
              Create
            </Button>
          </ButtonGroup>
        }
      >
        <div className="space-y-3">
          <TextField
            label="Name"
            placeholder="Engineering"
            value={newDepartmentName}
            onChange={(e) => setNewDepartmentName(e.target.value)}
            autoFocus
          />
          {createError && <Alert tone="danger">{createError}</Alert>}
        </div>
      </Dialog>

      {/* Delete dialog */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        size="sm"
        title={
          <span className="flex items-center gap-2 text-danger">
            <AlertTriangle className="h-4 w-4" />
            Delete department
          </span>
        }
        description={
          deleteTarget
            ? `Remove ${deleteTarget.name}? Its VMs will need to be reassigned to another department.`
            : ""
        }
        footer={
          <ButtonGroup className="justify-end">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={submitDelete}>
              Delete
            </Button>
          </ButtonGroup>
        }
      >
        <p className="text-sm text-fg-muted">
          This action cannot be undone.
        </p>
      </Dialog>
    </div>
  );
};

export default DepartmentsPage;
