import React from 'react'

import { withReadOnlySwitch } from '../readonly'
import { FileUploader } from './view'
import { Props } from './models'
import { ReadOnlyFileUploader } from './readonly.view'

export const FileUploaderContainer = withReadOnlySwitch<Props>(
  (props) => <FileUploader {...props} />,
  (props) => (
    <ReadOnlyFileUploader
      defaultValue={props.defaultValue}
      onListedFileSelected={
        props.onListedFileSelected
          ? (file) => props.onListedFileSelected!(file, false)
          : undefined
      }
    />
  )
)
