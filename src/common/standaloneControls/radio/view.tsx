import React from 'react'
import '../checkbox/styles.scss'

import { NOKA_COLORS_CLASS } from '../../../assets/constants'
import { useControlCheckedState } from '../checkbox/useControlCheckedState.hook'

export type Props = {
  label: string
  name: string
  value: any
  htmlProps?: Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    'name' | 'value'
  >
}

export function Radio({ label, name, value, htmlProps }: Props) {
  const { checked, onChange, miscProps } = useControlCheckedState(htmlProps || {})

  return (
    <label
      className={`${NOKA_COLORS_CLASS} radioOrCheckbox ${
        miscProps.disabled ? 'disabled' : ''
      }`}
    >
      <input
        {...miscProps}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span className={`radio-control ${checked ? 'checked' : ''}`} />
      <span className="label">{label}</span>
    </label>
  )
}
