import { ReactNode } from 'react'

/**
 * @property value The value associated with this option. Is automatically saved to the model when used with a <Form>.
 * @property extraData Any extra data for custom handling. Untouched in this library.
 */
export interface DropdownOption {
  text: string
  render?: () => ReactNode
  value: any
  extraData?: any
}

export type BaseProps = {
  pinnedValues?: string[]
  placeholder?: string
  allowFiltering?: boolean
  saveSelection?: boolean
  showClearButton?: boolean
  isMultiple?: boolean
  extraClassName?: string
  onOpen?: () => void
  onClose?: () => void
  emptyOptionsText?: string
  /** The single option that was just selected */
  onOptionSelected?: (option: DropdownOption | undefined) => void
  /** All selected options--useful with isMultiple */
  onOptionsChanged?: (options: DropdownOption[] | undefined) => void
  allowAdditions?: boolean
  addNewItemText?: string
  onAddNewItem?: (
    text: string,
    selectOption: (option: DropdownOption | undefined) => void
  ) => void
}

export type Props = BaseProps & {
  options: DropdownOption[]
  defaultValue?: any
  id: string
  filterHtmlProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
  hiddenInputHtmlProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
  isDisabled?: boolean
}
