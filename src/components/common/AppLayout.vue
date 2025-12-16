<template>
  <div class="app-layout">
    <!-- 主页面侧边栏 -->
    <aside class="sidebar">
      <div class="logo">
        <h1>财镜系统</h1>
      </div>
      <nav class="nav-menu">
        <router-link to="/dashboard" class="nav-item" active-class="active">
          <el-icon>
            <HomeFilled />
          </el-icon>
          <span>概况总览</span>
        </router-link>

        <div class="nav-group">
          <div class="nav-group-title">总账管理</div>
          <router-link to="/accounts" class="nav-item sub-item" active-class="active">
            <el-icon>
              <Document />
            </el-icon>
            <span>会计科目</span>
          </router-link>
          <router-link to="/journal" class="nav-item sub-item" active-class="active">
            <el-icon>
              <EditPen />
            </el-icon>
            <span>凭证录入</span>
          </router-link>
        </div>

        <div class="nav-group">
          <div class="nav-group-title">业务管理</div>
          <router-link to="/customers" class="nav-item sub-item" active-class="active">
            <el-icon>
              <User />
            </el-icon>
            <span>客户管理</span>
          </router-link>
          <router-link to="/invoices" class="nav-item sub-item" active-class="active">
            <el-icon>
              <Tickets />
            </el-icon>
            <span>销售发票</span>
          </router-link>
          <router-link to="/vendors" class="nav-item sub-item" active-class="active">
            <el-icon>
              <Van />
            </el-icon>
            <span>供应商管理</span>
          </router-link>
          <router-link to="/purchase-bills" class="nav-item sub-item" active-class="active">
            <el-icon>
              <List />
            </el-icon>
            <span>采购账单</span>
          </router-link>
          <router-link to="/employee-management" class="nav-item sub-item" active-class="active">
            <el-icon>
              <UserFilled />
            </el-icon>
            <span>员工档案</span>
          </router-link>
          <router-link to="/expense-management" class="nav-item sub-item" active-class="active">
            <el-icon>
              <Money />
            </el-icon>
            <span>费用报销</span>
          </router-link>
        </div>

        <div class="nav-group">
          <div class="nav-group-title">报表与结账</div>
          <router-link to="/reporting" class="nav-item sub-item" active-class="active">
            <el-icon>
              <DataAnalysis />
            </el-icon>
            <span>财务报表</span>
          </router-link>
          <router-link to="/period-closing" class="nav-item sub-item" active-class="active">
            <el-icon>
              <Finished />
            </el-icon>
            <span>期末结转</span>
          </router-link>
        </div>
      </nav>
    </aside>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 顶部栏 -->
      <header class="header">
        <div class="header-content">
          <span>欢迎，{{ authStore.user?.username || '用户' }}</span>
          <el-button class="logout-button" @click="handleLogout">退出登录</el-button>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="content-area">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'vue-router';
import {
  HomeFilled,
  Document,
  EditPen,
  User,
  UserFilled,
  Van,
  Money,
  Tickets,
  List,
  DataAnalysis,
  Finished
} from '@element-plus/icons-vue';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  color: #e2e8f0;
}

/* 侧边栏样式 */
.sidebar {
  width: 250px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(74, 158, 255, 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
}

.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(74, 158, 255, 0.05) 0%, transparent 70%);
  animation: rotate 30s linear infinite;
  z-index: -1;
}

.logo {
  padding: 30px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(74, 158, 255, 0.1);
  position: relative;
  z-index: 2;
}

.logo h1 {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #4a9eff 0%, #a1ffef 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}

.nav-menu {
  flex-grow: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.nav-group {
  margin: 20px 0;
}

.nav-group-title {
  padding: 0 20px;
  margin-bottom: 10px;
  font-size: 12px;
  color: rgba(226, 232, 240, 0.5);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  margin: 4px 12px;
  border-radius: 12px;
  color: rgba(226, 232, 240, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(74, 158, 255, 0.2), transparent);
  transition: left 0.5s;
}

.nav-item:hover::before {
  left: 100%;
}

.nav-item:hover {
  color: #a1ffef;
  background: rgba(74, 158, 255, 0.1);
  transform: translateX(5px);
}

.nav-item.active {
  color: #0f172a;
  background: linear-gradient(135deg, #4a9eff 0%, #a1ffef 100%);
  box-shadow: 0 4px 16px rgba(74, 158, 255, 0.3);
}

.nav-item .el-icon {
  margin-right: 12px;
  font-size: 18px;
}

.sub-item {
  padding-left: 40px;
  font-size: 14px;
}

/* 主内容区样式 */
.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(74, 158, 255, 0.2);
  padding: 0 20px;
  z-index: 5;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  font-size: 16px;
  font-weight: 500;
}

.logout-button {
  background: rgba(30, 41, 59, 0.8) !important;
  border: 1px solid rgba(74, 158, 255, 0.3) !important;
  color: #a1ffef !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
  height: auto !important;
  font-size: 14px !important;
}

.logout-button:hover {
  background: rgba(30, 41, 59, 0.9) !important;
  border-color: rgba(74, 158, 255, 0.5) !important;
  color: #4a9eff !important;
}

.content-area {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  position: relative;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
