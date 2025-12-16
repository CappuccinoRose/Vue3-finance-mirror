<template>
    <!-- 员工列表 -->
    <el-table v-loading="loading" :data="employees" stripe>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="id" label="员工编号" />
        <el-table-column label="状态" width="100">
            <template #default="{ row }">
                <el-tag :type="row.active ? 'success' : 'danger'">
                    {{ row.active ? '启用' : '禁用' }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
                <el-button size="small" @click="$emit('edit', row)">编辑</el-button>
                <el-popconfirm title="确定要禁用这个员工吗?" @confirm="$emit('delete', row.guid)">
                    <template #reference>
                        <el-button size="small" type="danger">禁用</el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import type { Employee } from '@/types/employee';

defineProps<{
    employees: Employee[];
    loading: boolean;
}>();

defineEmits<{
    edit: [employee: Employee];
    delete: [guid: string];
}>();
</script>
