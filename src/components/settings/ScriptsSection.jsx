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
import { ScriptCard } from '@/app/scripts/components/ScriptCard'
import { ImportExportDialog } from '@/app/scripts/components/ImportExportDialog'
import { toast } from 'sonner'
import { Download, Loader2, FileCode, Tag, X } from 'lucide-react'

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

  const handleDelete = async (scriptId) => {
    if (!confirm('Are you sure you want to delete this script?')) return

    try {
      await deleteScript({ variables: { id: scriptId } })
      toast.success('Script deleted successfully')
      // Remove from selection if selected
      setSelectedScriptIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(scriptId)
        return newSet
      })
      refetch()
    } catch (error) {
      toast.error(`Failed to delete script: ${error.message}`)
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
          <div className={`grid grid-cols-1 ${embedded ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
            {displayScripts.map(script => (
              <ScriptCard
                key={script.id}
                script={script}
                selected={!embedded && selectedScriptIds.has(script.id)}
                onToggleSelect={handleToggleSelect}
                onEdit={handleEdit}
                onDelete={handleDelete}
                compact={embedded}
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
    </div>
  )
}
