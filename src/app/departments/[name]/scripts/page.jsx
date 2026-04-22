'use client';

import { useState } from 'react';
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
  useScriptsQuery,
  useUnassignScriptFromDepartmentMutation,
} from '@/gql/hooks';
import { ScriptListItem } from '@/app/scripts/components/ScriptListItem';
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

export default function DepartmentScriptsPage() {
  const params = useParams();
  const router = useRouter();
  const apolloClient = useApolloClient();
  const departmentName = params.name;
  const currentUser = useSelector((state) => state.auth.user);
  const isAdmin = currentUser?.role === 'ADMIN';

  const departments = useSelector((state) => state.departments.items);
  const department = departments.find(
    (d) => d.name.toLowerCase() === departmentName?.toLowerCase(),
  );
  const departmentId = department?.id;

  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [unassignConfirm, setUnassignConfirm] = useState(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedScriptForSchedule, setSelectedScriptForSchedule] =
    useState(null);
  const [isUnassigning, setIsUnassigning] = useState(false);
  const [isCheckingSchedules, setIsCheckingSchedules] = useState(false);

  const { data: allScriptsData, loading: allScriptsLoading } = useScriptsQuery();
  const {
    data: deptScriptsData,
    loading: deptScriptsLoading,
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
    try {
      await assignScript({ variables: { scriptId, departmentId } });
      toast.success('Script assigned to department');
      refetchDeptScripts();
      setShowAssignDialog(false);
    } catch (error) {
      toast.error(`Failed to assign script: ${error.message}`);
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
      if (activeSchedules.length > 0) {
        const affectedVMs = [
          ...new Set(
            activeSchedules.map((s) => s.machine?.name).filter(Boolean),
          ),
        ];
        const scheduleIds = activeSchedules.map((s) => s.id);
        setUnassignConfirm({
          scriptId: script.id,
          scriptName: script.name,
          activeSchedulesCount: activeSchedules.length,
          affectedVMs: affectedVMs.slice(0, 5),
          scheduleIds,
        });
      } else {
        await handleUnassignConfirm(script.id);
      }
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
      if (scheduleIds.length > 0) {
        await Promise.all(
          scheduleIds.map((id) =>
            cancelScriptExecution({ variables: { id } }).catch((error) => {
              console.error(`Failed to cancel schedule ${id}:`, error);
              return { error };
            }),
          ),
        );
      }
      await unassignScript({
        variables: {
          scriptId: scriptId || unassignConfirm?.scriptId,
          departmentId,
        },
      });
      const message =
        scheduleIds.length > 0
          ? `Script removed from department and ${scheduleIds.length} schedule${scheduleIds.length > 1 ? 's' : ''} cancelled`
          : 'Script removed from department';
      toast.success(message);
      setUnassignConfirm(null);
      refetchDeptScripts();
    } catch (error) {
      toast.error(`Failed to remove script: ${error.message}`);
      setUnassignConfirm(null);
    } finally {
      setIsUnassigning(false);
    }
  };

  const handleOpenScheduleDialog = (script) => {
    setSelectedScriptForSchedule({ id: script.id, name: script.name });
    setScheduleDialogOpen(true);
  };

  if (!isAdmin) {
    return (
      <Page>
        <Alert tone="warning" title="Admins only">
          Only administrators can manage department scripts.
        </Alert>
      </Page>
    );
  }

  const assigned = deptScriptsData?.departmentScripts || [];

  return (
    <Page>
      <Card
        variant="default"
        leadingIcon={<FileCode size={18} />}
        leadingIconTone="fuchsia"
        title="Assigned scripts"
        description={`${assigned.length} script${assigned.length === 1 ? '' : 's'} available to machines in this department.`}
        actions={
          <Button
            variant="primary"
            leadingIcon={<Plus size={14} />}
            onClick={() => setShowAssignDialog(true)}
          >
            Assign script
          </Button>
        }
      >
        <LoadingOverlay active={deptScriptsLoading} label="Loading scripts…">
          {!deptScriptsLoading && assigned.length === 0 ? (
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
                        leadingIcon={<Edit3 size={14} />}
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
                        leadingIcon={<Calendar size={14} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenScheduleDialog(script);
                        }}
                      >
                        Schedule
                      </Button>
                      <IconButton
                        label="Remove script"
                        tone="danger"
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
        </LoadingOverlay>
      </Card>

      <Drawer
        open={showAssignDialog}
        onClose={() => setShowAssignDialog(false)}
        side="right"
        size={560}
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
              onClick={() => setShowAssignDialog(false)}
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
            leadingIcon={<Search size={14} />}
          />
          <LoadingOverlay active={allScriptsLoading} label="Loading scripts…">
            {!allScriptsLoading && filteredAvailableScripts.length === 0 ? (
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
          </LoadingOverlay>
        </ResponsiveStack>
      </Drawer>

      <Dialog
        open={unassignConfirm !== null}
        onClose={() => !isUnassigning && setUnassignConfirm(null)}
        size="md"
        title={
          <ResponsiveStack direction="row" gap={2} align="center">
            <AlertCircle size={16} />
            <span>Script has active schedules</span>
          </ResponsiveStack>
        }
        footerAlign="end"
        footer={
          <ResponsiveStack direction="row" gap={2} justify="end">
            <Button
              variant="secondary"
              disabled={isUnassigning}
              onClick={() => setUnassignConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={isUnassigning}
              disabled={isUnassigning}
              onClick={() => handleUnassignConfirm()}
            >
              {isUnassigning
                ? 'Unassigning…'
                : 'Unassign & cancel schedules'}
            </Button>
          </ResponsiveStack>
        }
      >
        <ResponsiveStack direction="col" gap={3}>
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
              <strong>Affected VMs</strong>
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
        </ResponsiveStack>
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
    </Page>
  );
}
