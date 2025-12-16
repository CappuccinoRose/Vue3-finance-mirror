// src/utils/validate.ts
import { ACCOUNT_TYPES } from './constants'

/**
 * 验证会计科目类型
 * @param value 科目类型值
 * @returns 验证结果
 */
export const validateAccountType = (value: string): boolean => {
  return Object.values(ACCOUNT_TYPES).includes(value as any)
}

/**
 * 验证金额（必须为非负数）
 * @param value 金额字符串
 * @returns 验证结果
 */
export const validateAmount = (value: string | number): boolean => {
  const num = Number(value)
  return !isNaN(num) && num >= 0
}

/**
 * 验证借贷平衡
 * @param splits 分录行数组
 * @returns 验证结果
 */
export const validateBalance = (splits: any[]): boolean => {
  if (!splits || splits.length === 0) {
    return false
  }
  const totalDebit = splits
    .filter((s) => s.direction === 'DEBIT')
    .reduce((sum, s) => sum + Number(s.amount || 0), 0)
  const totalCredit = splits
    .filter((s) => s.direction === 'CREDIT')
    .reduce((sum, s) => sum + Number(s.amount || 0), 0)

  return Math.abs(totalDebit - totalCredit) < 0.01
}

/**
 * 通用验证规则集合（可用于 vee-validate）
 */
export const validationRules = {
  required: (value: any) => {
    if (Array.isArray(value)) return !!value.length
    return !!value || value === 0
  },
  positiveNumber: (value: string | number) => {
    const num = Number(value)
    return (!isNaN(num) && num > 0) || '必须为正数'
  },
  nonNegativeNumber: (value: string | number) => {
    const num = Number(value)
    return (!isNaN(num) && num >= 0) || '必须为非负数'
  },
  accountType: (value: string) => {
    return validateAccountType(value) || '无效的科目类型'
  },
  username: (value: string) => {
    return /^[a-zA-Z0-9_]{3,20}$/.test(value) || '用户名只能包含字母、数字和下划线,长度3-20位'
  },
  password: (value: string) => {
    return value.length >= 6 || '密码长度至少6位'
  },
  email: (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || '请输入有效的邮箱地址'
  },
}
