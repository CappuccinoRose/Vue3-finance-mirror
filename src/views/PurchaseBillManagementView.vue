<template>
    <div class="purchase-bill-management-view">
        <h1>采购账单管理</h1>
        <PurchaseBillControlPanel @search="handleSearch" @create-new="handleCreateNew" />
        <PurchaseBillTable :purchase-bills="allBills" :loading="loading" @view-details="handleViewDetails"
            @edit="handleEdit" @post="handlePost" @cancel="handleCancel" @delete="handleDelete" />

        <!-- 编辑/新建表单对话框 -->
        <el-dialog v-model="isFormDialogVisible" :title="formDialogTitle" width="60%" destroy-on-close
            @close="resetForm">
            <PurchaseBillForm v-if="isFormDialogVisible" ref="formRef" :is-edit="formMode === 'edit'"
                :form-data="formDataForForm" />
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="isFormDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit" :loading="isSubmitting">确定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 查看详情对话框 -->
        <el-dialog v-model="isDetailDialogVisible" title="采购账单详情" width="60%">
            <div v-if="selectedBillDetail" class="bill-detail-content">
                <el-descriptions :column="2"  style="width: 90%; margin: 0 auto;">
                    <el-descriptions-item label="账单号">{{ selectedBillDetail.bill_number }}</el-descriptions-item>
                    <el-descriptions-item label="供应商">{{ selectedBillDetail.vendor?.name || 'N/A'
                        }}</el-descriptions-item>
                    <el-descriptions-item label="账单日期">{{ selectedBillDetail.bill_date }}</el-descriptions-item>
                    <el-descriptions-item label="到期日">{{ selectedBillDetail.due_date || 'N/A' }}</el-descriptions-item>
                    <el-descriptions-item label="状态">
                        <el-tag :type="getStatusType(selectedBillDetail.status)">{{
                            getStatusText(selectedBillDetail.status)
                            }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="总金额">¥{{ Number(selectedBillDetail.total_amount).toFixed(2)
                        }}</el-descriptions-item>
                    <el-descriptions-item label="备注" :span="2">{{ selectedBillDetail.notes || 'N/A'
                        }}</el-descriptions-item>
                </el-descriptions>
            </div>
            <span v-else>加载中...</span>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAccountsPayable } from '@/composables/useAccountsPayable';
import type { PurchaseBillSummary, PurchaseBillCreate, PurchaseBillUpdate } from '@/types/purchase_bill';
import PurchaseBillControlPanel from '@/components/purchase_bill/PurchaseBillControlPanel.vue';
import PurchaseBillTable from '@/components/purchase_bill/PurchaseBillTable.vue';
import PurchaseBillForm from '@/components/forms/PurchaseBillForm.vue';

// 使用 Composable
const { allBills, loading, refresh, create, update, post, cancel, remove, getBill } = useAccountsPayable();
const isFormDialogVisible = ref(false);
const formMode = ref<'create' | 'edit'>('create');
const currentBill = ref<PurchaseBillSummary | undefined>();
const formRef = ref();
const isSubmitting = ref(false);

const formDialogTitle = computed(() => (formMode.value === 'create' ? '新建采购账单' : '编辑采购账单'));

const formDataForForm = computed((): PurchaseBillCreate | PurchaseBillUpdate | null => {
    if (!currentBill.value) {
      
        return null;
    }
 
    const { vendor_guid, bill_number, bill_date, due_date, total_amount, notes, status } = currentBill.value;
    return {
        vendor_guid,
        bill_number,
        bill_date,
        due_date,
        total_amount,
        notes,
        status,
    };
});


const isDetailDialogVisible = ref(false);
const selectedBillDetail = ref<PurchaseBillSummary | null>(null);

onMounted(() => {
    refreshData();
});

const refreshData = () => {
    refresh();
};

const handleSearch = (query: { text: string; status: string }) => {
    const params: any = {};
    if (query.text) params.search = query.text;
    if (query.status) params.status = query.status;
    refresh(params);
};

const handleCreateNew = () => {
    formMode.value = 'create';
    currentBill.value = undefined;
    isFormDialogVisible.value = true;
};

const resetForm = () => {
    currentBill.value = undefined;
};

const handleViewDetails = async (bill: PurchaseBillSummary) => {
    isDetailDialogVisible.value = true;
    selectedBillDetail.value = null;
    try {
        selectedBillDetail.value = await getBill(bill.guid);
    } catch (error: any) {
        ElMessage.error(error.message || '获取账单详情失败');
        isDetailDialogVisible.value = false;
    }
};

const handleEdit = async (bill: PurchaseBillSummary) => {
    formMode.value = 'edit';
    try {
        const billData = await getBill(bill.guid);
        currentBill.value = billData ?? undefined;
        isFormDialogVisible.value = true;
    } catch (error: any) {
        ElMessage.error(error.message || '获取账单信息失败，无法编辑');
    }
};

const handleSubmit = async () => {
    if (!formRef.value) return;
    isSubmitting.value = true;
    try {
      
        const isValid = await formRef.value.validate();
        if (!isValid) {
          
            return;
        }

        const payload = formRef.value.getFormData();

        if (formMode.value === 'create') {
            await create(payload as PurchaseBillCreate);
            ElMessage.success('创建成功');
        } else {
            await update(currentBill.value!.guid, payload as PurchaseBillUpdate);
            ElMessage.success('更新成功');
        }
        isFormDialogVisible.value = false;
        refreshData();
    } catch (error: any) {
        // 处理 409 Conflict 错误
        if (error.response?.status === 409) {
            ElMessage.error(error.response.data.detail || '账单号已存在，请更换后重试。');
        } else {
            ElMessage.error(error.message || '操作失败');
        }
    } finally {
        isSubmitting.value = false;
    }
};


const handlePost = async (bill: PurchaseBillSummary) => {
    try {
        await ElMessageBox.confirm(`确认过账账单 "${bill.bill_number}" 吗？`, '确认操作', { type: 'warning' });
        await post(bill.guid);
        ElMessage.success('账单过账成功');
        refreshData();
    } catch (error: any) {
        if (error !== 'cancel') ElMessage.error(error.message || '过账失败');
    }
};

const handleCancel = async (bill: PurchaseBillSummary) => {
    try {
        await ElMessageBox.confirm(`确认取消账单 "${bill.bill_number}" 吗？`, '确认操作', { type: 'warning' });
        await cancel(bill.guid);
        ElMessage.success('账单取消成功');
        refreshData();
    } catch (error: any) {
        if (error !== 'cancel') ElMessage.error(error.message || '取消失败');
    }
};

const handleDelete = async (bill: PurchaseBillSummary) => {
    try {
        await ElMessageBox.confirm(`确认删除账单 "${bill.bill_number}" 吗？此操作不可恢复。`, '确认删除', {
            type: 'error', confirmButtonText: '删除', confirmButtonClass: 'el-button--danger',
        });
        await remove(bill.guid);
        ElMessage.success('账单删除成功');
        refreshData();
    } catch (error: any) {
        if (error !== 'cancel') ElMessage.error(error.message || '删除失败');
    }
};


const getStatusType = (status: string) => {
    switch (status) { case 'draft': return 'info'; case 'confirmed': return 'warning'; case 'posted': return 'success'; case 'cancelled': return 'danger'; default: return 'info'; }
};
const getStatusText = (status: string) => {
    switch (status) { case 'draft': return '草稿'; case 'confirmed': return '已确认'; case 'posted': return '已过账'; case 'cancelled': return '已取消'; default: return status; }
};
</script>

<style scoped>
.purchase-bill-management-view h1 {
    margin-bottom: 24px;
    font-size: 24px;
    font-weight: 600;
}

.bill-detail-content .el-descriptions {
    margin-bottom: 20px;
}
</style>
