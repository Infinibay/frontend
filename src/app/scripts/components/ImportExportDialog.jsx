'use client'

import { useState } from 'react'
import {
  Dialog,
  Button,
  FileDrop,
  EmptyState,
  ResponsiveStack,
  Alert,
  Badge,
} from '@infinibay/harbor'
import { Upload, Download, FileCode } from 'lucide-react'
import { toast } from 'sonner'
import { useCreateScriptMutation } from '@/gql/hooks'

export function ImportExportDialog({ isOpen, onClose, mode, selectedScripts, onImportComplete }) {
  const [files, setFiles] = useState([])
  const [importing, setImporting] = useState(false)
  const [createScript] = useCreateScriptMutation()

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
              name: file.name.replace(/\.(yaml|yml|json)$/, ''),
            },
          },
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

    selectedScripts.forEach((script) => {
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

  const isImport = mode === 'import'
  const count = selectedScripts?.length || 0

  return (
    <Dialog
      open={!!isOpen}
      onClose={handleClose}
      size="md"
      title={isImport ? 'Import scripts' : 'Export scripts'}
      description={
        isImport
          ? 'Upload YAML or JSON script files. Each becomes a new script in the library.'
          : `Download ${count} script${count === 1 ? '' : 's'} as YAML files.`
      }
      footer={
        <ResponsiveStack direction="row" gap={2} justify="end">
          <Button variant="secondary" onClick={handleClose} disabled={importing}>
            Cancel
          </Button>
          <Button
            onClick={isImport ? handleImport : handleExport}
            disabled={isImport && (files.length === 0 || importing)}
            loading={isImport && importing}
            icon={isImport ? <Upload size={14} /> : <Download size={14} />}
          >
            {isImport ? (importing ? 'Importing…' : 'Import') : 'Export'}
          </Button>
        </ResponsiveStack>
      }
    >
      {isImport ? (
        <ResponsiveStack direction="col" gap={3}>
          <FileDrop
            accept=".yaml,.yml,.json"
            multiple
            hint="Drop YAML or JSON files, or click to browse"
            onFiles={(list) => setFiles(list)}
          />
          {files.length > 0 ? (
            <Alert tone="info" size="sm" title={`${files.length} file(s) ready to import`}>
              <ResponsiveStack direction="row" gap={1} wrap>
                {files.map((f, i) => (
                  <Badge key={i} tone="neutral" icon={<FileCode size={12} />}>
                    {f.name}
                  </Badge>
                ))}
              </ResponsiveStack>
            </Alert>
          ) : null}
        </ResponsiveStack>
      ) : count === 0 ? (
        <EmptyState
          variant="dashed"
          icon={<Download size={24} />}
          title="No scripts selected"
          description="Select one or more scripts from the list to export them."
        />
      ) : (
        <ResponsiveStack direction="col" gap={2}>
          {selectedScripts.map((script, i) => (
            <ResponsiveStack key={i} direction="row" gap={2} align="center">
              <FileCode size={14} />
              <span>{script.name}</span>
            </ResponsiveStack>
          ))}
        </ResponsiveStack>
      )}
    </Dialog>
  )
}
