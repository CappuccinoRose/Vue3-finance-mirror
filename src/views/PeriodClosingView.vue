<!-- src/views/PeriodClosingView.vue -->
<template>
    <div class="period-closing-view">
        <h1>期末结转</h1>

        <!-- 控制面板 -->
        <PeriodClosingControlPanel :current-period="currentPeriod" :is-current-period-closed="isCurrentPeriodClosed"
            :is-executing="isExecuting" @execute="handleExecuteClosing" />

        <!-- 历史记录表格 -->
        <PeriodClosingTable :history="historyList" :loading="isLoading" @view-details="handleViewDetails"
            @retry="handleRetry" />

        <!-- 详情抽屉子组件 -->
        <PeriodClosingDetailDrawer v-model:visible="isDetailDrawerVisible" :detail="transactionDetail" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';
import { usePeriodClosing } from '@/composables/usePeriodClosing';
import { usePeriodClosingStore } from '@/stores/usePeriodClosingStore';
import type { PeriodClosing } from '@/types/period_closing';
import PeriodClosingControlPanel from '@/components/period/PeriodClosingControlPanel.vue';
import PeriodClosingTable from '@/components/period/PeriodClosingTable.vue';
import PeriodClosingDetailDrawer from '@/components/period/PeriodClosingDetailDrawer.vue';

// --- Store ---
const periodClosingStore = usePeriodClosingStore();
const { historyList, isExecuting, isLoading, currentPeriod, isCurrentPeriodClosed, transactionDetail } = storeToRefs(periodClosingStore);

// --- Composable ---
const { loadData, handleExecuteClosing } = usePeriodClosing();

// --- 详情抽屉状态 ---
const isDetailDrawerVisible = ref(false);

// --- 生命周期 ---
onMounted(() => {
    loadData();
});

// --- 事件处理 ---
const handleViewDetails = async (guid: string) => {
    isDetailDrawerVisible.value = true;
    // 调用 Store 中的 action 来获取详情
    await periodClosingStore.fetchTransactionDetailsWithAccounts(guid);
};

const handleRetry = async (guid: string) => {
    try {
        ElMessage.success('重试任务已提交');
        await loadData();
    } catch (error) {
        console.error('Failed to retry closing:', error);
        ElMessage.error('重试失败');
    }
};
</script>

<style scoped>
.period-closing-view {
    padding: 20px;
}

h1 {
    margin-bottom: 24px;
    font-size: 24px;
    font-weight: 600;
}

:deep(.el-drawer) {
    background: rgba(15, 23, 42, 0.9) !important;
    backdrop-filter: blur(20px);
    border-left: 1px solid rgba(74, 158, 255, 0.2) !important;
    box-shadow:
        -25px 0 50px rgba(0, 0, 0, 0.3),
        0 0 100px rgba(74, 158, 255, 0.1) !important;
}

:deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: 20px 30px;
    border-bottom: 1px solid rgba(74, 158, 255, 0.1);
    color: #e2e8f0;
}

:deep(.el-drawer__title) {
    font-size: 20px;
    font-weight: 600;
    background: linear-gradient(135deg, #4a9eff 0%, #a1ffef 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

:deep(.el-drawer__body) {
    padding: 20px 30px 30px 30px;
    color: #e2e8f0;
}
</style>
