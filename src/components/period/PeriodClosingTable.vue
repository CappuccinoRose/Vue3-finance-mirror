<template>
    <!-- 期末结转记录列表 -->
    <el-table :data="history" v-loading="loading" style="width: 100%" stripe row-key="guid">
        <el-table-column prop="period_end_date" label="会计期间" min-width="120" />
        <el-table-column prop="created_at" label="结转日期" width="180" />
        <el-table-column prop="status" label="状态" width="150">
            <template #default="scope">
                <el-tag :type="getStatusTagType(scope.row.status)">
                    {{ getStatusText(scope.row.status) }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="owner_name" label="操作人" min-width="100" />
        <!-- 操作列 -->
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
                            <el-dropdown-item v-if="scope.row.status === 'failed'" command="retry" divided>
                                <el-icon>
                                    <RefreshRight />
                                </el-icon>重试
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { MoreFilled, View, RefreshRight } from '@element-plus/icons-vue';
import type { PeriodClosing } from '@/types/period_closing';

const props = defineProps<{
    history: PeriodClosing[];
    loading: boolean;
}>();

const emit = defineEmits<{
    (e: 'view-details', guid: string): void;
    (e: 'retry', guid: string): void;
}>();

// 处理下拉菜单命令的函数
const handleCommand = (command: string, row: PeriodClosing) => {
    switch (command) {
        case 'view':
            emit('view-details', row.guid);
            break;
        case 'retry':
            emit('retry', row.guid);
            break;
    }
};

// 状态标签类型
const getStatusTagType = (status: string) => {
    switch (status) {
        case 'completed':
            return 'success';
        case 'failed':
            return 'danger';
        case 'in_progress':
            return 'warning';
        default:
            return 'info';
    }
};

// 状态文本
const getStatusText = (status: string) => {
    switch (status) {
        case 'completed':
            return '成功';
        case 'failed':
            return '失败';
        case 'in_progress':
            return '进行中';
        default:
            return '未知';
    }
};
</script>
