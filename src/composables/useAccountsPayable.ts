// src/composables/useAccountsPayable.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useVendorStore } from '@/stores/useVendorStore'
import { useAccountStore } from '@/stores/useAccountStore'
import { usePurchaseBillStore } from '@/stores/usePurchaseBillStore'
import type {
  VendorCreatePayload,
  VendorUpdatePayload,
  PurchaseBillCreate,
  PurchaseBillUpdate,
} from '@/types'

export function useAccountsPayable() {
  const vendorStore = useVendorStore()
  const accountStore = useAccountStore()
  const purchaseBillStore = usePurchaseBillStore()

  // --- 供应商 状态 ---
  const {
    vendors,
    activeVendors,
    isLoading: isLoadingVendors,
    error: vendorError,
  } = storeToRefs(vendorStore)

  // --- 会计科目 状态 ---
  const { accounts, isLoading: isLoadingAccounts } = storeToRefs(accountStore)

  // --- 采购账单 状态 ---
  const {
    purchaseBills,
    currentBill,
    loading: isLoadingBills,
    error: billError,
  } = storeToRefs(purchaseBillStore)

  // --- 计算属性 ---
  const isLoading = computed(
    () => isLoadingVendors.value || isLoadingAccounts.value || isLoadingBills.value,
  )
  const error = computed(() => vendorError.value || billError.value)

  const billStatistics = computed(() => ({
    total: purchaseBills.value.length,
    draft: purchaseBillStore.draftBills.length,
    confirmed: purchaseBillStore.confirmedBills.length,
    posted: purchaseBillStore.postedBills.length,
    cancelled: purchaseBillStore.cancelledBills.length,
    totalAmount: purchaseBills.value.reduce((sum, bill) => sum + bill.total_amount, 0),
  }))

  // --- 供应商 操作 ---
  const loadVendors = async () => await vendorStore.fetchVendors()
  const getVendor = async (guid: string) => await vendorStore.getVendorById(guid)
  const addVendor = async (vendorData: VendorCreatePayload) =>
    await vendorStore.createVendor(vendorData)
  const editVendor = async (guid: string, vendorData: VendorUpdatePayload) =>
    await vendorStore.updateVendor(guid, vendorData)
  const removeVendor = async (guid: string) => await vendorStore.deleteVendor(guid)

  // --- 会计科目 操作 ---
  const loadAccounts = async () => await accountStore.fetchAccounts()

  // --- 采购账单 操作 ---
  const loadBills = async (params?: { status?: string; skip?: number; limit?: number }) => {
    await purchaseBillStore.fetchBills(params)
  }
  const getBill = async (guid: string) => await purchaseBillStore.fetchBill(guid)
  const createBill = async (data: PurchaseBillCreate) => await purchaseBillStore.createBill(data)
  const updateBill = async (guid: string, data: PurchaseBillUpdate) =>
    await purchaseBillStore.updateBill(guid, data)
  const deleteBill = async (guid: string) => await purchaseBillStore.deleteBill(guid)
  const postBill = async (guid: string) => await purchaseBillStore.postBill(guid)
  const cancelBill = async (guid: string) => await purchaseBillStore.cancelBill(guid)

  return {
    // --- 状态 ---
    vendors,
    activeVendors,
    accounts,
    allBills: purchaseBills,
    currentBill,
    isLoading,
    loading: isLoading,
    error,
    billStatistics,

    // --- 供应商 操作 ---
    loadVendors,
    getVendor,
    addVendor,
    editVendor,
    removeVendor,

    // --- 会计科目 操作 ---
    loadAccounts,

    // --- 采购账单 操作 ---
    refresh: loadBills,
    getBill,
    create: createBill,
    update: updateBill,
    remove: deleteBill,
    post: postBill,
    cancel: cancelBill,
  }
}
