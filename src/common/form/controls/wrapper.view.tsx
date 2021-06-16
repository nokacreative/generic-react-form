import React from 'react'
import { GeneralIcons, Icon } from '../../icon'
import { InlineError } from '../../standaloneControls/inlineError'

type Props = {
  label: React.ReactNode | undefined
  children: React.ReactNode
  hasError?: boolean
  errorMessage?: string
  growthRatio?: number
  alignRight?: boolean
  propertyPath: string
  description?: string
  onInfoIconClicked?: () => void
  infoIconTooltip?: string
}

export const CONTROL_ID_DATA_ATTR = 'data-controlid'

export function FormControlWrapper(props: Props) {
  const classes = ['control']
  if (props.hasError) {
    classes.push('error')
  }
  if (props.alignRight) {
    classes.push('right-aligned')
  }

  return (
    <div
      className={classes.join(' ')}
      style={props.growthRatio !== undefined ? { flex: props.growthRatio } : {}}
      {...{ [CONTROL_ID_DATA_ATTR]: props.propertyPath }}
    >
      {props.label !== undefined && (
        <label htmlFor={props.propertyPath}>
          {props.label || '\u00A0'}
          {props.onInfoIconClicked && (
            <Icon
              icon={GeneralIcons.Info}
              tooltip={props.infoIconTooltip || 'Info'}
              onClick={props.onInfoIconClicked}
              extraClassName="info"
            />
          )}
        </label>
      )}
      {props.description && (
        <div className="control-description">{props.description}</div>
      )}
      {props.children}
      {props.errorMessage && <InlineError message={props.errorMessage} />}
    </div>
  )
}
