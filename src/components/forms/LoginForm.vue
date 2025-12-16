<template>
    <!-- 登录表单 -->
    <el-form :model="form" @submit.prevent="handleSubmit">
        <el-form-item>
            <el-input v-model="form.username" placeholder="请输入您的用户名" />
        </el-form-item>
        <el-form-item>
            <el-input v-model="form.password" type="password" placeholder="请输入您的密码" show-password />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" native-type="submit" :loading="authStore.isLoading">
                登录
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { ElMessage } from 'element-plus';
import type { LoginRequest } from '@/types/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive<LoginRequest>({
    username: '',
    password: '',
});

const handleSubmit = async () => {
    try {
        await authStore.login(form);
        ElMessage.success('登录成功！');
        router.push('/');
    } catch (error: any) {
        console.error('An unexpected error occurred in LoginForm:', error);
        const errorMessage = error.response?.data?.detail || error.message || '登录失败，请检查您的用户名和密码。';
        ElMessage.error(errorMessage);
    }
};
</script>

<style scoped>
.el-button {
    display: inline-block;
    margin-top: 20px;
    width: 100%;
    height: 50px;
}

.el-input {
    width: 80%;
    margin: 0 auto 1rem;
}
</style>
