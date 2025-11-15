'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
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
import { Plus, Trash2, Search, Edit, AlertCircle, Calendar } from 'lucide-react'
import { useScriptsQuery, useDepartmentScriptsQuery, useAssignScriptToDepartmentMutation, useUnassignScriptFromDepartmentMutation, useCancelScriptExecutionMutation } from '@/gql/hooks'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { ScriptListItem } from '@/app/scripts/components/ScriptListItem'
import { gql, useApolloClient } from '@apollo/client'
import ScheduleScriptDialog from './components/ScheduleScriptDialog'

// GraphQL query to check active schedules - server-side filtered by department and status
const GET_ACTIVE_SCHEDULES = gql`
  query GetActiveSchedules($scriptId: ID!, $departmentId: ID!) {
    scheduledScripts(filters: {
      scriptId: $scriptId,
      departmentId: $departmentId,
      status: [PENDING, RUNNING]
    }) {
      id
      status
      machine {
        name
      }
    }
  }
`

export default function DepartmentScriptsPage() {
  const params = useParams()
  const router = useRouter()
  const apolloClient = useApolloClient()
  const departmentName = params.name
  const currentUser = useSelector((state) => state.auth.user)
  const isAdmin = currentUser?.role === 'ADMIN'

  // Get department ID from Redux
  const departments = useSelector((state) => state.departments.items)
  const department = departments.find(d => d.name.toLowerCase() === departmentName?.toLowerCase())
  const departmentId = department?.id

  const [searchQuery, setSearchQuery] = useState('')
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [unassignConfirm, setUnassignConfirm] = useState(null) // { scriptId, scriptName, activeSchedulesCount, affectedVMs, scheduleIds }
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false)
  const [selectedScriptForSchedule, setSelectedScriptForSchedule] = useState(null) // { id, name }
  const [isUnassigning, setIsUnassigning] = useState(false)
  const [isCheckingSchedules, setIsCheckingSchedules] = useState(false)

  // Fetch all scripts and department scripts
  const { data: allScriptsData, loading: allScriptsLoading } = useScriptsQuery()
  const { data: deptScriptsData, loading: deptScriptsLoading, refetch: refetchDeptScripts } = useDepartmentScriptsQuery({
    variables: { departmentId: departmentId || '' },
    skip: !departmentId
  })

  const [assignScript] = useAssignScriptToDepartmentMutation()
  const [unassignScript] = useUnassignScriptFromDepartmentMutation()
  const [cancelScriptExecution] = useCancelScriptExecutionMutation()

  const assignedScriptIds = new Set(deptScriptsData?.departmentScripts?.map(s => s.id) || [])
  const availableScripts = allScriptsData?.scripts?.filter(s => !assignedScriptIds.has(s.id)) || []
  const filteredAvailableScripts = availableScripts.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAssign = async (scriptId) => {
    try {
      await assignScript({
        variables: { scriptId, departmentId }
      })
      toast.success('Script assigned to department')
      refetchDeptScripts()
      setShowAssignDialog(false)
    } catch (error) {
      toast.error(`Failed to assign script: ${error.message}`)
    }
  }

  // Check for active schedules before unassigning
  const handleUnassign = async (script) => {
    if (isCheckingSchedules || isUnassigning) return

    try {
      setIsCheckingSchedules(true)
      // Query for active schedules in this department (server-side filtered)
      const { data } = await apolloClient.query({
        query: GET_ACTIVE_SCHEDULES,
        variables: { scriptId: script.id, departmentId },
        fetchPolicy: 'network-only'
      })

      // Server returns only PENDING/RUNNING schedules for this department
      const activeSchedules = data?.scheduledScripts || []

      if (activeSchedules.length > 0) {
        // Extract affected VMs and schedule IDs
        const affectedVMs = [...new Set(activeSchedules.map(s => s.machine?.name).filter(Boolean))]
        const scheduleIds = activeSchedules.map(s => s.id)

        setUnassignConfirm({
          scriptId: script.id,
          scriptName: script.name,
          activeSchedulesCount: activeSchedules.length,
          affectedVMs: affectedVMs.slice(0, 5), // Show max 5 VMs
          scheduleIds
        })
      } else {
        // No active schedules, proceed directly
        await handleUnassignConfirm(script.id)
      }
    } catch (error) {
      toast.error(`Failed to check schedules: ${error.message}`)
    } finally {
      setIsCheckingSchedules(false)
    }
  }

  // Actually unassign after confirmation
  const handleUnassignConfirm = async (scriptId) => {
    if (isUnassigning) return

    try {
      setIsUnassigning(true)

      // Cancel all active schedules if any
      const scheduleIds = unassignConfirm?.scheduleIds || []
      if (scheduleIds.length > 0) {
        const cancelPromises = scheduleIds.map(scheduleId =>
          cancelScriptExecution({
            variables: { id: scheduleId }
          }).catch(error => {
            console.error(`Failed to cancel schedule ${scheduleId}:`, error)
            // Continue with other cancellations even if one fails
            return { error }
          })
        )

        await Promise.all(cancelPromises)
      }

      // Unassign the script
      await unassignScript({
        variables: { scriptId: scriptId || unassignConfirm?.scriptId, departmentId }
      })

      const message = scheduleIds.length > 0
        ? `Script removed from department and ${scheduleIds.length} schedule${scheduleIds.length > 1 ? 's' : ''} cancelled`
        : 'Script removed from department'

      toast.success(message)
      setUnassignConfirm(null)
      refetchDeptScripts()
    } catch (error) {
      toast.error(`Failed to remove script: ${error.message}`)
      setUnassignConfirm(null)
    } finally {
      setIsUnassigning(false)
    }
  }

  // Schedule dialog handlers
  const handleOpenScheduleDialog = (script) => {
    setSelectedScriptForSchedule({ id: script.id, name: script.name })
    setScheduleDialogOpen(true)
  }

  const handleCloseScheduleDialog = () => {
    setScheduleDialogOpen(false)
    setSelectedScriptForSchedule(null)
  }

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Only administrators can manage department scripts.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Assigned Scripts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Assigned Scripts</CardTitle>
          <Button onClick={() => setShowAssignDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Assign Script
          </Button>
        </CardHeader>
        <CardContent>
          {deptScriptsLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : deptScriptsData?.departmentScripts?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No scripts assigned to this department yet
            </div>
          ) : (
            <div className="glass-subtle rounded-lg border border-border/20 p-3 space-y-2">
              {deptScriptsData?.departmentScripts?.map(script => (
                <div key={script.id} className="relative">
                  <ScriptListItem
                    script={script}
                    compact={true}
                    onClick={() => router.push(`/departments/${departmentName}/scripts/${script.id}`)}
                    customActions={
                      <div className="flex items-center gap-2 ml-auto" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/scripts/${script.id}`)
                          }}
                          className="flex-shrink-0"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenScheduleDialog(script)
                          }}
                          className="flex-shrink-0"
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUnassign(script)
                          }}
                          disabled={isCheckingSchedules || isUnassigning}
                          className="flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Script Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Script to Department</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search scripts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {allScriptsLoading ? (
              <div className="text-center py-8">Loading scripts...</div>
            ) : filteredAvailableScripts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No scripts found matching your search' : 'All scripts are already assigned'}
              </div>
            ) : (
              <div className="glass-subtle rounded-lg border border-border/20 p-3 space-y-2 max-h-96 overflow-y-auto">
                {filteredAvailableScripts.map(script => (
                  <ScriptListItem
                    key={script.id}
                    script={script}
                    compact={true}
                    customActions={
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAssign(script.id)
                        }}
                        className="flex-shrink-0"
                      >
                        Assign
                      </Button>
                    }
                  />
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Unassigning Script with Active Schedules */}
      <AlertDialog open={unassignConfirm !== null} onOpenChange={(open) => !open && setUnassignConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Script Has Active Schedules
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                This script has <strong>{unassignConfirm?.activeSchedulesCount}</strong> active schedule
                {unassignConfirm?.activeSchedulesCount > 1 ? 's' : ''} in this department.
              </p>
              {unassignConfirm?.affectedVMs && unassignConfirm.affectedVMs.length > 0 && (
                <div>
                  <p className="font-medium mb-1">Affected VMs:</p>
                  <ul className="list-disc list-inside ml-2">
                    {unassignConfirm.affectedVMs.map(vmName => (
                      <li key={vmName}>{vmName}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Unassigning will cancel all active schedules for this script in this department.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUnassigning}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleUnassignConfirm()}
              disabled={isUnassigning}
              variant="destructive"
            >
              {isUnassigning ? 'Unassigning...' : 'Unassign & Cancel Schedules'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Schedule Script Dialog */}
      {selectedScriptForSchedule && (
        <ScheduleScriptDialog
          open={scheduleDialogOpen}
          onOpenChange={setScheduleDialogOpen}
          scriptId={selectedScriptForSchedule.id}
          scriptName={selectedScriptForSchedule.name}
          departmentId={departmentId}
          departmentName={departmentName}
        />
      )}
    </div>
  )
}
