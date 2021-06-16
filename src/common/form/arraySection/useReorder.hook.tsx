import React, { useCallback, useEffect, useRef, useState } from 'react'

export interface ReorderProps {
  indicator: {}
  row: {}
}

export function useEntryReorder(
  isEnabled: boolean,
  entries: any[],
  onReorder: (fromIndex: number, toIndex: number) => void
) {
  const [currDraggingRowIndex, setCurrDraggingRowIndex] = useState<number>(-1)
  const [currDraggingPos, setCurrDraggingPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const currDraggingElem = useRef<{ width: number; height: number } | undefined>()
  const targetDropZoneIndex = useRef<number | undefined>()
  const targetDropZoneIsLastElem = useRef<boolean>(false)

  const onDocumentMouseMove = useCallback((event: MouseEvent) => {
    if (currDraggingElem.current) {
      setCurrDraggingPos({ x: event.pageX, y: event.pageY })
    }
  }, [])

  const onDocumentMouseUp = useCallback(
    (
      currDraggingRowIndex: number,
      onReorder: (fromIndex: number, toIndex: number) => void
    ) => {
      return () => {
        if (currDraggingElem.current) {
          document
            .querySelector('.control-array-section-entry.dragging')
            ?.classList.remove('dragging')
          currDraggingElem.current = undefined

          if (targetDropZoneIndex.current !== undefined) {
            const fromIndex = currDraggingRowIndex
            const toIndex = targetDropZoneIndex.current
            const properToIndex = targetDropZoneIsLastElem.current
              ? toIndex
              : fromIndex < toIndex
              ? toIndex - 1
              : toIndex
            onReorder(fromIndex, properToIndex)
            targetDropZoneIndex.current = undefined
            targetDropZoneIsLastElem.current = false
          }

          setCurrDraggingRowIndex(-1)
        }
      }
    },
    []
  )

  useEffect(() => {
    const mouseUpFunc = onDocumentMouseUp(currDraggingRowIndex, onReorder)
    document.addEventListener('mousemove', onDocumentMouseMove)
    document.addEventListener('mouseup', mouseUpFunc)
    return () => {
      document.removeEventListener('mousemove', onDocumentMouseMove)
      document.removeEventListener('mouseup', mouseUpFunc)
    }
  }, [isEnabled, currDraggingRowIndex, onReorder])

  function getMoveIndicatorProps(physicalRowIndex: number) {
    return {
      draggable: true,
      onMouseDown: () => setCurrDraggingRowIndex(physicalRowIndex),
    }
  }

  function getEntryProps(physicalRowIndex: number) {
    return {
      onDragStart: (event: React.DragEvent<HTMLDivElement>) => {
        currDraggingElem.current = {
          width: event.currentTarget.offsetWidth,
          height: event.currentTarget.offsetHeight,
        }
        event.currentTarget.classList.add('dragging')
        event.stopPropagation()
      },
      style:
        currDraggingRowIndex === physicalRowIndex
          ? {
              top: currDraggingPos.y,
              left: currDraggingPos.x,
              width: currDraggingElem.current?.width,
            }
          : undefined,
    }
  }

  function getDropZoneDragDropProps(physicalRowIndex: number, isLastElem: boolean) {
    const belongsToCurrDraggingElement = currDraggingRowIndex === physicalRowIndex
    const classNames = ['array-entry-drop-zone']
    if (belongsToCurrDraggingElement) {
      classNames.push('placeholder')
      if (currDraggingElem.current) {
        classNames.push('active')
      }
    }
    return {
      onMouseEnter: () => {
        if (belongsToCurrDraggingElement || !currDraggingElem.current) return
        targetDropZoneIndex.current = physicalRowIndex
        if (isLastElem) {
          targetDropZoneIsLastElem.current = true
        }
      },
      style:
        belongsToCurrDraggingElement && currDraggingElem.current
          ? {
              height: currDraggingElem.current.height,
            }
          : undefined,
      className: classNames.join(' '),
    }
  }

  const reorderProps: ReorderProps[] = React.useMemo(
    () =>
      isEnabled
        ? entries.map((_, i: number) => ({
            indicator: getMoveIndicatorProps(i),
            row: getEntryProps(i),
          }))
        : [],
    [entries, currDraggingRowIndex, currDraggingPos, isEnabled]
  )

  const dropZones = React.useMemo(() => {
    if (!isEnabled || currDraggingRowIndex === -1) {
      return undefined
    }
    const zones = entries.map((_, i) => {
      return i === currDraggingRowIndex + 1 ? null : (
        <div key={`array-entry-drop-zone-${i}`} {...getDropZoneDragDropProps(i, false)} />
      )
    })
    const lastIndex = entries.length - 1
    if (currDraggingRowIndex === lastIndex) {
      return [...zones, null]
    }
    return [
      ...zones,
      <div
        key="array-entry-drop-zone-last"
        {...getDropZoneDragDropProps(lastIndex, true)}
      />,
    ]
  }, [isEnabled, entries, currDraggingRowIndex, currDraggingElem.current])

  return { reorderProps, dropZones }
}
