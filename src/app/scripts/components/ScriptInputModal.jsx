'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle } from 'lucide-react'

const INPUT_TYPES = [
  { value: 'text', label: 'Text (String)' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Checkbox (Boolean)' },
]

export default function ScriptInputModal({ open, onOpenChange, input, onSave, mode = 'create' }) {
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    type: 'text',
    required: false,
    description: '',
    default: '',
    // Validation fields
    validation: {
      // Number validations
      min: '',
      max: '',
      integerOnly: false,
      step: '',
      // String validations
      minLength: '',
      maxLength: '',
      pattern: '',
      patternDescription: '',
      // Checkbox validations
      checkedValue: '1',
      uncheckedValue: '0',
    }
  })

  const [errors, setErrors] = useState({})
  const [activeTab, setActiveTab] = useState('basic')

  // Populate form when editing
  useEffect(() => {
    if (input) {
      // Normalize legacy 'checkbox' type to 'boolean' and 'string' to 'text'
      const normalizedType = input.type === 'checkbox' ? 'boolean' : (input.type === 'string' ? 'text' : (input.type || 'text'))

      setFormData({
        name: input.name || '',
        label: input.label || '',
        type: normalizedType,
        required: input.required || false,
        description: input.description || '',
        default: input.default || '',
        validation: {
          min: input.validation?.min ?? '',
          max: input.validation?.max ?? '',
          integerOnly: input.validation?.integerOnly ?? false,
          step: input.validation?.step ?? '',
          minLength: input.validation?.minLength ?? '',
          maxLength: input.validation?.maxLength ?? '',
          pattern: input.validation?.pattern ?? '',
          patternDescription: input.validation?.patternDescription ?? '',
          checkedValue: input.validation?.checkedValue ?? '1',
          uncheckedValue: input.validation?.uncheckedValue ?? '0',
        }
      })
    } else {
      // Reset form for new input
      setFormData({
        name: '',
        label: '',
        type: 'text',
        required: false,
        description: '',
        default: '',
        validation: {
          min: '',
          max: '',
          integerOnly: false,
          step: '',
          minLength: '',
          maxLength: '',
          pattern: '',
          patternDescription: '',
          checkedValue: '1',
          uncheckedValue: '0',
        }
      })
    }
    setErrors({})
    setActiveTab('basic')
  }, [input, open])

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const updateValidation = (field, value) => {
    setFormData(prev => ({
      ...prev,
      validation: { ...prev.validation, [field]: value }
    }))
    // Clear error for this validation field
    const errorKey = `validation${field.charAt(0).toUpperCase() + field.slice(1)}`
    if (errors[errorKey]) {
      const newErrors = { ...errors }
      delete newErrors[errorKey]
      setErrors(newErrors)
    }
  }

  const validate = () => {
    const newErrors = {}

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(formData.name)) {
      newErrors.name = 'Name must be a valid identifier (letters, numbers, underscores only, cannot start with number)'
    }

    if (!formData.label.trim()) {
      newErrors.label = 'Label is required'
    }

    // Validation field validations
    if (formData.type === 'number') {
      const min = parseFloat(formData.validation.min)
      const max = parseFloat(formData.validation.max)

      if (formData.validation.min !== '' && isNaN(min)) {
        newErrors.validationMin = 'Min must be a valid number'
      }
      if (formData.validation.max !== '' && isNaN(max)) {
        newErrors.validationMax = 'Max must be a valid number'
      }
      if (formData.validation.min !== '' && formData.validation.max !== '' && min > max) {
        newErrors.validationMin = 'Min must be less than or equal to Max'
      }
      if (formData.validation.step !== '' && isNaN(parseFloat(formData.validation.step))) {
        newErrors.validationStep = 'Step must be a valid number'
      }
    }

    if (formData.type === 'text') {
      const minLen = parseInt(formData.validation.minLength)
      const maxLen = parseInt(formData.validation.maxLength)

      if (formData.validation.minLength !== '' && (isNaN(minLen) || minLen < 0)) {
        newErrors.validationMinLength = 'Min length must be a positive number'
      }
      if (formData.validation.maxLength !== '' && (isNaN(maxLen) || maxLen < 0)) {
        newErrors.validationMaxLength = 'Max length must be a positive number'
      }
      if (formData.validation.minLength !== '' && formData.validation.maxLength !== '' && minLen > maxLen) {
        newErrors.validationMinLength = 'Min length must be less than or equal to Max length'
      }

      // Validate regex pattern
      if (formData.validation.pattern && formData.validation.pattern.trim()) {
        try {
          const pattern = formData.validation.pattern.trim()
          // Test if the regex is valid
          new RegExp(pattern)
          // Regex is valid, no error
        } catch (e) {
          // Show specific error message from JavaScript
          newErrors.validationPattern = e.message
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validate()) {
      return
    }

    // Defensive normalization: ensure 'checkbox' is converted to 'boolean'
    const normalizedType = formData.type === 'checkbox' ? 'boolean' : formData.type

    // Clean up validation object - remove empty/irrelevant fields
    const cleanedValidation = {}
    const v = formData.validation

    if (normalizedType === 'number') {
      if (v.min !== '') cleanedValidation.min = parseFloat(v.min)
      if (v.max !== '') cleanedValidation.max = parseFloat(v.max)
      if (v.integerOnly) cleanedValidation.integerOnly = true
      if (v.step !== '') cleanedValidation.step = parseFloat(v.step)
    }

    if (normalizedType === 'text') {
      if (v.minLength !== '') cleanedValidation.minLength = parseInt(v.minLength)
      if (v.maxLength !== '') cleanedValidation.maxLength = parseInt(v.maxLength)
      if (v.pattern) cleanedValidation.pattern = v.pattern
      if (v.patternDescription) cleanedValidation.patternDescription = v.patternDescription
    }

    if (normalizedType === 'boolean') {
      cleanedValidation.checkedValue = v.checkedValue || '1'
      cleanedValidation.uncheckedValue = v.uncheckedValue || '0'
    }

    const inputData = {
      name: formData.name,
      label: formData.label,
      type: normalizedType,
      required: formData.required,
      description: formData.description,
      default: formData.default,
      validation: Object.keys(cleanedValidation).length > 0 ? cleanedValidation : undefined
    }

    onSave(inputData)
    onOpenChange(false)
  }

  const renderValidationFields = () => {
    switch (formData.type) {
      case 'number':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validation-min">Minimum Value</Label>
                <Input
                  id="validation-min"
                  type="number"
                  value={formData.validation.min}
                  onChange={(e) => updateValidation('min', e.target.value)}
                  placeholder="e.g., 0"
                />
                {errors.validationMin && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.validationMin}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="validation-max">Maximum Value</Label>
                <Input
                  id="validation-max"
                  type="number"
                  value={formData.validation.max}
                  onChange={(e) => updateValidation('max', e.target.value)}
                  placeholder="e.g., 100"
                />
                {errors.validationMax && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.validationMax}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="validation-step">Step Value</Label>
              <Input
                id="validation-step"
                type="number"
                value={formData.validation.step}
                onChange={(e) => updateValidation('step', e.target.value)}
                placeholder="e.g., 0.1 or 1"
              />
              <p className="text-xs text-muted-foreground">
                Increment/decrement step for number input (e.g., 1 for integers, 0.01 for decimals)
              </p>
              {errors.validationStep && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.validationStep}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="validation-integer-only"
                checked={formData.validation.integerOnly}
                onCheckedChange={(checked) => updateValidation('integerOnly', checked)}
              />
              <Label htmlFor="validation-integer-only" className="cursor-pointer font-normal">
                Integer Only (no decimals)
              </Label>
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validation-min-length">Minimum Length</Label>
                <Input
                  id="validation-min-length"
                  type="number"
                  min="0"
                  value={formData.validation.minLength}
                  onChange={(e) => updateValidation('minLength', e.target.value)}
                  placeholder="e.g., 3"
                />
                {errors.validationMinLength && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.validationMinLength}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="validation-max-length">Maximum Length</Label>
                <Input
                  id="validation-max-length"
                  type="number"
                  min="0"
                  value={formData.validation.maxLength}
                  onChange={(e) => updateValidation('maxLength', e.target.value)}
                  placeholder="e.g., 100"
                />
                {errors.validationMaxLength && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.validationMaxLength}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="validation-pattern">Regular Expression Pattern</Label>
              <Input
                id="validation-pattern"
                value={formData.validation.pattern}
                onChange={(e) => updateValidation('pattern', e.target.value)}
                placeholder="e.g., ^[A-Z][a-z]+$"
                className="font-mono text-sm"
              />
              {errors.validationPattern && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.validationPattern}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Advanced: Use regex to enforce custom patterns (e.g., email format, specific structure)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="validation-pattern-desc">Pattern Description (Help Text)</Label>
              <Textarea
                id="validation-pattern-desc"
                value={formData.validation.patternDescription}
                onChange={(e) => updateValidation('patternDescription', e.target.value)}
                placeholder="e.g., Must start with capital letter followed by lowercase letters"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                User-friendly explanation of the pattern requirement
              </p>
            </div>
          </div>
        )

      case 'boolean':
        return (
          <div className="space-y-4">
            <div className="mb-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              Configure what values should be used when the checkbox is checked or unchecked.
              These values will be passed to your script as the input variable.
            </div>

            <div className="space-y-2">
              <Label htmlFor="validation-checked-value">Value When Checked</Label>
              <Input
                id="validation-checked-value"
                value={formData.validation.checkedValue}
                onChange={(e) => updateValidation('checkedValue', e.target.value)}
                placeholder="e.g., 1, true, enabled"
              />
              <p className="text-xs text-muted-foreground">
                Value sent to script when checkbox is selected (default: "1")
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="validation-unchecked-value">Value When Unchecked</Label>
              <Input
                id="validation-unchecked-value"
                value={formData.validation.uncheckedValue}
                onChange={(e) => updateValidation('uncheckedValue', e.target.value)}
                placeholder="e.g., 0, false, disabled"
              />
              <p className="text-xs text-muted-foreground">
                Value sent to script when checkbox is not selected (default: "0")
              </p>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-sm">
              <p className="font-medium mb-2">Examples:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Numeric: <code>1</code> / <code>0</code></li>
                <li>• Boolean text: <code>true</code> / <code>false</code></li>
                <li>• PowerShell flag: <code>-Enabled</code> / <code>""</code> (empty)</li>
                <li>• Status: <code>enabled</code> / <code>disabled</code></li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Input' : 'Add New Input'}
          </DialogTitle>
          <DialogDescription>
            Configure the input parameter that will be requested when running this script
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="validation">Validation Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="input-name">
                Name * <span className="text-xs text-muted-foreground font-normal">(used in script as {'${{ inputs.name }}'})</span>
              </Label>
              <Input
                id="input-name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., software_url"
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Variable name used in script. Must be a valid identifier (letters, numbers, underscores).
              </p>
            </div>

            {/* Label Field */}
            <div className="space-y-2">
              <Label htmlFor="input-label">Label *</Label>
              <Input
                id="input-label"
                value={formData.label}
                onChange={(e) => updateField('label', e.target.value)}
                placeholder="e.g., Software Download URL"
                className={errors.label ? 'border-destructive' : ''}
              />
              {errors.label && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.label}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                User-friendly label displayed in the UI
              </p>
            </div>

            {/* Type Field */}
            <div className="space-y-2">
              <Label htmlFor="input-type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => updateField('type', value)}
              >
                <SelectTrigger id="input-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INPUT_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Required Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="input-required"
                checked={formData.required}
                onCheckedChange={(checked) => updateField('required', checked)}
              />
              <Label htmlFor="input-required" className="cursor-pointer font-normal">
                Required (must be provided when running script)
              </Label>
            </div>

            {/* Default Value */}
            <div className="space-y-2">
              <Label htmlFor="input-default">Default Value</Label>
              <Input
                id="input-default"
                value={formData.default}
                onChange={(e) => updateField('default', e.target.value)}
                placeholder="Optional default value"
              />
              <p className="text-xs text-muted-foreground">
                Pre-filled value that users can override
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="input-description">Description</Label>
              <Textarea
                id="input-description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Help text explaining what this input is for"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Displayed as help text below the input field
              </p>
            </div>
          </TabsContent>

          <TabsContent value="validation" className="mt-4">
            {renderValidationFields()}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === 'edit' ? 'Save Changes' : 'Add Input'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
