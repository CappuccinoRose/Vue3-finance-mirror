<template>
    <!-- 费用报销表单 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" :close-on-click-modal="false"
        @close="handleClose">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" label-position="top">
            <el-form-item label="报告描述" prop="description">
                <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入费用报告的详细描述"
                    :readonly="mode === 'view'" />
            </el-form-item>
            <el-form-item label="费用明细" prop="entries">
                <div v-for="(entry, index) in form.entries" :key="index" class="expense-entry">
                    <el-row :gutter="10">
                        <el-col :span="6">
                            <el-input v-model="entry.category" placeholder="类别" :readonly="mode === 'view'" />
                        </el-col>
                        <el-col :span="8">
                            <el-input v-model="entry.description" placeholder="描述" :readonly="mode === 'view'" />
                        </el-col>
                        <el-col :span="6">
                            <el-input-number v-model="entry.amount" :precision="2" :step="0.1" :min="0"
                                style="width: 100%" :disabled="mode === 'view'" />
                        </el-col>
                        <el-col :span="4">
                            <el-button v-if="mode !== 'view'" @click="removeEntry(index)" type="danger" size="small"
                                plain>
                                删除
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
                <el-button v-if="mode !== 'view'" @click="addEntry" type="primary" size="small" plain
                    style="margin-top: 10px;">
                    添加明细
                </el-button>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button v-if="mode !== 'view'" type="primary" @click="handleSubmit" :loading="isSubmitting">
                    提交报告
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import type { ExpenseReportCreatePayload, ExpenseEntry } from '@/types/employee';

const props = defineProps<{
    mode: 'create' | 'view' | 'edit';
    report: ExpenseReportCreatePayload | null;
    isSubmitting: boolean;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    submit: [data: ExpenseReportCreatePayload];
    close: [];
}>();

const formRef = ref<FormInstance>();

const dialogVisible = ref(true);

const dialogTitle = computed(() => {
    switch (props.mode) {
        case 'create':
            return '提交新报告';
        case 'view':
            return '查看费用报告';
        case 'edit':
            return '编辑费用报告';
        default:
            return '费用报告';
    }
});

const form = reactive<ExpenseReportCreatePayload>({
    description: '',
    entries: [{ category: '', description: '', amount: 0 }],
});

watch(
    () => props.report,
    (newReport) => {
        if (newReport) {
            form.description = newReport.description || '';
            form.entries = newReport.entries && newReport.entries.length > 0
                ? [...newReport.entries]
                : [{ category: '', description: '', amount: 0 }];
        } else {
            form.description = '';
            form.entries = [{ category: '', description: '', amount: 0 }];
        }
    },
    { immediate: true }
);

const rules: FormRules = {
    description: [{ required: true, message: '请输入报告描述', trigger: 'blur' }],
    entries: [
        {
            required: true,
            validator: (rule, value: ExpenseEntry[], callback) => {
                if (!value || value.length === 0) {
                    callback(new Error('请至少添加一条费用明细'));
                } else {
                    const isValid = value.every(
                        entry => entry.category && entry.description && entry.amount > 0
                    );
                    isValid ? callback() : callback(new Error('请确保所有明细项都已正确填写'));
                }
            },
            trigger: 'change',
        },
    ],
};

const addEntry = () => {
    form.entries.push({ category: '', description: '', amount: 0 });
};

const removeEntry = (index: number) => {
    if (form.entries.length > 1) {
        form.entries.splice(index, 1);
    } else {
        ElMessage.warning('至少保留一条费用明细');
    }
};

const handleClose = () => {
    dialogVisible.value = false;
    emit('close');
};

const handleSubmit = async () => {
    if (!formRef.value) return;
    await formRef.value.validate(async (valid) => {
        if (valid) {
            emit('submit', { ...form });
            handleClose();
        }
    });
};
</script>

<style scoped>
.dialog-footer .el-button {
    margin-left: 10px;
}

.dialog-footer .el-button:first-child {
    margin-left: 0;
}

.expense-entry {
    margin-bottom: 10px;
}
</style>
