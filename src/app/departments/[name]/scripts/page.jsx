'use client';

import { Fragment, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { gql } from '@apollo/client';
import { useApolloClient } from '@apollo/client/react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  AlertCircle,
  Calendar,
  Edit3,
  FileCode,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogBody,
  DialogButtons,
  Drawer,
  IconButton,
  IconTile,
  LoadingOverlay,
  Page,
  ResponsiveStack,
  TextField,
} from '@infinibay/harbor';

import {
  useAssignScriptToDepartmentMutation,
  useCancelScriptExecutionMutation,
  useDepartmentScriptsQuery,
  useMyPermissionsQuery,
  useScriptsQuery,
  useUnassignScriptFromDepartmentMutation,
} from '@/gql/hooks';
import { isOperatorView } from '@/lib/roles';
import { ScriptListItem } from '@/app/scripts/components/ScriptListItem';
import { usePageHeader } from '@/hooks/usePageHeader';
import ScheduleScriptDialog from './components/ScheduleScriptDialog';

const GET_ACTIVE_SCHEDULES = gql`
  query GetActiveSchedules($scriptId: ID!, $departmentId: ID!) {
    scheduledScripts(
      filters: {
        scriptId: $scriptId
        departmentId: $departmentId
        status: [PENDING, RUNNING]
      }
    ) {
      id
      status
      machine {
        name
      }
    }
  }
`;

// Header registration lives in its own component so the standalone route can
// register the global page header while the embedded (department Scripts tab)
// usage skips it entirely — the department page already owns the header, and
// re-registering here would clobber its title/breadcrumbs. Kept at module scope
// so it isn't remounted on every parent render (which would thrash the header).
function ScriptsHeaderRegistration({
  departmentName,
  departmentId,
  isAdmin,
  onAssign,
}) {
  usePageHeader(
    {
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Departments', href: '/departments' },
        {
          label: departmentName,
          href: `/departments/${departmentName}`,
        },
        { label: 'Scripts', isCurrent: true },
      ],
      title: 'Department scripts',
      subtitle: departmentName ? { text: departmentName } : null,
      actions:
        isAdmin && departmentId
          ? [
              {
                id: 'assign-script',
                label: 'Assign script',
                icon: 'Plus',
                onClick: onAssign,
              },
            ]
          : [],
    },
    [departmentName, departmentId, isAdmin],
  );
  return null;
}

export default function DepartmentScriptsPage({ embedded = false }) {
  const params = useParams();
  const router = useRouter();
  const apolloClient = useApolloClient();
  const departmentName = params.name;
  const currentUser = useSelector((state) => state.auth.user);
  // Derive operator access from the resources the backend actually grants
  // (custom-role operators are tiered to enum USER, so a raw enum check would
  // lock them out); fall back to the legacy enum while permissions load.
  const { data: permissionsData } = useMyPermissionsQuery({
    skip: !currentUser,
    fetchPolicy: 'cache-and-network',
  });
  const allowedResources = permissionsData?.myPermissions?.allowedResources;
  const isAdmin = isOperatorView(currentUser, allowedResources);

  const departments = useSelector((state) => state.departments.items);
  const departmentsLoading = useSelector(
    (state) => state.departments.loading.fetch,
  );
  const departmentsLastUpdated = useSelector(
    (state) => state.departments.lastUpdated,
  );
  const department = departments.find(
    (d) => d.name.toLowerCase() === departmentName?.toLowerCase(),
  );
  const departmentId = department?.id;

  // The departments slice is populated by a deferred init fetch, so on a direct
  // navigation it can be empty for a moment. Distinguish "still loading" from
  // "loaded but this department does not exist".
  const departmentsResolved = departmentsLastUpdated != null;
  const isDepartmentResolving =
    !departmentId && (departmentsLoading || !departmentsResolved);
  const isDepartmentMissing =
    !departmentId && departmentsResolved && !departmentsLoading;

  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [unassignConfirm, setUnassignConfirm] = useState(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedScriptForSchedule, setSelectedScriptForSchedule] =
    useState(null);
  const [isUnassigning, setIsUnassigning] = useState(false);
  const [isCheckingSchedules, setIsCheckingSchedules] = useState(false);
  const [assigningId, setAssigningId] = useState(null);

  const {
    data: allScriptsData,
    loading: allScriptsLoading,
    error: allScriptsError,
    refetch: refetchAllScripts,
  } = useScriptsQuery();
  const {
    data: deptScriptsData,
    loading: deptScriptsLoading,
    error: deptScriptsError,
    refetch: refetchDeptScripts,
  } = useDepartmentScriptsQuery({
    variables: { departmentId: departmentId || '' },
    skip: !departmentId,
  });

  const [assignScript] = useAssignScriptToDepartmentMutation();
  const [unassignScript] = useUnassignScriptFromDepartmentMutation();
  const [cancelScriptExecution] = useCancelScriptExecutionMutation();

  const assignedScriptIds = new Set(
    deptScriptsData?.departmentScripts?.map((s) => s.id) || [],
  );
  const availableScripts =
    allScriptsData?.scripts?.filter((s) => !assignedScriptIds.has(s.id)) || [];
  const filteredAvailableScripts = availableScripts.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAssign = async (scriptId) => {
    if (!departmentId || assigningId) return;
    try {
      setAssigningId(scriptId);
      const res = await assignScript({ variables: { scriptId, departmentId } });
      // assignScriptToDepartment resolves Boolean!; a `false` result is a
      // silent server-side rejection (no throw), so don't report success.
      if (res?.data?.assignScriptToDepartment === false) {
        throw new Error('The server rejected the assignment.');
      }
      toast.success('Script assigned to department');
      await refetchDeptScripts();
      setShowAssignDialog(false);
    } catch (error) {
      toast.error(`Failed to assign script: ${error.message}`);
    } finally {
      setAssigningId(null);
    }
  };

  const handleUnassign = async (script) => {
    if (isCheckingSchedules || isUnassigning) return;
    try {
      setIsCheckingSchedules(true);
      const { data } = await apolloClient.query({
        query: GET_ACTIVE_SCHEDULES,
        variables: { scriptId: script.id, departmentId },
        fetchPolicy: 'network-only',
      });
      const activeSchedules = data?.scheduledScripts || [];
      const affectedVMs = [
        ...new Set(
          activeSchedules.map((s) => s.machine?.name).filter(Boolean),
        ),
      ];
      const scheduleIds = activeSchedules.map((s) => s.id);
      // Always confirm the destructive unassign; the dialog copy varies
      // depending on whether active schedules will be cancelled.
      setUnassignConfirm({
        scriptId: script.id,
        scriptName: script.name,
        activeSchedulesCount: activeSchedules.length,
        affectedVMs: affectedVMs.slice(0, 5),
        scheduleIds,
      });
    } catch (error) {
      toast.error(`Failed to check schedules: ${error.message}`);
    } finally {
      setIsCheckingSchedules(false);
    }
  };

  const handleUnassignConfirm = async (scriptId) => {
    if (isUnassigning) return;
    try {
      setIsUnassigning(true);
      const scheduleIds = unassignConfirm?.scheduleIds || [];
      let failedCancellations = 0;
      if (scheduleIds.length > 0) {
        const results = await Promise.all(
          scheduleIds.map((id) =>
            cancelScriptExecution({ variables: { id } }).then(
              // cancelScriptExecution returns a SuccessType envelope: an HTTP
              // 200 with success:false does NOT throw, so a resolved promise is
              // not proof the cancellation happened — inspect the flag.
              (res) => ({
                ok: res?.data?.cancelScriptExecution?.success === true,
              }),
              (error) => {
                console.error(`Failed to cancel schedule ${id}:`, error);
                return { ok: false };
              },
            ),
          ),
        );
        failedCancellations = results.filter((r) => !r.ok).length;
      }
      const unassignRes = await unassignScript({
        variables: {
          scriptId: scriptId || unassignConfirm?.scriptId,
          departmentId,
        },
      });
      // unassignScriptFromDepartment resolves Boolean!; a `false` result is a
      // silent rejection — surface it as an error and keep the dialog open.
      if (unassignRes?.data?.unassignScriptFromDepartment === false) {
        throw new Error('The server rejected the removal.');
      }
      const cancelledCount = scheduleIds.length - failedCancellations;
      if (failedCancellations > 0) {
        toast.warning(
          `Script removed from department, but ${failedCancellations} schedule${failedCancellations > 1 ? 's' : ''} could not be cancelled. Please cancel ${failedCancellations > 1 ? 'them' : 'it'} manually.`,
        );
      } else {
        const message =
          scheduleIds.length > 0
            ? `Script removed from department and ${cancelledCount} schedule${cancelledCount > 1 ? 's' : ''} cancelled`
            : 'Script removed from department';
        toast.success(message);
      }
      setUnassignConfirm(null);
      refetchDeptScripts();
    } catch (error) {
      // Keep the confirm dialog open on failure so the user can retry.
      toast.error(`Failed to remove script: ${error.message}`);
    } finally {
      setIsUnassigning(false);
    }
  };

  const handleOpenScheduleDialog = (script) => {
    setSelectedScriptForSchedule({ id: script.id, name: script.name });
    setScheduleDialogOpen(true);
  };

  // When embedded inside the department page's Scripts tab, render WITHOUT the
  // outer <Page> wrapper (avoids a <Page> nested in a <Page>) and WITHOUT
  // registering the global header (the department page already owns it). The
  // standalone /departments/[name]/scripts route keeps both, unchanged.
  const Wrapper = embedded ? Fragment : Page;
  const headerRegistration = embedded ? null : (
    <ScriptsHeaderRegistration
      departmentName={departmentName}
      departmentId={departmentId}
      isAdmin={isAdmin}
      onAssign={() => setShowAssignDialog(true)}
    />
  );

  if (!isAdmin) {
    return (
      <Wrapper>
        {headerRegistration}
        <Alert tone="warning" title="Admins only">
          Only administrators can manage department scripts.
        </Alert>
      </Wrapper>
    );
  }

  if (isDepartmentResolving) {
    return (
      <Wrapper>
        {headerRegistration}
        <div className="grid place-items-center py-16">
          <LoadingOverlay label="Loading department…" />
        </div>
      </Wrapper>
    );
  }

  if (isDepartmentMissing) {
    return (
      <Wrapper>
        {headerRegistration}
        <Alert tone="danger" title="Department not found">
          {`We couldn't find a department named "${departmentName}".`}
        </Alert>
      </Wrapper>
    );
  }

  const assigned = deptScriptsData?.departmentScripts || [];

  return (
    <Wrapper>
      {headerRegistration}
      <Card
        variant="default"
        leadingIcon={<FileCode size={18} />}
        leadingIconTone="fuchsia"
        title="Assigned scripts"
        description={`${assigned.length} script${assigned.length === 1 ? '' : 's'} available to machines in this department.`}
        actions={
          <Button
            variant="primary"
            icon={<Plus size={14} />}
            onClick={() => setShowAssignDialog(true)}
          >
            Assign script
          </Button>
        }
      >
        <div className="relative">
          {deptScriptsLoading && assigned.length === 0 ? (
            <LoadingOverlay fill label="Loading scripts…" />
          ) : null}
          {deptScriptsLoading && assigned.length > 0 ? (
            <div className="absolute inset-0 z-10 grid place-items-center bg-surface/60 backdrop-blur-sm">
              <LoadingOverlay label="Loading scripts…" />
            </div>
          ) : null}
          {!deptScriptsLoading && deptScriptsError ? (
            <Alert
              tone="danger"
              title="Couldn't load assigned scripts"
              icon={<AlertCircle size={16} />}
              actions={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => refetchDeptScripts()}
                >
                  Retry
                </Button>
              }
            >
              {deptScriptsError.message}
            </Alert>
          ) : null}
          {!deptScriptsLoading && !deptScriptsError && assigned.length === 0 ? (
            <ResponsiveStack direction="col" gap={2} align="center">
              <IconTile
                icon={<FileCode size={18} />}
                tone="neutral"
                size="lg"
              />
              <span>No scripts assigned to this department yet</span>
            </ResponsiveStack>
          ) : null}

          {assigned.length > 0 ? (
            <ResponsiveStack direction="col" gap={2}>
              {assigned.map((script) => (
                <ScriptListItem
                  key={script.id}
                  script={script}
                  compact
                  onClick={() =>
                    router.push(
                      `/departments/${departmentName}/scripts/${script.id}`,
                    )
                  }
                  customActions={
                    <ResponsiveStack direction="row" gap={2} align="center">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Edit3 size={14} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/scripts/${script.id}`);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<Calendar size={14} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenScheduleDialog(script);
                        }}
                      >
                        Schedule
                      </Button>
                      <IconButton
                        label="Remove script"
                        size="sm"
                        quiet
                        icon={<Trash2 size={14} />}
                        disabled={isCheckingSchedules || isUnassigning}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnassign(script);
                        }}
                      />
                    </ResponsiveStack>
                  }
                />
              ))}
            </ResponsiveStack>
          ) : null}
        </div>
      </Card>

      <Drawer
        open={showAssignDialog}
        onClose={() => {
          setShowAssignDialog(false);
          setSearchQuery('');
        }}
        side="right"
        size="min(560px, 92vw)"
        title={
          <ResponsiveStack direction="row" gap={2} align="center">
            <FileCode size={14} />
            <span>Assign script</span>
          </ResponsiveStack>
        }
        footer={
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowAssignDialog(false);
                setSearchQuery('');
              }}
            >
              Close
            </Button>
          </ResponsiveStack>
        }
      >
        <ResponsiveStack direction="col" gap={4}>
          <TextField
            placeholder="Search scripts…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={14} />}
          />
          <div className="relative">
            {allScriptsLoading && filteredAvailableScripts.length === 0 ? (
              <LoadingOverlay fill label="Loading scripts…" />
            ) : null}
            {allScriptsLoading && filteredAvailableScripts.length > 0 ? (
              <div className="absolute inset-0 z-10 grid place-items-center bg-surface/60 backdrop-blur-sm">
                <LoadingOverlay label="Loading scripts…" />
              </div>
            ) : null}
            {!allScriptsLoading && allScriptsError ? (
              <Alert
                tone="danger"
                size="sm"
                title="Couldn't load scripts"
                icon={<AlertCircle size={14} />}
                actions={
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => refetchAllScripts()}
                  >
                    Retry
                  </Button>
                }
              >
                {allScriptsError.message}
              </Alert>
            ) : null}
            {!allScriptsLoading &&
            !allScriptsError &&
            filteredAvailableScripts.length === 0 ? (
              <Alert tone="info" size="sm">
                {searchQuery
                  ? 'No scripts match your search.'
                  : 'All scripts are already assigned.'}
              </Alert>
            ) : null}
            {filteredAvailableScripts.length > 0 ? (
              <ResponsiveStack direction="col" gap={2}>
                {filteredAvailableScripts.map((script) => (
                  <ScriptListItem
                    key={script.id}
                    script={script}
                    compact
                    customActions={
                      <Button
                        size="sm"
                        loading={assigningId === script.id}
                        disabled={assigningId !== null}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAssign(script.id);
                        }}
                      >
                        Assign
                      </Button>
                    }
                  />
                ))}
              </ResponsiveStack>
            ) : null}
          </div>
        </ResponsiveStack>
      </Drawer>

      <Dialog
        open={unassignConfirm !== null}
        onClose={() => !isUnassigning && setUnassignConfirm(null)}
        size="md"
      >
        <DialogTitle>
          <ResponsiveStack direction="row" gap={2} align="center">
            <AlertCircle size={16} />
            <span>
              {unassignConfirm?.activeSchedulesCount > 0
                ? 'Script has active schedules'
                : 'Remove script from department'}
            </span>
          </ResponsiveStack>
        </DialogTitle>
        <DialogBody>
        <ResponsiveStack direction="col" gap={3}>
          {unassignConfirm?.activeSchedulesCount > 0 ? (
            <>
              <Alert tone="warning" size="sm">
                This script has{' '}
                <strong>{unassignConfirm?.activeSchedulesCount}</strong> active
                schedule
                {unassignConfirm?.activeSchedulesCount > 1 ? 's' : ''} in this
                department.
              </Alert>
              {unassignConfirm?.affectedVMs &&
              unassignConfirm.affectedVMs.length > 0 ? (
                <ResponsiveStack direction="col" gap={1}>
                  <strong>Affected desktops</strong>
                  <ResponsiveStack direction="row" gap={1} wrap>
                    {unassignConfirm.affectedVMs.map((vm) => (
                      <Badge key={vm} tone="neutral">
                        {vm}
                      </Badge>
                    ))}
                  </ResponsiveStack>
                </ResponsiveStack>
              ) : null}
              <span>
                Unassigning will cancel all active schedules for this script in
                this department.
              </span>
            </>
          ) : (
            <span>
              {`Remove "${unassignConfirm?.scriptName}" from this department? Machines in this department will no longer be able to run it.`}
            </span>
          )}
        </ResponsiveStack>
        </DialogBody>
        <DialogButtons align="end">
          <Button
            variant="secondary"
            disabled={isUnassigning}
            onClick={() => setUnassignConfirm(null)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            loading={isUnassigning}
            disabled={isUnassigning}
            onClick={() => handleUnassignConfirm()}
          >
            {isUnassigning
              ? 'Removing…'
              : unassignConfirm?.activeSchedulesCount > 0
                ? 'Unassign & cancel schedules'
                : 'Remove script'}
          </Button>
        </DialogButtons>
      </Dialog>

      {selectedScriptForSchedule ? (
        <ScheduleScriptDialog
          open={scheduleDialogOpen}
          onOpenChange={setScheduleDialogOpen}
          scriptId={selectedScriptForSchedule.id}
          scriptName={selectedScriptForSchedule.name}
          departmentId={departmentId}
          departmentName={departmentName}
        />
      ) : null}
    </Wrapper>
  );
}
