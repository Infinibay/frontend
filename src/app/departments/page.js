'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
  Alert,
  Button,
  DataTable,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
  EmptyState,
  IconButton,
  LoadingOverlay,
  Page,
  ResponsiveStack,
  TextField,
  Tooltip } from
'@infinibay/harbor';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusChip } from '@/components/common/StatusChip';
import {
  AlertTriangle,
  Building2,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  Trash2 } from
'lucide-react';
import { RowContextMenu } from '@/components/common/RowContextMenu';

import { useDepartmentsPage } from './hooks/useDepartmentsPage';
import { usePageHeader } from '@/hooks/usePageHeader';
import { usePermissions } from '@/hooks/usePermissions';

// Deterministic tone per department name so each card has its own accent
// without random flicker on re-renders. Harbor supports these tones.
const DepartmentsPage = () => {
  const router = useRouter();
  const {
    isLoading,
    hasFatalError,
    vmsError,
    searchQuery,
    isCreateDeptDialogOpen,
    newDepartmentName,
    filteredDepartments,
    isCreating,
    createError,
    retryLoading,
    setSearchQuery,
    setIsCreateDeptDialogOpen,
    setNewDepartmentName,
    handleCreateDepartment,
    handleDeleteDepartment,
    refreshDepartments,
    getMachineCount
  } = useDepartmentsPage();

  const vms = useSelector((state) => state.vms?.items || []);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Track WHICH vms error the operator dismissed (by message) rather than a bare
  // boolean, so a later/different desktop-load failure surfaces a fresh warning
  // instead of being permanently silenced.
  const [dismissedVmsError, setDismissedVmsError] = useState(null);
  const showVmsWarning = !!vmsError && vmsError !== dismissedVmsError;

  // Action-level RBAC: stay optimistic while grants load to avoid a
  // disabled→enabled flicker, then gate the CRUD write surfaces.
  const { can, isLoading: permsLoading } = usePermissions();
  const canCreate = permsLoading || can('department:create');
  const canDelete = permsLoading || can('department:delete');

  const helpConfig = useMemo(
    () => ({
      title: 'Departments',
      description: 'Organize your desktops by team, project or function.',
      icon: <Building2 size={14} />,
      sections: [
      {
        id: 'managing',
        title: 'Managing departments',
        icon: <Building2 size={14} />,
        content:
        'Use "New Department" to create an organizational unit. Click any card to open its desktops, firewall rules and scripts.'
      }],

      quickTips: [
      'Click a card to open a department',
      'Each department has its own firewall rules and scripts',
      'Use the search box to narrow a long list']

    }),
    []
  );

  usePageHeader(
    {
      breadcrumbs: [
      { label: 'Home', href: '/' },
      { label: 'Departments', isCurrent: true }],

      title: 'Departments',
      actions: [],
      helpConfig,
      helpTooltip: 'Departments help'
    },
    []
  );

  // Running-count lookup keyed by lowercased department name
  const runningByDept = useMemo(() => {
    const map = new Map();
    for (const vm of vms) {
      const key = vm.department?.name?.toLowerCase();
      if (!key) continue;
      const bucket = map.get(key) || { total: 0, running: 0 };
      bucket.total += 1;
      if ((vm.status || '').toLowerCase() === 'running') bucket.running += 1;
      map.set(key, bucket);
    }
    return map;
  }, [vms]);

  const totalDepartments = filteredDepartments?.length || 0;
  const totalMachines = useMemo(
    () => vms.length,
    [vms.length]
  );
  const totalRunning = useMemo(
    () => vms.filter((vm) => (vm.status || '').toLowerCase() === 'running').length,
    [vms]
  );

  const submitDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    try {
      await handleDeleteDepartment(deleteTarget.id, deleteTarget.name);
      // Only close on success; the hook already surfaced a success toast.
      setDeleteTarget(null);
    } catch {
      // The hook surfaced an error toast; keep the dialog open so the
      // operator can retry or cancel rather than leaving it stuck.
    } finally {
      setIsDeleting(false);
    }
  };

  // FATAL only: the page cannot render its list without departments. A VMs-only
  // failure is handled inline (see the non-fatal warning below) and must NOT
  // blank the whole page.
  if (hasFatalError) {
    return (
      <Page>
        <Alert
          tone="danger"
          icon={<AlertTriangle size={14} />}
          title="Couldn't load departments"
          actions={
          <Button
            size="sm"
            variant="primary"
            icon={<RefreshCw size={14} />}
            onClick={retryLoading}>
            
              Retry
            </Button>
          }>
          
          The departments API is unreachable. Check the backend service or retry.
        </Alert>
      </Page>);

  }

  return (
    <>
      <Page>
        <PageHeader
          title="Departments"
          count={
          totalDepartments === 0 ?
          null :
          [
          `${totalDepartments} ${totalDepartments === 1 ? 'department' : 'departments'}`,
          totalMachines > 0 ? `${totalMachines} ${totalMachines === 1 ? 'desktop' : 'desktops'}` : null,
          totalRunning > 0 ? `${totalRunning} running` : null].
          filter(Boolean).join(' · ')
          }
          secondary={
          <IconButton
            size="sm"
            variant="ghost"
            label="Refresh"
            icon={<RefreshCw size={14} />}
            onClick={refreshDepartments}
            disabled={isLoading} />

          }
          primary={
          <Tooltip content={canCreate ? 'New Department' : "You don't have permission to create departments"}>
              <span>
                <Button
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                disabled={!canCreate}
                onClick={() => setIsCreateDeptDialogOpen(true)}>

                  New Department
                </Button>
              </span>
            </Tooltip>
          }
          filters={
          <TextField
            placeholder="Search…"
            icon={<Search size={14} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />

          } />
        

        {showVmsWarning ?
        <Alert
          tone="warning"
          icon={<AlertTriangle size={14} />}
          title="Couldn't load desktops"
          actions={
          <ResponsiveStack direction="row" gap={2}>
              <Button
              size="sm"
              variant="primary"
              icon={<RefreshCw size={14} />}
              onClick={retryLoading}>

                Retry
              </Button>
              <Button
              size="sm"
              variant="ghost"
              onClick={() => setDismissedVmsError(vmsError)}>

                Dismiss
              </Button>
            </ResponsiveStack>
          }>

            Desktop counts and running status may be incomplete. The departments
            list itself is unaffected — retry to reload desktops.
          </Alert> :
        null}

        {isLoading && filteredDepartments.length === 0 ?
        <LoadingOverlay label="Loading departments…" /> :
        filteredDepartments.length === 0 ?
        <EmptyState
          icon={<Building2 size={18} />}
          title={searchQuery ? 'No matches' : 'No departments yet'}
          description={
          searchQuery ?
          `Nothing matches "${searchQuery}". Try a different search.` :
          'Create a department to start organizing desktops, firewall rules and scripts.'
          }
          actions={
          !searchQuery ?
          <Tooltip content={canCreate ? 'New Department' : "You don't have permission to create departments"}>
                  <span>
                    <Button
                size="sm"
                variant="primary"
                icon={<Plus size={14} />}
                disabled={!canCreate}
                onClick={() => setIsCreateDeptDialogOpen(true)}>

                      New Department
                    </Button>
                  </span>
                </Tooltip> :
          null
          } /> :

        (() => {
          const tableRows = filteredDepartments.map((dept) => {
            const key = dept.name?.toLowerCase();
            const counts = runningByDept.get(key) || {
              total: getMachineCount(dept.name),
              running: 0
            };
            return { ...dept, _counts: counts };
          });
          return (
            <RowContextMenu
              rows={tableRows}
              labelFor={(r) => r.name}
              buildItems={(r) => [
              {
                label: 'Open',
                icon: <ExternalLink size={14} />,
                onSelect: () =>
                router.push(`/departments/${encodeURIComponent(r.name)}`)
              },
              { separator: true },
              {
                label: 'Delete',
                icon: <Trash2 size={14} />,
                danger: true,
                disabled: !canDelete,
                onSelect: () => setDeleteTarget(r)
              }]
              }>
              
          <DataTable
                rows={tableRows}
                columns={[
                {
                  id: 'name',
                  header: 'Department',
                  cell: ({ row }) =>
                  <span className="font-medium">{row.name}</span>

                },
                {
                  id: 'health',
                  header: 'Status',
                  width: 130,
                  cell: ({ row }) => {
                    const { running, total } = row._counts;
                    if (total === 0) return <span className="text-fg-subtle text-xs">Empty</span>;
                    const s =
                    running === total ? 'online' :
                    running > 0 ? 'degraded' :
                    'offline';
                    const label =
                    running === total ? 'Healthy' :
                    running > 0 ? 'Partial' :
                    'Idle';
                    return <StatusChip status={s} label={label} pulse={false} />;
                  }
                },
                {
                  id: 'usage',
                  header: 'Running',
                  width: 200,
                  cell: ({ row }) => {
                    const { running, total } = row._counts;
                    if (total === 0) return <span className="text-fg-subtle text-xs">—</span>;
                    const pct = Math.round(running / total * 100);
                    return (
                      <ResponsiveStack direction="col" gap={0}>
                      <span className="font-mono text-xs text-fg-muted">
                        {running} / {total}
                      </span>
                      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                        <div
                            className={[
                            'h-full transition-all duration-300',
                            pct === 100 ? 'bg-success' : pct > 0 ? 'bg-accent' : 'bg-white/10'].
                            join(' ')}
                            style={{ width: `${Math.max(2, pct)}%` }} />
                          
                      </div>
                    </ResponsiveStack>);

                  }
                },
                {
                  id: 'total',
                  header: 'Desktops',
                  width: 100,
                  align: 'end',
                  cell: ({ row }) =>
                  <span className="font-mono text-xs">{row._counts.total}</span>

                },
                {
                  id: 'actions',
                  header: '',
                  width: 50,
                  align: 'end',
                  cell: ({ row }) =>
                  <Tooltip content={canDelete ? `Delete ${row.name}` : "You don't have permission to delete departments"}>
                    <span>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        label={`Delete ${row.name}`}
                        icon={<Trash2 size={14} />}
                        disabled={!canDelete}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(row);
                        }} />
                    </span>
                  </Tooltip>

                }]
                }
                rowId={(r) => r.id}
                defaultDensity="compact"
                onRowClick={(r) =>
                router.push(`/departments/${encodeURIComponent(r.name)}`)
                } />
              
          </RowContextMenu>);

        })()}
      </Page>

      <Dialog
        open={isCreateDeptDialogOpen}
        onClose={() => {
          setNewDepartmentName('');
          setIsCreateDeptDialogOpen(false);
        }}
        size="sm">

        <DialogTitle>New department</DialogTitle>
        <DialogDescription>
          Create an organizational unit to group desktops, firewall rules and scripts.
        </DialogDescription>
        <DialogBody>
          <ResponsiveStack direction="col" gap={3}>
            <TextField
              label="Name"
              placeholder="Engineering"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isCreating && newDepartmentName.trim()) {
                  handleCreateDepartment(e);
                }
              }}
              autoFocus />

            {createError ? <Alert tone="danger" size="sm">{createError}</Alert> : null}
          </ResponsiveStack>
        </DialogBody>
        <DialogButtons align="end">
          <Button
            variant="secondary"
            onClick={() => {
              setNewDepartmentName('');
              setIsCreateDeptDialogOpen(false);
            }}
            disabled={isCreating}>

            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateDepartment}
            loading={isCreating}
            disabled={isCreating || !newDepartmentName.trim()}>

            Create
          </Button>
        </DialogButtons>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onClose={() => !isDeleting && setDeleteTarget(null)}
        size="sm">

        <DialogTitle>Delete department</DialogTitle>
        {deleteTarget ? (
          <DialogDescription>
            {`Remove "${deleteTarget.name}"? Its desktops will need to be reassigned to another department.`}
          </DialogDescription>
        ) : null}
        <DialogBody>
          <Alert tone="danger" size="sm" icon={<AlertTriangle size={14} />}>
            This action cannot be undone.
          </Alert>
        </DialogBody>
        <DialogButtons align="end">
          <Button
            variant="secondary"
            onClick={() => setDeleteTarget(null)}
            disabled={isDeleting}>

            Cancel
          </Button>
          <Button
            variant="destructive"
            icon={<Trash2 size={14} />}
            onClick={submitDelete}
            loading={isDeleting}
            disabled={isDeleting}>

            Delete
          </Button>
        </DialogButtons>
      </Dialog>
    </>);

};

export default DepartmentsPage;