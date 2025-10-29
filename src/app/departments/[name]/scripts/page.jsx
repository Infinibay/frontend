'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Plus, Trash2, Search } from 'lucide-react'
import { useScriptsQuery, useDepartmentScriptsQuery, useAssignScriptToDepartmentMutation, useUnassignScriptFromDepartmentMutation } from '@/gql/hooks'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'

export default function DepartmentScriptsPage() {
  const params = useParams()
  const departmentName = params.name
  const currentUser = useSelector((state) => state.auth.user)
  const isAdmin = currentUser?.role === 'ADMIN'

  // Get department ID from Redux
  const departments = useSelector((state) => state.departments.items)
  const department = departments.find(d => d.name.toLowerCase() === departmentName?.toLowerCase())
  const departmentId = department?.id

  const [searchQuery, setSearchQuery] = useState('')
  const [showAssignDialog, setShowAssignDialog] = useState(false)

  // Fetch all scripts and department scripts
  const { data: allScriptsData, loading: allScriptsLoading } = useScriptsQuery()
  const { data: deptScriptsData, loading: deptScriptsLoading, refetch: refetchDeptScripts } = useDepartmentScriptsQuery({
    variables: { departmentId: departmentId || '' },
    skip: !departmentId
  })

  const [assignScript] = useAssignScriptToDepartmentMutation()
  const [unassignScript] = useUnassignScriptFromDepartmentMutation()

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

  const handleUnassign = async (scriptId) => {
    try {
      await unassignScript({
        variables: { scriptId, departmentId }
      })
      toast.success('Script removed from department')
      refetchDeptScripts()
    } catch (error) {
      toast.error(`Failed to remove script: ${error.message}`)
    }
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
            <div className="space-y-2">
              {deptScriptsData?.departmentScripts?.map(script => (
                <div key={script.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{script.name}</h3>
                    <p className="text-sm text-muted-foreground">{script.description}</p>
                    <div className="flex gap-2 mt-2">
                      {script.os.map(os => (
                        <Badge key={os} variant="secondary" className="text-xs">{os}</Badge>
                      ))}
                      <Badge variant="outline" className="text-xs">{script.shell}</Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnassign(script.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
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
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredAvailableScripts.map(script => (
                  <div key={script.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                    <div className="flex-1">
                      <h3 className="font-medium">{script.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{script.description}</p>
                      <div className="flex gap-2 mt-1">
                        {script.os.map(os => (
                          <Badge key={os} variant="secondary" className="text-xs">{os}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAssign(script.id)}
                    >
                      Assign
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
