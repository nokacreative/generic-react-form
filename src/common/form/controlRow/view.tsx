import React from 'react'
import { ControlRowWidth } from '../common/enums'

type Props = {
  width?: ControlRowWidth
  id?: string
  className?: string
  children: React.ReactNode
}

export function FormControlRow(props: Props) {
  const widthClassName = props.width || ControlRowWidth.FULL
  const childrenClassName =
    React.Children.count(props.children) >= 3 ? 'withThreeOrMoreChildren' : ''
  return (
    <div
      className={`control-row ${widthClassName} ${childrenClassName} ${
        props.id !== undefined ? props.id : ''
      } ${props.className !== undefined ? props.className : ''} `}
    >
      {props.children}
    </div>
  )
}
