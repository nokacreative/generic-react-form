import { stripNonNumericValues } from '../../utils/formatters'
import { InputType } from './enums'

export type InputValueFormatter = (value: string) => any

export function formatPhoneNumber(value: string) {
  const numbersOnly = stripNonNumericValues(value, true)
  const match = numbersOnly.match(/^(\+\d{1,2})?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return match[1]
      ? `${match[1]} ${match[2]}-${match[3]}-${match[4]}`
      : `${match[2]}-${match[3]}-${match[4]}`
  } else {
    return value
  }
}

export function getFormatter(type: InputType): InputValueFormatter | undefined {
  if (type === InputType.PHONE) {
    return formatPhoneNumber
  } else if (type === InputType.NUMBER) {
    return (value: string) => stripNonNumericValues(value)
  }
  return undefined
}
