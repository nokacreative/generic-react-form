import { get } from 'lodash'
import React from 'react'
import { InputType } from '../../standaloneControls/input'
import { FormControlType } from '../common/enums'
import {
  ConditionalBooleanFunction,
  DateInputControlConfig,
  FormControlConfig,
  SpecificFormControlConfig,
} from '../common/models'
import { BaseFormControlProps, FormControls, SaveControlValueToState } from '../controls'
import {
  DEFAULT_ERROR_MESSAGES,
  EMAIL_REGEX,
  PHONE_REGEX,
  PHONE_REGEX_AREACODE_REQUIRED,
} from './data'
import { ErrorType, ValidationMode } from './enums'
import { ErrorMap, ErrorMessages } from './models'
import { FormValidator } from './props'

export type SetControlError<T> = (
  propertyPath: keyof T | string,
  errorType: ErrorType | undefined,
  customErrorMessage?: string
) => void

export type ControlValidator = (value: any) => void
export type ControlValidatorMap = { [propertyPath: string]: ControlValidator }

export function runFormValidator<T>(
  data: T,
  formValidator: FormValidator<T> | undefined,
  setControlError: SetControlError<T>,
  formValidatorPropertyPaths: React.MutableRefObject<string[]>
) {
  if (formValidator) {
    const errors = formValidator(data)
    if (errors) {
      Object.entries(errors).forEach(([propertyPath, errorMessage]) => {
        setControlError(propertyPath, ErrorType.CUSTOM, errorMessage)
      })
    }
    const errorPaths = errors ? Object.keys(errors) : undefined
    formValidatorPropertyPaths.current.forEach((propertyPath) => {
      if (errorPaths && errorPaths.includes(propertyPath)) return
      setControlError(propertyPath, undefined)
    })
    formValidatorPropertyPaths.current = errorPaths || []
  }
}

export function validateEntireForm<T>(
  controlValidators: ControlValidatorMap,
  data: T,
  formValidator: FormValidator<T> | undefined,
  setControlError: SetControlError<T>,
  formValidatorPropertyPaths: React.MutableRefObject<string[]>,
  setFullValidationComplete: React.Dispatch<React.SetStateAction<boolean>>
) {
  setFullValidationComplete(false)
  Object.values(controlValidators).forEach((validate) => validate(null))
  setTimeout(() => {
    runFormValidator(data, formValidator, setControlError, formValidatorPropertyPaths)
  }, 100)
  setTimeout(() => {
    setFullValidationComplete(true)
  }, 200)
}

function validateControl<T>(
  propertyPath: string,
  controlConfig: FormControlConfig<T>,
  data: T,
  isDisabled: boolean,
  isRequired: boolean,
  setControlError: SetControlError<T>,
  validateControlOnNextUpdate: (propertyPath: string) => void
): ControlValidator {
  return (value: any) => {
    if (value === null) {
      validateControlOnNextUpdate(propertyPath)
      return
    }

    if (isDisabled) {
      setControlError(propertyPath, undefined)
      return
    }

    if (isRequired) {
      if (controlConfig.type === FormControlType.CHECKBOX_GROUP) {
        if (
          controlConfig.minNumSelections &&
          (!value || value.length < controlConfig.minNumSelections)
        ) {
          setControlError(propertyPath, ErrorType.CHECKBOX_MIN_SELECTIONS)
          return
        }
        if (!value || value.length === 0) {
          if (controlConfig.selections.length === 1) {
            setControlError(propertyPath, ErrorType.REQUIRED)
            return
          }
          setControlError(propertyPath, ErrorType.CHECKBOX_REQUIRED)
          return
        }
      }
      if (value == null || (typeof value === 'string' && value.trim() === '')) {
        setControlError(propertyPath, ErrorType.REQUIRED)
        return
      }
    }

    if (value && controlConfig.type === FormControlType.INPUT) {
      if (controlConfig.minLength && value.length < controlConfig.minLength) {
        setControlError(propertyPath, ErrorType.MIN_LENGTH)
        return
      }
      if (controlConfig.maxLength && value.length > controlConfig.maxLength) {
        setControlError(propertyPath, ErrorType.MAX_LENGTH)
        return
      }
      if (controlConfig.inputType === InputType.EMAIL && !EMAIL_REGEX.test(value)) {
        setControlError(propertyPath, ErrorType.EMAIL)
        return
      }
      if (controlConfig.inputType === InputType.PHONE && value) {
        if (
          (controlConfig.requireCountryCode &&
            !PHONE_REGEX_AREACODE_REQUIRED.test(value)) ||
          !PHONE_REGEX.test(value)
        ) {
          setControlError(propertyPath, ErrorType.PHONE)
          return
        }
      }
      if (controlConfig.inputType === InputType.NUMBER) {
        if (controlConfig.minValue && value < controlConfig.minValue) {
          setControlError(propertyPath, ErrorType.MIN_VALUE)
          return
        }
        if (controlConfig.maxValue && value > controlConfig.maxValue) {
          setControlError(propertyPath, ErrorType.MAX_VALUE)
          return
        }
      }
    }

    if (controlConfig.type === FormControlType.CHECKBOX_GROUP) {
      if (
        controlConfig.maxNumSelections &&
        value.length > controlConfig.maxNumSelections
      ) {
        setControlError(propertyPath, ErrorType.CHECKBOX_MAX_SELECTIONS)
        return
      }
    }

    if (controlConfig.validator) {
      const customErrorMessage = controlConfig.validator(value, data)
      if (!customErrorMessage) {
        setControlError(propertyPath, undefined)
        return
      }
      if(typeof customErrorMessage === 'string') {
        setControlError(propertyPath, ErrorType.CUSTOM, customErrorMessage)
        return
      }
      Object.entries(customErrorMessage).forEach(
        ([propertyPath, message]) => message ?
        setControlError(propertyPath, ErrorType.CUSTOM, message) :
        setControlError(propertyPath, undefined)
      )
      return
    }

    setControlError(propertyPath, undefined)
  }
}

function getControlDescription<T>(controlConfig: FormControlConfig<T>) {
  const userDescriptionExists = controlConfig.description !== undefined
  if (typeof controlConfig.description !== 'function' && userDescriptionExists) {
    return controlConfig.description
  }
  let existingMessage
  if (controlConfig.type === FormControlType.CHECKBOX_GROUP) {
    const { minNumSelections, maxNumSelections } = controlConfig
    existingMessage = (() => {
      if (minNumSelections && maxNumSelections) {
        if (minNumSelections === maxNumSelections) {
          return `Select exactly ${minNumSelections} choices.`
        }
        return `Select between ${minNumSelections} and ${maxNumSelections} choices.`
      }
      if (minNumSelections) {
        return `Select at least ${minNumSelections} choices.`
      }
      if (maxNumSelections) {
        return `Select at most ${maxNumSelections} choices.`
      }
      return undefined
    })()
  }
  if (userDescriptionExists) {
    return (controlConfig.description as Function)(existingMessage)
  }
  return existingMessage
}

export function usesValidateMode(
  toCheck: ValidationMode | undefined,
  mode: ValidationMode
) {
  return toCheck ? (toCheck & mode) === mode : false
}

export function getBooleanResult<T>(
  property: boolean | ConditionalBooleanFunction<T> | undefined,
  data: T,
  parentResult: boolean | undefined,
  arrayEntryIndex: number | undefined
) {
  if (typeof property === 'boolean') {
    return property
  }
  if (property !== undefined) {
    return property(data, arrayEntryIndex)
  }
  return parentResult
}

export function generateControl<T>(
  controlConfig: FormControlConfig<T>,
  data: T,
  defaultValues: T,
  isFormRequired: boolean | undefined,
  isFormDisabled: boolean | undefined,
  isFormReadOnly: boolean | undefined,
  saveValueToState: SaveControlValueToState<T>,
  setControlError: SetControlError<T>,
  validateOnBlur: boolean,
  validateOnChange: boolean,
  errors: ErrorMap,
  errorMessages: ErrorMessages | ((controlConfig: FormControlConfig<T>) => ErrorMessages),
  hideErrors: boolean,
  controlValidators: ControlValidatorMap,
  setTriggerFormValidator: React.Dispatch<React.SetStateAction<boolean>>,
  validateControlOnNextUpdate: (propertyPath: string) => void,
  formatRequiredLabels: ((label: string) => React.ReactNode) | undefined,
  formatOptionalLabels: ((label: string) => React.ReactNode) | undefined,
  infoIconTooltip: string | undefined,
  key: string,
  parentPropertyPath: string | undefined,
  arrayEntryIndex: number | undefined
) {
  if (getBooleanResult(controlConfig.isHidden, data, false, arrayEntryIndex)) {
    return null
  }

  const propertyPath = parentPropertyPath
    ? `${parentPropertyPath}.${arrayEntryIndex}.${controlConfig.propertyPath}`
    : (controlConfig.propertyPath as string)
  const defaultValue = get(
    parentPropertyPath || controlConfig.type === FormControlType.RADIO_GROUP
      ? data
      : defaultValues,
    propertyPath
  )
  const hasError =
    hideErrors || controlConfig.hideErrorMessage ? false : propertyPath in errors

  const isDisabled = !!getBooleanResult(
    controlConfig.isDisabled,
    data,
    isFormDisabled,
    arrayEntryIndex
  )
  const isRequired = !!getBooleanResult(
    controlConfig.isRequired,
    data,
    isFormRequired,
    arrayEntryIndex
  )
  const isReadOnly = !!getBooleanResult(
    controlConfig.isReadOnly,
    data,
    isFormReadOnly,
    arrayEntryIndex
  )

  const customElement =
    typeof controlConfig.customElement === 'function'
      ? controlConfig.customElement(data)
      : controlConfig.customElement

  const controlValidator = validateControl(
    propertyPath,
    controlConfig,
    data,
    isDisabled,
    isRequired,
    setControlError,
    validateControlOnNextUpdate
  )
  controlValidators[propertyPath] = controlValidator

  const baseProps: BaseFormControlProps<T> = {
    propertyPath,
    label: controlConfig.label,
    defaultValue,
    isDisabled,
    isReadOnly,
    hasError,
    validate:
      validateOnBlur || validateOnChange
        ? (value: any) => {
            controlValidator(value)
            setTriggerFormValidator(true)
          }
        : controlValidator,
    validateOnBlur,
    validateOnChange,
    saveValueToState,
  }

  const specificProps = Object.keys(baseProps).reduce(
    (result: Partial<FormControlConfig<T>>, key: string) => {
      const { [key as keyof FormControlConfig<T>]: _remove, ...rest } = result
      return rest
    },
    controlConfig
  ) as SpecificFormControlConfig<T>

  const control = (() => {
    switch (specificProps.type) {
      case FormControlType.INPUT: {
        switch (specificProps.inputType) {
          case InputType.MONEY:
            return <FormControls.Money {...baseProps} {...specificProps} />
          case InputType.DATE:
            return (
              <FormControls.DateInput
                {...baseProps}
                {...(specificProps as DateInputControlConfig)}
              />
            )
          default:
            return <FormControls.Input {...baseProps} {...specificProps} />
        }
      }
      case FormControlType.RADIO_GROUP:
        return <FormControls.Radio {...baseProps} {...specificProps} />
      case FormControlType.CHECKBOX_GROUP:
        return <FormControls.Checkbox {...baseProps} {...specificProps} />
      case FormControlType.TEXTAREA: {
        if (specificProps.uploadedImagesPropertyPath) {
          const defaultUploadedImages = get(
            defaultValues,
            specificProps.uploadedImagesPropertyPath
          )
          return (
            <FormControls.Textarea
              {...baseProps}
              {...specificProps}
              defaultUploadedImages={defaultUploadedImages}
            />
          )
        }
        return <FormControls.Textarea {...baseProps} {...specificProps} />
      }
      case FormControlType.ATTACHMENT:
        return <FormControls.Attachment {...baseProps} {...specificProps} />
      case FormControlType.DROPDOWN: {
        const { options, onOptionSelected, ...rest } = specificProps
        return (
          <FormControls.Dropdown
            {...baseProps}
            options={
              typeof options === 'function' ? options(data, arrayEntryIndex) : options
            }
            onOptionSelected={
              onOptionSelected
                ? (option) => onOptionSelected(option, data, arrayEntryIndex)
                : undefined
            }
            {...rest}
          />
        )
      }
      case FormControlType.CUSTOM: {
        if (typeof specificProps.render === 'function') {
          return specificProps.render(data)
        }
        return specificProps.render
      }
    }
  })()

  return (
    <FormControls.Wrapper
      label={(() => {
        if (controlConfig.label) {
          if (formatRequiredLabels && isRequired) {
            return formatRequiredLabels(controlConfig.label)
          }
          if (formatOptionalLabels && !isRequired) {
            return formatOptionalLabels(controlConfig.label)
          }
        }
        return controlConfig.label
      })()}
      id={controlConfig.id}
      className={controlConfig.className}
      hasError={hasError}
      errorMessage={(() => {
        if (!hasError) {
          return undefined
        }
        const error = errors[propertyPath]
        if (error.customMessage) {
          return error.customMessage
        }
        if (typeof errorMessages === 'function') {
          const msg = errorMessages(controlConfig)[error.type]
          if (msg) return msg
        }
        return (
          (errorMessages as ErrorMessages)[error.type] ||
          DEFAULT_ERROR_MESSAGES(controlConfig)[error.type]
        )
      })()}
      growthRatio={controlConfig.growthRatio}
      width={controlConfig.width}
      alignRight={controlConfig.alignRight}
      propertyPath={propertyPath as string}
      description={getControlDescription(controlConfig)}
      onInfoIconClicked={controlConfig.onInfoIconClicked}
      infoIconTooltip={infoIconTooltip}
      isInline={controlConfig.isInline}
      customElement={customElement}
      key={key}
    >
      {control}
    </FormControls.Wrapper>
  )
}

export function scrollToElement(
  element: HTMLElement | null,
  scrollContainerSelector?: string
) {
  const scrollOptions: ScrollToOptions = {
    top: element?.offsetTop || 0,
    behavior: 'smooth',
  }
  if (scrollContainerSelector) {
    document.querySelector(scrollContainerSelector)?.scrollTo(scrollOptions)
  } else {
    window.scrollTo(scrollOptions)
  }
}
