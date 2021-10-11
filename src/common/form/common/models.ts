import React from 'react'
import { TextareaProps } from '../../standaloneControls'

import { DateInputProps } from '../../standaloneControls/date'
import { DropdownOption, DropdownProps } from '../../standaloneControls/dropdown'
import { FileUploaderProps } from '../../standaloneControls/fileUpload'
import { InputType } from '../../standaloneControls/input'
import { FormControlType, RadioLayout, ControlRowWidth } from './enums'

/** @param index The index of the array entry. Undefined if not in an array section. */
export type ConditionalFunction<T, TReturnValue> = (
  data: T,
  index?: number
) => TReturnValue
export type ConditionalBooleanFunction<T> = ConditionalFunction<T, boolean>

// ======================================================
// Control Configurations
// ======================================================

interface BaseControlConfig<T> {
  /** The data that is bound to this control. Also acts as the name of the control for reference purposes. */
  propertyPath: keyof T | string
  label?: string
  /** A message may be automatically generated depending on the properties of the control, such as having a minimum length or number of required selections. Using the non-function version of this property replaces it. */
  description?: React.ReactNode | ((existingMessage?: string) => React.ReactNode)
  isHidden?: boolean | ConditionalBooleanFunction<T>
  isRequired?: boolean | ConditionalBooleanFunction<T>
  isDisabled?: boolean | ConditionalBooleanFunction<T>
  isReadOnly?: boolean | ConditionalBooleanFunction<T>
  /** From 0 to 2, used as flex-grow */
  growthRatio?: number
  /** A static width to use */
  width?: string
  hideErrorMessage?: boolean
  alignRight?: boolean
  /** Return an error message if there is an error, or undefined | null otherwise */
  validator?: (fieldValue: any, formData: T) => string | undefined | null
  onInfoIconClicked?: () => void
  /** Whether or not the label should be inline with the control */
  isInline?: boolean
  /** Anything that should be added to the control */
  customElement?: React.ReactNode | ((formData: T) => React.ReactNode)
}

export interface BaseInputControlConfig {
  type: FormControlType.INPUT
  placeholder?: string
  minLength?: number
  maxLength?: number
  htmlProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
}
export interface StandardInputControlConfig extends BaseInputControlConfig {
  inputType?: Exclude<InputType, InputType.NUMBER | InputType.MONEY | InputType.PHONE>
}

export interface PhoneInputcontrolConfig extends BaseInputControlConfig {
  inputType: InputType.PHONE
  requireAreaCode?: boolean
}

export interface NumericInputControlConfig extends BaseInputControlConfig {
  inputType: InputType.NUMBER
  minValue?: number
  maxValue?: number
}

export interface MoneyInputControlConfig extends BaseInputControlConfig {
  inputType: InputType.MONEY
  minValue?: number
  maxValue?: number
  currencyCode?: string
}

export type DateInputControlConfig = BaseInputControlConfig &
  Omit<DateInputProps, 'value' | 'startValue' | 'endValue'> & {
    inputType: InputType.DATE
  }

export type InputControlConfig =
  | StandardInputControlConfig
  | PhoneInputcontrolConfig
  | NumericInputControlConfig
  | MoneyInputControlConfig
  | DateInputControlConfig

export interface RadioSelection {
  value: any
  text: string
}

export interface BaseRadioOrCheckboxGroupConfig {
  selections: RadioSelection[]
  layout?: RadioLayout
  numGridColumns?: 2 | 3 | 4
}

export interface RadioGroupControlConfig extends BaseRadioOrCheckboxGroupConfig {
  type: FormControlType.RADIO_GROUP
}

export interface CheckboxGroupControlConfig extends BaseRadioOrCheckboxGroupConfig {
  type: FormControlType.CHECKBOX_GROUP
  minNumSelections?: number
  maxNumSelections?: number
}

export type TextareaControlConfig = Omit<TextareaProps, 'isDisabled' | 'defaultValue'> & {
  type: FormControlType.TEXTAREA
  placeholder?: string
  /** Only used when useMarkdown is true: save the uploaded images to the specified path. Defaults to <propertyPath_images>. */
  uploadedImagesPropertyPath?: string
  /** Only used when useMarkdown is true: saves the entire file to the state, as opposed to just its name. False by default. */
  saveFullImageFile?: boolean
}

export type AttachmentControlConfig = Omit<
  FileUploaderProps,
  'isDisabled' | 'defaultValue'
> & {
  type: FormControlType.ATTACHMENT
  /** Whether to save the full File object, or just its name. False by default. */
  saveFullFile?: boolean
}

export type DropdownControlConfig<T> = DropdownProps & {
  type: FormControlType.DROPDOWN
  options: DropdownOption[] | ConditionalFunction<T, DropdownOption[]>
}

export type CustomControlConfig<T> = {
  type: FormControlType.CUSTOM
  render: JSX.Element | ConditionalFunction<T, JSX.Element>
}

export type SpecificFormControlConfig<T> =
  | InputControlConfig
  | RadioGroupControlConfig
  | CheckboxGroupControlConfig
  | TextareaControlConfig
  | AttachmentControlConfig
  | DropdownControlConfig<T>
  | CustomControlConfig<T>

export type FormControlConfig<T> = BaseControlConfig<T> & SpecificFormControlConfig<T>

// ======================================================
// Control Row
// ======================================================

export interface FormControlRow<T> {
  width?: ControlRowWidth
  controls: FormControlConfig<T>[]
}

// ======================================================
// Section Configurations
// ======================================================

interface BaseFormSectionConfig<T> {
  headerText?: string | JSX.Element
  controlRows: FormControlRow<T>[]
  isHidden?: boolean | ConditionalBooleanFunction<T>
  onInfoIconClicked?: () => void
  isRequired?: boolean | ConditionalBooleanFunction<T>
  isDisabled?: boolean | ConditionalBooleanFunction<T>
  isReadOnly?: boolean | ConditionalBooleanFunction<T>
}

export interface ArrayFormSectionConfig<T> extends BaseFormSectionConfig<T> {
  isArray: true
  parentPropertyPath: keyof T | string
  addEntryWhenEmpty?: boolean
  allowReordering?: boolean
  itemName?: string | JSX.Element
  blankValues: any
  disallowRemoval?: ConditionalBooleanFunction<T>
  messageOverrides?: {
    addEntry?: string
    removeEntry?: string
    restoreEntry?: string
    reorderEntry?: string
  }
}

export type FormSectionConfig<T> =
  | (BaseFormSectionConfig<T> & { isArray?: never })
  | ArrayFormSectionConfig<T>
