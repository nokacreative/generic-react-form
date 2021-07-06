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
  noSelections: (fullText: string) => AddTextSettingResults
  withSelections: (selection: string) => AddTextSettingResults
  selectionDeltaAfterChange?: number
}

export function containsLinebreaks(text: string) {
  return /\r|\n/.test(text)
}

interface FormattingControl {
  icon: IconDefinition
  tooltip: string
  settings: AddTextSettings
}

/** null = spacer */
export const CONTROLS: (FormattingControl | null)[] = [
  {
    icon: faHeading,
    tooltip: 'Header',
    settings: {
      noSelections: (fullText: string) => `${fullText}### `,
      withSelections: (selection: string) => `### ${selection}`,
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
      withSelections: (selection: string) => `\`${selection}\``,
      selectionDeltaAfterChange: 1,
    },
  },
  {
    icon: faQuoteRight,
    tooltip: 'Quote',
    settings: {
      noSelections: (fullText: string) => `${fullText}\n\n>`,
      withSelections: (selection: string) => `> ${selection}`,
      selectionDeltaAfterChange: 2,
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
          const newValue = `[link](${selection})`
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
  /*{
    icon: faImage,
    tooltip: 'Image',
    settings: null,
  },*/
  {
    icon: faList,
    tooltip: 'Bulleted List',
    settings: {
      noSelections: (fullText: string) => {
        const newValue = `${fullText}\n\n- Item`
        const length = newValue.length
        return {
          value: newValue,
          selectionRangeStart: length - 4,
          selectionRangeEnd: length,
        }
      },
      withSelections: (selection: string) => {
        if (containsLinebreaks(selection)) {
          const lines = selection.split('\n')
          const newLines = lines.map((line) => `- ${line}`).join('\n')
          return `\n\n${newLines}`
        }
        return `\n\n- ${selection}`
      },
    },
  },
  {
    icon: faListOl,
    tooltip: 'Numbered List',
    settings: {
      noSelections: (fullText: string) => {
        const newValue = `${fullText}\n\n1. Item`
        const length = newValue.length
        return {
          value: newValue,
          selectionRangeStart: length - 4,
          selectionRangeEnd: length,
        }
      },
      withSelections: (selection: string) => {
        if (containsLinebreaks(selection)) {
          const lines = selection.split('\n')
          const newLines = lines.map((line, i) => `${i + 1}. ${line}`).join('\n')
          return `\n\n${newLines}`
        }
        return `\n\n1. ${selection}`
      },
    },
  },
  {
    icon: faCheckSquare,
    tooltip: 'Checklist',
    settings: {
      noSelections: (fullText: string) => {
        const newValue = `${fullText}\n\n* [ ] Item`
        const length = newValue.length
        return {
          value: newValue,
          selectionRangeStart: length - 4,
          selectionRangeEnd: length,
        }
      },
      withSelections: (selection: string) => {
        if (containsLinebreaks(selection)) {
          const lines = selection.split('\n')
          const newLines = lines.map((line) => `* [ ] ${line}`).join('\n')
          return `\n\n${newLines}`
        }
        return `* [ ] ${selection}`
      },
    },
  },
]
