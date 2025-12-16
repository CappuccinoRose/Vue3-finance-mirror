// src/api/slot.ts

import pureApiClient from './client'
import type { Slot, SlotCreate } from '@/types/slot'

/**
 * 系统初始化与状态 API
 */
export const slotApi = {
  /**
   * 初始化系统
   * @param slots 初始化所需的槽位数据
   */
  initializeSystem: (slots: SlotCreate[]) => pureApiClient.post<void>('/system/init', slots),

  /**
   * 获取系统初始化状态
   */
  getSystemStatus: () => pureApiClient.get<{ initialized: boolean }>('/system/status'),
}
