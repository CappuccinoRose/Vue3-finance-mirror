<template>
    <div class="panel-content">
        <div class="left">
            <!-- 搜索框 -->
            <el-input v-model="searchInput" placeholder="搜索客户名称/编号..." style="width: 300px; margin-left: 20px;"
                clearable @input="onSearchInput">
                <template #prefix>
                    <el-icon>
                        <Search />
                    </el-icon>
                </template>
            </el-input>
        </div>
        <div class="right">
            <!-- 新增按钮 -->
            <el-button type="primary" @click="handleCreate">
                <el-icon>
                    <Plus />
                </el-icon>
                新增客户
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

// 防抖搜索
let searchTimeout: number | undefined
const onSearchInput = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        emit('search', searchInput.value)
    }, 300)
}

const handleCreate = () => {
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
