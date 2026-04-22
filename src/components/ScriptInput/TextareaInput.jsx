'use client'

import { Textarea, FormField } from '@infinibay/harbor'
import { validateScriptInput } from '@/utils/validateScriptInput'

export function TextareaInput({ input, value, onChange, error }) {
  const validationError = validateScriptInput(input, value)
  const displayError = error || validationError || undefined
  const maxLength = input.validation?.maxLength
  const currentValue = value ?? ''

  const helper = maxLength
    ? `${input.description ? `${input.description} — ` : ''}${currentValue.length} / ${maxLength}`
    : input.description

  return (
    <FormField error={displayError} helper={helper}>
      <Textarea
        id={input.name}
        value={currentValue}
        onChange={(e) => onChange(e.target.value)}
        rows={input.rows || 4}
        maxLength={maxLength}
        maxChars={maxLength}
        placeholder={input.description}
      />
    </FormField>
  )
}

export default TextareaInput
