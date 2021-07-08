import React, { ChangeEvent, ChangeEventHandler, useMemo, useState } from 'react'

import { Icon } from '../../icon'
import { useRef } from 'react'
import { useCallback } from 'react'
import { useEffect } from 'react'
import {
  AddTextSettingResults,
  AddTextSettings,
  CONTROLS,
  getNumLinebreaksAtEnd,
} from './utils'
import { MarkdownRenderer } from '../../markdownRenderer'

export function useMarkdown(
  use: boolean,
  defaultValue: string | undefined,
  customOnChange: ChangeEventHandler<HTMLTextAreaElement> | undefined
) {
  const [value, setValue] = useState<string>('')
  const ref = useRef<HTMLTextAreaElement>(null)
  const currentSelection = useRef<{ start: number; end: number }>()
  const currentSelectionDeltaAfterChange = useRef(0)

  useEffect(() => {
    if (use) {
      setValue(defaultValue || '')
    }
  }, [defaultValue, use])

  const isFirstRun = useRef<boolean>(true)
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    if (customOnChange && (value !== defaultValue || '')) {
      // @ts-expect-error
      customOnChange({ target: { value } })
    }

    if (ref.current) {
      ref.current.focus()
      if (currentSelection.current) {
        const delta = currentSelectionDeltaAfterChange.current
        ref.current.setSelectionRange(
          currentSelection.current.start + delta,
          currentSelection.current.end + delta
        )
        currentSelection.current = undefined
      }
    }
  }, [value, customOnChange])

  if (!use) {
    return {
      formattingControlsJsx: null,
      value: undefined,
      textareaRef: ref,
      onChange: customOnChange,
    }
  }

  const addText = useCallback(
    (settings: AddTextSettings) => {
      return () => {
        if (ref.current === null) {
          return
        }
        currentSelection.current = {
          start: ref.current.selectionStart,
          end: ref.current.selectionEnd,
        }
        const selection = currentSelection.current
        function getResult(result: AddTextSettingResults, selectionOffset: number) {
          if (typeof result === 'object') {
            currentSelection.current = {
              start: selectionOffset + result.selectionRangeStart,
              end: selectionOffset + result.selectionRangeEnd,
            }
            return result.value
          }
          return result
        }
        if (selection.start === selection.end) {
          currentSelectionDeltaAfterChange.current = 0
          setValue((value) =>
            getResult(
              settings.noSelections(
                value,
                value.length === 0,
                getNumLinebreaksAtEnd(value)
              ),
              0
            )
          )
        } else {
          setValue((value) => {
            const parts = {
              start: value.slice(0, selection.start),
              selection: value.slice(selection.start, selection.end),
              end: value.slice(selection.end),
            }
            currentSelectionDeltaAfterChange.current =
              typeof settings.selectionDeltaAfterChange === 'function'
                ? settings.selectionDeltaAfterChange(parts.selection)
                : settings.selectionDeltaAfterChange || 0
            const result = getResult(
              settings.withSelections(
                parts.selection,
                parts.start.length === 0,
                getNumLinebreaksAtEnd(parts.start)
              ),
              parts.start.length
            )
            return `${parts.start}${result}${parts.end}`
          })
        }
      }
    },
    [ref, setValue]
  )

  const jsx = useMemo(
    () => (
      <section className="textarea-formatting-controls">
        {CONTROLS.map((c) =>
          c ? (
            <Icon icon={c.icon} tooltip={c.tooltip} onClick={addText(c.settings)} />
          ) : (
            <span className="spacer" />
          )
        )}
      </section>
    ),
    []
  )

  const previewArea = useMemo(() => <MarkdownRenderer value={value} />, [value])

  const CODE = {
    bullet: '- ',
    ol: /^[0-9]+\. /,
    task: '* [ ] ',
    checkedTask: '* [ ] ',
  }
  const LIST_ITEM_CODE = Object.values(CODE).filter(
    (c) => typeof c === 'string'
  ) as string[]

  /** @returns true if setValue was called, false otherwise. */
  function setValueBasedOnLastLine(
    lastLine: string,
    previousLines: string,
    codeToCheckFor: string
  ) {
    if (lastLine === codeToCheckFor) {
      setValue(`${previousLines}\n`)
      return true
    } else if (lastLine.startsWith(codeToCheckFor)) {
      setValue((value) => `${value}\n${codeToCheckFor}`)
      return true
    }
    return false
  }

  function onKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (ref.current && e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      const lines = ref.current.value.split('\n')
      const lastLine = lines[lines.length - 1]
      const previousLines = lines.slice(0, -1).join('\n')
      const areValuesSet = LIST_ITEM_CODE.some((c) =>
        setValueBasedOnLastLine(lastLine, previousLines, c)
      )
      if (!areValuesSet) {
        const startsWithOl = CODE.ol.exec(lastLine)
        if (startsWithOl) {
          const prefix = startsWithOl[0]
          if (lastLine === prefix) {
            setValue(`${previousLines}\n`)
          } else {
            const nextNumber = parseInt(prefix.slice(0, -2)) + 1
            setValue((value) => `${value}\n${nextNumber}. `)
          }
        } else {
          setValue((value) => `${value}\n`)
        }
      }
    }
  }

  return {
    formattingControlsJsx: jsx,
    value,
    textareaRef: ref,
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value)
      if (customOnChange) {
        customOnChange(e)
      }
    },
    markdownPreviewArea: previewArea,
    onKeyPress,
  }
}
