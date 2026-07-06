'use client';

import { useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  CodeBlock,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
  EmptyState,
  FormField,
  LoadingOverlay,
  Page,
  ResponsiveGrid,
  ResponsiveStack,
  Select,
  Spinner,
  Timeline,
} from '@infinibay/harbor';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  FileCode,
  Play,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import {
  useDepartmentScriptsQuery,
  useExecuteScriptMutation,
  useScriptExecutionsQuery,
  useScriptQuery,
  useVmUsersQuery,
} from '@/gql/hooks';
import { ScriptInputRenderer } from '@/components/ScriptInput/ScriptInputRenderer';
import { getSocketService } from '@/services/socketService';
import { toast } from 'sonner';
import { validateScriptInput } from '@/utils/validateScriptInput';
import { parseScriptError } from '@/utils/parseScriptError';

const statusToTone = (status) => {
  switch (status) {
    case 'SUCCESS':
      return 'success';
    case 'FAILED':
    case 'TIMEOUT':
      return 'danger';
    case 'RUNNING':
    case 'PENDING':
      return 'info';
    case 'CANCELLED':
      return 'warning';
    default:
      return 'neutral';
  }
};

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'RUNNING':
    case 'PENDING':
      return <Clock size={14} />;
    case 'SUCCESS':
      return <CheckCircle size={14} />;
    case 'FAILED':
    case 'TIMEOUT':
      return <XCircle size={14} />;
    case 'CANCELLED':
      return <AlertCircle size={14} />;
    default:
      return <Clock size={14} />;
  }
};

export default function VMScriptsTab({ vmId, vmStatus, vmSetupComplete, departmentId }) {
  const isReady = vmStatus === 'running' && !!vmSetupComplete;
  const [selectedScript, setSelectedScript] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const [showLogsDialog, setShowLogsDialog] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState(null);
  const [runAsUser, setRunAsUser] = useState('system');
  const [validationErrors, setValidationErrors] = useState({});

  const {
    data: scriptsData,
    loading: scriptsLoading,
    error: scriptsError,
    refetch: refetchScripts,
  } = useDepartmentScriptsQuery({
    variables: { departmentId },
    skip: !departmentId,
  });

  const {
    data: executionsData,
    loading: executionsLoading,
    error: executionsError,
    refetch: refetchExecutions,
  } = useScriptExecutionsQuery({
    variables: { machineId: vmId, limit: 50 },
  });

  const { data: scriptData, loading: scriptLoading } = useScriptQuery({
    variables: { id: selectedScript?.id },
    skip: !selectedScript?.id,
  });

  const { data: usersData } = useVmUsersQuery({
    variables: { machineId: vmId },
    skip: !vmId || !isReady,
  });

  const [executeScript, { loading: executing }] = useExecuteScriptMutation();

  useEffect(() => {
    const socketService = getSocketService();
    // The backend (ScriptsEventManager) emits `scripts:execution_started|
    // execution_completed|execution_cancelled` — NOT `script_execution_*`. The
    // events/page.js, ExecutionLogsTab and ScheduleTab all use the `execution_*`
    // names; using anything else means this tab never receives realtime updates.
    // The execution payload's data carries machineId (but no scriptName).
    const unsubscribe = socketService.subscribeToAllResourceEvents(
      'scripts',
      (action, data) => {
        if (data?.data?.machineId === vmId) {
          refetchExecutions();
          switch (action) {
            case 'execution_started':
              toast.info('Script execution started');
              break;
            case 'execution_completed':
              if (data.data.status === 'SUCCESS') {
                toast.success('Script completed successfully');
              } else {
                toast.error('Script execution failed');
              }
              break;
            case 'execution_cancelled':
              toast.warning('Script execution cancelled');
              break;
          }
        }
      },
      [
        'execution_started',
        'execution_completed',
        'execution_cancelled',
      ],
    );
    return () => unsubscribe();
  }, [vmId, refetchExecutions]);

  const validateInputs = () => {
    const errors = {};
    if (scriptData?.script?.parsedInputs) {
      scriptData.script.parsedInputs.forEach((input) => {
        const value = inputValues[input.name] ?? input.default ?? '';
        const err = validateScriptInput(input, value);
        if (err) errors[input.name] = err;
      });
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    if (showExecuteDialog && scriptData?.script?.parsedInputs) {
      // Intentional: live validation while the dialog is open.
       
      validateInputs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValues, showExecuteDialog, scriptData]);

  const openExecute = (script) => {
    setSelectedScript(script);
    setInputValues({});
    setValidationErrors({});
    setRunAsUser('system');
    setShowExecuteDialog(true);
  };

  const handleExecute = async () => {
    if (!validateInputs()) {
      toast.error('Please fix validation errors before executing');
      return;
    }
    try {
      const res = await executeScript({
        variables: {
          input: {
            scriptId: selectedScript.id,
            machineId: vmId,
            inputValues,
            runAs: runAsUser,
          },
        },
      });
      // ExecuteScript resolves HTTP 200 with { success, message, error } even on a
      // resolver-level failure (Apollo does not throw). Treat success:false as an
      // error: keep the dialog open and surface the server message.
      const r = res.data?.executeScript;
      if (r && r.success === false) {
        toast.error(r.error || r.message || 'Script execution failed');
        return;
      }
      toast.success('Script execution started');
      setShowExecuteDialog(false);
      setInputValues({});
      refetchExecutions();
    } catch (err) {
      toast.error(parseScriptError(err, 'script execution'));
    }
  };

  const runAsOptions = (usersData?.vmUsers || ['system', 'administrator']).map(
    (u) => ({ value: u, label: u }),
  );

  const scripts = scriptsData?.departmentScripts || [];
  const executions = executionsData?.scriptExecutions || [];

  const timelineEvents = executions.map((exec) => {
    const who = exec.triggeredBy
      ? `${exec.triggeredBy.firstName} ${exec.triggeredBy.lastName}`
      : 'System';
    return {
      id: exec.id,
      title: (
        <ResponsiveStack direction="row" gap={2} align="center" wrap>
          <span>{exec.script.name}</span>
          <Badge tone={statusToTone(exec.status)}>{exec.status}</Badge>
        </ResponsiveStack>
      ),
      description: (
        <ResponsiveStack direction="row" gap={3} align="center" justify="between">
          <span>
            {who} · {new Date(exec.createdAt).toLocaleString()}
          </span>
          {exec.status === 'SUCCESS' || exec.status === 'FAILED' ? (
            <Button
              size="sm"
              variant="ghost"
              icon={<Eye size={12} />}
              onClick={() => {
                setSelectedExecution(exec);
                setShowLogsDialog(true);
              }}
            >
              Logs
            </Button>
          ) : null}
        </ResponsiveStack>
      ),
      time: new Date(exec.createdAt).toLocaleTimeString(),
      icon: <StatusIcon status={exec.status} />,
      tone: statusToTone(exec.status),
    };
  });

  return (
    <>
      <Page>
        <Card
          variant="default"
          spotlight={false}
          glow={false}
          leadingIcon={<FileCode size={18} />}
          leadingIconTone="purple"
          title="Available scripts"
          description={`${scripts.length} script${scripts.length === 1 ? '' : 's'}`}
        >
          {scriptsLoading && !scriptsData ? (
            <LoadingOverlay label="Loading scripts…" />
          ) : scriptsError && !scriptsData ? (
            <Alert
              tone="danger"
              icon={<AlertCircle size={14} />}
              title="Could not load scripts"
              actions={
                <Button
                  size="sm"
                  variant="primary"
                  icon={<RefreshCw size={14} />}
                  onClick={() => refetchScripts()}
                >
                  Retry
                </Button>
              }
            >
              {scriptsError.message}
            </Alert>
          ) : !departmentId ? (
            <EmptyState
              variant="dashed"
              icon={<FileCode size={18} />}
              title="This desktop is not assigned to a department"
              description="Scripts are published per department. Assign this desktop to a department to run scripts here."
            />
          ) : scripts.length === 0 ? (
            <EmptyState
              variant="dashed"
              icon={<FileCode size={18} />}
              title="No scripts available for this department"
              description="Ask an admin to publish a script to your department to run it here."
            />
          ) : (
            <ResponsiveGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
              {scripts.map((script) => (
                <Card
                  key={script.id}
                  variant="default"
                  spotlight={false}
                  glow={false}
                  fullHeight
                  leadingIcon={<FileCode size={18} />}
                  leadingIconTone="sky"
                  title={script.name}
                  description={script.description || 'No description'}
                  footer={
                    <Button
                      size="sm"
                      variant="primary"
                      icon={<Play size={12} />}
                      onClick={() => openExecute(script)}
                      disabled={!isReady}
                    >
                      Run
                    </Button>
                  }
                >
                  <ResponsiveStack direction="row" gap={2} wrap>
                    {script.os.map((os) => (
                      <Badge key={os} tone="neutral">
                        {os}
                      </Badge>
                    ))}
                  </ResponsiveStack>
                </Card>
              ))}
            </ResponsiveGrid>
          )}
        </Card>

        <Card
          variant="default"
          spotlight={false}
          glow={false}
          leadingIcon={<Clock size={18} />}
          leadingIconTone="neutral"
          title="Execution history"
        >
          {executionsLoading && !executionsData ? (
            <LoadingOverlay label="Loading history…" />
          ) : executionsError && !executionsData ? (
            <Alert
              tone="danger"
              icon={<AlertCircle size={14} />}
              title="Could not load execution history"
              actions={
                <Button
                  size="sm"
                  variant="primary"
                  icon={<RefreshCw size={14} />}
                  onClick={() => refetchExecutions()}
                >
                  Retry
                </Button>
              }
            >
              {executionsError.message}
            </Alert>
          ) : executions.length === 0 ? (
            <EmptyState
              variant="dashed"
              icon={<Clock size={18} />}
              title="No script executions yet"
              description="Run a script from the list above to see its history here."
            />
          ) : (
            <Timeline events={timelineEvents} />
          )}
        </Card>
      </Page>

      <Dialog
        open={showExecuteDialog}
        onClose={() => setShowExecuteDialog(false)}
        size="lg"
      >
        <DialogTitle>
          {selectedScript ? `Execute: ${selectedScript.name}` : 'Execute script'}
        </DialogTitle>
        <DialogDescription>{selectedScript?.description}</DialogDescription>
        <DialogBody>
        <ResponsiveStack direction="col" gap={4}>
          {scriptLoading ? (
            <ResponsiveStack direction="row" gap={3} align="center" justify="center">
              <Spinner />
              <span>Loading script details…</span>
            </ResponsiveStack>
          ) : scriptData?.script?.parsedInputs?.length > 0 ? (
            <ResponsiveStack direction="col" gap={4}>
              {scriptData.script.parsedInputs.map((input) => (
                <ScriptInputRenderer
                  key={input.name}
                  input={input}
                  value={inputValues[input.name] ?? input.default ?? ''}
                  onChange={(value) =>
                    setInputValues((prev) => ({ ...prev, [input.name]: value }))
                  }
                  error={validationErrors[input.name]}
                />
              ))}
            </ResponsiveStack>
          ) : (
            <EmptyState
              variant="inline"
              icon={<FileCode size={14} />}
              title="This script has no input parameters."
            />
          )}

          {Object.keys(validationErrors).length > 0 ? (
            <Alert tone="warning">
              Please fix the errors above before executing.
            </Alert>
          ) : null}

          <FormField
            label="Run as"
            helper="On Windows, selecting Administrator or System runs with elevated privileges. Linux Run As support coming in a future update."
          >
            <Select
              value={runAsUser}
              onChange={setRunAsUser}
              options={runAsOptions}
              placeholder="Select user"
            />
          </FormField>
        </ResponsiveStack>
        </DialogBody>
        <DialogButtons align="end">
          <Button
            variant="secondary"
            onClick={() => setShowExecuteDialog(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleExecute}
            loading={executing}
            disabled={
              executing ||
              scriptLoading ||
              Object.keys(validationErrors).length > 0
            }
          >
            {executing ? 'Executing…' : 'Execute'}
          </Button>
        </DialogButtons>
      </Dialog>

      <Dialog
        open={showLogsDialog}
        onClose={() => setShowLogsDialog(false)}
        size="lg"
      >
        <DialogTitle>Execution logs</DialogTitle>
        <DialogDescription>{selectedExecution?.script?.name}</DialogDescription>
        <DialogBody>
        <ResponsiveStack direction="col" gap={4}>
          {selectedExecution?.stdout ? (
            <Card
              variant="default"
              spotlight={false}
              glow={false}
              title="Standard output"
            >
              <CodeBlock lang="bash" code={selectedExecution.stdout} />
            </Card>
          ) : null}
          {selectedExecution?.stderr ? (
            <Card
              variant="default"
              spotlight={false}
              glow={false}
              leadingIcon={<XCircle size={18} />}
              leadingIconTone="rose"
              title="Standard error"
            >
              <CodeBlock lang="bash" code={selectedExecution.stderr} />
            </Card>
          ) : null}
          {!selectedExecution?.stdout && !selectedExecution?.stderr ? (
            <EmptyState
              variant="inline"
              icon={<FileCode size={14} />}
              title="No logs available for this execution."
            />
          ) : null}
        </ResponsiveStack>
        </DialogBody>
        <DialogButtons align="end">
          <Button variant="primary" onClick={() => setShowLogsDialog(false)}>
            Close
          </Button>
        </DialogButtons>
      </Dialog>
    </>
  );
}
