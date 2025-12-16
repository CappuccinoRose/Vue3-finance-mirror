<template>
    <div class="control-panel">
        <div class="left">
            <!-- 搜索框 -->
            <el-input v-model="searchInput" placeholder="搜索账单号/供应商..." style="width: 300px;" @input="onSearchInput"
                clearable>
                <template #prefix>
                    <el-icon>
                        <Search />
                    </el-icon>
                </template>
            </el-input>
            <el-select v-model="statusFilter" placeholder="筛选状态" style="width: 150px; margin-left: 10px;" clearable
                @change="onStatusFilterChange">
                <el-option label="草稿" value="draft" />
                <el-option label="已确认" value="confirmed" />
                <el-option label="已过账" value="posted" />
                <el-option label="已取消" value="cancelled" />
            </el-select>
        </div>
        <div class="right">
            <!-- 新增按钮 -->
            <el-button type="primary" @click="handleCreateNew">
                <el-icon>
                    <Plus />
                </el-icon>
                新建采购账单
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, Plus } from '@element-plus/icons-vue';

const emit = defineEmits<{
    search: [query: { text: string; status: string }];
    'create-new': [];
}>();

const searchInput = ref('');
const statusFilter = ref('');

const onSearchInput = () => {
    emit('search', { text: searchInput.value, status: statusFilter.value });
};

const onStatusFilterChange = () => {
    emit('search', { text: searchInput.value, status: statusFilter.value });
};

const handleCreateNew = () => {
    emit('create-new');
};
</script>

<style scoped>
.control-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 16px;
    background-color: var(--el-bg-color-page);
    border-radius: 8px;
}
</style>
