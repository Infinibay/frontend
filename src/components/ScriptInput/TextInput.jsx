'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { validateScriptInput } from '@/utils/validateScriptInput'

export function TextInput({ input, value, onChange, error }) {
  const handleChange = (e) => {
    onChange(e.target.value)
  }

  const validationError = validateScriptInput(input, value)

  return (
    <div className="space-y-2">
      <Input
        id={input.name}
        value={value}
        onChange={handleChange}
        className={error || validationError ? 'border-destructive' : ''}
        placeholder={input.description}
      />
      {(error || validationError) && (
        <p className="text-xs text-destructive">{error || validationError}</p>
      )}
    </div>
  )
}

export default TextInput
