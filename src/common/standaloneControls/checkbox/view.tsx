import React from 'react'
import './styles.scss'

import { GeneralIcons, Icon } from '../../icon'
import { NOKA_COLORS_CLASS } from '../../../assets/constants'
import { useControlCheckedState } from './useControlCheckedState.hook'

export type Props = {
  label: string
  htmlProps?: Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    'value'
  >
  value?: any
}

export function Checkbox({ label, value, htmlProps }: Props) {
  const { checked, onChange, miscProps } = useControlCheckedState(htmlProps || {})

  return (
    <label
      className={`${NOKA_COLORS_CLASS} radioOrCheckbox ${
        miscProps.disabled ? 'disabled' : ''
      }`}
    >
      <input
        type="checkbox"
        {...miscProps}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <div className="checkbox-control">
        <Icon icon={GeneralIcons.Checkmark} tooltip="checkmark" />
      </div>
      <span className="label">{label}</span>
    </label>
  )
}
