<template>
  <div class="expense-management-view">
    <h1>费用报销管理</h1>
    <ExpenseControlPanel @search="handleSearch" @create-new="handleCreate" />

    <ExpenseReportList :reports="expenseReports" :loading="isLoading" @view="handleView" @approve="handleApprove" />

    <!-- 提交/编辑/查看报告表单 -->
    <ExpenseReportForm v-model="isFormVisible" :mode="formMode" :report="currentFormReport"
      :is-submitting="isSubmitting" @submit="handleSubmit" />

    <!-- 查看详情与审批 -->
    <ExpenseReportDetail v-model="isDetailVisible" :report="currentReport" @approve="handleApprove" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEmployeeExpense } from '@/composables/useEmployeeExpense';
import type { ExpenseReport, ExpenseReportCreatePayload, ExpenseReportApprovalPayload } from '@/types/employee';
import ExpenseReportList from '@/components/expense/ExpenseReportList.vue';
import ExpenseReportForm from '@/components/forms/ExpenseReportForm.vue';
import ExpenseReportDetail from '@/components/expense/ExpenseReportDetail.vue';
import ExpenseControlPanel from '@/components/expense/ExpenseControlPanel.vue'; // 👈 新增导入

const { expenseReports, loadReports, submitReport, approveReport } = useEmployeeExpense();

const isLoading = ref(false); 
const isFormVisible = ref(false);
const isDetailVisible = ref(false);
const currentReport = ref<ExpenseReport | null>(null);

// 控制表单的状态
const formMode = ref<'create' | 'view' | 'edit'>('create');
const currentFormReport = ref<ExpenseReportCreatePayload | null>(null);
const isSubmitting = ref(false);

onMounted(() => {
  isLoading.value = true;
  loadReports().finally(() => {
    isLoading.value = false;
  });
});

const handleCreate = () => {
  formMode.value = 'create';
  currentFormReport.value = null; 
  isFormVisible.value = true;
};

const handleEdit = (report: ExpenseReport) => {
  formMode.value = 'edit';
  // 将 ExpenseReport 类型转换为 ExpenseReportCreatePayload 类型以供表单使用
  currentFormReport.value = {
    description: report.description,
    entries: report.entries,
  };
  isFormVisible.value = true;
};

const handleSubmit = async (formData: ExpenseReportCreatePayload) => {
  isSubmitting.value = true;
  try {
    await submitReport(formData);
    isFormVisible.value = false;
  } catch (error) {

  } finally {
    isSubmitting.value = false;
  }
};

const handleView = (report: ExpenseReport) => {
  currentReport.value = report;
  isDetailVisible.value = true;
};

const handleApprove = async (guid: string, payload: ExpenseReportApprovalPayload) => {
  await approveReport(guid, payload);
  isDetailVisible.value = false; 
};

// 处理控制面板事件
const handleSearch = (query: string) => {
  console.log('搜索报销单:', query);
};

const handleCreateNew = () => {
  handleCreate(); 
};
</script>

<style scoped>
.expense-management-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.expense-management-view h1 {
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
}
</style>
