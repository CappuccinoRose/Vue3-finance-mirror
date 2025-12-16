import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { vendorApi } from '@/api/vendor'
import type { Vendor, VendorCreatePayload, VendorUpdatePayload } from '@/types/vendor'
import { ElMessage } from 'element-plus'

export const useVendorStore = defineStore('vendor', () => {
  const vendors = ref<Vendor[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const activeVendors = computed(() => vendors.value.filter((v) => v.active))
  const vendorById = computed(() => {
    return (guid: string) => vendors.value.find((v) => v.guid === guid)
  })

  const fetchVendors = async () => {
    isLoading.value = true
    error.value = null
    try {
      vendors.value = await vendorApi.getAll()
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || '获取供应商列表失败'
      error.value = errorMessage
      ElMessage.error(errorMessage)
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const getVendorById = async (guid: string) => {
    const existingVendor = vendorById.value(guid)
    if (existingVendor) {
      return existingVendor
    }

    isLoading.value = true
    error.value = null
    try {
      const vendor = await vendorApi.getById(guid)

      const index = vendors.value.findIndex((v) => v.guid === guid)
      if (index > -1) {
        vendors.value[index] = vendor
      } else {
        vendors.value.push(vendor)
      }
      return vendor
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || '获取供应商详情失败'
      error.value = errorMessage
      ElMessage.error(errorMessage)
      console.error(err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createVendor = async (payload: VendorCreatePayload) => {
    isLoading.value = true
    error.value = null
    try {
      const newVendor = await vendorApi.create(payload)
      vendors.value.push(newVendor)
      ElMessage.success('供应商创建成功')
      return newVendor
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || '创建供应商失败'
      error.value = errorMessage
      ElMessage.error(errorMessage)
      console.error(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateVendor = async (guid: string, payload: VendorUpdatePayload) => {
    isLoading.value = true
    error.value = null
    try {
      const updatedVendor = await vendorApi.update(guid, payload)
      const index = vendors.value.findIndex((v) => v.guid === guid)
      if (index !== -1) {
        vendors.value[index] = updatedVendor
      }
      ElMessage.success('供应商更新成功')
      return updatedVendor
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || '更新供应商失败'
      error.value = errorMessage
      ElMessage.error(errorMessage)
      console.error(err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteVendor = async (guid: string) => {
    isLoading.value = true
    error.value = null
    try {
      await vendorApi.delete(guid)
      await fetchVendors()
      ElMessage.success('供应商已禁用')
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || '删除供应商失败'
      error.value = errorMessage
      ElMessage.error(errorMessage)
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    vendors,
    isLoading,
    error,
    activeVendors,
    vendorById,
    fetchVendors,
    getVendorById,
    createVendor,
    updateVendor,
    deleteVendor,
  }
})
