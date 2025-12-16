// src/composables/useGeneralLedger.ts

import { computed } from 'vue'
import { useAccountStore } from '@/stores/useAccountStore'
import { useTransactionStore } from '@/stores/useTransactionStore'
import type { Account, AccountCreate, AccountUpdate } from '@/types/account'
import type { TransactionCreateForm } from '@/types/transaction'
import { ElMessage } from 'element-plus'

export function useGeneralLedger() {
  // 状态
  const accountStore = useAccountStore()
  const transactionStore = useTransactionStore()

  // 方法
  const loadAccounts = async () => {
    try {
      await accountStore.fetchAccounts()
    } catch (error) {
      ElMessage.error('加载会计科目失败')
    }
  }

  const createAccount = async (accountData: AccountCreate): Promise<Account | null> => {
    try {
      const newAccount = await accountStore.addAccount(accountData)
      ElMessage.success('科目创建成功')
      return newAccount
    } catch (error: any) {
      const errMsg = error.response?.data?.detail || '创建科目失败'
      ElMessage.error(errMsg)
      return null
    }
  }

  const updateAccount = async (
    guid: string,
    accountData: AccountUpdate,
  ): Promise<Account | null> => {
    try {
      const updatedAccount = await accountStore.editAccount(guid, accountData)
      ElMessage.success('科目更新成功')
      return updatedAccount
    } catch (error: any) {
      const errMsg = error.response?.data?.detail || '更新科目失败'
      ElMessage.error(errMsg)
      return null
    }
  }

  const loadTransactions = async () => {
    try {
      await transactionStore.fetchTransactions()
    } catch (error) {
      ElMessage.error('加载交易列表失败')
    }
  }

  // --- 简化后的 createTransaction 函数 ---
  const createTransaction = async (formData: TransactionCreateForm) => {
    try {
      const newTransaction = await transactionStore.addTransaction(formData)
      ElMessage.success('交易创建成功')
      return newTransaction
    } catch (error: any) {
      const displayMessage = transactionStore.error || error.message || '创建交易失败'

      console.error('Failed to create transaction:', error)
      ElMessage.error(displayMessage)
      throw error
    }
  }

  return {
    // 会计
    loadAccounts,
    createAccount,
    updateAccount,
    // 方法
    accounts: computed(() => accountStore.accounts),
    isLoadingAccounts: accountStore.isLoading,
    rootAccounts: computed(() => accountStore.rootAccounts),
    findAccountByGuid: accountStore.findAccountByGuid,
    //  交易
    loadTransactions,
    createTransaction,
    transactions: transactionStore.transactions,
    isLoadingTransactions: transactionStore.isLoading,
  }
}
