import { useState } from 'react'
import { faImage } from '@fortawesome/free-regular-svg-icons'

import { FileUploader } from '../../fileUpload'
import { Modal } from '../../../modal'
import { Input, InputType } from '../../input'
import { ImageUploadModalMessageOverrides, TextareaImageUploaderProps } from '../props'
import { UploadedImage } from './models'
import {
  AddTextSettings,
  ADD_IMAGE_BY_URL_SETTINGS,
  ADD_UPLOADED_IMAGE_SETTINGS,
} from './utils'
import {
  formatFilenameForMarkdownRenderer,
  formatImageDataString,
} from '../../../markdownRenderer'

export async function fileToUploadedImage(file: File): Promise<UploadedImage> {
  const buffer = await file.arrayBuffer()
  const bytes = [].slice.call(new Uint8Array(buffer))
  const binary = bytes.reduce((result, b) => (result += String.fromCharCode(b)), '')
  const imageData = btoa(binary)
  const imageDataStr = formatImageDataString(file.type, imageData)
  return {
    formattedFilename: formatFilenameForMarkdownRenderer(file.name),
    imageData: imageDataStr,
    fileObject: file,
  }
}

type Props = {
  show: boolean
  setShowImageUploader: React.Dispatch<React.SetStateAction<boolean>>
  messageOverrides: ImageUploadModalMessageOverrides | undefined
  imageUploaderProperties: TextareaImageUploaderProps | undefined
  uploadedImages: UploadedImage[]
  setUplodedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>
  addText: (settings: AddTextSettings) => () => void
}

export const ImageUploadModal = (props: Props) => {
  const [imageUploaderUrl, setImageUploaderUrl] = useState<string>()

  if (!props.show) {
    return null
  }

  const {
    onUpload: customOnImageUpload,
    onRemove: customOnImageRemove,
    ...customImageUploaderProperties
  } = props.imageUploaderProperties || {}

  async function onImageUpload(files: File[]) {
    const newlyUploadedImages = await Promise.all(files.map(fileToUploadedImage))
    props.setUplodedImages([...props.uploadedImages, ...newlyUploadedImages])
  }

  function onImageRemove(filename: string) {
    const fn = formatFilenameForMarkdownRenderer(filename)
    const index = props.uploadedImages.findIndex((x) => x.formattedFilename === fn)
    props.setUplodedImages([
      ...props.uploadedImages.slice(0, index),
      ...props.uploadedImages.slice(index + 1),
    ])
  }

  function onUploadedImageSelected(file: File) {
    props.addText(
      ADD_UPLOADED_IMAGE_SETTINGS(formatFilenameForMarkdownRenderer(file.name))
    )()
  }

  return (
    <Modal
      setOpen={props.setShowImageUploader}
      icon={faImage}
      headerText={props.messageOverrides?.header || 'Upload Image'}
      className="textarea-image-upload-modal"
      width={600}
      closeOnClickOutside
      buttons={
        imageUploaderUrl && (
          <button
            type="button"
            onClick={() => {
              props.addText(ADD_IMAGE_BY_URL_SETTINGS(imageUploaderUrl as string))()
              props.setShowImageUploader(false)
              setImageUploaderUrl(undefined)
            }}
          >
            {props.messageOverrides?.addButtonLabel || 'Add'}
          </button>
        )
      }
    >
      <div className="instructions">
        {props.messageOverrides?.instructions || 'Click on an uploaded image to add it.'}
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
        defaultValue={props.uploadedImages.map((i) => i.fileObject)}
      />
      <div className="input-section">
        <label>
          {props.messageOverrides?.enterImageUrlLabel || 'Or, enter an image URL:'}
        </label>
        <Input
          type={InputType.TEXT}
          htmlProps={{
            placeholder:
              props.messageOverrides?.enterImageUrlPlaceholder || 'https://...',
          }}
          onChange={(value) => {
            if (value && value.trim() !== '') {
              setImageUploaderUrl(value)
            }
          }}
        />
      </div>
    </Modal>
  )
}
