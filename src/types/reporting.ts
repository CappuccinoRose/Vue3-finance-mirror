// src/types/reporting.ts

// --- 基础类型定义 ---
export interface DashboardMetrics {
  total_assets: number
  current_profit: number
  cash_balance: number
  total_revenue: number
}

export interface CashFlowData {
  periods: string[]
  inflows: number[]
  outflows: number[]
}

export interface ArApData {
  receivables: Array<{
    customerName: string
    invoiceId: string
    amount: number
    dueDate: string
    status: 'pending' | 'overdue' | 'paid'
  }>
  payables: Array<{
    vendorName: string
    invoiceId: string
    amount: number
    dueDate: string
    status: 'pending' | 'confirmed' | 'paid' | 'draft'
  }>
}

export interface IncomeExpenseData {
  series: Array<{
    name: string
    value: number
  }>
}

// --- 标准报表类型 ---
export interface BalanceSheetRequest {
  period: string
}

export interface BalanceSheetResponse {
  period: string
  assets: Record<string, number>
  liabilities: Record<string, number>
  equity: Record<string, number>
  total_assets: number
  total_liabilities: number
  total_equity: number
}

export interface IncomeStatementRequest {
  period: string
  comparison_period?: string | null
}

export interface IncomeStatementResponse {
  period: string
  comparison_period?: string | null
  income_items: Record<string, number>
  expense_items: Record<string, number>
  total_income: number
  total_expense: number
  net_profit: number
  comparison_net_profit?: number | null
}

export interface CashFlowStatementRequest {
  period: string
}

export interface CashFlowStatementResponse {
  period: string
  operating_activities: Record<string, number>
  investing_activities: Record<string, number>
  financing_activities: Record<string, number>
  net_cash_flow: number
}

export interface TrialBalanceRequest {
  period: string
}

export interface TrialBalanceResponse {
  period: string
  accounts: Array<{
    guid: string
    name: string
    type: string
    debit: number
    credit: number
    balance: number
  }>
  total_debits: number
  total_credits: number
  is_balanced: boolean
}

// --- 自定义报表类型 ---
export interface CustomReportQuery {
  start_date: string // YYYY-MM-DD
  end_date: string // YYYY-MM-DD
  account_guids?: string[] | null
}

export interface CustomReportLine {
  account_guid: string
  account_code?: string | null
  account_name: string
  account_type: string
  beginning_balance: number
  debit_total: number
  credit_total: number
  ending_balance: number
}

export interface CustomReportResponse {
  query: CustomReportQuery
  generated_at: string
  lines: CustomReportLine[]
  total_debit: number
  total_credit: number
}

// --- 辅助类型 ---
export interface ReportListResponse {
  available_reports: string[]
  available_periods: string[]
}

export interface ReportExportRequest {
  report_type: string
  period: string
  format: 'pdf' | 'excel' | 'csv'
}

export interface ReportExportResponse {
  download_url: string
  file_name: string
  file_size: number
  expires_at: string
}

// --- 新增类型 ---
export interface PeriodList {
  periods: string[]
}
