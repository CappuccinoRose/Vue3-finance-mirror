/**
 * 将数字格式化为货币字符串。
 * @param value 要格式化的数字。
 * @param locale 使用的区域设置 (例如 'zh-CN')。默认为 'en-US'。
 * @param currency 货币代码 (例如 'CNY')。默认为 'USD'。
 * @returns 格式化后的货币字符串。
 */
export const formatCurrency = (
  value: number | null | undefined,
  locale: string = 'en-US',
  currency: string = 'USD',
): string => {
  if (value === null || value === undefined) {
    return '-'
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value)
}

/**
 * 将日期对象或字符串格式化为可读的日期字符串。
 * @param date 要格式化的日期。
 * @param locale 使用的区域设置 (例如 'zh-CN')。默认为 'en-US'。
 * @returns 格式化后的日期字符串。
 */
export const formatDate = (
  date: string | Date | null | undefined,
  locale: string = 'en-US',
): string => {
  if (!date) {
    return '-'
  }
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj)
}
