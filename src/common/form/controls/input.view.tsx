import React from 'react'
import { Input, InputType, StandardInputType } from '../../standaloneControls/input'

import { InputControlConfig } from '../common/models'
import { BaseFormControlProps, SpecificFormControlProps } from './models'

export function FormInput<T>(
  props: BaseFormControlProps<T> & SpecificFormControlProps<InputControlConfig>
) {
  return (
    <Input
      type={(props.inputType || InputType.TEXT) as StandardInputType}
      defaultValue={props.defaultValue}
      onChange={(value: any) => {
        if (props.validateOnChange) props.validate(value)
      }}
      onBlur={(value: any) => {
        props.saveValueToState(props.propertyPath, value)
        if (props.validateOnBlur) props.validate(value)
        if (props.onBlur) props.onBlur(value)
      }}
      htmlProps={{
        ...props.htmlProps,
        name: props.propertyPath as string,
        'aria-label': props.label,
        placeholder: props.placeholder,
        'aria-invalid': props.hasError,
        disabled: props.isDisabled,
      }}
      isReadOnly={props.isReadOnly}
    />
  )
}
