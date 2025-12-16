// src/api/invoice.ts

import pureApiClient from '@/api/client'
import type { Invoice, InvoiceCreate, InvoiceUpdate } from '@/types/invoice'

const RESOURCE = '/receivable/sales-invoices'

/**
 * 销售发票 API
 */
export const invoiceApi = {
  /**
   * 获取发票列表
   * @param params 分页参数
   */
  getAll: (params?: { skip?: number; limit?: number }) =>
    pureApiClient.get<Invoice[]>(RESOURCE, { params }),

  /**
   * 根据 GUID 获取单个发票
   * @param guid 发票 GUID
   */
  getById: (guid: string) => pureApiClient.get<Invoice>(`${RESOURCE}/${guid}`),

  /**
   * 创建新发票
   * @param data 发票创建数据
   */
  create: (data: InvoiceCreate) => pureApiClient.post<Invoice>(RESOURCE, data),

  /**
   * 更新发票
   * @param guid 发票 GUID
   * @param data 发票更新数据
   */
  update: (guid: string, data: InvoiceUpdate) =>
    pureApiClient.patch<Invoice>(`${RESOURCE}/${guid}`, data),

  /**
   * 删除发票
   * @param guid 发票 GUID
   */
  delete: (guid: string) => pureApiClient.delete(`${RESOURCE}/${guid}`),

  /**
   * 发送发票
   * @param guid 发票 GUID
   */
  send: (guid: string) => pureApiClient.post<void>(`${RESOURCE}/${guid}/send`),

  /**
   * 作废发票
   * @param guid 发票 GUID
   */
  void: (guid: string) => pureApiClient.post<void>(`${RESOURCE}/${guid}/void`),

  /**
   * 反作废发票
   * @param guid 发票 GUID
   */
  unvoid: (guid: string) => pureApiClient.post<Invoice>(`${RESOURCE}/${guid}/unvoid`),
}
