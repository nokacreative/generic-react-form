import React from 'react'

import { withReadOnlySwitch } from '../readonly'
import { Radio, Props } from './view'

export const RadioContainer = withReadOnlySwitch<Props>(
  (props) => <Radio {...props} />,
  (props) => props.label
)
