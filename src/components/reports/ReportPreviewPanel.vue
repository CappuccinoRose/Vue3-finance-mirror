<template>
    <!-- 三个报表内容概况 -->
    <el-row :gutter="24">
        <!-- 资产负债表 -->
        <el-col :span="8">
            <el-card class="preview-card" shadow="hover">
                <div class="card-glow"></div>
                <template #header>
                    <div class="card-header">
                        <span>资产负债表</span>
                        <el-tag size="small" type="info">{{ balanceSheetData?.period || 'N/A' }}</el-tag>
                    </div>
                </template>
                <el-skeleton :loading="isLoading" animated />
                <div v-if="!isLoading && balanceSheetData" class="report-content">
                    <p><strong>总资产:</strong>
                        {{ formattedTotalAssets }}
                    </p>
                    <p><strong>总负债:</strong>
                        {{ formattedTotalLiabilities }}
                    </p>
                    <p><strong>所有者权益:</strong>
                        {{ formattedTotalEquity }}
                    </p>
                </div>
                <el-empty v-if="!isLoading && !balanceSheetData" description="暂无数据" :image-size="60" />
            </el-card>
        </el-col>

        <!-- 利润表 -->
        <el-col :span="8">
            <el-card class="preview-card" shadow="hover">
                <div class="card-glow"></div>
                <template #header>
                    <div class="card-header">
                        <span>利润表</span>
                        <el-tag size="small" type="success">{{ incomeStatementData?.period || 'N/A' }}</el-tag>
                    </div>
                </template>
                <el-skeleton :loading="isLoading" animated />
                <div v-if="!isLoading && incomeStatementData" class="report-content">
                    <p><strong>总收入:</strong>
                        {{ formattedTotalIncome }}
                    </p>
                    <p><strong>总支出:</strong>
                        {{ formattedTotalExpense }}
                    </p>
                    <p><strong>净利润:</strong>
                        {{ formattedNetProfit }}
                    </p>
                </div>
                <el-empty v-if="!isLoading && !incomeStatementData" description="暂无数据" :image-size="60" />
            </el-card>
        </el-col>

        <!-- 现金流量表 -->
        <el-col :span="8">
            <el-card class="preview-card" shadow="hover">
                <div class="card-glow"></div>
                <template #header>
                    <div class="card-header">
                        <span>现金流量表</span>
                        <el-tag size="small" type="warning">{{ cashFlowData?.period || 'N/A' }}</el-tag>
                    </div>
                </template>
                <el-skeleton :loading="isLoading" animated />
                <div v-if="!isLoading && cashFlowData" class="report-content">
                    <p><strong>经营净流:</strong>
                        {{ formattedOperatingNetFlow }}
                    </p>
                    <p><strong>投资净流:</strong>
                        {{ formattedInvestingNetFlow }}
                    </p>
                    <p><strong>筹资净流:</strong>
                        {{ formattedFinancingNetFlow }}
                    </p>
                </div>
                <el-empty v-if="!isLoading && !cashFlowData" description="暂无数据" :image-size="60" />
            </el-card>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BalanceSheetResponse, IncomeStatementResponse, CashFlowStatementResponse } from '@/types/reporting'

interface Props {
    balanceSheetData: BalanceSheetResponse | null
    incomeStatementData: IncomeStatementResponse | null
    cashFlowData: CashFlowStatementResponse | null
    isLoading: boolean
}

const props = defineProps<Props>()

// --- 调试 ---
// watch(() => props.balanceSheetData, (newVal) => {
//     console.log('[ReportPreviewPanel] Balance Sheet Data Updated:', newVal)
// }, { deep: true })
// watch(() => props.incomeStatementData, (newVal) => {
//     console.log('[ReportPreviewPanel] Income Statement Data Updated:', newVal)
// }, { deep: true })
// watch(() => props.cashFlowData, (newVal) => {
//     console.log('[ReportPreviewPanel] Cash Flow Data Updated:', newVal)
// }, { deep: true })

const formatCurrency = (value: any): string => {
    if (typeof value === 'string') {
        const num = parseFloat(value);
        if (isNaN(num)) return '¥0.00';
        return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(num);
    }
    if (typeof value === 'number') {
        if (isNaN(value)) return '¥0.00';
        return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(value);
    }
    return '¥0.00';
}

// --- 计算属性：处理所有数据转换 ---
// 资产负债表
const formattedTotalAssets = computed(() => formatCurrency(props.balanceSheetData?.total_assets));
const formattedTotalLiabilities = computed(() => formatCurrency(props.balanceSheetData?.total_liabilities));
const formattedTotalEquity = computed(() => formatCurrency(props.balanceSheetData?.total_equity));

// 利润表
const formattedTotalIncome = computed(() => formatCurrency(props.incomeStatementData?.total_income));
const formattedTotalExpense = computed(() => formatCurrency(props.incomeStatementData?.total_expense));
const formattedNetProfit = computed(() => formatCurrency(props.incomeStatementData?.net_profit));

// 现金流量表
const formattedOperatingNetFlow = computed(() => {
    if (!props.cashFlowData?.operating_activities) return '¥0.00';
    const sum = Object.values(props.cashFlowData.operating_activities).reduce((acc, val) => acc + parseFloat(String(val || '0')), 0);
    return formatCurrency(sum);
});

const formattedInvestingNetFlow = computed(() => {
    if (!props.cashFlowData?.investing_activities) return '¥0.00';
    const sum = Object.values(props.cashFlowData.investing_activities).reduce((acc, val) => acc + parseFloat(String(val || '0')), 0);
    return formatCurrency(sum);
});

const formattedFinancingNetFlow = computed(() => {
    if (!props.cashFlowData?.financing_activities) return '¥0.00';
    const sum = Object.values(props.cashFlowData.financing_activities).reduce((acc, val) => acc + parseFloat(String(val || '0')), 0);
    return formatCurrency(sum);
});

</script>

<style scoped>
.el-row {
    margin-top: 16px;
}

.preview-card {
    height: 100%;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    border: 1px solid rgba(74, 158, 255, 0.2);
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    position: relative;
    overflow: hidden;
}

.preview-card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow:
        0 14px 28px rgba(0, 0, 0, 0.25),
        0 10px 10px rgba(0, 0, 0, 0.22),
        0 0 1px rgba(74, 158, 255, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.preview-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #4a9eff, #00d4ff, #a1ffef, #4a9eff);
    background-size: 300% 100%;
    animation: breathe-glow 4s ease-in-out infinite;
}

.preview-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
            transparent,
            rgba(74, 158, 255, 0.1),
            transparent);
    transition: left 0.6s;
    opacity: 0;
}

.preview-card:hover::after {
    left: 100%;
    opacity: 1;
}

.preview-card :deep(.el-card__header) {
    border-bottom: 1px solid rgba(74, 158, 255, 0.1);
}

.preview-card :deep(.el-card__body) {
    color: white;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
}

.card-header .el-tag {
    color: white;
    border-color: rgba(255, 255, 255, 0.2);
}

.report-content {
    font-size: 14px;
}

.report-content p {
    margin: 12px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #e2e8f0;
}

.report-content strong {
    color: #ffffff;
    font-weight: 500;
}

/* 移除了针对 span 的样式，因为现在直接渲染文本 */
.report-content p span:last-child {
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
    color: #a1ffef;
    font-weight: 600;
}


:deep(.el-empty) {
    --el-empty-description-color: #64748b;
}

:deep(.el-empty__image svg) {
    fill: #475569;
}

@keyframes breathe-glow {

    0%,
    100% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }
}
</style>
