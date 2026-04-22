'use client'

import { Select, FormField } from '@infinibay/harbor'
import { validateScriptInput } from '@/utils/validateScriptInput'

export function SelectInput({ input, value, onChange, error }) {
  const validationError = validateScriptInput(input, value)
  const displayError = error || validationError || undefined

  const options = (input.options || []).map((o) => ({
    value: String(o.value),
    label: o.label,
  }))

  return (
    <FormField error={displayError}>
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder={`Select ${input.label}`}
      />
    </FormField>
  )
}

export default SelectInput
