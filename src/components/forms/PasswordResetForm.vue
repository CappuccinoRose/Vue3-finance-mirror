<template>
  <!-- 密码重置表单 -->
  <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent="handleSubmit">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" />
    </el-form-item>

    <!-- 验证码区域 -->
    <el-form-item label="验证码" prop="verification_code">
      <div class="code">
        <el-input v-model="form.verification_code" placeholder="请输入验证码" maxlength="4" size="small" />
        <el-button class="handle_button" type="info" @click="handleGetCode" :disabled="isCodeButtonDisabled"
          :loading="isLoadingCode">
          {{ codeButtonText }}
        </el-button>
      </div>
    </el-form-item>

    <el-form-item label="新密码" prop="new_password">
      <el-input v-model="form.new_password" type="password" show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="form.confirmPassword" type="password" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit" :loading="isSubmitting" class="reset_button">
        重置密码
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { authApi } from '@/api/auth';

const emit = defineEmits<{
  success: [];
}>();

const formRef = ref<FormInstance>();
const isSubmitting = ref(false);
const isLoadingCode = ref(false);

// --- 验证码相关状态 ---
const generatedCode = ref<string | null>(null);
const isCodeButtonDisabled = ref(false);

// --- 表单数据 ---
const form = reactive({
  username: '',
  verification_code: '',
  new_password: '',
  confirmPassword: '',
});

// --- 表单校验规则 ---
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== form.new_password) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};

const rules = reactive<FormRules<typeof form>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  verification_code: [
    { required: true, message: '请获取并输入验证码', trigger: 'blur' },
    { len: 4, message: '验证码为4位', trigger: 'blur' },
  ],
  new_password: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
});

// --- 计算属性 ---
const codeButtonText = computed(() => {
  return isCodeButtonDisabled.value ? '重新获取' : '获取验证码';
});

// --- 方法 ---
const handleGetCode = async () => {
  if (!form.username) {
    ElMessage.warning('请先输入用户名');
    return;
  }

  isLoadingCode.value = true;
  try {
    // API 调用现在直接返回数据
    const response = await authApi.requestPasswordReset({ username: form.username });
    generatedCode.value = response.reset_code;
    ElMessage({
      message: `验证码是：${response.reset_code}`,
      type: 'success',
      duration: 10000, // 设置显示时长为 10000 毫秒（10秒）
      showClose: true,  // 显示关闭按钮，让用户可以提前关闭
    });

  } catch (error: any) {
    console.error('获取验证码失败:', error);
  } finally {
    isLoadingCode.value = false;
  }
};


const handleSubmit = async () => {
  if (!formRef.value) return;

  if (form.verification_code !== generatedCode.value) {
    ElMessage.error('验证码错误，请重新输入或获取新验证码');
    return;
  }

  await formRef.value.validate(async (valid) => {
    if (valid) {
      isSubmitting.value = true;
      try {
        await authApi.confirmPasswordReset({
          username: form.username,
          reset_code: form.verification_code,
          new_password: form.new_password,
        });
        ElMessage.success('密码重置成功！');
        emit('success');
      } catch (error: any) {
        ElMessage.error(error.response?.data?.detail || '重置失败');
      } finally {
        isSubmitting.value = false;
      }
    }
  });
};
</script>

<style scoped>
.code {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 40px;
  position: relative;
  z-index: 2;
}

.el-message__content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
  color: #e2e8f0 !important;
}

.handle_button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 32px !important;
  font-size: 12px;
  background: rgba(74, 158, 255, 0.1) !important;
  border: 1px solid rgba(74, 158, 255, 0.3) !important;
  color: #a1ffef !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
}

.handle_button:hover {
  background: rgba(74, 158, 255, 0.2) !important;
  border-color: rgba(74, 158, 255, 0.5) !important;
  color: #4a9eff !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 158, 255, 0.2);
}

.reset_button {
  display: inline-block;
  margin: 20px auto 0px;
  width: 100%;
  height: 48px;
  position: relative;
  z-index: 2;
}
</style>
