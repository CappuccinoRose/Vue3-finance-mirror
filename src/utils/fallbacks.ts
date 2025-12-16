// src/utils/fallbacks.ts

import type { Account } from '@/types/account'

/**
 * 创建一个用于显示的、信息缺失的 Account 对象
 * @param guid 账户的 GUID
 * @returns 一个 Account 兜底对象
 */
export const createFallbackAccount = (guid: string): Account => {
  return {
    guid,
    name: '（科目信息缺失）',
    account_type: 'UNKNOWN',
    type: 'other',
    hidden: false,
    placeholder: false,
    children: [],
    code: '',
  }
}
