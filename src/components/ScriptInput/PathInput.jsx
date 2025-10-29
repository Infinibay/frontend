'use client'

import { Input } from '@/components/ui/input'
import { File, Folder } from 'lucide-react'
import { validateScriptInput } from '@/utils/validateScriptInput'

export function PathInput({ input, value, onChange, error }) {
  const validationError = validateScriptInput(input, value)
  const pathType = input.pathType || 'file'

  // Determine OS from validation.os or provide generic placeholder
  const targetOS = input.validation?.os || 'both'

  // Generate appropriate placeholder based on OS
  const getPlaceholder = () => {
    if (targetOS === 'windows') {
      return pathType === 'file' ? 'C:\\path\\to\\file.txt' : 'C:\\path\\to\\directory'
    } else if (targetOS === 'linux' || targetOS === 'unix') {
      return pathType === 'file' ? '/path/to/file.txt' : '/path/to/directory'
    } else {
      // Both or unspecified - show both examples in help text
      return pathType === 'file' ? 'Enter file path' : 'Enter directory path'
    }
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {pathType === 'file' ? (
            <File className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Folder className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <Input
          id={input.name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`pl-10 ${error || validationError ? 'border-destructive' : ''}`}
          placeholder={getPlaceholder()}
        />
      </div>

      {/* Show OS-specific examples */}
      {targetOS === 'both' && (
        <div className="text-xs text-muted-foreground">
          <p>Windows: C:\path\to\{pathType === 'file' ? 'file.txt' : 'directory'}</p>
          <p>Linux: /path/to/{pathType === 'file' ? 'file.txt' : 'directory'}</p>
        </div>
      )}

      {input.mustExist && (
        <p className="text-xs text-amber-600">Path must exist on the target VM</p>
      )}
      {(error || validationError) && (
        <p className="text-xs text-destructive">{error || validationError}</p>
      )}
    </div>
  )
}

export default PathInput
