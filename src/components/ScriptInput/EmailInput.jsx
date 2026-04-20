'use client'

import { TextField } from '@infinibay/harbor'
import { validateScriptInput } from '@/utils/validateScriptInput'

export function EmailInput({ input, value, onChange, error }) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validationError = validateScriptInput(input, value)
  const displayError = error || validationError || undefined
  const isValidEmail = Boolean(value) && emailRegex.test(value)

  return (
    <TextField
      id={input.name}
      type="email"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="example@domain.com"
      error={displayError}
      valid={isValidEmail && !displayError}
    />
  )
}

export default EmailInput
