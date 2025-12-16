// src/stores/usePeriodClosingStore.ts

import { defineStore } from 'pinia'
import type { PeriodClosing, PeriodClosingCreate, Transaction, Split } from '@/types/period_closing'
import type { Account } from '@/types/account'
import { periodClosingApi } from '@/api/period_closing'
import { ElMessage } from 'element-plus'
import { adaptTransactionToClosing } from '@/utils/periodClosingAdapter'
import { createFallbackAccount } from '@/utils/fallbacks'

interface PeriodClosingState {
  historyList: PeriodClosing[]
  isLoading: boolean
  isExecuting: boolean
  logs: string[]
  currentPeriod: string
  isCurrentPeriodClosed: boolean
  transactionDetail: Transaction | null
}

export const usePeriodClosingStore = defineStore('periodClosing', {
  state: (): PeriodClosingState => ({
    historyList: [],
    isLoading: false,
    isExecuting: false,
    logs: [],
    currentPeriod: new Date().toISOString().slice(0, 7),
    isCurrentPeriodClosed: false,
    transactionDetail: null,
  }),

  actions: {
    async fetchHistory() {
      this.isLoading = true
      try {
        const transactions: Transaction[] = await periodClosingApi.getMulti({ limit: 50 })
        this.historyList = transactions
          .map(adaptTransactionToClosing)
          .filter((item: PeriodClosing | null): item is PeriodClosing => item !== null)
      } catch (error: any) {
        console.error('Failed to fetch history:', error)
        const errMsg = error.response?.data?.detail || '获取结转历史失败'
        ElMessage.error(errMsg)
      } finally {
        this.isLoading = false
      }
    },

    async executeClosing(payload: PeriodClosingCreate) {
      this.isExecuting = true
      this.logs = []
      try {
        const newTransaction: Transaction = await periodClosingApi.create(payload)

        const newClosing = adaptTransactionToClosing(newTransaction)
        if (newClosing) {
          this.historyList.unshift(newClosing)
        }
      } catch (error: any) {
        console.error('Failed to execute closing:', error)
        const errMsg = error.response?.data?.detail || '执行结转失败'
        ElMessage.error(errMsg)
        this.logs.push(`错误: ${errMsg}`)
      } finally {
        this.isExecuting = false
      }
    },

    async fetchTransactionDetailsWithAccounts(guid: string) {
      this.transactionDetail = null
      try {
        const transaction = await periodClosingApi.get(guid)
        if (transaction && transaction.splits) {
          const enrichedSplits = await Promise.all(
            transaction.splits.map(async (split) => {
              try {
                const account: Account = await periodClosingApi.getAccountByGuid(split.account_guid)
                const accountWithCode = { ...account, code: account.code || '' }
                return { ...split, account: accountWithCode }
              } catch (accountError) {
                console.error(
                  `Failed to fetch account for guid ${split.account_guid}:`,
                  accountError,
                )
                const fallbackAccount = createFallbackAccount(split.account_guid)
                return { ...split, account: fallbackAccount }
              }
            }),
          )
          transaction.splits = enrichedSplits
        }
        this.transactionDetail = transaction
      } catch (error: any) {
        console.error('Failed to fetch transaction details:', error)
        const errMsg = error.response?.data?.detail || '获取凭证详情失败'
        ElMessage.error(errMsg)
      }
    },
  },
})
