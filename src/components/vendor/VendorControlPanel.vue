<template>
    <div class="panel-content">
        <div class="left">
            <!-- 搜索框 -->
            <div class="filters">
                <el-input v-model="searchInput" placeholder="搜索供应商名称或编号..." style="width: 300px; margin-right: 16px;"
                    clearable @input="onSearchInput">
                    <template #prefix>
                        <el-icon>
                            <Search />
                        </el-icon>
                    </template>
                </el-input>
            </div>
        </div>
        <div class="right">
            <!-- 新增按钮 -->
            <el-button type="primary" @click="handleCreateNew">
                <el-icon>
                    <Plus />
                </el-icon>
                新增供应商
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'

const emit = defineEmits<{
    search: [query: string]
    'create-new': []
}>()

const searchInput = ref('')
const statusFilter = ref('')

// 防抖函数，避免频繁触发搜索
let searchTimeout: number | undefined
const triggerSearch = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        // 👇 修改：只传递搜索文本，不传递 status
        emit('search', searchInput.value)
    }, 300) // 300ms 防抖
}

const onSearchInput = () => {
    triggerSearch()
}

const handleCreateNew = () => {
    emit('create-new')
}
</script>

<style scoped>
.panel-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 16px;
    background-color: var(--el-bg-color-page);
    border-radius: 8px;
}
</style>
