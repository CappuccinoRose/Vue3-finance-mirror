<template>
    <!-- 如果提供了 custom-content，则渲染插槽内容，否则渲染默认按钮 -->
    <el-button v-if="!customContent" :loading="loading" :type="type" :size="size" @click="handlePost">
        {{ buttonText }}
    </el-button>
    <!-- 自定义内容模式，用于下拉菜单 -->
    <span v-else @click="handlePost">
        <slot />
    </span>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { postDocument } from '@/api/document_posting';
import type { DocumentPostingResponse } from '@/types/document_posting';
import { DocumentType } from '@/types/document_posting';

// 定义 props
const props = withDefaults(defineProps<{
    documentType: string;
    documentGuid: string;
    buttonText?: string;
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'large' | 'default' | 'small';
    customContent?: boolean;
}>(), {
    buttonText: '过账',
    type: 'primary',
    size: 'default',
    customContent: false,
});

const emit = defineEmits<{
    (e: 'success', result: DocumentPostingResponse): void;
    (e: 'error', error: any): void;
}>();

const loading = ref(false);

const handlePost = async () => {
    if (loading.value) return;

    try {
        await ElMessageBox.confirm('确认过账此单据吗？过账后将生成会计凭证，且不可逆。', '确认过账', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        });

        loading.value = true;

        // 在调用 API 前，将字符串转换为枚举成员
        let docTypeEnum: DocumentType;
        if (props.documentType === 'invoice') {
            docTypeEnum = DocumentType.INVOICE;
        } else if (props.documentType === 'purchase_bill') {
            docTypeEnum = DocumentType.PURCHASE_BILL;
        } else {
            throw new Error(`未知的 document_type: ${props.documentType}`);
        }

        const result = await postDocument({
            document_type: docTypeEnum,
            document_guid: props.documentGuid,
        });

        ElMessage.success(result.message || '过账成功！');
        emit('success', result);
    } catch (error: any) {
        if (error !== 'cancel') {
            ElMessage.error(error.message || '过账失败');
            emit('error', error);
        }
    } finally {
        loading.value = false;
    }
};
</script>
<style>
span {
    cursor: pointer;
    display: flex;
    align-items: center;
}

span:hover {
    color: var(--el-color-primary);
}
</style>
