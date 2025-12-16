<template>
  <!-- 员工表单 -->
  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑员工' : '新增员工'" width="500px" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" label-position="top">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" clearable />
      </el-form-item>
      <el-form-item label="员工编号" prop="id">
        <el-input v-model="form.id" placeholder="请输入员工编号" clearable />
      </el-form-item>
      <el-form-item label="语言" prop="language">
        <el-input v-model="form.language" placeholder="例如:中文、English" clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="!isEdit">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
      </el-form-item>
      <el-form-item label="状态" prop="active">
        <el-switch v-model="form.active" active-text="启用" inactive-text="禁用" />
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
import type { Employee, EmployeeCreatePayload, EmployeeUpdatePayload } from '@/types/employee';

const props = defineProps<{
  modelValue: boolean;
  employee: Employee | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submit: [data: EmployeeCreatePayload | EmployeeUpdatePayload];
}>();

const formRef = ref<FormInstance>();
const isSubmitting = ref(false);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const isEdit = computed(() => !!props.employee?.guid);

const form = reactive<EmployeeCreatePayload & { password?: string }>({
  username: '',
  password: '',
  id: '',
  language: '',
  active: true,
});

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  id: [{ required: true, message: '请输入员工编号', trigger: 'blur' }],
};

watch(
  () => props.employee,
  (newEmployee) => {
    if (newEmployee) {
      Object.assign(form, newEmployee);
      form.password = '';
    } else {
      form.username = '';
      form.password = '';
      form.id = '';
      form.language = '';
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
        const submitData = { ...form };
        if (isEdit.value && !submitData.password) {
          delete (submitData as any).password;
        }
        emit('submit', submitData);
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
