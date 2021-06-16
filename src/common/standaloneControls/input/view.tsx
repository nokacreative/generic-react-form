import React, { useEffect, useRef, useState } from 'react'
import { NOKA_COLORS_CLASS } from '../../../assets/constants'

import { InputType } from './enums'
import { StandardInputType } from './models'
import { getFormatter, InputValueFormatter } from './utils'

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

  useEffect(() => {
    setValue(props.defaultValue == null ? '' : props.defaultValue)
  }, [props.defaultValue])

  useEffect(() => {
    formatter.current = getFormatter(type)
  }, [type])

  const { className: extraClassName, ...htmlProps } = props.htmlProps || {}

  return (
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
      onBlur={(e) => {
        const value =
          type === InputType.NUMBER ? parseFloat(e.target.value) : e.target.value
        if (props.onBlur) props.onBlur(value)
      }}
      type={type === InputType.PASSWORD ? 'password' : 'text'}
      className={`${NOKA_COLORS_CLASS} ${extraClassName || ''}`}
    />
  )
}
