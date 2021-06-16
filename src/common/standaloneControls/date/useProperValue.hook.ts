import { useState, useRef, useEffect } from 'react'

import { Props, DateValueTypes } from './models'
import { datesAreEqual, dateFromMaybeNumber } from './utils'

export function useProperValue(props: Props) {
  const [value, setValue] = useState<DateValueTypes>()
  const prevGivenValue = useRef<DateValueTypes | number>()

  useEffect(() => {
    if (props.isRanged) {
      if (
        Array.isArray(prevGivenValue.current) &&
        datesAreEqual(props.startValue, prevGivenValue.current[0]) &&
        datesAreEqual(props.endValue, prevGivenValue.current[1])
      )
        return
      const newValue: [Date, Date] = [
        dateFromMaybeNumber(props.startValue) as Date,
        dateFromMaybeNumber(props.endValue) as Date,
      ]
      prevGivenValue.current = newValue
      setValue(newValue)
    } else {
      if (datesAreEqual(prevGivenValue.current, props.value)) return
      prevGivenValue.current = props.value
      setValue(dateFromMaybeNumber(props.value))
    }
  }, [props])

  return { value, setValue }
}
