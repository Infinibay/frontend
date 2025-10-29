'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { validateScriptInput } from '@/utils/validateScriptInput'

export function MultiSelectInput({ input, value, onChange, error }) {
  const selectedValues = Array.isArray(value) ? value : []

  const handleToggle = (optionValue) => {
    const newValue = selectedValues.includes(optionValue)
      ? selectedValues.filter(v => v !== optionValue)
      : [...selectedValues, optionValue]
    onChange(newValue)
  }

  const selectAll = () => {
    onChange(input.options?.map(opt => opt.value) || [])
  }

  const clearAll = () => {
    onChange([])
  }

  const validationError = validateScriptInput(input, selectedValues)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {selectedValues.length} selected
        </span>
        <div className="space-x-2">
          <Button size="sm" variant="ghost" onClick={selectAll}>
            Select All
          </Button>
          <Button size="sm" variant="ghost" onClick={clearAll}>
            Clear
          </Button>
        </div>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
        {input.options?.map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${input.name}-${option.value}`}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={() => handleToggle(option.value)}
              disabled={
                !selectedValues.includes(option.value) &&
                input.validation?.maxSelections &&
                selectedValues.length >= input.validation.maxSelections
              }
            />
            <Label htmlFor={`${input.name}-${option.value}`} className="cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </div>
      {(error || validationError) && (
        <p className="text-xs text-destructive">{error || validationError}</p>
      )}
    </div>
  )
}

export default MultiSelectInput
