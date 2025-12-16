<!-- src/views/LoginView.vue -->
<template>
  <div class="auth-container container">
    <el-card class="auth-card card">
      <h1>欢迎来到财镜系统</h1>
      <LoginForm />
      <div class="auth-links">
        <router-link to="/password-reset">忘记密码？</router-link>
        <span style="margin: 0 10px;">|</span>
        <router-link to="/register">没有账号？立即创建</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/components/forms/LoginForm.vue';
</script>

<style scoped>
.auth-card {
  width: 400px;
}
</style>