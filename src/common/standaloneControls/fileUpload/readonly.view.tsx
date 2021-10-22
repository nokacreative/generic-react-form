import React from 'react'
import './styles.scss'

import { Icon } from '../../icon'
import { getIcon } from './utils'
import { SupportedDefaultValues } from './models'
import { useGetFilesFromDefaultValue } from './getFilesFromDefaultValue.hook'

type Props = {
  defaultValue: SupportedDefaultValues
  onListedFileSelected?: (file: File) => void
  noFilesUploadedMessage?: string
}

export const ReadOnlyFileUploader = ({
  defaultValue,
  onListedFileSelected,
  noFilesUploadedMessage,
}: Props) => {
  const [files, _setFiles] = useGetFilesFromDefaultValue(defaultValue)
  const className = onListedFileSelected ? 'file clickable' : 'file'
  const emptyMessage = noFilesUploadedMessage || 'No files uploaded.'

  return (
    <div className="file-upload-control readonly">
      <section className="file-list" data-emptyprintmessage={emptyMessage}>
        {files?.map((file, i) => (
          <div
            className={className}
            key={`file_${i}`}
            onClick={onListedFileSelected ? () => onListedFileSelected(file) : undefined}
          >
            <div className="file-info">
              <Icon icon={getIcon(file.name)} size="2x" extraClassName="file-icon" />
              <div className="main">{file.name}</div>
            </div>
          </div>
        ))}
        {(!files || files?.length === 0) && emptyMessage}
      </section>
    </div>
  )
}
