<template>
    <!-- 销售列表 -->
    <el-table :data="invoices" v-loading="loading" style="width: 100%" stripe row-key="guid">
        <el-table-column prop="active" label="状态" width="80" text-align="center">
            <template #default="scope">
                <el-tag :type="scope.row.active ? 'success' : 'danger'">
                    {{ scope.row.active ? '正常' : '已作废' }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="id" label="发票号" min-width="110" />
        <el-table-column label="客户" min-width="100">
            <template #default="scope">{{ scope.row.customer?.name || 'N/A' }}</template>
        </el-table-column>
        <el-table-column prop="date_posted" label="开票日期" width="180" text-align="center" />
        <el-table-column prop="date_due" label="到期日" width="180" text-align="center">
            <template #default="scope">{{ scope.row.date_due || 'N/A' }}</template>
        </el-table-column>
        <el-table-column label="总金额" width="120" text-align="right">
            <template #default="scope">¥{{ calculateTotal(scope.row.entries).toFixed(2) }}</template>
        </el-table-column>

        <!-- 【重构】操作下拉菜单，集成了过账操作 -->
        <el-table-column label="操作" width="80" fixed="right" text-align="center">
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
                            <el-dropdown-item command="edit">
                                <el-icon>
                                    <Edit />
                                </el-icon>编辑
                            </el-dropdown-item>
                            <el-dropdown-item command="send">
                                <el-icon>
                                    <Promotion />
                                </el-icon>发送
                            </el-dropdown-item>
                            <!-- 【重构】过账操作移入下拉菜单，并集成 DocumentPostingButton -->
                            <el-dropdown-item v-if="!scope.row.post_txn && scope.row.active" command="post" divided>
                                <DocumentPostingButton :document-type="DocumentType.INVOICE"
                                    :document-guid="scope.row.guid" button-text="" @success="handlePostingSuccess"
                                    custom-content>
                                    <el-icon>
                                        <Check />
                                    </el-icon>过账
                                </DocumentPostingButton>
                            </el-dropdown-item>
                            <!-- 根据 active 状态显示不同选项 -->
                            <el-dropdown-item v-if="scope.row.active" command="void" divided>
                                <el-icon>
                                    <WarningFilled />
                                </el-icon>作废
                            </el-dropdown-item>
                            <el-dropdown-item v-else command="unvoid" divided>
                                <el-icon><Select /></el-icon>取消作废
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </template>
        </el-table-column>

        <!-- 【重构】新增过账状态列，仅用于显示 -->
        <el-table-column label="过账状态" width="110" text-align="center">
            <template #default="scope">
                <el-tag v-if="scope.row.post_txn" type="success">已过账</el-tag>
                <el-tag v-else type="info">未过账</el-tag>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Invoice } from '@/types/invoice';
import { MoreFilled, View, Edit, Promotion, WarningFilled, Select, Check } from '@element-plus/icons-vue';
import DocumentPostingButton from '@/components/common/DocumentPostingButton.vue';
import { DocumentType } from '@/types/document_posting';

const props = defineProps<{ invoices: Invoice[]; loading: boolean; }>();

const emit = defineEmits<{
    (e: 'view-details', invoice: Invoice): void;
    (e: 'edit', invoice: Invoice): void;
    (e: 'send', invoice: Invoice): void;
    (e: 'void', invoice: Invoice): void;
    (e: 'unvoid', invoice: Invoice): void;
    (e: 'refresh-data'): void;
}>();

const handleCommand = (command: string, row: Invoice) => {
    switch (command) {
        case 'view':
            emit('view-details', row);
            break;
        case 'edit':
            emit('edit', row);
            break;
        case 'send':
            emit('send', row);
            break;
        case 'post':
            break;
        case 'void':
            emit('void', row);
            break;
        case 'unvoid':
            emit('unvoid', row);
            break;
    }
};

const handlePostingSuccess = () => {
    emit('refresh-data');
};

const calculateTotal = (entries: any[]) => {
    if (!entries || entries.length === 0) return 0;
    return entries.reduce((total, entry) => total + (Number(entry.price) * entry.quantity_num), 0);
};
</script>
