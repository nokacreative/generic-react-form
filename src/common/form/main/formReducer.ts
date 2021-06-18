import { set, get, cloneDeep } from 'lodash'

import { FormState, FormAction } from './models'
import { FormActionType } from './enums'

export const initialFormState = <T>(defaultValues: T): FormState<T> => ({
  data: defaultValues,
  errors: {},
  isDirty: false,
})

export function createFormReducer<T extends object>() {
  return (state: FormState<T>, action: FormAction<T>): FormState<T> => {
    switch (action.type) {
      case FormActionType.SET_VALUE: {
        const newData = set(cloneDeep(state.data), action.propertyPath, action.value)
        if (!state.isDirty) {
          const existingData = get(state.data, action.propertyPath)
          if (newData === existingData) {
            return state
          }
        }
        return {
          ...state,
          isDirty: true,
          data: newData,
        }
      }
      case FormActionType.REPLACE_DATA:
        return {
          ...state,
          isDirty: false,
          data: cloneDeep(action.data),
        }
      case FormActionType.ADD_ARRAY_VALUE: {
        const existingValue = (get(state.data, action.propertyPath) as any[]) || []
        const newValue = action.allowDuplicates
          ? [...existingValue, action.value]
          : existingValue.includes(action.value)
          ? existingValue
          : [...existingValue, action.value]
        return {
          ...state,
          isDirty: true,
          data: set(cloneDeep(state.data), action.propertyPath, newValue),
        }
      }
      case FormActionType.REMOVE_ARRAY_VALUE: {
        const existingValue = (get(state.data, action.propertyPath) as any[]) || []
        return {
          ...state,
          isDirty: true,
          data: set(
            cloneDeep(state.data),
            action.propertyPath,
            existingValue.filter((v) => v !== action.value)
          ),
        }
      }
      case FormActionType.REMOVE_ARRAY_INDEX: {
        const existingValue = (get(state.data, action.propertyPath) as any[]) || []
        return {
          ...state,
          isDirty: true,
          data: set(
            cloneDeep(state.data),
            action.propertyPath,
            action.index === 0
              ? existingValue.slice(1)
              : [
                  ...existingValue.slice(0, action.index),
                  ...existingValue.slice(action.index + 1),
                ]
          ),
        }
      }
      case FormActionType.SET_ERROR:
        return {
          ...state,
          errors: {
            ...state.errors,
            [action.propertyPath]: {
              type: action.errorType,
              customMessage: action.customErrorMessage,
            },
          },
        }
      case FormActionType.CLEAR_ERROR: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [action.propertyPath]: _, ...errorsWithoutPropertyPath } = state.errors
        return {
          ...state,
          errors: errorsWithoutPropertyPath,
        }
      }
      default:
        return state
    }
  }
}
