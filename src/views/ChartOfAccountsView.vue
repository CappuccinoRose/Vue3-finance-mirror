<template>
  <div class="chart-of-accounts-view">

    <el-card>
      <template #header>
        <div class="card-header">
          <span style="color:white">会计科目</span>
          <el-button class="handle_button" @click="handleCreate" style="margin:0">新增科目</el-button>
        </div>
      </template>

      <el-table v-loading="isLoadingAccounts" :data="accounts" row-key="guid" style="width: 100%"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
        <el-table-column prop="code" label="科目编码" width="120" />
        <el-table-column prop="name" label="科目名称" />
        <el-table-column prop="account_type" label="科目类型">
          <template #default="scope">
            <el-tag>{{ ACCOUNT_TYPE_LABELS[scope.row.account_type] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button class="handle_button" size="small" @click="handleCreateSub(scope.row)">新增下级</el-button>
            <el-button class="handle_button" size="small" type="primary" @click="handleUpdate(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 表单对话框 -->
    <AccountForm v-model="isFormVisible" :account="currentAccount" :parent-account="parentAccountForCreate"
      @confirm="handleFormConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGeneralLedger } from '@/composables/useGeneralLedger';
import type { Account } from '@/types/account';
import AccountForm from '@/components/forms/AccountForm.vue';
import { ACCOUNT_TYPE_LABELS } from '@/utils/constants';

const {
  loadAccounts,
  createAccount,
  updateAccount,
  isLoadingAccounts,
  accounts,
} = useGeneralLedger();


const isFormVisible = ref(false);
const currentAccount = ref<Account | undefined>();
const parentAccountForCreate = ref<Account | undefined>();

onMounted(() => {
  loadAccounts();
});

const handleCreate = () => {
  currentAccount.value = undefined;
  parentAccountForCreate.value = undefined;
  isFormVisible.value = true;
};

const handleCreateSub = (parent: Account) => {
  currentAccount.value = undefined;
  parentAccountForCreate.value = parent;
  isFormVisible.value = true;
};

const handleUpdate = (account: Account) => {
  currentAccount.value = account;
  parentAccountForCreate.value = undefined;
  isFormVisible.value = true;
};

const handleFormConfirm = async (formData: any) => {
  if (currentAccount.value) {
    await updateAccount(currentAccount.value.guid, formData);
  } else {
    const dataToSubmit = {
      ...formData,
      parent_guid: parentAccountForCreate.value?.guid || null,
    };
    await createAccount(dataToSubmit);
  }
  isFormVisible.value = false;
  await loadAccounts();
};
</script>

<style scoped>
.chart-of-accounts-view {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
