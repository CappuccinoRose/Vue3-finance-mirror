// src/api/client.ts
import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios'
import { ElMessage } from 'element-plus'

// --- 创建 axios 实例 ---
// 使用环境变量来动态设置 baseURL，实现开发和生产环境的无缝切换
const apiClient: AxiosInstance = axios.create({
  // 开发环境使用相对路径，由 Vite 代理转发；生产环境直接请求线上后端
  baseURL: import.meta.env.VITE_API_BASE_URL ? 'https://www.financemirror.icu/api/v1' : '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// --- 请求拦截器 ---
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// --- 响应拦截器 ---
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么：直接返回 data，简化调用
    return response.data
  },
  (error: AxiosError) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么：统一处理错误提示

    // 定义一个辅助函数来从 FastAPI 的错误响应中提取信息
    const extractFastApiMessage = (data: any): string => {
      if (data?.detail) {
        if (typeof data.detail === 'string') return data.detail
        if (Array.isArray(data.detail) && data.detail.length > 0) {
          // 处理 Pydantic 验证错误
          const item = data.detail[0]
          if (item?.msg) return item.msg
          if (item?.loc) return `字段 ${item.loc.join('.')} 验证失败`
        }
      }
      // 处理自定义业务异常
      if (data?.message) return data.message
      return '未知错误'
    }

    let message = '请求失败'

    if (error.response) {
      // 请求已发出，服务器响应状态码不在 2xx 范围
      const { status, data } = error.response

      switch (status) {
        case 400:
        case 422:
          message = extractFastApiMessage(data)
          break
        case 401:
          // 排除登录接口本身的 401 错误
          if (!error.config?.url?.endsWith('/auth/login')) {
            message = '登录状态已过期，请重新登录'
            localStorage.removeItem('access_token')
            // 避免在登录页无限刷新
            if (window.location.pathname !== '/login') {
              window.location.href = '/login'
            }
          } else {
            // 如果是登录接口返回 401，直接返回错误，让登录页处理
            return Promise.reject(error)
          }
          break
        case 403:
          message = '权限不足，拒绝访问'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器内部错误，请稍后再试'
          break
        default:
          message = extractFastApiMessage(data) || `请求失败 (${status})`
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      message = '网络连接异常，请检查网络'
    } else {
      // 在设置请求时触发了错误
      message = '请求发送失败'
    }

    ElMessage.error(message)
    return Promise.reject(error)
  },
)

export default apiClient
