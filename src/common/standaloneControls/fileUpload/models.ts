import { IconDefinition } from '@fortawesome/fontawesome-common-types'
import { FileUploadStatus } from './enums'

export type SupportedDefaultValues =
  | File
  | File[]
  | FileList
  | string
  | string[]
  | undefined
  | null

export type Props = {
  supportedFileExtensions?: string[]
  onUpload?: (files: File[]) => void
  onRemove?: (filename: string, index: number) => void
  onFilesChange?: (files: File[] | undefined) => void
  fileUploadProgress?: { [filename: string]: number }
  fileStatuses?: { [filename: string]: FileUploadStatus }
  isMultiple?: boolean
  /** In bytes */
  individualFileSizeLimit?: number
  /** In bytes */
  totalFileSizeLimit?: number
  messageOverrides?: {
    browsePrefix?: string
    browse?: string
    browseSuffix?: string
    removeFileTooltip?: string
    supportedFileFormats?: string
    singleSelectionOnly?: string
    multipleFilesSupported?: string
    fileSizeError?: (
      individualFileSizeLimit: number | undefined,
      totalFileSizeLimit: number | undefined
    ) => string
    duplicateFileNameError?: (duplicateFileName: string) => string
    /** Only used in print and readonly views */
    noFilesUploaded?: string
  }
  /** null = Remove icon */
  uploadIcon?: IconDefinition | null
  isDisabled?: boolean
  defaultValue?: SupportedDefaultValues
  inputName?: string
  onListedFileSelected?: (file: File, isDeselected: boolean) => void
  persistListedFileSelections?: boolean
}
