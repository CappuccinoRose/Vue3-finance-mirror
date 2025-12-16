<template>
  <!-- 会计表单 -->
  <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑科目' : '新增科目'" width="500px" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" @submit.prevent>
      <el-form-item v-if="parentAccount" label="上级科目">
        <el-input :value="parentAccount.name" disabled />
      </el-form-item>
      <el-form-item label="科目名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入科目名称" />
      </el-form-item>
      <el-form-item label="科目编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入科目编码" />
      </el-form-item>
      <el-form-item label="科目类型" prop="account_type">
        <el-select v-model="form.account_type" placeholder="请选择科目类型" style="width: 100%">
          <el-option v-for="(label, value) in ACCOUNT_TYPE_LABELS" :key="value" :label="label" :value="value" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea" placeholder="请输入描述" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { Account, AccountCreate, AccountUpdate } from '@/types/account';
import { ACCOUNT_TYPE_LABELS } from '@/utils/constants';
import { validationRules } from '@/utils/validate';

const props = defineProps<{
  modelValue: boolean;
  account?: Account;
  parentAccount?: Account;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [data: AccountCreate | AccountUpdate];
}>();

const formRef = ref<FormInstance>();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const isEdit = computed(() => !!props.account);

const form = reactive<AccountCreate | AccountUpdate>({
  name: '',
  account_type: '',
  parent_guid: null,
  code: '',
  description: '',
  hidden: false,
  placeholder: false,
});

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入科目名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  account_type: [
    { required: true, message: '请选择科目类型', trigger: 'change' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (validationRules.accountType(value)) {
          callback();
        } else {
          callback(new Error('无效的科目类型'));
        }
      },
      trigger: 'change',
    },
  ],
});

watch(
  () => [props.account, props.parentAccount],
  ([account, parentAccount]) => {
    if (account) {
      Object.assign(form, account);
    } else {
      form.name = '';
      form.code = '';
      form.account_type = '';
      form.description = '';
      form.hidden = false;
      form.placeholder = false;
      form.parent_guid = parentAccount?.guid || null;
    }
  },
  { immediate: true, deep: true }
);

const handleConfirm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid) {
      const dataToSubmit = { ...form };
      if (isEdit.value) {
        delete (dataToSubmit as AccountUpdate).parent_guid;
      }
      emit('confirm', dataToSubmit);
    }
  });
};

const handleClose = () => {
  dialogVisible.value = false;
  formRef.value?.resetFields();
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
