'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { validateScriptInput } from '@/utils/validateScriptInput'

export function PasswordInput({ input, value, onChange, error }) {
  const [showPassword, setShowPassword] = useState(false)

  const validationError = validateScriptInput(input, value)

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={input.name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`pr-10 ${error || validationError ? 'border-destructive' : ''}`}
          placeholder="Enter password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {input.validation?.minLength && (
        <p className="text-xs text-muted-foreground">
          Minimum {input.validation.minLength} characters required
        </p>
      )}
      {(error || validationError) && (
        <p className="text-xs text-destructive">{error || validationError}</p>
      )}
    </div>
  )
}

export default PasswordInput
