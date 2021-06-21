import React from 'react'
import { FormControlConfig, FormSectionConfig } from '../common/models'
import { PageErrorDisplayMode, SubmissionErrorScrollMode, ValidationMode } from './enums'
import { ErrorMessages } from './models'
import { usesValidateMode } from './utils'

export type SubmitHandler<T> = (data: T) => void
export type FormValidator<T> = (data: T) => { [propertyPath: string]: string } | undefined

export type Props<T> = {
  headerText?: React.ReactNode
  onSubmit?: SubmitHandler<T>
  sections: FormSectionConfig<T>[]
  defaultValues: T
  className?: string
  id?: string
  formatRequiredLabels?: (label: string) => React.ReactNode
  formatOptionalLabels?: (label: string) => React.ReactNode
  /** Bitflag */
  validationMode?: ValidationMode
  /** Validates the entire form. Validators can be specified for specific controls.
   * @returns A mapping of the property path of any invalid field, to its error message. */
  validator?: FormValidator<T>
  errorMessages?: ErrorMessages | ((controlConfig: FormControlConfig<T>) => ErrorMessages)
  /** The form will attempt to scroll to errors on submit. In the case that scrolling the window is not sufficient, input the selector for the scrolling element here (ex. body, main, #root) */
  scrollContainerSelector?: string
  /** SHOW_AFTER_SUBMIT by default. */
  pageErrorDisplayMode?: PageErrorDisplayMode
  pageErrorMessage?: string
  /** What to scroll to, if anything, when errors exist on submission. Set to FIRST_FIELD_WITH_ERROR by default. */
  onSubmissionError?: SubmissionErrorScrollMode
  isRequired?: boolean
  isDisabled?: boolean
  isReadOnly?: boolean
  infoIconTooltip?: string
  /** Must use with ValidationMode.LOAD to have the form start off disabled. */
  disableSubmitWhenInvalid?: boolean
  /** Used when validating on load, to hide errors before the form has been touched. */
  hideErrorsOnLoad?: boolean
  /** Hides all errors until the submit button has been clicked. */
  hideErrorsBeforeSubmit?: boolean
  submitButtonText?: string
  serverErrors?: { [propertyPath: string]: string }
}

export function validateProps<T>(props: Props<T>) {
  if (
    props.pageErrorDisplayMode === PageErrorDisplayMode.SHOW_ON_FIELD_ERROR &&
    !usesValidateMode(props.validationMode, ValidationMode.BLUR) &&
    !usesValidateMode(props.validationMode, ValidationMode.CHANGE)
  ) {
    throw new Error(
      'When the pageErrorDisplayMode is set to SHOW_ON_FIELD_ERROR,  the validation mode must be set to either BLUR or CHANGE.'
    )
  }
}
