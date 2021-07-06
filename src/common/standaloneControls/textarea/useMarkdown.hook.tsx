import { ChangeEvent, ChangeEventHandler, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

import { Icon } from '../../icon'
import { useRef } from 'react'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { AddTextSettingResults, AddTextSettings, CONTROLS } from './utils'
import { Checkbox } from '../checkbox/view'

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
        function getResult(result: AddTextSettingResults) {
          if (typeof result === 'object') {
            currentSelection.current = {
              start: result.selectionRangeStart,
              end: result.selectionRangeEnd,
            }
            return result.value
          }
          return result
        }
        if (selection.start === selection.end) {
          currentSelectionDeltaAfterChange.current = 0
          setValue((value) => getResult(settings.noSelections(value)))
        } else {
          currentSelectionDeltaAfterChange.current =
            settings.selectionDeltaAfterChange || 0
          setValue((value) => {
            const parts = {
              start: value.slice(0, selection.start),
              selection: value.slice(selection.start, selection.end),
              end: value.slice(selection.end),
            }
            const result = getResult(settings.withSelections(parts.selection))
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

  const previewArea = useMemo(
    () => (
      <ReactMarkdown
        remarkPlugins={[[gfm]]}
        components={{
          input: (props: any) => {
            return (
              <Checkbox
                key={props.key}
                label=""
                htmlProps={{ checked: props.checked, disabled: props.disabled }}
              />
            )
          },
          li: (props: any) => {
            if (props.checked !== null) {
              const { children, ...rest } = props
              return <li {...rest}>{children[0]}</li>
            }
            return <li {...props} />
          },
        }}
      >
        {value}
      </ReactMarkdown>
    ),
    [value]
  )

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
  }
}
