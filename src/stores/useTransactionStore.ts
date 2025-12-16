// src/stores/useTransactionStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  Transaction,
  TransactionCreateForm,
  TransactionCreate,
  SplitFormRow,
  SplitCreateForApi,
} from '@/types'
import * as transactionApi from '@/api/transaction'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<Transaction[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const transformSplitsForApi = (formRows: SplitFormRow[]): SplitCreateForApi[] => {
    return formRows
      .filter((row) => row.account_guid && (row.debit > 0 || row.credit > 0))
      .map((row) => {
        const value = row.credit - row.debit
        return {
          account_guid: row.account_guid,
          memo: row.memo,
          value: value,
          quantity_num: 0,
          quantity_denom: 1,
        }
      })
  }

  const prepareTransactionPayload = (formData: TransactionCreateForm): TransactionCreate => {
    // 过滤出有效的分录行（有账户且有金额）
    const validSplits = formData.splits.filter(
      (row) => row.account_guid && (row.debit > 0 || row.credit > 0),
    )

    // 业务逻辑检查：一个凭证至少需要两条有效的分录
    if (validSplits.length < 2) {
      throw new Error('一个有效的凭证至少需要两条分录。')
    }

    // 业务逻辑检查：所有分录不能指向同一个账户
    const uniqueAccountGuids = new Set(validSplits.map((s) => s.account_guid))
    if (uniqueAccountGuids.size < 2) {
      throw new Error('借贷双方不能是同一个账户。')
    }

    return {
      description: formData.description,
      post_date: new Date(formData.post_date).toISOString(),
      enter_date: new Date().toISOString(),
      splits: transformSplitsForApi(formData.splits),
    }
  }

  const fetchTransactions = async (skip: number = 0, limit: number = 100) => {
    isLoading.value = true
    error.value = null
    try {
      const fetchedTransactions = await transactionApi.getTransactions(skip, limit)
      transactions.value = fetchedTransactions
    } catch (err: any) {
      error.value = err.message || '获取交易列表失败'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const addTransaction = async (formData: TransactionCreateForm) => {
    isLoading.value = true
    error.value = null
    try {
      const payload: TransactionCreate = prepareTransactionPayload(formData)
      const newTransaction = await transactionApi.createTransaction(payload)
      transactions.value.unshift(newTransaction)
      return newTransaction
    } catch (err: any) {
      const errMsg = err.message || err.response?.data?.detail?.[0]?.msg || '创建凭证失败'
      error.value = errMsg
      console.error(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    addTransaction,
  }
})
