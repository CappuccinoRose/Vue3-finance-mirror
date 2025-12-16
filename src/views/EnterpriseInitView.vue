<!-- src/views/SystemConfigView.vue -->
<template>
    <div class="init-container container">
        <el-card class="init-card card">
            <h1>欢迎使用财镜系统</h1>
            <p>为了开始使用，请先完成您企业的基本配置</p>
            <EnterpriseInitForm @success="handleSuccess" />
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import EnterpriseInitForm from '@/components/forms/EnterpriseInitForm.vue';

const router = useRouter();

const handleSuccess = () => {
    // 初始化成功后，跳转到仪表盘
    router.push('/');
};
</script>

<style scoped>
.init-card {
    max-width: 500px;
}

.init-card p {
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 30px;
}
</style>
