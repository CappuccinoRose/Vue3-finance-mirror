import pureApiClient from '@/api/client'
import type {
  PurchaseBill,
  PurchaseBillCreate,
  PurchaseBillUpdate,
  PurchaseBillSummary,
} from '@/types/purchase_bill'

export const purchaseBillApi = {
  // 获取采购账单列表
  async getPurchaseBills(params?: {
    status?: string
    skip?: number
    limit?: number
  }): Promise<PurchaseBillSummary[]> {
    return pureApiClient.get<PurchaseBillSummary[]>('/payable/purchase-bills', { params })
  },

  // 获取单个采购账单详情
  async getPurchaseBill(guid: string): Promise<PurchaseBill> {
    return pureApiClient.get<PurchaseBill>(`/payable/purchase-bills/${guid}`)
  },

  // 创建采购账单
  async createPurchaseBill(data: PurchaseBillCreate): Promise<PurchaseBill> {
    return pureApiClient.post<PurchaseBill>('/payable/purchase-bills', data)
  },

  // 更新采购账单
  async updatePurchaseBill(guid: string, data: PurchaseBillUpdate): Promise<PurchaseBill> {
    return pureApiClient.put<PurchaseBill>(`/payable/purchase-bills/${guid}`, data)
  },

  // 删除采购账单
  async deletePurchaseBill(guid: string): Promise<void> {
    return pureApiClient.delete(`/payable/purchase-bills/${guid}`)
  },

  // 过账采购账单
  async postPurchaseBill(guid: string): Promise<PurchaseBill> {
    return pureApiClient.patch<PurchaseBill>(`/payable/purchase-bills/${guid}/post`)
  },

  // 取消采购账单
  async cancelPurchaseBill(guid: string): Promise<PurchaseBill> {
    return pureApiClient.patch<PurchaseBill>(`/payable/purchase-bills/${guid}/cancel`)
  },
}
