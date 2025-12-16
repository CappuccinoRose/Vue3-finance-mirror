<template>
  <div class="customer-management-view">
    <h1>客户管理</h1>
    <!-- 控制面板 -->
    <CustomerControlPanel @search="handleSearch" @create-new="handleCreate" />

    <!-- 数据表格 -->
    <CustomerTable :customers="customerStore.filteredCustomers" :is-loading="customerStore.isLoading" @edit="handleEdit"
      @delete="handleDelete" />

    <!-- 表单对话框 -->
    <CustomerForm v-model="isFormVisible" :customer="currentCustomer" @submit="handleFormSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCustomerStore } from '@/stores/useCustomerStore'
import type { Customer } from '@/types/customer'
import CustomerControlPanel from '@/components/customer/CustomerControlPanel.vue'
import CustomerTable from '@/components/customer/CustomerTable.vue'
import CustomerForm from '@/components/forms/CustomerForm.vue'

const customerStore = useCustomerStore()

const isFormVisible = ref(false)
const currentCustomer = ref<Customer | null>(null)

onMounted(() => {
  customerStore.fetchCustomers()
})

const handleSearch = (query: string) => {
  customerStore.setSearchQuery(query)
}

const handleCreate = () => {
  currentCustomer.value = null
  isFormVisible.value = true
}

const handleEdit = (customer: Customer) => {
  currentCustomer.value = { ...customer }
  isFormVisible.value = true
}

const handleDelete = async (guid: string) => {
  await customerStore.deleteCustomer(guid)
}

const handleFormSubmit = async (formData: any) => {
  if (currentCustomer.value?.guid) {
    await customerStore.updateCustomer(currentCustomer.value.guid, formData)
  } else {
    await customerStore.createCustomer(formData)
  }
  isFormVisible.value = false
}
</script>

<style scoped>
.customer-management-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.customer-management-view h1 {
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
}
</style>
