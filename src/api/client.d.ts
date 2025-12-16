// src/api/client.d.ts
import { AxiosRequestConfig } from 'axios'

// 定义一个纯净的接口，这个接口不受任何全局 axios 声明的影响
export interface PureAxiosInstance {
  request<T = any>(config: AxiosRequestConfig): Promise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>

  defaults: {
    headers: {
      common: {
        [key: string]: string | undefined
      }
    }
  }
  interceptors: any
}
