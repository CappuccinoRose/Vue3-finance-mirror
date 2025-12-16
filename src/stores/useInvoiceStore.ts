import { defineStore } from 'pinia'
import { ref } from 'vue'
import { invoiceApi } from '@/api'
import type { Invoice, InvoiceCreate } from '@/types/invoice'

export const useInvoiceStore = defineStore('invoice', () => {
  const invoices = ref<Invoice[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchInvoices = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await invoiceApi.getAll()
      invoices.value = response
    } catch (err: any) {
      error.value = '获取失败'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const createInvoice = async (payload: InvoiceCreate) => {
    try {
      const response = await invoiceApi.create(payload)
      invoices.value.unshift(response)
    } catch (err: any) {
      error.value = '创建失败'
      console.error(err)
      throw err
    }
  }

  return { invoices, isLoading, error, fetchInvoices, createInvoice }
})
