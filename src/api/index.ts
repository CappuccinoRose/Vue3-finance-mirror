import axios from 'axios'
import { ElMessage } from 'element-plus'
import pureApiClient from './client' // 导入pureApiClient

// 对应后端配置的 CORS 跨域请求头
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：自动添加 Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      let message = '请求失败'

      switch (status) {
        case 400:
          message = data.detail || '请求参数错误'
          break
        case 401:
          message = '认证失败，请重新登录'
          localStorage.removeItem('access_token')
          window.location.href = '/login'
          break
        case 403:
          message = '权限不足'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 409:
          message = data.detail || '数据冲突'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = data.detail || `未知错误 (${status})`
      }

      ElMessage.error(message)
    } else if (error.request) {
      ElMessage.error('网络错误，请检查您的连接')
    } else {
      ElMessage.error('请求配置错误')
    }

    return Promise.reject(error)
  },
)

// 避免循环导出
export default apiClient
export { pureApiClient } // 导出pureApiClient供其他模块使用

// --- 导出所有 api 模块 ---
export { authApi } from './auth'
export * as accountApi from './account'
export * as transactionApi from './transaction'
export { slotApi } from './slot'
export { employeeApi } from './employee'
export { customerApi } from './customer'
export { invoiceApi } from './invoice'
export { vendorApi } from './vendor'
export { entryApi } from './entry'
export { splitApi } from './split'
export * as reportingApi from './reporting'
export * as periodClosingApi from './period_closing'
export * as documentApi from './document_posting'
export * as purchaseBillApi from './purchase_bill'
