import { FileUploaderProps } from '../fileUpload'

export type Props = {
  characterLimit?: number
  allowHorizontalResize?: boolean
  allowVerticalResize?: boolean
  htmlProps?: Omit<
    React.DetailedHTMLProps<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >,
    'maxLength' | 'defaultValue' | 'disabled'
  >
  defaultValue?: string
  isDisabled?: boolean
  useMarkdown?: boolean
  /** For the 'image' control if useMarkdown is true */
  allowImageUpload?: boolean
  /** For the dialog launched by the 'image' control if useMarkdown is true */
  imageUploaderProperties?: Omit<
    FileUploaderProps,
    'onListedFileSelected' | 'persistListedFileSelections'
  >
  messageOverrides?: {
    characterLimitLabel?: string
    uploadImageModalHeader?: string
    enterImageUrlLabel?: string
    imageUploadModalInstructions?: React.ReactNode
  }
}
