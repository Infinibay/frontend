'use client'

import { Checkbox, FormField } from '@infinibay/harbor'

export function BooleanInput({ input, value, onChange, error }) {
  const checkedValue = input.validation?.checkedValue ?? '1'
  const uncheckedValue = input.validation?.uncheckedValue ?? '0'

  const isChecked = value === checkedValue || (value === true && checkedValue === '1')

  const handleChange = (e) => {
    const checked = e.target.checked
    onChange(checked ? checkedValue : uncheckedValue)
  }

  const label = (
    <>
      {input.label}
      {input.required ? (
        <span className="text-[rgb(var(--harbor-danger))]" aria-hidden> *</span>
      ) : null}
    </>
  )

  return (
    <FormField labelless error={error || undefined}>
      <Checkbox
        id={input.name}
        checked={isChecked}
        onChange={handleChange}
        label={label}
        description={input.description}
      />
    </FormField>
  )
}

export default BooleanInput
