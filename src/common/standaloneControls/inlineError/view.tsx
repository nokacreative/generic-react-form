import React from 'react'
import './styles.scss'

import { GeneralIcons, Icon } from '../../icon'
import { NOKA_COLORS_CLASS } from '../../../assets/constants'

type Props = {
  message: string
}

export function InlineError({ message }: Props) {
  return (
    <div className={`${NOKA_COLORS_CLASS} error-message`} role="alert">
      <Icon icon={GeneralIcons.ExclaimationMark} tooltip="error" />
      {message}
    </div>
  )
}
