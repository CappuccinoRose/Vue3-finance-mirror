<template>
    <div class="employee-management-view">
        <h1>员工档案管理</h1>
        <EmployeeControlPanel @search="handleSearch" @create-new="handleCreate" />

        <EmployeeList :employees="activeEmployees" :loading="isLoadingEmployees" @edit="handleEdit"
            @delete="handleDelete" />

        <EmployeeForm v-model="isFormVisible" :employee="currentEmployee" @submit="handleSubmit" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEmployeeExpense } from '@/composables/useEmployeeExpense';
import type { Employee, EmployeeCreatePayload, EmployeeUpdatePayload } from '@/types/employee';
import EmployeeList from '@/components/expense/EmployeeList.vue';
import EmployeeForm from '@/components/forms/EmployeeForm.vue';
import EmployeeControlPanel from '@/components/expense/EmployeeControlPanel.vue';

// --- 从 composable 中解构出 isLoadingEmployees ---
const {
    activeEmployees,
    loadEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    isLoadingEmployees
} = useEmployeeExpense();

const isFormVisible = ref(false);
const currentEmployee = ref<Employee | null>(null);

onMounted(() => {
    loadEmployees();
});

const handleCreate = () => {
    currentEmployee.value = null;
    isFormVisible.value = true;
};

const handleEdit = (employee: Employee) => {
    currentEmployee.value = { ...employee };
    isFormVisible.value = true;
};

const handleDelete = async (guid: string) => {
    await deleteEmployee(guid);
};

const handleSubmit = async (formData: EmployeeCreatePayload | EmployeeUpdatePayload) => {
    if (currentEmployee.value?.guid) {
        await updateEmployee(currentEmployee.value.guid, formData as EmployeeUpdatePayload);
    } else {
        await createEmployee(formData as EmployeeCreatePayload);
    }
    isFormVisible.value = false;
};

// 处理控制面板事件
const handleSearch = (query: { text: string; status: string }) => {
    console.log('搜索员工:', query);
};

const handleCreateNew = () => {
    handleCreate();
};
</script>

<style scoped>
.employee-management-view {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.employee-management-view h1 {
    margin-bottom: 24px;
    font-size: 24px;
    font-weight: 600;
}
</style>
