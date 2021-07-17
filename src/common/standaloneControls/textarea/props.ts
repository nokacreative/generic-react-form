import { FileUploaderProps } from '../fileUpload'

export type ImageUploadModalMessageOverrides = {
  header?: string
  instructions?: React.ReactNode
  enterImageUrlLabel?: string
  enterImageUrlPlaceholder?: string
  addButtonLabel?: string
}

export type TextareaImageUploaderProps = Omit<
  FileUploaderProps,
  'onListedFileSelected' | 'persistListedFileSelections'
>

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
  imageUploaderProperties?: TextareaImageUploaderProps
  messageOverrides?: {
    characterLimitLabel?: string
    imageUploadModal?: ImageUploadModalMessageOverrides
  }
}
