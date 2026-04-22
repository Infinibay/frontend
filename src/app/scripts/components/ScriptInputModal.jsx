'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  Button,
  FormField,
  TextField,
  Textarea,
  Select,
  Checkbox,
  Switch,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Alert,
  ResponsiveStack,
  ResponsiveGrid,
  Badge,
} from '@infinibay/harbor'
import { AlertCircle, Settings as SettingsIcon, ShieldCheck } from 'lucide-react'

const INPUT_TYPES = [
  { value: 'text', label: 'Text (String)' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Checkbox (Boolean)' },
]

const DEFAULT_VALIDATION = {
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

const EMPTY_FORM = {
  name: '',
  label: '',
  type: 'text',
  required: false,
  description: '',
  default: '',
  validation: { ...DEFAULT_VALIDATION },
}

export default function ScriptInputModal({
  open,
  onOpenChange,
  input,
  onSave,
  mode = 'create',
}) {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [activeTab, setActiveTab] = useState('basic')

  useEffect(() => {
    if (input) {
      const normalizedType =
        input.type === 'checkbox'
          ? 'boolean'
          : input.type === 'string'
            ? 'text'
            : input.type || 'text'

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
        },
      })
    } else {
      setFormData({ ...EMPTY_FORM, validation: { ...DEFAULT_VALIDATION } })
    }
    setErrors({})
    setActiveTab('basic')
  }, [input, open])

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const updateValidation = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      validation: { ...prev.validation, [field]: value },
    }))
    const errorKey = `validation${field.charAt(0).toUpperCase() + field.slice(1)}`
    if (errors[errorKey]) {
      const next = { ...errors }
      delete next[errorKey]
      setErrors(next)
    }
  }

  const validate = () => {
    const next = {}

    if (!formData.name.trim()) {
      next.name = 'Name is required'
    } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(formData.name)) {
      next.name =
        'Name must be a valid identifier (letters, numbers, underscores only, cannot start with number)'
    }

    if (!formData.label.trim()) {
      next.label = 'Label is required'
    }

    if (formData.type === 'number') {
      const min = parseFloat(formData.validation.min)
      const max = parseFloat(formData.validation.max)
      if (formData.validation.min !== '' && isNaN(min))
        next.validationMin = 'Min must be a valid number'
      if (formData.validation.max !== '' && isNaN(max))
        next.validationMax = 'Max must be a valid number'
      if (
        formData.validation.min !== '' &&
        formData.validation.max !== '' &&
        min > max
      )
        next.validationMin = 'Min must be less than or equal to Max'
      if (
        formData.validation.step !== '' &&
        isNaN(parseFloat(formData.validation.step))
      )
        next.validationStep = 'Step must be a valid number'
    }

    if (formData.type === 'text') {
      const minLen = parseInt(formData.validation.minLength)
      const maxLen = parseInt(formData.validation.maxLength)
      if (formData.validation.minLength !== '' && (isNaN(minLen) || minLen < 0))
        next.validationMinLength = 'Min length must be a positive number'
      if (formData.validation.maxLength !== '' && (isNaN(maxLen) || maxLen < 0))
        next.validationMaxLength = 'Max length must be a positive number'
      if (
        formData.validation.minLength !== '' &&
        formData.validation.maxLength !== '' &&
        minLen > maxLen
      )
        next.validationMinLength =
          'Min length must be less than or equal to Max length'

      if (formData.validation.pattern && formData.validation.pattern.trim()) {
        try {
          new RegExp(formData.validation.pattern.trim())
        } catch (e) {
          next.validationPattern = e.message
        }
      }
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSave = () => {
    if (!validate()) return

    const normalizedType = formData.type === 'checkbox' ? 'boolean' : formData.type
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
      if (v.patternDescription)
        cleanedValidation.patternDescription = v.patternDescription
    }
    if (normalizedType === 'boolean') {
      cleanedValidation.checkedValue = v.checkedValue || '1'
      cleanedValidation.uncheckedValue = v.uncheckedValue || '0'
    }

    onSave({
      name: formData.name,
      label: formData.label,
      type: normalizedType,
      required: formData.required,
      description: formData.description,
      default: formData.default,
      validation:
        Object.keys(cleanedValidation).length > 0 ? cleanedValidation : undefined,
    })
    onOpenChange(false)
  }

  const renderValidationFields = () => {
    switch (formData.type) {
      case 'number':
        return (
          <ResponsiveStack direction="col" gap={4}>
            <ResponsiveGrid columns={{ base: 1, sm: 2 }} gap={4}>
              <FormField label="Minimum value" error={errors.validationMin}>
                <TextField
                  type="number"
                  value={formData.validation.min}
                  onChange={(e) => updateValidation('min', e.target.value)}
                  placeholder="e.g. 0"
                />
              </FormField>
              <FormField label="Maximum value" error={errors.validationMax}>
                <TextField
                  type="number"
                  value={formData.validation.max}
                  onChange={(e) => updateValidation('max', e.target.value)}
                  placeholder="e.g. 100"
                />
              </FormField>
            </ResponsiveGrid>
            <FormField
              label="Step value"
              helper="Increment/decrement step (e.g. 1 for integers, 0.01 for decimals)"
              error={errors.validationStep}
            >
              <TextField
                type="number"
                value={formData.validation.step}
                onChange={(e) => updateValidation('step', e.target.value)}
                placeholder="e.g. 0.1 or 1"
              />
            </FormField>
            <Checkbox
              label="Integer only (no decimals)"
              checked={!!formData.validation.integerOnly}
              onChange={(e) => updateValidation('integerOnly', e.target.checked)}
            />
          </ResponsiveStack>
        )

      case 'text':
        return (
          <ResponsiveStack direction="col" gap={4}>
            <ResponsiveGrid columns={{ base: 1, sm: 2 }} gap={4}>
              <FormField label="Minimum length" error={errors.validationMinLength}>
                <TextField
                  type="number"
                  min={0}
                  value={formData.validation.minLength}
                  onChange={(e) => updateValidation('minLength', e.target.value)}
                  placeholder="e.g. 3"
                />
              </FormField>
              <FormField label="Maximum length" error={errors.validationMaxLength}>
                <TextField
                  type="number"
                  min={0}
                  value={formData.validation.maxLength}
                  onChange={(e) => updateValidation('maxLength', e.target.value)}
                  placeholder="e.g. 100"
                />
              </FormField>
            </ResponsiveGrid>
            <FormField
              label="Regular expression pattern"
              helper="Advanced: enforce custom patterns (e.g. email format)"
              error={errors.validationPattern}
            >
              <TextField
                value={formData.validation.pattern}
                onChange={(e) => updateValidation('pattern', e.target.value)}
                placeholder="e.g. ^[A-Z][a-z]+$"
              />
            </FormField>
            <FormField
              label="Pattern description (help text)"
              helper="User-friendly explanation of the pattern requirement"
            >
              <Textarea
                value={formData.validation.patternDescription}
                onChange={(e) =>
                  updateValidation('patternDescription', e.target.value)
                }
                placeholder="e.g. Must start with capital letter followed by lowercase letters"
                rows={2}
              />
            </FormField>
          </ResponsiveStack>
        )

      case 'boolean':
        return (
          <ResponsiveStack direction="col" gap={4}>
            <Alert tone="info" size="sm" title="Checkbox output values">
              Configure the values passed to the script when the checkbox is checked or unchecked.
            </Alert>
            <FormField
              label="Value when checked"
              helper='Value sent to script when checkbox is selected (default: "1")'
            >
              <TextField
                value={formData.validation.checkedValue}
                onChange={(e) => updateValidation('checkedValue', e.target.value)}
                placeholder="e.g. 1, true, enabled"
              />
            </FormField>
            <FormField
              label="Value when unchecked"
              helper='Value sent to script when checkbox is not selected (default: "0")'
            >
              <TextField
                value={formData.validation.uncheckedValue}
                onChange={(e) => updateValidation('uncheckedValue', e.target.value)}
                placeholder="e.g. 0, false, disabled"
              />
            </FormField>
            <Alert tone="neutral" size="sm" title="Examples">
              <ResponsiveStack direction="col" gap={1}>
                <span>Numeric: 1 / 0</span>
                <span>Boolean text: true / false</span>
                <span>PowerShell flag: -Enabled / "" (empty)</span>
                <span>Status: enabled / disabled</span>
              </ResponsiveStack>
            </Alert>
          </ResponsiveStack>
        )

      default:
        return null
    }
  }

  return (
    <Dialog
      open={!!open}
      onClose={() => onOpenChange(false)}
      size="lg"
      title={mode === 'edit' ? 'Edit input' : 'Add new input'}
      description="Configure the input parameter requested when running this script."
      footer={
        <ResponsiveStack direction="row" gap={2} justify="end">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === 'edit' ? 'Save changes' : 'Add input'}
          </Button>
        </ResponsiveStack>
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} variant="underline">
        <TabList>
          <Tab value="basic" icon={<SettingsIcon size={14} />}>
            Basic settings
          </Tab>
          <Tab value="validation" icon={<ShieldCheck size={14} />}>
            Validation rules
          </Tab>
        </TabList>

        <TabPanel value="basic">
          <ResponsiveStack direction="col" gap={4}>
            <FormField
              label="Name"
              required
              helper={
                <ResponsiveStack direction="row" gap={1} align="center">
                  <span>Variable name used in script as</span>
                  <Badge tone="neutral">{'${{ inputs.name }}'}</Badge>
                </ResponsiveStack>
              }
              error={errors.name}
            >
              <TextField
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g. software_url"
              />
            </FormField>

            <FormField label="Label" required error={errors.label}>
              <TextField
                value={formData.label}
                onChange={(e) => updateField('label', e.target.value)}
                placeholder="e.g. Software download URL"
              />
            </FormField>

            <FormField label="Type">
              <Select
                value={formData.type}
                onChange={(value) => updateField('type', value)}
                options={INPUT_TYPES}
              />
            </FormField>

            <FormField labelless>
              <Switch
                label="Required (must be provided when running script)"
                checked={!!formData.required}
                onChange={(e) => updateField('required', e.target.checked)}
              />
            </FormField>

            <FormField label="Default value" helper="Pre-filled value that users can override">
              <TextField
                value={formData.default}
                onChange={(e) => updateField('default', e.target.value)}
                placeholder="Optional default value"
              />
            </FormField>

            <FormField label="Description" helper="Displayed as help text below the input field">
              <Textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Help text explaining what this input is for"
                rows={3}
              />
            </FormField>
          </ResponsiveStack>
        </TabPanel>

        <TabPanel value="validation">{renderValidationFields()}</TabPanel>
      </Tabs>

      {Object.keys(errors).length > 0 ? (
        <Alert tone="danger" size="sm" icon={<AlertCircle size={14} />} title="Fix errors before saving">
          <ResponsiveStack direction="col" gap={1}>
            {Object.values(errors)
              .filter(Boolean)
              .map((msg, i) => (
                <span key={i}>{msg}</span>
              ))}
          </ResponsiveStack>
        </Alert>
      ) : null}
    </Dialog>
  )
}
