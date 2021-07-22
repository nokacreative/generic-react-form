import React from 'react'

import { Textarea, TextareaImageUploaderProps } from '../../standaloneControls/textarea'
import { TextareaControlConfig } from '../common/models'
import { FormActionType } from '../main/enums'
import { BaseFormControlProps, SpecificFormControlProps } from './models'
import { SupportedDefaulFileUploadertValues } from '../../standaloneControls/fileUpload'

export function FormTextarea<T>(
  props: BaseFormControlProps<T> &
    SpecificFormControlProps<TextareaControlConfig> & {
      defaultUploadedImages?: SupportedDefaulFileUploadertValues
    }
) {
  const usesRichImageUpload = props.useMarkdown && props.allowImageUpload
  const {
    onUpload: customOnUpload,
    onRemove: customOnRemove,
    ...customImageUploaderProperties
  } = props.imageUploaderProperties || {}

  const finalImageUploaderProperties: TextareaImageUploaderProps = {
    ...customImageUploaderProperties,
  }
  if (usesRichImageUpload) {
    const imagesPropertyPath =
      props.uploadedImagesPropertyPath || `${props.propertyPath}_images`

    finalImageUploaderProperties.onUpload = (files: File[]) => {
      if (customOnUpload) customOnUpload(files)
      if (finalImageUploaderProperties.isMultiple) {
        props.saveValueToState(
          imagesPropertyPath,
          props.saveFullImageFile ? files : files.map((f) => f.name),
          FormActionType.ADD_ARRAY_VALUE
        )
      } else {
        props.saveValueToState(
          imagesPropertyPath,
          props.saveFullImageFile ? files[0] : files[0].name
        )
      }
    }

    finalImageUploaderProperties.onRemove = (filename: string, index: number) => {
      if (customOnRemove) customOnRemove(filename, index)
      if (finalImageUploaderProperties.isMultiple) {
        props.saveValueToState(
          imagesPropertyPath,
          index,
          FormActionType.REMOVE_ARRAY_INDEX
        )
      } else {
        props.saveValueToState(imagesPropertyPath, undefined)
      }
    }

    finalImageUploaderProperties.defaultValue = props.defaultUploadedImages
  }

  return (
    <Textarea
      characterLimit={props.characterLimit}
      defaultValue={props.defaultValue}
      isReadOnly={props.isReadOnly}
      allowHorizontalResize={props.allowHorizontalResize}
      allowVerticalResize={props.allowVerticalResize}
      htmlProps={{
        name: props.propertyPath as string,
        'aria-label': props.label,
        'aria-invalid': props.hasError,
        className: (props.characterLimit || 0) > 300 ? 'long' : '',
        onChange: props.validateOnChange
          ? (e: React.ChangeEvent<HTMLTextAreaElement>) => props.validate(e.target.value)
          : undefined,
        onBlur: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const value = e.target.value
          props.saveValueToState(props.propertyPath, value)
          if (props.validateOnBlur) props.validate(value)
        },
        placeholder: props.placeholder,
      }}
      isDisabled={props.isDisabled}
      useMarkdown={props.useMarkdown}
      allowImageUpload={props.allowImageUpload}
      imageUploaderProperties={finalImageUploaderProperties}
      messageOverrides={props.messageOverrides}
    />
  )
}
