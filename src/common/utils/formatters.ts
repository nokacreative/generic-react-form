export function stripNonFloatValues(value: string) {
  const match = value.match(/\d+\.?\d*/g)
  if (match) {
    return match.join('')
  }
  return ''
}

const moneyFormatter = (currencyCode?: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode || 'USD',
    minimumFractionDigits: 2,
  })

export function formatMoney(
  value: number | string,
  currencyCode?: string,
  removeSymbol = true
) {
  const numericValue =
    typeof value === 'number' ? value : parseFloat(stripNonFloatValues(value))
  const formatted = moneyFormatter(currencyCode).format(numericValue)
  return removeSymbol ? formatted.slice(1) : formatted
}

export function stripNonNumericValues(text: string, phoneMode?: boolean) {
  return phoneMode ? text.replace(/[^\d\+]/g, '') : text.replace(/\D/g, '')
}
