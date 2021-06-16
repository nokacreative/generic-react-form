import React from 'react'

import { withReadOnlySwitch } from '../readonly'
import { ReadOnlyCheckbox } from './readonly.view'
import { Checkbox, Props } from './view'

export const Checkboxontainer = withReadOnlySwitch<Props>(
  (props) => <Checkbox {...props} />,
  (props) => (
    <ReadOnlyCheckbox label={props.label} isChecked={props.htmlProps?.defaultChecked} />
  )
)
