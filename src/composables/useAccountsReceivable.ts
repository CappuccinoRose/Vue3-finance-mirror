// src/composables/useAccountsReceivable.ts
import { computed } from 'vue'
import { useCustomerStore } from '@/stores/useCustomerStore'
import { invoiceApi } from '@/api/invoice'
import type { Invoice, InvoiceCreate, InvoiceUpdate } from '@/types/invoice'

export function useAccountsReceivable() {
  // 状态
  const customerStore = useCustomerStore()
  const isLoading = computed(() => customerStore.isLoading)
  const error = computed(() => customerStore.error)
  const customers = computed(() => customerStore.customers)
  const activeCustomers = computed(() => customerStore.activeCustomers)
  // 方法
  const loadCustomers = async () => {
    await customerStore.fetchCustomers()
  }

  const loadInvoices = async (params?: { skip?: number; limit?: number }): Promise<Invoice[]> => {
    try {
      const response = await invoiceApi.getAll(params)
      return response
    } catch (err) {
      console.error('Failed to load invoices:', err)
      throw err
    }
  }
  const getInvoiceById = async (guid: string): Promise<Invoice> => {
    try {
      const response = await invoiceApi.getById(guid)
      return response
    } catch (err) {
      console.error(`Failed to get invoice ${guid}:`, err)
      throw err
    }
  }
  const createInvoice = async (invoiceData: InvoiceCreate): Promise<Invoice> => {
    try {
      const response = await invoiceApi.create(invoiceData)
      return response
    } catch (err) {
      console.error('Failed to create invoice:', err)
      throw err
    }
  }
  const updateInvoice = async (guid: string, invoiceData: InvoiceUpdate): Promise<Invoice> => {
    try {
      const response = await invoiceApi.update(guid, invoiceData)
      return response
    } catch (err) {
      console.error(`Failed to update invoice ${guid}:`, err)
      throw err
    }
  }
  const deleteInvoice = async (guid: string): Promise<void> => {
    try {
      await invoiceApi.delete(guid)
    } catch (err) {
      console.error(`Failed to delete invoice ${guid}:`, err)
      throw err
    }
  }
  const sendInvoice = async (guid: string): Promise<void> => {
    try {
      await invoiceApi.send(guid)
    } catch (err) {
      console.error(`Failed to send invoice ${guid}:`, err)
      throw err
    }
  }
  const voidInvoice = async (guid: string): Promise<void> => {
    try {
      await invoiceApi.void(guid)
    } catch (err) {
      console.error(`Failed to void invoice ${guid}:`, err)
      throw err
    }
  }

  const unvoidInvoice = async (guid: string): Promise<void> => {
    try {
      await invoiceApi.unvoid(guid)
    } catch (err) {
      console.error(`Failed to unvoid invoice ${guid}:`, err)
      throw err
    }
  }

  return {
    // 状态
    customers,
    activeCustomers,
    isLoading,
    error,
    // 方法
    loadCustomers,
    loadInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    sendInvoice,
    voidInvoice,
    unvoidInvoice,
  }
}
