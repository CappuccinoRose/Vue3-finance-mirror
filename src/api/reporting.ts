// src/api/reporting.ts

import pureApiClient from './client'
import type {
  DashboardMetrics,
  CashFlowData,
  ArApData,
  IncomeExpenseData,
  BalanceSheetRequest,
  BalanceSheetResponse,
  IncomeStatementRequest,
  IncomeStatementResponse,
  CashFlowStatementRequest,
  CashFlowStatementResponse,
  TrialBalanceRequest,
  TrialBalanceResponse,
  ReportListResponse,
  ReportExportRequest,
  ReportExportResponse,
  CustomReportQuery,
  CustomReportResponse,
  PeriodList, // 导入新类型
} from '@/types/reporting'
import type { Account } from '@/types/account'

/**
 * 获取仪表盘核心指标
 */
export const getDashboardMetrics = (period?: string) =>
  pureApiClient.get<DashboardMetrics>('/reports/dashboard/metrics', { params: { period } })

/**
 * 获取现金流概览数据
 * GET /reports/dashboard/cash-flow?period=YYYY-MM
 */
export const getCashFlowOverview = (period: string) =>
  pureApiClient.get<CashFlowData>('/reports/dashboard/cash-flow', { params: { period } })

/**
 * 获取应收应付概况
 * GET /reports/dashboard/ar-ap
 */
export const getArApOverview = () => pureApiClient.get<ArApData>('/reports/dashboard/ar-ap')

/**
 * 获取收支结构数据（用于饼图）
 * GET /reports/dashboard/income-expense?period=YYYY-MM
 */
export const getIncomeExpenseData = (period: string) =>
  pureApiClient.get<IncomeExpenseData>('/reports/dashboard/income-expense', { params: { period } })

/**
 * 获取所有可查询的年月列表
 * GET /reports/periods
 */
export const getAvailablePeriods = () => pureApiClient.get<PeriodList>('/reports/periods')

/**
 * 生成资产负债表
 * POST /reports/balance-sheet
 */
export const generateBalanceSheet = (data: BalanceSheetRequest) =>
  pureApiClient.post<BalanceSheetResponse>('/reports/balance-sheet', data)

/**
 * 生成损益表
 * POST /reports/income-statement
 */
export const generateIncomeStatement = (data: IncomeStatementRequest) =>
  pureApiClient.post<IncomeStatementResponse>('/reports/income-statement', data)

/**
 * 生成现金流量表
 * POST /reports/cash-flow-statement
 */
export const generateCashFlowStatement = (data: CashFlowStatementRequest) =>
  pureApiClient.post<CashFlowStatementResponse>('/reports/cash-flow-statement', data)

/**
 * 生成试算平衡表
 * POST /reports/trial-balance
 */
export const generateTrialBalance = (data: TrialBalanceRequest) =>
  pureApiClient.post<TrialBalanceResponse>('/reports/trial-balance', data)

/**
 * 获取所有账户列表，用于自定义报表筛选
 * GET /reports/accounts
 */
export const getAccounts = () => pureApiClient.get<Account[]>('/reports/accounts')

/**
 * 生成自定义实时报表
 * POST /reports/custom
 */
export const generateCustomReport = (data: CustomReportQuery) =>
  pureApiClient.post<CustomReportResponse>('/reports/custom', data)

/**
 * 获取可用报表类型和期间列表
 * GET /reports/available-reports
 */
export const getAvailableReports = () =>
  pureApiClient.get<ReportListResponse>('/reports/available-reports')

/**
 * 导出报表
 * POST /reports/export
 */
export const exportReport = (data: ReportExportRequest) =>
  pureApiClient.post<ReportExportResponse>('/reports/export', data)
