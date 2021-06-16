import React from 'react'

import { withReadOnlySwitch } from '../readonly'
import { Props } from './models'
import { ReadOnlyDropdown } from './readonly.view'
import { Dropdown } from './view'

export const DropdownContainer = withReadOnlySwitch<Props>(
  (props) => <Dropdown {...props} />,
  (props) => (
    <ReadOnlyDropdown
      defaultValue={props.defaultValue}
      isMultiple={props.isMultiple}
      options={props.options}
    />
  )
)
