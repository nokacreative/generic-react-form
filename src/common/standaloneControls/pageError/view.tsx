import React from 'react'

import '../inlineError/styles.scss'
import './styles.scss'

import { GeneralIcons, Icon } from '../../icon'
import { NOKA_COLORS_CLASS } from '../../../assets/constants'

type Props = {
  message: string
}

export const PageError = React.forwardRef<HTMLDivElement, Props>(
  ({ message }: Props, ref) => {
    return (
      <div ref={ref} className={`${NOKA_COLORS_CLASS} error-message page-error`}>
        <Icon icon={GeneralIcons.ExclaimationMark} tooltip="error" />
        <span>{message}</span>
      </div>
    )
  }
)
