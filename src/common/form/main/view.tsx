import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { get } from 'lodash'

import '../../../assets/global.scss'
import './styles.scss'

import { Props, validateProps } from './props'
import { createFormReducer, initialFormState } from './formReducer'
import { FormControlRow } from '../controlRow'
import {
  ControlValidatorMap,
  generateControl,
  getBooleanResult,
  runFormValidator,
  scrollToElement,
  usesValidateMode,
  validateEntireForm,
} from './utils'
import {
  ErrorType,
  FormActionType,
  PageErrorDisplayMode,
  SubmissionErrorScrollMode,
  ValidationMode,
} from './enums'
import { PageError } from '../../standaloneControls/pageError'
import { FormControlConfig, FormSectionConfig } from '../common/models'
import { FormArraySection } from '../arraySection'
import { NOKA_COLORS_CLASS } from '../../../assets/constants'
import { GeneralIcons, Icon } from '../../icon'
import { CONTROL_ID_DATA_ATTR } from '../controls'

export function Form<T extends object>(props: Props<T>) {
  const [state, dispatch] = useReducer(
    createFormReducer<T>(),
    initialFormState(props.defaultValues)
  )

  const controlValidators = useRef<ControlValidatorMap>({})
  const [triggerFormValidator, setTriggerFormValidator] = useState<boolean>(false)
  const controlValidatorsToTrigger = useRef<string[]>([])
  const formValidatorPropertyPaths = useRef<string[]>([])
  const [triggerFullValidation, setTriggerFullValidation] = useState<boolean>(false)
  const isAwaitingSubmit = useRef<boolean>(false)
  const submitButtonClicked = useRef<boolean>(false)

  const [showPageError, setShowPageError] = useState<boolean>(false)
  const pageErrorRef = useRef<HTMLDivElement>(null)
  const pageErrorDisplayMode =
    props.pageErrorDisplayMode || PageErrorDisplayMode.SHOW_AFTER_SUBMIT
  const onSubmissionError =
    props.onSubmissionError || SubmissionErrorScrollMode.FIRST_FIELD_WITH_ERROR

  useEffect(() => {
    validateProps(props)
  }, [])

  const setControlError = useCallback(
    (
      propertyPath: keyof T | string,
      errorType: ErrorType | undefined,
      customErrorMessage?: string
    ) => {
      if (errorType) {
        dispatch({
          type: FormActionType.SET_ERROR,
          propertyPath: propertyPath as string,
          errorType: errorType as ErrorType,
          customErrorMessage,
        })
      } else {
        dispatch({
          type: FormActionType.CLEAR_ERROR,
          propertyPath: propertyPath as string,
        })
      }
    },
    [dispatch]
  )

  const isFirstRun = useRef<boolean>(true)
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    if (props.serverErrors) {
      Object.entries(props.serverErrors).map(([propertyPath, message]) =>
        setControlError(propertyPath, ErrorType.CUSTOM, message)
      )
    } else {
      validateEntireForm(
        controlValidators.current,
        state.data,
        props.validator,
        setControlError,
        formValidatorPropertyPaths
      )
    }
  }, [props.serverErrors, setControlError])

  const saveValueToState = useCallback(
    (
      propertyPath: string | keyof T,
      value: any,
      type?:
        | FormActionType.SET_VALUE
        | FormActionType.ADD_ARRAY_VALUE
        | FormActionType.REMOVE_ARRAY_VALUE
        | FormActionType.REMOVE_ARRAY_INDEX,
      allowDuplicates?: boolean
    ) => {
      if (type === FormActionType.REMOVE_ARRAY_INDEX) {
        dispatch({
          type,
          propertyPath: propertyPath as string,
          index: value,
        })
      } else {
        dispatch({
          type: type || FormActionType.SET_VALUE,
          propertyPath: propertyPath as string,
          value,
          allowDuplicates,
        })
      }
    },
    [dispatch]
  )

  const renderControl = useCallback(
    (
      controlConfig: FormControlConfig<T>,
      sectionConfig: FormSectionConfig<T>,
      key: string,
      arrayEntryIndex?: number
    ) =>
      generateControl(
        controlConfig,
        state.data,
        props.defaultValues,
        getBooleanResult(sectionConfig.isRequired, state.data, props.isRequired),
        getBooleanResult(sectionConfig.isDisabled, state.data, props.isDisabled),
        getBooleanResult(sectionConfig.isReadOnly, state.data, props.isReadOnly),
        saveValueToState,
        setControlError,
        usesValidateMode(props.validationMode, ValidationMode.BLUR),
        usesValidateMode(props.validationMode, ValidationMode.CHANGE),
        state.errors,
        props.errorMessages || {},
        (() => {
          if (props.hideErrorsOnLoad) {
            return !state.isDirty
          }
          if (props.hideErrorsBeforeSubmit) {
            return !submitButtonClicked.current
          }
          return false
        })(),
        controlValidators.current,
        setTriggerFormValidator,
        (propertyPath: string) =>
          (controlValidatorsToTrigger.current = [
            ...controlValidatorsToTrigger.current,
            propertyPath,
          ]),
        props.formatRequiredLabels,
        props.formatOptionalLabels,
        props.infoIconTooltip,
        key,
        sectionConfig.isArray ? (sectionConfig.parentPropertyPath as string) : undefined,
        arrayEntryIndex
      ),
    [state.data, props.defaultValues, state.errors, props.isReadOnly]
  )

  useEffect(() => {
    dispatch({ type: FormActionType.REPLACE_DATA, data: props.defaultValues })
  }, [props.defaultValues])

  useEffect(() => {
    if (
      triggerFullValidation ||
      usesValidateMode(props.validationMode, ValidationMode.LOAD)
    ) {
      validateEntireForm(
        controlValidators.current,
        state.data,
        props.validator,
        setControlError,
        formValidatorPropertyPaths
      )
      if (triggerFullValidation) {
        setTriggerFullValidation(false)
      }
    }
  }, [props.defaultValues, triggerFullValidation])

  useEffect(() => {
    if (triggerFormValidator) {
      runFormValidator(
        state.data,
        props.validator,
        setControlError,
        formValidatorPropertyPaths
      )
      setTriggerFormValidator(false)
    }
  }, [triggerFormValidator])

  useEffect(() => {
    if (triggerFullValidation || controlValidatorsToTrigger.current.length > 0) {
      controlValidatorsToTrigger.current.forEach((propertyPath: string) =>
        controlValidators.current[propertyPath](get(state.data, propertyPath))
      )
    }
  }, [state.data, triggerFullValidation])

  useEffect(() => {
    if (
      pageErrorDisplayMode === PageErrorDisplayMode.SHOW_ON_FIELD_ERROR ||
      isAwaitingSubmit.current
    ) {
      setShowPageError(Object.keys(state.errors).length > 0)
    }
    if (isAwaitingSubmit.current && props.onSubmit) {
      if (Object.keys(state.errors).length === 0) {
        setShowPageError(false)
        props.onSubmit(state.data)
      } else {
        if (pageErrorDisplayMode === PageErrorDisplayMode.SHOW_AFTER_SUBMIT) {
          setShowPageError(true)
        }
      }
      isAwaitingSubmit.current = false
    }
  }, [state.errors])

  useEffect(() => {
    if (showPageError) {
      const errorKeys = Object.keys(state.errors)
      if (errorKeys.length === 0) {
        setShowPageError(false)
      } else {
        if (
          onSubmissionError === SubmissionErrorScrollMode.PAGE_ERROR &&
          props.pageErrorDisplayMode !== PageErrorDisplayMode.HIDE
        ) {
          scrollToElement(pageErrorRef.current, props.scrollContainerSelector)
        } else if (
          onSubmissionError === SubmissionErrorScrollMode.FIRST_FIELD_WITH_ERROR
        ) {
          let firstControlName = ''
          props.sections.some((s) => {
            if (firstControlName) return true
            s.controlRows.some((r) => {
              if (firstControlName) return true
              r.controls.some((c) => {
                const name = c.propertyPath as string
                if (errorKeys.includes(name)) {
                  firstControlName = name
                  return true
                }
              })
            })
          })
          if (firstControlName) {
            const firstControl = document.querySelector(
              `[${CONTROL_ID_DATA_ATTR}='${firstControlName}'']`
            )
            scrollToElement(firstControl as HTMLElement, props.scrollContainerSelector)
          }
        }
      }
    }
  }, [showPageError])

  const formContents = React.useMemo(
    () =>
      props.sections.map((section, i) => {
        if (getBooleanResult(section.isHidden, state.data, false)) {
          return null
        }
        function renderControls(arrayEntryIndex?: number) {
          return section.controlRows.map((row, j) => (
            <FormControlRow width={row.width} key={`formControlRow-${i}-${j}`}>
              {row.controls.map((controlConfig, k) =>
                renderControl(
                  controlConfig,
                  section,
                  `formControl-${i}-${j}-${k}`,
                  arrayEntryIndex
                )
              )}
            </FormControlRow>
          ))
        }
        return (
          <div className="form-section" key={`formSection-${i}`}>
            {section.headerText !== '' && (
              <h2 className="form-section-header">
                {section.headerText}
                {section.onInfoIconClicked && (
                  <Icon
                    icon={GeneralIcons.Info}
                    tooltip="Info"
                    onClick={section.onInfoIconClicked}
                    extraClassName="info"
                  />
                )}
              </h2>
            )}
            {section.isArray ? (
              <FormArraySection
                sectionConfig={section}
                data={state.data}
                renderControls={renderControls}
                saveValueToState={saveValueToState}
                isFormReadOnly={props.isReadOnly}
              />
            ) : (
              renderControls()
            )}
          </div>
        )
      }),
    [props.sections, state.data, props.isReadOnly, renderControl, saveValueToState]
  )

  const submitButton = React.useMemo(
    () =>
      props.onSubmit &&
      !props.isReadOnly && (
        <button
          type="submit"
          disabled={
            props.disableSubmitWhenInvalid && Object.keys(state.errors).length > 0
          }
          className={props.submitButtonClassname}
        >
          {props.submitButtonText || 'Submit'}
        </button>
      ),
    [
      props.isReadOnly,
      props.disableSubmitWhenInvalid,
      state.errors,
      props.submitButtonText,
      props.submitButtonClassname,
      props.onSubmit,
    ]
  )

  return (
    <>
      {showPageError && props.pageErrorDisplayMode !== PageErrorDisplayMode.HIDE && (
        <PageError
          ref={pageErrorRef}
          message={props.pageErrorMessage || 'Please fix the errors on the page.'}
        />
      )}
      <form
        {...(props.htmlProps || {})}
        id={props.id}
        className={`${NOKA_COLORS_CLASS} ${props.className || ''}`}
        onSubmit={(e) => {
          e.preventDefault()
          submitButtonClicked.current = true
          if (usesValidateMode(props.validationMode, ValidationMode.SUBMIT)) {
            isAwaitingSubmit.current = true
            setTriggerFullValidation(true)
          } else if (Object.keys(state.errors).length > 0) {
            setShowPageError(true)
          } else if (props.onSubmit) {
            props.onSubmit(state.data)
          }
        }}
      >
        {formContents}
        {submitButton}
      </form>
    </>
  )
}
