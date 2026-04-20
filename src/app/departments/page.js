'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Badge,
  Button,
  Card,
  Dialog,
  EmptyState,
  IconButton,
  IconTile,
  LoadingOverlay,
  Page,
  ResponsiveGrid,
  ResponsiveStack,
  Stat,
  TextField,
} from '@infinibay/harbor';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';

import { useDepartmentsPage } from './hooks/useDepartmentsPage';
import { usePageHeader } from '@/hooks/usePageHeader';

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
      title: 'Departments',
      description: 'Organize your VMs by team, project or function.',
      icon: <Building2 size={14} />,
      sections: [
        {
          id: 'managing',
          title: 'Managing departments',
          icon: <Building2 size={14} />,
          content:
            'Use "New department" to create an organizational unit. Click any card to open its VMs, firewall rules and scripts.',
        },
      ],
      quickTips: [
        'Click a card to open a department',
        'Each department has its own firewall rules and scripts',
        'Use the search box to narrow a long list',
      ],
    }),
    [],
  );

  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Departments', isCurrent: true },
      ],
      title: 'Departments',
      actions: [],
      helpConfig,
      helpTooltip: 'Departments help',
    },
    [],
  );

  const totalDepartments = filteredDepartments?.length || 0;
  const totalMachines = useMemo(
    () =>
      (filteredDepartments || []).reduce(
        (acc, d) => acc + (getMachineCount(d.name) || 0),
        0,
      ),
    [filteredDepartments, getMachineCount],
  );

  const submitDelete = async () => {
    if (!deleteTarget) return;
    await handleDeleteDepartment(deleteTarget.id);
    setDeleteTarget(null);
  };

  if (hasError) {
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
              onClick={retryLoading}
            >
              Retry
            </Button>
          }
        >
          The departments API is unreachable. Check the backend service or retry.
        </Alert>
      </Page>
    );
  }

  return (
    <>
      <Page>
        {useMockData && (
          <Alert
            tone="warning"
            icon={<AlertTriangle size={14} />}
            title="Using mock data"
            actions={
              <Button
                size="sm"
                variant="primary"
                icon={<RefreshCw size={14} />}
                onClick={retryLoading}
              >
                Retry
              </Button>
            }
          >
            Could not connect to the departments API. Showing mock data.
          </Alert>
        )}

        <Card
          variant="default"
          spotlight={false}
          glow={false}
          leadingIcon={<Building2 size={18} />}
          leadingIconTone="sky"
          title="Departments"
          description="Organize VMs by team, project or function."
          footer={
            <ResponsiveGrid columns={{ base: 1, sm: 2 }} gap={3}>
              <Stat
                label="Departments"
                value={totalDepartments}
                icon={<Building2 size={12} />}
              />
              <Stat label="Virtual machines" value={totalMachines} />
            </ResponsiveGrid>
          }
        >
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw size={14} />}
              onClick={refreshDepartments}
              disabled={isLoading}
              loading={isLoading}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => setIsCreateDeptDialogOpen(true)}
            >
              New department
            </Button>
          </ResponsiveStack>
        </Card>

        <Card variant="default" spotlight={false} glow={false}>
          <TextField
            placeholder="Search departments…"
            icon={<Search size={14} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Card>

        {isLoading && filteredDepartments.length === 0 ? (
          <LoadingOverlay label="Loading departments…" />
        ) : filteredDepartments.length === 0 ? (
          <EmptyState
            variant="dashed"
            icon={<Building2 size={18} />}
            title={searchQuery ? 'No matches' : 'No departments yet'}
            description={
              searchQuery
                ? 'No departments match your search.'
                : 'Create a department to start organizing VMs.'
            }
            actions={
              !searchQuery ? (
                <Button
                  size="sm"
                  variant="primary"
                  icon={<Plus size={14} />}
                  onClick={() => setIsCreateDeptDialogOpen(true)}
                >
                  New department
                </Button>
              ) : null
            }
          />
        ) : (
          <ResponsiveGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
            {filteredDepartments.map((dept) => {
              const count = getMachineCount(dept.name);
              return (
                <Card
                  key={dept.id}
                  variant="default"
                  interactive
                  spotlight={false}
                  glow={false}
                  fullHeight
                  onClick={() =>
                    router.push(`/departments/${encodeURIComponent(dept.name)}`)
                  }
                  footer={
                    <ResponsiveStack direction="row" align="center" justify="between">
                      {dept.id ? (
                        <Badge tone="neutral">{dept.id.slice(0, 6)}</Badge>
                      ) : (
                        <span />
                      )}
                      <Badge tone="info" icon={<ArrowRight size={10} />}>
                        Open
                      </Badge>
                    </ResponsiveStack>
                  }
                >
                  <ResponsiveStack
                    direction="row"
                    gap={3}
                    align="start"
                    justify="between"
                  >
                    <ResponsiveStack direction="row" gap={3} align="start">
                      <IconTile
                        icon={<Building2 size={18} />}
                        tone="purple"
                        size="md"
                      />
                      <ResponsiveStack direction="col" gap={1}>
                        <span>{dept.name}</span>
                        <span>
                          {count === 0
                            ? 'No VMs'
                            : count === 1
                              ? '1 VM'
                              : `${count} VMs`}
                        </span>
                      </ResponsiveStack>
                    </ResponsiveStack>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      label="Delete department"
                      icon={<Trash2 size={14} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(dept);
                      }}
                    />
                  </ResponsiveStack>
                </Card>
              );
            })}
          </ResponsiveGrid>
        )}
      </Page>

      <Dialog
        open={isCreateDeptDialogOpen}
        onClose={() => {
          setNewDepartmentName('');
          setIsCreateDeptDialogOpen(false);
        }}
        size="sm"
        title="New department"
        description="Create an organizational unit to group VMs, firewall rules and scripts."
        footer={
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
              variant="secondary"
              onClick={() => {
                setNewDepartmentName('');
                setIsCreateDeptDialogOpen(false);
              }}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateDepartment}
              loading={isCreating}
              disabled={isCreating || !newDepartmentName.trim()}
            >
              Create
            </Button>
          </ResponsiveStack>
        }
      >
        <ResponsiveStack direction="col" gap={3}>
          <TextField
            label="Name"
            placeholder="Engineering"
            value={newDepartmentName}
            onChange={(e) => setNewDepartmentName(e.target.value)}
            autoFocus
          />
          {createError ? <Alert tone="danger" size="sm">{createError}</Alert> : null}
        </ResponsiveStack>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        size="sm"
        title="Delete department"
        description={
          deleteTarget
            ? `Remove "${deleteTarget.name}"? Its VMs will need to be reassigned to another department.`
            : undefined
        }
        footer={
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              icon={<Trash2 size={14} />}
              onClick={submitDelete}
            >
              Delete
            </Button>
          </ResponsiveStack>
        }
      >
        <Alert tone="danger" size="sm" icon={<AlertTriangle size={14} />}>
          This action cannot be undone.
        </Alert>
      </Dialog>
    </>
  );
};

export default DepartmentsPage;
