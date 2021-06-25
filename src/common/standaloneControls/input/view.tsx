import React, { useEffect, useRef, useState } from 'react'

import './styles.scss'
import { NOKA_COLORS_CLASS } from '../../../assets/constants'

import { InputType } from './enums'
import { StandardInputType } from './models'
import { getFormatter, InputValueFormatter } from './utils'
import { GeneralIcons, Icon } from '../../icon'

export type Props = {
  type: StandardInputType
  defaultValue?: any
  htmlProps?: Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    'onChange' | 'onBlur' | 'type' | 'value'
  >
  onChange?: (value: any) => void
  onBlur?: (value: any) => void
}

export function Input({ type, ...props }: Props) {
  const [value, setValue] = useState<string>('')
  const formatter = useRef<InputValueFormatter | undefined>()
  const [showPassword, setShowPassword] = useState<boolean>(false)

  useEffect(() => {
    setValue(props.defaultValue == null ? '' : props.defaultValue)
  }, [props.defaultValue])

  useEffect(() => {
    formatter.current = getFormatter(type)
  }, [type])

  const { className: extraClassName, ...htmlProps } = props.htmlProps || {}

  function onBlur(value: any) {
    const properValue = type === InputType.NUMBER ? parseFloat(value) : value
    if (props.onBlur) props.onBlur(properValue)
  }

  const isPasswordType = type === InputType.PASSWORD

  return (
    <div className={`input-wrapper ${isPasswordType ? 'password' : ''}`}>
      <input
        {...htmlProps}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const value = formatter.current
            ? formatter.current(e.target.value)
            : e.target.value
          setValue(value)
          if (props.onChange) props.onChange(value)
        }}
        onBlur={(e) => onBlur(e.target.value)}
        type={isPasswordType && !showPassword ? 'password' : 'text'}
        className={`${NOKA_COLORS_CLASS} ${extraClassName || ''}`}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onBlur(e.currentTarget.value)
          }
        }}
      />
      {isPasswordType && (
        <Icon
          icon={showPassword ? GeneralIcons.Hidden : GeneralIcons.Visible}
          onClick={() => setShowPassword(!showPassword)}
        />
      )}
    </div>
  )
}
