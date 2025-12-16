// src/api/customer.ts

import pureApiClient from '@/api/client'
import type { Customer, CustomerCreate, CustomerUpdate } from '@/types/customer'

/**
 * 客户管理 API
 */
export const customerApi = {
  /**
   * 获取客户列表
   * @param params 分页参数
   */
  getAll: (params: { skip?: number; limit?: number } = {}): Promise<Customer[]> => {
    return pureApiClient.get('/receivable/customers/', { params })
  },

  /**
   * 根据 GUID 获取单个客户
   * @param guid 客户 GUID
   */
  getByGuid: (guid: string): Promise<Customer> => {
    return pureApiClient.get(`/receivable/customers/${guid}/`)
  },

  /**
   * 创建新客户
   * @param data 客户创建数据
   */
  create: (data: CustomerCreate): Promise<Customer> => {
    return pureApiClient.post('/receivable/customers/', data)
  },

  /**
   * 更新客户信息
   * @param guid 客户 GUID
   * @param data 客户更新数据
   */
  update: (guid: string, data: CustomerUpdate): Promise<Customer> => {
    return pureApiClient.put(`/receivable/customers/${guid}/`, data)
  },

  /**
   * 删除客户
   * @param guid 客户 GUID
   */
  delete: (guid: string): Promise<void> => {
    return pureApiClient.delete(`/receivable/customers/${guid}/`)
  },
}
