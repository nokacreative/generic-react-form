import React from 'react'
import './styles.scss'

import { NOKA_COLORS_CLASS } from '../../../assets/constants'
import { useMarkdown } from './useMarkdown.hook'

export type Props = {
  characterLimit?: number
  allowHorizontalResize?: boolean
  allowVerticalResize?: boolean
  useMarkdown?: boolean
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
  if (!props.characterLimit || props.characterLimit > 300) {
    classNames.push('long')
  }
  if (props.allowHorizontalResize && props.allowVerticalResize) {
    classNames.push('resizable')
  } else if (props.allowHorizontalResize) {
    classNames.push('resizable-h')
  } else if (props.allowVerticalResize) {
    classNames.push('resizable-v')
  }

  const { onChange: customOnChange, ...miscHtmlProps } = props.htmlProps || {}

  const { formattingControlsJsx, markdownPreviewArea, value, textareaRef, onChange } =
    useMarkdown(!!props.useMarkdown, props.defaultValue, customOnChange)

  return (
    <div className={`${NOKA_COLORS_CLASS} textarea-wrapper`}>
      {formattingControlsJsx}
      <textarea
        {...miscHtmlProps}
        onChange={onChange}
        defaultValue={value ? undefined : props.defaultValue}
        maxLength={props.characterLimit}
        className={classNames.join(' ')}
        value={value}
        ref={textareaRef}
      />
      {props.characterLimit && (
        <span className="characterLimit-label">
          Character Limit: {props.characterLimit}
        </span>
      )}
      {markdownPreviewArea}
    </div>
  )
}
