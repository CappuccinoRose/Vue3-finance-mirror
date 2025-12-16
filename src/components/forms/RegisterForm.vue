<template>
  <!-- 注册表单 -->
  <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" @submit.prevent="handleSubmit">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" type="password" show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="form.confirmPassword" type="password" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit" :loading="authStore.isLoading">
        注册
      </el-button>
    </el-form-item>
  </el-form>

</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { useAuthStore } from '@/stores/useAuthStore';
import type { RegisterRequest } from '@/types/auth';

const emit = defineEmits<{
  success: [];
}>();

const router = useRouter();
const authStore = useAuthStore();
const formRef = ref<FormInstance>();

const form = reactive<RegisterRequest & { confirmPassword: string }>({
  username: '',
  password: '',
  confirmPassword: '',
});

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
});

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await authStore.register({
          username: form.username,
          password: form.password,
        });
        ElMessage.success('注册成功！');
        emit('success');
      } catch (error: any) {
        ElMessage.error(error.response?.data?.detail || '注册失败');
      }
    }
  });
};
</script>

<style scoped>
.el-button {
  display: block;
  width: 100%;
  height: 50px;
  margin: 20px 0 0 -30%;
}

.el-input {
  margin-left: 10px;
}
</style>
