import React, { useEffect, useRef, useState } from 'react'
import './styles.scss'

import { formatMoney, stripNonMoneyValues } from '../../utils/formatters'
import { NOKA_COLORS_CLASS } from '../../../assets/constants'

type HtmlInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export type Props = {
  defaultValue?: number | string
  onBlur?: (numericValue: number) => void
  onChange?: (numericValue: number) => void
  currencyCode?: string
  displayInputProps?: Omit<HtmlInputProps, 'onChange' | 'onBlur' | 'className' | 'value'>
  hiddenInputProps?: Omit<HtmlInputProps, 'value' | 'style' | 'readOnly'>
}

export function MoneyInput(props: Props) {
  const [displayValue, setDisplayValue] = useState<string>('')
  const [numericValue, setNumericValue] = useState<number>(0)
  const moneySymbol = useRef<string>('$')

  useEffect(() => {
    if (props.defaultValue !== undefined) {
      setDisplayValue(formatMoney(props.defaultValue, props.currencyCode))
      setNumericValue(
        typeof props.defaultValue === 'string'
          ? parseFloat(stripNonMoneyValues(props.defaultValue))
          : props.defaultValue
      )
    } else {
      setDisplayValue('')
      setNumericValue(0)
    }
  }, [props.defaultValue])

  function onBlur() {
    if (displayValue) {
      const parsed = parseFloat(displayValue)
      setNumericValue(parsed)
      setDisplayValue(formatMoney(parsed, props.currencyCode))
      if (props.onBlur) props.onBlur(parsed)
    }
  }

  useEffect(() => {
    if (props.currencyCode) {
      moneySymbol.current = (0)
        .toLocaleString(props.currencyCode, {
          style: 'currency',
          currency: props.currencyCode,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
        .replace(/\d/g, '')
        .trim()
    } else {
      moneySymbol.current = '$'
    }
  }, [props.currencyCode])

  return (
    <div className={`${NOKA_COLORS_CLASS} money-control`}>
      <div className="money-symbol">{moneySymbol.current}</div>
      <input
        {...(props.displayInputProps || {})}
        value={displayValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const value = stripNonMoneyValues(e.target.value)
          setDisplayValue(value)
          if (props.onChange) props.onChange(parseFloat(value))
        }}
        onBlur={onBlur}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            onBlur()
          }
        }}
        className="money"
      />
      <input
        {...(props.hiddenInputProps || {})}
        style={{ display: 'none' }}
        value={numericValue}
        readOnly
      />
    </div>
  )
}
