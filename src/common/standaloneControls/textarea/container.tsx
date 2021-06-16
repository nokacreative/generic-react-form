import React from 'react'

import { withReadOnlySwitch } from '../readonly'
import { Textarea, Props } from './view'

export const TextareaContainer = withReadOnlySwitch<Props>(
  (props) => <Textarea {...props} />,
  (props) => props.defaultValue as string
)
