import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'

import { EMPTY_VALUE_TEXT } from '../../../assets/constants'
import { ReadOnlyControlWrapper } from '../readonly'
import { Props } from './models'
import { useGetDateFormat } from './useGetDateFormat.hook'
import { useProperValue } from './useProperValue.hook'

export const ReadOnlyDateInput = (props: Props) => {
  const { value } = useProperValue(props)
  const [displayValue, setDisplayValue] = useState<string>(EMPTY_VALUE_TEXT)
  const dateFormat = useGetDateFormat(props.dateType, props.dateFormat, props.timeFormat)

  useEffect(() => {
    if (value == null) {
      setDisplayValue(EMPTY_VALUE_TEXT)
    } else if (Array.isArray(value)) {
      if (value[0] && value[1]) {
        setDisplayValue(
          `${format(new Date(value[0]), dateFormat)} - ${format(
            new Date(value[1]),
            dateFormat
          )}`
        )
      } else {
        setDisplayValue(EMPTY_VALUE_TEXT)
      }
    } else {
      setDisplayValue(format(new Date(value), dateFormat))
    }
  }, [value, dateFormat])

  return <ReadOnlyControlWrapper>{displayValue}</ReadOnlyControlWrapper>
}
