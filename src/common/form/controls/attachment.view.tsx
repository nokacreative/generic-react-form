import React from 'react'
import { FileUploader } from '../../standaloneControls/fileUpload'
import { AttachmentControlConfig } from '../common/models'
import { FormActionType } from '../main/enums'
import { BaseFormControlProps, SpecificFormControlProps } from './models'

/** Removes everything aside from letters, numbers, dots, and hyphens from a string. */
export function formatFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9-\\.]/g, '')
}

export function FormAttachmentControl<T>(
  props: BaseFormControlProps<T> & SpecificFormControlProps<AttachmentControlConfig>
) {
  const shouldValidate = props.validateOnBlur || props.validateOnChange

  return (
    <FileUploader
      defaultValue={props.defaultValue}
      supportedFileExtensions={props.supportedFileExtensions}
      onUpload={(files: File[]) => {
        if (props.onUpload) props.onUpload(files)
        if (props.isMultiple) {
          props.saveValueToState(
            props.propertyPath,
            props.saveFullFile ? files : files.map((f) => f.name),
            FormActionType.ADD_ARRAY_VALUE
          )
        } else {
          props.saveValueToState(
            props.propertyPath,
            props.saveFullFile ? files[0] : files[0].name
          )
        }
        if (shouldValidate) props.validate(null)
      }}
      onRemove={(filename: string, index: number) => {
        if (props.onRemove) props.onRemove(filename, index)
        if (props.isMultiple) {
          props.saveValueToState(
            props.propertyPath,
            index,
            FormActionType.REMOVE_ARRAY_INDEX
          )
        } else {
          props.saveValueToState(props.propertyPath, undefined)
        }
        if (shouldValidate) props.validate(null)
      }}
      isMultiple={props.isMultiple}
      messageOverrides={props.messageOverrides}
      uploadIcon={props.uploadIcon}
      fileUploadProgress={props.fileUploadProgress}
      fileStatuses={props.fileStatuses}
      individualFileSizeLimit={props.individualFileSizeLimit}
      totalFileSizeLimit={props.totalFileSizeLimit}
      isDisabled={props.isDisabled}
      isReadOnly={props.isReadOnly}
      inputName={props.propertyPath as string}
    />
  )
}
