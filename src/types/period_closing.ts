// src/types/period_closing.ts

import type { Split } from './split'
import type { Transaction } from './transaction'

// --- PeriodClosing 相关 ---
export enum ClosingStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface PeriodClosing {
  guid: string
  closing_type: 'income_expense' | null
  period_end_date: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  error_message: string | null
  post_transaction_guid: string | null
  created_at: string
  updated_at: string
  owner_name: string
}

export interface PeriodClosingCreate {
  closing_type: 'income_expense'
  period_end_date: string
}

export type { Split, Transaction }
