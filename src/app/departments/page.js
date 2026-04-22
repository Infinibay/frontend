'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
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
  StatusDot,
  TextField,
} from '@infinibay/harbor';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Cpu,
  Plus,
  RefreshCw,
  Search,
  Server,
  Trash2,
} from 'lucide-react';

import { useDepartmentsPage } from './hooks/useDepartmentsPage';
import { usePageHeader } from '@/hooks/usePageHeader';

// Deterministic tone per department name so each card has its own accent
// without random flicker on re-renders. Harbor supports these tones.
const ACCENT_TONES = ['sky', 'purple', 'success', 'info', 'warning', 'danger'];
const toneFor = (name) => {
  if (!name) return 'sky';
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  }
  return ACCENT_TONES[Math.abs(hash) % ACCENT_TONES.length];
};

const pluralize = (n, one, many) => (n === 1 ? `1 ${one}` : `${n} ${many}`);

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

  const vms = useSelector((state) => state.vms?.items || []);
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
    [vms.length],
  );
  const totalRunning = useMemo(
    () => vms.filter((vm) => (vm.status || '').toLowerCase() === 'running').length,
    [vms],
  );

  const submitDelete = async () => {
    if (!deleteTarget) return;
    await handleDeleteDepartment(deleteTarget.id, deleteTarget.name);
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
          spotlight
          glow={false}
          leadingIcon={<Building2 size={22} />}
          leadingIconTone="sky"
          title="Departments"
          description="Organize your virtual machines by team, project or function."
          footer={
            <ResponsiveGrid columns={{ base: 1, sm: 3 }} gap={3}>
              <Stat
                label="Departments"
                value={totalDepartments}
                icon={<Building2 size={12} />}
                tone="sky"
              />
              <Stat
                label="Virtual machines"
                value={totalMachines}
                icon={<Server size={12} />}
                tone="purple"
              />
              <Stat
                label="Running now"
                value={totalRunning}
                icon={<Cpu size={12} />}
                tone="success"
              />
            </ResponsiveGrid>
          }
        >
          <ResponsiveStack
            direction={{ base: 'col', md: 'row' }}
            gap={3}
            align={{ base: 'stretch', md: 'center' }}
            justify="between"
          >
            <TextField
              placeholder="Search departments by name…"
              icon={<Search size={14} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
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
          </ResponsiveStack>
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
                ? `Nothing matches "${searchQuery}". Try a different search.`
                : 'Create a department to start organizing VMs, firewall rules and scripts.'
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
          <ResponsiveGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap={4}>
            {filteredDepartments.map((dept) => {
              const tone = toneFor(dept.name);
              const key = dept.name?.toLowerCase();
              const counts = runningByDept.get(key) || {
                total: getMachineCount(dept.name),
                running: 0,
              };
              const stopped = Math.max(0, counts.total - counts.running);
              const statusDotKind = counts.running > 0
                ? 'online'
                : counts.total > 0
                  ? 'degraded'
                  : 'offline';

              return (
                <Card
                  key={dept.id}
                  variant="default"
                  interactive
                  spotlight
                  glow={false}
                  fullHeight
                  onClick={() =>
                    router.push(`/departments/${encodeURIComponent(dept.name)}`)
                  }
                  footer={
                    <ResponsiveStack
                      direction="row"
                      align="center"
                      justify="between"
                    >
                      <ResponsiveStack direction="row" gap={2} align="center">
                        <StatusDot status={statusDotKind} />
                        <span>
                          {counts.total === 0
                            ? 'No VMs yet'
                            : `${counts.running}/${counts.total} running`}
                        </span>
                      </ResponsiveStack>
                      <Badge tone={tone} icon={<ArrowRight size={10} />}>
                        Open
                      </Badge>
                    </ResponsiveStack>
                  }
                >
                  <ResponsiveStack direction="col" gap={3}>
                    <ResponsiveStack
                      direction="row"
                      gap={3}
                      align="start"
                      justify="between"
                    >
                      <ResponsiveStack direction="row" gap={3} align="center">
                        <IconTile
                          icon={<Building2 size={20} />}
                          tone={tone}
                          size="md"
                        />
                        <ResponsiveStack direction="col" gap={0}>
                          <span>{dept.name}</span>
                          <span>
                            {pluralize(counts.total, 'virtual machine', 'virtual machines')}
                          </span>
                        </ResponsiveStack>
                      </ResponsiveStack>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        label={`Delete ${dept.name}`}
                        icon={<Trash2 size={14} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(dept);
                        }}
                      />
                    </ResponsiveStack>

                    {counts.total > 0 ? (
                      <ResponsiveGrid columns={2} gap={2}>
                        <Stat
                          label="Running"
                          value={counts.running}
                          tone="success"
                        />
                        <Stat
                          label="Stopped"
                          value={stopped}
                          tone={stopped > 0 ? 'warning' : 'neutral'}
                        />
                      </ResponsiveGrid>
                    ) : null}
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
