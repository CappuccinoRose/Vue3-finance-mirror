<template>
    <div class="report-view">
        <!-- 页面头部：时间选择器 -->
        <el-card class="report-header-card">
            <template #header>
                <div class="page-header">
                    <div class="header-title">财务报表</div>
                    <el-select v-model="selectedPeriod" @change="handlePeriodChange" placeholder="选择月份"
                        style="width: 150px;">
                        <el-option v-for="period in availablePeriods" :key="period" :label="period" :value="period" />
                    </el-select>
                </div>
            </template>
        </el-card>

        <!-- 中部：快速浏览概况 -->
        <ReportPreviewPanel :balance-sheet-data="reportingStore.balanceSheetResponse"
            :income-statement-data="reportingStore.incomeStatementResponse"
            :cash-flow-data="reportingStore.cashFlowStatementResponse" :is-loading="isLoadingReports" />

        <!-- 下部：报表详情 (导航 + 动态表格) -->
        <SheetControl :balance-sheet-data="reportingStore.balanceSheetResponse"
            :income-statement-data="reportingStore.incomeStatementResponse"
            :cash-flow-data="reportingStore.cashFlowStatementResponse" />

        <!-- 底部：自定义报表触发区 (修改后) -->
        <div class="custom-report-trigger-area">
            <div class="custom-report-trigger">
                <div class="header-title">自定义报表</div>
                <div class="trigger-des">
                    <p>根据自定义的日期范围和科目筛选，生成专属的财务报表。</p>
                </div>
                <el-button type="primary" size="large" @click="openCustomReportDrawer" class="glow-button">
                    <el-icon>
                        <DocumentAdd />
                    </el-icon>
                    开始生成
                </el-button>
            </div>
        </div>

        <!-- 自定义报表抽屉 -->
        <CustomReportDrawer v-model="isCustomReportDrawerVisible" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DocumentAdd } from '@element-plus/icons-vue'
import { useReportingStore } from '@/stores/useReportingStore'
import ReportPreviewPanel from '@/components/reports/ReportPreviewPanel.vue'
import SheetControl from '@/components/reports/SheetControl.vue'
import CustomReportDrawer from '@/components/reports/CustomReportDrawer.vue'

const reportingStore = useReportingStore()

// --- 状态 ---
const availablePeriods = ref<string[]>([])
const selectedPeriod = ref<string>('')
const isLoadingReports = ref(false)
const isCustomReportDrawerVisible = ref(false)

// --- 方法 ---
const fetchAvailablePeriods = async () => {
    try {
        const periodsData = await reportingStore.fetchAvailablePeriods()
        availablePeriods.value = periodsData.periods
        if (!selectedPeriod.value && availablePeriods.value.length > 0) {
            selectedPeriod.value = availablePeriods.value[0] ?? ''
        }
    } catch (error) {
        console.error('Failed to fetch available periods:', error)
    }
}

const fetchReportsForPeriod = async (period: string) => {
    if (!period) return
    isLoadingReports.value = true
    try {
        console.log(`[ReportView] Fetching reports for period: ${period}`)
        await Promise.all([
            reportingStore.generateBalanceSheet({ period }),
            reportingStore.generateIncomeStatement({ period }),
            reportingStore.generateCashFlowStatement({ period }),
        ])
    } catch (error) {
        console.error(`[ReportView] Failed to load reports for period ${period}:`, error)
    } finally {
        isLoadingReports.value = false
    }
}

const handlePeriodChange = (period: string) => {
    fetchReportsForPeriod(period)
}

const openCustomReportDrawer = () => {
    isCustomReportDrawerVisible.value = true
}

// --- 生命周期 ---
onMounted(async () => {
    await fetchAvailablePeriods()
    if (selectedPeriod.value) {
        await fetchReportsForPeriod(selectedPeriod.value)
    }
})
</script>

<style scoped>
.report-view {
    padding: 20px;
}


.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-title {
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
}

:deep(.el-select) {
    --el-select-input-color: #e0e0e0;
    --el-select-input-font-size: 14px;
}

:deep(.el-select .el-input.is-focus .el-input__wrapper) {
    box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #555 inset;
}

:deep(.el-input__inner) {
    color: #e0e0e0;
}

.custom-report-trigger-area {
    position: relative;
    padding: 40px 20px;
    margin-top: 24px;
    border-top: 1px solid #409eff;
    text-align: center;
}

.custom-report-trigger {
    position: relative;
    z-index: 1;
}

.trigger-des {
    margin: 16px 0;
    color: #b0b0b0;
}

.glow-button {
    background: linear-gradient(45deg, #409eff, #66b1ff);
    border: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(64, 158, 255, 0.4);
}

.glow-button:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 20px rgba(64, 158, 255, 0.6);
}
</style>
