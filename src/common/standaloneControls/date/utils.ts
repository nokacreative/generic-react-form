import { DateValueTypes } from './models'

type AcceptedValueTypes = DateValueTypes | number | undefined

export function dateFromMaybeNumber(value: AcceptedValueTypes) {
  if (typeof value === 'number') {
    return new Date(value)
  }
  return value
}

function convertValueToNumber(value: AcceptedValueTypes) {
  if (typeof value === 'number') return value
  if (Array.isArray(value)) {
    return [value[0]?.getTime(), value[1]?.getTime()]
  }
  if (typeof value === 'object') {
    return (value as Date).getTime()
  }
  return value
}

export function datesAreEqual(a: AcceptedValueTypes, b: AcceptedValueTypes) {
  return convertValueToNumber(a) === convertValueToNumber(b)
}
