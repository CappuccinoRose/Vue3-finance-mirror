// src/stores/useReportingStore.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reportingApi } from '@/api/index'
import type {
  DashboardMetrics,
  CashFlowData,
  ArApData,
  IncomeExpenseData,
  CustomReportQuery,
  CustomReportResponse,
  BalanceSheetResponse,
  IncomeStatementResponse,
  CashFlowStatementResponse,
  TrialBalanceResponse,
} from '@/types/reporting'
import type { Account, AccountType } from '@/types/account'

// 定义API返回的账户类型
interface ApiAccount {
  id: string
  name: string
  code: string
  account_type: string | number
  balance?: number
  is_active?: boolean
  parent_id?: string
  children?: ApiAccount[]
  [key: string]: any
}

export const useReportingStore = defineStore('reporting', () => {
  const dashboardData = ref<DashboardMetrics | null>(null)
  const cashFlowData = ref<CashFlowData | null>(null)
  const arApData = ref<ArApData | null>(null)
  const incomeExpenseData = ref<IncomeExpenseData | null>(null)

  const allAccounts = ref<Account[]>([])
  const customReportResponse = ref<CustomReportResponse | null>(null)

  const balanceSheetResponse = ref<BalanceSheetResponse | null>(null)
  const incomeStatementResponse = ref<IncomeStatementResponse | null>(null)
  const cashFlowStatementResponse = ref<CashFlowStatementResponse | null>(null)
  const trialBalanceResponse = ref<TrialBalanceResponse | null>(null)

  const isLoading = ref(false)
  const hasError = ref(false)
  const errorMessage = ref<string | null>(null)

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
    hasError.value = false
    errorMessage.value = null
  }

  const setError = (message: string) => {
    isLoading.value = false
    hasError.value = true
    errorMessage.value = message
  }

  const fetchDashboardData = async (period?: string) => {
    try {
      const response = await reportingApi.getDashboardMetrics(period || '')
      dashboardData.value = response
    } catch (error: any) {
      console.error('Store: Failed to fetch dashboard metrics', error)
      const message =
        error.response?.status === 400
          ? '获取仪表盘指标失败：后端接口可能不支持日期查询，请联系后端开发人员修改 getDashboardMetrics 接口。'
          : error.message || '获取仪表盘指标失败'
      setError(message)
      throw error
    }
  }

  const fetchCashFlowData = async (period?: string) => {
    try {
      const response = await reportingApi.getCashFlowOverview(period || '')
      cashFlowData.value = response
    } catch (error: any) {
      console.error('Store: Failed to fetch cash flow data', error)
      setError(error.message || '获取现金流数据失败')
      throw error
    }
  }

  const fetchArApData = async () => {
    try {
      const response = await reportingApi.getArApOverview()
      arApData.value = response
    } catch (error: any) {
      console.error('Store: Failed to fetch AR/AP data', error)
      setError(error.message || '获取应收应付数据失败')
      throw error
    }
  }

  const fetchIncomeExpenseData = async (period?: string) => {
    try {
      const response = await reportingApi.getIncomeExpenseData(period || '')
      incomeExpenseData.value = response
    } catch (error: any) {
      console.error('Store: Failed to fetch income/expense data', error)
      setError(error.message || '获取收支结构数据失败')
      throw error
    }
  }

  const fetchAllDashboardData = async (period?: string) => {
    setLoading(true)
    try {
      await Promise.all([
        fetchDashboardData(period),
        fetchCashFlowData(period),
        fetchArApData(),
        fetchIncomeExpenseData(period),
      ])
    } catch (error) {
      console.error('Store: One or more dashboard data fetches failed.')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 递归处理子账户的辅助函数
  const processChildren = (children?: ApiAccount[]): Account[] => {
    if (!children || children.length === 0) return []
    return children.map((child) => processApiAccount(child))
  }

  // 处理单个API账户转换为Account接口的函数
  const processApiAccount = (account: ApiAccount): Account => {
    let standardizedType: AccountType = 'other'

    console.log(
      `[ReportingStore] Mapping account "${account.name}" with backend type: "${account.account_type}"`,
    )

    const backendType = String(account.account_type).toLowerCase()

    if (['asset', 'liability', 'equity'].includes(backendType)) {
      standardizedType = 'balance_sheet'
    } else if (['revenue', 'income', 'expense', 'cost'].includes(backendType)) {
      standardizedType = 'income_statement'
    } else if (backendType.includes('cash') || backendType.includes('bank')) {
      standardizedType = 'cash_flow'
    }

    // 修复：返回完整的Account对象，严格匹配Account接口
    return {
      guid: account.id, // 将API的id映射为Account接口的guid
      name: account.name,
      account_type: String(account.account_type), // 确保是string类型
      parent_guid: account.parent_id || null, // 将parent_id映射为parent_guid
      code: account.code || null,
      description: null, // API没有返回description，设为null
      hidden: false, // 添加必需属性，默认为false
      placeholder: false, // 添加必需属性，默认为false
      children: processChildren(account.children), // 递归处理子账户
      type: standardizedType, // 添加前端逻辑类型
      depth: undefined, // 可选属性，可以不设置
      hasChildren: account.children && account.children.length > 0, // 计算是否有子账户
    }
  }

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const responseFromApi = await reportingApi.getAccounts()

      // 修复：使用双重类型断言来解决类型转换问题
      const processedAccounts: Account[] = (responseFromApi as unknown as ApiAccount[]).map(
        (account: ApiAccount) => processApiAccount(account),
      )

      allAccounts.value = processedAccounts
      console.log('[ReportingStore] Fetched and processed accounts:', processedAccounts)
    } catch (error: any) {
      console.error('Store: Failed to fetch accounts', error)
      setError(error.message || '获取账户列表失败')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const generateCustomReport = async (query: CustomReportQuery) => {
    try {
      setLoading(true)
      const response = await reportingApi.generateCustomReport(query)

      customReportResponse.value = response

      console.log('[ReportingStore] generateCustomReport success, response:', response)
    } catch (error: any) {
      console.error('Store: Failed to generate custom report', error)
      setError(error.message || '生成自定义报表失败')

      customReportResponse.value = null
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const generateBalanceSheet = async (data: { period: string }) => {
    try {
      setLoading(true)
      const response = await reportingApi.generateBalanceSheet(data)
      balanceSheetResponse.value = response
    } catch (error: any) {
      setError(error.message || '生成资产负债表失败')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const generateIncomeStatement = async (data: {
    period: string
    comparison_period?: string | null
  }) => {
    try {
      setLoading(true)
      const response = await reportingApi.generateIncomeStatement(data)
      incomeStatementResponse.value = response
    } catch (error: any) {
      setError(error.message || '生成损益表失败')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const generateCashFlowStatement = async (data: { period: string }) => {
    try {
      setLoading(true)
      const response = await reportingApi.generateCashFlowStatement(data)
      cashFlowStatementResponse.value = response
    } catch (error: any) {
      setError(error.message || '生成现金流量表失败')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const generateTrialBalance = async (data: { period: string }) => {
    try {
      setLoading(true)
      const response = await reportingApi.generateTrialBalance(data)
      trialBalanceResponse.value = response
    } catch (error: any) {
      setError(error.message || '生成试算平衡表失败')
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const fetchAvailablePeriods = async () => {
    try {
      const response = await reportingApi.getAvailablePeriods()
      return response
    } catch (error: any) {
      console.error('Store: Failed to fetch available periods', error)
      setError(error.message || '获取可用年月失败')
      throw error
    }
  }

  return {
    dashboardData,
    cashFlowData,
    arApData,
    incomeExpenseData,
    allAccounts,
    customReportResponse,
    balanceSheetResponse,
    incomeStatementResponse,
    cashFlowStatementResponse,
    trialBalanceResponse,
    isLoading,
    hasError,
    errorMessage,
    fetchDashboardData,
    fetchCashFlowData,
    fetchArApData,
    fetchIncomeExpenseData,
    fetchAllDashboardData,
    fetchAccounts,
    generateCustomReport,
    generateBalanceSheet,
    generateIncomeStatement,
    generateCashFlowStatement,
    generateTrialBalance,
    fetchAvailablePeriods,
  }
})
