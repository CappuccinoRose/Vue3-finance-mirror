<template>
  <div class="dashboard-view">
    <!-- 页面头部 -->
    <el-card class="dashboard-header-card">
      <template #header>
        <div class="page-header">
          <div class="header-title">财务仪表盘</div>
          <el-select v-model="selectedPeriod" @change="onPeriodChange" placeholder="选择月份" style="width: 150px;">
            <el-option v-for="period in availablePeriods" :key="period" :label="period" :value="period" />
          </el-select>
        </div>
      </template>
    </el-card>

    <!-- 核心财务指标卡片 -->
    <MetricCard :metrics="dashboardMetricsArray" :loading="isLoading" />

    <!-- 图表区域 -->
    <el-row :gutter="24" class="charts-section">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="header-icon">📈</span>
              <span class="header-title">现金流趋势</span>
            </div>
          </template>
          <ChartContainer title="现金流趋势曲线图" :chart-data="processedCashFlowData" chart-type="line" :loading="isLoading"
            @refresh="() => fetchCashFlowData(selectedPeriod)" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="header-icon">📑</span>
              <span class="header-title">收支结构</span>
            </div>
          </template>
          <ChartContainer title="收支结构图" :chart-data="processedIncomeExpenseData" chart-type="pie" :loading="isLoading"
            @refresh="() => fetchIncomeExpenseData(selectedPeriod)" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 应收应付概况 -->
    <el-row :gutter="24" class="ar-ap-section">
      <el-col :span="12">
        <el-card class="ar-ap-card">
          <template #header>
            <div class="card-header">
              <span class="header-icon">💰</span>
              <span class="header-title">应收账款概况</span>
            </div>
          </template>
          <DataTable :columns="arColumns" :data="arApData.receivables" :loading="isLoading" :show-pagination="false" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="ar-ap-card">
          <template #header>
            <div class="card-header">
              <span class="header-icon">💳</span>
              <span class="header-title">应付账款概况</span>
            </div>
          </template>
          <DataTable :columns="apColumns" :data="arApData.payables" :loading="isLoading" :show-pagination="false" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 快速操作区域 -->
    <QuickActions @navigate="handleNavigate" />

    <!-- 自定义报表抽屉 -->
    <CustomReportDrawer v-model="isCustomReportDrawerVisible" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useReporting } from '@/composables/useReporting'
import MetricCard from '@/components/common/MetricCard.vue'
import ChartContainer from '@/components/common/ChartContainer.vue'
import DataTable from '@/components/common/DataTable.vue'
import QuickActions from '@/components/common/QuickActions.vue'
import CustomReportDrawer from '@/components/reports/CustomReportDrawer.vue'

// --- 从 composable 获取数据和函数 ---
const {
  dashboardMetrics,
  cashFlowData,
  arApData,
  incomeExpenseData,
  isLoading,
  selectedPeriod,
  availablePeriods,
  fetchAvailablePeriods,
  fetchAllDashboardData,
  fetchCashFlowData,
  fetchIncomeExpenseData,
  onPeriodChange,
  formatCurrency
} = useReporting()

// --- 状态 ---
const isCustomReportDrawerVisible = ref(false);

// --- 计算属性 ---
const dashboardMetricsArray = computed(() => {
  const metrics = dashboardMetrics.value
  return [
    { key: 'totalAssets', title: '总资产', value: Number(metrics.total_assets) || 0, change: '+12.5%', trend: 'positive' as const, trendIcon: '↑' },
    { key: 'currentProfit', title: '本期利润', value: Number(metrics.current_profit) || 0, change: '+8.3%', trend: 'positive' as const, trendIcon: '↑' },
    { key: 'cashBalance', title: '现金余额', value: Number(metrics.cash_balance) || 0, change: '-2.1%', trend: 'negative' as const, trendIcon: '↓' },
    { key: 'totalRevenue', title: '营业收入', value: Number(metrics.total_revenue) || 0, change: '+15.7%', trend: 'positive' as const, trendIcon: '↑' }
  ]
})

const processedCashFlowData = computed(() => {
  if (!cashFlowData.value || !cashFlowData.value.periods || cashFlowData.value.periods.length === 0) {
    return { isEmpty: true, message: '当前查询周期内无现金流数据' };
  }
  const hasNonZeroInflow = cashFlowData.value.inflows.some(val => parseFloat(String(val)) > 0);
  const hasNonZeroOutflow = cashFlowData.value.outflows.some(val => parseFloat(String(val)) > 0);
  if (!hasNonZeroInflow && !hasNonZeroOutflow) {
    return { isEmpty: true, message: '当前查询周期内无现金流活动' };
  }
  return cashFlowData.value;
});

const processedIncomeExpenseData = computed(() => {
  if (!incomeExpenseData.value || !incomeExpenseData.value.series || incomeExpenseData.value.series.length === 0) {
    return { isEmpty: true, message: '当前查询周期内无收支数据' };
  }
  return incomeExpenseData.value;
});

const arColumns = [
  { prop: 'customerName', label: '客户名称' },
  { prop: 'amount', label: '金额', formatter: (row: any, column: any, cellValue: number) => formatCurrency(cellValue) },
  { prop: 'dueDate', label: '到期日' },
]

const apColumns = [
  { prop: 'vendorName', label: '供应商名称' },
  { prop: 'amount', label: '金额', formatter: (row: any, column: any, cellValue: number) => formatCurrency(cellValue) },
  { prop: 'dueDate', label: '到期日' },
]

// --- 方法 ---
const router = useRouter()

const handleNavigate = (route: string) => {
  switch (route) {
    case '/reports':
      isCustomReportDrawerVisible.value = true;
      break;
    case '/journal':
      router.push({ name: 'JournalEntry' })
      break
    case '/customers':
      router.push({ name: 'CustomerManagement' })
      break
    case '/vendors':
      router.push({ name: 'VendorManagement' })
      break
    case '/expenses':
      router.push({ name: 'ExpenseManagement' })
      break
    case '/accounts':
      router.push({ name: 'ChartOfAccounts' })
      break
    default:
      ElMessage.info(`功能 "${route}" 正在开发中`)
      break
  }
}

// --- 生命周期钩子 ---
onMounted(async () => {
  try {
    // 1. 先获取所有可用的时间
    await fetchAvailablePeriods()
    // 2. 再根据当前选中的时间加载数据
    await fetchAllDashboardData(selectedPeriod.value)
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
})
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  position: relative;
}

.dashboard-header-card {
  height: 90px;
  margin-bottom: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  color: #f1f5f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-title {
  font-size: 20px;
  font-weight: bold;
}

.charts-section {
  margin-bottom: 10px;
}

.ar-ap-section {
  margin-bottom: 10px;
}

.ar-ap-card {
  display: flex;
  flex-direction: column;
  height: 290px;
}

.ar-ap-card :deep(.el-card__body) {
  padding: 0px;
  flex: 1;
  overflow: auto;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #e2e8f0;
  font-weight: 600;
  font-size: 16px;
  position: relative;
  z-index: 2;
}

.header-icon {
  font-size: 20px;
  filter: drop-shadow(0 0 10px rgba(74, 158, 255, 0.5));
}

.header-title {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}
</style>
