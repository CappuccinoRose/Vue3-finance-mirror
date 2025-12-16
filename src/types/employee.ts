// src/types/employee.ts

// --- 员工管理相关 ---
export interface Employee {
  guid: string
  username: string
  id: string | null
  language: string | null
  acl: string | null
  active: boolean
}

export interface EmployeeCreatePayload {
  username: string
  password: string
  id?: string
  language?: string
  acl?: string
  active?: boolean
}

export interface EmployeeUpdatePayload {
  username?: string
  password?: string
  id?: string
  language?: string
  acl?: string
  active?: boolean
}

// --- 费用报销相关 ---
export type ExpenseReportStatus = 'SUBMITTED' | 'APPROVED' | 'REJECTED'

export interface ExpenseEntry {
  category: string
  description: string
  amount: number
  receipt_url?: string
}

export interface ExpenseReport {
  guid: string
  description: string
  total_amount: number
  employee_guid: string
  status: ExpenseReportStatus
  submitted_at?: string
  reviewed_at?: string
  reviewer_guid?: string
  notes?: string
  entries: ExpenseEntry[]
}

export interface ExpenseReportCreatePayload {
  description: string
  entries: Omit<ExpenseEntry, 'receipt_url'>[]
}

export interface ExpenseReportApprovalPayload {
  status: 'APPROVED' | 'REJECTED'
  notes?: string
}
