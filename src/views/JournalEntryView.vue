<template>
  <div class="journal-entry-view container">
    <div class="card">
      <h1>凭证录入</h1>

      <!-- 使用子组件，并监听其 submit 事件 -->
      <JournalEntryForm :accounts="rootAccounts" :loading="transactionStore.isLoading" @submit="handleFormSubmit" />

    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import JournalEntryForm from '@/components/forms/JournalEntryForm.vue';
import { useGeneralLedger } from '@/composables/useGeneralLedger';
import { useTransactionStore } from '@/stores/useTransactionStore';
import type { TransactionCreateForm } from '@/types/transaction';

// --- Composables & Stores ---
const { rootAccounts, loadAccounts, createTransaction } = useGeneralLedger();
const transactionStore = useTransactionStore();

// --- 方法---

const handleFormSubmit = async (formData: TransactionCreateForm) => {
  await createTransaction(formData);
  if (!transactionStore.error) {
    ElMessage.success('凭证创建成功！');
  }
};

// --- 生命周期---
onMounted(() => {
  loadAccounts();
});
</script>


<style scoped>
.journal-entry-view {
  width: 100%;
}
</style>
