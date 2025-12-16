<template>
    <!-- 期末结转详情 -->
    <el-drawer v-model="drawerVisible" title="结转凭证详情" direction="rtl" size="50%">
        <div v-if="detail" class="detail-content">
            <el-table :data="detailRows" :style="{ width: '100%' }" :show-header="false">
                <el-table-column prop="label" label="属性" width="120" />
                <el-table-column prop="value" label="值" />
            </el-table>

            <el-divider />
            <h4>分录明细</h4>
            <el-table :data="detail.splits" :style="{ width: '100%' }" stripe>
                <el-table-column prop="account.name" label="科目" width="200" />
                <el-table-column prop="memo" label="摘要" />
                <el-table-column prop="value" label="金额" width="120" text-align="right">
                    <template #default="scope">
                        {{ Number(scope.row.value).toFixed(2) }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-else class="detail-loading">
            <el-skeleton :rows="5" animated />
        </div>
    </el-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ElDrawer, ElTable, ElTableColumn, ElDivider, ElSkeleton } from 'element-plus';
import type { Transaction } from '@/types/period_closing';

// --- Props ---
interface Props {
    visible: boolean;
    detail: Transaction | null;
}

const props = withDefaults(defineProps<Props>(), {
    visible: false,
    detail: null,
});

// --- Emits ---
const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
}>();

// --- 内部状态 ---
const drawerVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value),
});

// --- 计算属性 ---
const parsedDescription = computed(() => {
    if (!props.detail || !props.detail.description) {
        return null;
    }
    const desc = props.detail.description;
    const jsonStartIndex = desc.indexOf('{');
    if (jsonStartIndex === -1) {
        return null;
    }
    try {
        const jsonString = desc.substring(jsonStartIndex);
        return JSON.parse(jsonString);
    } catch (e) {
        return null;
    }
});

const displayDescription = computed(() => {
    const parsed = parsedDescription.value;
    if (!parsed || typeof parsed !== 'object') {
        return null;
    }
    return Object.keys(parsed).reduce((result, key) => {
        result[key] = `${parsed[key]}`;
        return result;
    }, {} as { [key: string]: string });
});

const detailRows = computed(() => {
    if (!props.detail) return [];

    const rows = [
        { label: '凭证 GUID', value: props.detail.guid },
        { label: '过账日期', value: props.detail.post_date },
    ];

    // 如果描述可以被解析，则将其展开为多行
    if (displayDescription.value) {
        rows.push({ label: '描述', value: '' }); // 值为空，因为具体内容在下面

        // 遍历解析后的描述，为每一项创建一行
        for (const key in displayDescription.value) {
            const formattedKey = formatDescriptionKey(key);
            const value = displayDescription.value[key];
            // label 为空，value 为具体的键值对，实现缩进效果
            rows.push({ label: '', value: `${formattedKey}: ${value}` });
        }
    } else {
        // 如果无法解析，则直接显示原始描述
        rows.push({ label: '描述', value: props.detail.description || '' });
    }

    return rows;
});


// --- 方法 ---
const formatDescriptionKey = (key: string): string => {
    const keyMap: { [key: string]: string } = {
        type: '结转类型',
        period: '会计期间',
        status: '状态',
        owner_guid: '操作人GUID',
    };
    return keyMap[key] || key;
};
</script>

<style scoped>
.detail-content {
    padding: 0 20px;
}

.detail-loading {
    padding: 20px;
}

:deep(.el-divider) {
    border-color: rgba(74, 158, 255, 0.2);
    margin: 24px 0;
}

.detail-content h4 {
    color: #e2e8f0;
    font-weight: 600;
    margin-bottom: 16px;
}

.detail-content .el-table:first-child {
    --el-table-border-color: rgba(74, 158, 255, 0.1);
    --el-table-header-bg-color: rgba(74, 158, 255, 0.05);
    --el-table-row-hover-bg-color: rgba(74, 158, 255, 0.05);
    --el-table-text-color: #e2e8f0;
}

:deep(.detail-content .el-table:first-child .el-table__body-wrapper .el-table__body tr td:first-child:empty) {
    padding-left: 24px;
}

:deep(.detail-content .el-table:first-child .el-table__body-wrapper .el-table__body tr td:not(:first-child):empty) {
    border-right-color: transparent;
}

:deep(.detail-content .el-table:last-of-type) {
    --el-table-border-color: rgba(74, 158, 255, 0.1);
    --el-table-header-bg-color: rgba(74, 158, 255, 0.05);
    --el-table-row-hover-bg-color: rgba(74, 158, 255, 0.05);
    --el-table-text-color: #e2e8f0;
}

:deep(.detail-content .el-table:last-of-type th.el-table__cell > .cell) {
    color: var(--el-table-header-text-color);
    font-weight: 700;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
