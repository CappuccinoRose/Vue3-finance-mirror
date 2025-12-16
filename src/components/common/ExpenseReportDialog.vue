<template>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" @close="handleClose">
        <!-- 导入组件费用表单 -->
        <ExpenseReportForm :mode="mode" :report="report" :is-submitting="isSubmitting" @submit="handleFormSubmit" />
    </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import ExpenseReportForm from '@/components/forms/ExpenseReportForm.vue';
import type { ExpenseReport, ExpenseReportCreatePayload } from '@/types/employee';

const props = defineProps<{
    modelValue: boolean;
    report: ExpenseReport | null;
    mode: 'create' | 'view';
}>();

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    submit: [data: ExpenseReportCreatePayload];
}>();

const isSubmitting = ref(false);

const dialogVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});

const dialogTitle = computed(() => props.mode === 'create' ? '提交费用报告' : '费用报告详情');

const handleClose = () => {
    dialogVisible.value = false;
};

const handleFormSubmit = async (data: ExpenseReportCreatePayload) => {
    isSubmitting.value = true;
    try {
        emit('submit', data);
    } finally {
        isSubmitting.value = false;
    }
};
</script>
