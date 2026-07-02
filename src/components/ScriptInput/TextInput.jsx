'use client'

import { TextField } from '@infinibay/harbor'

export function TextInput({ input, value, onChange, error }) {
  const handleChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <TextField
      value={value ?? ''}
      onChange={handleChange}
      placeholder={input.description}
      error={error || undefined}
    />
  )
}

export default TextInput
