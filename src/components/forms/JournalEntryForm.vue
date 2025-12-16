<template>
  <!-- 凭证表单 -->
  <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="凭证日期" prop="post_date">
          <el-date-picker v-model="form.post_date" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="摘要" prop="description">
          <el-input v-model="form.description" placeholder="请输入凭证摘要" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <h3 style="margin: 30px 0 20px;">分录明细</h3>
  <div class="splits-table-wrapper">
    <table class="custom-table">
      <thead>
        <tr>
          <th>科目</th>
          <th>摘要</th>
          <th>借方金额</th>
          <th>贷方金额</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(split, index) in form.splits" :key="index">
          <td>
            <el-select v-model="split.account_guid" placeholder="选择科目" filterable style="width: 100%">
              <el-option v-for="acc in flatAccounts" :key="acc.guid"
                :label="`${acc.code ? acc.code + ' - ' : ''}${acc.name}`" :value="acc.guid" />
            </el-select>
          </td>
          <td><el-input v-model="split.memo" placeholder="分录摘要" /></td>
          <td>
            <el-input-number v-model="split.debit" :precision="2" :min="0" style="width: 100%"
              @change="() => handleAmountChange(index)" />
          </td>
          <td>
            <el-input-number v-model="split.credit" :precision="2" :min="0" style="width: 100%"
              @change="() => handleAmountChange(index)" />
          </td>
          <td>
            <el-button class="handle_button" size="small" type="danger" @click="removeSplit(index)">删除</el-button>
          </td>
        </tr>
      </tbody>
    </table>
    <el-button class="handle_button" style="margin-top: 15px;" @click="addSplit">添加分录</el-button>
  </div>

  <div class="summary-bar">
    <span>合计：</span>
    <span>借方: {{ totalDebit.toFixed(2) }}</span>
    <span>贷方: {{ totalCredit.toFixed(2) }}</span>
    <span :class="{ 'balance-error': !isBalanced }">
      差额: ({{ (totalDebit - totalCredit).toFixed(2) }})
    </span>
  </div>

  <div class="form-actions">
    <el-button class="reset_button" @click="handleReset">重置</el-button>
    <el-button class="reset_button" type="primary" :disabled="!isBalanced || form.splits.length < 2"
      @click="submitForm">保存凭证</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';
import type { TransactionCreateForm } from '@/types/transaction';
import type { SplitFormRow } from '@/types/split';
import type { Account } from '@/types/account';
import { flattenAccountTree } from '@/utils/account';


const props = defineProps<{
  accounts: Account[];
  loading: boolean;
}>();

const emit = defineEmits<{
  submit: [data: TransactionCreateForm];
}>();

const formRef = ref<FormInstance>();

const form = reactive<TransactionCreateForm>({
  post_date: new Date().toISOString().split('T')[0] ?? '',
  description: '',
  splits: [
    { account_guid: '', memo: '', debit: 0, credit: 0 },
    { account_guid: '', memo: '', debit: 0, credit: 0 },
  ],
});

const rules = {
  post_date: [{ required: true, message: '请选择凭证日期', trigger: 'change' }],
  description: [{ required: true, message: '请输入凭证摘要', trigger: 'blur' }],
};

const flatAccounts = computed(() => flattenAccountTree(props.accounts));

const totalDebit = computed(() =>
  form.splits.reduce((sum, split) => sum + (split.debit || 0), 0)
);

const totalCredit = computed(() =>
  form.splits.reduce((sum, split) => sum + (split.credit || 0), 0)
);

const isBalanced = computed(() => Math.abs(totalDebit.value - totalCredit.value) < 0.01);

const addSplit = () => {
  form.splits.push({ account_guid: '', memo: '', debit: 0, credit: 0 });
};

const removeSplit = (index: number) => {
  if (form.splits.length > 2) {
    form.splits.splice(index, 1);
  } else {
    ElMessage.warning('至少需要保留两条分录');
  }
};

const handleAmountChange = (index: number) => {
  const split = form.splits[index]!;
  if (split.debit && split.debit > 0) {
    split.credit = 0;
  } else if (split.credit && split.credit > 0) {
    split.debit = 0;
  }
};

const handleReset = () => {
  if (!formRef.value) return;
  formRef.value.resetFields();
  form.splits = [
    { account_guid: '', memo: '', debit: 0, credit: 0 },
    { account_guid: '', memo: '', debit: 0, credit: 0 },
  ];
};

const submitForm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (!isBalanced.value) {
        ElMessage.error('借贷不平衡，无法保存');
        return;
      }
      emit('submit', form);
    }
  });
};
</script>

<style scoped>
.journal-entry-view {
  width: 100%;
}

.splits-table-wrapper {
  margin-bottom: 20px;
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid rgba(74, 158, 255, 0.2);
  background: rgba(30, 41, 59, 0.4);
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.custom-table th,
.custom-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid rgba(74, 158, 255, 0.1);
}

.custom-table th {
  background: rgba(74, 158, 255, 0.1);
  color: #a1ffef;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.custom-table tbody tr:hover {
  background: rgba(74, 158, 255, 0.05);
}

.custom-table tbody tr:last-child td {
  border-bottom: none;
}

.summary-bar {
  text-align: right;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 30px;
  padding: 15px;
  background: rgba(74, 158, 255, 0.05);
  border: 1px solid rgba(74, 158, 255, 0.1);
  border-radius: 8px;
}

.summary-bar span {
  margin-left: 20px;
}

.balance-error {
  color: #f56c6c;
  text-shadow: 0 0 5px rgba(245, 108, 108, 0.5);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}
</style>
