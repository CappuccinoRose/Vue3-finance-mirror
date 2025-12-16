// src/types/slot.ts

// 槽位值类型的联合类型
export type SlotType = 'string' | 'numeric'

// 创建单个槽位的请求体
export interface SlotCreate {
  obj_guid?: string
  name: string
  slot_type: SlotType
  string_val?: string
  numeric_val?: number
}

// 从后端获取的槽位数据
export interface Slot {
  obj_guid: string
  name: string
  slot_type: SlotType
  string_val: string | null
  numeric_val: number | null
}
