'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Editor from '@monaco-editor/react'
import { useScriptQuery, useCreateScriptMutation, useUpdateScriptMutation } from '@/gql/hooks'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Monitor, Server, Terminal, Plus, Trash2, Edit } from 'lucide-react'
import { toast } from 'sonner'
import yaml from 'js-yaml'
import ScriptInputModal from '@/app/scripts/components/ScriptInputModal'
import { ScriptEditorHeader } from '@/app/scripts/components/ScriptEditorHeader'
import { ScriptHelpSheet } from '@/app/scripts/components/ScriptHelpSheet'
import { TagInput } from '@/components/ui/tag-input'
import { parseScriptError } from '@/utils/parseScriptError'

export default function ScriptEditorPage() {
  const params = useParams()
  const router = useRouter()
  const scriptId = params.id
  const isNew = scriptId === 'new'
  const editorRef = useRef(null)
  const monacoRef = useRef(null)

  const [scriptContent, setScriptContent] = useState('# Write your script here\n')
  const [scriptName, setScriptName] = useState('New Script')
  const [scriptDescription, setScriptDescription] = useState('')
  const [scriptTags, setScriptTags] = useState([])
  const [scriptInputs, setScriptInputs] = useState([])
  const [activeTab, setActiveTab] = useState('edit')
  const [errors, setErrors] = useState([])
  const [selectedOS, setSelectedOS] = useState(['windows'])
  const [selectedShell, setSelectedShell] = useState('powershell')
  const [editorLanguage, setEditorLanguage] = useState('powershell')
  const [originalYamlData, setOriginalYamlData] = useState(null)
  const [inputModalOpen, setInputModalOpen] = useState(false)
  const [editingInputIndex, setEditingInputIndex] = useState(null)
  const [helpSheetOpen, setHelpSheetOpen] = useState(false)

  // Load existing script
  const { data, loading } = useScriptQuery({
    variables: { id: scriptId },
    skip: isNew
  })

  const [createScript, { loading: creating }] = useCreateScriptMutation()
  const [updateScript, { loading: updating }] = useUpdateScriptMutation()

  useEffect(() => {
    if (data?.script?.content) {
      try {
        const parsed = yaml.load(data.script.content)

        // Store original parsed data to preserve unknown fields
        setOriginalYamlData(parsed)

        setScriptName(parsed?.name || 'New Script')
        setScriptDescription(parsed?.description || '')
        setScriptTags(data.script.tags || [])
        setScriptContent(parsed?.script || '# Write your script here\n')

        // Normalize legacy 'checkbox' type to 'boolean' in inputs
        const normalizedInputs = (parsed?.inputs || []).map(input => ({
          ...input,
          type: input.type === 'checkbox' ? 'boolean' : input.type
        }))
        setScriptInputs(normalizedInputs)

        // Handle OS (string or array)
        let os = parsed?.os
        if (Array.isArray(os)) {
          setSelectedOS(os.length > 0 ? os : ['windows'])
        } else if (typeof os === 'string') {
          setSelectedOS([os])
        } else {
          setSelectedOS(['windows'])
        }

        const shell = parsed?.shell || 'powershell'
        setSelectedShell(shell)
        setEditorLanguage(getMonacoLanguage(shell))
      } catch (error) {
        console.error('Failed to parse script:', error)
        toast.error('Failed to load script')
      }
    }
  }, [data])

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setInterval(() => {
      if (scriptContent) {
        const draft = {
          scriptContent,
          scriptName,
          scriptDescription,
          scriptTags,
          scriptInputs,
          selectedOS,
          selectedShell
        }
        localStorage.setItem(`script-draft-${scriptId}`, JSON.stringify(draft))
      }
    }, 30000)
    return () => clearInterval(timer)
  }, [scriptContent, scriptName, scriptDescription, scriptTags, scriptInputs, selectedOS, selectedShell, scriptId])

  // Clear errors reactively when required fields are filled
  useEffect(() => {
    if (errors.length > 0) {
      // Clear errors if basic required fields are now valid
      if (scriptName.trim() && selectedOS.length > 0 && selectedShell && scriptContent.trim()) {
        setErrors([])
      }
    }
  }, [scriptName, selectedOS, selectedShell, scriptContent, errors.length])

  // Monaco editor setup
  const handleEditorWillMount = (monaco) => {
    monacoRef.current = monaco
    // Monaco already has built-in support for PowerShell, Bash, and Batch
    // No custom configuration needed
  }

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
  }

  const validateScript = () => {
    const validationErrors = []

    // Check metadata requirements
    if (!scriptName.trim()) {
      validationErrors.push({ message: 'Script name is required' })
    }
    if (!selectedOS || selectedOS.length === 0) {
      validationErrors.push({ message: 'At least one operating system must be selected' })
    }
    if (!selectedShell) {
      validationErrors.push({ message: 'Shell type must be selected' })
    }
    if (!scriptContent.trim()) {
      validationErrors.push({ message: 'Script content cannot be empty' })
    }

    // Validate inputs
    scriptInputs.forEach((input, index) => {
      if (!input.name.trim()) {
        validationErrors.push({ message: `Input #${index + 1}: Name is required` })
      }
      if (!input.label.trim()) {
        validationErrors.push({ message: `Input #${index + 1}: Label is required` })
      }
      // Check for duplicate input names
      const duplicates = scriptInputs.filter(i => i.name === input.name)
      if (duplicates.length > 1) {
        validationErrors.push({ message: `Input name "${input.name}" is duplicated` })
      }
    })

    setErrors(validationErrors)
    return validationErrors.length === 0
  }

  const getMonacoLanguage = (shell) => {
    switch (shell) {
      case 'powershell':
        return 'powershell'
      case 'bash':
      case 'sh':
        return 'shell'
      case 'cmd':
        return 'bat'
      default:
        return 'powershell'
    }
  }

  const handleOSChange = (os, checked) => {
    let newSelectedOS
    if (checked) {
      // Only allow one OS at a time (mutually exclusive)
      newSelectedOS = [os]
    } else {
      // If unchecking, don't allow empty selection
      // Keep at least one OS selected
      return
    }
    setSelectedOS(newSelectedOS)

    // Adjust shell if incompatible with new OS selection
    // If Windows is selected and shell is Linux-only
    if (newSelectedOS[0] === 'windows') {
      if (selectedShell === 'bash' || selectedShell === 'sh') {
        const newShell = 'powershell'
        setSelectedShell(newShell)
        setEditorLanguage(getMonacoLanguage(newShell))
      }
    }
    // If Linux is selected, always use bash by default
    else if (newSelectedOS[0] === 'linux') {
      if (selectedShell === 'cmd' || selectedShell === 'powershell') {
        const newShell = 'bash'
        setSelectedShell(newShell)
        setEditorLanguage(getMonacoLanguage(newShell))
      }
    }
  }

  const handleShellChange = (shell) => {
    setSelectedShell(shell)
    const newLanguage = getMonacoLanguage(shell)
    setEditorLanguage(newLanguage)
  }

  const getAvailableShells = () => {
    const hasWindows = selectedOS.includes('windows')
    const hasLinux = selectedOS.includes('linux')

    if (hasWindows) {
      return [
        { value: 'powershell', label: 'PowerShell' },
        { value: 'cmd', label: 'CMD (Command Prompt)' }
      ]
    } else if (hasLinux) {
      return [
        { value: 'bash', label: 'Bash' },
        { value: 'sh', label: 'SH (Shell)' }
      ]
    }
    return []
  }

  const openAddInputModal = () => {
    setEditingInputIndex(null)
    setInputModalOpen(true)
  }

  const openEditInputModal = (index) => {
    setEditingInputIndex(index)
    setInputModalOpen(true)
  }

  const handleInputSave = (inputData) => {
    if (editingInputIndex !== null) {
      // Edit existing input
      const updated = [...scriptInputs]
      updated[editingInputIndex] = inputData
      setScriptInputs(updated)
      toast.success('Input updated successfully')
    } else {
      // Add new input
      setScriptInputs([...scriptInputs, inputData])
      toast.success('Input added successfully')
    }
  }

  const removeInput = (index) => {
    setScriptInputs(scriptInputs.filter((_, i) => i !== index))
    toast.success('Input removed')
  }

  const duplicateInput = (index) => {
    const inputToDuplicate = scriptInputs[index]
    const duplicated = {
      ...inputToDuplicate,
      name: `${inputToDuplicate.name}_copy`,
      label: `${inputToDuplicate.label} (Copy)`
    }
    setScriptInputs([...scriptInputs, duplicated])
    toast.success('Input duplicated')
  }

  const handleSave = async () => {
    if (!validateScript()) {
      toast.error('Please fix validation errors before saving')

      // Ensure error panel is visible by switching to edit tab
      setActiveTab('edit')

      // Defer scroll until after React renders the error panel
      requestAnimationFrame(() => {
        const errorPanel = document.getElementById('validation-errors')
        if (errorPanel) {
          errorPanel.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }
      })

      return
    }

    try {
      // Start with original YAML data to preserve unknown fields
      // If no original data exists (new script), start with empty object
      const yamlData = originalYamlData ? { ...originalYamlData } : {}

      // Merge our updates into the object
      yamlData.name = scriptName
      yamlData.description = scriptDescription
      yamlData.os = selectedOS
      yamlData.shell = selectedShell

      // Add inputs if any exist, otherwise remove the field
      if (scriptInputs.length > 0) {
        yamlData.inputs = scriptInputs
      } else {
        delete yamlData.inputs
      }

      // Add script content
      yamlData.script = scriptContent

      const yamlContent = yaml.dump(yamlData)

      if (isNew) {
        await createScript({
          variables: {
            input: {
              content: yamlContent,
              format: 'yaml',
              name: scriptName,
              tags: scriptTags
            }
          }
        })
        toast.success('Script created successfully')
        router.push('/scripts')
      } else {
        await updateScript({
          variables: {
            input: {
              id: scriptId,
              name: scriptName,
              content: yamlContent,
              tags: scriptTags
            }
          }
        })
        toast.success('Script updated successfully')
      }
      localStorage.removeItem(`script-draft-${scriptId}`)
    } catch (error) {
      const context = isNew ? 'script creation' : 'script update'
      const userMessage = parseScriptError(error, context)
      toast.error(userMessage)
    }
  }

  const handleCancel = () => {
    router.push('/scripts')
  }

  return (
    <div className="space-y-6">
      <ScriptEditorHeader
        isNew={isNew}
        scriptName={scriptName}
        onSave={handleSave}
        onCancel={handleCancel}
        onHelp={() => setHelpSheetOpen(true)}
        isSaving={creating || updating}
        isDisabled={selectedOS.length === 0 || !selectedShell}
      />

      <div className="container mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-4">
          {/* Metadata Controls */}
          <Card className="p-4 mb-4">
            <div className="space-y-4">
              {/* Script Name and Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="script-name">Script Name *</Label>
                  <Input
                    id="script-name"
                    value={scriptName}
                    onChange={(e) => setScriptName(e.target.value)}
                    placeholder="Enter script name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="script-description">Description</Label>
                  <Input
                    id="script-description"
                    value={scriptDescription}
                    onChange={(e) => setScriptDescription(e.target.value)}
                    placeholder="Brief description (optional)"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="script-tags">Tags</Label>
                <TagInput
                  value={scriptTags}
                  onChange={setScriptTags}
                  placeholder="Add tags to categorize this script..."
                  maxTags={10}
                />
                <p className="text-xs text-muted-foreground">
                  Tags help organize and filter scripts in your library
                </p>
              </div>

              {/* OS and Shell Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* OS Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Operating System *
                  </Label>
                  <div className="space-y-3 border rounded-md p-3">
                    <div className="flex items-center space-x-2 w-full">
                      <Checkbox
                        id="os-windows"
                        checked={selectedOS.includes('windows')}
                        onCheckedChange={(checked) => handleOSChange('windows', checked)}
                      />
                      <Label htmlFor="os-windows" className="cursor-pointer font-normal flex items-center gap-2 flex-1">
                        <Monitor className="h-4 w-4 shrink-0" />
                        Windows
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 w-full">
                      <Checkbox
                        id="os-linux"
                        checked={selectedOS.includes('linux')}
                        onCheckedChange={(checked) => handleOSChange('linux', checked)}
                      />
                      <Label htmlFor="os-linux" className="cursor-pointer font-normal flex items-center gap-2 flex-1">
                        <Server className="h-4 w-4 shrink-0" />
                        Linux
                      </Label>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select target operating system
                  </p>
                </div>

                {/* Shell Selection */}
                <div className="space-y-2">
                  <Label htmlFor="shell-select" className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    Shell Type *
                  </Label>
                  <Select value={selectedShell} onValueChange={handleShellChange}>
                    <SelectTrigger id="shell-select">
                      <SelectValue placeholder="Select shell" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableShells().map(shell => (
                        <SelectItem key={shell.value} value={shell.value}>
                          {shell.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Shell for script execution
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Script Inputs */}
          <Card className="p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium">Script Inputs</h3>
                <p className="text-xs text-muted-foreground">
                  Define parameters that will be requested when running this script
                </p>
              </div>
              <Button onClick={openAddInputModal} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Input
              </Button>
            </div>

            {scriptInputs.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                No inputs defined. Click "Add Input" to add parameters for this script.
              </div>
            ) : (
              <div className="glass-subtle elevation-1 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border/50">
                    <tr>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Name</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Variable</th>
                      <th className="text-center text-xs font-medium text-muted-foreground px-4 py-2">Type</th>
                      <th className="text-center text-xs font-medium text-muted-foreground px-4 py-2">Required</th>
                      <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {scriptInputs.map((input, index) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm font-medium">{input.label || input.name}</span>
                          </div>
                          {input.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {input.description}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <code className="text-xs bg-muted/50 px-2 py-0.5 rounded text-muted-foreground">
                            {'${{ inputs.'}{input.name}{' }}'}
                          </code>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium capitalize">
                            {input.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {input.required ? (
                            <span className="inline-flex items-center text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                              Yes
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">No</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditInputModal(index)}
                              className="h-7 w-7 p-0"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeInput(index)}
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>


          {/* Monaco Editor */}
          <Card className="p-0 overflow-hidden">
            <Editor
              height="600px"
              defaultLanguage="powershell"
              language={editorLanguage}
              value={scriptContent}
              onChange={setScriptContent}
              theme="vs-dark"
              beforeMount={handleEditorWillMount}
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: 'on',
                folding: true,
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
          </Card>
          {errors.length > 0 && (
            <div id="validation-errors" className="mt-4 p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-sm text-destructive font-medium">Validation Errors:</p>
              {errors.map((error, i) => (
                <div key={i} className="text-sm text-destructive mt-1">
                  {error.line && error.column ? (
                    <span className="font-mono">
                      Line {error.line}, Column {error.column}: {error.message}
                    </span>
                  ) : (
                    <span>{error.message}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold">{scriptName || 'Untitled Script'}</h3>
                {scriptDescription && (
                  <p className="text-sm text-muted-foreground mt-1">{scriptDescription}</p>
                )}
                {scriptTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {scriptTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Operating System:</span>{' '}
                  <span className="capitalize">{selectedOS.join(', ')}</span>
                </div>
                <div>
                  <span className="font-medium">Shell Type:</span>{' '}
                  <span className="capitalize">{selectedShell}</span>
                </div>
              </div>

              {scriptInputs.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3">Script Inputs:</h4>
                  <div className="space-y-2">
                    {scriptInputs.map((input, index) => (
                      <div key={index} className="bg-muted p-3 rounded-lg text-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-medium">{input.label || input.name}</span>
                            {input.required && <span className="text-destructive ml-1">*</span>}
                            <span className="text-muted-foreground ml-2">({input.type})</span>
                          </div>
                          {input.default && (
                            <span className="text-xs text-muted-foreground">Default: {input.default}</span>
                          )}
                        </div>
                        {input.description && (
                          <p className="text-xs text-muted-foreground mt-1">{input.description}</p>
                        )}
                        <code className="text-xs text-muted-foreground mt-1 block">
                          {'${{ inputs.'}{input.name}{' }}'}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-2">Script Content:</h4>
                <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                  {scriptContent || '# No content'}
                </pre>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

        {/* Input Configuration Modal */}
        <ScriptInputModal
          open={inputModalOpen}
          onOpenChange={setInputModalOpen}
          input={editingInputIndex !== null ? scriptInputs[editingInputIndex] : null}
          onSave={handleInputSave}
          mode={editingInputIndex !== null ? 'edit' : 'create'}
        />

        {/* Help Sheet */}
        <ScriptHelpSheet
          open={helpSheetOpen}
          onOpenChange={setHelpSheetOpen}
        />
      </div>
    </div>
  )
}
