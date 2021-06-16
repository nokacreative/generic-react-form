import React from 'react'
import './styles.scss'

import { GeneralIcons, Icon } from '../../icon'

export type Props = {
  label: string
  isChecked?: boolean
}

export function ReadOnlyCheckbox({ label, isChecked }: Props) {
  return (
    <label className="radioOrCheckbox readonly">
      <Icon icon={isChecked ? GeneralIcons.Checkmark : GeneralIcons.Unchecked} />
      <span className="label">{label}</span>
    </label>
  )
}
