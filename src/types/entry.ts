// src/types/entry.ts

// --- 基础模型 ---
export interface EntryBase {
  date: string
  description: string
  action?: string | null
  account_guid: string
  quantity_num: number
  quantity_denom: number
  price: number
  discounted: boolean
}

// --- API 请求模型 ---
export interface EntryCreate extends EntryBase {
  invoice_guid: string
}

export interface EntryUpdate {
  date?: string | null
  description?: string | null
  action?: string | null
  account_guid?: string | null
  quantity_num?: number | null
  quantity_denom?: number | null
  price?: number | null
  discounted?: boolean | null
}

// --- API 响应模型 ---
import type { Invoice } from './invoice'
import type { Account } from './account'

export interface Entry extends EntryBase {
  guid: string
  invoice_guid: string
  invoice: Invoice
  account: Account
}

export interface EntryCreateForInvoiceForm extends Omit<EntryCreate, 'invoice_guid'> {}
