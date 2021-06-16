import React from 'react'
import '../../standaloneControls/checkbox/styles.scss'

import { BaseFormControlProps, SpecificFormControlProps } from './models'
import { getCheckboxOrRadioClassname } from './checkbox.view'
import { Radio } from '../../standaloneControls/radio'
import { RadioGroupControlConfig } from '../common/models'

export function FormRadio<T>(
  props: BaseFormControlProps<T> & SpecificFormControlProps<RadioGroupControlConfig>
) {
  const wrapperClassName = getCheckboxOrRadioClassname(props)

  if (props.isReadOnly) {
    const selection = props.selections.find((s) => s.value === props.defaultValue)
    return (
      <div className={wrapperClassName}>
        <Radio
          name={props.propertyPath as string}
          label={selection?.text || ''}
          value={props.defaultValue}
          isReadOnly
        />
      </div>
    )
  }

  return (
    <div className={wrapperClassName}>
      {props.selections.map((s) => (
        <Radio
          key={`${props.propertyPath}-${s.value}`}
          htmlProps={{
            defaultChecked: props.defaultValue === s.value,
            disabled: props.isDisabled,
            'aria-label': props.label,
            onChange: (e) => {
              if (e.target.checked) {
                props.saveValueToState(props.propertyPath, s.value)
              }
              if (props.validateOnChange || props.validateOnBlur) props.validate(s.value)
            },
          }}
          name={props.propertyPath as string}
          label={s.text}
          value={s.value}
        />
      ))}
    </div>
  )
}
