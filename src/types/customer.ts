// src/types/customer.ts

/**
 * 客户实体模型
 */
export interface Customer {
  guid: string
  name: string
  id: string | null
  notes: string | null
  active: boolean
}

/**
 * 创建客户的请求模型
 */
export interface CustomerCreate {
  name: string
  id?: string | null
  notes?: string | null
  active?: boolean
}

/**
 * 更新客户的请求模型
 * 所有字段均为可选，用于部分更新
 */
export interface CustomerUpdate {
  name?: string | null
  id?: string | null
  notes?: string | null
  active?: boolean | null
}
