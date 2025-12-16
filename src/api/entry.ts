import pureApiClient from './client'
import type { Entry, EntryCreate, EntryUpdate } from '@/types'

const RESOURCE = '/entries'

/**
 * 分录管理 API
 */
export const entryApi = {
  /**
   * 获取所有分录
   */
  getAll: () => pureApiClient.get<Entry[]>(RESOURCE),

  /**
   * 根据 GUID 获取单个分录
   * @param guid 分录 GUID
   */
  getById: (guid: string) => pureApiClient.get<Entry>(`${RESOURCE}/${guid}`),

  /**
   * 创建新分录
   * @param data 分录创建数据
   */
  create: (data: EntryCreate) => pureApiClient.post<Entry>(RESOURCE, data),

  /**
   * 更新分录
   * @param guid 分录 GUID
   * @param data 分录更新数据
   */
  update: (guid: string, data: EntryUpdate) =>
    pureApiClient.patch<Entry>(`${RESOURCE}/${guid}`, data),

  /**
   * 删除分录
   * @param guid 分录 GUID
   */
  delete: (guid: string) => pureApiClient.delete(`${RESOURCE}/${guid}`),

  /**
   * 根据发票 GUID 获取关联分录
   * @param invoiceGuid 发票 GUID
   */
  getByInvoiceGuid: (invoiceGuid: string) =>
    pureApiClient.get<Entry[]>(`${RESOURCE}?invoice_guid=${invoiceGuid}`),
}
