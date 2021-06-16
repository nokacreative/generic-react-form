import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'

import './styles.scss'
import { TooltipLabelMode } from './enums'

type Props = {
  icon: IconDefinition
  tooltip?: string
  onClick?: () => void
  extraClassName?: string
  id?: string
  size?: SizeProp
  tooltipAsLabel?: TooltipLabelMode
}

export function Icon(props: Props) {
  const className = (() => {
    const classes = ['icon']
    if (props.onClick) {
      classes.push('clickable')
    }
    if (props.extraClassName) {
      classes.push(props.extraClassName)
    }
    if (props.tooltipAsLabel === TooltipLabelMode.ON_HOVER) {
      classes.push('label-on-hover')
    }
    return classes.join(' ')
  })()

  const showTooltip =
    props.tooltip &&
    props.tooltipAsLabel !== undefined &&
    props.tooltipAsLabel !== TooltipLabelMode.NEVER

  return (
    <div
      className={className}
      title={props.tooltip}
      aria-hidden={props.onClick === undefined}
      id={props.id}
      onClick={props.onClick}
    >
      <FontAwesomeIcon icon={props.icon} size={props.size} />
      {showTooltip && <span className="label">{props.tooltip}</span>}
    </div>
  )
}
