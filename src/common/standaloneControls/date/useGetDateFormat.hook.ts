import { useState, useEffect } from 'react'
import { DateType } from './enums'

const DEFAULT_DATE_FORMAT = 'MM/dd/yyyy'
const DEFAULT_TIME_FORMAT = 'hh:mm a'

export function useGetDateFormat(
  dateType: DateType,
  dateFormat: string | undefined,
  timeFormat: string | undefined
) {
  const [format, setFormat] = useState<string>(DEFAULT_DATE_FORMAT)

  useEffect(() => {
    if (dateType === DateType.DATE_AND_TIME) {
      setFormat(
        `${dateFormat || DEFAULT_DATE_FORMAT} ${timeFormat || DEFAULT_TIME_FORMAT}`
      )
    } else if (dateType === DateType.DATE_ONLY) {
      setFormat(dateFormat || DEFAULT_DATE_FORMAT)
    } else if (dateType === DateType.TIME_ONLY) {
      setFormat(timeFormat || DEFAULT_TIME_FORMAT)
    }
  }, [dateType, dateFormat, timeFormat])

  return format
}
