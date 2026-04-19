'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
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

  // Fetch available scripts
  const { data: scriptsData, loading: scriptsLoading } = useDepartmentScriptsQuery({
    variables: { departmentId },
    skip: !departmentId
  })

  // Fetch execution history
  const { data: executionsData, loading: executionsLoading, refetch: refetchExecutions } = useScriptExecutionsQuery({
    variables: { machineId: vmId, limit: 50 }
  })

  // Fetch selected script details with inputs
  const { data: scriptData, loading: scriptLoading } = useScriptQuery({
    variables: { id: selectedScript?.id },
    skip: !selectedScript?.id
  })

  // Fetch VM users for "Run As" dropdown
  const { data: usersData } = useVmUsersQuery({
    variables: { machineId: vmId },
    skip: !vmId || vmStatus !== 'running'
  })

  const [executeScript, { loading: executing }] = useExecuteScriptMutation()

  // WebSocket subscription for real-time updates
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

  // Validate inputs when they change
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
    // Validate inputs before executing
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
        return <Clock className="h-4 w-4 text-gray-500" />
      case 'RUNNING':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'TIMEOUT':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Available Scripts */}
      <Card>
        <CardHeader>
          <CardTitle>Available Scripts</CardTitle>
        </CardHeader>
        <CardContent>
          {scriptsLoading ? (
            <div className="text-center py-8">Loading scripts...</div>
          ) : scriptsData?.departmentScripts?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No scripts available for this department
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scriptsData?.departmentScripts?.map(script => (
                  <Card key={script.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">{script.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {script.description || 'No description'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {script.os.map(os => (
                            <Badge key={os} variant="secondary" className="text-xs">{os}</Badge>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleOpenExecuteDialog(script)}
                          disabled={vmStatus !== 'running'}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Run
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Execution History */}
      <Card>
        <CardHeader>
          <CardTitle>Execution History</CardTitle>
        </CardHeader>
        <CardContent>
          {executionsLoading ? (
            <div className="text-center py-8">Loading history...</div>
          ) : executionsData?.scriptExecutions?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No script executions yet
            </div>
          ) : (
            <div className="space-y-2">
              {executionsData?.scriptExecutions?.map(execution => (
                <div key={execution.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(execution.status)}
                    <div>
                      <p className="font-medium">{execution.script.name}</p>
                      <p className="text-sm text-muted-foreground">
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
                        variant="outline"
                        onClick={() => {
                          setSelectedExecution(execution)
                          setShowLogsDialog(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Logs
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Execute Script Dialog */}
      <Dialog open={showExecuteDialog} onOpenChange={setShowExecuteDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Execute Script: {selectedScript?.name}</DialogTitle>
          </DialogHeader>

          {scriptLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">Loading script details...</p>
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
            <p className="text-muted-foreground">This script has no input parameters</p>
          )}

          {/* Validation Summary */}
          {Object.keys(validationErrors).length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <p className="text-sm text-amber-800">
                Please fix the errors above before executing
              </p>
            </div>
          )}

          {/* Run As Selection */}
          <div className="space-y-2">
            <Label htmlFor="runAs">Run As</Label>
            <Select value={runAsUser} onValueChange={setRunAsUser}>
              <SelectTrigger id="runAs">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {(usersData?.vmUsers || ['system', 'administrator']).map(user => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              On Windows, selecting Administrator or System runs with elevated privileges.
              Linux Run As support coming in a future update.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExecuteDialog(false)}>Cancel</Button>
            <Button
              onClick={handleExecute}
              disabled={executing || scriptLoading || Object.keys(validationErrors).length > 0}
            >
              {executing ? 'Executing...' : 'Execute'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logs Dialog */}
      <Dialog open={showLogsDialog} onOpenChange={setShowLogsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Execution Logs</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedExecution?.stdout && (
              <div>
                <h3 className="font-medium mb-2">Standard Output</h3>
                <pre className="p-4 bg-muted rounded-lg text-sm overflow-x-auto">
                  {selectedExecution.stdout}
                </pre>
              </div>
            )}
            {selectedExecution?.stderr && (
              <div>
                <h3 className="font-medium mb-2 text-destructive">Standard Error</h3>
                <pre className="p-4 bg-destructive/10 rounded-lg text-sm overflow-x-auto">
                  {selectedExecution.stderr}
                </pre>
              </div>
            )}
            {!selectedExecution?.stdout && !selectedExecution?.stderr && (
              <p className="text-muted-foreground">No logs available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
