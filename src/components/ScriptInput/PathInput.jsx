'use client'

import { TextField, FormField } from '@infinibay/harbor'
import { File, Folder } from 'lucide-react'
import { validateScriptInput } from '@/utils/validateScriptInput'

export function PathInput({ input, value, onChange, error }) {
  const validationError = validateScriptInput(input, value)
  const displayError = error || validationError || undefined
  const pathType = input.pathType || 'file'
  const targetOS = input.validation?.os || 'both'

  const getPlaceholder = () => {
    if (targetOS === 'windows') {
      return pathType === 'file' ? 'C:\\path\\to\\file.txt' : 'C:\\path\\to\\directory'
    } else if (targetOS === 'linux' || targetOS === 'unix') {
      return pathType === 'file' ? '/path/to/file.txt' : '/path/to/directory'
    } else {
      return pathType === 'file' ? 'Enter file path' : 'Enter directory path'
    }
  }

  const icon = pathType === 'file' ? <File size={16} /> : <Folder size={16} />

  const helperParts = []
  if (targetOS === 'both') {
    helperParts.push(
      `Windows: C:\\path\\to\\${pathType === 'file' ? 'file.txt' : 'directory'}`
    )
    helperParts.push(
      `Linux: /path/to/${pathType === 'file' ? 'file.txt' : 'directory'}`
    )
  }
  if (input.mustExist) {
    helperParts.push('Path must exist on the target VM')
  }
  const helper = helperParts.length > 0 ? helperParts.join(' — ') : undefined

  return (
    <FormField error={displayError} helper={helper}>
      <TextField
        id={input.name}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={getPlaceholder()}
        icon={icon}
        error={displayError}
      />
    </FormField>
  )
}

export default PathInput
