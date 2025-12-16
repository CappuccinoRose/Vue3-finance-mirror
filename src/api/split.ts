// src/api/split.ts

import pureApiClient from './client'
import type { Split, SplitCreate, SplitUpdate } from '@/types'

const RESOURCE = '/splits'

/**
 * 分录行管理 API
 */
export const splitApi = {
  /**
   * 获取所有分录行
   */
  getAll: () => pureApiClient.get<Split[]>(RESOURCE),

  /**
   * 根据 GUID 获取单个分录行
   * @param guid 分录行 GUID
   */
  getById: (guid: string) => pureApiClient.get<Split>(`${RESOURCE}/${guid}`),

  /**
   * 创建新分录行
   * @param data 分录行创建数据
   */
  create: (data: SplitCreate) => pureApiClient.post<Split>(RESOURCE, data),

  /**
   * 更新分录行
   * @param guid 分录行 GUID
   * @param data 分录行更新数据
   */
  update: (guid: string, data: SplitUpdate) =>
    pureApiClient.patch<Split>(`${RESOURCE}/${guid}`, data),

  /**
   * 删除分录行
   * @param guid 分录行 GUID
   */
  delete: (guid: string) => pureApiClient.delete(`${RESOURCE}/${guid}`),

  /**
   * 根据交易 GUID 获取关联的分录行
   * @param txnGuid 交易 GUID
   */
  getByTransactionGuid: (txnGuid: string) =>
    pureApiClient.get<Split[]>(`${RESOURCE}?txn_guid=${txnGuid}`),
}
