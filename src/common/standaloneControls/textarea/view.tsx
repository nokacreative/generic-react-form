import './styles.scss'

import { NOKA_COLORS_CLASS } from '../../../assets/constants'
import { useMarkdown } from './useMarkdown'
import { Props } from './props'

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

  const {
    formattingControlsJsx,
    markdownPreviewArea,
    value,
    textareaRef,
    onChange,
    onKeyPress,
    imageUploadModal,
  } = useMarkdown(
    !!props.useMarkdown,
    props.defaultValue,
    customOnChange,
    !!props.allowImageUpload,
    props.isDisabled,
    props.imageUploaderProperties,
    props.messageOverrides?.imageUploadModal
  )

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
        onKeyPress={onKeyPress}
        disabled={props.isDisabled}
      />
      {props.characterLimit && (
        <span className="characterLimit-label">
          {props.messageOverrides?.characterLimitLabel || 'Character Limit'}:{' '}
          {props.characterLimit}
        </span>
      )}
      {imageUploadModal}
      {markdownPreviewArea}
    </div>
  )
}
