'use client'

import { TextField } from '@infinibay/harbor'
import { validateScriptInput } from '@/utils/validateScriptInput'

export function TextInput({ input, value, onChange, error }) {
  const handleChange = (e) => {
    onChange(e.target.value)
  }

  const validationError = validateScriptInput(input, value)
  const displayError = error || validationError || undefined

  return (
    <TextField
      id={input.name}
      value={value ?? ''}
      onChange={handleChange}
      placeholder={input.description}
      error={displayError}
    />
  )
}

export default TextInput
