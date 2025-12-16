<template>
    <!-- 客户列表 -->
    <el-table v-loading="isLoading" :data="customers" stripe style="width: 100%">
        <el-table-column prop="name" label="客户名称" min-width="150" />
        <el-table-column prop="id" label="客户编号/税号" width="150" />
        <el-table-column prop="notes" label="备注" show-overflow-tooltip min-width="200" />
        <el-table-column label="状态" width="100" text-align="center">
            <template #default="{ row }">
                <el-tag :type="row.active ? 'success' : 'danger'">
                    {{ row.active ? '启用' : '删除' }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
                <el-button class="handle_button" size="small" @click="$emit('edit', row)">编辑</el-button>
                <el-popconfirm title="确定要删除这个客户吗?" @confirm="$emit('delete', row.guid)">
                    <template #reference>
                        <el-button class="handle_button" size="small" type="danger">删除</el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import type { Customer } from '@/types/customer'

interface Props {
    customers: Customer[]
    isLoading: boolean
}
defineProps<Props>()

defineEmits<{
    edit: [customer: Customer]
    delete: [guid: string]
}>()
</script>
