'use client'

import { MultiSelect, FormField } from '@infinibay/harbor'
import { validateScriptInput } from '@/utils/validateScriptInput'

export function MultiSelectInput({ input, value, onChange, error }) {
  const selectedValues = Array.isArray(value) ? value : []
  const maxSelections = input.validation?.maxSelections

  const handleChange = (next) => {
    if (maxSelections && next.length > maxSelections) {
      onChange(next.slice(0, maxSelections))
      return
    }
    onChange(next)
  }

  const validationError = validateScriptInput(input, selectedValues)
  const displayError = error || validationError || undefined

  const options = (input.options || []).map((o) => ({
    value: String(o.value),
    label: o.label,
  }))

  const helper = `${selectedValues.length} selected${maxSelections ? ` / ${maxSelections}` : ''}`

  return (
    <FormField error={displayError} helper={helper}>
      <MultiSelect
        options={options}
        value={selectedValues}
        onChange={handleChange}
        placeholder={`Select ${input.label}`}
      />
    </FormField>
  )
}

export default MultiSelectInput
