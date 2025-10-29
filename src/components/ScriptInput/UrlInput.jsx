'use client'

import { Input } from '@/components/ui/input'
import { ExternalLink } from 'lucide-react'
import { validateScriptInput } from '@/utils/validateScriptInput'

export function UrlInput({ input, value, onChange, error }) {
  const validateUrl = (url) => {
    try {
      const parsed = new URL(url)
      if (input.validation?.protocols) {
        const normalizedProtocols = input.validation.protocols.map(p => p.replace(':', ''))
        return normalizedProtocols.includes(parsed.protocol.replace(':', ''))
      }
      return true
    } catch {
      return false
    }
  }

  const validationError = validateScriptInput(input, value)
  const isValid = value && validateUrl(value)

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={input.name}
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com"
          className={`pr-10 ${error || validationError ? 'border-destructive' : ''}`}
        />
        {value && isValid && (
          <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
      </div>
      {input.validation?.protocols && (
        <p className="text-xs text-muted-foreground">
          Allowed protocols: {input.validation.protocols.join(', ')}
        </p>
      )}
      {(error || validationError) && (
        <p className="text-xs text-destructive">{error || validationError}</p>
      )}
    </div>
  )
}

export default UrlInput
