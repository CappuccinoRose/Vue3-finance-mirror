<template>
    <!-- 费用列表 -->
    <el-table v-loading="loading" :data="reports" stripe>
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="total_amount" label="总金额" :formatter="formatCurrency" width="120" />
        <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="submitted_at" label="提交时间" :formatter="formatDate" width="160" />
        <el-table-column label="操作" width="160" fixed="right">
            <template #default="{ row }">
                <el-button size="small" @click="$emit('view', row)">查看</el-button>
                <el-button v-if="row.status === 'SUBMITTED'" size="small" type="success"
                    @click="$emit('approve', row.guid, { status: 'APPROVED' })">批准</el-button>
                <el-button v-if="row.status === 'SUBMITTED'" size="small" type="danger"
                    @click="$emit('approve', row.guid, { status: 'REJECTED' })">拒绝</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import type { ExpenseReport } from '@/types/employee';

defineProps<{
    reports: ExpenseReport[];
    loading: boolean;
}>();

defineEmits<{
    view: [report: ExpenseReport];
    approve: [guid: string, payload: { status: 'APPROVED' | 'REJECTED' }];
}>();

const formatCurrency = (row: ExpenseReport) => `¥${row.total_amount.toFixed(2)}`;
const formatDate = (row: ExpenseReport) => new Date(row.submitted_at || '').toLocaleString();
const getStatusType = (status: string) => {
    switch (status) { case 'APPROVED': return 'success'; case 'REJECTED': return 'danger'; case 'SUBMITTED': return 'warning'; default: return 'info'; }
};
const getStatusText = (status: string) => {
    switch (status) { case 'APPROVED': return '已批准'; case 'REJECTED': return '已拒绝'; case 'SUBMITTED': return '待审批'; default: return '未知'; }
};
</script>
