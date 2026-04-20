'use client'

import { TextField, FormField } from '@infinibay/harbor'
import { ExternalLink } from 'lucide-react'
import { validateScriptInput } from '@/utils/validateScriptInput'

export function UrlInput({ input, value, onChange, error }) {
  const validateUrl = (url) => {
    try {
      const parsed = new URL(url)
      if (input.validation?.protocols) {
        const normalizedProtocols = input.validation.protocols.map((p) => p.replace(':', ''))
        return normalizedProtocols.includes(parsed.protocol.replace(':', ''))
      }
      return true
    } catch {
      return false
    }
  }

  const validationError = validateScriptInput(input, value)
  const displayError = error || validationError || undefined
  const isValid = Boolean(value) && validateUrl(value)

  const helper = input.validation?.protocols
    ? `Allowed protocols: ${input.validation.protocols.join(', ')}`
    : undefined

  return (
    <FormField error={displayError} helper={helper}>
      <TextField
        id={input.name}
        type="url"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com"
        error={displayError}
        valid={isValid && !displayError}
        suffix={isValid ? <ExternalLink size={16} /> : null}
      />
    </FormField>
  )
}

export default UrlInput
