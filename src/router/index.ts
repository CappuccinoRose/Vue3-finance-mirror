import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useSystemConfigStore } from '@/stores/useSystemConfigStore'
import AppLayout from '@/components/common/AppLayout.vue'

// --- 游客路由 (不需要登录) ---
const guestRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/password-reset',
    name: 'PasswordReset',
    component: () => import('@/views/PasswordResetView.vue'),
    meta: { requiresGuest: true },
  },
]

// --- 主应用路由 (需要登录，并嵌套在 AppLayout 中) ---
const mainAppRoutes = {
  path: '/',
  component: AppLayout,
  meta: { requiresAuth: true },
  children: [
    {
      path: '', // 默认子路由
      redirect: '/dashboard',
    },
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
    },
    {
      path: 'accounts',
      name: 'ChartOfAccounts',
      component: () => import('@/views/ChartOfAccountsView.vue'),
    },
    {
      path: 'journal',
      name: 'JournalEntry',
      component: () => import('@/views/JournalEntryView.vue'),
    },
    {
      path: 'customers',
      name: 'CustomerManagement',
      component: () => import('@/views/CustomerManagementView.vue'),
    },
    {
      path: 'vendors',
      name: 'VendorManagement',
      component: () => import('@/views/VendorManagementView.vue'),
    },
    {
      path: 'employee-management',
      name: 'EmployeeManagement',
      component: () => import('@/views/EmployeeManagementView.vue'),
    },
    {
      path: 'expense-management',
      name: 'ExpenseManagement',
      component: () => import('@/views/ExpenseManagementView.vue'),
    },
    {
      path: 'invoices',
      name: 'InvoiceManagement',
      component: () => import('@/views/InvoiceManagementView.vue'),
    },
    {
      path: 'purchase-bills',
      name: 'PurchaseBillManagement',
      component: () => import('@/views/PurchaseBillManagementView.vue'),
    },
    {
      path: 'reporting',
      name: 'Reporting',
      component: () => import('@/views/ReportingView.vue'),
    },
    {
      path: 'period-closing',
      name: 'PeriodClosing',
      component: () => import('@/views/PeriodClosingView.vue'),
    },
  ],
}

// --- 特殊路由 (企业初始化) ---
const specialRoutes = [
  {
    path: '/init',
    name: 'EnterpriseInit',
    component: () => import('@/views/EnterpriseInitView.vue'),
    meta: { requiresAuth: true, bypassLayout: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...guestRoutes, mainAppRoutes, ...specialRoutes],
})

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  console.log('--- 路由守卫开始 ---')
  console.log('目标路由:', to.path, to.name)

  const authStore = useAuthStore()
  const systemConfigStore = useSystemConfigStore()

  // --- 步骤 1: 优先尝试恢复认证状态 ---
  if (authStore.token && !authStore.user) {
    console.log('检测到 Token，尝试获取用户信息...')
    try {
      await authStore.fetchCurrentUser()
      console.log('用户信息获取成功:', authStore.user)
    } catch (error) {
      console.error('Token 无效或获取用户信息失败:', error)
      authStore.logout()
      if (to.name !== 'Login') {
        console.log('重定向到登录页 (因为 Token 无效)')
        return next({ name: 'Login' })
      }
    }
  }

  // --- 步骤 2: 处理游客页面的访问权限 ---
  if (to.meta.requiresGuest && authStore.isLoggedIn) {
    console.log('已登录用户访问游客页面，重定向到主应用')
    return next({ name: 'Dashboard' })
  }

  // --- 步骤 3: 处理需要登录的页面 ---
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    console.log('页面需要登录但用户未登录，重定向到登录页')
    return next({ name: 'Login' })
  }

  // --- 步骤 4: 处理需要系统初始化的页面 ---
  if (authStore.isLoggedIn && systemConfigStore.isInitialized === null) {
    console.log('系统状态未知，正在检查...')
    await systemConfigStore.checkStatus()
    console.log('系统状态检查完成，结果:', systemConfigStore.isInitialized)
  }

  // 如果已登录且系统未初始化，且目标不是初始化页面，则跳转到初始化页面
  if (authStore.isLoggedIn && !systemConfigStore.isInitialized && to.name !== 'EnterpriseInit') {
    console.log('系统未初始化，重定向到初始化页')
    return next({ name: 'EnterpriseInit' })
  }

  // 如果已登录且系统已初始化，但目标却是初始化页面，则跳转到仪表盘
  if (authStore.isLoggedIn && systemConfigStore.isInitialized && to.name === 'EnterpriseInit') {
    console.log('系统已初始化，从初始化页重定向到仪表盘')
    return next({ name: 'Dashboard' })
  }

  console.log('所有检查通过，放行！')
  next()
})

export default router
