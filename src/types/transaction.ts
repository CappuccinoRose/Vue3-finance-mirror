// src/types/transaction.ts
import type { SplitFormRow, SplitCreateForApi, Split } from './split'

/**
 * 交易基础模型
 */
export interface TransactionBase {
  description?: string | null
  post_date: string
  enter_date: string
}

/**
 * --- 前端表单数据模型 ---
 */
export interface TransactionCreateForm {
  description?: string | null
  post_date: string
  splits: SplitFormRow[]
}

/**
 * --- API 请求模型 ---
 */
export interface TransactionCreate extends TransactionBase {
  splits: SplitCreateForApi[]
}

/**
 * 更新交易请求模型
 */
export interface TransactionUpdate {
  description?: string | null
  post_date?: string | null
  enter_date?: string | null
}

/**
 * 交易响应模型
 */
export interface Transaction extends TransactionBase {
  guid: string
  splits: Split[]
}
