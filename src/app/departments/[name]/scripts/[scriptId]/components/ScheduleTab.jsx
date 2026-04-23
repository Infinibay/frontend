'use client'

import { useState, useEffect, useMemo } from 'react'
import { gql } from '@apollo/client'
import {
  useScheduleScriptMutation,
  useScheduledScriptsQuery,
  useCancelScheduledScriptMutation,
  useUpdateScheduledScriptMutation,
  useMachinesQuery
} from '@/gql/hooks'
import {
  Card,
  Button,
  IconButton,
  Badge,
  Dialog,
  FormField,
  TextField,
  NumberField,
  Select,
  Checkbox,
  Switch,
  ToggleGroup,
  ResponsiveStack,
  Alert,
  EmptyState,
  Spinner,
  StatusDot
} from '@infinibay/harbor'
import {
  Play,
  Calendar,
  Clock,
  RefreshCw,
  Trash2,
  Edit3,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { getSocketService } from '@/services/socketService'
import { ScriptInputRenderer } from '@/components/ScriptInput/ScriptInputRenderer'
import { validateScriptInput } from '@/utils/validateScriptInput'
import { format } from 'date-fns'

export default function ScheduleTab({ scriptId, departmentId, script }) {
  // State management
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [scheduleMode, setScheduleMode] = useState('immediate')
  const [selectedVMs, setSelectedVMs] = useState([])
  const [selectAllVMs, setSelectAllVMs] = useState(true)
  const [scheduledFor, setScheduledFor] = useState('')
  const [intervalValue, setIntervalValue] = useState(1)
  const [intervalUnit, setIntervalUnit] = useState('hours')
  const [maxExecutions, setMaxExecutions] = useState(null)
  const [runIndefinitely, setRunIndefinitely] = useState(false)
  const [inputValues, setInputValues] = useState({})
  const [validationErrors, setValidationErrors] = useState({})
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [confirmAction, setConfirmAction] = useState(null)

  // Data fetching
  const {
    data: scheduledScriptsData,
    loading: schedulesLoading,
    refetch: refetchSchedules
  } = useScheduledScriptsQuery({
    variables: { filters: { scriptId, departmentId } },
    pollInterval: 30000
  })

  const { data: machinesData } = useMachinesQuery()

  const departmentVMs = useMemo(() => {
    if (!machinesData?.machines) return []
    return machinesData.machines.filter(
      (m) => m.department?.id === departmentId && m.status === 'running'
    )
  }, [machinesData, departmentId])

  // Mutations with optimistic updates
  const [scheduleScript, { loading: scheduling }] = useScheduleScriptMutation({
    optimisticResponse: () => ({
      __typename: 'Mutation',
      scheduleScript: {
        __typename: 'ScheduleScriptResponse',
        success: true,
        message: 'Scheduling...',
        executionIds: [],
        executions: [],
        warnings: null
      }
    }),
    update(cache, { data }) {
      if (data?.scheduleScript?.success && data.scheduleScript.executions) {
        cache.modify({
          fields: {
            scheduledScripts(existingRefs = [], { args }) {
              const filters = args?.filters
              if (!filters) return existingRefs
              const newExecutionRefs = data.scheduleScript.executions
                .filter((execution) => {
                  if (filters.scriptId && execution.script?.id !== filters.scriptId) return false
                  if (filters.departmentId && execution.machine?.department?.id !== filters.departmentId) return false
                  if (filters.status && Array.isArray(filters.status)) {
                    if (!filters.status.includes(execution.status)) return false
                  }
                  return true
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
                        script { id name }
                        machine { id name status department { id } }
                      }
                    `
                  })
                )
              if (newExecutionRefs.length === 0) return existingRefs
              return [...existingRefs, ...newExecutionRefs]
            }
          }
        })
      }
    },
    onCompleted: (data) => {
      if (data?.scheduleScript?.success) {
        const count = data.scheduleScript.executionIds?.length || 0
        toast.success(`Schedule created for ${count} VM${count !== 1 ? 's' : ''}`)
        if (data.scheduleScript.warnings && data.scheduleScript.warnings.length > 0) {
          const warningCount = data.scheduleScript.warnings.length
          toast.warning(
            `${warningCount} VM${warningCount > 1 ? 's are' : ' is'} offline. ${
              warningCount > 1 ? 'Schedules' : 'Schedule'
            } will execute when VM${warningCount > 1 ? 's come' : ' comes'} online.`,
            { duration: 5000 }
          )
        }
      }
    }
  })

  const [updateScheduledScript, { loading: updating }] = useUpdateScheduledScriptMutation({
    optimisticResponse: ({ input }) => ({
      __typename: 'Mutation',
      updateScheduledScript: {
        __typename: 'ScheduleScriptResponse',
        success: true,
        message: 'Updating...',
        executionIds: [input.executionId]
      }
    }),
    update(cache, { data, variables }) {
      if (data?.updateScheduledScript?.success && variables?.input) {
        const { executionId, scheduledFor, repeatIntervalMinutes, maxExecutions } = variables.input
        cache.writeFragment({
          id: cache.identify({ __typename: 'ScheduledScriptType', id: executionId }),
          fragment: gql`
            fragment UpdatedScheduledScript on ScheduledScriptType {
              id
              scheduledFor
              repeatIntervalMinutes
              maxExecutions
            }
          `,
          data: {
            __typename: 'ScheduledScriptType',
            id: executionId,
            scheduledFor: scheduledFor || null,
            repeatIntervalMinutes: repeatIntervalMinutes || null,
            maxExecutions: maxExecutions || null
          }
        })
      }
    }
  })

  const [cancelScheduledScript, { loading: cancelling }] = useCancelScheduledScriptMutation({
    optimisticResponse: ({ executionId }) => ({
      __typename: 'Mutation',
      cancelScheduledScript: {
        __typename: 'ScheduleScriptResponse',
        success: true,
        message: 'Cancelling...',
        executionIds: [executionId]
      }
    }),
    update(cache, { data, variables }) {
      if (data?.cancelScheduledScript?.success) {
        const executionId = data.cancelScheduledScript.executionIds?.[0] || variables?.executionId
        cache.modify({
          fields: {
            scheduledScripts(existingRefs = [], { readField }) {
              return existingRefs.filter((ref) => readField('id', ref) !== executionId)
            }
          }
        })
      }
    }
  })

  // WebSocket subscriptions
  useEffect(() => {
    if (!scriptId) return
    const socketService = getSocketService()
    const unsubscribeFns = []

    const unsubscribeCreated = socketService.subscribeToResource('scripts', 'schedule_created', (data) => {
      if (data.data?.scriptId === scriptId) {
        refetchSchedules()
        toast.success('Schedule created successfully')
      }
    })
    unsubscribeFns.push(unsubscribeCreated)

    const unsubscribeUpdated = socketService.subscribeToResource('scripts', 'schedule_updated', (data) => {
      if (data.data?.scriptId === scriptId) {
        refetchSchedules()
        toast.info('Schedule updated')
      }
    })
    unsubscribeFns.push(unsubscribeUpdated)

    const unsubscribeCancelled = socketService.subscribeToResource('scripts', 'schedule_cancelled', (data) => {
      if (data.data?.scriptId === scriptId) {
        refetchSchedules()
        toast.warning('Schedule cancelled')
      }
    })
    unsubscribeFns.push(unsubscribeCancelled)

    const unsubscribeStarted = socketService.subscribeToResource('scripts', 'execution_started', (data) => {
      if (data.data?.scriptId === scriptId || data.data?.script?.id === scriptId) {
        refetchSchedules()
        toast.info('Scheduled execution started')
      }
    })
    unsubscribeFns.push(unsubscribeStarted)

    const unsubscribeCompleted = socketService.subscribeToResource('scripts', 'execution_completed', (data) => {
      if (data.data?.scriptId === scriptId || data.data?.script?.id === scriptId) {
        refetchSchedules()
        if (data.data?.status === 'SUCCESS') {
          toast.success('Scheduled execution completed successfully')
        } else {
          toast.error('Scheduled execution failed')
        }
      }
    })
    unsubscribeFns.push(unsubscribeCompleted)

    return () => {
      unsubscribeFns.forEach((fn) => fn())
    }
  }, [scriptId, refetchSchedules])

  // Handlers
  const handleOpenScheduleDialog = () => {
    setScheduleMode('immediate')
    setSelectAllVMs(true)
    setSelectedVMs([])
    setScheduledFor('')
    setIntervalValue(1)
    setIntervalUnit('hours')
    setMaxExecutions(null)
    setRunIndefinitely(false)
    setInputValues({})
    setValidationErrors({})
    setEditingSchedule(null)
    setShowScheduleDialog(true)
  }

  const validateInputs = () => {
    const errors = {}
    let isValid = true
    if (script?.parsedInputs) {
      script.parsedInputs.forEach((input) => {
        const error = validateScriptInput(input, inputValues[input.name])
        if (error) {
          errors[input.name] = error
          isValid = false
        }
      })
    }
    setValidationErrors(errors)
    return isValid
  }

  const handleScheduleScript = async () => {
    if (script?.hasInputs && script?.parsedInputs) {
      const isValid = validateInputs()
      if (!isValid) {
        toast.error('Please fix validation errors before scheduling')
        return
      }
    }

    if (!selectAllVMs && selectedVMs.length === 0) {
      toast.error('Please select at least one desktop')
      return
    }

    const machineIds = selectAllVMs ? departmentVMs.map((vm) => vm.id) : selectedVMs
    const input = {
      scriptId,
      machineIds,
      inputValues,
      scheduleType:
        scheduleMode === 'immediate'
          ? 'IMMEDIATE'
          : scheduleMode === 'one-time'
          ? 'ONE_TIME'
          : 'PERIODIC'
    }

    if (scheduleMode === 'one-time') {
      if (!scheduledFor) {
        toast.error('Please select a date and time')
        return
      }
      const scheduledDate = new Date(scheduledFor)
      if (scheduledDate <= new Date()) {
        toast.error('Scheduled time must be in the future')
        return
      }
      input.scheduledFor = scheduledDate.toISOString()
    }

    if (scheduleMode === 'periodic') {
      let minutes = intervalValue
      if (intervalUnit === 'hours') minutes = intervalValue * 60
      else if (intervalUnit === 'days') minutes = intervalValue * 1440
      input.repeatIntervalMinutes = minutes
      input.maxExecutions = runIndefinitely ? null : maxExecutions
    }

    try {
      if (editingSchedule) {
        const updateInput = {
          executionId: editingSchedule.id,
          scheduledFor: input.scheduledFor,
          repeatIntervalMinutes: input.repeatIntervalMinutes,
          maxExecutions: input.maxExecutions
        }
        await updateScheduledScript({ variables: { input: updateInput } })
        toast.success('Schedule updated successfully')
      } else {
        await scheduleScript({ variables: { input } })
        toast.success('Script scheduled successfully')
      }
      setShowScheduleDialog(false)
      refetchSchedules()
    } catch (error) {
      console.error('Schedule error:', error)
      toast.error(error.message || 'Failed to schedule script')
    }
  }

  const handleCancelSchedule = (schedule) => {
    const scheduleTypeLabel = formatScheduleType(schedule.scheduleType).label
    const vmName = schedule.machine?.name || 'Unknown VM'
    const executionCount = schedule.executionCount || 0
    let description = `Are you sure you want to cancel this ${scheduleTypeLabel.toLowerCase()} schedule for ${vmName}?`
    if (schedule.scheduleType === 'PERIODIC' && executionCount > 0) {
      description += ` This schedule has run ${executionCount} time${executionCount > 1 ? 's' : ''}.`
    }
    setConfirmAction({
      type: 'cancel',
      executionId: schedule.id,
      scheduleName: `${scheduleTypeLabel} - ${vmName}`,
      description
    })
  }

  const handleCancelScheduleConfirm = async () => {
    if (!confirmAction) return
    try {
      await cancelScheduledScript({ variables: { executionId: confirmAction.executionId } })
      toast.success('Schedule cancelled')
      setConfirmAction(null)
      refetchSchedules()
    } catch (error) {
      console.error('Cancel error:', error)
      toast.error(error.message || 'Failed to cancel schedule')
      setConfirmAction(null)
    }
  }

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule)
    setScheduleMode(schedule.scheduleType.toLowerCase().replace('_', '-'))
    setSelectedVMs([schedule.machine.id])
    setSelectAllVMs(false)

    if (schedule.scheduledFor) {
      const date = new Date(schedule.scheduledFor)
      setScheduledFor(format(date, "yyyy-MM-dd'T'HH:mm"))
    }

    if (schedule.repeatIntervalMinutes) {
      const minutes = schedule.repeatIntervalMinutes
      if (minutes < 60) {
        setIntervalValue(minutes)
        setIntervalUnit('minutes')
      } else if (minutes < 1440) {
        setIntervalValue(Math.floor(minutes / 60))
        setIntervalUnit('hours')
      } else {
        setIntervalValue(Math.floor(minutes / 1440))
        setIntervalUnit('days')
      }
    }

    setMaxExecutions(schedule.maxExecutions)
    setRunIndefinitely(!schedule.maxExecutions)
    setInputValues(schedule.inputValues || {})
    setShowScheduleDialog(true)
  }

  const handleVMToggle = (vmId) => {
    setSelectedVMs((prev) =>
      prev.includes(vmId) ? prev.filter((id) => id !== vmId) : [...prev, vmId]
    )
  }

  const handleInputChange = (name, value) => {
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }

  // Helpers
  const formatScheduleType = (scheduleType) => {
    switch (scheduleType) {
      case 'IMMEDIATE':
        return { tone: 'info', label: 'Immediate' }
      case 'ONE_TIME':
        return { tone: 'purple', label: 'One-time' }
      case 'PERIODIC':
        return { tone: 'success', label: 'Periodic' }
      default:
        return { tone: 'neutral', label: scheduleType }
    }
  }

  const statusToDot = (status) => {
    switch (status) {
      case 'PENDING':
        return 'provisioning'
      case 'RUNNING':
        return 'online'
      case 'SUCCESS':
        return 'online'
      case 'FAILED':
        return 'offline'
      case 'CANCELLED':
        return 'unknown'
      default:
        return 'unknown'
    }
  }

  const formatNextExecution = (schedule) => {
    if (schedule.status === 'SUCCESS' || schedule.status === 'FAILED') return 'Completed'
    if (schedule.scheduleType === 'IMMEDIATE' && schedule.status === 'PENDING') {
      return 'Queued for execution'
    }
    if (schedule.nextExecutionAt) {
      return format(new Date(schedule.nextExecutionAt), 'PPp')
    }
    return 'N/A'
  }

  const formatInterval = (repeatIntervalMinutes) => {
    if (!repeatIntervalMinutes) return ''
    if (repeatIntervalMinutes < 60) {
      return `Every ${repeatIntervalMinutes} minute${repeatIntervalMinutes > 1 ? 's' : ''}`
    }
    if (repeatIntervalMinutes < 1440) {
      const hours = Math.floor(repeatIntervalMinutes / 60)
      return `Every ${hours} hour${hours > 1 ? 's' : ''}`
    }
    const days = Math.floor(repeatIntervalMinutes / 1440)
    return `Every ${days} day${days > 1 ? 's' : ''}`
  }

  const activeSchedules = useMemo(() => {
    if (!scheduledScriptsData?.scheduledScripts) return []
    return scheduledScriptsData.scheduledScripts.filter(
      (s) => s.status !== 'SUCCESS' && s.status !== 'FAILED' && s.status !== 'CANCELLED'
    )
  }, [scheduledScriptsData])

  // Schedule mode toggle items
  const modeItems = [
    { value: 'immediate', label: 'Immediate', icon: <Play size={14} /> },
    { value: 'one-time', label: 'One-time', icon: <Clock size={14} /> },
    { value: 'periodic', label: 'Periodic', icon: <RefreshCw size={14} /> }
  ]

  const intervalOptions = [
    { value: 'minutes', label: 'Minutes' },
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' }
  ]

  const primaryIcon =
    scheduleMode === 'immediate' ? (
      <Play size={14} />
    ) : scheduleMode === 'one-time' ? (
      <Calendar size={14} />
    ) : (
      <RefreshCw size={14} />
    )

  const primaryLabel = editingSchedule
    ? 'Update Schedule'
    : scheduleMode === 'immediate'
    ? 'Execute Now'
    : 'Create Schedule'

  const dialogFooter = (
    <ResponsiveStack direction="row" gap={2} justify="end">
      <Button variant="secondary" onClick={() => setShowScheduleDialog(false)}>
        Cancel
      </Button>
      <Button
        variant="primary"
        icon={primaryIcon}
        loading={scheduling || updating}
        onClick={handleScheduleScript}
        disabled={
          scheduling ||
          updating ||
          Object.keys(validationErrors).length > 0 ||
          (!selectAllVMs && selectedVMs.length === 0)
        }
      >
        {scheduling || updating
          ? scheduleMode === 'immediate'
            ? 'Executing...'
            : 'Scheduling...'
          : primaryLabel}
      </Button>
    </ResponsiveStack>
  )

  const confirmFooter = (
    <ResponsiveStack direction="row" gap={2} justify="end">
      <Button variant="secondary" disabled={cancelling} onClick={() => setConfirmAction(null)}>
        No, Keep Schedule
      </Button>
      <Button
        variant="destructive"
        loading={cancelling}
        onClick={handleCancelScheduleConfirm}
      >
        {cancelling ? 'Cancelling...' : 'Yes, Cancel Schedule'}
      </Button>
    </ResponsiveStack>
  )

  return (
    <ResponsiveStack direction="column" gap={6}>
      {/* Create New Schedule */}
      <Card
        variant="default"
        title="Schedule Script Execution"
        description="Execute this script immediately, schedule for later, or set up recurring executions"
      >
        <ResponsiveStack direction="column" gap={3}>
          <ResponsiveStack direction="row" gap={2}>
            <Button
              variant="primary"
              icon={<Calendar size={14} />}
              onClick={handleOpenScheduleDialog}
            >
              Schedule Execution
            </Button>
          </ResponsiveStack>
          {departmentVMs.length === 0 && (
            <Alert tone="info" size="sm">
              No running VMs available. Schedules for offline VMs will execute when the VM comes online.
            </Alert>
          )}
        </ResponsiveStack>
      </Card>

      {/* Active Schedules */}
      <Card
        variant="default"
        title="Active Schedules"
        header={
          activeSchedules.length > 0 ? (
            <Badge tone="info">{activeSchedules.length}</Badge>
          ) : null
        }
      >
        {schedulesLoading ? (
          <ResponsiveStack direction="row" gap={2} justify="center" align="center">
            <Spinner />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Loading schedules...</span>
          </ResponsiveStack>
        ) : activeSchedules.length === 0 ? (
          <EmptyState
            icon={<Calendar size={40} />}
            title="No active schedules"
            description='Click "Schedule Execution" to create a new schedule'
          />
        ) : (
          <ResponsiveStack direction="column" gap={2}>
            {activeSchedules.map((schedule) => {
              const { tone, label } = formatScheduleType(schedule.scheduleType)
              const isOffline = schedule.machine?.status !== 'running'
              return (
                <Card key={schedule.id} variant="default">
                  <ResponsiveStack direction="row" gap={3} justify="between" align="start">
                    <ResponsiveStack direction="column" gap={1} style={{ flex: 1, minWidth: 0 }}>
                      <ResponsiveStack direction="row" gap={2} align="center" wrap>
                        <Badge tone={tone}>{label}</Badge>
                        <StatusDot status={statusToDot(schedule.status)} label={schedule.status} />
                        <strong style={{ fontSize: '0.875rem' }}>{schedule.machine.name}</strong>
                      </ResponsiveStack>
                      <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
                        Next execution: {formatNextExecution(schedule)}
                      </span>
                      {schedule.scheduleType === 'PERIODIC' && (
                        <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
                          {formatInterval(schedule.repeatIntervalMinutes)}
                          {schedule.maxExecutions && (
                            <> ({schedule.executionCount || 0}/{schedule.maxExecutions} executions)</>
                          )}
                        </span>
                      )}
                    </ResponsiveStack>
                    <ResponsiveStack direction="row" gap={1} align="center">
                      {isOffline && (
                        <Badge tone="warning" icon={<AlertCircle size={12} />}>
                          VM Offline
                        </Badge>
                      )}
                      {schedule.status === 'PENDING' && !isOffline && (
                        <IconButton
                          variant="ghost"
                          size="sm"
                          label="Edit schedule"
                          icon={<Edit3 size={16} />}
                          onClick={() => handleEditSchedule(schedule)}
                        />
                      )}
                      {schedule.status === 'PENDING' && isOffline && (
                        <IconButton
                          variant="ghost"
                          size="sm"
                          label="Cannot edit schedule while desktop is offline"
                          icon={<Edit3 size={16} />}
                          disabled
                        />
                      )}
                      {(schedule.status === 'PENDING' || schedule.status === 'RUNNING') && (
                        <IconButton
                          variant="ghost"
                          size="sm"
                          label="Cancel schedule"
                          icon={<Trash2 size={16} />}
                          onClick={() => handleCancelSchedule(schedule)}
                        />
                      )}
                    </ResponsiveStack>
                  </ResponsiveStack>
                </Card>
              )
            })}
          </ResponsiveStack>
        )}
      </Card>

      {/* Schedule Dialog */}
      <Dialog
        open={showScheduleDialog}
        onClose={() => setShowScheduleDialog(false)}
        size="lg"
        title={`${editingSchedule ? 'Edit Schedule' : 'Schedule Script'}: ${script?.name || ''}`}
        footer={dialogFooter}
        footerAlign="end"
      >
        <ResponsiveStack direction="column" gap={5}>
          {/* Schedule Mode */}
          <FormField label="Schedule Type">
            <ToggleGroup
              items={modeItems}
              value={scheduleMode}
              onChange={(v) => !editingSchedule && setScheduleMode(v)}
            />
          </FormField>

          {/* VM Selection */}
          {!editingSchedule && (
            <FormField label="Target desktops">
              <ResponsiveStack direction="column" gap={3}>
                <Checkbox
                  checked={selectAllVMs}
                  onChange={(e) => setSelectAllVMs(e.target.checked)}
                  label={`Select all desktops in department (${departmentVMs.length} desktop${departmentVMs.length === 1 ? '' : 's'})`}
                />
                {!selectAllVMs && (
                  <Card variant="default">
                    <ResponsiveStack direction="column" gap={2}>
                      {departmentVMs.map((vm) => (
                        <ResponsiveStack
                          key={vm.id}
                          direction="row"
                          gap={2}
                          align="center"
                          justify="between"
                        >
                          <Checkbox
                            checked={selectedVMs.includes(vm.id)}
                            onChange={() => handleVMToggle(vm.id)}
                            label={vm.name}
                          />
                          <Badge tone="neutral">{vm.status}</Badge>
                        </ResponsiveStack>
                      ))}
                    </ResponsiveStack>
                  </Card>
                )}
                {!selectAllVMs && selectedVMs.length === 0 && (
                  <Alert tone="danger" size="sm">
                    Please select at least one VM
                  </Alert>
                )}
              </ResponsiveStack>
            </FormField>
          )}

          {/* One-time configuration */}
          {scheduleMode === 'one-time' && (
            <FormField
              label="Execution Date & Time"
              helper="Select when to execute the script"
            >
              <TextField
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              />
            </FormField>
          )}

          {/* Periodic configuration */}
          {scheduleMode === 'periodic' && (
            <>
              <FormField label="Repeat Interval" helper="How often to execute the script">
                <ResponsiveStack direction="row" gap={2} align="center">
                  <NumberField
                    min={1}
                    value={intervalValue}
                    onChange={(v) => setIntervalValue(v || 1)}
                  />
                  <Select
                    options={intervalOptions}
                    value={intervalUnit}
                    onChange={setIntervalUnit}
                  />
                </ResponsiveStack>
              </FormField>

              <FormField
                label="Maximum Executions (Optional)"
                helper="Leave empty or toggle 'Run indefinitely' for unlimited executions"
              >
                <ResponsiveStack direction="column" gap={2}>
                  <Switch
                    checked={runIndefinitely}
                    onChange={(e) => {
                      const checked = e.target.checked
                      setRunIndefinitely(checked)
                      if (checked) setMaxExecutions(null)
                    }}
                    label="Run indefinitely"
                  />
                  {!runIndefinitely && (
                    <NumberField
                      min={1}
                      value={maxExecutions || undefined}
                      onChange={(v) => setMaxExecutions(v || null)}
                    />
                  )}
                </ResponsiveStack>
              </FormField>
            </>
          )}

          {/* Script inputs */}
          {script?.hasInputs && script?.parsedInputs && (
            <FormField label="Script Parameters">
              <ResponsiveStack direction="column" gap={3}>
                {script.parsedInputs.map((input) => (
                  <ScriptInputRenderer
                    key={input.name}
                    input={input}
                    value={inputValues[input.name]}
                    onChange={(value) => handleInputChange(input.name, value)}
                    error={validationErrors[input.name]}
                  />
                ))}
              </ResponsiveStack>
            </FormField>
          )}

          {Object.keys(validationErrors).length > 0 && (
            <Alert tone="warning" title="Validation errors">
              Please fix the errors above before scheduling
            </Alert>
          )}
        </ResponsiveStack>
      </Dialog>

      {/* Confirm Cancel Dialog */}
      <Dialog
        open={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        size="sm"
        title="Cancel Schedule?"
        description={confirmAction?.description}
        footer={confirmFooter}
        footerAlign="end"
      >
        {confirmAction?.scheduleName && (
          <Alert tone="info" size="sm" title="Schedule">
            {confirmAction.scheduleName}
          </Alert>
        )}
      </Dialog>
    </ResponsiveStack>
  )
}
