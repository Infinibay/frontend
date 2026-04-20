'use client'

import { NumberField, FormField } from '@infinibay/harbor'
import { validateScriptInput } from '@/utils/validateScriptInput'

export function NumberInput({ input, value, onChange, error }) {
  const validationError = validateScriptInput(input, value)
  const displayError = error || validationError || undefined

  const min = input.validation?.min
  const max = input.validation?.max
  const step = input.validation?.integerOnly ? 1 : (input.validation?.step ?? 1)

  const numericValue = typeof value === 'number' ? value : (value === '' || value === undefined || value === null ? undefined : Number(value))

  const helper = (min !== undefined && max !== undefined)
    ? `Range: ${min} - ${max}`
    : undefined

  return (
    <FormField error={displayError} helper={helper}>
      <NumberField
        value={numericValue}
        onChange={(v) => onChange(v)}
        min={min ?? -Infinity}
        max={max ?? Infinity}
        step={step}
      />
    </FormField>
  )
}

export default NumberInput
