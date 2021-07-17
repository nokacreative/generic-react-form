import React, { useState } from 'react'
import { faImage } from '@fortawesome/free-regular-svg-icons'
import './styles.scss'

import { NOKA_COLORS_CLASS } from '../../../assets/constants'
import { useMarkdown } from './useMarkdown.hook'
import { FileUploader } from '../fileUpload'
import { Modal } from '../../modal'
import { Input, InputType } from '../input'
import { Props } from './props'
import { useEffect } from 'react'

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

  const [showImageUploader, setShowImageUploader] = useState<boolean>(false)

  const {
    formattingControlsJsx,
    markdownPreviewArea,
    value,
    textareaRef,
    onChange,
    onKeyPress,
    onUploadedImageSelected,
    onImageUpload,
    onImageRemove,
  } = useMarkdown(
    !!props.useMarkdown,
    props.defaultValue,
    customOnChange,
    !!props.allowImageUpload,
    setShowImageUploader,
    props.isDisabled
  )

  useEffect(() => {
    if (props.isDisabled && showImageUploader) {
      setShowImageUploader(false)
    }
  }, [props.isDisabled])

  const {
    onUpload: customOnImageUpload,
    onRemove: customOnImageRemove,
    ...customImageUploaderProperties
  } = props.imageUploaderProperties || {}

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
      {markdownPreviewArea}
      {showImageUploader && (
        <Modal
          setOpen={setShowImageUploader}
          icon={faImage}
          headerText={props.messageOverrides?.uploadImageModalHeader || 'Upload Image'}
          className="textarea-image-upload-modal"
          width={600}
        >
          <div className="instructions">
            {props.messageOverrides?.imageUploadModalInstructions ||
              'Click on an uploaded image to add it.'}
          </div>
          <FileUploader
            {...customImageUploaderProperties}
            supportedFileExtensions={['.jpg', '.jpeg', '.png']}
            onListedFileSelected={onUploadedImageSelected}
            onUpload={(files: File[]) => {
              if (customOnImageUpload) {
                customOnImageUpload(files)
              }
              if (onImageUpload) {
                onImageUpload(files)
              }
            }}
            onRemove={(filename: string, index: number) => {
              if (customOnImageRemove) {
                customOnImageRemove(filename, index)
              }
              if (onImageRemove) {
                onImageRemove(filename)
              }
            }}
          />
          <div className="input-section">
            <label>
              {props.messageOverrides?.enterImageUrlLabel || 'Or, enter an image URL:'}
            </label>
            <Input type={InputType.TEXT} htmlProps={{ placeholder: 'https://...' }} />
          </div>
        </Modal>
      )}
    </div>
  )
}
