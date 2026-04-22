'use client'

import { useState } from 'react'
import { TextField, PasswordStrength, FormField } from '@infinibay/harbor'
import { Eye, EyeOff } from 'lucide-react'
import { validateScriptInput } from '@/utils/validateScriptInput'

export function PasswordInput({ input, value, onChange, error }) {
  const [showPassword, setShowPassword] = useState(false)

  const validationError = validateScriptInput(input, value)
  const displayError = error || validationError || undefined
  const minLength = input.validation?.minLength

  const toggle = (
    <button
      type="button"
      onClick={() => setShowPassword((s) => !s)}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  )

  const helper = minLength ? `Minimum ${minLength} characters required` : undefined

  return (
    <FormField error={displayError} helper={helper}>
      <TextField
        id={input.name}
        type={showPassword ? 'text' : 'password'}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter password"
        suffix={toggle}
        error={displayError}
      />
      {value ? <PasswordStrength value={String(value)} /> : null}
    </FormField>
  )
}

export default PasswordInput
