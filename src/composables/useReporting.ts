// src/composables/useReporting.ts

import { useReportingStore } from '@/stores/useReportingStore'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import type { DashboardMetrics, CashFlowData, ArApData, IncomeExpenseData } from '@/types/reporting'

// --- 模拟数据 (在 API 失败时作为后备) ---
const mockDashboardMetrics: DashboardMetrics = {
  total_assets: 1520000,
  current_profit: 128500,
  cash_balance: 485000,
  total_revenue: 865000,
}

const mockCashFlowData: CashFlowData = {
  periods: ['2023-10', '2023-11', '2023-12', '2024-01', '2024-02'],
  inflows: [80000, 95000, 860000, 620000, 95000],
  outflows: [120000, 110000, 121500, 203000, 28500],
}

const mockArApData: ArApData = {
  receivables: [
    {
      customerName: '客户D零售',
      invoiceId: 'INV20240101',
      amount: 120000,
      dueDate: '2024-02-15',
      status: 'pending',
    },
    {
      customerName: '客户E金融',
      invoiceId: 'INV20240102',
      amount: 80000,
      dueDate: '2024-02-20',
      status: 'pending',
    },
    {
      customerName: '客户A公司',
      invoiceId: 'INV20240201',
      amount: 15000,
      dueDate: '2024-02-21',
      status: 'pending',
    },
  ],
  payables: [
    {
      vendorName: 'X硬件供应商',
      invoiceId: 'PB2024021001',
      amount: 75000,
      dueDate: '2024-03-10',
      status: 'confirmed',
    },
    {
      vendorName: 'V人力资源',
      invoiceId: 'PB2024021201',
      amount: 30000,
      dueDate: '2024-02-27',
      status: 'confirmed',
    },
    {
      vendorName: 'S市场推广',
      invoiceId: 'PB2024022501',
      amount: 35000,
      dueDate: '2024-03-25',
      status: 'draft',
    },
  ],
}

const mockIncomeExpenseData: IncomeExpenseData = {
  series: [
    { name: '主营业务收入', value: 865000 },
    { name: '主营业务成本', value: 217000 },
    { name: '管理费用', value: 53500 },
    { name: '销售费用', value: 38000 },
  ],
}

export function useReporting() {
  const reportingStore = useReportingStore()
  const {
    dashboardData,
    cashFlowData: _cashFlowData,
    arApData: _arApData,
    incomeExpenseData: _incomeExpenseData,
    isLoading,
    hasError,
    errorMessage,
  } = storeToRefs(reportingStore)

  // 状态
  const availablePeriods = ref<string[]>(['2023-12'])
  const selectedPeriod = ref<string>('2023-12')

  const dashboardMetrics = computed(() => dashboardData.value || mockDashboardMetrics)
  const cashFlowData = computed(() => _cashFlowData.value || mockCashFlowData)
  const arApData = computed(() => _arApData.value || mockArApData)
  const incomeExpenseData = computed(() => _incomeExpenseData.value || mockIncomeExpenseData)

  const fetchAvailablePeriods = async () => {
    try {
      const response = await reportingStore.fetchAvailablePeriods()
      const fetchedPeriods = response.periods || []

      if (fetchedPeriods.length > 0) {
        availablePeriods.value = fetchedPeriods
        if (!fetchedPeriods.includes(selectedPeriod.value)) {
          selectedPeriod.value = fetchedPeriods[0]!
        }
      } else {
        console.warn('API returned an empty list of periods. Keeping default values.')
      }
    } catch (error) {
      console.error('Failed to fetch available periods:', error)
      ElMessage.warning('无法获取可用时间列表，请检查网络或联系管理员。')
    }
  }

  const fetchCashFlowData = async (period?: string): Promise<CashFlowData | null> => {
    try {
      await reportingStore.fetchCashFlowData(period)
      return _cashFlowData.value
    } catch (error) {
      console.error('获取现金流数据失败:', error)
      ElMessage.error('获取现金流数据失败')
      return null
    }
  }

  const fetchIncomeExpenseData = async (period?: string): Promise<IncomeExpenseData | null> => {
    try {
      await reportingStore.fetchIncomeExpenseData(period)
      return _incomeExpenseData.value
    } catch (error) {
      console.error('获取收支结构数据失败:', error)
      ElMessage.error('获取收支结构数据失败')
      return null
    }
  }

  const fetchAllDashboardData = async (period?: string): Promise<boolean> => {
    try {
      await reportingStore.fetchAllDashboardData(period)
      return true
    } catch (error) {
      console.error('批量获取仪表盘数据失败:', error)
      ElMessage.error('刷新仪表盘数据失败')
      return false
    }
  }

  const onPeriodChange = async (newPeriod: string) => {
    selectedPeriod.value = newPeriod
    await fetchAllDashboardData(newPeriod)
  }

  const formatCurrency = (amount: number | string | null | undefined): string => {
    if (amount === null || amount === undefined) return '¥0.00'
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(numAmount)) return '¥0.00'

    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount)
  }

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`
  }

  const formatDate = (date: string | null): string => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('zh-CN')
  }

  return {
    // 状态
    dashboardMetrics,
    cashFlowData,
    arApData,
    incomeExpenseData,
    isLoading,
    hasError,
    errorMessage,
    // 时间选择相关状态
    availablePeriods,
    selectedPeriod,

    // 数据获取方法
    fetchAvailablePeriods,
    fetchCashFlowData,
    fetchIncomeExpenseData,
    fetchAllDashboardData,
    // 时间变化处理方法
    onPeriodChange,

    // 工具函数
    formatCurrency,
    formatPercentage,
    formatDate,
  }
}
