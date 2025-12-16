<template>
  <!-- 发票表单 -->
  <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" label-position="top">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="客户" prop="customer_guid">
          <el-select v-model="formData.customer_guid" placeholder="请选择客户" style="width: 100%" :disabled="isViewMode"
            filterable>
            <el-option v-for="customer in activeCustomers" :key="customer.guid" :label="customer.name"
              :value="customer.guid" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="发票号" prop="id">
          <el-input v-model="formData.id" :disabled="isViewMode" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="开票日期" prop="date_posted">
          <el-date-picker v-model="formData.date_posted" type="date" placeholder="选择日期" format="YYYY-MM-DD"
            value-format="YYYY-MM-DD" style="width: 100%" :disabled="isViewMode" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="到期日">
          <el-date-picker v-model="formData.date_due" type="date" placeholder="选择日期" format="YYYY-MM-DD"
            value-format="YYYY-MM-DD" style="width: 100%" :disabled="isViewMode" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="备注">
      <el-input v-model="formData.notes" type="textarea" :rows="2" :disabled="isViewMode" />
    </el-form-item>

    <el-divider content-position="left">发票明细</el-divider>

    <el-table :data="formData.entries" style="width: 100%" size="small">
      <el-table-column label="描述" min-width="200">
        <template #default="scope">
          <el-input v-if="!isViewMode" v-model="scope.row.description" placeholder="输入描述" size="small" />
          <span v-else>{{ scope.row.description || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="科目" min-width="150">
        <template #default="scope">
          <el-select v-if="!isViewMode" v-model="scope.row.account_guid" placeholder="请选择会计科目" size="small" filterable
            clearable>
            <el-option v-for="account in accounts" :key="account.guid" :label="`${account.code} - ${account.name}`"
              :value="account.guid" />
          </el-select>
          <span v-else>{{ getAccountDisplayName(scope.row.account_guid) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="数量" width="120" text-align="right">
        <template #default="scope">
          <el-input-number v-if="!isViewMode" v-model="scope.row.quantity_num" :min="1" size="small" :controls="false"
            style="width: 100%;" />
          <span v-else>{{ scope.row.quantity_num }}</span>
        </template>
      </el-table-column>

      <el-table-column label="单价" width="120" text-align="right">
        <template #default="scope">
          <el-input-number v-if="!isViewMode" v-model="scope.row.price" :min="0" :precision="2" size="small"
            :controls="false" style="width: 100%;" />
          <span v-else>{{ scope.row.price.toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="小计" width="120" text-align="right">
        <template #default="scope">
          {{ calculateRowTotal(scope.row).toFixed(2) }}
        </template>
      </el-table-column>

      <el-table-column v-if="!isViewMode" label="操作" width="80">
        <template #default="scope">
          <el-button type="danger" size="small" @click="removeEntry(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-divider />
    <div style="text-align: right; font-size: 16px; font-weight: bold;">
      总金额: ¥{{ totalAmount.toFixed(2) }}
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { storeToRefs } from 'pinia';
import { useAccountsReceivable } from '@/composables/useAccountsReceivable';
import { useAccountStore } from '@/stores/useAccountStore';
import type { Invoice, InvoiceCreate } from '@/types/invoice';
import type { EntryCreateForInvoiceForm } from '@/types/entry';

interface InvoiceFormData {
  id: string;
  owner_guid: string;
  customer_guid: string;
  date_posted: string;
  date_due: string;
  notes: string;
  entries: EntryCreateForInvoiceForm[];
}

const props = defineProps<{
  mode: 'create' | 'edit' | 'view';
  initialData?: Invoice;
}>();

const emit = defineEmits<{
  submit: [data: InvoiceCreate];
}>();

const { activeCustomers, loadCustomers } = useAccountsReceivable();
const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore);

const formRef = ref<FormInstance>();
const isViewMode = computed(() => props.mode === 'view');

const formData = ref<InvoiceFormData>({
  id: '',
  owner_guid: '',
  customer_guid: '',
  date_posted: '',
  date_due: '',
  notes: '',
  entries: [],
});

const rules: FormRules<InvoiceFormData> = {
  customer_guid: [{ required: true, message: '请选择客户', trigger: 'change' }],
  id: [{ required: true, message: '请输入发票号', trigger: 'blur' }],
  date_posted: [{ required: true, message: '请选择开票日期', trigger: 'change' }],
};

const totalAmount = computed(() => {
  return formData.value.entries.reduce((sum, entry) => sum + entry.price * entry.quantity_num, 0);
});

const getAccountDisplayName = (guid: string) => {
  if (!guid) return '未选择';
  const account = accountStore.findAccountByGuid(guid);
  return account ? `${account.code} - ${account.name}` : '科目未找到';
};

const calculateRowTotal = (row: EntryCreateForInvoiceForm) => {
  return (row.price || 0) * (row.quantity_num || 1);
};

// --- Actions ---
const addEntry = () => {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0] || '';

  formData.value.entries.push({
    date: dateString,
    description: '',
    action: '',
    account_guid: '',
    quantity_num: 1,
    quantity_denom: 1,
    price: 0,
    discounted: false,
  });
};

const removeEntry = (index: number) => {
  formData.value.entries.splice(index, 1);
};

const submit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid) {
      // 构造符合 InvoiceCreate 类型的数据
      const payload: InvoiceCreate = {
        id: formData.value.id,
        owner_guid: formData.value.owner_guid,
        customer_guid: formData.value.customer_guid,
        date_posted: formData.value.date_posted,
        date_due: formData.value.date_due,
        notes: formData.value.notes,
        entries: formData.value.entries.map(entry => ({
          ...entry,
          // invoice_guid 在后端创建时由路由参数或逻辑自动处理，这里先留空
          invoice_guid: '',
        })),
      };
      emit('submit', payload);
    }
  });
};

onMounted(async () => {
  // 并行加载客户和科目数据
  await Promise.all([
    loadCustomers(),
    accountStore.fetchAccounts(),
  ]);

  if (props.initialData) {
    // 编辑或查看模式：将 Invoice 类型转换为 InvoiceFormData
    formData.value = {
      id: props.initialData.id,
      owner_guid: props.initialData.owner_guid,
      customer_guid: props.initialData.customer_guid || '',
      date_posted: props.initialData.date_posted || '',
      date_due: props.initialData.date_due || '',
      notes: props.initialData.notes || '',
      entries: props.initialData.entries.map(({ invoice, account, ...entry }) => entry),
    };
  } else {
    // 创建模式：默认添加一个空行
    addEntry();
  }
});

// 暴露方法给父组件
defineExpose({
  submit,
  formData,
});
</script>
