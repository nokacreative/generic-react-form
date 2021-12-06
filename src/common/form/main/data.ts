import {
  CheckboxGroupControlConfig,
  FormControlConfig,
  InputControlConfig,
  IntegerInputControlConfig,
} from '../common/models'
import { ErrorType } from './enums'
import { ErrorMessages } from './models'

export const EMAIL_REGEX =
  // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
export const PHONE_REGEX = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
export const PHONE_REGEX_AREACODE_REQUIRED =
  /^(\+\d{1,2}\s?)\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/

export const DEFAULT_ERROR_MESSAGES = <T>(
  controlConfig: FormControlConfig<T>
): ErrorMessages => ({
  [ErrorType.REQUIRED]: 'This value is required.',
  [ErrorType.MIN_LENGTH]: `Must be at least ${
    (controlConfig as InputControlConfig).minLength
  } characters.`,
  [ErrorType.MAX_LENGTH]: `Must be at most ${
    (controlConfig as InputControlConfig).maxLength
  } characters.`,
  [ErrorType.MIN_VALUE]: `Must be greater than ${
    (controlConfig as IntegerInputControlConfig).minValue
  }.`,
  [ErrorType.MAX_VALUE]: `Must be less than ${
    (controlConfig as IntegerInputControlConfig).maxValue
  }.`,
  [ErrorType.EMAIL]: 'Please enter a valid email.',
  [ErrorType.PHONE]: 'Please enter a valid phone number.',
  [ErrorType.CUSTOM]: 'This value is invalid.',
  [ErrorType.CHECKBOX_REQUIRED]: 'At least one selection is required.',
  [ErrorType.CHECKBOX_MIN_SELECTIONS]: `Must have at least ${
    (controlConfig as CheckboxGroupControlConfig).minNumSelections
  } selections.`,
  [ErrorType.CHECKBOX_MAX_SELECTIONS]: `Can have at most ${
    (controlConfig as CheckboxGroupControlConfig).maxNumSelections
  } selections.`,
})
