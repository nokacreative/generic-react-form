import { InputType } from './enums'
import { StandardInputType } from './models'
import { formatPhoneNumber } from './utils'

type Props = {
  type: StandardInputType
  defaultValue: any
}

export const ReadOnlyInput = ({ type, defaultValue }: Props) => {
  switch (type) {
    case InputType.PASSWORD:
      return Array.from({ length: defaultValue.length })
        .map(() => '*')
        .join('')
    case InputType.PHONE:
      return formatPhoneNumber(defaultValue)
    default:
      return defaultValue
  }
}
