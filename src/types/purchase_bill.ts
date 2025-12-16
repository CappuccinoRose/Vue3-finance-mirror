// src/types/purchase_bill.ts

import type { Vendor } from './vendor'

/**
 * 采购账单基础模型，包含核心业务字段。
 */
export interface PurchaseBillBase {
  vendor_guid: string
  bill_number: string
  bill_date: string
  due_date?: string
  total_amount: number
  notes?: string
  status: 'draft' | 'confirmed' | 'posted' | 'cancelled'
}

/**
 * 创建采购账单的请求模型。
 */
export interface PurchaseBillCreate extends PurchaseBillBase {}

/**
 * 更新采购账单的请求模型，所有字段均为可选。
 */
export interface PurchaseBillUpdate {
  vendor_guid?: string
  bill_number?: string
  bill_date?: string
  due_date?: string
  total_amount?: number
  notes?: string
  status?: 'draft' | 'confirmed' | 'posted' | 'cancelled'
  post_txn_guid?: string // 更新时可关联交易
}

/**
 * 完整的采购账单实体模型，用于API响应。
 */
export interface PurchaseBill extends PurchaseBillBase {
  guid: string
  post_txn_guid?: string
  created_at: string
  updated_at: string
}

/**
 * 带有关联供应商信息的采购账单摘要，用于列表展示。
 */
export interface PurchaseBillSummary extends PurchaseBill {
  vendor?: Vendor | null
}
