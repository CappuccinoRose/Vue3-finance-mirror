<template>
    <!-- 自定义财务报表模块 -->
    <div class="custom-report-drawer">
        <el-drawer v-model="drawerVisible" direction="rtl" size="700px" :before-close="handleClose"
            class="custom-report-drawer">
            <template #header>
                <div class="drawer-header">
                    <h3>生成自定义报表</h3>
                </div>
            </template>

            <!-- 1. 查询条件区 -->
            <el-card class="filter-card" shadow="never">
                <el-form label-position="top">
                    <el-form-item label="查询日期范围">
                        <el-date-picker v-model="dateRange" type="daterange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD" :clearable="false" style="width: 100%" />
                    </el-form-item>

                    <el-form-item label="筛选科目 (可选)">
                        <el-select ref="accountSelectRef" v-model="selectedAccountGuids" multiple collapse-tags
                            collapse-tags-tooltip :max-collapse-tags="3" placeholder="选择一个或多个科目进行筛选" style="width: 100%"
                            :loading="isLoadingAccounts">
                            <template #header>
                                <div class="select-header">
                                    <el-checkbox :model-value="isAllSelected" :indeterminate="isIndeterminate"
                                        @click.stop="handleSelectAllToggle">全选</el-checkbox>
                                    <div class="quick-select-buttons">
                                        <el-button size="small" text
                                            @click="selectByType('balance_sheet')">资产负债表</el-button>
                                        <el-button size="small" text
                                            @click="selectByType('income_statement')">利润表</el-button>
                                        <el-button size="small" text
                                            @click="selectByType('cash_flow')">现金流量表</el-button>
                                    </div>
                                </div>
                            </template>
                            <el-option v-for="account in flatAccountsWithType" :key="account.guid"
                                :label="`${account.code ? `[${account.code}] ` : ''}${account.name}`"
                                :value="account.guid" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-card>

            <!-- 2. 操作按钮区 -->
            <div class="action-section">
                <el-button type="primary" :loading="isLoading" @click="handleGenerate" size="large"
                    style="width: 100%;">
                    <el-icon>
                        <Search />
                    </el-icon>
                    生成报表
                </el-button>
            </div>


            <div class="report-preview-section">
                <el-skeleton v-if="isLoading" animated />
                <template v-else-if="reportData?.lines?.length">
                    <el-divider content-position="left"><span class="divider-title">报表预览</span></el-divider>

                    <el-card shadow="never">
                        <el-table :data="reportData.lines" style="width: 100%" stripe>
                            <!-- 3. 报表预览区 -->
                            <el-table-column prop="account_code" label="科目代码" width="120" />
                            <el-table-column prop="account_name" label="科目名称" />
                            <el-table-column prop="beginning_balance" label="期初余额" width="120" text-align="right">
                                <template #default="scope">
                                    <span>{{ formatCurrency(scope.row.beginning_balance) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="debit_total" label="借方发生额" width="120" text-align="right">
                                <template #default="scope">
                                    <span :class="getAmountClass(scope.row.debit_total)">{{
                                        formatCurrency(scope.row.debit_total) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="credit_total" label="贷方发生额" width="120" text-align="right">
                                <template #default="scope">
                                    <span :class="getAmountClass(-scope.row.credit_total)">{{
                                        formatCurrency(scope.row.credit_total) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="ending_balance" label="期末余额" width="120" text-align="right">
                                <template #default="scope">
                                    <span>{{ formatCurrency(scope.row.ending_balance) }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>

                </template>
                <!-- 4.无数据处理区 -->
                <template v-else-if="reportData">
                    <el-divider content-position="left"><span class="divider-title">报表预览</span></el-divider>
                    <el-empty description="当前条件下未找到任何数据" :image-size="80" />
                </template>
                <template v-else>
                    <el-divider content-position="left"><span class="divider-title">报表预览</span></el-divider>
                    <el-empty description="请设置查询条件并生成报表" :image-size="80" />
                </template>
            </div>

            <el-alert v-if="hasError" :title="errorMessage" type="error" :closable="false" show-icon
                style="margin: 20px 30px;" />
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useCustomReport } from '@/composables/useCustomReport'
import { useAccountStore } from '@/stores/useAccountStore'
import { formatCurrency } from '@/utils/format'
import type { Account } from '@/types/account'

// --- Props & Emits ---
interface Props {
    modelValue: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

// --- Composables & Stores ---
const {
    dateRange,
    selectedAccountGuids,
    reportData,
    isLoading,
    hasError,
    errorMessage,
    generateReport,
    resetFilters,
} = useCustomReport()

const accountStore = useAccountStore()
const { accounts } = storeToRefs(accountStore)

// --- Local State ---
const isLoadingAccounts = ref(false)
const accountSelectRef = ref()

// --- Computed ---
const drawerVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})
const flatAccountsWithType = computed(() => {
    if (!Array.isArray(accounts.value)) return []
    const flatten = (accs: Account[]): Account[] => {
        return accs.reduce<Account[]>((flat, account) => {
            flat.push(account)
            if (account.children?.length) {
                flat.push(...flatten(account.children))
            }
            return flat
        }, [])
    }
    return flatten(accounts.value)
})

const allAccountGuids = computed(() => flatAccountsWithType.value.map(acc => acc.guid))

const isIndeterminate = computed(() => {
    const selectedCount = selectedAccountGuids.value.length
    const totalCount = allAccountGuids.value.length
    return selectedCount > 0 && selectedCount < totalCount
})

const isAllSelected = computed({
    get: () => {
        const totalCount = allAccountGuids.value.length
        if (totalCount === 0) return false
        const selectedCount = selectedAccountGuids.value.length
        return selectedCount > 0 && selectedCount === totalCount
    },
    set: (value: boolean) => {
        selectedAccountGuids.value = value ? [...allAccountGuids.value] : []
    },
})

// --- Methods ---
const handleSelectAllToggle = async () => {
    if (isAllSelected.value || isIndeterminate.value) {
        selectedAccountGuids.value = []
    } else {
        selectedAccountGuids.value = [...allAccountGuids.value]
    }
    await nextTick()
    accountSelectRef.value?.focus()
}

const selectByType = async (type: Account['type']) => {
    const guidsOfType = flatAccountsWithType.value.filter(acc => acc.type === type).map(acc => acc.guid)
    if (!guidsOfType.length) {
        ElMessage.warning(`未找到类型为 "${getTypeLabel(type)}" 的科目`)
        return
    }
    selectedAccountGuids.value = Array.from(new Set([...selectedAccountGuids.value, ...guidsOfType]))
    await nextTick()
    accountSelectRef.value?.focus()
}

const getTypeLabel = (type: Account['type']) => {
    const labels = {
        balance_sheet: '资产负债表',
        income_statement: '利润表',
        cash_flow: '现金流量表',
        other: '其他',
    }
    return labels[type] || '未知'
}

const handleGenerate = async () => {
    if (dateRange.value.length !== 2) {
        ElMessage.error('请选择完整的日期范围')
        return
    }
    try {
        await generateReport()
        ElMessage.success('报表生成成功！')
    } catch {
    }
}

const handleClose = () => {
    drawerVisible.value = false
}

const getAmountClass = (amount: number | string) => {
    const num = parseFloat(String(amount))
    if (num > 0) return 'amount-cell debit'
    if (num < 0) return 'amount-cell credit'
    return 'amount-cell'
}

// --- Watchers ---
watch(drawerVisible, (newVal) => {
    if (newVal) {
        isLoadingAccounts.value = true
        accountStore.fetchAccounts().finally(() => {
            isLoadingAccounts.value = false
        })
    } else {
        resetFilters()
    }
})
</script>

<style>
.custom-report-drawer .el-drawer {
    background: rgba(15, 23, 42, 0.95) !important;
    backdrop-filter: blur(20px);
    border-left: 1px solid rgba(74, 158, 255, 0.2) !important;
    box-shadow:
        -8px 0 32px rgba(0, 0, 0, 0.5),
        0 0 100px rgba(74, 158, 255, 0.2) !important;
}

.custom-report-drawer .drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    height: 30px;
    border-bottom: 1px solid rgba(74, 158, 255, 0.1);
}

.custom-report-drawer .drawer-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    background: linear-gradient(135deg, #4a9eff 0%, #a1ffef 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.custom-report-drawer .filter-card {
    margin: 0 20px 20px 20px;
    border: 1px solid rgba(74, 158, 255, 0.2);
    background: rgba(30, 41, 59, 0.5);
}

.custom-report-drawer .el-card__body {
    padding: 20px 20px 0 20px;
}

.custom-report-drawer .divider-title {
    font-weight: 600;
    font-size: 18px;
}

.custom-report-drawer .action-section {
    padding: 0 30px;
}

.custom-report-drawer .el-drawer__body,
.custom-report-drawer .el-drawer__footer {
    padding: 0;
}

.report-preview-section .el-card {
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(74, 158, 255, 0.2);
    border-radius: 16px;
    padding: 10px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.report-preview-section .el-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #4a9eff, #00d4ff);
}

.report-preview-section .el-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(74, 158, 255, 0.2);
}

.report-preview-section :deep(.el-card__body) {
    padding: 0;
}

.report-preview-section :deep(.el-table) {
    --el-table-border-color: rgba(74, 158, 255, 0.05);
    --el-table-header-bg-color: transparent;
    --el-table-row-hover-bg-color: rgba(74, 158, 255, 0.05);
}

.report-preview-section :deep(.el-table__header-wrapper th) {
    background-color: rgba(74, 158, 255, 0.1);
    color: #e2e8f0;
    font-weight: 600;
    border-bottom: 2px solid rgba(74, 158, 255, 0.3);
}

.report-preview-section :deep(.el-table__header-wrapper .el-table__cell) {
    background-color: transparent;
}

.select-header {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 10px;
    border-bottom: 1px solid rgba(74, 158, 255, 0.1);
}

.report-preview-section :deep(.el-table__body-wrapper tr) {
    background-color: transparent;
}

.report-preview-section :deep(.el-table__body-wrapper .el-table__cell) {
    color: #cbd5e1;
    padding: 12px 0;
}

.report-preview-section .amount-cell {
    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
    font-weight: 600;
    font-size: 14px;
}

.report-preview-section .amount-cell.debit {
    color: #f87171;
}

.report-preview-section .amount-cell.credit {
    color: #34d399;
}
</style>
