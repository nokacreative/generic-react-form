import React from 'react'

import { withReadOnlySwitch } from '../readonly'
import { Props } from './props'
import { Textarea } from './view'

export const TextareaContainer = withReadOnlySwitch<Props>(
  (props) => <Textarea {...props} />,
  (props) => props.defaultValue as string
)
