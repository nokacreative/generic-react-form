import React from 'react'

import { withReadOnlySwitch } from '../readonly'
import { MoneyInput, Props } from './view'
import { formatMoney } from '../../utils/formatters'

export const MoneyInputContainer = withReadOnlySwitch<Props>(
  (props) => <MoneyInput {...props} />,
  (props) => formatMoney(props.defaultValue as string, props.currencyCode, false)
)
