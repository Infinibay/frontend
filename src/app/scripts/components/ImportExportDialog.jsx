'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, Download } from 'lucide-react'
import { useCreateScriptMutation } from '@/gql/hooks'
import { toast } from 'sonner'

export function ImportExportDialog({ isOpen, onClose, mode, selectedScripts, onImportComplete }) {
  const [files, setFiles] = useState([])
  const [importing, setImporting] = useState(false)
  const [createScript] = useCreateScriptMutation()

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles(droppedFiles)
  }

  const handleImport = async () => {
    setImporting(true)
    let successCount = 0
    let failCount = 0

    for (const file of files) {
      try {
        const content = await file.text()
        const format = file.name.endsWith('.json') ? 'json' : 'yaml'

        await createScript({
          variables: {
            input: {
              content,
              format,
              name: file.name.replace(/\.(yaml|yml|json)$/, '')
            }
          }
        })
        successCount++
      } catch (error) {
        console.error(`Failed to import ${file.name}:`, error)
        failCount++
      }
    }

    if (successCount > 0) {
      toast.success(`Imported ${successCount} script(s) successfully`)
      if (onImportComplete) onImportComplete()
    }
    if (failCount > 0) {
      toast.error(`Failed to import ${failCount} script(s)`)
    }

    setFiles([])
    setImporting(false)
    onClose()
  }

  const handleExport = () => {
    if (!selectedScripts || selectedScripts.length === 0) {
      toast.error('No scripts to export')
      return
    }

    selectedScripts.forEach(script => {
      if (!script.content) {
        console.warn(`Script ${script.name} has no content`)
        return
      }

      const blob = new Blob([script.content], { type: 'text/yaml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = script.fileName || `${script.name}.yaml`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })

    toast.success(`Exported ${selectedScripts.length} script(s)`)
    onClose()
  }

  const handleClose = () => {
    setFiles([])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'import' ? 'Import Scripts' : 'Export Scripts'}
          </DialogTitle>
        </DialogHeader>

        {mode === 'import' ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="font-medium mb-1">Drag and drop YAML/JSON files here</p>
            <p className="text-sm text-muted-foreground mb-4">or</p>
            <input
              type="file"
              accept=".yaml,.yml,.json"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-input').click()}
              type="button"
            >
              Browse Files
            </Button>
            {files.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium">{files.length} file(s) selected</p>
                <ul className="text-xs text-muted-foreground mt-2">
                  {files.map((file, i) => (
                    <li key={i}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm">Ready to export {selectedScripts?.length || 0} script(s):</p>
            <ul className="text-sm text-muted-foreground max-h-48 overflow-y-auto border rounded-lg p-3">
              {selectedScripts?.map((script, i) => (
                <li key={i} className="py-1">
                  • {script.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button
            onClick={mode === 'import' ? handleImport : handleExport}
            disabled={mode === 'import' && (files.length === 0 || importing)}
          >
            {mode === 'import' ? (
              importing ? 'Importing...' : 'Import'
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
