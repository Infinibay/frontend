'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useApolloClient } from '@apollo/client'
import { useScriptsQuery, useDeleteScriptMutation } from '@/gql/hooks'
import { gql } from '@apollo/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScriptListItem } from '@/app/scripts/components/ScriptListItem'
import { ImportExportDialog } from '@/app/scripts/components/ImportExportDialog'
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
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Download, Loader2, FileCode, Tag, X, AlertCircle } from 'lucide-react'

/**
 * ScriptsSection component - Reusable scripts management UI
 * Can be used both embedded in settings page and as standalone page
 *
 * @param {Object} props
 * @param {boolean} props.embedded - Whether component is embedded in settings page
 * @param {Function} props.onNavigateToEditor - Callback for navigation (used in embedded mode)
 * @param {string} props.className - Additional CSS classes
 */
// GraphQL query for fetching single script with content
const GET_SCRIPT_CONTENT = gql`
  query Script($id: ID!) {
    script(id: $id) {
      id
      name
      fileName
      content
    }
  }
`

// GraphQL query to check active schedules (PENDING and RUNNING)
const GET_ACTIVE_SCHEDULES = gql`
  query GetScriptActiveSchedules($scriptId: ID!) {
    scheduledScripts(filters: { scriptId: $scriptId }) {
      id
      status
      machine {
        id
        name
      }
    }
  }
`

export default function ScriptsSection({ embedded = false, onNavigateToEditor, className = '' }) {
  const router = useRouter()
  const apolloClient = useApolloClient()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [osFilter, setOsFilter] = useState('all')
  const [tagsFilter, setTagsFilter] = useState([])
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [selectedScriptIds, setSelectedScriptIds] = useState(new Set())
  const [exportScripts, setExportScripts] = useState([])
  const [fetchingExportData, setFetchingExportData] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null) // { scriptId, scriptName, activeSchedulesCount, affectedVMs, affectedVMsCount }
  const [deleteCheckbox, setDeleteCheckbox] = useState(false)

  const { data, loading, refetch } = useScriptsQuery()
  const [deleteScript] = useDeleteScriptMutation()

  const scripts = data?.scripts || []

  // Extract all unique tags from scripts
  const allTags = [...new Set(scripts.flatMap(script => script.tags || []))].sort()

  const filteredScripts = scripts.filter(script => {
    const matchesSearch = !search ||
      script.name.toLowerCase().includes(search.toLowerCase()) ||
      script.description?.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = categoryFilter === 'all' || script.category === categoryFilter
    const matchesOS = osFilter === 'all' || script.os?.includes(osFilter)

    // Tags filter: if any tags are selected, script must have at least one of them
    const matchesTags = tagsFilter.length === 0 ||
      (script.tags && tagsFilter.some(tag => script.tags.includes(tag)))

    return matchesSearch && matchesCategory && matchesOS && matchesTags
  })

  // In embedded mode, limit to 6 scripts
  const displayScripts = embedded ? filteredScripts.slice(0, 6) : filteredScripts

  const handleEdit = useCallback((scriptId) => {
    if (embedded && onNavigateToEditor) {
      onNavigateToEditor(scriptId)
    } else {
      router.push(`/scripts/${scriptId}`)
    }
  }, [embedded, onNavigateToEditor, router])

  // Check for active schedules before deletion
  const handleDelete = async (scriptId) => {
    const script = scripts.find(s => s.id === scriptId)
    if (!script) return

    try {
      // Query for active schedules
      const { data } = await apolloClient.query({
        query: GET_ACTIVE_SCHEDULES,
        variables: { scriptId },
        fetchPolicy: 'network-only'
      })

      // Filter for PENDING and RUNNING schedules
      const activeSchedules = (data?.scheduledScripts || []).filter(
        s => s.status === 'PENDING' || s.status === 'RUNNING'
      )

      if (activeSchedules.length > 0) {
        // Extract affected VMs - deduplicate to get unique VMs
        const affectedVMsAll = [...new Set(activeSchedules.map(s => s.machine?.name).filter(Boolean))]

        setDeleteConfirm({
          scriptId,
          scriptName: script.name,
          activeSchedulesCount: activeSchedules.length,
          affectedVMs: affectedVMsAll.slice(0, 5), // Show max 5 VMs
          affectedVMsCount: affectedVMsAll.length // Store total unique VM count
        })
        setDeleteCheckbox(false) // Reset checkbox
      } else {
        // No active schedules, show standard confirmation
        setDeleteConfirm({
          scriptId,
          scriptName: script.name,
          activeSchedulesCount: 0,
          affectedVMs: []
        })
      }
    } catch (error) {
      toast.error(`Failed to check schedules: ${error.message}`)
    }
  }

  // Actually delete after confirmation
  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return

    // If there are active schedules, require checkbox confirmation
    if (deleteConfirm.activeSchedulesCount > 0 && !deleteCheckbox) {
      toast.error('Please confirm that you understand schedules will be cancelled')
      return
    }

    try {
      await deleteScript({
        variables: {
          id: deleteConfirm.scriptId,
          force: deleteConfirm.activeSchedulesCount > 0 // Force cancel schedules if present
        }
      })

      toast.success(
        deleteConfirm.activeSchedulesCount > 0
          ? `Script deleted successfully. Cancelled ${deleteConfirm.activeSchedulesCount} active schedule${deleteConfirm.activeSchedulesCount > 1 ? 's' : ''}.`
          : 'Script deleted successfully'
      )

      // Remove from selection if selected
      setSelectedScriptIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(deleteConfirm.scriptId)
        return newSet
      })

      setDeleteConfirm(null)
      setDeleteCheckbox(false)
      refetch()
    } catch (error) {
      toast.error(`Failed to delete script: ${error.message}`)
      setDeleteConfirm(null)
      setDeleteCheckbox(false)
    }
  }

  const handleToggleSelect = (scriptId) => {
    setSelectedScriptIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(scriptId)) {
        newSet.delete(scriptId)
      } else {
        newSet.add(scriptId)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    setSelectedScriptIds(new Set(filteredScripts.map(s => s.id)))
  }

  const handleDeselectAll = () => {
    setSelectedScriptIds(new Set())
  }

  const handleExportSelected = async () => {
    if (selectedScriptIds.size === 0) {
      toast.error('Please select at least one script to export')
      return
    }

    setFetchingExportData(true)
    try {
      // Fetch full content for each selected script using Apollo Client
      const scriptPromises = Array.from(selectedScriptIds).map(async (scriptId) => {
        const { data } = await apolloClient.query({
          query: GET_SCRIPT_CONTENT,
          variables: { id: scriptId },
          fetchPolicy: 'network-only' // Always fetch fresh data for export
        })
        return data?.script
      })

      const fullScripts = await Promise.all(scriptPromises)
      const validScripts = fullScripts.filter(s => s && s.content)

      if (validScripts.length === 0) {
        toast.error('Failed to fetch script content')
        return
      }

      setExportScripts(validScripts)
      setShowExportDialog(true)
    } catch (error) {
      toast.error(`Failed to fetch scripts: ${error.message}`)
    } finally {
      setFetchingExportData(false)
    }
  }

  const handleNewScript = () => {
    router.push('/scripts/new')
  }

  const clearFilters = () => {
    setSearch('')
    setCategoryFilter('all')
    setOsFilter('all')
    setTagsFilter([])
  }

  return (
    <div className={className}>
      {/* Compact header for embedded mode */}
      {embedded && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileCode className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {scripts.length} script{scripts.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setShowImportDialog(true)} variant="outline">
              Import
            </Button>
            <Button size="sm" onClick={handleNewScript}>
              New Script
            </Button>
            {filteredScripts.length > 6 && (
              <Button size="sm" variant="ghost" onClick={() => router.push('/scripts')}>
                View All ({filteredScripts.length})
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Selection controls - only in standalone mode */}
      {!embedded && filteredScripts.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="sm" onClick={handleSelectAll}>
            Select All
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDeselectAll}>
            Deselect All
          </Button>
          {selectedScriptIds.size > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedScriptIds.size} selected
            </span>
          )}
        </div>
      )}

      {/* Search and filters - hidden in embedded mode to reduce clutter */}
      {!embedded && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search scripts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Configuration">Configuration</SelectItem>
                  <SelectItem value="Monitoring">Monitoring</SelectItem>
                </SelectContent>
              </Select>
              <Select value={osFilter} onValueChange={setOsFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="OS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All OS</SelectItem>
                  <SelectItem value="Windows">Windows</SelectItem>
                  <SelectItem value="Linux">Linux</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter by Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => {
                    const isSelected = tagsFilter.includes(tag)
                    return (
                      <button
                        key={tag}
                        onClick={() => {
                          if (isSelected) {
                            setTagsFilter(tagsFilter.filter(t => t !== tag))
                          } else {
                            setTagsFilter([...tagsFilter, tag])
                          }
                        }}
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium border transition-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background text-muted-foreground border-border hover:bg-muted'
                        }`}
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                        {isSelected && <X className="h-3 w-3 ml-0.5" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Scripts grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span className="text-muted-foreground">Loading scripts...</span>
        </div>
      ) : displayScripts.length === 0 ? (
        <div className="text-center py-12">
          <FileCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {filteredScripts.length === 0 && search ?
              'No scripts found matching your search' :
              'No scripts found'}
          </p>
          {!embedded && (
            <Button onClick={handleNewScript} className="mt-4">
              Create Your First Script
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="glass-subtle rounded-lg border border-border/20 p-3 space-y-2">
            {displayScripts.map(script => (
              <ScriptListItem
                key={script.id}
                script={script}
                selected={!embedded && selectedScriptIds.has(script.id)}
                onToggleSelect={handleToggleSelect}
                onEdit={handleEdit}
                onDelete={handleDelete}
                compact={embedded}
                onClick={() => handleEdit(script.id)}
              />
            ))}
          </div>

          {/* Show "View All" button in embedded mode if there are more scripts */}
          {embedded && filteredScripts.length > 6 && (
            <div className="text-center mt-6">
              <Button variant="outline" onClick={() => router.push('/scripts')}>
                View All Scripts ({filteredScripts.length})
              </Button>
            </div>
          )}
        </>
      )}

      {/* Import/Export Dialogs */}
      <ImportExportDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        mode="import"
        selectedScripts={[]}
        onImportComplete={refetch}
      />

      <ImportExportDialog
        isOpen={showExportDialog}
        onClose={() => {
          setShowExportDialog(false)
          setExportScripts([])
        }}
        mode="export"
        selectedScripts={exportScripts}
      />

      {/* Confirmation Dialog for Script Deletion */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => {
        if (!open) {
          setDeleteConfirm(null)
          setDeleteCheckbox(false)
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {deleteConfirm?.activeSchedulesCount > 0 && (
                <AlertCircle className="h-5 w-5 text-amber-500" />
              )}
              Delete Script?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              {deleteConfirm?.activeSchedulesCount > 0 ? (
                <>
                  <p>
                    This script has <strong>{deleteConfirm.activeSchedulesCount}</strong> active schedule
                    {deleteConfirm.activeSchedulesCount > 1 ? 's' : ''}.
                  </p>
                  {deleteConfirm.affectedVMs && deleteConfirm.affectedVMs.length > 0 && (
                    <div>
                      <p className="font-medium mb-1">Affected VMs:</p>
                      <ul className="list-disc list-inside ml-2">
                        {deleteConfirm.affectedVMs.map(vmName => (
                          <li key={vmName}>{vmName}</li>
                        ))}
                        {deleteConfirm.affectedVMsCount > 5 && (
                          <li className="text-muted-foreground">
                            and {deleteConfirm.affectedVMsCount - 5} more...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    All related execution logs and audit logs will be permanently deleted.
                  </p>
                  <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
                    <Checkbox
                      id="confirm-cancel-schedules"
                      checked={deleteCheckbox}
                      onCheckedChange={setDeleteCheckbox}
                    />
                    <label
                      htmlFor="confirm-cancel-schedules"
                      className="text-sm cursor-pointer leading-tight"
                    >
                      I understand this will cancel all active schedules for this script
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    Are you sure you want to delete <strong>{deleteConfirm?.scriptName}</strong>?
                    This action cannot be undone.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    All related execution logs and audit logs will be permanently deleted.
                  </p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              variant="destructive"
            >
              {deleteConfirm?.activeSchedulesCount > 0
                ? 'Delete & Cancel Schedules'
                : 'Delete Script'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
