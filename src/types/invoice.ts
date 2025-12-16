// src/types/invoice.ts

import type { Customer } from './customer'
import type { Entry, EntryCreate } from './entry'

/**
 * 发票基础模型，包含创建和更新时共用的字段。
 */
export interface InvoiceBase {
  id: string
  owner_guid: string
  customer_guid?: string
  date_posted?: string
  date_due?: string
  notes?: string
  active: boolean
}

/**
 * 完整的发票实体模型，用于API响应。
 */
export interface Invoice extends InvoiceBase {
  guid: string
  post_txn?: string
  customer?: Customer | null
  entries: Entry[]
}

/**
 * 创建发票的请求模型。`active` 字段在创建时通常由后端处理，因此被省略。
 */
export interface InvoiceCreate extends Omit<InvoiceBase, 'active'> {
  entries: EntryCreate[]
}

/**
 * 更新发票的请求模型。所有字段都是可选的，`id` 不可更改。
 */
export interface InvoiceUpdate extends Partial<Omit<InvoiceBase, 'id'>> {}
