// src/stores/useCustomerStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { customerApi } from '@/api/customer' // 假设你的API路径正确
import type { Customer, CustomerCreate, CustomerUpdate } from '@/types/customer' // 假设你的类型路径正确
import { ElMessage } from 'element-plus'

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<Customer[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  const filteredCustomers = computed(() => {
    let list = customers.value

    list = list.filter((c) => c.active)

    if (searchQuery.value.trim()) {
      const lowerCaseQuery = searchQuery.value.toLowerCase()
      list = list.filter(
        (c) =>
          (c.name.toLowerCase().includes(lowerCaseQuery) ||
            c.id?.toLowerCase().includes(lowerCaseQuery)) ??
          '',
      )
    }

    return list
  })

  const activeCustomers = computed(() => filteredCustomers.value)

  const fetchCustomers = async () => {
    isLoading.value = true
    error.value = null
    try {
      customers.value = await customerApi.getAll()
    } catch (err: any) {
      const errorMessage = err?.message || '获取客户列表失败'
      error.value = errorMessage
      ElMessage.error(errorMessage)
      console.error('Failed to fetch customers:', err)
    } finally {
      isLoading.value = false
    }
  }

  const createCustomer = async (data: CustomerCreate) => {
    isLoading.value = true
    try {
      const newCustomer = await customerApi.create(data)
      customers.value.push(newCustomer)
      ElMessage.success('客户创建成功')
      return newCustomer
    } catch (err: any) {
      const errorMessage = err?.message || '创建客户失败'
      ElMessage.error(errorMessage)
      console.error('Failed to create customer:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateCustomer = async (guid: string, data: CustomerUpdate) => {
    isLoading.value = true
    try {
      const updatedCustomer = await customerApi.update(guid, data)
      const index = customers.value.findIndex((c) => c.guid === guid)
      if (index > -1) {
        customers.value[index] = updatedCustomer
      }
      ElMessage.success('客户更新成功')
      return updatedCustomer
    } catch (err: any) {
      const errorMessage = err?.message || '更新客户失败'
      ElMessage.error(errorMessage)
      console.error('Failed to update customer:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
  const deleteCustomer = async (guid: string) => {
    isLoading.value = true
    try {
      await customerApi.delete(guid)
      const customerToDelete = customers.value.find((c) => c.guid === guid)
      if (customerToDelete) {
        customerToDelete.active = false
      }
      ElMessage.success('客户已禁用')
    } catch (err: any) {
      const errorMessage = err?.message || '禁用客户失败'
      ElMessage.error(errorMessage)
      console.error('Failed to delete customer:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  return {
    customers,
    isLoading,
    error,
    searchQuery,
    filteredCustomers,
    activeCustomers,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    setSearchQuery,
  }
})
