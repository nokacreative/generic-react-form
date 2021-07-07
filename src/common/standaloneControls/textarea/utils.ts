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
      withSelections: (selection: string) =>
        containsLinebreaks(selection)
          ? '```\n' + selection + '`\n``'
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
          return lines.map((line) => `> ${line}  `).join('\n')
        }
        return `> ${selection}`
      },
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
        const code = '![](url)'
        const newValue = fullText ? `${fullText}\n\n${code}` : code
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
        const code = '1. Item'
        const newValue = fullText ? `${fullText}\n\n${code}` : code
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
        const code = '* [ ] Item'
        const newValue = fullText ? `${fullText}\n\n${code}` : code
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
