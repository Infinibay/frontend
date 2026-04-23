'use client';

import { useEffect, useMemo, useState } from 'react';
import { gql } from '@apollo/client';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  AlertCircle,
  Calendar as CalendarIcon,
  Clock,
  Play,
  RefreshCw,
} from 'lucide-react';
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Dialog,
  FormField,
  LoadingOverlay,
  NumberField,
  ResponsiveStack,
  SegmentedControl,
  Select,
  TextField,
} from '@infinibay/harbor';

import {
  useMachinesQuery,
  useScheduleScriptMutation,
  useScriptQuery,
} from '@/gql/hooks';
import { ScriptInputRenderer } from '@/components/ScriptInput/ScriptInputRenderer';
import { validateScriptInput } from '@/utils/validateScriptInput';

const SCHEDULE_MODES = [
  { value: 'immediate', label: 'Immediate', icon: <Play size={12} /> },
  { value: 'one-time', label: 'One-time', icon: <Clock size={12} /> },
  { value: 'periodic', label: 'Periodic', icon: <RefreshCw size={12} /> },
];

const INTERVAL_UNITS = [
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
];

export default function ScheduleScriptDialog({
  open,
  onOpenChange,
  scriptId,
  scriptName,
  departmentId,
  departmentName,
}) {
  const [scheduleMode, setScheduleMode] = useState('immediate');
  const [selectedVMs, setSelectedVMs] = useState([]);
  const [selectAllVMs, setSelectAllVMs] = useState(true);
  const [scheduledFor, setScheduledFor] = useState('');
  const [intervalValue, setIntervalValue] = useState(1);
  const [intervalUnit, setIntervalUnit] = useState('hours');
  const [maxExecutions, setMaxExecutions] = useState(null);
  const [runIndefinitely, setRunIndefinitely] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  const {
    data: scriptData,
    loading: scriptLoading,
    error: scriptError,
  } = useScriptQuery({
    variables: { id: scriptId },
    skip: !open || !scriptId,
  });

  const script = scriptData?.script;

  const { data: machinesData } = useMachinesQuery();

  const departmentVMs = useMemo(() => {
    if (!machinesData?.machines) return [];
    return machinesData.machines.filter(
      (m) => m.department?.id === departmentId,
    );
  }, [machinesData, departmentId]);

  const [scheduleScript, { loading: scheduling }] = useScheduleScriptMutation({
    optimisticResponse: () => ({
      __typename: 'Mutation',
      scheduleScript: {
        __typename: 'ScheduleScriptResponse',
        success: true,
        message: 'Scheduling...',
        executionIds: [],
        executions: [],
        warnings: null,
      },
    }),
    update(cache, { data }) {
      if (data?.scheduleScript?.success && data.scheduleScript.executions) {
        cache.modify({
          fields: {
            scheduledScripts(existingRefs = [], { args }) {
              const filters = args?.filters;
              if (!filters) return existingRefs;
              const newRefs = data.scheduleScript.executions
                .filter((execution) => {
                  if (
                    filters.scriptId &&
                    execution.script?.id !== filters.scriptId
                  )
                    return false;
                  if (
                    filters.departmentId &&
                    execution.machine?.department?.id !== filters.departmentId
                  )
                    return false;
                  if (
                    filters.status &&
                    Array.isArray(filters.status) &&
                    !filters.status.includes(execution.status)
                  )
                    return false;
                  return true;
                })
                .map((execution) =>
                  cache.writeFragment({
                    data: execution,
                    fragment: gql`
                      fragment NewScheduledScript on ScheduledScriptType {
                        id
                        status
                        scheduledFor
                        repeatIntervalMinutes
                        maxExecutions
                        executionCount
                        scheduleType
                        nextExecutionAt
                        isActive
                        script {
                          id
                          name
                        }
                        machine {
                          id
                          name
                          status
                          department {
                            id
                          }
                        }
                      }
                    `,
                  }),
                );
              if (newRefs.length === 0) return existingRefs;
              return [...existingRefs, ...newRefs];
            },
          },
        });
      }
    },
    onCompleted: (data) => {
      if (data?.scheduleScript?.success) {
        const count = data.scheduleScript.executionIds?.length || 0;
        toast.success(
          `Schedule created for ${count} VM${count !== 1 ? 's' : ''}`,
        );
        if (data.scheduleScript.warnings?.length) {
          const wc = data.scheduleScript.warnings.length;
          toast.warning(
            `${wc} VM${wc > 1 ? 's are' : ' is'} offline. ${
              wc > 1 ? 'Schedules' : 'Schedule'
            } will execute when VM${wc > 1 ? 's come' : ' comes'} online.`,
            { duration: 5000 },
          );
        }
        onOpenChange(false);
      }
    },
    onError: (error) => {
      console.error('Schedule error:', error);
      toast.error(error.message || 'Failed to schedule script');
    },
  });

  useEffect(() => {
    if (open) {
      // Intentional: reset all dialog state to defaults when re-opened.
      /* eslint-disable react-hooks/set-state-in-effect */
      setScheduleMode('immediate');
      setSelectAllVMs(true);
      setSelectedVMs([]);
      setScheduledFor('');
      setIntervalValue(1);
      setIntervalUnit('hours');
      setMaxExecutions(null);
      setRunIndefinitely(false);
      setInputValues({});
      setValidationErrors({});
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [open]);

  const validateInputs = () => {
    const errors = {};
    let isValid = true;
    if (script?.parsedInputs) {
      script.parsedInputs.forEach((input) => {
        const err = validateScriptInput(input, inputValues[input.name]);
        if (err) {
          errors[input.name] = err;
          isValid = false;
        }
      });
    }
    setValidationErrors(errors);
    return isValid;
  };

  const handleScheduleScript = async () => {
    if (script?.hasInputs && script?.parsedInputs && !validateInputs()) {
      toast.error('Please fix validation errors before scheduling');
      return;
    }
    if (!selectAllVMs && selectedVMs.length === 0) {
      toast.error('Please select at least one desktop');
      return;
    }
    const machineIds = selectAllVMs
      ? departmentVMs.map((vm) => vm.id)
      : selectedVMs;
    const input = {
      scriptId,
      machineIds,
      inputValues,
      scheduleType:
        scheduleMode === 'immediate'
          ? 'IMMEDIATE'
          : scheduleMode === 'one-time'
            ? 'ONE_TIME'
            : 'PERIODIC',
    };
    if (scheduleMode === 'one-time') {
      if (!scheduledFor) {
        toast.error('Please select a date and time');
        return;
      }
      const d = new Date(scheduledFor);
      if (d <= new Date()) {
        toast.error('Scheduled time must be in the future');
        return;
      }
      input.scheduledFor = d.toISOString();
    }
    if (scheduleMode === 'periodic') {
      let minutes = intervalValue;
      if (intervalUnit === 'hours') minutes = intervalValue * 60;
      else if (intervalUnit === 'days') minutes = intervalValue * 1440;
      input.repeatIntervalMinutes = minutes;
      input.maxExecutions = runIndefinitely ? null : maxExecutions;
    }
    try {
      await scheduleScript({ variables: { input } });
    } catch (error) {
      console.error('Schedule error:', error);
    }
  };

  const handleVMToggle = (vmId) => {
    setSelectedVMs((prev) =>
      prev.includes(vmId) ? prev.filter((id) => id !== vmId) : [...prev, vmId],
    );
  };

  const handleInputChange = (name, value) => {
    setInputValues((prev) => ({ ...prev, [name]: value }));
    if (script?.parsedInputs) {
      const inp = script.parsedInputs.find((i) => i.name === name);
      if (inp) {
        const err = validateScriptInput(inp, value);
        setValidationErrors((prev) => {
          const next = { ...prev };
          if (err) next[name] = err;
          else delete next[name];
          return next;
        });
      }
    }
  };

  const isSubmitDisabled = useMemo(
    () =>
      scheduling ||
      Object.keys(validationErrors).length > 0 ||
      (!selectAllVMs && selectedVMs.length === 0) ||
      (selectAllVMs && departmentVMs.length === 0),
    [
      scheduling,
      validationErrors,
      selectAllVMs,
      selectedVMs,
      departmentVMs,
    ],
  );

  if (scriptError) {
    return (
      <Dialog
        open={open}
        onClose={() => onOpenChange(false)}
        size="lg"
        title="Error loading script"
        footer={
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        }
      >
        <Alert tone="danger" icon={<AlertCircle size={16} />}>
          Failed to load script details. Please try again.
        </Alert>
      </Dialog>
    );
  }

  const submitIcon =
    scheduleMode === 'immediate' ? (
      <Play size={14} />
    ) : scheduleMode === 'one-time' ? (
      <CalendarIcon size={14} />
    ) : (
      <RefreshCw size={14} />
    );
  const submitLabel = scheduling
    ? scheduleMode === 'immediate'
      ? 'Executing…'
      : 'Scheduling…'
    : scheduleMode === 'immediate'
      ? 'Execute now'
      : 'Create schedule';

  const allOffline =
    departmentVMs.length > 0 &&
    departmentVMs.every((vm) => vm.status !== 'running');

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      size="lg"
      title={`Schedule script: ${scriptName}`}
      footerAlign="end"
      footer={
        <ResponsiveStack direction="row" gap={2} justify="end">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            leadingIcon={submitIcon}
            disabled={isSubmitDisabled}
            loading={scheduling}
            onClick={handleScheduleScript}
          >
            {submitLabel}
          </Button>
        </ResponsiveStack>
      }
    >
      <LoadingOverlay active={scriptLoading} label="Loading script…">
        <ResponsiveStack direction="col" gap={5}>
          <FormField label="Schedule type">
            <SegmentedControl
              items={SCHEDULE_MODES}
              value={scheduleMode}
              onChange={setScheduleMode}
            />
          </FormField>

          <FormField
            label="Target desktops"
            helper={`${departmentVMs.length} desktop${departmentVMs.length === 1 ? '' : 's'} in ${departmentName}`}
          >
            <ResponsiveStack direction="col" gap={2}>
              <Checkbox
                label={`Select all VMs in ${departmentName}`}
                checked={selectAllVMs}
                onChange={(e) => setSelectAllVMs(e.target.checked)}
              />
              {!selectAllVMs ? (
                <ResponsiveStack direction="col" gap={1}>
                  {departmentVMs.length === 0 ? (
                    <Alert tone="warning" size="sm">
                      No VMs available in this department.
                    </Alert>
                  ) : (
                    departmentVMs.map((vm) => (
                      <ResponsiveStack
                        key={vm.id}
                        direction="row"
                        gap={2}
                        align="center"
                      >
                        <Checkbox
                          label={vm.name}
                          checked={selectedVMs.includes(vm.id)}
                          onChange={() => handleVMToggle(vm.id)}
                        />
                        <Badge tone="neutral">{vm.status}</Badge>
                      </ResponsiveStack>
                    ))
                  )}
                </ResponsiveStack>
              ) : null}
              {!selectAllVMs &&
              selectedVMs.length === 0 &&
              departmentVMs.length > 0 ? (
                <Alert tone="danger" size="sm">
                  Please select at least one VM.
                </Alert>
              ) : null}
              {departmentVMs.length === 0 ? (
                <Alert tone="warning" size="sm">
                  No VMs available in this department.
                </Alert>
              ) : null}
              {allOffline ? (
                <Alert tone="warning" size="sm">
                  All VMs are offline. Schedules will execute when VMs come
                  online.
                </Alert>
              ) : null}
            </ResponsiveStack>
          </FormField>

          {scheduleMode === 'one-time' ? (
            <FormField
              label="Execution date & time"
              helper="Select when to execute the script"
            >
              <TextField
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              />
            </FormField>
          ) : null}

          {scheduleMode === 'periodic' ? (
            <ResponsiveStack direction="col" gap={4}>
              <FormField
                label="Repeat interval"
                helper="How often to execute the script"
              >
                <ResponsiveStack direction="row" gap={2} align="center">
                  <NumberField
                    min={1}
                    value={intervalValue}
                    onChange={(v) => setIntervalValue(Number(v) || 1)}
                  />
                  <Select
                    value={intervalUnit}
                    onChange={setIntervalUnit}
                    options={INTERVAL_UNITS}
                  />
                </ResponsiveStack>
              </FormField>

              <FormField
                label="Maximum executions"
                optional
                helper="Leave empty or check 'Run indefinitely' for unlimited executions"
              >
                <ResponsiveStack direction="col" gap={2}>
                  <Checkbox
                    label="Run indefinitely"
                    checked={runIndefinitely}
                    onChange={(e) => {
                      setRunIndefinitely(e.target.checked);
                      if (e.target.checked) setMaxExecutions(null);
                    }}
                  />
                  {!runIndefinitely ? (
                    <NumberField
                      min={1}
                      value={maxExecutions || ''}
                      onChange={(v) =>
                        setMaxExecutions(v ? parseInt(v, 10) : null)
                      }
                      placeholder="Leave empty for unlimited"
                    />
                  ) : null}
                </ResponsiveStack>
              </FormField>
            </ResponsiveStack>
          ) : null}

          {script?.hasInputs && script?.parsedInputs?.length ? (
            <FormField label="Script parameters">
              <ResponsiveStack direction="col" gap={3}>
                {script.parsedInputs.map((input) => (
                  <ScriptInputRenderer
                    key={input.name}
                    input={input}
                    value={inputValues[input.name]}
                    onChange={(value) =>
                      handleInputChange(input.name, value)
                    }
                    error={validationErrors[input.name]}
                  />
                ))}
              </ResponsiveStack>
            </FormField>
          ) : null}

          {Object.keys(validationErrors).length > 0 ? (
            <Alert
              tone="warning"
              size="sm"
              icon={<AlertCircle size={14} />}
            >
              Please fix the errors above before scheduling.
            </Alert>
          ) : null}
        </ResponsiveStack>
      </LoadingOverlay>
    </Dialog>
  );
}
