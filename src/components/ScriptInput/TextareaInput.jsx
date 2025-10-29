'use client'

import { Textarea } from '@/components/ui/textarea'
import { validateScriptInput } from '@/utils/validateScriptInput'

export function TextareaInput({ input, value, onChange, error }) {
  const validationError = validateScriptInput(input, value)
  const maxLength = input.validation?.maxLength

  return (
    <div className="space-y-2">
      <Textarea
        id={input.name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={input.rows || 4}
        maxLength={maxLength}
        className={error || validationError ? 'border-destructive' : ''}
        placeholder={input.description}
      />
      {maxLength && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{input.description}</span>
          <span className={value.length > maxLength * 0.9 ? 'text-amber-500' : 'text-muted-foreground'}>
            {value.length} / {maxLength}
          </span>
        </div>
      )}
      {(error || validationError) && (
        <p className="text-xs text-destructive">{error || validationError}</p>
      )}
    </div>
  )
}

export default TextareaInput
