import { ReactNode } from 'react'

export interface DropdownOption {
  text: string
  render?: () => ReactNode
  value: any
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
