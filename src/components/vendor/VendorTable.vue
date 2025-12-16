<template>
    <!-- 供应商列表 -->
    <el-table class="table-card" v-loading="loading" :data="vendors" stripe style="width: 100%">
        <el-table-column property="name" label="供应商名称" min-width="90" />
        <el-table-column property="id" label="编号/税号" min-width="60" />
        <el-table-column property="notes" label="备注" show-overflow-tooltip min-width="120" />
        <el-table-column label="状态" width="100">
            <template #default="{ row }">
                <el-tag :type="row.active ? 'success' : 'danger'">
                    {{ row.active ? '启用' : '禁用' }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
                <el-button class="handle_button" size="small" @click="$emit('edit', row)">编辑</el-button>
                <el-popconfirm title="确定要删除这个供应商吗?" @confirm="$emit('delete', row)">
                    <template #reference>
                        <el-button class="handle_button" size="small" type="danger">删除</el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import type { Vendor } from '@/types/vendor';

defineProps<{
    vendors: Vendor[];
    loading: boolean;
}>();

defineEmits<{
    edit: [vendor: Vendor];
    delete: [vendor: Vendor];
}>();
</script>

<style scoped>
.table-card {
    border-radius: 16px;
}

.handle_button {
    margin-right: 8px;
}

.handle_button:last-child {
    margin-right: 0;
}
</style>
