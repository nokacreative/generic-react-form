import React from 'react'
import { MoneyInput } from '../../standaloneControls/money'

import { MoneyInputControlConfig } from '../common/models'
import { BaseFormControlProps, SpecificFormControlProps } from './models'

export function FormMoneyInput<T>(
  props: BaseFormControlProps<T> & SpecificFormControlProps<MoneyInputControlConfig>
) {
  return (
    <MoneyInput
      defaultValue={props.defaultValue}
      onBlur={(numericValue: number) => {
        props.saveValueToState(props.propertyPath, numericValue)
        if (props.validateOnBlur) props.validate(numericValue)
        if (props.onBlur) props.onBlur(numericValue)
      }}
      onChange={(numericValue: number) => {
        if (props.validateOnChange) props.validate(numericValue)
      }}
      currencyCode={props.currencyCode}
      displayInputProps={{
        placeholder: props.placeholder,
        'aria-invalid': props.hasError,
        'aria-label': props.label,
        disabled: props.isDisabled,
      }}
      hiddenInputProps={{
        name: props.propertyPath as string,
        disabled: props.isDisabled,
      }}
      isReadOnly={props.isReadOnly}
    />
  )
}
