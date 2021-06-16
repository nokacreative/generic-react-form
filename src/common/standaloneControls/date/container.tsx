import React from 'react'

import { DateInput } from './view'
import { Props } from './models'
import { ReadOnlyDateInput } from './readonly.view'

export const DateInputContainer = (props: Props & { isReadOnly?: boolean }) => {
  const { isReadOnly, ...standardProps } = props
  return isReadOnly ? (
    <ReadOnlyDateInput {...standardProps} />
  ) : (
    <DateInput {...standardProps} />
  )
}
