// src/api/period_closing.ts

import type { PeriodClosingCreate, Transaction } from '@/types/period_closing'
import type { Account } from '@/types/account'
import apiClient from '@/api/client'

/**
 * 期末结转 API
 */
export const periodClosingApi = {
  /**
   * 获取结转历史记录列表
   * @param params 分页参数
   */
  getMulti: async (params: { skip?: number; limit?: number } = {}) => {
    return apiClient.get<Transaction[]>('/period-closings/', { params })
  },

  /**
   * 获取单个结转任务详情
   * @param guid 结转任务 GUID
   */
  get: async (guid: string) => {
    return apiClient.get<Transaction>(`/period-closings/${guid}`)
  },

  /**
   * 创建期末结转
   * @param payload 结转任务创建数据
   */
  create: async (payload: PeriodClosingCreate) => {
    return apiClient.post<Transaction>('/period-closings/', payload)
  },

  /**
   * 根据 GUID 获取结转交易详情
   * @param guid 交易 GUID
   */
  getTransaction: async (guid: string) => {
    return apiClient.get<Transaction>(`/transactions/${guid}`)
  },

  /**
   * 根据 GUID 获取单个科目信息
   * @param guid 科目 GUID
   */
  getAccountByGuid: async (guid: string) => {
    return apiClient.get<Account>(`/accounts/${guid}`)
  },
}
