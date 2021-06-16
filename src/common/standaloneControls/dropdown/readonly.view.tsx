import React from 'react'
import './readonlyStyles.scss'

import { EMPTY_VALUE_TEXT } from '../../../assets/constants'
import { ReadOnlyControlWrapper } from '../readonly'
import { DropdownOption } from './models'

type Props = {
  defaultValue: any
  isMultiple?: boolean
  options: DropdownOption[]
}

function renderSelectedOption(option: DropdownOption, key?: string) {
  return (
    <div className="readonly-option" key={key}>
      {option.render ? option.render() : option.text}
    </div>
  )
}

export const ReadOnlyDropdown = (props: Props) => {
  const selectedOptions = (() => {
    if (props.isMultiple) {
      const selectedValues = props.defaultValue as any[]
      return props.options.filter((o) => selectedValues.includes(o.value))
    }
    const selectedValue = props.defaultValue
    return props.options.find((o) => o.value === selectedValue)
  })()
  if (selectedOptions === undefined) {
    return <ReadOnlyControlWrapper>{EMPTY_VALUE_TEXT}</ReadOnlyControlWrapper>
  }
  return (
    <div className="dropdown-readonly-selections">
      {Array.isArray(selectedOptions)
        ? selectedOptions.map((o, i) => renderSelectedOption(o, `readonly-option-${i}`))
        : renderSelectedOption(selectedOptions)}
    </div>
  )
}
