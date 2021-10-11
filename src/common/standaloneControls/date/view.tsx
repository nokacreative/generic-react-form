import React from 'react'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import './styles.scss'

import { Props, DateValueTypes } from './models'
import { DateType } from './enums'
import { NOKA_COLORS_CLASS } from '../../../assets/constants'
import { GeneralIcons, Icon } from '../../icon'
import { useGetDateFormat } from './useGetDateFormat.hook'
import { useProperValue } from './useProperValue.hook'

export function DateInput(props: Props) {
  const { value, setValue } = useProperValue(props)
  const dateFormat = useGetDateFormat(props.dateType, props.dateFormat, props.timeFormat)
  const showTime =
    props.dateType === DateType.DATE_AND_TIME || props.dateType === DateType.TIME_ONLY

  const isTimeOnly = props.dateType === DateType.TIME_ONLY

  return (
    <div className={`${NOKA_COLORS_CLASS} date-control-wrapper`}>
      <DatePicker
        selected={Array.isArray(value) ? value[0] : value}
        onChange={(date: DateValueTypes) => {
          setValue(date)
          props.onChange(date)
        }}
        showTimeSelect={showTime}
        showTimeInput={showTime}
        placeholderText={props.placeholder}
        dateFormat={dateFormat}
        timeFormat={props.timeFormat}
        showTimeSelectOnly={isTimeOnly}
        isClearable
        locale={props.locale}
        selectsRange={props.isRanged}
        startDate={props.isRanged && value ? (value as Date[])[0] : undefined}
        endDate={props.isRanged && value ? (value as Date[])[1] : undefined}
        minDate={props.earliestDate}
        maxDate={props.latestDate}
        minTime={props.earliestTime}
        maxTime={props.latestTime}
        disabled={props.isDisabled}
      />
      <Icon icon={isTimeOnly ? GeneralIcons.Clock : GeneralIcons.Calendar} />
    </div>
  )
}
