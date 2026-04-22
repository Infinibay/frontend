'use client'

import { Checkbox } from '@infinibay/harbor'

export function BooleanInput({ input, value, onChange }) {
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
      {input.required ? ' *' : ''}
    </>
  )

  return (
    <Checkbox
      id={input.name}
      checked={isChecked}
      onChange={handleChange}
      label={label}
      description={input.description}
    />
  )
}

export default BooleanInput
