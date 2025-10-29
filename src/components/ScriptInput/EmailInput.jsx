'use client'

import { Input } from '@/components/ui/input'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { validateScriptInput } from '@/utils/validateScriptInput'

export function EmailInput({ input, value, onChange, error }) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validationError = validateScriptInput(input, value)
  const isValidEmail = value && emailRegex.test(value)

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={input.name}
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`pr-10 ${error || validationError ? 'border-destructive' : ''}`}
          placeholder="example@domain.com"
        />
        {value && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValidEmail ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      {(error || validationError) && (
        <p className="text-xs text-destructive">{error || validationError}</p>
      )}
    </div>
  )
}

export default EmailInput
