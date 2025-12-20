<template>
    <div class="invoice-management-view">
        <h1>销售发票管理</h1>
        <InvoiceControlPanel @search="handleSearch" @create-new="handleCreateNew" />
        <InvoiceTable :invoices="filteredInvoices" :loading="isLoading" @view-details="handleViewDetails"
            @edit="handleEdit" @send="handleSend" @void="handleVoid" @unvoid="handleUnvoid" />

        <el-dialog v-model="isFormDialogVisible" :title="dialogTitle" width="60%" @close="resetForm">
            <InvoiceForm ref="formRef" :mode="formMode" :initial-data="currentInvoice" />
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="isFormDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit" :loading="isSubmitting">确定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 查看详情对话框 -->
        <el-dialog v-model="isDetailDialogVisible" title="销售发票详情" width="60%">
            <div v-if="selectedInvoiceDetail" class="invoice-detail-content">
                <!-- 主要信息：添加边框，统一宽度 -->
                <el-descriptions :column="2" border style="width: 90%; margin: 0 auto;">
                    <el-descriptions-item label="发票号">{{ selectedInvoiceDetail.id }}</el-descriptions-item>
                    <el-descriptions-item label="客户">{{ selectedInvoiceDetail.customer?.name ?? 'N/A'
                        }}</el-descriptions-item>
                    <el-descriptions-item label="开票日期">{{ selectedInvoiceDetail.date_posted }}</el-descriptions-item>
                    <el-descriptions-item label="到期日">{{ selectedInvoiceDetail.date_due || 'N/A'
                        }}</el-descriptions-item>
                    <el-descriptions-item label="状态">
                        <el-tag :type="getStatusType(selectedInvoiceDetail)">
                            {{ getStatusText(selectedInvoiceDetail) }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="总金额">¥{{ calculateTotal(selectedInvoiceDetail.entries).toFixed(2)
                        }}</el-descriptions-item>
                    <el-descriptions-item label="备注" :span="2">{{ selectedInvoiceDetail.notes || 'N/A'
                        }}</el-descriptions-item>
                </el-descriptions>

                <!-- 明细项：添加分割线，统一宽度 -->
                <el-divider />
                <h4 style="text-align: center; margin-bottom: 16px;">明细项</h4>
                <el-table :data="selectedInvoiceDetail.entries" size="small" border style="width: 90%; margin: 0 auto;">
                    <el-table-column prop="description" label="描述" min-width="150" />
                    <el-table-column prop="quantity_num" label="数量" width="80" align="center" />
                    <el-table-column prop="price" label="单价" width="120" align="right">
                        <template #default="scope">¥{{ Number(scope.row.price).toFixed(2) }}</template>
                    </el-table-column>
                    <el-table-column label="小计" width="120" align="right">
                        <template #default="scope">¥{{ (Number(scope.row.price) * scope.row.quantity_num).toFixed(2)
                            }}</template>
                    </el-table-column>
                </el-table>
            </div>
            <span v-else>加载中...</span>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAccountsReceivable } from '@/composables/useAccountsReceivable';
import type { Invoice, InvoiceCreate, InvoiceUpdate } from '@/types/invoice';
import InvoiceControlPanel from '@/components/invoice/InvoiceControlPanel.vue';
import InvoiceTable from '@/components/invoice/InvoiceTable.vue';
import InvoiceForm from '@/components/forms/InvoiceForm.vue';

const { loadInvoices, getInvoiceById, sendInvoice, voidInvoice, unvoidInvoice, createInvoice, updateInvoice, isLoading } = useAccountsReceivable();

const allInvoices = ref<Invoice[]>([]);
const searchFilters = ref({ text: '', status: '' });
const isFormDialogVisible = ref(false);
const formMode = ref<'create' | 'edit'>('create');
const currentInvoice = ref<Invoice | undefined>();
const formRef = ref();
const isSubmitting = ref(false);
const isDetailDialogVisible = ref(false);
const selectedInvoiceDetail = ref<Invoice | null>(null);

const filteredInvoices = computed(() => {
    let filtered = allInvoices.value;
    if (searchFilters.value.text) {
        const query = searchFilters.value.text.toLowerCase();
        filtered = filtered.filter(invoice => invoice.id.toLowerCase().includes(query));
    }
    if (searchFilters.value.status) {
        if (searchFilters.value.status === 'void') {
            filtered = filtered.filter(invoice => !invoice.active);
        } else {
            filtered = filtered.filter(invoice => invoice.active);
        }
    }
    return filtered;
});

const dialogTitle = computed(() => (formMode.value === 'create' ? '新建销售发票' : '编辑销售发票'));

const fetchInvoices = async () => {
    try { allInvoices.value = await loadInvoices(); }
    catch (error) { ElMessage.error('获取销售发票列表失败'); }
};

const handleSearch = (filters: { text: string; status: string }) => { searchFilters.value = filters; };
const handleCreateNew = () => { formMode.value = 'create'; currentInvoice.value = undefined; isFormDialogVisible.value = true; };
const resetForm = () => { currentInvoice.value = undefined; };

const handleEdit = async (invoice: Invoice) => {
    formMode.value = 'edit';
    currentInvoice.value = await getInvoiceById(invoice.guid);
    isFormDialogVisible.value = true;
};

const handleSubmit = async () => {
    if (!formRef.value) return;
    isSubmitting.value = true;
    try {
        const payload = await formRef.value.formData;
        if (formMode.value === 'create') {
            await createInvoice(payload as InvoiceCreate);
            ElMessage.success('创建成功');
        } else {
            const { entries, ...mainData } = payload;
            await updateInvoice(currentInvoice.value!.guid, mainData as InvoiceUpdate);
            ElMessage.success('更新成功');
        }
        isFormDialogVisible.value = false;
        await fetchInvoices();
    } catch (error: any) {
        console.error('Submit failed:', error);
        if (error.response?.status === 409) {
            ElMessage.error(error.response.data.detail || '发票号已存在，请更换后重试。');
        } else {
            ElMessage.error(error.message || '操作失败，请检查输入或联系管理员。');
        }
    } finally {
        isSubmitting.value = false;
    }
};

const handleViewDetails = async (invoice: Invoice) => {
    isDetailDialogVisible.value = true;
    selectedInvoiceDetail.value = null;
    try { selectedInvoiceDetail.value = await getInvoiceById(invoice.guid); }
    catch (error) { ElMessage.error('获取发票详情失败'); isDetailDialogVisible.value = false; }
};

const handleSend = async (invoice: Invoice) => {
    try {
        await ElMessageBox.confirm(`确定要发送发票 "${invoice.id}" 吗？`, '确认发送', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' });
        await sendInvoice(invoice.guid);
        ElMessage.success('发送成功');
        await fetchInvoices();
    } catch (error: any) { if (error !== 'cancel') { ElMessage.error('发送失败'); } }
};

const handleVoid = async (invoice: Invoice) => {
    try {
        await ElMessageBox.confirm(`确定要作废发票 "${invoice.id}" 吗？此操作不可撤销。`, '警告', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' });
        await voidInvoice(invoice.guid);
        ElMessage.success('作废成功');
        await fetchInvoices();
    } catch (error: any) { if (error !== 'cancel') { ElMessage.error('作废失败'); } }
};

const handleUnvoid = async (invoice: Invoice) => {
    try {
        await ElMessageBox.confirm(`确定要取消作废发票 "${invoice.id}" 吗？`, '确认取消作废', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'success' });
        await unvoidInvoice(invoice.guid);
        ElMessage.success('取消作废成功');
        await fetchInvoices();
    } catch (error: any) { if (error !== 'cancel') { ElMessage.error('取消作废失败'); } }
};

// 辅助函数：计算总金额
const calculateTotal = (entries: any[]) => {
    if (!entries || entries.length === 0) return 0;
    return entries.reduce((total, entry) => total + (Number(entry.price) * entry.quantity_num), 0);
};

// ========== 新增：状态显示函数 ==========
const getStatusType = (invoice: Invoice) => {
    return invoice.active ? 'success' : 'danger';
};

const getStatusText = (invoice: Invoice) => {
    return invoice.active ? '正常' : '已作废';
};

onMounted(fetchInvoices);
</script>

<style scoped>
.invoice-management-view h1 {
    margin-bottom: 24px;
    font-size: 24px;
    font-weight: 600;
}

.invoice-detail-content {
    padding: 0 20px;
}

.invoice-detail-content .el-descriptions {
    margin-bottom: 20px;
}

.invoice-detail-content h4 {
    color: #606266;
    font-weight: 500;
}
</style>
