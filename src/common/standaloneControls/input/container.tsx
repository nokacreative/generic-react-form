import React from 'react'

import { withReadOnlySwitch } from '../readonly'
import { ReadOnlyInput } from './readonly.view'
import { Input, Props } from './view'

export const InputContainer = withReadOnlySwitch<Props>(
  (props) => <Input {...props} />,
  (props) => <ReadOnlyInput type={props.type} defaultValue={props.defaultValue} />
)
