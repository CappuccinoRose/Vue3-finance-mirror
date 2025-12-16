<template>
  <!-- 客户表单 -->
  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑客户' : '新增客户'" width="500px" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" label-position="top">
      <el-form-item label="客户名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入客户名称" clearable />
      </el-form-item>
      <el-form-item label="客户编号/税号" prop="id">
        <el-input v-model="form.id" placeholder="请输入客户编号或税号" clearable />
      </el-form-item>
      <el-form-item label="备注" prop="notes">
        <el-input v-model="form.notes" type="textarea" :rows="3" placeholder="请输入备注信息" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="isSubmitting">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { Customer, CustomerCreate } from '@/types/customer';

const props = defineProps<{
  modelValue: boolean;
  customer: Customer | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [data: CustomerCreate];
}>();

const formRef = ref<FormInstance>();
const isSubmitting = ref(false);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const isEdit = computed(() => !!props.customer?.guid);

const form = reactive<CustomerCreate>({
  name: '',
  id: '',
  notes: '',
  active: true,
});

const rules: FormRules = {
  name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
};

watch(
  () => props.customer,
  (newCustomer) => {
    if (newCustomer) {
      Object.assign(form, newCustomer);
    } else {
      form.name = '';
      form.id = '';
      form.notes = '';
      form.active = true;
    }
  },
  { immediate: true }
);

const handleClose = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      isSubmitting.value = true;
      try {
        emit('submit', { ...form });
        handleClose();
      } finally {
        isSubmitting.value = false;
      }
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
</style>
