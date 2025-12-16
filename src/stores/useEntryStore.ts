import { defineStore } from 'pinia'
import { ref } from 'vue'
import { entryApi } from '@/api'
import type { Entry } from '@/types'

export const useEntryStore = defineStore('entry', () => {
  const entries = ref<Entry[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchEntriesByInvoice = async (invoiceGuid: string) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await entryApi.getByInvoiceGuid(invoiceGuid)
      entries.value = response
    } catch (err: any) {
      error.value = 'Failed to fetch entries'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  return { entries, isLoading, error, fetchEntriesByInvoice }
})
