<template>
    <!-- 采购表单 -->
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" label-position="right">
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="供应商" prop="vendor_guid">
                    <el-select v-model="formData.vendor_guid" placeholder="请选择供应商" style="width: 100%"
                        :disabled="isEdit">
                        <el-option v-for="vendor in vendors" :key="vendor.guid" :label="vendor.name"
                            :value="vendor.guid" />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="账单号" prop="bill_number">
                    <el-input v-model="formData.bill_number" placeholder="请输入账单号" :disabled="isEdit" />
                </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="账单日期" prop="bill_date">
                    <el-date-picker v-model="formData.bill_date" type="date" placeholder="选择日期" style="width: 100%"
                        format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="到期日" prop="due_date">
                    <el-date-picker v-model="formData.due_date" type="date" placeholder="选择日期" style="width: 100%"
                        format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="总金额" prop="total_amount">
                    <el-input-number v-model="formData.total_amount" :precision="2" :step="0.1" :min="0"
                        style="width: 100%" />
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="isEdit">
                <el-form-item label="状态" prop="status">
                    <el-select v-model="formData.status" placeholder="选择状态" style="width: 100%">
                        <el-option label="草稿" value="draft" />
                        <el-option label="已确认" value="confirmed" />
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>

        <el-form-item label="备注" prop="notes">
            <el-input v-model="formData.notes" type="textarea" :rows="3" placeholder="请输入备注信息" />
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { PurchaseBillCreate, PurchaseBillUpdate } from '@/types/purchase_bill';
import { vendorApi } from '@/api/vendor';
import type { Vendor } from '@/types';

const props = defineProps<{
    formData: PurchaseBillCreate | PurchaseBillUpdate | null;
    isEdit: boolean;
}>();

const emit = defineEmits<{
    (e: 'submit', data: PurchaseBillCreate | PurchaseBillUpdate): void;
    (e: 'cancel'): void;
}>();

const formRef = ref<FormInstance>();
const vendors = ref<Vendor[]>([]);


// 本地表单模型，用作新表单的默认值或当 props.formData 为 null 时的后备
const formModel = reactive<PurchaseBillCreate>({
    vendor_guid: '',
    bill_number: '',
    bill_date: '',
    due_date: '',
    total_amount: 0,
    notes: '',
    status: 'draft',
});

// 计算属性：确保模板中绑定的 model 永远不为 null
const formData = computed(() => props.formData || formModel);

const rules = reactive<FormRules>({
    vendor_guid: [{ required: true, message: '请选择供应商', trigger: 'change' }],
    bill_number: [{ required: true, message: '请输入账单号', trigger: 'blur' }],
    bill_date: [{ required: true, message: '请选择账单日期', trigger: 'change' }],
    total_amount: [{ required: true, message: '请输入总金额', trigger: 'blur' }],
});

onMounted(async () => {
    try {
        const response = await vendorApi.getAll();
        vendors.value = response;
    } catch (error) {
        console.error('Failed to fetch vendors:', error);
    }
});


const validate = async () => {
    if (!formRef.value) return false;
    try {
        await formRef.value.validate();
        emit('submit', { ...formData.value });
        return true;
    } catch (error) {
        console.log('Form validation failed:', error);
        return false;
    }
};

// 暴露一个 getFormData 方法，供父组件调用
const getFormData = () => {
    return { ...formData.value };
};


defineExpose({
    validate,
    getFormData,
});
</script>
