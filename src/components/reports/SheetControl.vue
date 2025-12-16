<template>
    <!-- 布局的导航模块 -->
    <el-card class="sheet-control-card">
        <template #header>
            <div class="segmented-container">
                <el-segmented v-model="activeTab" :options="tabOptions" size="large" />
            </div>
        </template>

        <BalanceSheetReport v-if="activeTab === 'balance-sheet'" :data="balanceSheetData" />
        <IncomeStatementReport v-else-if="activeTab === 'income-statement'" :data="incomeStatementData" />
        <CashFlowReport v-else-if="activeTab === 'cash-flow-statement'" :data="cashFlowData" />
    </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { BalanceSheetResponse, IncomeStatementResponse, CashFlowStatementResponse } from '@/types/reporting'
import BalanceSheetReport from './tables/BalanceSheetReport.vue'
import IncomeStatementReport from './tables/IncomeStatementReport.vue'
import CashFlowReport from './tables/CashFlowReport.vue'

interface Props {
    balanceSheetData: BalanceSheetResponse | null
    incomeStatementData: IncomeStatementResponse | null
    cashFlowData: CashFlowStatementResponse | null
}
const props = defineProps<Props>()

const activeTab = ref('balance-sheet')

const tabOptions = [
    { label: '资产负债表', value: 'balance-sheet' },
    { label: '利润表', value: 'income-statement' },
    { label: '现金流量表', value: 'cash-flow-statement' },
]
</script>

<style scoped>
.sheet-control-card {
    margin-top: 24px;
    border: 1px solid rgba(74, 158, 255, 0.2);
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(20px);
    border-radius: 16px;
}

.sheet-control-card :deep(.el-card__header) {
    border-bottom: 1px solid rgba(74, 158, 255, 0.1);
    padding: 20px;
}

.sheet-control-card :deep(.el-card__body) {
    padding: 0;
}


.segmented-container {
    position: relative;
    padding: 4px;
    border-radius: 12px;
    background: rgba(30, 41, 59, 0.6);
    overflow: hidden;

}

.segmented-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
            transparent,
            rgba(74, 158, 255, 0.2),
            transparent);
    animation: segmented-shine 3s ease-in-out infinite;
}

:deep(.el-segmented) {
    --el-segmented-bg-color: transparent;
    --el-segmented-item-selected-bg-color: linear-gradient(135deg, #4a9eff 0%, #a1ffef 100%);
    --el-segmented-item-selected-color: #ffffff;
    --el-segmented-item-color: rgba(226, 232, 240, 0.7);
    --el-segmented-item-disabled-bg-color: transparent;
    --el-segmented-item-disabled-color: var(--el-text-color-disabled);
    --el-border-radius-base: 10px;
    font-weight: 500;
}

:deep(.el-segmented__item.is-selected) {
    background: var(--el-segmented-item-selected-bg-color) !important;
    color: var(--el-segmented-item-selected-color) !important;
    border-color: transparent !important;
    box-shadow: 0 0 15px rgba(74, 158, 255, 0.4);
    backdrop-filter: blur(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-segmented__item) {
    background: transparent !important;
    color: var(--el-segmented-item-color) !important;
    border-color: transparent !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.el-segmented__item:not(.is-selected):hover) {
    color: #a1ffef !important;
    background: rgba(161, 255, 239, 0.1) !important;
}

@keyframes segmented-shine {
    0% {
        left: -100%;
    }

    20%,
    100% {
        left: 150%;
    }
}
</style>
