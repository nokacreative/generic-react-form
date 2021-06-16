import React from 'react'

import { withReadOnlySwitch } from '../readonly'
import { FileUploader } from './view'
import { Props } from './models'
import { ReadOnlyFileUploader } from './readonly.view'

export const FileUploaderContainer = withReadOnlySwitch<Props>(
  (props) => <FileUploader {...props} />,
  (props) => (
    <ReadOnlyFileUploader
      filenames={
        Array.isArray(props.defaultValue)
          ? (props.defaultValue as string[])
          : [props.defaultValue as string]
      }
    />
  )
)
