import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faBold,
  faCode,
  faHeading,
  faItalic,
  faLink,
  faList,
  faListOl,
  faQuoteRight,
  faStrikethrough,
  faTable,
} from '@fortawesome/free-solid-svg-icons'
import { faCheckSquare, faImage } from '@fortawesome/free-regular-svg-icons'

export type AddTextSettingResults =
  | string
  | {
      value: string
      selectionRangeStart: number
      selectionRangeEnd: number
    }

export interface AddTextSettings {
  noSelections: (
    fullText: string,
    textIsEmpty: boolean,
    numLineBreaksAtEndOfText: number
  ) => AddTextSettingResults
  withSelections: (
    selection: string,
    textIsEmpty: boolean,
    numLineBreaksBeforeSelection: number
  ) => AddTextSettingResults
  selectionDeltaAfterChange?: number | ((selection: string) => number)
}

export function containsLinebreaks(text: string) {
  return /\r|\n/.test(text)
}

interface FormattingControl {
  icon: IconDefinition
  tooltip: string
  settings: AddTextSettings
}

function withLineBreaks(
  code: string,
  desiredNumber: number,
  textIsEmpty: boolean,
  numLineBreaksBeforeSelection: number
) {
  if (textIsEmpty) {
    return code
  }
  const numToAdd = desiredNumber - numLineBreaksBeforeSelection
  if (numToAdd <= 0) {
    return code
  }
  const linebreaks = Array.from({ length: numToAdd })
    .map(() => '\n')
    .join('')
  return `${linebreaks}${code}`
}

export const IMAGE_CONTROL_INDEX = 8

/** null = spacer */
export const CONTROLS: (FormattingControl | null)[] = [
  {
    icon: faHeading,
    tooltip: 'Header',
    settings: {
      noSelections: (fullText: string) => `${fullText}### `,
      withSelections: (selection: string) => {
        const [firstLine, ...otherLines] = selection.split('\n')
        return {
          value: `### ${firstLine}\n\n${otherLines.join('\n')}`,
          selectionRangeStart: 4,
          selectionRangeEnd: 4 + firstLine.length,
        }
      },
    },
  },
  {
    icon: faBold,
    tooltip: 'Bold',
    settings: {
      noSelections: (fullText: string) => {
        const newValue = `${fullText}**bolded text**`
        const length = newValue.length
        return {
          value: newValue,
          selectionRangeStart: length - 13,
          selectionRangeEnd: length - 2,
        }
      },
      withSelections: (selection: string) => `**${selection}**`,
      selectionDeltaAfterChange: 2,
    },
  },
  {
    icon: faItalic,
    tooltip: 'Italics',
    settings: {
      noSelections: (fullText: string) => {
        const newValue = `${fullText}_italicized text_`
        const length = newValue.length
        return {
          value: newValue,
          selectionRangeStart: length - 16,
          selectionRangeEnd: length - 1,
        }
      },
      withSelections: (selection: string) => `_${selection}_`,
      selectionDeltaAfterChange: 1,
    },
  },
  {
    icon: faStrikethrough,
    tooltip: 'Strikethrough',
    settings: {
      noSelections: (fullText: string) => {
        const newValue = `${fullText}~~strikethrough~~`
        const length = newValue.length
        return {
          value: newValue,
          selectionRangeStart: length - 15,
          selectionRangeEnd: length - 2,
        }
      },
      withSelections: (selection: string) => `~~${selection}~~`,
      selectionDeltaAfterChange: 2,
    },
  },
  null,
  {
    icon: faCode,
    tooltip: 'Code',
    settings: {
      noSelections: (fullText: string) => {
        const newValue = `${fullText}\`code\``
        const length = newValue.length
        return {
          value: newValue,
          selectionRangeStart: length - 5,
          selectionRangeEnd: length - 1,
        }
      },
      withSelections: (
        selection: string,
        textIsEmpty: boolean,
        numLineBreaksBeforeSelection: number
      ) =>
        containsLinebreaks(selection)
          ? withLineBreaks(
              '```js\n' + selection + '\n```\n\n',
              2,
              textIsEmpty,
              numLineBreaksBeforeSelection
            )
          : `\`${selection}\``,
      selectionDeltaAfterChange: (selection: string) =>
        containsLinebreaks(selection) ? 3 : 1,
    },
  },
  {
    icon: faQuoteRight,
    tooltip: 'Quote',
    settings: {
      noSelections: (fullText: string) => (fullText ? `${fullText}\n\n>` : '>'),
      withSelections: (selection: string) => {
        if (containsLinebreaks(selection)) {
          const lines = selection.split('\n')
          return {
            value: lines.map((line) => `> ${line}  `).join('\n'),
            selectionRangeStart: 0,
            selectionRangeEnd: 0,
          }
        }
        const newValue = `> ${selection}`
        return {
          value: newValue,
          selectionRangeStart: 2,
          selectionRangeEnd: newValue.length,
        }
      },
    },
  },
  {
    icon: faLink,
    tooltip: 'Link',
    settings: {
      noSelections: (fullText: string) => {
        const newValue = `${fullText}[](url)`
        const length = newValue.length
        return {
          value: newValue,
          selectionRangeStart: length - 4,
          selectionRangeEnd: length - 1,
        }
      },
      withSelections: (selection: string) => {
        if (selection.startsWith('http://') || selection.startsWith('https://')) {
          const newValue = `[text](${selection})`
          return {
            value: newValue,
            selectionRangeStart: 1,
            selectionRangeEnd: 5,
          }
        }
        const newValue = `[${selection}](url)`
        const length = newValue.length
        return {
          value: newValue,
          selectionRangeStart: length - 4,
          selectionRangeEnd: length - 1,
        }
      },
    },
  },
  {
    icon: faImage,
    tooltip: 'Image',
    settings: {
      noSelections: (fullText: string) => {
        const newValue = `${fullText}![](url)`
        const length = newValue.length
        return {
          value: newValue,
          selectionRangeStart: length - 4,
          selectionRangeEnd: length - 1,
        }
      },
      withSelections: (selection: string) => {
        if (selection.startsWith('http://') || selection.startsWith('https://')) {
          const newValue = `![text](${selection})`
          return {
            value: newValue,
            selectionRangeStart: 2,
            selectionRangeEnd: 6,
          }
        }
        const newValue = `[${selection}](url)`
        const length = newValue.length
        return {
          value: newValue,
          selectionRangeStart: length - 4,
          selectionRangeEnd: length - 1,
        }
      },
    },
  },
  null,
  {
    icon: faList,
    tooltip: 'Bulleted List',
    settings: {
      noSelections: (fullText: string) => {
        const code = '- Item'
        const newValue = fullText ? `${fullText}\n\n${code}` : code
        const length = newValue.length
        return {
          value: newValue,
          selectionRangeStart: length - 4,
          selectionRangeEnd: length,
        }
      },
      withSelections: (
        selection: string,
        textIsEmpty: boolean,
        numLineBreaksBeforeSelection: number
      ) => {
        if (containsLinebreaks(selection)) {
          const lines = selection.split('\n')
          const newLines = lines.map((line) => `- ${line}`).join('\n')
          const newValue = withLineBreaks(
            newLines,
            2,
            textIsEmpty,
            numLineBreaksBeforeSelection
          )
          return {
            value: newValue,
            selectionRangeStart: 0,
            selectionRangeEnd: newValue.length,
          }
        }
        return {
          value: `- ${selection}`,
          selectionRangeStart: 2,
          selectionRangeEnd: selection.length + 2,
        }
      },
    },
  },
  {
    icon: faListOl,
    tooltip: 'Numbered List',
    settings: {
      noSelections: (fullText: string) => {
        const code = '1. Item'
        const newValue = fullText ? `${fullText}\n\n${code}` : code
        const length = newValue.length
        return {
          value: newValue,
          selectionRangeStart: length - 4,
          selectionRangeEnd: length,
        }
      },
      withSelections: (
        selection: string,
        textIsEmpty: boolean,
        numLineBreaksBeforeSelection: number
      ) => {
        let newValue = `1. ${selection}`
        if (containsLinebreaks(selection)) {
          const lines = selection.split('\n')
          const newLines = lines.map((line, i) => `${i + 1}. ${line}`).join('\n')
          newValue = newLines
        }
        const finalNewValue = withLineBreaks(
          newValue,
          2,
          textIsEmpty,
          numLineBreaksBeforeSelection
        )
        return {
          value: finalNewValue,
          selectionRangeStart: 0,
          selectionRangeEnd: finalNewValue.length,
        }
      },
    },
  },
  {
    icon: faCheckSquare,
    tooltip: 'Checklist',
    settings: {
      noSelections: (fullText: string) => {
        const code = '* [ ] Item'
        const newValue = fullText ? `${fullText}\n\n${code}` : code
        const length = newValue.length
        return {
          value: newValue,
          selectionRangeStart: length - 4,
          selectionRangeEnd: length,
        }
      },
      withSelections: (
        selection: string,
        textIsEmpty: boolean,
        numLineBreaksBeforeSelection: number
      ) => {
        if (containsLinebreaks(selection)) {
          const lines = selection.split('\n')
          const newLines = lines.map((line) => `* [ ] ${line}`).join('\n')
          return withLineBreaks(newLines, 2, textIsEmpty, numLineBreaksBeforeSelection)
        }
        return `* [ ] ${selection}`
      },
    },
  },
  {
    icon: faTable,
    tooltip: 'Table',
    settings: {
      noSelections: (
        fullText: string,
        textIsEmpty: boolean,
        numLineBreaksAtEndOfText: number
      ) => {
        const code = withLineBreaks(TABLE_CODE, 2, textIsEmpty, numLineBreaksAtEndOfText)
        return `${fullText}${code}`
      },
      withSelections: (
        selection: string,
        textIsEmpty: boolean,
        numLineBreaksBeforeSelection: number
      ) => {
        const code = withLineBreaks(
          TABLE_CODE,
          2,
          textIsEmpty,
          numLineBreaksBeforeSelection
        )
        return `${selection}${code}`
      },
    },
  },
]

const TABLE_CODE = `| Center Aligned | Left Aligned | Right Aligned |
| -------------- | :----------- | -------------: |
| Row 1          |              |                |
| Row 2          | Code does not need good spacing! | |`

export function getNumLinebreaksAtEnd(text: string) {
  let numLinebreaksAtEnd = 0
  for (let i = text.length - 1; i >= 0; i--) {
    if (text[i] === '\n') numLinebreaksAtEnd++
    else break
  }
  return numLinebreaksAtEnd
}

export const UPLOADED_IMAGE_PREFIX = 'uploaded:'
export const ADD_UPLOADED_IMAGE_SETTINGS = (filename: string): AddTextSettings => ({
  noSelections: (fullText: string) => {
    const newValue = `${fullText}![${filename}](${UPLOADED_IMAGE_PREFIX}${filename})`
    const length = newValue.length
    return {
      value: newValue,
      selectionRangeStart: length - 4,
      selectionRangeEnd: length - 1,
    }
  },
  withSelections: (selection: string) => {
    const newValue = `[${selection}](${UPLOADED_IMAGE_PREFIX}${filename})`
    const length = newValue.length
    return {
      value: newValue,
      selectionRangeStart: length - 4,
      selectionRangeEnd: length - 1,
    }
  },
})
