<template>
    <div class="control-panel">
        <div class="left">
            <el-alert :title="statusAlertTitle" :type="statusAlertType" :description="statusAlertMessage"
                :closable="false" show-icon style="flex: 1;" />
        </div>
        <div class="right">
            <span class="period-text">当前期间: <strong>{{ currentPeriod }}</strong></span>
            <el-button type="primary" :loading="isExecuting" :disabled="isCurrentPeriodClosed || isExecuting"
                @click="handleExecute">
                {{ isExecuting ? '正在执行...' : '执行结转' }}
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElAlert, ElButton } from 'element-plus';

const props = defineProps<{
    currentPeriod: string;
    isCurrentPeriodClosed: boolean;
    isExecuting: boolean;
}>();

const emit = defineEmits<{
    execute: [];
}>();

const statusAlertType = computed(() => (props.isCurrentPeriodClosed ? 'success' : 'warning'));
const statusAlertTitle = computed(() => (props.isCurrentPeriodClosed ? '当前期间已结转' : '当前期间未结转'));
const statusAlertMessage = computed(() =>
    props.isCurrentPeriodClosed
        ? `${props.currentPeriod} 期间的期末结转已完成。`
        : `请确认数据准备就绪后，执行 ${props.currentPeriod} 期间的期末结转。`
);

const handleExecute = () => {
    emit('execute');
};
</script>

<style scoped>
.control-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 16px;
    background-color: var(--el-bg-color-page);
    border-radius: 8px;
    gap: 20px;
}

.left {
    display: flex;
    align-items: center;
    flex: 1;
}

.right {
    display: flex;
    align-items: center;
    gap: 16px;
    white-space: nowrap;
}

.period-text {
    font-size: 16px;
    color: #606266;
}

.period-text strong {
    color: #1f2937;
}
</style>
