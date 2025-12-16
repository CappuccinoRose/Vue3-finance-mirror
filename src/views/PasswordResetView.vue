<!-- src/views/PasswordResetView.vue -->
<template>
  <div class="auth-container container">
    <el-card class="auth-card card">
      <h1>重置密码</h1>
      <PasswordResetForm @success="handleSuccess" />
      <div style="text-align: center; margin-top: 10px;">
        <router-link to="/login">返回登录</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import PasswordResetForm from '@/components/forms/PasswordResetForm.vue';

const router = useRouter();

const handleSuccess = () => {
  setTimeout(() => {
    router.push('/login');
  }, 2000);
};
</script>

<style scoped>
.auth-card {
  width: 400px;
}
</style>
