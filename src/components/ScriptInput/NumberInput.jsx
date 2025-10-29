'use client'

import { Input } from '@/components/ui/input'
import { validateScriptInput } from '@/utils/validateScriptInput'

export function NumberInput({ input, value, onChange, error }) {
  const handleChange = (e) => {
    const val = e.target.value
    onChange(val === '' ? '' : Number(val))
  }

  const validationError = validateScriptInput(input, value)

  return (
    <div className="space-y-2">
      <Input
        id={input.name}
        type="number"
        value={value}
        onChange={handleChange}
        min={input.validation?.min}
        max={input.validation?.max}
        step={input.validation?.integerOnly ? '1' : input.validation?.step}
        className={error || validationError ? 'border-destructive' : ''}
        placeholder={input.description}
      />
      {input.validation?.min !== undefined && input.validation?.max !== undefined && (
        <p className="text-xs text-muted-foreground">
          Range: {input.validation.min} - {input.validation.max}
        </p>
      )}
      {(error || validationError) && (
        <p className="text-xs text-destructive">{error || validationError}</p>
      )}
    </div>
  )
}

export default NumberInput
