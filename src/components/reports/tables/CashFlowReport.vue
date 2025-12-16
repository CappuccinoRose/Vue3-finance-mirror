<template>
    <!-- 现金流量表 -->
    <el-card class="report-table-card">
        <template #header>
            <div class="card-header">
                <div class="header-title">现金流量表</div>
                <el-tag v-if="data" size="large" type="warning">{{ data.period }}</el-tag>
            </div>
        </template>

        <el-table :data="tableData" style="width: 100%">
            <el-table-column label="项目" min-width="250">
                <template #default="{ row }">
                    <span :class="{ 'total-row': row.isTotal, 'negative-cash-flow': row.value < 0 && !row.isTotal }">
                        {{ row.name }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="金额" text-align="right" width="180">
                <template #default="{ row }">
                    <span :class="{ 'total-row': row.isTotal, 'negative-cash-flow': row.value < 0 && !row.isTotal }">
                        {{ formatCurrency(row.value) }}
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CashFlowStatementResponse } from '@/types/reporting'
import { formatCurrency } from '@/utils/format'

interface Props {
    data: CashFlowStatementResponse | null
}
const props = defineProps<Props>()
const mockData: CashFlowStatementResponse = {
    period: '2025-09 (模拟)',
    operating_activities: { '销售商品、提供劳务收到的现金': 250000, '支付给职工的现金': -50000 },
    investing_activities: { '处置固定资产收回的现金': 20000, '购建固定资产支付的现金': -80000 },
    financing_activities: { '取得借款收到的现金': 100000, '偿还债务支付的现金': -30000 },
    net_cash_flow: 210000,
}

const tableData = computed(() => {
    const d = props.data || mockData

    return [
        { name: '一、经营活动产生的现金流量', isTotal: true, value: null },
        ...Object.entries(d.operating_activities).map(([name, value]) => ({ name, value, isTotal: false })),
        { name: '二、投资活动产生的现金流量', isTotal: true, value: null },
        ...Object.entries(d.investing_activities).map(([name, value]) => ({ name, value, isTotal: false })),
        { name: '三、筹资活动产生的现金流量', isTotal: true, value: null },
        ...Object.entries(d.financing_activities).map(([name, value]) => ({ name, value, isTotal: false })),
        { name: '四、现金及现金等价物净增加额', isTotal: true, value: d.net_cash_flow },
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
