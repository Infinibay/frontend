'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  useScheduleScriptMutation,
  useScheduledScriptsQuery,
  useCancelScheduledScriptMutation,
  useUpdateScheduledScriptMutation,
  useMachinesQuery
} from '@/gql/hooks'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Play,
  Calendar,
  Clock,
  RefreshCw,
  Trash2,
  Edit3,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getGlassClasses } from '@/utils/glass-effects'
import { getSocketService } from '@/services/socketService'
import { ScriptInputRenderer } from '@/components/ScriptInput/ScriptInputRenderer'
import { validateScriptInput } from '@/utils/validateScriptInput'
import { format, addMinutes, addHours, addDays } from 'date-fns'

export default function ScheduleTab({ scriptId, departmentId, departmentName, script }) {
  const router = useRouter()

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
  const [confirmAction, setConfirmAction] = useState(null) // { type: 'cancel', executionId: string, scheduleName: string, description: string }

  // Data fetching
  const {
    data: scheduledScriptsData,
    loading: schedulesLoading,
    refetch: refetchSchedules
  } = useScheduledScriptsQuery({
    variables: { filters: { scriptId, departmentId } },
    pollInterval: 30000 // Poll every 30 seconds
  })

  const { data: machinesData } = useMachinesQuery()

  // Filter running VMs in the department
  const departmentVMs = useMemo(() => {
    if (!machinesData?.machines) return []
    return machinesData.machines.filter(
      (machine) =>
        machine.department?.id === departmentId && machine.status === 'running'
    )
  }, [machinesData, departmentId])

  // Mutations with optimistic updates
  const [scheduleScript, { loading: scheduling }] = useScheduleScriptMutation({
    optimisticResponse: ({ input }) => ({
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
        // Insert new executions into cache with arg-aware field function
        cache.modify({
          fields: {
            scheduledScripts(existingRefs = [], { args, toReference }) {
              // Only update if args match the current query filters
              const filters = args?.filters
              if (!filters) return existingRefs

              // Check if new executions match the query filters
              const newExecutionRefs = data.scheduleScript.executions
                .filter(execution => {
                  // Match scriptId filter
                  if (filters.scriptId && execution.script?.id !== filters.scriptId) {
                    return false
                  }
                  // Match departmentId filter
                  if (filters.departmentId && execution.machine?.department?.id !== filters.departmentId) {
                    return false
                  }
                  // Match status filter
                  if (filters.status && Array.isArray(filters.status)) {
                    if (!filters.status.includes(execution.status)) {
                      return false
                    }
                  }
                  return true
                })
                .map(execution =>
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

        // Show warnings if present
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
  const [updateScheduledScript, { loading: updating }] =
    useUpdateScheduledScriptMutation({
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

          // Update the specific execution in cache
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
        // Use executionId from response or variables
        const executionId = data.cancelScheduledScript.executionIds?.[0] || variables?.executionId

        // Remove cancelled schedule from cache
        cache.modify({
          fields: {
            scheduledScripts(existingRefs = [], { readField }) {
              return existingRefs.filter(
                ref => readField('id', ref) !== executionId
              )
            }
          }
        })
      }
    }
  })

  // WebSocket subscription - Fixed to use correct event patterns
  useEffect(() => {
    if (!scriptId) return

    const socketService = getSocketService()
    const unsubscribeFns = []

    // Subscribe to schedule events for this script
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
      unsubscribeFns.forEach(fn => fn())
    }
  }, [scriptId, refetchSchedules])

  // Handler functions
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

  const handleScheduleScript = async () => {
    // Validate inputs
    if (script?.hasInputs && script?.parsedInputs) {
      const isValid = validateInputs()
      if (!isValid) {
        toast.error('Please fix validation errors before scheduling')
        return
      }
    }

    // Validate VM selection
    if (!selectAllVMs && selectedVMs.length === 0) {
      toast.error('Please select at least one VM')
      return
    }

    // Build schedule input - only schedule running VMs (no departmentId to avoid unintended targets)
    const machineIds = selectAllVMs
      ? departmentVMs.map((vm) => vm.id)
      : selectedVMs

    const input = {
      scriptId,
      machineIds,
      inputValues,
      scheduleType: scheduleMode === 'immediate' ? 'IMMEDIATE' : scheduleMode === 'one-time' ? 'ONE_TIME' : 'PERIODIC'
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
        await updateScheduledScript({
          variables: { input: updateInput }
        })
        toast.success('Schedule updated successfully')
      } else {
        await scheduleScript({
          variables: { input }
        })
        toast.success('Script scheduled successfully')
      }

      setShowScheduleDialog(false)
      refetchSchedules()
    } catch (error) {
      console.error('Schedule error:', error)
      toast.error(error.message || 'Failed to schedule script')
    }
  }

  // Show confirmation dialog for cancel action
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

  // Actually cancel the schedule after confirmation
  const handleCancelScheduleConfirm = async () => {
    if (!confirmAction) return

    try {
      await cancelScheduledScript({
        variables: { executionId: confirmAction.executionId }
      })
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
    setScheduleMode(schedule.scheduleType.toLowerCase())
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

  const handleVMToggle = (vmId) => {
    setSelectedVMs((prev) =>
      prev.includes(vmId) ? prev.filter((id) => id !== vmId) : [...prev, vmId]
    )
  }

  const handleInputChange = (name, value) => {
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }

  // Helper functions
  const formatScheduleType = (scheduleType) => {
    switch (scheduleType) {
      case 'IMMEDIATE':
        return { variant: 'default', label: 'Immediate' }
      case 'ONE_TIME':
        return { variant: 'secondary', label: 'One-time' }
      case 'PERIODIC':
        return { variant: 'outline', label: 'Periodic' }
      default:
        return { variant: 'default', label: scheduleType }
    }
  }

  const formatNextExecution = (schedule) => {
    if (schedule.status === 'SUCCESS' || schedule.status === 'FAILED') {
      return 'Completed'
    }
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-muted-foreground" />
      case 'RUNNING':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-muted-foreground" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Get active schedules (not completed or cancelled)
  const activeSchedules = useMemo(() => {
    if (!scheduledScriptsData?.scheduledScripts) return []
    return scheduledScriptsData.scheduledScripts.filter(
      (schedule) =>
        schedule.status !== 'SUCCESS' &&
        schedule.status !== 'FAILED' &&
        schedule.status !== 'CANCELLED'
    )
  }, [scheduledScriptsData])

  return (
    <div className="space-y-6">
      {/* Create New Schedule Card */}
      <Card className={cn(getGlassClasses('subtle'), 'elevation-1')}>
        <CardHeader>
          <CardTitle>Schedule Script Execution</CardTitle>
          <p className="text-sm text-muted-foreground">
            Execute this script immediately, schedule for later, or set up
            recurring executions
          </p>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleOpenScheduleDialog}
            className="px-4"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Execution
          </Button>
          {departmentVMs.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              No running VMs available. Schedules for offline VMs will execute when the VM comes online.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Active Schedules Card */}
      <Card className={cn(getGlassClasses('subtle'), 'elevation-1')}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Schedules</CardTitle>
            {activeSchedules.length > 0 && (
              <Badge variant="secondary">{activeSchedules.length}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {schedulesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
              <span className="text-muted-foreground">Loading schedules...</span>
            </div>
          ) : activeSchedules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mb-2 opacity-50" />
              <p>No active schedules</p>
              <p className="text-sm">
                Click "Schedule Execution" to create a new schedule
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {activeSchedules.map((schedule) => {
                const { variant, label } = formatScheduleType(
                  schedule.scheduleType
                )
                return (
                  <div
                    key={schedule.id}
                    className={cn(
                      'glass-subtle rounded-lg border border-border/20 p-3',
                      'transition-colors hover:bg-accent/20'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={variant}>{label}</Badge>
                          <Badge variant="outline">
                            {getStatusIcon(schedule.status)}
                            <span className="ml-1">{schedule.status}</span>
                          </Badge>
                          <span className="text-sm font-medium">
                            {schedule.machine.name}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Next execution: {formatNextExecution(schedule)}
                        </div>
                        {schedule.scheduleType === 'PERIODIC' && (
                          <div className="text-sm text-muted-foreground">
                            {formatInterval(schedule.repeatIntervalMinutes)}
                            {schedule.maxExecutions && (
                              <span className="ml-2">
                                ({schedule.executionCount || 0}/
                                {schedule.maxExecutions} executions)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {/* VM Offline Warning */}
                        {schedule.machine?.status !== 'running' && (
                          <Badge variant="warning" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            VM Offline
                          </Badge>
                        )}
                        {schedule.status === 'PENDING' && schedule.machine?.status === 'running' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSchedule(schedule)}
                            className="px-2"
                            title="Edit schedule"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        )}
                        {schedule.status === 'PENDING' && schedule.machine?.status !== 'running' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled
                            className="px-2 opacity-50"
                            title="Cannot edit schedule while VM is offline"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        )}
                        {(schedule.status === 'PENDING' ||
                          schedule.status === 'RUNNING') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelSchedule(schedule)}
                            className="px-2 text-red-500 hover:text-red-600"
                            title="Cancel schedule"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent
          glass="medium"
          className="max-w-3xl max-h-[85vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? 'Edit Schedule' : 'Schedule Script'}:{' '}
              {script?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Schedule Mode Selection */}
            <div className="space-y-3">
              <Label>Schedule Type</Label>
              <RadioGroup
                value={scheduleMode}
                onValueChange={setScheduleMode}
                disabled={!!editingSchedule}
              >
                <div
                  className={cn(
                    'glass-subtle p-3 rounded-lg cursor-pointer transition-colors',
                    scheduleMode === 'immediate' &&
                      'border-primary bg-primary/5'
                  )}
                  onClick={() => !editingSchedule && setScheduleMode('immediate')}
                >
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="immediate" id="immediate" />
                    <div className="flex-1">
                      <Label
                        htmlFor="immediate"
                        className="flex items-center cursor-pointer"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Immediate
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Execute now on selected VMs
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    'glass-subtle p-3 rounded-lg cursor-pointer transition-colors',
                    scheduleMode === 'one-time' && 'border-primary bg-primary/5'
                  )}
                  onClick={() => !editingSchedule && setScheduleMode('one-time')}
                >
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="one-time" id="one-time" />
                    <div className="flex-1">
                      <Label
                        htmlFor="one-time"
                        className="flex items-center cursor-pointer"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        One-time
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Execute once at a specific date/time
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={cn(
                    'glass-subtle p-3 rounded-lg cursor-pointer transition-colors',
                    scheduleMode === 'periodic' && 'border-primary bg-primary/5'
                  )}
                  onClick={() => !editingSchedule && setScheduleMode('periodic')}
                >
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="periodic" id="periodic" />
                    <div className="flex-1">
                      <Label
                        htmlFor="periodic"
                        className="flex items-center cursor-pointer"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Periodic
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Execute repeatedly at intervals
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* VM Selection */}
            {!editingSchedule && (
              <div className="space-y-3">
                <Label>Target Virtual Machines</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="selectAll"
                    checked={selectAllVMs}
                    onCheckedChange={setSelectAllVMs}
                  />
                  <Label htmlFor="selectAll" className="cursor-pointer">
                    Select all VMs in department ({departmentVMs.length} VMs)
                  </Label>
                </div>
                {!selectAllVMs && (
                  <div
                    className={cn(
                      'glass-subtle p-3 rounded-lg max-h-48 overflow-y-auto space-y-2'
                    )}
                  >
                    {departmentVMs.map((vm) => (
                      <div key={vm.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={vm.id}
                          checked={selectedVMs.includes(vm.id)}
                          onCheckedChange={() => handleVMToggle(vm.id)}
                        />
                        <Label htmlFor={vm.id} className="cursor-pointer flex-1">
                          {vm.name}
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          {vm.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
                {!selectAllVMs && selectedVMs.length === 0 && (
                  <p className="text-sm text-red-500">
                    Please select at least one VM
                  </p>
                )}
              </div>
            )}

            {/* Schedule Configuration */}
            {scheduleMode === 'one-time' && (
              <div className="space-y-3">
                <Label htmlFor="scheduledFor">Execution Date & Time</Label>
                <Input
                  id="scheduledFor"
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                  className={cn(getGlassClasses('subtle'))}
                />
                <p className="text-sm text-muted-foreground">
                  Select when to execute the script
                </p>
              </div>
            )}

            {scheduleMode === 'periodic' && (
              <>
                <div className="space-y-3">
                  <Label>Repeat Interval</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={intervalValue}
                      onChange={(e) =>
                        setIntervalValue(parseInt(e.target.value) || 1)
                      }
                      className={cn(getGlassClasses('subtle'), 'flex-1')}
                    />
                    <Select value={intervalUnit} onValueChange={setIntervalUnit}>
                      <SelectTrigger
                        className={cn(getGlassClasses('subtle'), 'w-32')}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    How often to execute the script
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="maxExecutions">
                    Maximum Executions (Optional)
                  </Label>
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="runIndefinitely"
                      checked={runIndefinitely}
                      onCheckedChange={(checked) => {
                        setRunIndefinitely(checked)
                        if (checked) setMaxExecutions(null)
                      }}
                    />
                    <Label htmlFor="runIndefinitely" className="cursor-pointer">
                      Run indefinitely
                    </Label>
                  </div>
                  {!runIndefinitely && (
                    <Input
                      id="maxExecutions"
                      type="number"
                      min="1"
                      value={maxExecutions || ''}
                      onChange={(e) =>
                        setMaxExecutions(
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      className={cn(getGlassClasses('subtle'))}
                      placeholder="Leave empty for unlimited"
                    />
                  )}
                  <p className="text-sm text-muted-foreground">
                    Leave empty or check 'Run indefinitely' for unlimited
                    executions
                  </p>
                </div>
              </>
            )}

            {/* Script Inputs */}
            {script?.hasInputs && script?.parsedInputs && (
              <div className="space-y-3">
                <Label>Script Parameters</Label>
                <div className="space-y-3">
                  {script.parsedInputs.map((input) => (
                    <ScriptInputRenderer
                      key={input.name}
                      input={input}
                      value={inputValues[input.name]}
                      onChange={(value) => handleInputChange(input.name, value)}
                      error={validationErrors[input.name]}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Validation Summary */}
            {Object.keys(validationErrors).length > 0 && (
              <div
                className={cn(
                  'glass-subtle bg-amber-50/10 border-amber-200/20 p-3 rounded-lg'
                )}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Please fix the errors above before scheduling
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowScheduleDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleScheduleScript}
              disabled={
                scheduling ||
                updating ||
                Object.keys(validationErrors).length > 0 ||
                (!selectAllVMs && selectedVMs.length === 0)
              }
            >
              {scheduling || updating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {scheduleMode === 'immediate'
                    ? 'Executing...'
                    : 'Scheduling...'}
                </>
              ) : (
                <>
                  {scheduleMode === 'immediate' ? (
                    <Play className="h-4 w-4 mr-2" />
                  ) : scheduleMode === 'one-time' ? (
                    <Calendar className="h-4 w-4 mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  {editingSchedule
                    ? 'Update Schedule'
                    : scheduleMode === 'immediate'
                    ? 'Execute Now'
                    : 'Create Schedule'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Cancel Schedule */}
      <AlertDialog open={confirmAction !== null} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent glass="medium">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Schedule?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.description}
            </AlertDialogDescription>
            {confirmAction?.scheduleName && (
              <div className="mt-2 text-sm text-muted-foreground">
                <strong>Schedule:</strong> {confirmAction.scheduleName}
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>
              No, Keep Schedule
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelScheduleConfirm}
              disabled={cancelling}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {cancelling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Yes, Cancel Schedule'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
