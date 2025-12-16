<!-- src/views/RegisterView.vue -->
<template>
  <div class="auth-container container">
    <el-card class="auth-card card">
      <h1>用户注册</h1>
      <RegisterForm @success="handleSuccess" />
      <div style="text-align: center; margin-top: 20px;">
        <router-link to="/login">返回登录</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import RegisterForm from '@/components/forms/RegisterForm.vue';

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
