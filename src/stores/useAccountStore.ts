// src/stores/useAccountStore.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Account, AccountCreate, AccountUpdate, AccountType } from '@/types/account'
import * as accountApi from '@/api/account'

export const useAccountStore = defineStore('account', () => {
  // State
  const accounts = ref<Account[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const rootAccounts = computed(() => accounts.value.filter((acc) => !acc.parent_guid))

  const findAccountByGuid = (guid: string): Account | undefined => {
    const findInTree = (items: Account[]): Account | undefined => {
      for (const item of items) {
        if (item.guid === guid) {
          return item
        }
        if (item.children && item.children.length > 0) {
          const found = findInTree(item.children)
          if (found) return found
        }
      }
      return undefined
    }
    return findInTree(accounts.value)
  }

  // Actions
  const fetchAccounts = async () => {
    isLoading.value = true
    error.value = null
    try {
      const fetchedTree = await fetchAccountTreeRecursive()
      accounts.value = fetchedTree
    } catch (err: any) {
      error.value = err.message || '获取科目列表失败'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchAccountTreeRecursive = async (parent_guid?: string | null): Promise<Account[]> => {
    const currentLevelAccounts = await accountApi.getAccounts(parent_guid)

    if (!currentLevelAccounts || currentLevelAccounts.length === 0) {
      return []
    }

    for (const account of currentLevelAccounts) {
      let standardizedType: AccountType = 'other'
      const backendType = account.account_type as string
      if (
        account.name.includes('现金') ||
        account.name.includes('银行') ||
        account.name.includes('存款')
      ) {
        standardizedType = 'cash_flow'
      } else if (!backendType) {
        standardizedType = 'other'
      } else {
        switch (backendType.toUpperCase()) {
          case 'ASSET':
          case 'LIABILITY':
          case 'EQUITY':
            standardizedType = 'balance_sheet'
            break
          case 'INCOME':
          case 'EXPENSE':
            standardizedType = 'income_statement'
            break
          case 'ROOT':
          default:
            standardizedType = 'other'
            break
        }
      }

      account.type = standardizedType
      const children = await fetchAccountTreeRecursive(account.guid)
      account.children = children
    }
    return currentLevelAccounts
  }
  const addAccount = async (accountData: AccountCreate): Promise<Account> => {
    isLoading.value = true
    error.value = null
    try {
      const newAccountFromApi = await accountApi.createAccount(accountData)
      await fetchAccounts()
      const accountInStore = findAccountByGuid(newAccountFromApi.guid)
      if (!accountInStore) {
        throw new Error('科目创建成功，但在本地数据中未找到，请刷新页面。')
      }
      return accountInStore
    } catch (err: any) {
      error.value = err.message || '创建科目失败'
      console.error(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const editAccount = async (guid: string, accountData: AccountUpdate): Promise<Account> => {
    isLoading.value = true
    error.value = null
    try {
      const updatedAccountFromApi = await accountApi.updateAccount(guid, accountData)
      await fetchAccounts()
      const accountInStore = findAccountByGuid(guid)
      if (!accountInStore) {
        throw new Error('科目更新成功，但在本地数据中未找到，请刷新页面。')
      }
      return accountInStore
    } catch (err: any) {
      error.value = err.message || '更新科目失败'
      console.error(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    accounts,
    isLoading,
    error,
    rootAccounts,
    findAccountByGuid,
    fetchAccounts,
    addAccount,
    editAccount,
  }
})
