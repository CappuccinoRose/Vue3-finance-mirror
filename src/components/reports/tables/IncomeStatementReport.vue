<template>
    <!-- 利润表 -->
    <el-card class="report-table-card">
        <template #header>
            <div class="card-header">
                <div class="header-title">利润表</div>
                <el-tag v-if="data" size="large" type="success">{{ data.period }}</el-tag>
            </div>
        </template>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column label="项目" min-width="200">
                <template #default="{ row }">
                    <span :class="{ 'profit-row': row.isProfit, 'total-row': row.isTotal }">{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="本期金额" text-align="right" width="180">
                <template #default="{ row }">
                    <span :class="{ 'profit-row': row.isProfit, 'total-row': row.isTotal }">{{ formatCurrency(row.value)
                    }}</span>
                </template>
            </el-table-column>

            <el-table-column v-if="data?.comparison_period" label="上期金额" text-align="right" width="180">
                <template #default="{ row }">
                    <span :class="{ 'profit-row': row.isProfit, 'total-row': row.isTotal }">{{
                        formatCurrency(row.comparisonValue) }}</span>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IncomeStatementResponse } from '@/types/reporting'
import { formatCurrency } from '@/utils/format'

interface Props {
    data: IncomeStatementResponse | null
}
const props = defineProps<Props>()
const mockData: IncomeStatementResponse = {
    period: '2025-09 (模拟)',
    comparison_period: '2025-08 (模拟)',
    income_items: { '主营业务收入': 300000, '其他业务收入': 5000 },
    expense_items: { '主营业务成本': 120000, '销售费用': 30000, '管理费用': 40000 },
    total_income: 305000,
    total_expense: 190000,
    net_profit: 115000,
    comparison_net_profit: 95000,
}

const tableData = computed(() => {
    const d = props.data || mockData

    return [
        { name: '一、营业收入', isTotal: false, isProfit: true, value: d.total_income },
        ...Object.entries(d.income_items).map(([name, value]) => ({ name, value, isTotal: false, isProfit: true })),
        { name: '二、营业支出', isTotal: false, isProfit: false, value: d.total_expense },
        ...Object.entries(d.expense_items).map(([name, value]) => ({ name, value, isTotal: false, isProfit: false })),
        { name: '三、净利润', isTotal: true, isProfit: true, value: d.net_profit, comparisonValue: d.comparison_net_profit },
    ]
})
</script>
<style scoped>
.report-table-card {
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(74, 158, 255, 0.2);
    border-radius: 16px;
    padding: 10px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.report-table-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #4a9eff, #00d4ff);
}

.report-table-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(74, 158, 255, 0.2);
}


.report-table-card :deep(.el-card__header) {
    padding-bottom: 10px;
}

.report-table-card :deep(.el-card__body) {
    padding: 0;
}

.card-header {
    display: flex;
    justify-content: space-between;
}

.header-title {
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
}

.card-header .el-tag {
    color: white;
}

:deep(.el-table .total-row) {
    font-weight: 700;
    color: #409eff !important;
}
</style>