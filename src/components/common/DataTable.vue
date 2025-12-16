<template>
  <div class="data-table-container">
    <el-table :data="data" :loading="loading" :columns="columns" :height="tableHeight" stripe class="custom-table"
      @selection-change="handleSelectionChange">
      <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label"
        :width="column.width" :formatter="column.formatter" :sortable="column.sortable" />
      <el-table-column v-if="showActions" label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" link @click="handleEdit(row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-if="showPagination" v-model:current-page="currentPage" v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]" :total="total" layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Column {
  prop: string
  label: string
  width?: string | number
  formatter?: (row: any, column: any, cellValue: any) => string
  sortable?: boolean | 'custom'
}

interface Props {
  data: any[]
  columns: Column[]
  loading?: boolean
  showActions?: boolean
  showPagination?: boolean
  total?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showActions: false,
  showPagination: true,
  total: 0
})

const emit = defineEmits<{
  edit: [row: any]
  delete: [row: any]
  selectionChange: [selection: any[]]
  sizeChange: [size: number]
  currentChange: [current: number]
}>()

const currentPage = ref(1)
const pageSize = ref(10)

// 计算表格的动态高度
const tableHeight = computed(() => {
  const headerHeight = 40
  const rowHeight = 48
  const rowCount = props.data ? props.data.length : 0
  // 总高度 = 表头高度 + (行数 * 行高)
  return headerHeight + rowCount * rowHeight
})

const handleEdit = (row: any) => {
  emit('edit', row)
}

const handleDelete = (row: any) => {
  emit('delete', row)
}

const handleSelectionChange = (selection: any[]) => {
  emit('selectionChange', selection)
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  emit('sizeChange', size)
}

const handleCurrentChange = (current: number) => {
  currentPage.value = current
  emit('currentChange', current)
}
</script>

<style scoped>
.data-table-container {
  background: rgba(15, 23, 42, 0.8);
  border-radius: 12px;
  padding: 16px 8px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(74, 158, 255, 0.2);
}

.custom-table {
  background: transparent;
  width: 100%;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

:deep(.el-table) {
  background: transparent;
}

:deep(.el-table__header-wrapper) {
  background: rgba(74, 158, 255, 0.05);
}

:deep(.el-table th) {
  background: rgba(74, 158, 255, 0.05);
  color: #e2e8f0;
  border-color: rgba(74, 158, 255, 0.1);
}

:deep(.el-table td) {
  border-color: rgba(74, 158, 255, 0.1);
  color: #4a9eff;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background: rgba(74, 158, 255, 0.02);
}

:deep(.el-table td.el-table__cell) {
  color: #1e293b !important;
  font-weight: 500;
}

:deep(.el-table td.el-table__cell .cell) {
  color: #1e293b !important;
}

:deep(.el-pagination) {
  --el-pagination-button-bg-color: rgba(30, 41, 59, 0.6);
  --el-pagination-hover-color: #4a9eff;
  --el-pagination-text-color: #e2e8f0;
}
</style>
