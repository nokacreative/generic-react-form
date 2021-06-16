import { FormActionType, ErrorType } from './enums'

export interface FormState<T> {
  data: T
  errors: ErrorMap
  isDirty: boolean
}

interface SingleValueFA {
  type:
    | FormActionType.SET_VALUE
    | FormActionType.ADD_ARRAY_VALUE
    | FormActionType.REMOVE_ARRAY_VALUE
  propertyPath: string
  value: any
  allowDuplicates?: boolean
}

interface ArrayIndexFA {
  type: FormActionType.REMOVE_ARRAY_INDEX
  propertyPath: string
  index: number
}

interface ReplaceDataFA<T> {
  type: FormActionType.REPLACE_DATA
  data: T
}

interface SetErrorFA {
  type: FormActionType.SET_ERROR
  propertyPath: string
  errorType: ErrorType
  customErrorMessage?: string
}

interface ClearErrorFA {
  type: FormActionType.CLEAR_ERROR
  propertyPath: string
}

export type FormAction<T> =
  | SingleValueFA
  | ReplaceDataFA<T>
  | SetErrorFA
  | ClearErrorFA
  | ArrayIndexFA

export type ErrorMap = {
  [propertyPath: string]: {
    type: ErrorType
    customMessage?: string
  }
}

export type ErrorMessages = { [key in ErrorType]?: string }
