import React, { useEffect, useRef, useState } from 'react'

import './styles.scss'

import { DropdownOption, Props } from './models'
import { Option } from './option.view'
import { useClickOutside } from '../../utils/clickOutside.hook'
import { NOKA_COLORS_CLASS } from '../../../assets/constants'

export function Dropdown(props: Props) {
  const configOptions = props.options

  function getDefaultOptions() {
    if (props.defaultValue === undefined) {
      return undefined
    }
    if (Array.isArray(props.defaultValue)) {
      if (!props.isMultiple) {
        throw new Error(
          'Dropdown: isMultiple must be true when the defaultValue is an array.'
        )
      }
      const arr = props.defaultValue as any[]
      return configOptions.filter((o) => arr.includes(o.value))
    }
    const o = configOptions.find((o) => o.value === props.defaultValue)
    return o ? [o] : undefined
  }

  const [isActive, setActive] = useState<boolean>(false)

  function closeDropdown() {
    setActive(false)
    if (props.onClose) props.onClose()
  }

  const [selectedOptions, setSelectedOptions] = useState<DropdownOption[] | undefined>()
  const [currHoveredOptionIndex, setCurrHoveredOptionIndex] = useState<number>(-1)
  const [hoveredOption, setHoveredOption] = useState<DropdownOption>()
  const [filter, setFilter] = useState<string>()
  const outsideRef = useClickOutside(
    isActive,
    () => {
      closeDropdown()
      setHoveredOption(undefined)
      setCurrHoveredOptionIndex(-1)
    },
    ['dropdown-option']
  )

  useEffect(() => {
    if (Array.isArray(props.defaultValue)) {
      if (
        selectedOptions &&
        selectedOptions.length === props.defaultValue.length &&
        selectedOptions.every((o) => props.defaultValue.includes(o.value))
      ) {
        return
      }
    } else if (
      selectedOptions?.length === 1 &&
      selectedOptions[0].value === props.defaultValue
    ) {
      return
    }
    setSelectedOptions(getDefaultOptions())
  }, [props.defaultValue])

  const isFirstRender = useRef<boolean>(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (props.onOptionsChanged) {
      props.onOptionsChanged(selectedOptions)
    }
  }, [selectedOptions])

  function selectOption(option: DropdownOption | DropdownOption[] | undefined) {
    if (option === undefined) {
      setSelectedOptions(undefined)
    } else if (Array.isArray(option)) {
      setSelectedOptions(option)
    } else {
      if (props.saveSelection !== false) {
        setSelectedOptions([option])
      }
      if (props.isMultiple) {
        if (selectedOptions === undefined) {
          setSelectedOptions([option])
        } else {
          const existingOptionIndex = selectedOptions.findIndex(
            (o) => o.value === option?.value
          )
          if (existingOptionIndex > -1) {
            if (selectedOptions.length === 1) {
              setSelectedOptions(undefined)
            } else {
              setSelectedOptions([
                ...selectedOptions.slice(0, existingOptionIndex),
                ...selectedOptions.slice(existingOptionIndex + 1),
              ])
            }
          } else {
            setSelectedOptions([...(selectedOptions || []), option as DropdownOption])
          }
        }
      }
    }
    if (
      (props.showClearButton || option !== undefined) &&
      props.onOptionSelected &&
      !Array.isArray(option)
    ) {
      props.onOptionSelected(option)
    }
    setFilter(undefined)
    setCurrHoveredOptionIndex(-1)
    if (!props.isMultiple) {
      closeDropdown()
    }
  }

  const initialRenderPassed = useRef<boolean>(false)
  const prevConfigOptions = useRef<DropdownOption[]>([])
  useEffect(() => {
    if (initialRenderPassed.current === false) {
      initialRenderPassed.current = true
      prevConfigOptions.current = configOptions
      return
    }

    // Ensure that options changed before proceeding
    if (
      prevConfigOptions.current.length === configOptions.length &&
      prevConfigOptions.current.every(
        (o, i) => o.value === configOptions[i].value && o.text === configOptions[i].text
      )
    ) {
      return
    }

    prevConfigOptions.current = configOptions

    // Select default option in new options list
    if (props.isMultiple) {
      const defaultValues = props.defaultValue as any[]
      const options = configOptions.filter((o) => defaultValues.includes(o.value))
      if (options !== undefined) {
        selectOption(options)
        return
      }
    } else {
      const option = configOptions.find((o) => o.value === props.defaultValue)
      if (option !== undefined) {
        selectOption(option)
        return
      }
    }

    selectOption(undefined)
  }, [configOptions])

  useEffect(() => {
    if (currHoveredOptionIndex < filteredPinnedOptions.length) {
      setHoveredOption(filteredPinnedOptions[currHoveredOptionIndex])
    } else {
      setHoveredOption(
        filteredOptions[currHoveredOptionIndex - filteredPinnedOptions.length]
      )
    }
  }, [currHoveredOptionIndex])

  const pinnedOptions: DropdownOption[] = props.pinnedValues
    ? (props.pinnedValues
        .map((v) => {
          const option = configOptions.find((o) => o.value === v)
          if (option === undefined) {
            return null
          }
          return option
        })
        .filter((o) => o !== null) as DropdownOption[])
    : []

  function filterOptions(options: DropdownOption[]) {
    if (filter === undefined) {
      return options
    }
    const cleanedFilter = filter.trim().toLocaleLowerCase()
    return options.filter((o) => o.text.toLocaleLowerCase().includes(cleanedFilter))
  }

  const filteredOptions = filterOptions(configOptions)
  const filteredPinnedOptions = filterOptions(pinnedOptions)

  const filteredOptionsExist = filteredOptions.length > 0

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    e.stopPropagation()
    if (e.key === 'ArrowDown') {
      if (
        currHoveredOptionIndex <
        filteredOptions.length + filteredPinnedOptions.length
      ) {
        setCurrHoveredOptionIndex(currHoveredOptionIndex + 1)
      }
    } else if (e.key === 'ArrowUp') {
      if (currHoveredOptionIndex >= 0) {
        setCurrHoveredOptionIndex(currHoveredOptionIndex - 1)
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (!filteredOptionsExist && props.allowAdditions && filter && props.onAddNewItem) {
        props.onAddNewItem(filter, selectOption)
      } else if (hoveredOption) {
        selectOption(hoveredOption)
        setHoveredOption(undefined)
      } else if (filter && filteredOptions.length === 1) {
        selectOption(filteredOptions[0])
      }
      closeDropdown()
    }
  }

  const id = `${props.id}-dropdown`

  const wrapperClasses = (() => {
    const classes = [NOKA_COLORS_CLASS, 'dropdown-wrapper']
    if (isActive) {
      classes.push('active')
    }
    if (props.allowFiltering === false) {
      classes.push('unfilterable')
    }
    if (props.extraClassName) {
      classes.push(props.extraClassName)
    }
    if (props.isDisabled) {
      classes.push('disabled')
    }
    return classes.join(' ')
  })()

  const withClearButton =
    props.showClearButton &&
    (props.isMultiple
      ? selectedOptions && selectedOptions.length > 0
      : selectedOptions !== undefined)

  const inputValue = (() => {
    if (filter !== undefined) {
      return filter
    }
    if (hoveredOption) {
      return hoveredOption.text
    }
    if (!props.isMultiple && selectedOptions && selectedOptions.length > 0) {
      return selectedOptions[0].text
    }
    return ''
  })()

  const isOptionSelected = (o: DropdownOption) =>
    selectedOptions ? selectedOptions.some((s) => s.value === o.value) : false

  return (
    <div
      className={wrapperClasses}
      onClick={() => {
        if (!props.isDisabled) {
          const newState = !isActive
          setActive(newState)
          if (newState && props.onOpen) {
            props.onOpen()
          } else if (!newState && props.onClose) {
            props.onClose()
          }
        }
      }}
      ref={outsideRef}
    >
      <div className="input">
        {props.isMultiple &&
          selectedOptions?.map((o, i) => (
            <div className="option-tag" key={`${id}-selected-option-tag-${i}`}>
              {o.text}
              <span
                className="option-tag-remove"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  selectOption(o)
                }}
              >
                &times;
              </span>
            </div>
          ))}
        <input
          placeholder={props.placeholder}
          className={`dropdown-input ${withClearButton ? 'withClearButton' : ''}`}
          value={inputValue}
          onChange={(e) => setFilter(e.target.value)}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-controls={id}
          aria-haspopup="listbox"
          aria-expanded={isActive}
          aria-activedescendant={
            selectedOptions && selectedOptions.length > 0
              ? selectedOptions[0].text
              : undefined
          }
          aria-autocomplete="list"
          disabled={props.isDisabled}
          readOnly={props.allowFiltering === false}
          aria-multiselectable={props.isMultiple}
          {...props.filterHtmlProps}
        />
      </div>
      <input
        style={{ display: 'none' }}
        defaultValue={props.defaultValue}
        disabled={props.isDisabled}
        {...props.hiddenInputHtmlProps}
      />
      {withClearButton && (
        <span
          className="dropdown-clear"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            selectOption(undefined)
          }}
        >
          &times;
        </span>
      )}
      <div className={`dropdown-arrow ${props.isDisabled ? 'disabled' : ''}`} />
      {isActive && (
        <div className="options-container" role="list" id={id}>
          {filteredPinnedOptions && filteredPinnedOptions.length > 0 && (
            <>
              {filteredPinnedOptions.map((o, i) => (
                <Option
                  option={o}
                  selectOption={selectOption}
                  isSelected={isOptionSelected(o)}
                  isHovered={hoveredOption === o}
                  key={`${props.id}-pinnedOption-${i}`}
                />
              ))}
              <div className="pinned-value-separator" />
            </>
          )}
          {!filteredOptionsExist && !props.allowAdditions && (
            <div className="dropdown-option">{props.emptyOptionsText || '(Empty)'}</div>
          )}
          {!filteredOptionsExist && props.allowAdditions && filter && (
            <div
              className="dropdown-option"
              onClick={() => {
                if (props.onAddNewItem) {
                  props.onAddNewItem(filter, selectOption)
                }
              }}
            >
              {props.addNewItemText || 'Add new item...'}
            </div>
          )}
          {filteredOptions.map((o, i) => (
            <Option
              option={o}
              selectOption={selectOption}
              isSelected={isOptionSelected(o)}
              isHovered={hoveredOption === o}
              key={`${props.id}-option-${i}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
