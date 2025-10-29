'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { validateScriptInput } from '@/utils/validateScriptInput'

export function SelectInput({ input, value, onChange, error }) {
  const validationError = validateScriptInput(input, value)

  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={error || validationError ? 'border-destructive' : ''}>
          <SelectValue placeholder={`Select ${input.label}`} />
        </SelectTrigger>
        <SelectContent>
          {input.options?.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {(error || validationError) && (
        <p className="text-xs text-destructive">{error || validationError}</p>
      )}
    </div>
  )
}

export default SelectInput
