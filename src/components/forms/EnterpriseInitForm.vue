<template>
  <!-- 企业初始化表单 -->
  <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" @submit.prevent="handleSubmit">
    <el-form-item label="企业名称" prop="enterpriseName">
      <el-input v-model="form.enterpriseName" />
    </el-form-item>
    <el-form-item label="企业规模" prop="enterpriseScale">
      <el-select v-model="form.enterpriseScale" placeholder="请选择">
        <el-option label="微型" value="MICRO" />
        <el-option label="小型" value="SMALL" />
        <el-option label="中型" value="MEDIUM" />
        <el-option label="大型" value="LARGE" />
      </el-select>
    </el-form-item>
    <el-form-item label="注册资金" prop="registeredCapital">
      <el-input-number v-model="form.registeredCapital" :precision="2" :min="0.01" style="width: 100%" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit" :loading="systemConfigStore.isLoading">
        完成初始化
      </el-button>
    </el-form-item>
  </el-form>
</template>


<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { useSystemConfigStore } from '@/stores/useSystemConfigStore';
import type { SlotType } from '@/types/slot';

const emit = defineEmits<{
  success: [];
}>();

const systemConfigStore = useSystemConfigStore();
const formRef = ref<FormInstance>();

const form = reactive({
  enterpriseName: '',
  enterpriseScale: '',
  registeredCapital: 0,
});

const rules = reactive<FormRules>({
  enterpriseName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  enterpriseScale: [{ required: true, message: '请选择企业规模', trigger: 'change' }],
  registeredCapital: [{ required: true, message: '请输入注册资金', trigger: 'blur' }],
});

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const slots = [
        {
          name: 'enterpriseName',
          slot_type: 'string' as SlotType,
          string_val: form.enterpriseName,
          obj_guid: ''
        },
        {
          name: 'enterpriseScale',
          slot_type: 'string' as SlotType,
          string_val: form.enterpriseScale,
          obj_guid: ''
        },
        {
          name: 'registeredCapital',
          slot_type: 'numeric' as SlotType,
          numeric_val: form.registeredCapital,
          obj_guid: ''
        },
      ];

      try {
        await systemConfigStore.initialize(slots);
        ElMessage.success('系统初始化成功！');
        emit('success');
      } catch (error: any) {
        let errorMessage = '初始化失败，未知错误。';
        try {
          const parsedDetail = JSON.parse(error.message);
          if (Array.isArray(parsedDetail)) {
            // 如果是数组，提取每一条错误信息并用换行符连接
            errorMessage = parsedDetail.map(err => err.msg || JSON.stringify(err)).join('\n');
          } else if (typeof parsedDetail === 'object' && parsedDetail !== null) {
            // 如果是单个对象，提取它的 msg
            errorMessage = parsedDetail.msg || JSON.stringify(parsedDetail);
          } else {
            // 如果解析出来不是对象或数组，就用原始信息
            errorMessage = error.message;
          }
        } catch (e) {
          // 如果 JSON.parse 失败，说明 error.message 可能就是个普通字符串
          errorMessage = error.message;
        }

        ElMessage.error(errorMessage);
      }


    }
  });
};
</script>


<style scoped>
.el-button {
  display: inline-block;
  margin: 20px 0px 0px -22%;
  width: 100%;
  height: 50px;
}
</style>
