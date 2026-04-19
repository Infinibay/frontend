'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardGrid,
  Button,
  ButtonGroup,
  Badge,
  Dialog,
  Select,
  Spinner,
  Alert,
  EmptyState,
  Timeline,
} from '@infinibay/harbor';
import {
  Play,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  FileCode,
} from 'lucide-react';
import {
  useDepartmentScriptsQuery,
  useScriptExecutionsQuery,
  useExecuteScriptMutation,
  useScriptQuery,
  useVmUsersQuery,
} from '@/gql/hooks';
import { ScriptInputRenderer } from '@/components/ScriptInput/ScriptInputRenderer';
import { getSocketService } from '@/services/socketService';
import { toast } from 'sonner';
import { validateScriptInput } from '@/utils/validateScriptInput';
import { parseScriptError } from '@/utils/parseScriptError';

/** Map execution status → Timeline event tone. */
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

/** Pick an icon for a given status. */
const StatusIcon = ({ status, className }) => {
  switch (status) {
    case 'RUNNING':
      return <Clock className={`${className} animate-spin`} />;
    case 'PENDING':
      return <Clock className={className} />;
    case 'SUCCESS':
      return <CheckCircle className={className} />;
    case 'FAILED':
    case 'TIMEOUT':
      return <XCircle className={className} />;
    case 'CANCELLED':
      return <AlertCircle className={className} />;
    default:
      return <Clock className={className} />;
  }
};

export default function VMScriptsTab({ vmId, vmStatus, departmentId }) {
  const [selectedScript, setSelectedScript] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const [showLogsDialog, setShowLogsDialog] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState(null);
  const [runAsUser, setRunAsUser] = useState('system');
  const [validationErrors, setValidationErrors] = useState({});

  const { data: scriptsData, loading: scriptsLoading } = useDepartmentScriptsQuery({
    variables: { departmentId },
    skip: !departmentId,
  });

  const {
    data: executionsData,
    loading: executionsLoading,
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
    skip: !vmId || vmStatus !== 'running',
  });

  const [executeScript, { loading: executing }] = useExecuteScriptMutation();

  // Live WebSocket subscription for script events.
  useEffect(() => {
    const socketService = getSocketService();
    const unsubscribe = socketService.subscribeToAllResourceEvents(
      'scripts',
      (action, data) => {
        if (data.data.machineId === vmId) {
          refetchExecutions();
          switch (action) {
            case 'script_execution_started':
              toast.info(`Script execution started: ${data.data.scriptName}`);
              break;
            case 'script_execution_completed':
              if (data.data.status === 'SUCCESS') {
                toast.success('Script completed successfully');
              } else {
                toast.error('Script execution failed');
              }
              break;
            case 'script_execution_cancelled':
              toast.warning('Script execution cancelled');
              break;
          }
        }
      },
      ['script_execution_started', 'script_execution_completed', 'script_execution_cancelled']
    );
    return () => unsubscribe();
  }, [vmId, refetchExecutions]);

  useEffect(() => {
    if (showExecuteDialog && scriptData?.script?.parsedInputs) {
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

  const handleExecute = async () => {
    if (!validateInputs()) {
      toast.error('Please fix validation errors before executing');
      return;
    }

    try {
      await executeScript({
        variables: {
          input: {
            scriptId: selectedScript.id,
            machineId: vmId,
            inputValues,
            runAs: runAsUser,
          },
        },
      });
      toast.success('Script execution started');
      setShowExecuteDialog(false);
      setInputValues({});
      refetchExecutions();
    } catch (err) {
      toast.error(parseScriptError(err, 'script execution'));
    }
  };

  const runAsOptions = (usersData?.vmUsers || ['system', 'administrator']).map((u) => ({
    value: u,
    label: u,
  }));

  const scripts = scriptsData?.departmentScripts || [];
  const executions = executionsData?.scriptExecutions || [];

  const timelineEvents = executions.map((exec) => {
    const who = exec.triggeredBy
      ? `${exec.triggeredBy.firstName} ${exec.triggeredBy.lastName}`
      : 'System';
    return {
      id: exec.id,
      title: (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-fg">{exec.script.name}</span>
          <Badge tone={statusToTone(exec.status)}>{exec.status}</Badge>
        </div>
      ),
      description: (
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-fg-muted">
            {who} · {new Date(exec.createdAt).toLocaleString()}
          </span>
          {(exec.status === 'SUCCESS' || exec.status === 'FAILED') && (
            <Button
              size="sm"
              variant="ghost"
              icon={<Eye className="h-3.5 w-3.5" />}
              onClick={() => {
                setSelectedExecution(exec);
                setShowLogsDialog(true);
              }}
            >
              Logs
            </Button>
          )}
        </div>
      ),
      time: new Date(exec.createdAt).toLocaleTimeString(),
      icon: <StatusIcon status={exec.status} className="h-4 w-4" />,
      tone: statusToTone(exec.status),
    };
  });

  return (
    <div className="space-y-6">
      {/* Available scripts */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-fg">
          <FileCode className="h-4 w-4 text-accent-2" />
          Available scripts
          <span className="text-xs text-fg-muted font-normal">
            ({scripts.length})
          </span>
        </div>

        {scriptsLoading ? (
          <div className="flex items-center justify-center py-10 gap-2 text-fg-muted">
            <Spinner />
            <span>Loading scripts…</span>
          </div>
        ) : scripts.length === 0 ? (
          <EmptyState
            icon={<FileCode className="h-10 w-10 text-fg-subtle" />}
            title="No scripts available for this department"
            description="Ask an admin to publish a script to your department to run it here."
          />
        ) : (
          <CardGrid cols={3}>
            {scripts.map((script) => (
              <Card
                key={script.id}
                variant="solid"
                interactive
                className="p-4 flex flex-col gap-3"
              >
                <div>
                  <h3 className="font-medium text-fg truncate">{script.name}</h3>
                  <p className="text-xs text-fg-muted line-clamp-2 mt-1">
                    {script.description || 'No description'}
                  </p>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {script.os.map((os) => (
                    <Badge key={os} tone="neutral" className="text-[10px]">
                      {os}
                    </Badge>
                  ))}
                </div>
                <div className="mt-auto">
                  <Button
                    size="sm"
                    icon={<Play className="h-3.5 w-3.5" />}
                    onClick={() => openExecute(script)}
                    disabled={vmStatus !== 'running'}
                  >
                    Run
                  </Button>
                </div>
              </Card>
            ))}
          </CardGrid>
        )}
      </section>

      {/* Execution history */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-fg">
          <Clock className="h-4 w-4 text-fg-muted" />
          Execution history
        </div>

        {executionsLoading ? (
          <div className="flex items-center justify-center py-10 gap-2 text-fg-muted">
            <Spinner />
            <span>Loading history…</span>
          </div>
        ) : executions.length === 0 ? (
          <EmptyState
            icon={<Clock className="h-10 w-10 text-fg-subtle" />}
            title="No script executions yet"
            description="Run a script from the list above to see its history here."
          />
        ) : (
          <Card variant="default" className="p-6">
            <Timeline events={timelineEvents} />
          </Card>
        )}
      </section>

      {/* Execute dialog */}
      <Dialog
        open={showExecuteDialog}
        onClose={() => setShowExecuteDialog(false)}
        size="lg"
        title={selectedScript ? `Execute: ${selectedScript.name}` : 'Execute script'}
        description={selectedScript?.description}
        footer={
          <ButtonGroup className="justify-end">
            <Button
              variant="secondary"
              onClick={() => setShowExecuteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleExecute}
              loading={executing}
              disabled={executing || scriptLoading || Object.keys(validationErrors).length > 0}
            >
              {executing ? 'Executing…' : 'Execute'}
            </Button>
          </ButtonGroup>
        }
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {scriptLoading ? (
            <div className="flex items-center justify-center py-8 gap-2 text-fg-muted">
              <Spinner />
              <span>Loading script details…</span>
            </div>
          ) : scriptData?.script?.parsedInputs?.length > 0 ? (
            <div className="space-y-4">
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
            </div>
          ) : (
            <p className="text-fg-muted text-sm">This script has no input parameters.</p>
          )}

          {Object.keys(validationErrors).length > 0 && (
            <Alert tone="warning">
              Please fix the errors above before executing.
            </Alert>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-fg">Run as</label>
            <Select
              value={runAsUser}
              onChange={setRunAsUser}
              options={runAsOptions}
              placeholder="Select user"
            />
            <p className="text-xs text-fg-muted">
              On Windows, selecting Administrator or System runs with elevated privileges.
              Linux Run As support coming in a future update.
            </p>
          </div>
        </div>
      </Dialog>

      {/* Logs dialog */}
      <Dialog
        open={showLogsDialog}
        onClose={() => setShowLogsDialog(false)}
        size="lg"
        title="Execution logs"
        description={selectedExecution?.script?.name}
      >
        <div className="space-y-4 max-h-[65vh] overflow-y-auto">
          {selectedExecution?.stdout && (
            <div>
              <h3 className="font-medium text-fg mb-2 text-sm">Standard output</h3>
              <pre className="p-4 bg-surface-1 border border-white/8 rounded-lg text-xs font-mono overflow-x-auto text-fg whitespace-pre-wrap">
                {selectedExecution.stdout}
              </pre>
            </div>
          )}
          {selectedExecution?.stderr && (
            <div>
              <h3 className="font-medium text-danger mb-2 text-sm">Standard error</h3>
              <pre className="p-4 bg-danger/10 border border-danger/30 rounded-lg text-xs font-mono overflow-x-auto text-fg whitespace-pre-wrap">
                {selectedExecution.stderr}
              </pre>
            </div>
          )}
          {!selectedExecution?.stdout && !selectedExecution?.stderr && (
            <p className="text-fg-muted text-sm">No logs available for this execution.</p>
          )}
        </div>
      </Dialog>
    </div>
  );
}
