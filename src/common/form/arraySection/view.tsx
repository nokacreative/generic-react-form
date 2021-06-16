import React, { useCallback, useEffect, useState } from 'react'
import { get } from 'lodash'

import './styles.scss'

import { ArrayFormSectionConfig } from '../common/models'
import { SaveControlValueToState } from '../controls'
import { FormActionType } from '../main/enums'
import { GeneralIcons, Icon, TooltipLabelMode } from '../../icon'
import { useEntryReorder } from './useReorder.hook'

type Props<T> = {
  sectionConfig: ArrayFormSectionConfig<T>
  data: T
  renderControls: (arrayEntryIndex?: number) => JSX.Element[]
  saveValueToState: SaveControlValueToState<T>
  isFormReadOnly?: boolean
}

export function FormArraySection<T>({ sectionConfig, ...props }: Props<T>) {
  const entries = get(props.data, sectionConfig.parentPropertyPath) as any[]
  const isReadOnly = props.isFormReadOnly || sectionConfig.isReadOnly

  const onEntryReordered = useCallback(
    (fromIndex: number, toIndex: number) => {
      const entryToMove = entries[fromIndex]
      const entriesWithItemRemoved = [
        ...entries.slice(0, fromIndex),
        ...entries.slice(fromIndex + 1),
      ]
      const entriesWithItemAddedToNewIndex = [
        ...entriesWithItemRemoved.slice(0, toIndex),
        entryToMove,
        ...entriesWithItemRemoved.slice(toIndex),
      ]
      props.saveValueToState(
        sectionConfig.parentPropertyPath,
        entriesWithItemAddedToNewIndex
      )
    },
    [entries]
  )

  const { reorderProps, dropZones } = useEntryReorder(
    !isReadOnly && !!sectionConfig.allowReordering,
    entries,
    onEntryReordered
  )

  const [removedEntries, setRemovedEntries] = useState<any[]>([])

  function addEntry() {
    props.saveValueToState(
      sectionConfig.parentPropertyPath,
      sectionConfig.blankValues,
      FormActionType.ADD_ARRAY_VALUE,
      true
    )
  }

  function removeEntry(index: number, entry: any) {
    if (entry !== sectionConfig.blankValues) {
      setRemovedEntries([...removedEntries, entry])
    }
    props.saveValueToState(
      sectionConfig.parentPropertyPath,
      index,
      FormActionType.REMOVE_ARRAY_INDEX
    )
  }

  function restoreLastRemovedEntry() {
    const lastRemovedEntry = removedEntries[removedEntries.length - 1]
    props.saveValueToState(
      sectionConfig.parentPropertyPath,
      lastRemovedEntry,
      FormActionType.ADD_ARRAY_VALUE
    )
    setRemovedEntries(removedEntries.slice(0, -1))
  }

  useEffect(() => {
    if ((sectionConfig.addEntryWhenEmpty, entries.length === 0)) {
      addEntry()
    }
  }, [sectionConfig.addEntryWhenEmpty, entries.length])

  return (
    <div className="control-array-section">
      {entries.map((e: any, i: number) => (
        <React.Fragment key={`${sectionConfig.parentPropertyPath}-entry-${i}`}>
          {dropZones && dropZones[i]}
          <div
            className="control-array-section-entry"
            {...(!isReadOnly && sectionConfig.allowReordering ? reorderProps[i].row : {})}
          >
            <div className="header">
              <div>
                {!isReadOnly && sectionConfig.allowReordering && (
                  <span
                    className="control-array-move-indicator"
                    {...reorderProps[i].indicator}
                    title={sectionConfig.messageOverrides?.reorderEntry || 'Reorder'}
                  >
                    <Icon icon={GeneralIcons.Move} />
                    <Icon icon={GeneralIcons.Move} />
                  </span>
                )}
                <span>
                  {sectionConfig.itemName || 'Entry'} #{i + 1}
                </span>
              </div>
              {!isReadOnly && (
                <Icon
                  icon={GeneralIcons.Remove}
                  tooltip={sectionConfig.messageOverrides?.removeEntry || 'Remove Entry'}
                  onClick={() => removeEntry(i, e)}
                  tooltipAsLabel={TooltipLabelMode.ON_HOVER}
                />
              )}
            </div>
            <div className="main">{props.renderControls(i)}</div>
          </div>
        </React.Fragment>
      ))}
      {dropZones && dropZones[dropZones.length - 1]}
      {!isReadOnly && (
        <>
          <Icon
            icon={GeneralIcons.Add}
            tooltip={sectionConfig.messageOverrides?.addEntry || 'Add Entry'}
            onClick={() => addEntry()}
            tooltipAsLabel={TooltipLabelMode.ALWAYS}
          />
          {removedEntries.length > 0 && (
            <Icon
              icon={GeneralIcons.Redo}
              tooltip={
                sectionConfig.messageOverrides?.restoreEntry || 'Restore Last Entry'
              }
              onClick={restoreLastRemovedEntry}
              tooltipAsLabel={TooltipLabelMode.ALWAYS}
              extraClassName="control-array-restore-entry-button"
            />
          )}
        </>
      )}
    </div>
  )
}
