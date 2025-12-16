<template>
  <div class="vendor-management-view">
    <h1>供应商管理</h1>

    <VendorControlPanel @search="handleSearch" @create-new="handleCreate" />
    <VendorTable :vendors="filteredVendors" :loading="vendorStore.isLoading" @edit="handleEdit"
      @delete="handleDelete" />

    <VendorForm v-model="isFormDialogVisible" :vendor="currentVendor" @submit="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useVendorStore } from '@/stores/useVendorStore';
import type { Vendor, VendorCreatePayload, VendorUpdatePayload } from '@/types/vendor';
import VendorControlPanel from '@/components/vendor/VendorControlPanel.vue';
import VendorTable from '@/components/vendor/VendorTable.vue';
import VendorForm from '@/components/forms/VendorForm.vue';

const vendorStore = useVendorStore();

const isFormDialogVisible = ref(false);
const currentVendor = ref<Vendor | null>(null);

const searchQuery = ref('');

const filteredVendors = computed(() => {
  if (!searchQuery.value) {
    return vendorStore.activeVendors;
  }
  const query = searchQuery.value.toLowerCase();
  return vendorStore.activeVendors.filter(vendor =>
    vendor.name.toLowerCase().includes(query) ||
    (vendor.id && vendor.id.toLowerCase().includes(query))
  );
});

onMounted(() => {
  vendorStore.fetchVendors();
});

const handleSearch = (query: string) => {
  searchQuery.value = query;
};

const handleCreate = () => {
  currentVendor.value = null;
  isFormDialogVisible.value = true;
};

const handleEdit = (vendor: Vendor) => {
  currentVendor.value = { ...vendor };
  isFormDialogVisible.value = true;
};

const handleDelete = async (vendor: Vendor) => {
  try {
    await ElMessageBox.confirm(`确定要禁用供应商 "${vendor.name}" 吗？`, '确认操作', { type: 'warning' });
    await vendorStore.deleteVendor(vendor.guid);
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Delete failed:', error);
    }
  }
};

const handleSubmit = async (formData: VendorCreatePayload) => {
  try {
    if (currentVendor.value?.guid) {
      await vendorStore.updateVendor(currentVendor.value.guid, formData as VendorUpdatePayload);
    } else {
      await vendorStore.createVendor(formData as VendorCreatePayload);
    }
    isFormDialogVisible.value = false;
  } catch (error: any) {
    console.error('Submit failed:', error);
  }
};
</script>

<style scoped>
.vendor-management-view h1 {
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
}
</style>
