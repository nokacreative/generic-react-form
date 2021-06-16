import React from 'react'
import { EMPTY_VALUE_TEXT } from '../../../assets/constants'

import { Checkbox } from '../../standaloneControls/checkbox'
import { ReadOnlyControlWrapper } from '../../standaloneControls/readonly'
import { RadioLayout } from '../common/enums'
import {
  BaseRadioOrCheckboxGroupConfig,
  CheckboxGroupControlConfig,
} from '../common/models'
import { FormActionType } from '../main/enums'
import { BaseFormControlProps, SpecificFormControlProps } from './models'

export function getCheckboxOrRadioClassname(props: BaseRadioOrCheckboxGroupConfig) {
  const classes = ['checkbox-or-radio-group', props.layout || RadioLayout.HORIZONTAL]
  if (props.layout === RadioLayout.GRID) {
    classes.push(`columns-${props.numGridColumns || 3}`)
  }
  return classes.join(' ')
}

export function FormCheckbox<T>(
  props: BaseFormControlProps<T> & SpecificFormControlProps<CheckboxGroupControlConfig>
) {
  const isSingleSelection = props.selections.length === 1

  if (!isSingleSelection && props.isReadOnly && props.defaultValue?.length === 0) {
    return <ReadOnlyControlWrapper>{EMPTY_VALUE_TEXT}</ReadOnlyControlWrapper>
  }

  return (
    <div className={getCheckboxOrRadioClassname(props)}>
      {props.selections.map((s) => {
        const isSelected = isSingleSelection
          ? props.defaultValue === s.value
          : props.defaultValue?.includes(s.value)
        const key = `${props.propertyPath}-${s.value}`
        if (props.isReadOnly) {
          if (!isSingleSelection && !isSelected) return null
          return (
            <Checkbox
              key={key}
              label={s.text}
              value={s.value}
              htmlProps={{ defaultChecked: isSelected }}
              isReadOnly
            />
          )
        }
        return (
          <Checkbox
            key={key}
            label={s.text}
            value={s.value}
            htmlProps={{
              name: props.propertyPath as string,
              defaultChecked: isSelected,
              disabled: props.isDisabled,
              'aria-label': props.label,
              onChange: (e) => {
                const shouldValidate = props.validateOnChange || props.validateOnBlur
                if (isSingleSelection) {
                  const value = e.target.checked
                  props.saveValueToState(props.propertyPath, value)
                  if (shouldValidate) props.validate(value)
                } else {
                  props.saveValueToState(
                    props.propertyPath,
                    s.value,
                    e.target.checked
                      ? FormActionType.ADD_ARRAY_VALUE
                      : FormActionType.REMOVE_ARRAY_VALUE
                  )
                  if (shouldValidate) {
                    props.validate(null)
                  }
                }
              },
            }}
          />
        )
      })}
    </div>
  )
}
