<template>
    <div class="panel-content">
        <!-- 搜索框 -->
        <div class="left">
            <div class="filters">
                <el-input v-model="searchInput" placeholder="搜索员工姓名或编号..." style="width: 300px; margin-right: 16px;"
                    clearable @input="onSearchInput">
                    <template #prefix>
                        <el-icon>
                            <Search />
                        </el-icon>
                    </template>
                </el-input>
            </div>
        </div>
        <!-- 新增按钮 -->
        <div class="right">
            <el-button type="primary" @click="handleCreateNew">
                <el-icon>
                    <Plus />
                </el-icon>
                新增员工
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'

const emit = defineEmits<{
    search: [query: { text: string; status: string }]
    'create-new': []
}>()

const searchInput = ref('')
const statusFilter = ref('')

// 防抖函数，避免频繁触发搜索
let searchTimeout: number | undefined
const triggerSearch = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        emit('search', { text: searchInput.value, status: statusFilter.value })
    }, 300) // 300ms 防抖
}

// 搜索框输入事件
const onSearchInput = () => {
    triggerSearch()
}


// 新建按钮点击事件
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
