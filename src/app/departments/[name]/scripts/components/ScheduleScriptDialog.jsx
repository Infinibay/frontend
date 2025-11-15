'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  useScriptQuery,
  useMachinesQuery,
  useScheduleScriptMutation
} from '@/gql/hooks'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  AlertCircle,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getGlassClasses } from '@/utils/glass-effects'
import { ScriptInputRenderer } from '@/components/ScriptInput/ScriptInputRenderer'
import { validateScriptInput } from '@/utils/validateScriptInput'
import { format } from 'date-fns'
import { gql } from '@apollo/client'

export default function ScheduleScriptDialog({
  open,
  onOpenChange,
  scriptId,
  scriptName,
  departmentId,
  departmentName
}) {
  // State management
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

  // Fetch script details with parsedInputs (skip when dialog is closed)
  const {
    data: scriptData,
    loading: scriptLoading,
    error: scriptError
  } = useScriptQuery({
    variables: { id: scriptId },
    skip: !open || !scriptId
  })

  const script = scriptData?.script

  // Fetch department VMs
  const { data: machinesData } = useMachinesQuery()

  // Filter VMs in the department (including offline VMs)
  const departmentVMs = useMemo(() => {
    if (!machinesData?.machines) return []
    return machinesData.machines.filter(
      (machine) => machine.department?.id === departmentId
    )
  }, [machinesData, departmentId])

  // Schedule script mutation with optimistic updates
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

        // Close dialog on success
        onOpenChange(false)
      }
    },
    onError: (error) => {
      console.error('Schedule error:', error)
      toast.error(error.message || 'Failed to schedule script')
    }
  })

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
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
    }
  }, [open])

  // Handler functions
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

    // Build schedule input - only schedule running VMs
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
      await scheduleScript({
        variables: { input }
      })
    } catch (error) {
      // Error handled in onError callback
      console.error('Schedule error:', error)
    }
  }

  const handleVMToggle = (vmId) => {
    setSelectedVMs((prev) =>
      prev.includes(vmId) ? prev.filter((id) => id !== vmId) : [...prev, vmId]
    )
  }

  const handleInputChange = (name, value) => {
    setInputValues((prev) => ({ ...prev, [name]: value }))

    // Real-time validation
    if (script?.parsedInputs) {
      const input = script.parsedInputs.find((inp) => inp.name === name)
      if (input) {
        const error = validateScriptInput(input, value)
        setValidationErrors((prev) => {
          const updated = { ...prev }
          if (error) {
            updated[name] = error
          } else {
            delete updated[name]
          }
          return updated
        })
      }
    }
  }

  // Determine if submit button should be disabled
  const isSubmitDisabled = useMemo(() => {
    return (
      scheduling ||
      Object.keys(validationErrors).length > 0 ||
      (!selectAllVMs && selectedVMs.length === 0) ||
      (selectAllVMs && departmentVMs.length === 0)
    )
  }, [scheduling, validationErrors, selectAllVMs, selectedVMs, departmentVMs])

  // Render loading state
  if (scriptLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent glass="medium" className="max-w-3xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mr-3" />
            <span className="text-muted-foreground">Loading script details...</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Render error state
  if (scriptError) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent glass="medium" className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Error Loading Script</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-3 p-4 glass-subtle bg-red-50/10 border-red-200/20 rounded-lg">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">
              Failed to load script details. Please try again.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        glass="medium"
        className="max-w-3xl max-h-[85vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Schedule Script: {scriptName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Schedule Mode Selection */}
          <div className="space-y-3">
            <Label>Schedule Type</Label>
            <RadioGroup
              value={scheduleMode}
              onValueChange={setScheduleMode}
            >
              <div
                className={cn(
                  'glass-subtle p-3 rounded-lg cursor-pointer transition-colors',
                  scheduleMode === 'immediate' &&
                    'border-primary bg-primary/5'
                )}
                onClick={() => setScheduleMode('immediate')}
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
                onClick={() => setScheduleMode('one-time')}
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
                onClick={() => setScheduleMode('periodic')}
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
          <div className="space-y-3">
            <Label>Target Virtual Machines</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="selectAll"
                checked={selectAllVMs}
                onCheckedChange={setSelectAllVMs}
              />
              <Label htmlFor="selectAll" className="cursor-pointer">
                Select all VMs in {departmentName} ({departmentVMs.length} VMs)
              </Label>
            </div>
            {!selectAllVMs && (
              <div
                className={cn(
                  'glass-subtle p-3 rounded-lg max-h-48 overflow-y-auto space-y-2'
                )}
              >
                {departmentVMs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No running VMs available in this department
                  </p>
                ) : (
                  departmentVMs.map((vm) => (
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
                  ))
                )}
              </div>
            )}
            {!selectAllVMs && selectedVMs.length === 0 && departmentVMs.length > 0 && (
              <p className="text-sm text-red-500">
                Please select at least one VM
              </p>
            )}
            {departmentVMs.length === 0 && (
              <div className="flex items-center gap-2 p-3 glass-subtle bg-amber-50/10 border-amber-200/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  No VMs available in this department.
                </p>
              </div>
            )}
            {departmentVMs.length > 0 && departmentVMs.every(vm => vm.status !== 'running') && (
              <div className="flex items-center gap-2 p-3 glass-subtle bg-amber-50/10 border-amber-200/20 rounded-lg">
                <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  All VMs are offline. Schedules will execute when VMs come online.
                </p>
              </div>
            )}
          </div>

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
                className={cn(getGlassClasses({ glass: 'subtle' }))}
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
                    className={cn(getGlassClasses({ glass: 'subtle' }), 'flex-1')}
                  />
                  <Select value={intervalUnit} onValueChange={setIntervalUnit}>
                    <SelectTrigger
                      className={cn(getGlassClasses({ glass: 'subtle' }), 'w-32')}
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
                    className={cn(getGlassClasses({ glass: 'subtle' }))}
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
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleScheduleScript}
            disabled={isSubmitDisabled}
          >
            {scheduling ? (
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
                {scheduleMode === 'immediate'
                  ? 'Execute Now'
                  : 'Create Schedule'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
