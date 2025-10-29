'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export function BooleanInput({ input, value, onChange }) {
  // Get custom values from validation config, default to 1/0
  const checkedValue = input.validation?.checkedValue ?? '1'
  const uncheckedValue = input.validation?.uncheckedValue ?? '0'

  // Check if current value equals checked value
  const isChecked = value === checkedValue || (value === true && checkedValue === '1')

  const handleChange = (checked) => {
    onChange(checked ? checkedValue : uncheckedValue)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={input.name}
          checked={isChecked}
          onCheckedChange={handleChange}
        />
        <Label htmlFor={input.name} className="cursor-pointer">
          {input.label}
          {input.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      </div>
      {input.description && (
        <p className="text-xs text-muted-foreground mt-1">{input.description}</p>
      )}
    </div>
  )
}

export default BooleanInput
