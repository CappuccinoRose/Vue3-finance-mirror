<template>
    <!-- 采购列表 -->
    <el-table :data="purchaseBills" v-loading="loading" style="width: 100%" stripe row-key="guid">
        <el-table-column prop="status" label="状态" width="100" text-align="center">
            <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                    {{ getStatusText(scope.row.status) }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="bill_number" label="账单号" min-width="120" />
        <el-table-column label="供应商" min-width="120">
            <template #default="scope">{{ scope.row.vendor?.name || 'N/A' }}</template>
        </el-table-column>
        <el-table-column prop="bill_date" label="账单日期" width="120" text-align="center" />
        <el-table-column prop="due_date" label="到期日" width="120" text-align="center">
            <template #default="scope">{{ scope.row.due_date || 'N/A' }}</template>
        </el-table-column>
        <el-table-column label="总金额" width="120" text-align="right">
            <template #default="scope">¥{{ Number(scope.row.total_amount).toFixed(2) }}</template>
        </el-table-column>

        <!-- 过账操作 -->
        <el-table-column label="操作" width="120" fixed="right" text-align="center">
            <template #default="scope">
                <el-dropdown trigger="click" @command="handleCommand($event, scope.row)">
                    <el-button text type="primary" :icon="MoreFilled" circle />
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="view">
                                <el-icon>
                                    <View />
                                </el-icon>查看详情
                            </el-dropdown-item>
                            <el-dropdown-item command="edit" :disabled="scope.row.status === 'posted'">
                                <el-icon>
                                    <Edit />
                                </el-icon>编辑
                            </el-dropdown-item>

                            <el-dropdown-item v-if="!scope.row.post_txn_guid && scope.row.status === 'confirmed'"
                                command="post" divided>
                                <DocumentPostingButton :document-type="DocumentType.PURCHASE_BILL"
                                    :document-guid="scope.row.guid" button-text="" @success="handlePostingSuccess"
                                    custom-content>
                                    <el-icon>
                                        <Check />
                                    </el-icon>过账
                                </DocumentPostingButton>
                            </el-dropdown-item>
                            <el-dropdown-item command="cancel"
                                :disabled="scope.row.status === 'posted' || scope.row.status === 'cancelled'">
                                <el-icon>
                                    <Close />
                                </el-icon>取消
                            </el-dropdown-item>
                            <el-dropdown-item command="delete" :disabled="scope.row.status === 'posted'" divided>
                                <el-icon>
                                    <Delete />
                                </el-icon>删除
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </template>
        </el-table-column>

        <el-table-column label="过账状态" width="110" text-align="center">
            <template #default="scope">
                <el-tag v-if="scope.row.post_txn_guid" type="success">已过账</el-tag>
                <el-tag v-else type="info">未过账</el-tag>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import type { PurchaseBillSummary } from '@/types/purchase_bill';
import { MoreFilled, View, Edit, Check, Close, Delete } from '@element-plus/icons-vue';
import DocumentPostingButton from '@/components/common/DocumentPostingButton.vue';
import { DocumentType } from '@/types/document_posting';

const props = defineProps<{ purchaseBills: PurchaseBillSummary[]; loading: boolean; }>();

const emit = defineEmits<{
    (e: 'view-details', bill: PurchaseBillSummary): void;
    (e: 'edit', bill: PurchaseBillSummary): void;
    (e: 'post', bill: PurchaseBillSummary): void;
    (e: 'cancel', bill: PurchaseBillSummary): void;
    (e: 'delete', bill: PurchaseBillSummary): void;
    (e: 'refresh-data'): void;
}>();

const handleCommand = (command: string, row: PurchaseBillSummary) => {
    switch (command) {
        case 'view':
            emit('view-details', row);
            break;
        case 'edit':
            emit('edit', row);
            break;
        case 'post':
            break;
        case 'cancel':
            emit('cancel', row);
            break;
        case 'delete':
            emit('delete', row);
            break;
    }
};

const handlePostingSuccess = () => {
    emit('refresh-data');
};

const getStatusType = (status: string) => {
    switch (status) {
        case 'draft': return 'info';
        case 'confirmed': return 'warning';
        case 'posted': return 'success';
        case 'cancelled': return 'danger';
        default: return 'info';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'draft': return '草稿';
        case 'confirmed': return '已确认';
        case 'posted': return '已过账';
        case 'cancelled': return '已取消';
        default: return status;
    }
};
</script>
