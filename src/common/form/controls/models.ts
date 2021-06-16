import { FormActionType } from '../main/enums'

export type SaveControlValueToState<T> = (
  propertyPath: string | keyof T,
  value: any,
  type?:
    | FormActionType.SET_VALUE
    | FormActionType.ADD_ARRAY_VALUE
    | FormActionType.REMOVE_ARRAY_VALUE
    | FormActionType.REMOVE_ARRAY_INDEX,
  allowDuplicates?: boolean
) => void

export interface BaseFormControlProps<T> {
  propertyPath: keyof T | string
  defaultValue?: any
  isDisabled: boolean
  isReadOnly: boolean
  label: string | undefined
  hasError: boolean
  validate: (value: any) => void
  validateOnBlur: boolean
  validateOnChange: boolean
  saveValueToState: SaveControlValueToState<T>
}

export type SpecificFormControlProps<TControlConfig> = Omit<TControlConfig, 'type'>
