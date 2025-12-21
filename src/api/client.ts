import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 定义 PureAxiosInstance 类型
export interface PureAxiosInstance {
  (config: AxiosRequestConfig): Promise<any>
  (url: string, config?: AxiosRequestConfig): Promise<any>
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  defaults: {
    headers: {
      common: Record<string, string>
    }
  }
  interceptors: {
    request: {
      use: (
        onFulfilled?: (
          config: AxiosRequestConfig,
        ) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
        onRejected?: (error: any) => any,
      ) => number
    }
    response: {
      use: <T = any>(
        onFulfilled?: (response: AxiosResponse<T>) => T | Promise<T>,
        onRejected?: (error: AxiosError) => any,
      ) => number
    }
  }
}

// 创建纯净的 axios 实例
const pureApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ? 'https://www.financemirror.icu',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}) as PureAxiosInstance

// 请求拦截器
pureApiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
pureApiClient.interceptors.response.use(
  <T>(response: AxiosResponse<T>): T => {
    return response.data
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response
      let message = '请求失败'

      const extractFastApiMessage = (data: any): string | null => {
        if (data?.detail) {
          if (typeof data.detail === 'string') {
            return data.detail
          }
          if (Array.isArray(data.detail) && data.detail.length > 0) {
            return data.detail[0]?.msg || '请求参数不合法'
          }
        }
        return null
      }

      switch (status) {
        case 400:
          message = extractFastApiMessage(data) || '请求参数错误'
          break
        case 401:
          const originalRequest = error.config
          if (!originalRequest?.url?.endsWith('/auth/login')) {
            message = '登录状态已过期，请重新登录'
            localStorage.removeItem('access_token')
            if (window.location.pathname !== '/login') {
              window.location.href = '/login'
            }
          } else {
            return Promise.reject(error)
          }
          break
        case 403:
          message = '权限不足'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 422:
          message = extractFastApiMessage(data) || '请求数据格式不正确'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = extractFastApiMessage(data) || `未知错误 (${status})`
      }

      if (typeof message === 'string') {
        ElMessage.error(message)
      }
    } else if (error.request) {
      ElMessage.error('网络错误，请检查您的连接')
    } else {
      ElMessage.error('请求配置错误')
    }

    return Promise.reject(error)
  },
)

export default pureApiClient
