export function stripNonMoneyValues(value: string) {
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
    typeof value === 'number' ? value : parseFloat(stripNonMoneyValues(value))
  const formatted = moneyFormatter(currencyCode).format(numericValue)
  return removeSymbol ? formatted.slice(1) : formatted
}

export function stripNonNumericValues(text: string) {
  return text.replace(/\D/g, '')
}
