import React from 'react'

import { Textarea } from '../../standaloneControls/textarea'
import { TextareaControlConfig } from '../common/models'
import { BaseFormControlProps, SpecificFormControlProps } from './models'

export function FormTextarea<T>(
  props: BaseFormControlProps<T> & SpecificFormControlProps<TextareaControlConfig>
) {
  return (
    <Textarea
      characterLimit={props.characterLimit}
      defaultValue={props.defaultValue}
      isReadOnly={props.isReadOnly}
      allowHorizontalResize={props.allowHorizontalResize}
      allowVerticalResize={props.allowVerticalResize}
      htmlProps={{
        name: props.propertyPath as string,
        'aria-label': props.label,
        'aria-invalid': props.hasError,
        className: (props.characterLimit || 0) > 300 ? 'long' : '',
        disabled: props.isDisabled,
        onChange: props.validateOnChange
          ? (e) => props.validate(e.target.value)
          : undefined,
        onBlur: (e) => {
          const value = e.target.value
          props.saveValueToState(props.propertyPath, value)
          if (props.validateOnBlur) props.validate(value)
        },
        placeholder: props.placeholder,
      }}
    />
  )
}
