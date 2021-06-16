import React from 'react'
import { NOKA_COLORS_CLASS } from '../../../assets/constants'
import './styles.scss'

export type Props = {
  characterLimit?: number
  allowHorizontalResize?: boolean
  allowVerticalResize?: boolean
  htmlProps?: Omit<
    React.DetailedHTMLProps<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >,
    'maxLength' | 'defaultValue'
  >
  defaultValue?: string
}

export function Textarea(props: Props) {
  const classNames = []
  if (props.characterLimit && props.characterLimit > 300) {
    classNames.push('long')
  }
  if (props.allowHorizontalResize && props.allowVerticalResize) {
    classNames.push('resizable')
  } else if (props.allowHorizontalResize) {
    classNames.push('resizable-h')
  } else if (props.allowVerticalResize) {
    classNames.push('resizable-v')
  }

  return (
    <div className={`${NOKA_COLORS_CLASS} textarea-wrapper`}>
      <textarea
        {...(props.htmlProps || {})}
        defaultValue={props.defaultValue}
        maxLength={props.characterLimit}
        className={classNames.join(' ')}
      />
      {props.characterLimit && (
        <span className="characterLimit-label">
          Character Limit: {props.characterLimit}
        </span>
      )}
    </div>
  )
}
