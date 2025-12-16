// src/api/vendor.ts

import pureApiClient from '@/api/client'
import type { Vendor, VendorCreatePayload, VendorUpdatePayload } from '@/types'

const RESOURCE = '/payable'

/**
 * 供应商管理 API
 */
export const vendorApi = {
  // --- Vendors ---
  // 路径 /payable/vendors/
  /**
   * 获取所有供应商
   */
  getAll: () => pureApiClient.get<Vendor[]>(`${RESOURCE}/vendors/`),

  /**
   * 根据 GUID 获取单个供应商
   * @param guid 供应商 GUID
   */
  getById: (guid: string) => pureApiClient.get<Vendor>(`${RESOURCE}/vendors/${guid}`),

  /**
   * 创建新供应商
   * @param data 供应商创建数据
   */
  create: (data: VendorCreatePayload) => pureApiClient.post<Vendor>(`${RESOURCE}/vendors/`, data),

  /**
   * 更新供应商信息
   * @param guid 供应商 GUID
   * @param data 供应商更新数据
   */
  update: (guid: string, data: VendorUpdatePayload) =>
    pureApiClient.patch<Vendor>(`${RESOURCE}/vendors/${guid}`, data),

  /**
   * 删除供应商
   * @param guid 供应商 GUID
   */
  delete: (guid: string) => pureApiClient.delete(`${RESOURCE}/vendors/${guid}`),
}
