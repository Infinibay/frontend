'use client'

import TextInput from './TextInput'
import NumberInput from './NumberInput'
import BooleanInput from './BooleanInput'
import SelectInput from './SelectInput'
import PathInput from './PathInput'
import PasswordInput from './PasswordInput'
import EmailInput from './EmailInput'
import UrlInput from './UrlInput'
import MultiSelectInput from './MultiSelectInput'
import TextareaInput from './TextareaInput'
import { Label } from '@/components/ui/label'
import { HelpCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function ScriptInputRenderer({ input, value, onChange, error }) {
  const renderInput = () => {
    switch (input.type) {
      case 'text':
        return <TextInput input={input} value={value} onChange={onChange} error={error} />
      case 'number':
        return <NumberInput input={input} value={value} onChange={onChange} error={error} />
      case 'boolean':
      case 'checkbox':
        return <BooleanInput input={input} value={value} onChange={onChange} error={error} />
      case 'select':
        return <SelectInput input={input} value={value} onChange={onChange} error={error} />
      case 'path':
        return <PathInput input={input} value={value} onChange={onChange} error={error} />
      case 'password':
        return <PasswordInput input={input} value={value} onChange={onChange} error={error} />
      case 'email':
        return <EmailInput input={input} value={value} onChange={onChange} error={error} />
      case 'url':
        return <UrlInput input={input} value={value} onChange={onChange} error={error} />
      case 'multiselect':
        return <MultiSelectInput input={input} value={value} onChange={onChange} error={error} />
      case 'textarea':
        return <TextareaInput input={input} value={value} onChange={onChange} error={error} />
      default:
        return <TextInput input={input} value={value} onChange={onChange} error={error} />
    }
  }

  // For boolean type, the label is rendered inside the component
  if (input.type === 'boolean' || input.type === 'checkbox') {
    return renderInput()
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={input.name}>
          {input.label}
          {input.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {input.description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{input.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {renderInput()}
    </div>
  )
}

export default ScriptInputRenderer
