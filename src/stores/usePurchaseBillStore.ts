import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  PurchaseBill,
  PurchaseBillCreate,
  PurchaseBillUpdate,
  PurchaseBillSummary,
} from '@/types/purchase_bill'
import { purchaseBillApi } from '@/api/purchase_bill'

export const usePurchaseBillStore = defineStore('purchaseBill', () => {
  const purchaseBills = ref<PurchaseBillSummary[]>([])
  const currentBill = ref<PurchaseBillSummary | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const draftBills = computed(() => purchaseBills.value.filter((b) => b.status === 'draft'))
  const confirmedBills = computed(() => purchaseBills.value.filter((b) => b.status === 'confirmed'))
  const postedBills = computed(() => purchaseBills.value.filter((b) => b.status === 'posted'))
  const cancelledBills = computed(() => purchaseBills.value.filter((b) => b.status === 'cancelled'))
  const fetchBills = async (params?: { status?: string; skip?: number; limit?: number }) => {
    loading.value = true
    error.value = null
    try {
      const response = await purchaseBillApi.getPurchaseBills(params)
      purchaseBills.value = response
    } catch (err: any) {
      error.value = err.response?.data?.detail || '获取账单列表失败'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const fetchBill = async (guid: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await purchaseBillApi.getPurchaseBill(guid)
      currentBill.value = response
      return response
    } catch (err: any) {
      error.value = err.response?.data?.detail || '获取账单详情失败'
      console.error(err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createBill = async (data: PurchaseBillCreate) => {
    loading.value = true
    error.value = null
    try {
      const response = await purchaseBillApi.createPurchaseBill(data)
      purchaseBills.value.push(response)
      return response
    } catch (err: any) {
      error.value = err.response?.data?.detail || '创建账单失败'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateBill = async (guid: string, data: PurchaseBillUpdate) => {
    loading.value = true
    error.value = null
    try {
      const response = await purchaseBillApi.updatePurchaseBill(guid, data)
      const index = purchaseBills.value.findIndex((b) => b.guid === guid)
      if (index !== -1) {
        purchaseBills.value[index] = response
      }
      if (currentBill.value?.guid === guid) {
        currentBill.value = response
      }
      return response
    } catch (err: any) {
      error.value = err.response?.data?.detail || '更新账单失败'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteBill = async (guid: string) => {
    loading.value = true
    error.value = null
    try {
      await purchaseBillApi.deletePurchaseBill(guid)
      purchaseBills.value = purchaseBills.value.filter((b) => b.guid !== guid)
      if (currentBill.value?.guid === guid) {
        currentBill.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.detail || '删除账单失败'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const postBill = async (guid: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await purchaseBillApi.postPurchaseBill(guid)
      const index = purchaseBills.value.findIndex((b) => b.guid === guid)
      if (index !== -1) {
        purchaseBills.value[index] = response
      }
      if (currentBill.value?.guid === guid) {
        currentBill.value = response
      }
      return response
    } catch (err: any) {
      error.value = err.response?.data?.detail || '过账账单失败'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const cancelBill = async (guid: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await purchaseBillApi.cancelPurchaseBill(guid)
      const index = purchaseBills.value.findIndex((b) => b.guid === guid)
      if (index !== -1) {
        purchaseBills.value[index] = response
      }
      if (currentBill.value?.guid === guid) {
        currentBill.value = response
      }
      return response
    } catch (err: any) {
      error.value = err.response?.data?.detail || '取消账单失败'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    purchaseBills,
    currentBill,
    loading,
    error,
    draftBills,
    confirmedBills,
    postedBills,
    cancelledBills,
    fetchBills,
    fetchBill,
    createBill,
    updateBill,
    deleteBill,
    postBill,
    cancelBill,
  }
})
