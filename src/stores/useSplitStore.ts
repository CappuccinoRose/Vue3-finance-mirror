import { defineStore } from 'pinia'
import { ref } from 'vue'
import { splitApi } from '@/api'
import type { Split } from '@/types'

export const useSplitStore = defineStore('split', () => {
  const splits = ref<Split[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchSplitsByTransaction = async (txnGuid: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await splitApi.getByTransactionGuid(txnGuid)
      splits.value = response
    } catch (err: any) {
      error.value = 'Failed to fetch splits'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  return { splits, isLoading, error, fetchSplitsByTransaction }
})
