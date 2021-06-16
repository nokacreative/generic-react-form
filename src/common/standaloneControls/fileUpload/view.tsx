import React, { useEffect, useRef, useState } from 'react'

import './styles.scss'

import { formatFileSize, getIcon, onDragOver, onDrop } from './utils'
import { GeneralIcons, Icon } from '../../icon'
import { Props } from './models'
import { InlineError } from '../inlineError'
import { NOKA_COLORS_CLASS } from '../../../assets/constants'
import { FileUploadStatus } from './enums'

export function FileUploader(props: Props) {
  const [files, setFiles] = useState<File[]>()
  const [isDraggingOver, setDraggingOver] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [fileSizeMsg, setFileSizeMsg] = useState<string>('')

  useEffect(() => {
    if (typeof props.defaultValue === 'string') {
      setFiles([new File([], props.defaultValue)])
    } else if (props.defaultValue instanceof File) {
      setFiles([props.defaultValue])
    } else if (props.defaultValue instanceof FileList) {
      setFiles(Array.from(props.defaultValue))
    } else if (props.defaultValue == null) {
      setFiles(undefined)
    }
  }, [props.defaultValue])

  useEffect(() => {
    if (props.messageOverrides?.fileSizeError) {
      setFileSizeMsg(
        props.messageOverrides.fileSizeError(
          props.individualFileSizeLimit,
          props.totalFileSizeLimit
        )
      )
    } else if (props.individualFileSizeLimit && props.totalFileSizeLimit) {
      setFileSizeMsg(
        `Each file must be under ${formatFileSize(
          props.individualFileSizeLimit
        )}, with a total limit of ${formatFileSize(props.totalFileSizeLimit)}.`
      )
    } else if (props.individualFileSizeLimit) {
      setFileSizeMsg(
        `Each file must be under ${formatFileSize(props.individualFileSizeLimit)}.`
      )
    } else if (props.totalFileSizeLimit) {
      setFileSizeMsg(
        `The total size of files must not exceed ${formatFileSize(
          props.totalFileSizeLimit
        )}.`
      )
    } else {
      setFileSizeMsg('')
    }
  }, [
    props.individualFileSizeLimit,
    props.totalFileSizeLimit,
    props.messageOverrides?.fileSizeError,
  ])

  const fileBrowserButton = useRef<HTMLInputElement>(null)
  const dropzone = useRef<HTMLElement>(null)

  function launchFileBrowser(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    event.preventDefault()
    if (fileBrowserButton.current) {
      fileBrowserButton.current.click()
    }
  }

  function removeFile(file: File, index: number) {
    props.onRemove(file.name, index)
    if (files) {
      const removalIndex = files.findIndex((f) => f.name === file.name)
      const newFiles = [...files.slice(0, removalIndex), ...files.slice(removalIndex + 1)]
      if (newFiles.length === 0) {
        setFiles(undefined)
      } else {
        setFiles(newFiles)
      }
    }
  }

  function startUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(event.target.files || [])
    if (
      props.individualFileSizeLimit &&
      newFiles.some((f) => f.size > (props.individualFileSizeLimit as number))
    ) {
      setErrorMessage(fileSizeMsg)
      return
    }
    if (
      props.totalFileSizeLimit &&
      newFiles.reduce((totalSize, f) => totalSize + f.size, 0) > props.totalFileSizeLimit
    ) {
      setErrorMessage(fileSizeMsg)
      return
    }
    if (files) {
      const existingFileNames = files.map((f) => f.name)
      const duplicateFileName = newFiles.find((f) =>
        existingFileNames.includes(f.name)
      )?.name
      if (duplicateFileName) {
        setErrorMessage(
          props.messageOverrides?.duplicateFileNameError
            ? props.messageOverrides.duplicateFileNameError(duplicateFileName)
            : `A file with the name ${duplicateFileName} already exists.`
        )
      }
    }
    setErrorMessage(undefined)
    props.onUpload(newFiles)
    if (props.isMultiple) {
      if (newFiles.length > 0) {
        setFiles([...(files || []), ...newFiles])
      }
    } else {
      if (newFiles.length === 0) {
        setFiles(undefined)
      } else {
        setFiles(newFiles)
      }
    }
  }

  function retryUpload(file: File) {
    props.onUpload([file])
  }

  const dropZoneClasses = React.useMemo(() => {
    const classes = ['dropZone']
    if (isDraggingOver) {
      classes.push('draggedOver')
    }
    if (props.isDisabled) {
      classes.push('disabled')
    }
    if (errorMessage) {
      classes.push('error')
    }
    return classes.join(' ')
  }, [isDraggingOver, props.isDisabled, errorMessage])

  const fileListSection = React.useMemo(() => {
    return (
      <section
        className="file-list"
        data-emptyprintmessage={
          props.messageOverrides?.noFilesUploaded || 'No files uploaded.'
        }
      >
        {files &&
          Array.from(files).map((file, i) => {
            const uploadHasFailed =
              props.fileStatuses &&
              props.fileStatuses[file.name] === FileUploadStatus.FAILED
            const uploadProgress = uploadHasFailed
              ? 0
              : props.fileUploadProgress
              ? `${props.fileUploadProgress[file.name]}%`
              : 0
            return (
              <div className={`file ${uploadHasFailed ? 'error' : ''}`} key={`file_${i}`}>
                <div className="file-info">
                  <Icon icon={getIcon(file.name)} size="2x" extraClassName="file-icon" />
                  <div className="main">
                    {file.name}
                    {file.size > 0 && (
                      <span className="file-size">{formatFileSize(file.size)}</span>
                    )}
                  </div>
                  {uploadHasFailed && (
                    <Icon
                      icon={GeneralIcons.Redo}
                      onClick={() => retryUpload(file)}
                      tooltip={props.messageOverrides?.removeFileTooltip || 'Retry'}
                      extraClassName="retry"
                    />
                  )}
                  <Icon
                    icon={GeneralIcons.Remove}
                    onClick={() => removeFile(file, i)}
                    tooltip={props.messageOverrides?.removeFileTooltip || 'Remove'}
                    extraClassName="remove"
                  />
                </div>
                {file.size > 0 && (
                  <div
                    className={`progress-bar ${
                      uploadProgress === '100%' ? 'complete' : ''
                    }`}
                  >
                    <div
                      className="progress-bar-fill"
                      style={{ width: uploadProgress }}
                    />
                  </div>
                )}
              </div>
            )
          })}
      </section>
    )
  }, [files, props.fileStatuses, props.fileUploadProgress])

  return (
    <>
      <div className={`${NOKA_COLORS_CLASS} file-upload-control`}>
        <section
          className={dropZoneClasses}
          onDragEnter={() => setDraggingOver(true)}
          onDragLeave={(e) => {
            if (!dropzone.current?.contains(e.target as Node)) {
              setDraggingOver(false)
            }
          }}
          onMouseLeave={() => setDraggingOver(false)}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, files, setFiles, setDraggingOver)}
          ref={dropzone}
        >
          <input
            ref={fileBrowserButton}
            type="file"
            onChange={startUpload}
            multiple={props.isMultiple}
            accept={props.supportedFileExtensions?.join(',')}
          />
          {props.uploadIcon !== null && (
            <Icon
              icon={props.uploadIcon || GeneralIcons.Upload}
              extraClassName="upload-icon"
              size="4x"
            />
          )}
          <div className="instructions">
            <p>
              {props.messageOverrides?.browsePrefix || 'Drag and drop files here or '}
              {props.isDisabled ? (
                props.messageOverrides?.browse || 'browse'
              ) : (
                <a href="#" onClick={(e) => launchFileBrowser(e)} rel="noreferrer">
                  {props.messageOverrides?.browse || 'browse'}
                </a>
              )}
              {props.messageOverrides?.browseSuffix}
            </p>
            <p className="further-descriptions">
              {props.supportedFileExtensions && (
                <>
                  {props.messageOverrides?.supportedFileFormats ||
                    `Supported file formats: ${props.supportedFileExtensions.join(', ')}`}
                  <br />
                </>
              )}
              {props.isMultiple
                ? props.messageOverrides?.multipleFilesSupported ||
                  'Multiple files may be selected.'
                : props.messageOverrides?.singleSelectionOnly ||
                  'Only one file may be selected.'}
              {fileSizeMsg && (
                <>
                  <br />
                  {fileSizeMsg}
                </>
              )}
            </p>
          </div>
        </section>

        {fileListSection}
      </div>
      {errorMessage && <InlineError message={fileSizeMsg} />}
    </>
  )
}
