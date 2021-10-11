import React from 'react'

import { BaseFormControlProps, SpecificFormControlProps } from './models'
import { DateInputControlConfig } from '../common/models'
import { DateInput, DateValueTypes } from '../../standaloneControls/date'

const DO_NOT_SAVE_VALUE = -1

export function FormDateInput<T>(
  props: BaseFormControlProps<T> & SpecificFormControlProps<DateInputControlConfig>
) {
  const rangedProps = props.isRanged
    ? {
        isRanged: true,
        startValue: props.defaultValue ? props.defaultValue[0] : undefined,
        endValue: props.defaultValue ? props.defaultValue[1] : undefined,
      }
    : {
        value: props.defaultValue,
      }

  return (
    <DateInput
      onChange={(date: DateValueTypes) => {
        const newValue = (() => {
          if (Array.isArray(date)) {
            if (date[0] && date[1]) {
              return [date[0].getTime(), date[1].getTime()]
            }
            return DO_NOT_SAVE_VALUE
          }
          if (date == null) {
            return date
          }
          return date.getTime()
        })()
        if (newValue !== DO_NOT_SAVE_VALUE) {
          props.saveValueToState(props.propertyPath, newValue)
          if (props.validateOnBlur || props.validateOnChange) {
            props.validate(newValue)
          }
        }
      }}
      dateType={props.dateType}
      earliestDate={props.earliestDate}
      latestDate={props.latestDate}
      earliestTime={props.earliestTime}
      latestTime={props.latestTime}
      dateFormat={props.dateFormat}
      timeFormat={props.timeFormat}
      locale={props.locale}
      placeholder={props.placeholder}
      {...rangedProps}
      isReadOnly={props.isReadOnly}
      isDisabled={props.isDisabled}
    />
  )
}
