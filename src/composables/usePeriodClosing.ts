// src/composables/usePeriodClosing.ts

import { storeToRefs } from 'pinia'
import { usePeriodClosingStore } from '@/stores/usePeriodClosingStore'
import { ElMessage, ElMessageBox } from 'element-plus'

export function usePeriodClosing() {
  const store = usePeriodClosingStore()

  const { historyList, isExecuting, logs, currentPeriod, isCurrentPeriodClosed, isLoading } =
    storeToRefs(store)

  const handleExecuteClosing = async () => {
    try {
      await ElMessageBox.confirm(
        `您确定要执行 ${currentPeriod.value} 期间的期末结转吗？此操作不可逆！`,
        '危险操作',
        {
          confirmButtonText: '确定执行',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'el-button--danger',
        },
      )

      const periodEndDate = new Date(currentPeriod.value + '-01')
      periodEndDate.setMonth(periodEndDate.getMonth() + 1, 0)
      store.executeClosing({
        closing_type: 'income_expense',
        period_end_date: periodEndDate.toISOString().slice(0, 10),
      })
    } catch {
      ElMessage.info('已取消操作')
    }
  }

  const loadData = () => {
    store.fetchHistory()
  }

  return {
    // 状态
    historyList,
    isExecuting,
    logs,
    currentPeriod,
    isCurrentPeriodClosed,
    isLoading,

    // 方法
    loadData,
    handleExecuteClosing,
  }
}
