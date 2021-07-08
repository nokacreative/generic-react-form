import React, { useRef } from 'react'

import { BaseFormControlProps, SpecificFormControlProps } from './models'
import { Dropdown, DropdownOption } from '../../standaloneControls/dropdown'
import { DropdownControlConfig } from '../common/models'

export function FormDropdown<T>(
  props: BaseFormControlProps<T> & SpecificFormControlProps<DropdownControlConfig<T>>
) {
  const latestValues = useRef<any | any[]>()

  return (
    <Dropdown
      options={props.options as DropdownOption[]}
      placeholder={props.placeholder}
      pinnedValues={props.pinnedValues}
      defaultValue={props.defaultValue}
      id={props.propertyPath as string}
      filterHtmlProps={{
        'aria-invalid': props.hasError,
        'aria-label': props.label,
      }}
      hiddenInputHtmlProps={{
        name: props.propertyPath as string,
      }}
      onOptionSelected={(option: DropdownOption | undefined) => {
        if (props.onOptionSelected) {
          props.onOptionSelected(option)
        }
        if (!props.isMultiple && props.saveSelection !== false) {
          const value = option ? option.value : undefined
          props.saveValueToState(props.propertyPath, value)
          if (props.validateOnChange) props.validate(value)
          latestValues.current = value
        }
      }}
      onOptionsChanged={(options: DropdownOption[] | undefined) => {
        if (props.onOptionsChanged) {
          props.onOptionsChanged(options)
        }
        if (props.isMultiple && props.saveSelection !== false) {
          const values = options?.map((o) => o.value)
          if (props.defaultValue !== undefined && values === undefined) {
            props.saveValueToState(props.propertyPath, [])
          } else {
            props.saveValueToState(props.propertyPath, values)
          }
          if (props.validateOnChange) props.validate(values)
          latestValues.current = values
        }
      }}
      onClose={() => {
        if (props.onClose) {
          props.onClose()
        }
        if (props.validateOnBlur) props.validate(latestValues?.current || null)
      }}
      onOpen={props.onOpen}
      isDisabled={props.isDisabled}
      showClearButton={props.showClearButton}
      isMultiple={props.isMultiple}
      isReadOnly={props.isReadOnly}
      allowFiltering={props.allowFiltering}
      saveSelection={props.saveSelection}
      extraClassName={props.extraClassName}
      emptyOptionsText={props.emptyOptionsText}
      allowAdditions={props.allowAdditions}
      addNewItemText={props.addNewItemText}
      onAddNewItem={props.onAddNewItem}
    />
  )
}
