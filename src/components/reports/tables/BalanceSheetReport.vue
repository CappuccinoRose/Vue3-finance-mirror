<template>
    <!-- 资产负债表 -->
    <el-card class="report-table-card">
        <template #header>
            <div class="card-header">
                <div class="header-title">资产负债表</div>
                <el-tag v-if="data" size="large" type="primary">{{ data.period }}</el-tag>
            </div>
        </template>

        <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column label="资产" min-width="200">
                <template #default="{ row }">
                    <span :class="{ 'total-row': row.isTotal }">{{ row.assetName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="金额" text-align="right" width="180">
                <template #default="{ row }">
                    <span :class="{ 'total-row': row.isTotal }">{{ formatCurrency(row.assetValue) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="负债与所有者权益" min-width="200">
                <template #default="{ row }">
                    <span :class="{ 'total-row': row.isTotal }">{{ row.liabilityEquityName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="金额" text-align="right" width="180">
                <template #default="{ row }">
                    <span :class="{ 'total-row': row.isTotal }">{{ formatCurrency(row.liabilityEquityValue) }}</span>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BalanceSheetResponse } from '@/types/reporting'
import { formatCurrency } from '@/utils/format'

interface Props {
    data: BalanceSheetResponse | null
}
const props = defineProps<Props>()

const tableData = computed(() => {
    const d = props.data || {
        period: 'N/A',
        assets: {},
        liabilities: {},
        equity: {},
        total_assets: 0,
        total_liabilities: 0,
        total_equity: 0,
    }
    const assetEntries = Object.entries(d.assets)
    const liabilityEntries = Object.entries(d.liabilities)
    const equityEntries = Object.entries(d.equity)
    const maxRows = Math.max(assetEntries.length, liabilityEntries.length + equityEntries.length, 1)
    const rows = []
    for (let i = 0; i < maxRows; i++) {
        rows.push({
            assetName: assetEntries[i]?.[0] || (i === maxRows - 1 ? '资产总计' : ''),
            assetValue: assetEntries[i]?.[1] || (i === maxRows - 1 ? d.total_assets : 0),
            liabilityEquityName:
                liabilityEntries[i]?.[0] ||
                equityEntries[i - liabilityEntries.length]?.[0] ||
                (i === maxRows - 1 ? '负债和所有者权益总计' : ''),
            liabilityEquityValue:
                liabilityEntries[i]?.[1] ||
                equityEntries[i - liabilityEntries.length]?.[1] ||
                (i === maxRows - 1 ? d.total_liabilities + d.total_equity : 0),
            isTotal: i === maxRows - 1,
        })
    }
    return rows
})

const tableRowClassName = ({ row }: { row: { isTotal: boolean } }) => {
    return row.isTotal ? 'total-row' : ''
}
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
