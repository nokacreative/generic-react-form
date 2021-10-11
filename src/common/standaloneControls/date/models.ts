import { DateType } from './enums'

export type DateValueTypes = Date | [Date, Date] | null

type BaseProps = {
  dateType: DateType
  onChange: (date: DateValueTypes) => void
  earliestDate?: Date
  latestDate?: Date
  earliestTime?: Date
  latestTime?: Date
  dateFormat?: string
  timeFormat?: string
  locale?: string
  placeholder?: string
  isDisabled?: boolean
}

type RangedProps =
  | {
      value?: DateValueTypes | number
      isRanged?: never | false
    }
  | {
      isRanged: true
      startValue: DateValueTypes | number
      endValue: DateValueTypes | number
    }

export type Props = BaseProps & RangedProps
