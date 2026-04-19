'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  Button,
  Badge,
  Dialog,
  Select,
  Spinner,
  ButtonGroup,
} from '@infinibay/harbor'
import { Play, Clock, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react'
import { useDepartmentScriptsQuery, useScriptExecutionsQuery, useExecuteScriptMutation, useScriptQuery, useVmUsersQuery } from '@/gql/hooks'
import { ScriptInputRenderer } from '@/components/ScriptInput/ScriptInputRenderer'
import { getSocketService } from '@/services/socketService'
import { toast } from 'sonner'
import { validateScriptInput } from '@/utils/validateScriptInput'
import { parseScriptError } from '@/utils/parseScriptError'

export default function VMScriptsTab({ vmId, vmStatus, departmentId }) {
  const [selectedScript, setSelectedScript] = useState(null)
  const [inputValues, setInputValues] = useState({})
  const [showExecuteDialog, setShowExecuteDialog] = useState(false)
  const [showLogsDialog, setShowLogsDialog] = useState(false)
  const [selectedExecution, setSelectedExecution] = useState(null)
  const [runAsUser, setRunAsUser] = useState('system')
  const [validationErrors, setValidationErrors] = useState({})

  const { data: scriptsData, loading: scriptsLoading } = useDepartmentScriptsQuery({
    variables: { departmentId },
    skip: !departmentId
  })

  const { data: executionsData, loading: executionsLoading, refetch: refetchExecutions } = useScriptExecutionsQuery({
    variables: { machineId: vmId, limit: 50 }
  })

  const { data: scriptData, loading: scriptLoading } = useScriptQuery({
    variables: { id: selectedScript?.id },
    skip: !selectedScript?.id
  })

  const { data: usersData } = useVmUsersQuery({
    variables: { machineId: vmId },
    skip: !vmId || vmStatus !== 'running'
  })

  const [executeScript, { loading: executing }] = useExecuteScriptMutation()

  useEffect(() => {
    const socketService = getSocketService()
    const unsubscribe = socketService.subscribeToAllResourceEvents(
      'scripts',
      (action, data) => {
        if (data.data.machineId === vmId) {
          refetchExecutions()

          switch (action) {
            case 'script_execution_started':
              toast.info(`Script execution started: ${data.data.scriptName}`)
              break
            case 'script_execution_completed':
              if (data.data.status === 'SUCCESS') {
                toast.success('Script completed successfully')
              } else {
                toast.error('Script execution failed')
              }
              break
            case 'script_execution_cancelled':
              toast.warning('Script execution cancelled')
              break
          }
        }
      },
      ['script_execution_started', 'script_execution_completed', 'script_execution_cancelled']
    )
    return () => unsubscribe()
  }, [vmId, refetchExecutions])

  useEffect(() => {
    if (showExecuteDialog && scriptData?.script?.parsedInputs) {
      validateInputs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValues, showExecuteDialog, scriptData])

  const handleOpenExecuteDialog = (script) => {
    setSelectedScript(script)
    setInputValues({})
    setValidationErrors({})
    setRunAsUser('system')
    setShowExecuteDialog(true)
  }

  const validateInputs = () => {
    const errors = {}

    if (scriptData?.script?.parsedInputs) {
      scriptData.script.parsedInputs.forEach(input => {
        const value = inputValues[input.name] ?? input.default ?? ''
        const error = validateScriptInput(input, value)

        if (error) {
          errors[input.name] = error
        }
      })
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleExecute = async () => {
    const isValid = validateInputs()
    if (!isValid) {
      toast.error('Please fix validation errors before executing')
      return
    }

    try {
      await executeScript({
        variables: {
          input: {
            scriptId: selectedScript.id,
            machineId: vmId,
            inputValues,
            runAs: runAsUser
          }
        }
      })
      toast.success('Script execution started')
      setShowExecuteDialog(false)
      setInputValues({})
      refetchExecutions()
    } catch (error) {
      const userMessage = parseScriptError(error, 'script execution')
      toast.error(userMessage)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-fg-subtle" />
      case 'RUNNING':
        return <Clock className="h-4 w-4 text-accent-2 animate-spin" />
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-success" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-danger" />
      case 'TIMEOUT':
        return <AlertCircle className="h-4 w-4 text-warning" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-fg-subtle" />
      default:
        return <Clock className="h-4 w-4 text-fg-subtle" />
    }
  }

  const runAsOptions = (usersData?.vmUsers || ['system', 'administrator']).map(user => ({
    value: user,
    label: user,
  }))

  return (
    <div className="space-y-6">
      {/* Available Scripts */}
      <Card title="Available Scripts">
        {scriptsLoading ? (
          <div className="flex items-center justify-center py-8 gap-2 text-fg-muted">
            <Spinner />
            <span>Loading scripts…</span>
          </div>
        ) : scriptsData?.departmentScripts?.length === 0 ? (
          <div className="text-center py-8 text-fg-muted">
            No scripts available for this department
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scriptsData?.departmentScripts?.map(script => (
              <Card key={script.id} variant="solid" interactive>
                <div className="p-4">
                  <h3 className="font-medium mb-2 text-fg">{script.name}</h3>
                  <p className="text-sm text-fg-muted mb-3 line-clamp-2">
                    {script.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {script.os.map(os => (
                        <Badge key={os} tone="neutral" className="text-xs">{os}</Badge>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      icon={<Play className="h-4 w-4" />}
                      onClick={() => handleOpenExecuteDialog(script)}
                      disabled={vmStatus !== 'running'}
                    >
                      Run
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Execution History */}
      <Card title="Execution History">
        {executionsLoading ? (
          <div className="flex items-center justify-center py-8 gap-2 text-fg-muted">
            <Spinner />
            <span>Loading history…</span>
          </div>
        ) : executionsData?.scriptExecutions?.length === 0 ? (
          <div className="text-center py-8 text-fg-muted">
            No script executions yet
          </div>
        ) : (
          <div className="space-y-2">
            {executionsData?.scriptExecutions?.map(execution => (
              <div
                key={execution.id}
                className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-surface-1"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(execution.status)}
                  <div>
                    <p className="font-medium text-fg">{execution.script.name}</p>
                    <p className="text-sm text-fg-muted">
                      {execution.triggeredBy ? `${execution.triggeredBy.firstName} ${execution.triggeredBy.lastName}` : 'System'}
                      {' • '}
                      {new Date(execution.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{execution.status}</Badge>
                  {(execution.status === 'SUCCESS' || execution.status === 'FAILED') && (
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<Eye className="h-4 w-4" />}
                      onClick={() => {
                        setSelectedExecution(execution)
                        setShowLogsDialog(true)
                      }}
                    >
                      Logs
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Execute Script Dialog */}
      <Dialog
        open={showExecuteDialog}
        onClose={() => setShowExecuteDialog(false)}
        size="lg"
        title={selectedScript ? `Execute Script: ${selectedScript.name}` : 'Execute Script'}
        footer={
          <ButtonGroup className="justify-end">
            <Button variant="secondary" onClick={() => setShowExecuteDialog(false)}>Cancel</Button>
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
              {scriptData.script.parsedInputs.map(input => (
                <ScriptInputRenderer
                  key={input.name}
                  input={input}
                  value={inputValues[input.name] ?? input.default ?? ''}
                  onChange={(value) => setInputValues(prev => ({ ...prev, [input.name]: value }))}
                  error={validationErrors[input.name]}
                />
              ))}
            </div>
          ) : (
            <p className="text-fg-muted">This script has no input parameters</p>
          )}

          {Object.keys(validationErrors).length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/30 rounded-lg">
              <AlertCircle className="h-4 w-4 text-warning shrink-0" />
              <p className="text-sm text-warning">
                Please fix the errors above before executing
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="runAs" className="text-sm font-medium text-fg">Run As</label>
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

      {/* Logs Dialog */}
      <Dialog
        open={showLogsDialog}
        onClose={() => setShowLogsDialog(false)}
        size="lg"
        title="Execution Logs"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {selectedExecution?.stdout && (
            <div>
              <h3 className="font-medium mb-2 text-fg">Standard Output</h3>
              <pre className="p-4 bg-surface-1 border border-white/5 rounded-lg text-sm overflow-x-auto text-fg">
                {selectedExecution.stdout}
              </pre>
            </div>
          )}
          {selectedExecution?.stderr && (
            <div>
              <h3 className="font-medium mb-2 text-danger">Standard Error</h3>
              <pre className="p-4 bg-danger/10 border border-danger/30 rounded-lg text-sm overflow-x-auto text-fg">
                {selectedExecution.stderr}
              </pre>
            </div>
          )}
          {!selectedExecution?.stdout && !selectedExecution?.stderr && (
            <p className="text-fg-muted">No logs available</p>
          )}
        </div>
      </Dialog>
    </div>
  )
}
