<template>
    <!-- 费用报告详情 -->
    <el-dialog v-model="dialogVisible" title="" width="70%" :show-close="false" align-center
        class="expense-detail-dialog">

        <el-button class="close-btn" @click="dialogVisible = false" :icon="Close" circle />

        <div v-if="report" class="detail-content">
            <h2 class="content-title">费用报告详情</h2>

            <!-- 主信息表格 -->
            <el-table :data="mainInfoData" :show-header="false" class="main-info-table">
                <el-table-column prop="label" label="Label" width="120" />
                <el-table-column prop="value" label="Value">
                    <template #default="{ row }">
                        <el-tag v-if="row.isTag" :type="row.type" effect="light">
                            {{ row.value }}
                        </el-tag>
                        <span v-else>{{ row.value }}</span>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 费用明细表格 -->
            <h3 class="sub-title">费用明细</h3>
            <el-table :data="report.entries" stripe class="entries-table">
                <el-table-column prop="category" label="类别" />
                <el-table-column prop="description" label="描述" />
                <el-table-column prop="amount" label="金额" text-align="right" width="150">
                    <template #default="{ row }">
                        <span class="amount-cell">¥{{ row.amount.toFixed(2) }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-else class="loading-placeholder">
            <el-icon class="is-loading">
                <Loading />
            </el-icon>
            <span>加载中...</span>
        </div>

        <!-- 自定义底部操作栏 -->
        <template #footer v-if="report?.status === 'SUBMITTED'">
            <div class="dialog-footer">
                <el-button @click="handleApprove('REJECTED')" type="danger" plain>拒绝</el-button>
                <el-button @click="handleApprove('APPROVED')" type="primary">批准</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Close, Loading } from '@element-plus/icons-vue';
import type { ExpenseReport, ExpenseReportApprovalPayload } from '@/types/employee';

const props = defineProps<{
    modelValue: boolean;
    report: ExpenseReport | null;
}>();

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    approve: [guid: string, payload: ExpenseReportApprovalPayload];
}>();

const dialogVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});

// 将基本信息转换为表格数据
const mainInfoData = computed(() => {
    if (!props.report) return [];
    const { report } = props;
    return [
        { label: '报告ID', value: report.guid },
        { label: '状态', value: getStatusText(report.status), isTag: true, type: getStatusType(report.status) },
        { label: '描述', value: report.description },
        { label: '总金额', value: `¥${report.total_amount.toFixed(2)}` },
        { label: '提交时间', value: formatDate(report.submitted_at ?? null) },
        { label: '审批时间', value: formatDate(report.reviewed_at ?? null) },
        { label: '备注', value: report.notes || 'N/A' },
    ];
});

const handleApprove = (status: 'APPROVED' | 'REJECTED') => {
    if (!props.report) return;
    emit('approve', props.report.guid, { status });
};


const formatDate = (dateString: string | null) => dateString ? new Date(dateString).toLocaleString() : 'N/A';
const getStatusType = (status: string) => { switch (status) { case 'APPROVED': return 'success'; case 'REJECTED': return 'danger'; case 'SUBMITTED': return 'warning'; default: return 'info'; } };
const getStatusText = (status: string) => { switch (status) { case 'APPROVED': return '已批准'; case 'REJECTED': return '已拒绝'; case 'SUBMITTED': return '待审批'; default: return '未知'; } };
</script>

<style scoped>
.expense-detail-dialog {
    position: relative;
    --el-dialog-padding-primary: 0;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 20px;
    z-index: 10;
    background: rgba(30, 41, 59, 0.6) !important;
    border: 1px solid rgba(74, 158, 255, 0.2) !important;
    color: #a1ffef !important;
}

.close-btn:hover {
    background: rgba(74, 158, 255, 0.2) !important;
    border-color: rgba(74, 158, 255, 0.4) !important;
}

.detail-content {
    padding: 30px 30px 0 30px;
    color: #e2e8f0;
}

.content-title {
    margin: 0 0 24px 0;
    font-size: 20px;
    font-weight: 600;
    background: linear-gradient(135deg, #4a9eff 0%, #a1ffef 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.main-info-table {
    margin-bottom: 24px;
}

.main-info-table :deep(.el-table__row) {
    height: 48px;
}

.main-info-table :deep(.el-table__cell) {
    border-bottom: 1px dashed rgba(74, 158, 255, 0.15);
}

.main-info-table :deep(.el-table__cell:first-child) {
    color: #94a3b8;
    font-weight: 500;
}

.sub-title {
    margin: 24px 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #a1ffef;
    border-left: 3px solid #4a9eff;
    padding-left: 10px;
}

.entries-table :deep(.el-table__header-wrapper) {
    border-radius: 12px 12px 0 0;
}

.entries-table :deep(.el-table__body-wrapper) {
    border-radius: 0 0 12px 12px;
}

.amount-cell {
    font-family: 'Courier New', Courier, monospace;
    font-weight: 600;
    color: #4a9eff;
}

.loading-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: #94a3b8;
}

.loading-placeholder .el-icon {
    font-size: 24px;
    margin-bottom: 10px;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px 30px 30px 30px;
    border-top: 1px solid rgba(74, 158, 255, 0.1);
}
</style>
