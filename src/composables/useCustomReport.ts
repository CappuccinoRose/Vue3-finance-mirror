// src/composables/useCustomReport.ts

import { computed, ref } from 'vue'
import { useReportingStore } from '@/stores/useReportingStore'
import type { CustomReportQuery, CustomReportResponse } from '@/types/reporting'

export function useCustomReport() {
  const reportingStore = useReportingStore()

  // --- 本地状态  ---
  const dateRange = ref<[string, string] | []>([])
  const selectedAccountGuids = ref<string[]>([])

  // --- 计算属性 ---
  const accounts = computed(() => reportingStore.allAccounts)
  const reportData = computed(() => reportingStore.customReportResponse)
  const isLoading = computed(() => reportingStore.isLoading)
  const hasError = computed(() => reportingStore.hasError)
  const errorMessage = computed(() => reportingStore.errorMessage)

  // --- 方法 ---

  const loadAccounts = async () => {
    if (accounts.value.length > 0) {
      return
    }
    await reportingStore.fetchAccounts()
  }

  const generateReport = async () => {
    if (dateRange.value.length !== 2) {
      console.error('请选择完整的日期范围')
      return
    }

    const [startDate, endDate] = dateRange.value

    const query: CustomReportQuery = {
      start_date: startDate,
      end_date: endDate,
      account_guids: selectedAccountGuids.value.length > 0 ? selectedAccountGuids.value : undefined,
    }

    await reportingStore.generateCustomReport(query)
  }

  const resetFilters = () => {
    dateRange.value = []
    selectedAccountGuids.value = []
  }

  return {
    // 状态
    dateRange,
    selectedAccountGuids,
    accounts,
    reportData,
    isLoading,
    hasError,
    errorMessage,
    // 方法
    loadAccounts,
    generateReport,
    resetFilters,
  }
}
