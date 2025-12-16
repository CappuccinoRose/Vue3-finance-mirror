// src/types/split.ts
import type { Account } from './account'

// 前端内部使用的分录基础模型
export interface SplitBase {
  memo?: string | null
  action?: string | null
  quantity_num: number
  quantity_denom: number
  value: number
  reconcile_state?: string | null
  reconcile_date?: string | null
}

// 这个接口现在主要用于前端内部逻辑，不直接用于API请求
export interface SplitCreate extends SplitBase {
  txn_guid?: string
  account_guid: string
}

// 更新分录请求模型
export interface SplitUpdate {
  memo?: string | null
  action?: string | null
  quantity_num?: number | null
  quantity_denom?: number | null
  value?: number | null
  reconcile_state?: string | null
  reconcile_date?: string | null
}

// 分录响应模型
export interface Split extends SplitBase {
  guid: string
  txn_guid: string
  account_guid: string
  account?: Account
}

/**
 * 前端用于创建凭证时的分录行数据模型
 */
export interface SplitFormRow {
  account_guid: string
  memo: string
  debit: number
  credit: number
}

/**
 * 用于发送给后端API的创建分录模型
 */
export interface SplitCreateForApi {
  account_guid: string
  memo?: string | null
  value: number
  quantity_num: number
  quantity_denom: 1
}
